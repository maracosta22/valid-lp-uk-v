import type React from "react"
import type { Metadata } from "next"
import { Manrope, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MetaPixelProvider } from "@/components/meta-pixel-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"
import { StripeJsLoader } from "@/components/stripe-js-loader"
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
  const metaPixelId = "1200200552118123" // Meta Pixel
  
  return (
    <html lang="en-GB" className={`${_inter.variable} ${_playfair.variable} bg-background`}>
      <head>
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="ihv7koj9hajrwhdhclgubwhbfk6c22" />
  <meta name="facebook-domain-verification" content="o168gy6xbkk4t0d9j9043h32dmkaw9" />

        {/* Meta Pixel Code - Both Pixels initialized together with Advanced Matching */}
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            // Get stored user data for Advanced Matching if available
            var storedEmail = '';
            var storedPhone = '';
            var storedFn = '';
            var storedLn = '';
            try {
              var userData = localStorage.getItem('meta_user_data');
              if (userData) {
                var parsed = JSON.parse(userData);
                storedEmail = parsed.em || '';
                storedPhone = parsed.ph || '';
                storedFn = parsed.fn || '';
                storedLn = parsed.ln || '';
              }
            } catch(e) {}
            
            // Build Advanced Matching object (only include non-empty values)
            var advancedMatching = {};
            if (storedEmail) advancedMatching.em = storedEmail;
            if (storedPhone) advancedMatching.ph = storedPhone;
            if (storedFn) advancedMatching.fn = storedFn;
            if (storedLn) advancedMatching.ln = storedLn;
            
            fbq('init', '${metaPixelId}', advancedMatching);
            fbq('track', 'PageView');
          `}
        </Script>
        {/* Noscript fallback for Meta Pixel */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-E72RJSKTZ3" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E72RJSKTZ3');
          `}
        </Script>

        {/* Google Tag Manager - Additional ID */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-VT8NSCZQ0J" strategy="afterInteractive" />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VT8NSCZQ0J');
          `}
        </Script>

        {/* Google Ads Conversion Tag */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-16953354830" strategy="afterInteractive" />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16953354830');
          `}
        </Script>

        {/* Google Ads Conversion Tag - AW-829407887 */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-829407887" strategy="afterInteractive" />
        <Script id="google-ads-tag-829407887" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-829407887');
          `}
        </Script>

        {/* Google Ads Conversion Tag - AW-11316024864 */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-11316024864" strategy="afterInteractive" />
        <Script id="google-ads-tag-11316024864" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11316024864');
          `}
        </Script>

        {/* TikTok Pixel Code */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('D5P3D9BC77U3OQH693UG');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      </head>

      <body className="font-sans antialiased">
        <ScrollToTop />
        <Suspense fallback={null}>
          <MetaPixelProvider>
            <CartProvider>
              <Header />
              <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
              <Footer />
            </CartProvider>
          </MetaPixelProvider>
        </Suspense>
        <Toaster />
        <StripeJsLoader />
        <Analytics />
      </body>
    </html>
  )
}
