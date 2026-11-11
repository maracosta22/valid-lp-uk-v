"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export default function FlexibleAcousticCartUkPage() {
  const { totalItems, openCart } = useCart()

  useEffect(() => {
    openCart()
  }, [openCart])

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-3xl flex-col items-center justify-center px-5 py-12 text-center">
      <ShoppingCart className="mb-5 size-8 text-primary" aria-hidden="true" />
      <h1 className="font-serif text-3xl font-semibold">Your cart</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {totalItems === 1 ? "1 item is" : `${totalItems} items are`} ready for review.
      </p>
      <Button type="button" className="mt-6 rounded-full px-6" onClick={openCart}>
        Review cart
      </Button>
      <Link href="/product/flexible-acoustic-panel-uk" className="mt-4 text-sm text-muted-foreground underline underline-offset-4">
        Continue shopping
      </Link>
    </section>
  )
}
