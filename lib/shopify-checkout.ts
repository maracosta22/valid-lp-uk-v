// Shopify checkout bridge.
// Maps every product sold on this site to its Shopify variant ID
// (store: get.wooddecouk.com) and builds a Shopify cart permalink
// (/cart/VARIANT:QTY,VARIANT:QTY) that opens the Shopify checkout
// with all products and quantities pre-filled.

export const SHOPIFY_STORE_URL = "https://get.wooddecouk.com"

/** Shopify product handle -> default variant ID */
export const SHOPIFY_VARIANTS_BY_HANDLE: Record<string, number> = {
  // Wall panels / decor / lighting
  "flexible-acoustic-panel-uk": 67932408152255,
  "flexible-acoustic-panel": 67926344106175, // Natural
  "oak-slat-wall-panel": 67926344270015,
  "walnut-acoustic-panel": 67926344302783,
  "minimalist-arc-lamp": 67926344499391,
  "organic-ceramic-vase": 67926344532159,
  "recessed-led-strip-lighting": 67926344564927,
  "recessed-led-strip-lighting-uk": 67926344663231,
  "recessed-led-strip-lighting-fr": 67932408053951,
  "wall-preparation-cleaner": 67926344597695,
  "wall-preparation-cleaner-uk": 67926344630463,
  "colour-samples": 67926344892607, // Tauari Black Felt

  // Christmas
  "2ft-rattan-tree": 67932408185023,
  "8ft-pre-lit-grand-fir-christmas-tree": 67926344695999,
  "green-grand-fir-7ft-prelit-christmas-tree": 67932408250559,
  "laura-ashley-green-6ft-pre-lit-frosted-christmas-tree": 67932408316095,
  "laura-ashley-green-7ft-pre-lit-dew-drop-christmas-tree": 67932408348863,
  "light-up-bristle-treescape-decoration": 67932408512703,
  "scallop-rattan-tree-skirt": 67932408578239,
  "textured-tinsel-tree-skirt": 67932408676543,
  "10-pack-flocked-oversized-shatterproof-baubles": 67926344728767,
  "50-pack-glass-baubles": 67932408709311,
  "6-pack-satin-stripe-baubles": 67932408742079,
  "80-pack-mix-shatterproof-baubles": 67932408774847,
  "9-pack-flocked-ridged-baubles": 67932408840383,
  "3-pack-velvet-bows": 67932408873151,
  "velvet-bow-decoration": 67932408905919,
  "6ft-light-up-green-garland": 67926344761535,
  "pre-lit-red-berry-garland": 67926344794303,
  "velvet-bell-and-bow-garland": 67932409168063,
  "autumn-bow-garland": 67932409200831,
  "plain-bow-wreath": 67932409233599,
  "real-winter-berry-wreath": 67926344859839,
  "red-berry-wreath": 67932409331903,
  "set-of-3-mini-bow-wreaths": 67932409364671,
  "300-bright-white-led-mains-lights": 67926344827071,
  "6-pack-light-up-clip-on-candle-decorations": 67932409397439,
  "scalloped-rattan-extra-large-pendant-light": 67932409430207,
  "pure-cotton-astley-floral-christmas-bedding-set": 67932409462975,
}

/** Site product ID -> Shopify product handle */
const SITE_ID_TO_HANDLE: Record<string, string> = {
  prod_UK_flexible_acoustic: "flexible-acoustic-panel-uk",
  prod_U4kuSjp9pwoOzo: "flexible-acoustic-panel",
  prod_U4kuz3MBgNjf76: "oak-slat-wall-panel",
  prod_U4kuODmzE1memh: "walnut-acoustic-panel",
  prod_U4kuzRsw3B5dBe: "minimalist-arc-lamp",
  prod_U4kuu8uiPc6s44: "organic-ceramic-vase",
  prod_U4kv4CKxEyo0xu: "recessed-led-strip-lighting",
  prod_U4kvhZVdMgj3T5: "wall-preparation-cleaner",
  prod_U2rv6g1To7VPTZ: "recessed-led-strip-lighting-fr",
  prod_UK_wall_cleaner: "wall-preparation-cleaner-uk",
  prod_UK_led_strip: "recessed-led-strip-lighting-uk",
  // Checkout upsells
  "led-kit-uk": "recessed-led-strip-lighting-uk",
}

/** Resolve a site product ID (or slug) to its Shopify variant ID. */
export function getShopifyVariantId(productId: string, slug?: string): number | null {
  if (!productId && !slug) return null
  // Christmas items use "xmas-<slug>" or "xmas-<slug>--<optionIndex>"
  let key = productId || ""
  if (key.startsWith("xmas-")) key = key.slice(5).split("--")[0]
  const handle = SITE_ID_TO_HANDLE[key] || key
  return SHOPIFY_VARIANTS_BY_HANDLE[handle] ?? (slug ? SHOPIFY_VARIANTS_BY_HANDLE[slug] ?? null : null)
}

export interface ShopifyLine {
  variantId: number
  quantity: number
}

type CartLike = { product: { id: string; slug?: string }; quantity: number }

/** Convert cart items into Shopify lines (merging duplicates). Unmapped items are skipped. */
export function toShopifyLines(items: CartLike[]): ShopifyLine[] {
  const lines = new Map<number, number>()
  for (const item of items) {
    if (!item?.product) continue
    const variantId = getShopifyVariantId(item.product.id, item.product.slug)
    const qty = Math.max(1, Math.round(Number(item.quantity) || 1))
    if (!variantId) {
      console.warn("[shopify] No Shopify variant mapped for product:", item.product.id)
      continue
    }
    lines.set(variantId, (lines.get(variantId) || 0) + qty)
  }
  return Array.from(lines, ([variantId, quantity]) => ({ variantId, quantity }))
}

/** Build the Shopify cart permalink that opens checkout with every line. */
export function buildShopifyCheckoutUrl(items: CartLike[]): string | null {
  const lines = toShopifyLines(items)
  if (lines.length === 0) return null
  const path = lines.map((l) => `${l.variantId}:${l.quantity}`).join(",")
  return `${SHOPIFY_STORE_URL}/cart/${path}`
}

const STORAGE_KEY = "shopify-cart-lines"

/** Persist the cart as Shopify lines (variant ID + quantity). */
export function saveShopifyCart(items: CartLike[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toShopifyLines(items)))
  } catch {}
}

/** Send the shopper to the Shopify checkout. Returns false if nothing could be mapped. */
export function redirectToShopifyCheckout(items: CartLike[]): boolean {
  const url = buildShopifyCheckoutUrl(items)
  if (!url) return false
  saveShopifyCart(items)
  window.location.href = url
  return true
}
