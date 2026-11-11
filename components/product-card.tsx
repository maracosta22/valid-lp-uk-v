"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/products"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Flame } from "lucide-react"
import { formatPrice } from "@/lib/price"

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, openCart } = useCart()

  const isFlexibleAcousticPanel = product.slug === "flexible-acoustic-panel-uk"
  const isExternalImage = product.images[0]?.startsWith("http")

  // Translate badge for UK
  const getBadgeText = (badge: string | undefined, onSale: boolean | undefined) => {
    if (onSale) return "Launch Offer"
    if (badge === "Bestseller" || badge === "Meilleure Vente") return "Bestseller"
    if (badge === "Popular" || badge === "Populaire") return "Popular"
    if (badge === "New" || badge === "Nouveau") return "New"
    if (badge === "Essential" || badge === "Essentiel") return "Essential"
    return badge
  }

  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-muted">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={500}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            unoptimized={isExternalImage}
          />
          {product.badge && (
            <span
              className={`glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                product.onSale ? "text-primary" : "text-foreground"
              }`}
            >
              {getBadgeText(product.badge, product.onSale)}
            </span>
          )}
          {isFlexibleAcousticPanel && (
            <span className="glass absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Flame className="h-3 w-3" />
              Only 30 left!
            </span>
          )}
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-2xl font-semibold leading-snug transition-colors duration-200 hover:text-primary">{product.name}</h3>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-1">{product.description}</p>
          <div className="flex items-center gap-2 pt-1">
            <p className={`text-lg font-semibold tracking-tight ${product.onSale ? "text-primary" : ""}`}>
              {formatPrice(product.price, product.currency)}
              {isFlexibleAcousticPanel && <span className="ml-1 font-sans text-xs text-muted-foreground">/ piece</span>}
            </p>
            {product.onSale && product.originalPrice && (
              <p className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice, product.currency)}</p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 rounded-full border-border bg-card transition-colors duration-200 hover:bg-primary hover:text-primary-foreground"
          onClick={() => {
            addItem(product)
            openCart()
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
