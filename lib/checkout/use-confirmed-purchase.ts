"use client"

import { useEffect, useRef, useState } from "react"
import { identifyUser, trackPurchase } from "@/lib/tiktok-events"
import { updateMetaUserData } from "@/lib/meta-pixel"

export interface OrderSummary {
  orderId: string
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded"
  currency: string
  amount_total: number // cents (same shape the success pages already render)
  value: number
  eventId: string
  customerEmail: string | null
  firstName: string | null
  lastName: string | null
  lineItems: Array<{ id: string; name: string; quantity: number; unitPrice: number; amount: number }>
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchStatus(orderId: string): Promise<OrderSummary | null> {
  // A capture can be briefly "pending": poll a few times before giving up
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const res = await fetch(`/api/stripe/session-status?session_id=${encodeURIComponent(orderId)}`, { cache: "no-store" })
      if (res.status === 404 || res.status === 400) return null
      if (res.ok) {
        const data = (await res.json()) as OrderSummary
        if (data.status !== "pending" || attempt === 5) return data
      }
    } catch {}
    await sleep(2000)
  }
  return null
}

/**
 * Success-page logic for Stripe Checkout sessions.
 * Purchase (Meta Pixel, TikTok, Google Ads) fires ONLY when the server confirms
 * status === "paid", and only once per order on this browser.
 */
export function useConfirmedPurchase(
  orderId: string | null,
  opts: {
    metaPixelId: string
    googleAdsSendTo: string
    onConfirmed?: () => void
    /** Called once all tracking for this order is done (or skipped). */
    onFinished?: (data: OrderSummary | null) => void
  },
) {
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const startedRef = useRef(false)
  const optsRef = useRef(opts)
  optsRef.current = opts

  useEffect(() => {
    if (!orderId || startedRef.current) return
    startedRef.current = true

    let result: OrderSummary | null = null
    ;(async () => {
      const data = await fetchStatus(orderId)
      result = data
      if (!data) return
      setSummary(data)
      if (data.status !== "paid") return

      optsRef.current.onConfirmed?.()

      const firedKey = `pp_purchase_tracked_${orderId}`
      try {
        if (localStorage.getItem(firedKey)) return
      } catch {}

      const { metaPixelId, googleAdsSendTo } = optsRef.current
      const w = window as any

      // Pixel scripts load "afterInteractive": wait for them before firing, and only
      // mark the order as tracked once fbq exists (otherwise a refresh can retry).
      for (let i = 0; i < 20 && !w.fbq; i++) await sleep(250)
      if (w.fbq) {
        try {
          localStorage.setItem(firedKey, "1")
        } catch {}
      }

      // Meta: browser event with the same eventID as the server CAPI event → deduplicated
      try {
        updateMetaUserData({
          email: data.customerEmail || undefined,
          firstName: data.firstName || undefined,
          lastName: data.lastName || undefined,
          externalId: orderId,
        })
      } catch {}
      if (w.fbq) {
        w.fbq(
          "trackSingle",
          metaPixelId,
          "Purchase",
          {
            value: data.value,
            currency: data.currency,
            content_type: "product",
            content_ids: data.lineItems.map((i) => i.id),
            order_id: orderId,
          },
          { eventID: data.eventId },
        )
      }

      // TikTok
      try {
        if (data.customerEmail) await identifyUser({ email: data.customerEmail, external_id: orderId })
        sessionStorage.removeItem("tiktok_purchase_data")
        await trackPurchase({
          contents: data.lineItems.map((i) => ({
            content_id: i.id,
            content_type: "product",
            content_name: i.name,
            price: i.unitPrice,
            num_items: i.quantity,
            brand: "Acoustic Design",
          })) as any,
          value: data.value,
          currency: data.currency,
          status: "completed",
          description: "Purchase completed",
        })
      } catch {}

      // Google Ads conversion
      if (w.gtag) {
        w.gtag("event", "conversion", {
          send_to: googleAdsSendTo,
          value: data.value,
          currency: data.currency,
          transaction_id: orderId,
        })
      }
    })()
      .catch(() => {})
      .finally(() => optsRef.current.onFinished?.(result))
  }, [orderId])

  return summary
}
