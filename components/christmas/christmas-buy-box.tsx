"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Minus, Plus, RotateCcw, Shield, Truck } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import {
  CHRISTMAS_ORDER_BY,
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
  short?: string
  preselected?: boolean
}

function resolveCompanions(product: ChristmasProduct): Companion[] {
  return (product.bundleWith ?? []).flatMap(({ slug, optionIndex, short, preselected }) => {
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
        short,
        preselected,
      },
    ]
  })
}

export function ChristmasBuyBox({ product, children }: { product: ChristmasProduct; children?: React.ReactNode }) {
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
  const [companionIds, setCompanionIds] = useState<string[]>(() =>
    companions.filter((c) => c.preselected).map((c) => c.id),
  )
  const selectedCompanions = companions.filter((c) => companionIds.includes(c.id))
  const companionsTotal = selectedCompanions.reduce((sum, c) => sum + c.price, 0)
  const grandTotal = totalPrice + companionsTotal
  const buyText = product.buyLabel
    ? ["Buy " + product.buyLabel, ...selectedCompanions.map((c) => c.short).filter(Boolean)].join(" + ")
    : "Buy Now"

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
      <div className="flex flex-col gap-2">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1" aria-live="polite">
          <span className="font-serif text-4xl">{priceLabel ?? "Price coming soon"}</span>
          {product.compareAtPrice && optionPrice === undefined && (
            <span className="text-lg text-muted-foreground line-through">
              <span className="sr-only">Was </span>
              {formatGBP(product.compareAtPrice)}
            </span>
          )}
        </p>
        {product.compareAtPrice && product.offerLabel && optionPrice === undefined && (
          <p className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            {product.offerLabel}
          </p>
        )}
      </div>

      {children}

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
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-semibold">{product.bundleTitle ?? "Take it with"}</legend>
          <ul className="flex flex-col gap-3">
            {companions.map((c) => {
              const checked = companionIds.includes(c.id)
              return (
                <li key={c.id}>
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-3xl border p-3 transition-colors ${
                      checked ? "border-primary bg-background" : "border-border bg-card hover:border-foreground/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCompanion(c.id)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${
                        checked ? "border-primary bg-primary text-primary-foreground" : "border-foreground/30 bg-background"
                      }`}
                    >
                      {checked && <Check className="size-3.5" />}
                    </span>
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {c.image && (
                        <Image src={c.image} alt={c.product.name} fill sizes="56px" className="object-cover" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-medium leading-snug">
                      <Link
                        href={`/christmas/${c.product.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                      >
                        {c.name}
                      </Link>
                    </span>
                    <span className="shrink-0 text-sm font-semibold">+ {formatGBP(c.price)}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      )}

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-13 shrink-0 items-center rounded-full border border-border bg-card">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex size-12 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="w-8 text-center font-medium" aria-live="polite" aria-label={`Quantity ${quantity}`}>
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              className="flex size-12 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            disabled={!available}
            onClick={handleAddToCart}
            className="flex h-13 flex-1 items-center justify-center rounded-full border border-foreground bg-transparent px-6 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to basket
          </button>
        </div>

        <button
          type="button"
          disabled={!available}
          onClick={handleBuyNow}
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {available ? `${buyText} · ${formatGBP(grandTotal)}` : "Coming soon"}
        </button>

        <p className="text-pretty text-center text-xs leading-relaxed text-muted-foreground">
          {`Dispatch within 24-48h · Arrives in 5-8 business days · Order by ${CHRISTMAS_ORDER_BY} for Christmas`}
        </p>
      </div>

      <ul className="grid grid-cols-3 gap-2">
        {[
          { Icon: Truck, label: "Free UK delivery over £80" },
          { Icon: RotateCcw, label: "30-day returns" },
          { Icon: Shield, label: "Secure checkout" },
        ].map(({ Icon, label }) => (
          <li key={label} className="flex flex-col items-center gap-2 rounded-3xl bg-card px-2 py-4 text-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted">
              <Icon className="size-4 text-primary" aria-hidden="true" />
            </span>
            <span className="text-xs font-medium leading-snug">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
