"use client"

import { useState, useEffect } from "react"
import { BundleSelectorUK } from "@/components/bundle-selector-uk"
import { formatGBP, quoteBundle } from "@/lib/checkout/offers"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react"
import { trackAddToCart, generateEventId } from "@/lib/meta-pixel"
import { trackAddToCart as trackTikTokAddToCart } from "@/lib/tiktok-events"
import { getFbpFbc } from "@/lib/fbp-fbc"
import { getStoredUTMs } from "@/lib/utm-client"
import { useToast } from "@/hooks/use-toast"


interface AddToCartButtonProps {
  product: Product
  variant?: "default" | "icon"
  className?: string
  isFrenchVersion?: boolean
  isEnglishFlexibleAcoustic?: boolean
  isUKVersion?: boolean
  /** Callback fired after item is added to cart (FR/UK) — used for silent add + scroll behavior */
  onAddedToCart?: (orderData: { qty: number; price: number; totalPrice: number; ledFree: boolean }) => void
}

// FR upsell quantity options — base price €14,50/panneau
// original = qty × 14.50 | pack price = discounted total | savings = original - pack
// Note: ledFree is now determined dynamically based on total >= €100
const frQuantities = [
  { qty: 12, price: 249.00, original: 174.00, label: "12 Panneaux", badge: "Pack Pro",         savings: "€75,00",  freeShipping: true,  coverage: "~36 m²", ideal: "Suite complète" },
]

// Threshold for unlocking LED Kit bonus
const LED_BONUS_THRESHOLD = 100

// EN upsell quantity options for Flexible Acoustic Panel
const enQuantities = [
  { qty: 1, price: 17.90, label: "1 Panel", badge: null, savings: null, freeShipping: false },
  { qty: 2, price: 32.00, label: "2 Panels", badge: null, savings: "£3.80", freeShipping: false },
  { qty: 4, price: 60.00, label: "4 Panels", badge: "Most Popular", savings: "£11.60", freeShipping: true },
  { qty: 6, price: 85.00, label: "6 Panels", badge: "Best Value", savings: "£22.40", freeShipping: true },
]

// UK LED bonus threshold (£85)
const UK_LED_BONUS_THRESHOLD = 85

export function AddToCartButton({ product, variant = "default", className, isFrenchVersion = false, isEnglishFlexibleAcoustic = false, isUKVersion = false, onAddedToCart }: AddToCartButtonProps) {
  const { addItem, items, openCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  // FR: default to 8 panels option (index 0)
  const [selectedQtyOptionFr, setSelectedQtyOptionFr] = useState(frQuantities[0])
  // FR: custom quantity selector
  const [customQuantityFr, setCustomQuantityFr] = useState(5)
  const [useFrCustomQty, setUseFrCustomQty] = useState(false)
  
  // EN Flexible Acoustic: default to 4 panels option (index 2)
  const [selectedQtyOptionEn, setSelectedQtyOptionEn] = useState(enQuantities[2])
  // Simple quantity for UK and other versions
  const [quantity, setQuantity] = useState(1)
  
  // Determine which option set to use
  const selectedQtyOption = isFrenchVersion ? selectedQtyOptionFr : selectedQtyOptionEn
  const setSelectedQtyOption = isFrenchVersion ? setSelectedQtyOptionFr : setSelectedQtyOptionEn
  const quantityOptions = isFrenchVersion ? frQuantities : enQuantities

  const handleBuyNow = (overrideQty?: number, overridePrice?: number) => {
    // Check if cart has products with different currency
    const cartHasProducts = items.length > 0
    if (cartHasProducts) {
      const existingProduct = items[0]?.product
      const existingCurrency = existingProduct?.currency
      const newProductCurrency = product.currency

      // Prevent mixing EUR and GBP products
      if (existingCurrency !== newProductCurrency) {
        alert(`Cannot mix products from different markets. Please clear your cart and try again.`)
        return
      }
    }

    const usePackages = isFrenchVersion || isEnglishFlexibleAcoustic || isUKVersion

    // FR: use override price if provided (custom qty), otherwise use pack price
    const frEffectiveTotal = isFrenchVersion 
      ? (overridePrice ?? selectedQtyOptionFr.price) 
      : 0

    const qty = overrideQty ?? (usePackages ? (isFrenchVersion ? selectedQtyOptionFr.qty : isUKVersion ? quantity : selectedQtyOption.qty) : quantity)
    const unitPrice = overridePrice ?? (
      isFrenchVersion
        ? frEffectiveTotal / selectedQtyOptionFr.qty
        : isUKVersion
          ? (product.salePrice || product.price)
          : usePackages
            ? selectedQtyOption.price / selectedQtyOption.qty
            : (product.salePrice || product.price)
    )
    const totalValue = overridePrice ?? (
      isFrenchVersion
        ? frEffectiveTotal
        : isUKVersion
          ? (product.salePrice || product.price) * quantity
          : usePackages
            ? selectedQtyOption.price
            : (product.salePrice || product.price) * quantity
    )

    const eventId = generateEventId("atc")
    const currency = isFrenchVersion ? "EUR" : "GBP"

    // Track Meta
    trackAddToCart({
      contentId: product.id,
      contentName: product.name,
      quantity: qty,
      value: totalValue,
      currency: currency,
      eventId,
    })

    // Track TikTok
    trackTikTokAddToCart({
      contents: [
        {
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
          content_category: product.category,
          price: unitPrice,
          num_items: qty,
          brand: 'Acoustic Design',
        }
      ],
      value: totalValue,
      currency: currency,
      description: product.name,
    })

    // Send CAPI event
    const { fbp, fbc } = getFbpFbc()
    const utms = getStoredUTMs()

    fetch("/api/meta/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "AddToCart",
        eventId,
        pageUrl: window.location.href,
        customData: {
          content_ids: [product.id],
          contents: [{ id: product.id, quantity: qty, item_price: unitPrice }],
          content_name: product.name,
          content_type: "product",
          value: totalValue,
          currency: currency,
          ...utms,
        },
        fbp,
        fbc,
      }),
    }).catch(console.error)

    // For FR/EN/UK upsell, add the selected qty as a single cart entry with adjusted price
    const frUnitPrice = isFrenchVersion ? frEffectiveTotal / qty : 0
    const ukUnitPrice = isUKVersion ? (product.salePrice || product.price) : 0
    const productToAdd = usePackages
      ? { ...product, price: isFrenchVersion ? frUnitPrice : isUKVersion ? ukUnitPrice : selectedQtyOption.price / selectedQtyOption.qty }
      : product
    addItem(productToAdd, qty)

    // FR: persist order in sessionStorage so /checkout-fr always has data
    if (isFrenchVersion) {
      const finalQty = overrideQty ?? selectedQtyOptionFr.qty
      const finalTotalPrice = overridePrice ?? frEffectiveTotal
      const finalUnitPrice = finalTotalPrice / finalQty
      // LED Kit bonus is unlocked when total >= €100
      const finalLedFree = finalTotalPrice >= LED_BONUS_THRESHOLD
      
      const orderData = {
        productId: product.id,
        name: product.name,
        price: finalUnitPrice,
        totalPrice: finalTotalPrice,
        quantity: finalQty,
        image: product.images?.[0] || product.image || "",
        currency: "EUR",
        ledFree: finalLedFree,
      }
      try {
        sessionStorage.setItem("checkout_order_fr", JSON.stringify(orderData))
      } catch (e) {
        // sessionStorage not available — cart context will be used as fallback
      }

      // FR: if callback provided, do silent add + scroll instead of redirect
      if (onAddedToCart) {
        onAddedToCart({
          qty: finalQty,
          price: finalUnitPrice,
          totalPrice: finalTotalPrice,
          ledFree: finalLedFree,
        })
        return // Don't redirect — let parent handle scroll to Order Summary
      }

      // FR: Go directly to checkout (no bonus modal)
      router.push("/checkout-fr")
      return
    }

    // UK: persist order in sessionStorage so /checkout-uk always has data
    if (isUKVersion) {
      const finalQty = overrideQty ?? quantity
      const baseUnitPrice = product.salePrice || product.price
      const finalTotalPrice = overridePrice ?? (baseUnitPrice * finalQty)
      const finalUnitPrice = baseUnitPrice
      // LED Kit bonus is unlocked when total >= £85
      const finalLedFree = finalTotalPrice >= UK_LED_BONUS_THRESHOLD
      
      const orderData = {
        productId: product.id,
        name: product.name,
        price: finalUnitPrice,
        totalPrice: finalTotalPrice,
        quantity: finalQty,
        image: product.images?.[0] || product.image || "",
        currency: "GBP",
        ledFree: finalLedFree,
      }
      try {
        sessionStorage.setItem("checkout_order_uk", JSON.stringify(orderData))
      } catch (e) {
        // sessionStorage not available — cart context will be used as fallback
      }

      // UK: if callback provided, do silent add + scroll instead of redirect
      if (onAddedToCart) {
        onAddedToCart({
          qty: finalQty,
          price: finalUnitPrice,
          totalPrice: finalTotalPrice,
          ledFree: finalLedFree,
        })
        return // Don't redirect — let parent handle scroll to Order Summary
      }

      // Keep UK purchases in the cart drawer before checkout.
      openCart()
      return
    }

    openCart()
  }

  const displayPrice = product.salePrice || product.price

  // Icon variant for order bump - compact add to cart button
  if (variant === "icon") {
    return (
      <Button
        onClick={() => handleBuyNow(1, displayPrice)}
        size="sm"
        variant="outline"
        className={`gap-1 ${className || ""}`}
        disabled={!product.inStock}
      >
        <ShoppingBag className="h-3 w-3" />
        <span>Add</span>
      </Button>
    )
  }

  // French version: simple quantity selector + Buy Now button
  if (isFrenchVersion) {
    const UNIT_PRICE_FR = 14.49
    const customTotalFr = customQuantityFr * UNIT_PRICE_FR

    const handleCustomAdd = () => {
      handleBuyNow(customQuantityFr, customTotalFr)
    }

    return (
      <div className="flex flex-col gap-4 w-full items-center">
        {/* Simple quantity selector */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setCustomQuantityFr((q) => Math.max(1, q - 1))}
            className="flex h-12 w-14 items-center justify-center transition-colors hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4 text-gray-600" />
          </button>
          <span className="w-16 text-center text-lg font-semibold text-gray-900">{customQuantityFr}</span>
          <button
            type="button"
            onClick={() => setCustomQuantityFr((q) => q + 1)}
            className="flex h-12 w-14 items-center justify-center transition-colors hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Buy Now button */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={handleCustomAdd}
          data-add-to-cart="true"
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2D2A26] hover:bg-[#1a1816] text-white font-medium text-base py-4 px-8 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
        >
          <ShoppingCart className="h-5 w-5 flex-shrink-0" />
          Buy Now - {customTotalFr.toFixed(2).replace(".", ",")} €
        </button>
      </div>
    )
  }

  // UK Flexible Acoustic Panel version: simple quantity selector + Add to Cart + Buy Now buttons
  if (isUKVersion) {
    const ukUnitPrice = product.salePrice || product.price
    // Early Black Friday bundles (display only; the server applies the same discount at checkout)
    const ukQuote = quoteBundle(Math.round(ukUnitPrice * 100), quantity)
    const ukTotalPrice = ukQuote.totalCents / 100
    
    const handleAddToCartOnly = () => {
      // Add to cart WITHOUT redirect - just add and show feedback
      const eventId = generateEventId("atc")
      trackAddToCart({
        contentId: product.id,
        contentName: product.name,
        quantity: quantity,
        value: ukTotalPrice,
        currency: "GBP",
        eventId,
      })
      trackTikTokAddToCart({
        contents: [{ content_id: product.id, content_type: 'product', content_name: product.name, content_category: product.category, price: ukUnitPrice, num_items: quantity, brand: 'Acoustic Design' }],
        value: ukTotalPrice,
        currency: "GBP",
        description: product.name,
      })
      addItem({ ...product, price: ukUnitPrice }, quantity)
      
      // Save to sessionStorage
      const orderData = {
        productId: product.id,
        name: product.name,
        price: ukUnitPrice,
        totalPrice: ukTotalPrice,
        quantity: quantity,
        image: product.images?.[0] || product.image || "",
        currency: "GBP",
        ledFree: ukTotalPrice >= UK_LED_BONUS_THRESHOLD,
      }
      try {
        sessionStorage.setItem("checkout_order_uk", JSON.stringify(orderData))
      } catch (e) {}
      
      // Open the cart drawer so the customer can review the added item.
      openCart()
      toast({
        title: "Added to cart!",
        description: `${quantity} ${quantity > 1 ? "items" : "item"} added to your cart`,
      })
    }
    
    const handleBuyNowDirect = () => {
      // Add to cart and go directly to checkout
      const eventId = generateEventId("atc")
      trackAddToCart({
        contentId: product.id,
        contentName: product.name,
        quantity: quantity,
        value: ukTotalPrice,
        currency: "GBP",
        eventId,
      })
      trackTikTokAddToCart({
        contents: [{ content_id: product.id, content_type: 'product', content_name: product.name, content_category: product.category, price: ukUnitPrice, num_items: quantity, brand: 'Acoustic Design' }],
        value: ukTotalPrice,
        currency: "GBP",
        description: product.name,
      })
      addItem({ ...product, price: ukUnitPrice }, quantity)
      
      // Save to sessionStorage
      const orderData = {
        productId: product.id,
        name: product.name,
        price: ukUnitPrice,
        totalPrice: ukTotalPrice,
        quantity: quantity,
        image: product.images?.[0] || product.image || "",
        currency: "GBP",
        ledFree: ukTotalPrice >= UK_LED_BONUS_THRESHOLD,
      }
      try {
        sessionStorage.setItem("checkout_order_uk", JSON.stringify(orderData))
      } catch (e) {}
      
      // Let the customer review the cart before checkout.
      openCart()
    }
    
    return (
      <div className="flex flex-col gap-3 w-full items-center">
        <BundleSelectorUK unitCents={Math.round(ukUnitPrice * 100)} quantity={quantity} onQuantityChange={setQuantity} />

        {/* Simple quantity selector */}
        <div className="flex items-center justify-center">
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-2xl"
            >
              −
            </button>
            <span className="w-14 h-14 flex items-center justify-center text-xl font-semibold text-gray-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-2xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart button (smaller, above Buy Now) */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={handleAddToCartOnly}
          className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm py-2.5 px-6 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4 flex-shrink-0" />
          Add to Cart
        </button>

        {/* Buy Now button (orange, goes to checkout) */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={handleBuyNowDirect}
          data-add-to-cart="true"
          className="w-full flex items-center justify-center gap-3 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-lg py-4 px-8 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
        >
          <ShoppingCart className="h-5 w-5 flex-shrink-0" />
          Buy Now - £{ukTotalPrice.toFixed(2)}
        </button>
        {ukQuote.savingCents > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            You save {formatGBP(ukQuote.savingCents)}
            {ukQuote.gift && " plus a free Pro Fixing Adhesive"}
          </p>
        )}
      </div>
    )
  }

  // English Flexible Acoustic Panel version: upsell quantity selector + orange CTA button
  if (isEnglishFlexibleAcoustic) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {/* Quantity upsell cards */}
        <div className="space-y-2">
          {enQuantities.map((option) => {
            const isSelected = selectedQtyOptionEn.qty === option.qty
            return (
              <button
                key={option.qty}
                type="button"
                onClick={() => setSelectedQtyOptionEn(option)}
                className={`w-full rounded-lg border-2 px-4 py-3 transition-all ${
                  isSelected
                    ? "border-primary bg-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{option.label}</span>
                    {option.badge && (
                      <span className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        option.badge === "Most Popular" ? "bg-green-600" : "bg-amber-600"
                      }`}>
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-900">£{option.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  {option.savings ? (
                    <span className="text-green-700 font-medium">Save {option.savings}</span>
                  ) : (
                    <span></span>
                  )}
                  {option.freeShipping && (
                    <span className="text-green-700 font-medium">Free shipping included!</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Orange CTA button */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => handleBuyNow()}
          data-add-to-cart="true"
          className="w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-4 px-8 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-5 w-5 flex-shrink-0" />
          Order Now £{selectedQtyOptionEn.price.toFixed(2)}
        </button>

        {/* Reassurance line */}
        <p className="text-center text-xs text-gray-500">
          100% Secure Payment &nbsp;|&nbsp; Free Shipping Over £80
        </p>
      </div>
    )
  }

  // Default English version
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Quantity Selector - compact and centered */}
      <div className="flex h-10 w-32 items-center justify-center border border-border rounded-md">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-full w-10 items-center justify-center transition-colors hover:bg-secondary rounded-l-md"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-12 text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex h-full w-10 items-center justify-center transition-colors hover:bg-secondary rounded-r-md"
          aria-label="Increase quantity"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <Button onClick={() => handleBuyNow()} size="lg" className="h-12 w-full" disabled={!product.inStock} data-add-to-cart="true">
        <ShoppingBag className="mr-2 h-4 w-4" />
        {product.currency === "BRL"
          ? `Comprar - R$${(displayPrice * quantity).toFixed(2)}`
          : `Buy Now - £${displayPrice * quantity}`}
      </Button>
    </div>
  )
}
