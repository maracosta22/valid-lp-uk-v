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
const configuredPixelId = process.env.META_PIXEL_ID?.trim()
const metaPixelId = configuredPixelId && /^\d+$/.test(configuredPixelId) ? configuredPixelId : "1200200552118123"

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');var metaPageViewId='pv_'+Date.now()+'_'+Math.random().toString(36).slice(2);fbq('track','PageView',{}, {eventID:metaPageViewId});fetch('/api/meta/event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_name:'PageView',event_id:metaPageViewId,event_source_url:window.location.href})}).catch(function(){});`,
          }}
        />
      </head>

      <body className="font-sans antialiased">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
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
