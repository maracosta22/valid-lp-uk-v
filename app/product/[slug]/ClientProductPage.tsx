"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Check, Star, Info, ArrowLeft, Truck, RotateCcw, Shield } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { products } from "@/lib/products"
import { ProductGallery } from "@/components/product-gallery"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ColorSelector } from "@/components/color-selector"
import { StyleSelector } from "@/components/style-selector"
import { LedStripCarousel } from "@/components/led-strip-carousel"
import { ProductDescriptionSection } from "@/components/product-description-section"
import { CustomerReviews } from "@/components/customer-reviews"
import { ViewContentTracker } from "@/components/view-content-tracker"
import { useScrollVisibility } from "@/hooks/use-scroll-visibility"
import { PeopleViewing } from "@/components/people-viewing"
import { ProductCard } from "@/components/product-card" // Added import for ProductCard
import { RecessedLedSection } from "@/components/recessed-led-section"
import { SamplesSection } from "@/components/samples-section"
import { ChristmasPanelCarousel } from "@/components/christmas/christmas-panel-carousel"
import { AcousticLineSection } from "@/components/acoustic-line-section"
import { CountdownTimerFr } from "@/components/countdown-timer-fr"
import { ExitIntentPopupFr } from "@/components/exit-intent-popup-fr"
import { CountdownTimer } from "@/components/countdown-timer"
import { ExitIntentPopup } from "@/components/exit-intent-popup"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { PanelCalculatorFr } from "@/components/panel-calculator-fr"
import { StickyCartBarFr } from "@/components/sticky-cart-bar-fr"
import { FAQSectionFr } from "@/components/faq-section-fr"
import { StockUrgencyBarFr } from "@/components/stock-urgency-bar-fr"
import { SocialProofInlineFr } from "@/components/social-proof-inline-fr"
import { RatingBreakdownFr } from "@/components/rating-breakdown-fr"
import { SalesNotificationToast } from "@/components/sales-notification-toast"

import { BonusProgressBar } from "@/components/bonus-progress-bar"
import { VideoGalleryFr } from "@/components/video-gallery-fr"
// UK components
import { PanelCalculatorUK } from "@/components/panel-calculator-uk"
import { StickyCartBarUK } from "@/components/sticky-cart-bar-uk"
import { FAQSectionUK } from "@/components/faq-section-uk"
import { StockUrgencyBarUK } from "@/components/stock-urgency-bar-uk"
import { SocialProofInlineUK } from "@/components/social-proof-inline-uk"
import { RatingBreakdownUK } from "@/components/rating-breakdown-uk"

import { VideoGalleryUK } from "@/components/video-gallery-uk"

interface ClientProductPageProps {
  product: any
  relatedProducts: any[]
  decorAndLightingProducts: any[]
  frequentlyBoughtTogether: any[]
  frequentlyBoughtTotal: number
  orderBumpProducts: any[]
  isFlexibleAcousticPanel: boolean
  isRecessedLedStrip?: boolean
  discountPercent: number
  isFrenchVersion?: boolean
  isUKVersion?: boolean
}

// French translations for UI text
const frenchTranslations = {
  backToProducts: "Retour aux produits",
  inStock: "En stock",
  outOfStock: "Rupture de stock",
  limitedStock: "Stock limite - Commandez maintenant!",
  selectColor: "Selectionnez la couleur",
  selectStyle: "Selectionnez le style",
  features: "Caracteristiques",
  dimensions: "Dimensions",
  material: "Materiau",
  freeShipping: "Livraison gratuite",
  freeShippingDesc: "Livraison gratuite sur toutes les commandes",
  easyReturns: "Retours faciles",
  easyReturnsDesc: "Retours sous 30 jours",
  securePayment: "Paiement securise",
  securePaymentDesc: "Vos informations sont protegees",
  frequentlyBought: "Frequemment achetes ensemble",
  addBothToCart: "Ajouter les deux au panier",
  youMightLike: "Vous pourriez aussi aimer",
  customerReviews: "Avis clients",
  wasPrice: "etait",
  save: "Economisez",
  off: "de reduction",
}

const englishTranslations = {
  backToProducts: "Back to products",
  inStock: "In stock",
  outOfStock: "Out of stock",
  limitedStock: "Limited Stock - Order Now!",
  selectColor: "Select Color",
  selectStyle: "Select Style",
  features: "Features",
  dimensions: "Dimensions",
  material: "Material",
  freeShipping: "Free Shipping",
  freeShippingDesc: "Free delivery on all orders",
  easyReturns: "Easy Returns",
  easyReturnsDesc: "30-day return policy",
  securePayment: "Secure Payment",
  securePaymentDesc: "Your information is protected",
  frequentlyBought: "Frequently Bought Together",
  addBothToCart: "Add Both to Cart",
  youMightLike: "You Might Also Like",
  customerReviews: "Customer Reviews",
  wasPrice: "was",
  save: "Save",
  off: "off",
}

export default function ClientProductPage({
  product,
  relatedProducts,
  decorAndLightingProducts,
  frequentlyBoughtTogether,
  frequentlyBoughtTotal,
  orderBumpProducts,
  isFlexibleAcousticPanel,
  isRecessedLedStrip = false,
  discountPercent,
  isFrenchVersion = false,
  isUKVersion = false,
}: ClientProductPageProps) {
  const t = isFrenchVersion ? frenchTranslations : englishTranslations
  
  // Determine currency symbol based on version
  const currencySymbol = isFrenchVersion ? "€" : "£"
  const { addItem, totalItems } = useCart()
  const { opacity, isVisible } = useScrollVisibility()
  const [showStickyCta, setShowStickyCta] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // FR Order Summary state — shows after "Commander Maintenant" is clicked
  const [frOrderData, setFrOrderData] = useState<{ qty: number; price: number; totalPrice: number; ledFree: boolean } | null>(null)
  
  // FR: callback when item is added to cart — show toast + scroll to Acoustic Line Section
  const handleFrAddedToCart = (orderData: { qty: number; price: number; totalPrice: number; ledFree: boolean }) => {
    setFrOrderData(orderData)
    toast({
      title: "Produit ajouté !",
      description: `${data.qty} panneau(x) ajouté(s) au panier`,
    })
  }
  
// Sticky CTA: show when main CTA button scrolls out of view (for FR or EN Flexible Acoustic only, not UK)
  useEffect(() => {
  if (!isFrenchVersion && !isFlexibleAcousticPanel) return
  if (isUKVersion) return // UK has no mobile sticky CTA
    const handleScroll = () => {
      const btn = document.querySelector("[data-add-to-cart]") as HTMLElement | null
      if (btn) {
        const rect = btn.getBoundingClientRect()
        setShowStickyCta(rect.bottom < 0)
      }
    }
window.addEventListener("scroll", handleScroll, { passive: true })
  return () => window.removeEventListener("scroll", handleScroll)
  }, [isFrenchVersion, isFlexibleAcousticPanel, isUKVersion])

  const handleAddBothToCart = () => {
    frequentlyBoughtTogether.forEach((bundleProduct) => {
      // addItem expects (product, quantity) - pass the full product object and quantity separately
      addItem(bundleProduct, 1)
    })
    // Show toast confirmation
    toast({
      title: isUKVersion ? "Added to cart!" : isFrenchVersion ? "Ajouté au panier !" : "Added to cart!",
      description: isUKVersion ? `${frequentlyBoughtTogether.length} items added` : isFrenchVersion ? `${frequentlyBoughtTogether.length} articles ajoutés` : `${frequentlyBoughtTogether.length} items added`,
    })
  }

  // FR: Handle "Finaliser Ma Commande" button click - go directly to checkout
  const handleFinalizeOrder = () => {
    // Save the order data so checkout-fr has access to it
    if (frOrderData) {
      const orderData = {
        productId: product.id,
        name: product.name,
        price: frOrderData.price,
        totalPrice: frOrderData.totalPrice,
        quantity: frOrderData.qty,
        image: product.images?.[0] || product.image || "",
        currency: "EUR",
        ledFree: frOrderData.ledFree,
      }
      sessionStorage.setItem("checkout_order_fr", JSON.stringify(orderData))
    }
    router.push("/checkout-fr")
  }

  return (
    <div className="py-8 lg:py-12 overflow-x-hidden max-w-full w-full box-border relative">
      <ViewContentTracker product={product} />

      {/* Sales notification toast — FR and UK */}
      {(isFrenchVersion || isUKVersion) && <SalesNotificationToast isUK={isUKVersion} />}

      {/* Exit intent popup — FR only */}
      {isFrenchVersion && (
        <ExitIntentPopupFr
          onConfirm={() => {
            const btn = document.querySelector("[data-add-to-cart]") as HTMLButtonElement
            if (btn) {
              btn.scrollIntoView({ behavior: "smooth" })
            }
          }}
        />
      )}

      {/* Exit intent popup — EN Flexible Acoustic Panel only (not UK) */}
      {!isFrenchVersion && !isUKVersion && isFlexibleAcousticPanel && (
        <ExitIntentPopup
          onConfirm={() => {
            const btn = document.querySelector("[data-add-to-cart]") as HTMLButtonElement
            if (btn) {
              btn.scrollIntoView({ behavior: "smooth" })
            }
          }}
        />
      )}

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 overflow-hidden w-full">
        {/* Breadcrumb */}
        <Link
          href={isFrenchVersion ? `/product/${product.slug}` : "/products"}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToProducts}
        </Link>

        {/* Product Section */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} video={product.video} videoThumbnail={product.videoThumbnail} videoPosition={product.videoPosition} />

          {/* Details */}
          <div className="flex flex-col min-w-0 w-full overflow-hidden max-w-full">
            {/* Badge */}
            {product.badge && (
              <span
                className={`mb-4 inline-block w-fit px-3 py-1 text-xs font-medium uppercase tracking-wider ${
                  product.onSale ? "bg-accent text-accent-foreground" : "bg-foreground text-background"
                }`}
              >
                {product.onSale ? `${isFrenchVersion ? "Offre de Lancement" : "Launch Offer"}` : product.badge}
              </span>
            )}

            {/* Title & Price */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-balance break-words">{product.name}</h1>

            {/* FR: Benefit subheadline */}
            {isFrenchVersion && isFlexibleAcousticPanel && (
              <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                Le seul panneau qui épouse vos courbes, sans outil, sans artisan, en 30 minutes
              </p>
            )}

            {/* UK: Benefit subheadline */}
            {isUKVersion && isFlexibleAcousticPanel && (
              <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                The only panel that hugs your curves, no tools, no tradesman, in 30 minutes
              </p>
            )}

            {isFlexibleAcousticPanel && (
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">{isFrenchVersion ? "4.9" : "4.8"}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-sky-600 hover:text-sky-700 hover:underline cursor-pointer">
                    ({isFrenchVersion ? "2847 avis verifies" : "1080"})
                  </span>
                </div>
                {/* FR/UK: Enhanced social proof badges */}
                {isFrenchVersion ? (
                  <SocialProofInlineFr />
                ) : isUKVersion ? (
                  <SocialProofInlineUK />
                ) : (
                  <p className="text-sm">
                    <span className="font-semibold">4500+ bought</span>{" "}
                    <span className="text-muted-foreground">in past month</span>
                  </p>
                )}
              </div>
            )}

            {product.onSale && product.originalPrice ? (
              <div className="mt-4">
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-red-600 text-white rounded-sm mb-3">
                  {isFrenchVersion ? "Offre limitee" : "Limited time deal"}
                </span>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl sm:text-2xl font-medium text-red-600">-{discountPercent}%</span>
                  <span className="text-2xl sm:text-3xl font-medium text-foreground">{currencySymbol}{Math.floor(product.price)}</span>
                  <span className="text-sm align-top relative -top-2">
                    {((product.price % 1) * 100).toFixed(0).padStart(2, "0")}
                  </span>
                  {isFlexibleAcousticPanel && (
                    <span className="text-sm sm:text-base text-muted-foreground ml-1">/ {isFrenchVersion ? "piece" : "piece"}</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-sm text-muted-foreground">{isFrenchVersion ? "Prix habituel:" : "Typical price:"}</span>
                  <span className="text-sm text-muted-foreground line-through">
                    {currencySymbol}{product.originalPrice.toFixed(2)}
                  </span>
                  {!isFrenchVersion && (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      -60%
                    </span>
                  )}
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-pointer flex-shrink-0" />
                </div>
                {isFlexibleAcousticPanel && (
                  isFrenchVersion ? (
                    <StockUrgencyBarFr />
                  ) : isUKVersion ? (
                    <StockUrgencyBarUK />
                  ) : (
                    <p className="text-xs text-muted-foreground mt-2">Limited batch / Introductory offer — Only a few batches available</p>
                  )
                )}
                {isFlexibleAcousticPanel && !isFrenchVersion && !isUKVersion && <PeopleViewing isFrench={isFrenchVersion} />}
              </div>
            ) : (
              <div className="mt-4">
                <p className="font-serif text-2xl">{currencySymbol}{product.price}</p>
              </div>
            )}



            {isFlexibleAcousticPanel ? (
              <div className="mt-6 space-y-5 max-w-full overflow-hidden">
                {/* Clear Hero Promise */}
                <div className="bg-secondary/50 border border-border/50 rounded-lg p-4">
                  <p className="text-lg sm:text-xl font-serif font-medium text-foreground leading-snug text-center">
                    {isFrenchVersion 
                      ? "Transformez Votre Mur en Minutes, Sans Outils, Sans Salissure" 
                      : "Transform Your Wall in Minutes, No Tools, No Mess"}
                  </p>
                  <div className="flex justify-center gap-3 mt-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-accent">
                      <Check className="h-3.5 w-3.5" /> {isFrenchVersion ? "Flexible" : "Flexible"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-accent">
                      <Check className="h-3.5 w-3.5" /> {isFrenchVersion ? "Acoustique" : "Acoustic"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-accent">
                      <Check className="h-3.5 w-3.5" /> {isFrenchVersion ? "Auto-Adhesif" : "Peel & Stick"}
                    </span>
                  </div>
                </div>

                {/* How It Works - 3 Steps */}
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-center mb-4">
                    {isFrenchVersion ? "Comment Ca Marche" : "How It Works"}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <span className="text-accent font-bold">1</span>
                      </div>
                      <p className="text-xs font-medium">{isFrenchVersion ? "Decollez l'adhesif" : "Peel the adhesive"}</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <span className="text-accent font-bold">2</span>
                      </div>
                      <p className="text-xs font-medium">{isFrenchVersion ? "Placez & appuyez" : "Place & press"}</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <span className="text-accent font-bold">3</span>
                      </div>
                      <p className="text-xs font-medium">{isFrenchVersion ? "Admirez le resultat" : "Enjoy!"}</p>
                    </div>
                  </div>
                </div>

                <p className="leading-relaxed text-muted-foreground text-sm sm:text-base">
                  {isFrenchVersion 
                    ? "Le panneau acoustique flexible qui sublime votre espace, réduit l'écho et offre un look architectural moderne, sans rénovation."
                    : "The flexible acoustic panel that upgrades your space, reduces echo and delivers a modern architectural look, without renovation."}
                </p>
                
                <ul className="space-y-2.5 pt-2">
                  <li className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>{isFrenchVersion ? "Flexible" : "Flexible"}</strong> : {isFrenchVersion ? "Se plie aux courbes et piliers" : "Bends to curves and pillars"}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>{isFrenchVersion ? "Installation facile" : "Easy Install"}</strong> : {isFrenchVersion ? "Auto-adhésif, sans outils" : "Peel & stick, no tools needed"}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>{isFrenchVersion ? "Sans salissure" : "No Mess"}</strong> : {isFrenchVersion ? "Pas de peinture, pas de poussière" : "No paint, no dust, no hassle"}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>{isFrenchVersion ? "Acoustique" : "Acoustic"}</strong> : {isFrenchVersion ? "Réduit l'écho et améliore le confort sonore" : "Reduces echo and improves sound comfort"}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>{isFrenchVersion ? "Look Premium" : "Premium Look"}</strong> : {isFrenchVersion ? "Esthétique bois haut de gamme" : "High-end wood aesthetic"}</span>
                  </li>
                </ul>
                <div className="pt-2 space-y-1.5 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">{isFrenchVersion ? "Taille:" : "Size:"}</span> 270 × 110 cm, {isFrenchVersion ? "couvre jusqu'à 3m²" : "covers up to 3m²"}
                  </p>
                  <p className="text-xs italic">
                    {isFrenchVersion ? "Parfait pour les murs TV, les murs de caracteristique et les zones d'accent." : "Ideal for TV walls, feature walls and accent areas."}
                  </p>
                  <p className="break-words">
                    <span className="font-medium text-foreground">{isFrenchVersion ? "Couleurs disponibles:" : "Available colors:"}</span> {isFrenchVersion ? "Chene Naturel, Chene Fume, Noyer, Chene Gris" : "Natural Oak, Smoked Oak, Walnut, Grey Oak"}
                  </p>
                </div>

                {/* Certifications & Features Grid */}
                <div className="mt-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-secondary/50 p-3 sm:p-4 text-center">
                    <h4 className="font-semibold text-sm sm:text-base">NRC 0.80</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Excellent Sound Absorption</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 sm:p-4 text-center">
                    <h4 className="font-semibold text-sm sm:text-base">E1 Certified</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Low Formaldehyde Emission</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 sm:p-4 text-center">
                    <h4 className="font-semibold text-sm sm:text-base">Easy Install</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">DIY Friendly Setup</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 sm:p-4 text-center">
                    <h4 className="font-semibold text-sm sm:text-base">6 Colors</h4>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Match Any Interior</p>
                  </div>
                </div>

                <p className="pt-6 text-sm font-semibold text-accent">{isFrenchVersion ? "Sublimez votre espace aujourd'hui." : "Upgrade your space today."}</p>
              </div>
            ) : (
              <p className="mt-6 leading-relaxed text-muted-foreground break-words">{product.longDescription}</p>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && <ColorSelector colors={product.colors} />}
            {product.styles && product.styles.length > 0 && <StyleSelector styles={product.styles} />}

            {/* Add to Cart */}
            <div className="mt-8 flex flex-col gap-3">
              {!isFrenchVersion && !isUKVersion && isFlexibleAcousticPanel && <CountdownTimer />}
              <AddToCartButton 
                product={product} 
                isFrenchVersion={isFrenchVersion} 
                isEnglishFlexibleAcoustic={!isFrenchVersion && !isUKVersion && isFlexibleAcousticPanel}
                isUKVersion={isUKVersion}
                onAddedToCart={isFrenchVersion ? handleFrAddedToCart : undefined}
              />
              {!isFrenchVersion && isFlexibleAcousticPanel && (
                <p className="text-center text-xs text-muted-foreground">
                  Dispatch within 24-48h • Estimated delivery 5-8 business days
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-border pt-8">
              <div className="flex flex-col items-center text-center">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="mt-2 text-[10px] sm:text-xs text-muted-foreground leading-tight">
                  {isFrenchVersion ? "Livraison gratuite" : "Free Shipping"}
                  <br className="sm:hidden" /> {isFrenchVersion ? "des 80€" : "Over £80"}
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span className="mt-2 text-[10px] sm:text-xs text-muted-foreground leading-tight">{isFrenchVersion ? "Retours sous 30 jours" : "30-Day Returns"}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="mt-2 text-[10px] sm:text-xs text-muted-foreground leading-tight">{isFrenchVersion ? "Garantie 5 ans" : "5-Year Warranty"}</span>
              </div>
            </div>

            {/* Frequently Bought Together */}
            {frequentlyBoughtTogether.length > 0 && (
              <div className="mt-8 border-t border-border pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{isFrenchVersion ? "Frequemment achetes ensemble" : "Frequently Bought Together"}</h2>
                <div className="flex flex-col gap-4">
                  {/* Products */}
                  <div className="flex flex-wrap items-center gap-3">
                    {frequentlyBoughtTogether.map((bundleProduct, index) => (
                      <div key={bundleProduct.id} className="flex items-center gap-3">
                        <div className="w-20 sm:w-24 bg-secondary/30 rounded-lg overflow-hidden">
                          <Link href={`/product/${bundleProduct.slug}`} className="block">
                            <div className="aspect-square overflow-hidden">
                              <Image
                                src={bundleProduct.images[0] || "/placeholder.svg"}
                                alt={bundleProduct.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                          <div className="p-1.5">
                            <h3 className="text-[10px] sm:text-xs font-medium leading-tight line-clamp-2">
                              {bundleProduct.name}
                            </h3>
                            <p className="text-[10px] sm:text-xs font-semibold mt-0.5">{currencySymbol}{bundleProduct.price}</p>
                          </div>
                        </div>
                        {index < frequentlyBoughtTogether.length - 1 && (
                          <span className="text-lg font-light text-muted-foreground">+</span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Price & Button */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">{isFrenchVersion ? "Prix total:" : "Total price:"}</p>
                      <p className="text-lg font-semibold">{currencySymbol}{frequentlyBoughtTotal.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors whitespace-nowrap"
                      onClick={handleAddBothToCart}
                    >
                      {isFrenchVersion ? "Ajouter au panier" : "Add Both to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Panel Calculator - FR and UK */}
            {isFrenchVersion && isFlexibleAcousticPanel && <PanelCalculatorFr />}
            {isUKVersion && isFlexibleAcousticPanel && <PanelCalculatorUK />}

            {/* Video Gallery - FR and UK */}
            {isFrenchVersion && isFlexibleAcousticPanel && <VideoGalleryFr />}
            {isUKVersion && isFlexibleAcousticPanel && <VideoGalleryUK />}

            {isUKVersion && isFlexibleAcousticPanel && <ChristmasPanelCarousel />}

            {/* Acoustic Line Section - Only for Flexible Acoustic Panel */}
            {isFlexibleAcousticPanel && (
              <div id="acoustic-line-section" className="scroll-mt-4">
                <AcousticLineSection isFrenchVersion={isFrenchVersion} />
              </div>
            )}

            {/* You Might Also Like - Hide for French version */}
            {orderBumpProducts.length > 0 && !isFrenchVersion && (
              <div className="mt-8 border-t border-border pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">You Might Also Like</h2>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-3 px-3">
                  {orderBumpProducts.map((bumpProduct) => (
                    <div
                      key={bumpProduct.id}
                      className="flex-shrink-0 w-32 sm:w-36 bg-secondary/30 rounded-lg overflow-hidden flex flex-col"
                    >
                      <Link href={`/product/${bumpProduct.slug}`} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={bumpProduct.images[0] || "/placeholder.svg"}
                            alt={bumpProduct.name}
                            width={144}
                            height={144}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          {bumpProduct.badge && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-medium uppercase bg-foreground text-background">
                              {bumpProduct.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                      <div className="p-2 flex flex-col flex-1">
                        <Link href={`/product/${bumpProduct.slug}`}>
                          <h3 className="text-xs font-medium leading-tight h-8 line-clamp-2 hover:text-accent transition-colors">
                            {bumpProduct.name}
                          </h3>
                        </Link>
                        <p className="text-xs font-semibold mt-1">{isFrenchVersion ? "€" : "£"}{bumpProduct.price}</p>
                        <div className="mt-auto pt-2">
                          <AddToCartButton product={bumpProduct} variant="icon" className="w-full h-7 text-xs" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="mt-8 border-t border-border pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider">{t.features}</h2>
              <dl className="mt-4 space-y-3">
                {product.dimensions && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
                    <dt className="text-muted-foreground shrink-0">{t.dimensions}</dt>
                    <dd className="text-foreground break-words">{product.dimensions}</dd>
                  </div>
                )}
                {product.material && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
                    <dt className="text-muted-foreground shrink-0">{t.material}</dt>
                    <dd className="text-foreground break-words">{product.material}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="mt-8 border-t border-border pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider">{t.features}</h2>
                <ul className="mt-4 space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="text-muted-foreground flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* LED Strip Lifestyle Carousel - Only for Recessed LED Strip */}
            {product.id === "prod_led_strip" && <LedStripCarousel />}

            {/* Samples Section - Only for Flexible Acoustic Panel */}
            {isFlexibleAcousticPanel && <SamplesSection isFrenchVersion={isFrenchVersion} />}
          </div>
        </div>

        {/* Product Description Section */}
        {isFlexibleAcousticPanel && <ProductDescriptionSection />}

        {/* FAQ Section - FR and UK - before reviews */}
        {isFrenchVersion && isFlexibleAcousticPanel && (
          <div className="mx-auto max-w-4xl">
            <FAQSectionFr />
          </div>
        )}
        {isUKVersion && isFlexibleAcousticPanel && (
          <div className="mx-auto max-w-4xl">
            <FAQSectionUK />
          </div>
        )}

        {/* Customer Reviews Section with Rating Breakdown for FR and UK */}
        {isFlexibleAcousticPanel && (
          <div className="mt-12 sm:mt-16">
            {isFrenchVersion && <RatingBreakdownFr />}
            {isUKVersion && <RatingBreakdownUK />}
            <CustomerReviews isFrench={isFrenchVersion} isUK={isUKVersion} />
          </div>
        )}

        {/* FR Order Summary — appears after Commander Maintenant is clicked */}
        {isFrenchVersion && frOrderData && (
          <section 
            id="order-summary-fr" 
            className="mt-12 sm:mt-16 scroll-mt-8 border-2 border-primary rounded-xl bg-orange-50/50 p-6 sm:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Récapitulatif de Votre Commande</h2>
            
            {/* Bonus Progress Bar */}
            <BonusProgressBar currentTotal={frOrderData.totalPrice} threshold={100} className="mb-6" />
            
            {/* Product summary */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-orange-200">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-orange-200">
                <Image
                  src={product.images?.[0] || product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base">{product.name}</p>
                <p className="text-sm text-muted-foreground">Qté : {frOrderData.qty}</p>
              </div>
              <p className="text-lg font-bold">€{frOrderData.totalPrice.toFixed(2).replace(".", ",")}</p>
            </div>

            {/* LED kit bonus — shown when total >= €100 */}
            {frOrderData.totalPrice >= 100 && (
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-orange-200 bg-emerald-50 rounded-lg p-3 -mx-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-emerald-300">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LED0101-NcQN4b3GARfX7EQhQSIcnMbQB9NsFa.jpg"
                    alt="Kit Ruban LED Encastré"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-emerald-800">Kit Ruban LED Encastré</p>
                  <p className="text-xs text-emerald-700">Bonus commande +€100 OFFERT</p>
                </div>
                <p className="text-sm font-semibold text-emerald-700 line-through opacity-60">€49,00</p>
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 mb-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Livraison Gratuite</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Retour sous 30 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Paiement 100% Sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Garantie 2 ans</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-6 pt-4 border-t border-orange-200">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">€{frOrderData.totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleFinalizeOrder}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 px-8 transition-colors duration-200 shadow-lg rounded-full"
            >
              <Shield className="h-5 w-5 flex-shrink-0" />
              Finaliser Ma Commande
            </button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Paiement SSL sécurisé • Visa, Mastercard, American Express
            </p>
          </section>
        )}

        

        {/* Recessed LED Strip Section */}
        {isRecessedLedStrip && <RecessedLedSection />}

        {/* Related Products - Hide for French and UK version */}
        {relatedProducts.length > 0 && !isFrenchVersion && !isUKVersion && (
          <section className="mt-16 sm:mt-24">
            <h2 className="mb-6 sm:mb-8 font-serif text-xl sm:text-2xl">You May Also Like</h2>
            <div className="grid gap-4 sm:gap-8 grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}

        {/* Decor & Lighting cross-sell section */}
        {decorAndLightingProducts.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="mb-4 sm:mb-8 font-serif text-xl sm:text-2xl">Complete Your Space</h2>
            <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground">
              Explore our curated selection of decor and lighting to complement your panels.
            </p>
            <div className="grid gap-4 sm:gap-8 grid-cols-2 lg:grid-cols-4">
              {decorAndLightingProducts.map((crossProduct) => (
                <ProductCard key={crossProduct.id} product={crossProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky CTA for Mobile — aparece quando o botão principal sai da tela (FR e EN apenas, não UK) */}
      {isFlexibleAcousticPanel && !isUKVersion && showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden z-30 bg-white border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.12)] px-4 py-3">
          <button
            type="button"
            onClick={() => {
              if (isFrenchVersion) {
                // FR: if Order Summary already visible, scroll to it; otherwise click the add button
                if (frOrderData) {
                  const orderSummary = document.getElementById("order-summary-fr")
                  if (orderSummary) {
                    orderSummary.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                } else {
                  const addButton = document.querySelector("[data-add-to-cart]") as HTMLElement
                  if (addButton) {
                    addButton.scrollIntoView({ behavior: "smooth", block: "center" })
                    addButton.click()
                  }
                }
              } else {
                const addButton = document.querySelector("[data-add-to-cart]") as HTMLButtonElement
                if (addButton) {
                  addButton.scrollIntoView({ behavior: "smooth" })
                }
              }
            }}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-4 transition-colors shadow-lg"
          >
            <ShoppingCart className="h-5 w-5 flex-shrink-0" />
            {isFrenchVersion 
              ? (frOrderData ? "Finaliser Ma Commande" : "Commander Maintenant") 
              : "Order Now £60.00"}
          </button>
          <p className="text-center text-[10px] text-muted-foreground mt-1.5">
            {isFrenchVersion ? "Paiement 100% Sécurisé • Livraison 5-8 jours" : "100% Secure Payment • Delivery 5-8 days"}
          </p>
        </div>
      )}

      {/* Sticky Cart Bar for Desktop - FR and UK */}
      {isFrenchVersion && isFlexibleAcousticPanel && <StickyCartBarFr />}
      {isUKVersion && isFlexibleAcousticPanel && <StickyCartBarUK />}

      
    </div>
  )
}
