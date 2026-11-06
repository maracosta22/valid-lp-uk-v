"use client"

import { useEffect, useRef } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useConfirmedPurchase } from "@/lib/checkout/use-confirmed-purchase"

const PIXELS = {
  UK: { metaPixelId: "1200200552118123", googleAdsSendTo: "AW-16953354830/_coaCO30w_8bEM7U_pM_" },
  FR: { metaPixelId: "1440709523610900", googleAdsSendTo: "AW-16953354830/_coaCO30w_8bEM7U_pM_" },
} as const

const COPY = {
  UK: { title: "Thank you for your order!", body: "Redirecting you to your order tracking…" },
  FR: { title: "Merci pour votre commande !", body: "Redirection vers le suivi de votre commande…" },
} as const

const REDIRECT_DELAY_MS = 1500
const MAX_WAIT_MS = 20000

export default function ThankYouClient({
  sessionId,
  market,
  redirectUrl,
}: {
  sessionId: string
  market: "UK" | "FR"
  redirectUrl: string
}) {
  const { clearCart } = useCart()
  const redirectedRef = useRef(false)

  const goToTracking = (delay: number) => {
    if (redirectedRef.current) return
    redirectedRef.current = true
    setTimeout(() => window.location.replace(redirectUrl), delay)
  }

  useConfirmedPurchase(sessionId, {
    ...PIXELS[market],
    onFinished: () => goToTracking(REDIRECT_DELAY_MS),
  })

  useEffect(() => {
    clearCart()
    try {
      sessionStorage.removeItem("checkout_order_uk")
      sessionStorage.removeItem("checkout_bonus_uk")
      sessionStorage.removeItem("checkout_order_fr")
    } catch {}
    // Safety net if the status check or pixels hang
    const t = setTimeout(() => goToTracking(0), MAX_WAIT_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-screen bg-card flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white border border-border shadow-sm p-6 text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-green-500 mb-3" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-foreground text-balance">{COPY[market].title}</h1>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {COPY[market].body}
        </p>
      </div>
    </main>
  )
}
