"use client"

import { useEffect, useState } from "react"
import { formatGBP, quoteBundle } from "@/lib/checkout/offers"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { StripeCheckoutUK } from "@/components/stripe-checkout-uk"
import { ArrowLeft, Lock, Package, RotateCcw, Star, Gift, Check, Wrench, Minus, Plus } from "lucide-react"
import { trackInitiateCheckout as trackMetaInitiateCheckout, generateEventId } from "@/lib/meta-pixel"
import { trackInitiateCheckout as trackTikTokInitiateCheckout, formatCartForTikTok } from "@/lib/tiktok-events"
import { getFbpFbc } from "@/lib/fbp-fbc"
import { getStoredUTMs } from "@/lib/utm-client"
import { UpsellProductsUk, UPSELL_PRODUCTS_UK, type UpsellProduct } from "@/components/upsell-products-uk"

// Shape that comes from sessionStorage
interface StoredOrder {
  productId: string
  name: string
  price: number       // unit price
  totalPrice: number  // qty * unit
  quantity: number
  image: string
  currency: string
  ledFree?: boolean   // true when total >= £85 (Kit LED included)
  extras?: { productId: string; name: string; price: number; quantity: number; image: string }[]
}

interface BonusData {
  bonusPanels: number
  cleanerIncluded: boolean
  technicianIncluded: boolean
  installationCode: string
  bonusValue: number
}

const CLEANER_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg"
const PANEL_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/panneu01-COvuniuy0UAMH2wAwPKmS9Tlev4Qrt.avif"

export default function CheckoutUKPage() {
  const router = useRouter()
  const { items } = useCart()
  const [initiated, setInitiated] = useState(false)

  // Source of truth: sessionStorage first, then cart context
  const [storedOrder, setStoredOrder] = useState<StoredOrder | null>(null)
  const [bonusData, setBonusData] = useState<BonusData | null>(null)
  const [ready, setReady] = useState(false)
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([])
  const [checkoutStarted, setCheckoutStarted] = useState(false)

  // Calculate upsell total
  const upsellTotal = selectedUpsells.reduce((sum, id) => {
    const product = UPSELL_PRODUCTS_UK.find(p => p.id === id)
    return sum + (product?.price || 0)
  }, 0)

  // Handle upsell product selection
  const handleAddUpsell = (product: UpsellProduct) => {
    setSelectedUpsells(prev => [...prev, product.id])
  }

  const handleRemoveUpsell = (productId: string) => {
    setSelectedUpsells(prev => prev.filter(id => id !== productId))
  }

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: "instant" })

    // Check for bonus data
    try {
      const bonusRaw = sessionStorage.getItem("checkout_bonus_uk")
      if (bonusRaw) {
        setBonusData(JSON.parse(bonusRaw))
      }
    } catch (e) {
      // ignore
    }

    try {
      const raw = sessionStorage.getItem("checkout_order_uk")
      if (raw) {
        const parsed = JSON.parse(raw)
        setStoredOrder(parsed)
        setOrderQuantity(parsed.quantity || 1)
        setReady(true)
        return
      }
    } catch (e) {
      // ignore parse errors
    }

    // Fallback: build from cart context (GBP items only)
    const ukItems = items.filter((i) => i.product.currency === "GBP")
    if (ukItems.length > 0) {
      const first = ukItems[0]
      const unitPrice = first.product.salePrice || first.product.price
      setStoredOrder({
        productId: first.product.id,
        name: first.product.name,
        price: unitPrice,
        totalPrice: unitPrice * first.quantity,
        quantity: first.quantity,
        image: first.product.images?.[0] || first.product.image || "",
        currency: "GBP",
      })
      setOrderQuantity(first.quantity)
      setReady(true)
      return
    }

    // Nothing in sessionStorage or cart → redirect back
    router.replace("/product/flexible-acoustic-panel-uk")
  }, [items, router])

  if (!ready || !storedOrder) return null

  // Calculate total based on editable quantity + upsells
  const unitPrice = storedOrder.price
  // Early Black Friday bundles: same calculation the server uses at checkout
  const bundleQuote = quoteBundle(Math.round(unitPrice * 100), orderQuantity)
  const productTotal = bundleQuote.totalCents / 100
  const extras = storedOrder.extras ?? []
  const extrasTotal = extras.reduce((sum, e) => sum + e.price * e.quantity, 0)
  const totalGBP = productTotal + upsellTotal + extrasTotal
  const isFreeShipping = totalGBP >= 80
  
  // Handler to update quantity
  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, Math.min(99, orderQuantity + delta))
    setOrderQuantity(newQty)
    
    // Update sessionStorage with new quantity
    const updatedOrder = {
      ...storedOrder,
      quantity: newQty,
      totalPrice: unitPrice * newQty,
      ledFree: (unitPrice * newQty) >= 85,
    }
    try {
      sessionStorage.setItem("checkout_order_uk", JSON.stringify(updatedOrder))
    } catch (e) {}
  }

  // Build checkout items including upsells
  const checkoutItems = [
    {
      product: {
        id: storedOrder.productId,
        name: storedOrder.name,
        price: unitPrice,
        salePrice: unitPrice,
        currency: "GBP" as const,
        image: storedOrder.image,
        images: [storedOrder.image],
      } as any,
      quantity: orderQuantity,
    },
    ...extras.map((e) => ({
      product: {
        id: e.productId,
        name: e.name,
        price: e.price,
        salePrice: e.price,
        currency: "GBP" as const,
        image: e.image,
        images: [e.image],
      } as any,
      quantity: e.quantity,
    })),
    // Add selected upsell products
    ...selectedUpsells.map(id => {
      const upsellProduct = UPSELL_PRODUCTS_UK.find(p => p.id === id)
      if (!upsellProduct) return null
      return {
        product: {
          id: upsellProduct.id,
          name: upsellProduct.name,
          price: upsellProduct.price,
          salePrice: upsellProduct.price,
          currency: "GBP" as const,
          image: upsellProduct.image,
          images: [upsellProduct.image],
        } as any,
        quantity: 1,
      }
    }).filter(Boolean),
  ]

  const handleInitiateCheckout = async () => {
    if (initiated) return
    setInitiated(true)
    setCheckoutStarted(true)

    const eventId = generateEventId("ic")

    // Track Meta InitiateCheckout
    trackMetaInitiateCheckout({
      contentIds: [storedOrder.productId],
      numItems: orderQuantity,
      value: totalGBP,
      currency: "GBP",
      eventId,
    })
    
    // Track TikTok InitiateCheckout
    try {
      const tiktokItems = formatCartForTikTok(checkoutItems)
      await trackTikTokInitiateCheckout({
        contents: tiktokItems,
        value: totalGBP,
        currency: "GBP",
        description: `Checkout initiated with ${orderQuantity} items`,
      })
      if (process.env.NODE_ENV !== "production") {
        console.log("[v0] TikTok InitiateCheckout tracked (checkout page):", { value: totalGBP, currency: "GBP", numItems: orderQuantity })
      }
    } catch (err) {
      console.error("[v0] Error tracking TikTok InitiateCheckout:", err)
    }

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
          content_ids: [storedOrder.productId],
          num_items: orderQuantity,
          value: totalGBP,
          currency: "GBP",
          ...utms,
        },
        fbp,
        fbc,
      }),
    }).catch(console.error)
  }

  return (
    <div className="min-h-screen bg-card py-8 px-4">
      <div className="mx-auto max-w-lg">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/product/flexible-acoustic-panel-uk"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">100% Secure Order</span>
          </div>
        </div>

        {/* Upsell Products - Add These Too (hidden after checkout started) */}
        {!checkoutStarted && (
          <UpsellProductsUk 
            className="mb-4" 
            onAddProduct={handleAddUpsell}
            onRemoveProduct={handleRemoveUpsell}
            selectedProducts={selectedUpsells}
          />
        )}

        {/* Order Summary Card */}
        <div className="rounded-xl bg-white border border-border shadow-sm p-5 mb-4">
          {/* Minimal Product Display */}
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
            {storedOrder.image && (
              <Link 
                href={`/product/${storedOrder.productId}`}
                className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <Image
                  src={storedOrder.image}
                  alt={storedOrder.name}
                  fill
                  className="object-cover"
                />
              </Link>
            )}
            <div className="flex-1 min-w-0">
              <Link 
                href={`/product/${storedOrder.productId}`}
                className="text-base font-medium text-foreground hover:text-primary hover:underline transition-colors"
              >
                {storedOrder.name}
              </Link>
              <p className="text-2xl font-bold text-foreground mt-0.5">£{unitPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Delivery Notice */}
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
            <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-700">Arrives within <strong>6 days</strong></p>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={orderQuantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-base font-semibold">{orderQuantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={orderQuantity >= 99}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Bonus Items Section */}
          {bonusData && (
            <div className="mb-4 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">Free Bonuses</span>
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">FREE</span>
              </div>

              {/* Bonus panels */}
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-amber-200">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-amber-200">
                  <Image
                    src={PANEL_IMAGE}
                    alt="Bonus Panels"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-900">{bonusData.bonusPanels} Bonus Acoustic Panels</p>
                  <p className="text-xs text-amber-700">Included with your order</p>
                </div>
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Cleaner */}
              {bonusData.cleanerIncluded && (
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-amber-200">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-amber-200">
                    <Image
                      src={CLEANER_IMAGE}
                      alt="Panel Cleaner"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-900">Panel Cleaner</p>
                    <p className="text-xs text-amber-700">Professional cleaning product</p>
                  </div>
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              {/* Technician */}
              {bonusData.technicianIncluded && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 border border-amber-200">
                    <Wrench className="w-6 h-6 text-amber-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-900">Installation Technician</p>
                    <p className="text-xs text-amber-700">Installation service included</p>
                  </div>
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              {/* Installation code */}
              <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between">
                <span className="text-xs text-amber-700">Installation Code</span>
                <span className="text-sm font-bold text-amber-900 bg-white border border-amber-300 rounded px-3 py-1 tracking-wider">
                  {bonusData.installationCode}
                </span>
              </div>

              {/* Value note */}
              <div className="mt-3 text-center">
                <span className="text-xs text-amber-700">
                  Value of bonuses: <strong className="text-amber-900">£{bonusData.bonusValue.toFixed(2)}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{storedOrder.name} x{orderQuantity}</span>
              <span>£{productTotal.toFixed(2)}</span>
            </div>
            {bundleQuote.savingCents > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bundle saving ({bundleQuote.percent}%)</span>
                <span className="text-green-600 font-semibold">−{formatGBP(bundleQuote.savingCents)}</span>
              </div>
            )}
            {bundleQuote.gift && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pro Fixing Adhesive</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
            )}
            {extras.map((e) => (
              <div key={e.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {e.name} x{e.quantity}
                </span>
                <span>£{(e.price * e.quantity).toFixed(2)}</span>
              </div>
            ))}
            {selectedUpsells.length > 0 && (
              <>
                {selectedUpsells.map(id => {
                  const product = UPSELL_PRODUCTS_UK.find(p => p.id === id)
                  if (!product) return null
                  return (
                    <div key={id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{product.name}</span>
                      <span>£{product.price.toFixed(2)}</span>
                    </div>
                  )
                })}
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className={isFreeShipping ? "text-green-600 font-semibold" : ""}>
                {isFreeShipping ? "FREE" : "£7.00"}
              </span>
            </div>
            {bonusData && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Free bonuses</span>
                <span className="text-green-600 font-semibold">£0.00</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-lg">£{totalGBP.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="rounded-xl bg-white border border-border shadow-sm p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">100% SSL Secure Payment</span>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Delivery 5-8 business days</span>
            </div>
            <div className="flex items-start gap-2">
              <RotateCcw className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">Free returns within 30 days</span>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-muted-foreground">4.8/5 | 1,080 customer reviews</span>
            </div>
          </div>
        </div>

        {/* Stripe Embedded Checkout */}
        <div className="rounded-xl bg-white border border-border shadow-sm p-5 mb-4">
          <StripeCheckoutUK items={checkoutItems} onInitiateCheckout={handleInitiateCheckout} bonusData={bonusData} />

          {/* Payment icons */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
            {["Visa", "Mastercard", "Amex"].map((method) => (
              <span
                key={method}
                className="inline-block border border-border rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-secondary/30"
              >
                {method}
              </span>
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            Your data is encrypted and 100% secure
          </p>
        </div>

      </div>
    </div>
  )
}
