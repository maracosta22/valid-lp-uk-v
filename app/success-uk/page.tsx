import { getSuccessTracking } from "@/lib/success-tracking"
import SuccessUKClient from "./success-uk-client"

export const dynamic = "force-dynamic"

export default async function SuccessUKPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id ?? null
  const tracking = await getSuccessTracking(sessionId)
  return <SuccessUKClient sessionId={sessionId} tracking={tracking} />
}
