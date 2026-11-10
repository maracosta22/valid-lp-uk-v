import type React from "react"
import type { Metadata } from "next"
import { Manrope, Cormorant_Garamond } from "next/font/google"
import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _inter = Manrope({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600", "700"] })
const _playfair = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-playfair", weight: ["500", "600"] })

export const metadata: Metadata = {
  title: "SLATURA WOOD | Premium Wood Acoustic Panels & Interior Design",
  description:
    "Premium wood slat wall panels, acoustic solutions and curated interior decor. European craftsmanship for modern interiors.",
  keywords: ["wood panels", "acoustic panels", "interior design", "home decor", "premium wall panels"],
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB" className={`${_inter.variable} ${_playfair.variable} bg-background`}>
      <head />

      <body className="font-sans antialiased">
        <ScrollToTop />
        <Suspense fallback={null}>
          <CartProvider>
            <Header />
            <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
            <Footer />
          </CartProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  )
}
