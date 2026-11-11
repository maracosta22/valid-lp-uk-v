"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { usePathname } from "next/navigation"
import { ShoppingCart, Lock } from "lucide-react"

interface StickyCartBarUKProps {
  product?: any
  onFinalizeOrder?: () => void
}

export function StickyCartBarUK({ product, onFinalizeOrder }: StickyCartBarUKProps) {
  const [visible, setVisible] = useState(false)
  const { totalItems, totalPrice, openCart } = useCart()
  const pathname = usePathname()
  const hasItemsInCart = totalItems > 0
  
  // Hide sticky bar on checkout page
  const isCheckoutPage = pathname?.includes("/checkout")

  useEffect(() => {
    const heroBottom = document.querySelector("[data-add-to-cart]")
    if (!heroBottom) return

    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    })
    observer.observe(heroBottom)
    return () => observer.disconnect()
  }, [])

  const handleChoosePack = () => {
    const addButton = document.querySelector("[data-add-to-cart]") as HTMLElement
    if (addButton) {
      addButton.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const handleFinishOrder = () => {
    if (onFinalizeOrder) {
      onFinalizeOrder()
      return
    }

    openCart()
  }

  // Hide completely on mobile (< 768px) to prevent overlap issues
  return (
    <div
      className={`hidden md:flex fixed left-0 right-0 z-[9999] bg-foreground border-t border-white/10 px-4 py-3 transition-all duration-300 ${
        visible && hasItemsInCart && !isCheckoutPage ? "bottom-0" : "-bottom-24"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      <div className="max-w-[1200px] mx-auto items-center justify-between gap-4 flex-wrap">
        {hasItemsInCart && (
          <>
            {/* Cart has items - show finalize order */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-card">{totalItems} item{totalItems > 1 ? "s" : ""} in your basket</span>
                <span className="text-xs text-card/60">Ready to dispatch</span>
              </div>
            </div>

            {/* Total price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-card">Total: £{totalPrice.toFixed(2)}</span>
            </div>

            {/* Finalize CTA */}
            <button
              type="button"
              onClick={handleFinishOrder}
              className="px-6 py-2.5 bg-[#22C55E] text-white rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#16A34A] active:scale-[0.97] transition-all flex-1 sm:flex-none text-center flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Complete my order
            </button>
          </>
        )}
      </div>
    </div>
  )
}
