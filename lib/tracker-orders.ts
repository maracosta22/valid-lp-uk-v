import "server-only"
import type Stripe from "stripe"
import { getStripe } from "@/lib/stripe/server"

const CREATE_ORDER_URL = "https://api.trackerorders.online/functions/v1/create-order"
const TRACKING_PAGE_URL = "https://rastreio-express.online/obrigado"

export function trackingPageUrl(email?: string | null) {
  const url = new URL(TRACKING_PAGE_URL)
  url.searchParams.set("project", process.env.TRACKER_PROJECT_ID || "")
  if (email) url.searchParams.set("email", email)
  return url.toString()
}

/**
 * Creates the order in TrackerOrders (sends the tracking e-mail to the customer).
 * Runs once per Checkout Session: the PaymentIntent metadata gets tracker_sent=true.
 * Never throws — a TrackerOrders failure must not fail the Stripe webhook.
 */
export async function sendOrderToTracker(session: Stripe.Checkout.Session) {
  try {
    const anonKey = process.env.TRACKER_ANON_KEY
    const webhookKey = process.env.TRACKER_WEBHOOK_KEY
    if (!anonKey || !webhookKey) {
      console.error("[TrackerOrders] TRACKER_ANON_KEY / TRACKER_WEBHOOK_KEY not configured")
      return
    }

    const stripe = getStripe()
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id

    if (paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
      if (pi.metadata?.tracker_sent === "true") {
        console.log("[TrackerOrders] Already sent, skipping:", { session: session.id, tracking_code: pi.metadata.tracking_code })
        return
      }
    }

    const details = session.customer_details
    if (!details?.email) {
      console.warn("[TrackerOrders] Session without customer e-mail, skipping:", session.id)
      return
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 })
    const orderItems = lineItems.data.map((li) => `${li.description || "Product"} x${li.quantity ?? 1}`).join(", ")

    const res = await fetch(CREATE_ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${anonKey}` },
      body: JSON.stringify({
        webhook_key: webhookKey,
        customer_name: details.name || "Customer",
        customer_email: details.email,
        ...(details.phone ? { customer_phone: details.phone } : {}),
        order_items: orderItems,
        total_value: (session.amount_total ?? 0) / 100,
        external_order_id: session.id,
      }),
    })

    const result = await res.json().catch(() => null)
    console.log("[TrackerOrders] create-order result:", { session: session.id, status: res.status, result })

    if (res.ok && result?.success && paymentIntentId) {
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: { tracker_sent: "true", tracking_code: String(result.tracking_code || "").slice(0, 100) },
      })
    }
  } catch (err: any) {
    console.error("[TrackerOrders] create-order failed:", { session: session.id, error: err?.message })
  }
}
