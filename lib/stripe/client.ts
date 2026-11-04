import { loadStripe } from "@stripe/stripe-js"

// Single shared Stripe.js instance, loaded on every page so Radar sees the full browsing session.
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
