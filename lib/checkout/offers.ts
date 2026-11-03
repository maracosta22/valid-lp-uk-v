/**
 * Early Black Friday bundles (UK Flexible Acoustic Panel).
 * Pure functions, used by BOTH the server (checkout price) and the UI (display),
 * so the price the customer sees is exactly the price Stripe charges.
 * The server is the source of truth: the browser always sends the normal price.
 */
export const BUNDLE_OFFER = {
  productIds: ["prod_UK_flexible_acoustic"],
  // Offer window (UTC). London is on GMT in November, so this is midnight UK time.
  startsAt: "2026-11-03T00:00:00Z",
  endsAt: "2026-12-01T00:00:00Z", // ends at the end of 30 November
  // Highest tier first. A tier is either a % off, or a fixed price for a pack of minQty panels
  // (scaled proportionally above minQty); its "save %" is derived from the full price.
  tiers: [
    { minQty: 12, packCents: 10190 },
    { minQty: 6, percent: 10 },
  ] as ReadonlyArray<{ minQty: number; percent?: number; packCents?: number }>,
  giftId: "glue-kit-uk", // Pro Fixing Adhesive, free from giftMinQty panels
  giftMinQty: 6,
  giftValueCents: 1290,
} as const

export function isBundleOfferActive(now: Date = new Date()): boolean {
  const t = now.getTime()
  return t >= Date.parse(BUNDLE_OFFER.startsAt) && t < Date.parse(BUNDLE_OFFER.endsAt)
}

function bundleTier(panelQty: number, now: Date) {
  if (!isBundleOfferActive(now)) return undefined
  return BUNDLE_OFFER.tiers.find((t) => panelQty >= t.minQty)
}

/** Discounted unit price in pence, rounded DOWN so the customer always gets at least the advertised %. */
export function bundleUnitCents(baseUnitCents: number, percent: number): number {
  return Math.floor((baseUnitCents * (100 - percent)) / 100)
}

export function hasFreeGift(panelQty: number, now: Date = new Date()): boolean {
  return isBundleOfferActive(now) && panelQty >= BUNDLE_OFFER.giftMinQty
}

export interface BundleQuote {
  percent: number
  /** Per-panel price (rounded down). With a fixed pack price, totalCents may exceed unitCents × qty by a few pence. */
  unitCents: number
  totalCents: number
  fullCents: number
  savingCents: number
  gift: boolean
}

/** Everything the UI and the server need for one panel quantity. */
export function quoteBundle(baseUnitCents: number, panelQty: number, now: Date = new Date()): BundleQuote {
  const tier = bundleTier(panelQty, now)
  const fullCents = baseUnitCents * panelQty
  const gift = hasFreeGift(panelQty, now)

  if (tier?.packCents && panelQty > 0) {
    const totalCents = Math.min(fullCents, Math.round((tier.packCents * panelQty) / tier.minQty))
    const savingCents = fullCents - totalCents
    const percent = fullCents > 0 ? Math.round((savingCents * 100) / fullCents) : 0
    return { percent, unitCents: Math.floor(totalCents / panelQty), totalCents, fullCents, savingCents, gift }
  }

  const percent = tier?.percent ?? 0
  const unitCents = bundleUnitCents(baseUnitCents, percent)
  const totalCents = unitCents * panelQty
  return { percent, unitCents, totalCents, fullCents, savingCents: fullCents - totalCents, gift }
}

export const formatGBP = (cents: number) => `£${(cents / 100).toFixed(2)}`
