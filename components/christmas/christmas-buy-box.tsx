"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, RotateCcw, Shield, ShoppingCart, Truck } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import {
  christmasCartId,
  formatGBP,
  formatPriceRange,
  getChristmasProduct,
  type ChristmasProduct,
} from "@/lib/christmas"

const MAX_QUANTITY = 99

interface Companion {
  id: string
  name: string
  price: number
  image: string
  product: ChristmasProduct
}

function resolveCompanions(product: ChristmasProduct): Companion[] {
  return (product.bundleWith ?? []).flatMap(({ slug, optionIndex }) => {
    const p = getChristmasProduct(slug)
    if (!p) return []
    const price = optionIndex !== undefined ? p.options?.prices?.[optionIndex] : p.price
    if (price === null || price === undefined) return []
    const optionValue = optionIndex !== undefined ? p.options?.values[optionIndex] : undefined
    return [
      {
        id: christmasCartId(slug, optionIndex),
        name: optionValue ? `${p.name} – ${optionValue}` : p.name,
        price,
        image: p.images[0] ?? "",
        product: p,
      },
    ]
  })
}

export function ChristmasBuyBox({ product }: { product: ChristmasProduct }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [selected, setSelected] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const optionPrice = product.options?.prices?.[selected]
  const priceLabel = optionPrice !== undefined ? formatGBP(optionPrice) : formatPriceRange(product)
  const unitPrice = optionPrice ?? product.price
  const available = unitPrice !== null && priceLabel !== null
  const totalPrice = unitPrice !== null ? unitPrice * quantity : 0

  const companions = resolveCompanions(product)
  const [companionIds, setCompanionIds] = useState<string[]>([])
  const selectedCompanions = companions.filter((c) => companionIds.includes(c.id))
  const companionsTotal = selectedCompanions.reduce((sum, c) => sum + c.price, 0)
  const grandTotal = totalPrice + companionsTotal

  const toggleCompanion = (id: string) =>
    setCompanionIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const addToCart = () => {
    if (unitPrice === null) return null
    for (const c of selectedCompanions) {
      addItem(
        {
          id: c.id,
          slug: c.product.slug,
          name: c.name,
          description: c.product.description ?? c.product.name,
          longDescription: "",
          price: c.price,
          currency: "GBP",
          category: "christmas",
          images: c.product.images,
          features: [],
          inStock: true,
        },
        1,
      )
    }
    const hasOptionPrice = optionPrice !== undefined
    const optionValue = hasOptionPrice ? product.options?.values[selected] : undefined
    const id = christmasCartId(product.slug, hasOptionPrice ? selected : undefined)
    const name = optionValue ? `${product.name} – ${optionValue}` : product.name
    addItem(
      {
        id,
        slug: product.slug,
        name,
        description: product.description ?? product.name,
        longDescription: "",
        price: unitPrice,
        currency: "GBP",
        category: "christmas",
        images: product.images,
        features: [],
        inStock: true,
      },
      quantity,
    )
    return { id, name }
  }

  const handleAddToCart = () => {
    if (!addToCart()) return
    toast({
      title: "Added to cart!",
      description: `${quantity} ${quantity > 1 ? "items" : "item"} added to your cart`,
    })
  }

  const handleBuyNow = () => {
    const added = addToCart()
    if (!added || unitPrice === null) return
    try {
      sessionStorage.setItem(
        "checkout_order_uk",
        JSON.stringify({
          productId: added.id,
          name: added.name,
          price: unitPrice,
          totalPrice,
          quantity,
          image: product.images[0] ?? "",
          currency: "GBP",
          extras: selectedCompanions.map((c) => ({
            productId: c.id,
            name: c.name,
            price: c.price,
            quantity: 1,
            image: c.image,
          })),
        }),
      )
    } catch {}
    router.push("/checkout-uk")
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xl font-medium" aria-live="polite">
        {priceLabel ?? "Price coming soon"}
      </p>

      {product.options && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-medium">{product.options.label}</legend>
          <div className="flex flex-wrap gap-2">
            {product.options.values.map((value, i) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="option"
                  value={value}
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                  className="peer sr-only"
                />
                <span className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm transition-colors peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                  {value}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {companions.length > 0 && (
        <fieldset className="flex flex-col gap-3 rounded-3xl border border-border bg-card/70 p-4 backdrop-blur">
          <legend className="sr-only">Take it with</legend>
          <p className="font-serif text-lg" aria-hidden="true">
            Take it with
          </p>
          <ul className="flex flex-col gap-2">
            {companions.map((c) => {
              const checked = companionIds.includes(c.id)
              return (
                <li key={c.id}>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-2 pr-3 transition-colors ${
                      checked ? "border-primary bg-primary/5" : "border-border bg-background hover:border-foreground/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCompanion(c.id)}
                      className="peer sr-only"
                    />
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {c.image && (
                        <Image src={c.image} alt={c.product.name} fill sizes="56px" className="object-cover" />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-medium leading-snug">{c.name}</span>
                      <span className="text-sm text-muted-foreground">+ {formatGBP(c.price)}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${
                        checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                      }`}
                    >
                      {checked && <Check className="size-3.5" />}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      )}

      <div className="flex w-full flex-col items-center gap-3">
        <div className="flex items-center overflow-hidden rounded-xl border border-gray-300">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-14 w-14 items-center justify-center text-2xl text-gray-600 transition-colors hover:bg-gray-100"
          >
            −
          </button>
          <span
            className="flex h-14 w-14 items-center justify-center text-xl font-semibold text-gray-900"
            aria-live="polite"
            aria-label={`Quantity ${quantity}`}
          >
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            className="flex h-14 w-14 items-center justify-center text-2xl text-gray-600 transition-colors hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={!available}
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          Add to Cart
        </button>

        <button
          type="button"
          disabled={!available}
          onClick={handleBuyNow}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 rounded-full"
        >
          <ShoppingCart className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          {available ? `Buy Now - £${grandTotal.toFixed(2)}` : "Coming soon"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Dispatch within 24-48h • Estimated delivery 5-8 business days
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-border pt-8">
        <div className="flex flex-col items-center text-center">
          <Truck className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span className="mt-2 text-[10px] leading-tight text-muted-foreground sm:text-xs">
            Free Shipping
            <br className="sm:hidden" /> Over £80
          </span>
        </div>
        <div className="flex flex-col items-center text-center">
          <RotateCcw className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span className="mt-2 text-[10px] leading-tight text-muted-foreground sm:text-xs">30-Day Returns</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Shield className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <span className="mt-2 text-[10px] leading-tight text-muted-foreground sm:text-xs">5-Year Warranty</span>
        </div>
      </div>
    </div>
  )
}
