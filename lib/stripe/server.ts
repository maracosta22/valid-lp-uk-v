import "server-only"
import Stripe from "stripe"

/**
 * Stripe server client. Secret key ONLY from Vercel env vars:
 *   STRIPE_SECRET_KEY
 */
let client: Stripe | null = null

export function getStripe(): Stripe {
  if (client) return client
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured")
  client = new Stripe(key)
  return client
}

/** Tag on every session created by this site (the Stripe account may be shared). */
export const CHECKOUT_SOURCE = "slaturadecori"

export function purchaseEventId(sessionId: string) {
  // Same id on server (CAPI) and browser (Pixel) → Meta deduplicates
  return `purchase_${sessionId}`
}
