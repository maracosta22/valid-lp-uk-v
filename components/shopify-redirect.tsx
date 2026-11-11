"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Lock } from "lucide-react"
import type { CartItem } from "@/lib/cart-context"
import { buildShopifyCheckoutUrl, saveShopifyCart } from "@/lib/shopify-checkout"
import { trackInitiateCheckout, generateEventId } from "@/lib/meta-pixel"
import { getFbpFbc } from "@/lib/fbp-fbc"

const CART_STORAGE_KEY = "nordic-haus-cart"

function readCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Reads the saved cart and sends the shopper to the Shopify checkout
 * (get.wooddecouk.com) with every product variant and quantity.
 */
export function ShopifyRedirect() {
  const started = useRef(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const items = readCart().filter((i) => i?.product?.currency !== "EUR")
    const url = buildShopifyCheckoutUrl(items)
    if (!url) {
      setFailed(true)
      return
    }
    saveShopifyCart(items)

    // Meta InitiateCheckout (browser pixel + CAPI) before leaving the site
    try {
      const eventId = generateEventId("ic")
      const value = items.reduce((s, i) => s + ((i.product as any).salePrice || i.product.price) * i.quantity, 0)
      const numItems = items.reduce((s, i) => s + i.quantity, 0)
      const contentIds = items.map((i) => i.product.id)
      trackInitiateCheckout({ contentIds, numItems, value, currency: "GBP", eventId })
      const { fbp, fbc } = getFbpFbc()
      fetch("/api/meta/track", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "InitiateCheckout",
          eventId,
          pageUrl: window.location.href,
          fbp,
          fbc,
          customData: { content_ids: contentIds, num_items: numItems, value, currency: "GBP" },
        }),
      }).catch(() => {})
    } catch {}

    // Small delay so tracking requests leave the browser
    setTimeout(() => window.location.replace(url), 400)
  }, [])

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      {failed ? (
        <>
          <p className="text-lg font-semibold">Your basket is empty.</p>
          <a href="/products" className="rounded-full bg-primary px-6 py-3 font-bold text-white">
            Continue shopping
          </a>
        </>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="flex items-center gap-2 text-lg font-semibold">
            <Lock className="h-5 w-5" /> Taking you to secure checkout…
          </p>
        </>
      )}
    </section>
  )
}
