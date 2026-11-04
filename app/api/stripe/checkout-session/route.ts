import { type NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { CHECKOUT_SOURCE, getStripe } from "@/lib/stripe/server"
import { absoluteImageUrl, CheckoutValidationError, isMarket, MARKETS, validateRequestedItems } from "@/lib/checkout/catalog"
import { BUNDLE_OFFER, quoteBundle } from "@/lib/checkout/offers"
import { getClientIpFromHeaders, getUserAgentFromHeaders } from "@/lib/meta/cookies"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const
const clip = (v: unknown, n = 480) => (typeof v === "string" && v ? v.slice(0, n) : undefined)

/**
 * Creates a Stripe Embedded Checkout session.
 * The browser sends product ids, quantities and the displayed unit price; the server
 * checks the price against the catalog and builds every amount itself.
 */
// Best-effort per-instance limit: stops bursts of sessions from the same IP within seconds.
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000
const hits = new Map<string, number[]>()

function isRateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key)
  }
  return recent.length > RATE_LIMIT
}

export async function POST(request: NextRequest) {
  const ip = getClientIpFromHeaders(request.headers) || "unknown"
  if (isRateLimited(ip)) {
    console.warn("[Stripe] checkout rate limited:", { ip })
    return NextResponse.json({ error: "Too many attempts. Please wait a minute and try again." }, { status: 429 })
  }

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const market = body?.market
  if (!isMarket(market)) return NextResponse.json({ error: "Invalid market" }, { status: 400 })

  let lines
  try {
    lines = validateRequestedItems(market, body?.items)
  } catch (err) {
    if (err instanceof CheckoutValidationError) {
      console.warn("[Stripe] checkout rejected:", { market, reason: err.message })
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    throw err
  }

  const { currency, shippingCountries, successPath, locale } = MARKETS[market]

  // Early Black Friday bundles: the discount is applied HERE, on the server, from the
  // validated base price. The browser always sends the normal price (£14.50).
  const isPanel = (id: string) => (BUNDLE_OFFER.productIds as readonly string[]).includes(id)
  const panelQty = market === "UK" ? lines.filter((l) => isPanel(l.id)).reduce((n, l) => n + l.quantity, 0) : 0
  const panelBase = lines.find((l) => isPanel(l.id))?.unitCents ?? 0
  const bundle = panelQty > 0 ? quoteBundle(panelBase, panelQty) : null
  if (bundle && bundle.percent > 0) {
    lines = lines.map((l) => (isPanel(l.id) ? { ...l, unitCents: bundle.unitCents } : l))
    // A fixed pack price (e.g. 12 for £101.90) is not always divisible per panel: put the leftover
    // pence on one panel, split into its own line, so Stripe charges exactly bundle.totalCents.
    const remainder = bundle.totalCents - bundle.unitCents * panelQty
    const idx = lines.findIndex((l) => isPanel(l.id))
    if (remainder > 0 && idx >= 0) {
      const line = lines[idx]
      const extra = { ...line, quantity: 1, unitCents: line.unitCents + remainder }
      lines = line.quantity > 1
        ? [...lines.slice(0, idx), { ...line, quantity: line.quantity - 1 }, extra, ...lines.slice(idx + 1)]
        : [...lines.slice(0, idx), extra, ...lines.slice(idx + 1)]
    }
  }

  let utms: Record<string, string> = {}
  try {
    utms = JSON.parse(request.cookies.get("_utm_data")?.value || "{}")
  } catch {}

  // Metadata is read by the webhook to send an accurate Meta Purchase (values ≤ 500 chars)
  const metadata: Record<string, string> = {
    source: CHECKOUT_SOURCE,
    market,
    items: JSON.stringify(lines.map((l) => [l.id, l.quantity, l.unitCents])).slice(0, 500),
  }
  if (bundle && bundle.percent > 0) metadata.bundle_percent = String(bundle.percent)
  if (bundle?.gift) metadata.free_gift = BUNDLE_OFFER.giftId
  const extra: Record<string, string | undefined> = {
    fbc: clip(request.cookies.get("_fbc")?.value),
    fbp: clip(request.cookies.get("_fbp")?.value),
    client_ip: clip(getClientIpFromHeaders(request.headers)),
    client_ua: clip(getUserAgentFromHeaders(request.headers)),
    event_source_url: clip(body?.pageUrl),
  }
  for (const k of UTM_KEYS) extra[k] = clip(utms[k])
  for (const [k, v] of Object.entries(extra)) if (v) metadata[k] = v

  const origin = request.nextUrl.origin

  // Products are synced to Stripe with the same id (scripts/sync-stripe-products.ts).
  // If one is missing there, fall back to inline product_data so checkout never breaks.
  const buildLineItems = (linkProducts: boolean): Stripe.Checkout.SessionCreateParams.LineItem[] =>
    lines.map((l) => {
      const image = absoluteImageUrl(l.image, origin)
      return {
        quantity: l.quantity,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: l.unitCents,
          ...(linkProducts
            ? { product: l.id }
            : { product_data: { name: l.name, metadata: { sku: l.id }, ...(image ? { images: [image] } : {}) } }),
        },
      }
    })

  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      ui_mode: "embedded_page",
      mode: "payment",
      locale: (locale === "fr-FR" ? "fr" : "en-GB") as Stripe.Checkout.SessionCreateParams.Locale,
      line_items: buildLineItems(true),
      // Full billing address → complete AVS checks for UK issuers; Customer record → purchase history for Radar
      billing_address_collection: "required",
      customer_creation: "always",
      shipping_address_collection: {
        allowed_countries: shippingCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      phone_number_collection: { enabled: true },
      return_url: `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      metadata,
      payment_intent_data: { metadata: { source: CHECKOUT_SOURCE, market, ...(bundle?.gift ? { free_gift: BUNDLE_OFFER.giftId } : {}) } },
      ...(bundle?.gift
        ? { custom_text: { submit: { message: "Your free Pro Fixing Adhesive is included with this order." } } }
        : {}),
    }

    let session: Stripe.Checkout.Session
    try {
      session = await getStripe().checkout.sessions.create(params)
    } catch (err: any) {
      if (err?.code !== "resource_missing") throw err
      console.warn("[Stripe] product not synced, using inline product data:", err?.param)
      session = await getStripe().checkout.sessions.create({ ...params, line_items: buildLineItems(false) })
    }

    console.log("[Stripe] Session created:", { id: session.id, market, amount: session.amount_total, currency })
    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err: any) {
    console.error("[Stripe] session create failed:", { type: err?.type, code: err?.code, message: err?.message })
    return NextResponse.json(
      { error: "Could not start payment. Please try again.", code: err?.code || err?.type || "STRIPE_ERROR" },
      { status: 502 },
    )
  }
}
