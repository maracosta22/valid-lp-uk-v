import "server-only"
import { randomUUID } from "node:crypto"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"

const TRACKER_WEBHOOK_URL = "https://api.trackerorders.online/v1/webhook"
const TRACKING_PAGE_URL = "https://rastreio-express.online/obrigado"
const CLAIM_SETTLE_MS = 800

export function trackingPageUrl(email?: string | null) {
  const url = new URL(TRACKING_PAGE_URL)
  url.searchParams.set("project", process.env.TRACKER_PROJECT_ID || "")
  if (email) url.searchParams.set("email", email)
  return url.toString()
}

const inFlight = new Map<string, Promise<string | null>>()

/**
 * Creates the TrackerOrders order (which e-mails the tracking code) exactly once per
 * Checkout Session. Called by the Stripe webhook and by the success page, whichever
 * comes first. The session id is the dedup key, stored on the PaymentIntent metadata.
 * Returns the tracking code (or null). Never throws.
 */
export function ensureTrackerOrder(sessionId: string): Promise<string | null> {
  const existing = inFlight.get(sessionId)
  if (existing) return existing
  const job = createOnce(sessionId).finally(() => inFlight.delete(sessionId))
  inFlight.set(sessionId, job)
  return job
}

async function createOnce(sessionId: string): Promise<string | null> {
  try {
    const anonKey = process.env.TRACKER_ANON_KEY
    const webhookKey = process.env.TRACKER_WEBHOOK_KEY
    if (!anonKey || !webhookKey) {
      console.error("[TrackerOrders] TRACKER_ANON_KEY / TRACKER_WEBHOOK_KEY not configured")
      return null
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details", "payment_intent"],
    })
    if (session.payment_status !== "paid") return null

    const pi = typeof session.payment_intent === "object" ? session.payment_intent : null
    if (!pi) {
      console.warn("[TrackerOrders] Session without PaymentIntent, skipping:", sessionId)
      return null
    }
    if (pi.metadata?.tracker_sent === "true") {
      console.log("[TrackerOrders] Already created, skipping:", { session: sessionId, tracking_code: pi.metadata.tracking_code })
      return pi.metadata.tracking_code || null
    }

    // Claim the order across instances (webhook vs success page): last writer wins, the loser backs off.
    const claim = randomUUID()
    await stripe.paymentIntents.update(pi.id, { metadata: { tracker_claim: claim } })
    await new Promise((r) => setTimeout(r, CLAIM_SETTLE_MS))
    const fresh = await stripe.paymentIntents.retrieve(pi.id)
    if (fresh.metadata?.tracker_sent === "true") return fresh.metadata.tracking_code || null
    if (fresh.metadata?.tracker_claim !== claim) {
      console.log("[TrackerOrders] Another request is creating this order, skipping:", sessionId)
      return null
    }

    const details = session.customer_details
    if (!details?.email) {
      console.warn("[TrackerOrders] Session without customer e-mail, skipping:", sessionId)
      return null
    }

    const shipping = session.collected_information?.shipping_details
    const address = shipping?.address || details.address
    const products = (session.line_items?.data || []).map((li) => ({
      name: li.description || "Product",
      quantity: li.quantity ?? 1,
      unit_price: (li.price?.unit_amount ?? 0) / 100,
      total: (li.amount_total ?? 0) / 100,
    }))
    const totalValue = (session.amount_total ?? 0) / 100

    const res = await fetch(`${TRACKER_WEBHOOK_URL}?key=${encodeURIComponent(webhookKey)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        external_order_id: session.id,
        customer_name: shipping?.name || details.name || "Customer",
        customer_email: details.email,
        customer_phone: details.phone || null,
        shipping_address: {
          name: shipping?.name || details.name || null,
          line1: address?.line1 || null,
          line2: address?.line2 || null,
          city: address?.city || null,
          state: address?.state || null,
          postal_code: address?.postal_code || null,
          country: address?.country || null,
        },
        products,
        order_items: products.map((p) => `${p.name} x${p.quantity}`).join(", "),
        total_value: totalValue,
        currency: "GBP",
      }),
    })

    const result = await res.json().catch(() => null)
    console.log("[TrackerOrders] webhook result:", { session: sessionId, status: res.status, result })

    if (!res.ok || result?.success === false) {
      await stripe.paymentIntents.update(pi.id, { metadata: { tracker_claim: "" } })
      return null
    }

    const trackingCode = String(result?.tracking_code || result?.data?.tracking_code || "").slice(0, 100)
    await stripe.paymentIntents.update(pi.id, {
      metadata: { tracker_sent: "true", tracking_code: trackingCode, tracker_claim: "" },
    })
    return trackingCode || null
  } catch (err: any) {
    console.error("[TrackerOrders] webhook failed:", { session: sessionId, error: err?.message })
    return null
  }
}
