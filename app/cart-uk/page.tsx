"use client"

import Link from "next/link"
import { BUNDLE_OFFER, quoteBundle } from "@/lib/checkout/offers"
import { ArrowLeft, ArrowRight, ShoppingBag, AlertTriangle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { StripeCheckoutUK } from "@/components/stripe-checkout-uk"
import { formatPrice } from "@/lib/price"
import { trackInitiateCheckout, generateEventId } from "@/lib/meta-pixel"
import { getFbpFbc } from "@/lib/fbp-fbc"
import { getStoredUTMs } from "@/lib/utm-client"

export default function CartUKPage() {
  const { items, totalPrice, clearCart } = useCart()

  // Filter to UK items only (GBP)
  const ukItems = items.filter((item) => item.product.currency === "GBP")
  const ukFullPrice = ukItems.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price
    return sum + price * item.quantity
  }, 0)
  // Early Black Friday bundles: same calculation the server uses at checkout
  const panelItems = ukItems.filter((item) => (BUNDLE_OFFER.productIds as readonly string[]).includes(item.product.id))
  const panelQty = panelItems.reduce((n, item) => n + item.quantity, 0)
  const firstPanel = panelItems[0]?.product as { price: number; salePrice?: number } | undefined
  const panelUnit = firstPanel ? Math.round((firstPanel.salePrice || firstPanel.price) * 100) : 0
  const bundleQuote = quoteBundle(panelUnit, panelQty)
  const ukTotalPrice = ukFullPrice - bundleQuote.savingCents / 100

  const hasFlexiblePanel = ukItems.some((item) => item.product.slug === "flexible-acoustic-panel-uk")
  const currencyCode = "GBP"

  const formattedTotal = formatPrice(ukTotalPrice, currencyCode)

  const handleInitiateCheckout = () => {
    const eventId = generateEventId("ic")
    const contentIds = ukItems.map((item) => item.product.id)
    const numItems = ukItems.reduce((sum, item) => sum + item.quantity, 0)

    trackInitiateCheckout({
      contentIds,
      numItems,
      value: ukTotalPrice,
      currency: currencyCode,
      eventId,
    })

    const { fbp, fbc } = getFbpFbc()
    const utms = getStoredUTMs()

    fetch("/api/meta/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "InitiateCheckout",
        eventId,
        pageUrl: window.location.href,
        customData: {
          content_ids: contentIds,
          num_items: numItems,
          value: ukTotalPrice,
          currency: currencyCode,
          ...utms,
        },
        fbp,
        fbc,
      }),
    }).catch(console.error)
  }

  if (ukItems.length === 0) {
    return (
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="mt-6 font-serif text-3xl">Your cart is empty</h1>
            <p className="mt-4 text-muted-foreground">It looks like you haven&apos;t added any items to your cart yet.</p>
            <Button asChild className="mt-8" size="lg">
              <Link href="/product/flexible-acoustic-panel-uk">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/product/flexible-acoustic-panel-uk"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="mt-4 font-serif text-4xl">Your Cart</h1>
        </div>

        {hasFlexiblePanel && (
          <div className="mb-8 flex items-center gap-3 rounded-md bg-amber-50 border border-amber-200 px-4 py-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Items in your cart are selling fast!</p>
              <p className="text-xs text-amber-700">
                Only 30 units of Flexible Acoustic Panel remaining. Complete your order now.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="divide-y divide-border border-y border-border">
              {ukItems.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            {/* Clear Cart */}
            <div className="mt-6">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-secondary p-6">
              <h2 className="font-serif text-xl">Order Summary</h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(ukFullPrice, currencyCode)}</span>
                </div>
                {bundleQuote.savingCents > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bundle saving ({bundleQuote.percent}%)</span>
                    <span className="font-semibold text-green-600">−{formatPrice(bundleQuote.savingCents / 100, currencyCode)}</span>
                  </div>
                )}
                {bundleQuote.gift && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pro Fixing Adhesive</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{ukTotalPrice >= 80 ? "Free" : "Calculated at checkout"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-serif text-xl">{formattedTotal}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <StripeCheckoutUK items={ukItems} onInitiateCheckout={handleInitiateCheckout} />
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">Secure payment powered by Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
