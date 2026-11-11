"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { products } from "@/lib/products"
import { formatPrice } from "@/lib/price"
import { quoteBundle } from "@/lib/checkout/offers"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function CartDrawer() {
  const { items, totalItems, isCartOpen, setCartOpen, addItem, removeItem, updateQuantity } = useCart()
  const router = useRouter()
  const getItemTotal = (productId: string, unitPrice: number, quantity: number) => {
    if (productId === "prod_UK_flexible_acoustic") {
      return quoteBundle(Math.round(unitPrice * 100), quantity).totalCents / 100
    }
    return unitPrice * quantity
  }
  const subtotal = items.reduce(
    (sum, item) => sum + getItemTotal(item.product.id, item.product.price, item.quantity),
    0,
  )
  const currency = items[0]?.product.currency || "GBP"
  const suggestions = products
    .filter(
      (product) =>
        product.inStock &&
        product.currency === currency &&
        !items.some((item) => item.product.id === product.id),
    )
    .slice(0, 4)

  const goToCheckout = () => {
    setCartOpen(false)
    router.push(currency === "EUR" ? "/checkout-fr" : currency === "GBP" ? "/checkout-uk" : "/cart")
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full gap-0 border-l border-border bg-background p-0 sm:max-w-[480px]">
        <SheetHeader className="border-b border-border px-5 py-4 pr-16">
          <SheetTitle className="text-left text-xl font-medium">Your cart ({totalItems})</SheetTitle>
          <SheetDescription className="sr-only">Review items in your cart and continue to checkout.</SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <ShoppingBag className="size-8 text-muted-foreground" aria-hidden="true" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add a product to continue with your order.</p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-border px-5">
                {items.map(({ product, quantity }) => {
                  const itemTotal = getItemTotal(product.id, product.price, quantity)
                  const isPanel = product.id === "prod_UK_flexible_acoustic"
                  const hasFreeGift = isPanel && quoteBundle(Math.round(product.price * 100), quantity).gift

                  return (
                  <li key={product.id} className="flex gap-3 py-4">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={64}
                      height={76}
                      unoptimized
                      className="size-20 shrink-0 rounded-md bg-secondary object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold leading-snug">{product.name}</h3>
                        <span className="shrink-0 text-sm font-semibold">
                          {formatPrice(itemTotal, product.currency)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatPrice(itemTotal / quantity, product.currency)} each
                      </p>
                      {hasFreeGift && (
                        <span className="mt-2 inline-flex rounded-md bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-800">
                          FREE GIFT · Pro Fixing Adhesive
                        </span>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-9"
                          aria-label={`Decrease quantity of ${product.name}`}
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus />
                        </Button>
                        <span className="min-w-6 text-center text-sm" aria-label={`Quantity ${quantity}`}>
                          {quantity}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-9"
                          aria-label={`Increase quantity of ${product.name}`}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus />
                        </Button>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="ml-1 h-auto px-1 text-xs text-muted-foreground"
                          onClick={() => removeItem(product.id)}
                        >
                          <Trash2 data-icon="inline-start" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                  )
                })}
              </ul>

              {suggestions.length > 0 && (
                <section className="border-y border-border bg-secondary/40 px-5 py-4" aria-labelledby="cart-recommendations-title">
                  <h2 id="cart-recommendations-title" className="mb-3 font-semibold">Complete your project</h2>
                  <ul className="flex flex-col gap-2">
                    {suggestions.map((product) => (
                      <li key={product.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={52}
                          height={60}
                          unoptimized
                          className="size-14 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{product.name}</p>
                          <p className="mt-1 text-xs font-medium">{formatPrice(product.price, product.currency)}</p>
                        </div>
                        <Button type="button" size="sm" className="rounded-full" onClick={() => addItem(product, 1)}>
                          <Plus data-icon="inline-start" />
                          Add
                        </Button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>

        <footer className="border-t border-border bg-background px-5 py-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-medium">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal, currency)}</span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">Shipping and final prices calculated at checkout.</p>
          <Button className="h-12 w-full rounded-full font-semibold" disabled={items.length === 0} onClick={goToCheckout}>
            Secure checkout →
          </Button>
          <SheetClose asChild>
            <button type="button" className="mt-3 w-full py-1 text-sm hover:underline">
              Continue shopping
            </button>
          </SheetClose>
        </footer>
      </SheetContent>
    </Sheet>
  )
}
