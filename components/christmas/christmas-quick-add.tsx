"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { christmasCartId, type ChristmasProduct } from "@/lib/christmas"
import { cn } from "@/lib/utils"

export function ChristmasQuickAdd({ product, className }: { product: ChristmasProduct; className?: string }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [added, setAdded] = useState(false)

  if (product.price === null || product.price === undefined) return null
  const price = product.price

  const handleAdd = () => {
    addItem(
      {
        id: christmasCartId(product.slug),
        slug: product.slug,
        name: product.name,
        description: product.description ?? product.name,
        longDescription: "",
        price,
        currency: "GBP",
        category: "christmas",
        images: product.images,
        features: [],
        inStock: true,
      },
      1,
    )
    toast({ title: "Added to cart!", description: product.name })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className={cn(
        "flex size-8 items-center justify-center rounded-full border border-foreground/20 text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        added && "border-foreground bg-foreground text-background",
        className,
      )}
    >
      {added ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Plus className="size-4" aria-hidden="true" />
      )}
    </button>
  )
}
