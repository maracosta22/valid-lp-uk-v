import { type NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { CHECKOUT_SOURCE, getStripe, purchaseEventId } from "@/lib/stripe/server"
import { sendPurchaseEventToAllPixels } from "@/lib/meta/sendEvent"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Stripe webhook (Developers → Webhooks). Signature verified with STRIPE_WEBHOOK_SECRET.
 * Events: checkout.session.completed, checkout.session.async_payment_succeeded,
 *         checkout.session.async_payment_failed, charge.refunded,
 *         payment_intent.payment_failed, charge.failed (decline + risk logging)
 * Meta Purchase (Conversions API) is sent ONLY when payment_status === "paid".
 */
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ error: "not_configured" }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get("stripe-signature") || ""

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret)
  } catch (err: any) {
    console.warn("[Stripe Webhook] Invalid signature:", err?.message)
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.metadata?.source !== CHECKOUT_SOURCE) break
        if (session.payment_status !== "paid") {
          console.log("[Stripe Webhook] Session completed, payment pending:", { id: session.id, status: session.payment_status })
          break
        }
        console.log("[Stripe Webhook] PAID:", { id: session.id, amount: session.amount_total, currency: session.currency })
        await sendServerPurchase(session)
        break
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[Stripe Webhook] FAILED:", { id: session.id })
        break
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent
        if (pi.metadata?.source !== CHECKOUT_SOURCE) break
        const charge = pi.latest_charge && typeof pi.latest_charge === "object" ? pi.latest_charge : null
        console.log("[Stripe Webhook] PI FAILED:", {
          id: pi.id,
          amount: pi.amount,
          code: pi.last_payment_error?.code,
          decline: pi.last_payment_error?.decline_code,
          message: pi.last_payment_error?.message,
          risk_level: charge?.outcome?.risk_level,
          risk_score: charge?.outcome?.risk_score,
        })
        break
      }

      case "charge.failed": {
        // Charges don't always carry the PaymentIntent metadata, so log every failure with its risk outcome
        const charge = event.data.object as Stripe.Charge
        console.log("[Stripe Webhook] CHARGE FAILED:", {
          charge: charge.id,
          payment_intent: charge.payment_intent,
          code: charge.failure_code,
          reason: charge.outcome?.reason,
          network_status: charge.outcome?.network_status,
          risk_level: charge.outcome?.risk_level,
          risk_score: charge.outcome?.risk_score,
          card_country: charge.payment_method_details?.card?.country,
        })
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        console.log("[Stripe Webhook] REFUNDED:", { charge: charge.id, amount_refunded: charge.amount_refunded })
        break
      }

      default:
        break
    }
  } catch (err: any) {
    // Non-2xx → Stripe retries later
    console.error("[Stripe Webhook] Processing error:", { type: event.type, error: err?.message })
    return NextResponse.json({ error: "processing_error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function sendServerPurchase(session: Stripe.Checkout.Session) {
  try {
    const md = session.metadata || {}
    let items: Array<[string, number, number]> = []
    try {
      items = JSON.parse(md.items || "[]")
    } catch {}

    const details = session.customer_details
    const shipping = session.collected_information?.shipping_details
    const address = shipping?.address || details?.address
    const [firstName, ...rest] = String(shipping?.name || details?.name || "").trim().split(/\s+/)

    const results = await sendPurchaseEventToAllPixels({
      value: (session.amount_total ?? 0) / 100,
      currency: (session.currency || "gbp").toUpperCase(),
      orderId: session.id,
      eventId: purchaseEventId(session.id),
      eventTime: session.created,
      contentIds: items.map(([id]) => id),
      contents: items.map(([id, qty, cents]) => ({ id, quantity: qty, item_price: cents / 100 })),
      email: details?.email || undefined,
      phone: details?.phone || undefined,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
      city: address?.city || undefined,
      state: address?.state || undefined,
      zip: address?.postal_code || undefined,
      country: address?.country || undefined,
      externalId: session.id,
      fbc: md.fbc,
      fbp: md.fbp,
      clientIpAddress: md.client_ip,
      clientUserAgent: md.client_ua,
      eventSourceUrl: md.event_source_url || process.env.NEXT_PUBLIC_SITE_URL || "https://www.slaturadecori.com",
    })
    console.log("[Stripe Webhook] Purchase sent to Meta:", results.map((r) => ({ pixelId: r.pixelId, ok: !r.result.error })))
  } catch (err: any) {
    // Tracking must never fail the webhook
    console.error("[Stripe Webhook] Meta Purchase failed:", err?.message)
  }
}
