import "server-only"
import { CHECKOUT_SOURCE, getStripe } from "@/lib/stripe/server"
import { trackingPageUrl } from "@/lib/tracker-orders"

const SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/

export type SuccessTracking = {
  trackingUrl: string
  trackingCode: string | null
  email: string | null
}

/** Tracking info for the success pages. The code exists once the Stripe webhook has created the TrackerOrders order. */
export async function getSuccessTracking(sessionId: string | null): Promise<SuccessTracking> {
  const fallback: SuccessTracking = { trackingUrl: trackingPageUrl(null), trackingCode: null, email: null }
  if (!sessionId || !SESSION_RE.test(sessionId)) return fallback

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] })
    if (session.metadata?.source !== CHECKOUT_SOURCE) return fallback

    const email = session.customer_details?.email ?? null
    const pi = typeof session.payment_intent === "object" ? session.payment_intent : null
    return {
      trackingUrl: trackingPageUrl(email),
      trackingCode: pi?.metadata?.tracking_code || null,
      email,
    }
  } catch (err: any) {
    console.error("[Success] tracking lookup failed:", err?.message)
    return fallback
  }
}
