import { redirect } from "next/navigation"
import { CHECKOUT_SOURCE, getStripe } from "@/lib/stripe/server"
import { trackingPageUrl } from "@/lib/tracker-orders"
import ThankYouClient from "./thank-you-client"

export const dynamic = "force-dynamic"

const SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/

/**
 * Stripe return_url. Fires Purchase on the client (same logic as the success pages),
 * then sends the customer to the TrackerOrders tracking page.
 */
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId = "" } = await searchParams
  if (!SESSION_RE.test(sessionId)) redirect("/")

  const session = await getStripe()
    .checkout.sessions.retrieve(sessionId)
    .catch((err: any) => {
      console.error("[Thank-you] session retrieve failed:", err?.message)
      return null
    })
  if (!session) redirect(trackingPageUrl(null))
  if (session.metadata?.source !== CHECKOUT_SOURCE) redirect("/")

  const email = session.customer_details?.email ?? null
  const market = session.metadata?.market

  return <ThankYouClient sessionId={sessionId} market={market === "FR" ? "FR" : "UK"} redirectUrl={trackingPageUrl(email)} />
}
