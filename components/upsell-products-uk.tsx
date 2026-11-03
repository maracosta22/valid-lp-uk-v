"use client"

import { Plus, Check } from "lucide-react"
import Image from "next/image"
import { christmasCartId, getChristmasProduct } from "@/lib/christmas"

const LED_KIT_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg"
const GLUE_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLEAN04-jsHtrQ87vwg45Qyo5RrSkzrJbV2MXC.jpg"

export interface UpsellProduct {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  href?: string
}

export const UPSELL_PRODUCTS_UK: UpsellProduct[] = [
  {
    id: "led-kit-uk",
    name: "Recessed LED Strip Kit",
    description: "LED lighting for your panels",
    price: 109.00,
    originalPrice: 180.00,
    image: LED_KIT_IMAGE,
  },
  {
    id: "glue-kit-uk",
    name: "Pro Fixing Adhesive",
    description: "Special adhesive for acoustic panels",
    price: 12.90,
    originalPrice: 21.90,
    image: GLUE_IMAGE,
  },
]

const CHRISTMAS_UPSELLS: { slug: string; description: string }[] = [
  { slug: "velvet-bow-decoration", description: "Plush rust velvet bow for the tree or door" },
  { slug: "real-winter-berry-wreath", description: "Real berries and foliage for your front door" },
]

export const CHRISTMAS_UPSELL_PRODUCTS_UK: UpsellProduct[] = CHRISTMAS_UPSELLS.flatMap(({ slug, description }) => {
  const product = getChristmasProduct(slug)
  if (!product || product.price === null) return []
  return [
    {
      id: christmasCartId(slug),
      name: product.name,
      description,
      price: product.price,
      image: product.images[0],
      href: `/christmas/${slug}`,
    },
  ]
})

export function getUpsellProductsUk(mainProductId: string | undefined): UpsellProduct[] {
  return mainProductId?.startsWith("xmas-") ? CHRISTMAS_UPSELL_PRODUCTS_UK : UPSELL_PRODUCTS_UK
}

interface UpsellProductsUkProps {
  products?: UpsellProduct[]
  onAddProduct?: (product: UpsellProduct) => void
  onRemoveProduct?: (productId: string) => void
  selectedProducts?: string[]
  className?: string
}

export function UpsellProductsUk({ 
  products = UPSELL_PRODUCTS_UK,
  onAddProduct, 
  onRemoveProduct, 
  selectedProducts = [],
  className = "" 
}: UpsellProductsUkProps) {
  const handleToggle = (product: UpsellProduct) => {
    const isSelected = selectedProducts.includes(product.id)
    
    if (isSelected) {
      onRemoveProduct?.(product.id)
    } else {
      onAddProduct?.(product)
    }
  }

  return (
    <div className={`rounded-xl border border-border bg-white p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Plus className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Add These Too</span>
      </div>

      {/* Products */}
      <div className="space-y-3">
        {products.map((product) => {
          const isSelected = selectedProducts.includes(product.id)
          
          return (
            <div
              key={product.id}
              onClick={() => handleToggle(product)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left cursor-pointer ${
                isSelected 
                  ? "border-primary bg-orange-50" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Product Image */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {product.href ? (
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                    >
                      {product.name}
                    </a>
                  ) : (
                    product.name
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-primary">
                    £{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      £{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Toggle Indicator */}
              <button
                type="button"
                aria-pressed={isSelected}
                aria-label={`${isSelected ? "Remove" : "Add"} ${product.name}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggle(product)
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected 
                  ? "bg-primary text-white" 
                  : "border-2 border-gray-300 bg-white"
              }`}>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
