import { getSuccessTracking } from "@/lib/success-tracking"
import SuccesFrClient from "./succes-fr-client"

export const dynamic = "force-dynamic"

export default async function SuccesFrPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id ?? null
  const tracking = await getSuccessTracking(sessionId)
  return <SuccesFrClient sessionId={sessionId} tracking={tracking} />
}
