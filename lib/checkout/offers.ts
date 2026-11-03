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
  // Highest tier first
  tiers: [
    { minQty: 12, percent: 15 },
    { minQty: 6, percent: 10 },
  ],
  giftId: "glue-kit-uk", // Pro Fixing Adhesive, free from giftMinQty panels
  giftMinQty: 6,
  giftValueCents: 1290,
} as const

export function isBundleOfferActive(now: Date = new Date()): boolean {
  const t = now.getTime()
  return t >= Date.parse(BUNDLE_OFFER.startsAt) && t < Date.parse(BUNDLE_OFFER.endsAt)
}

/** Discount percent for a number of panels (0 when no tier applies or the offer is over). */
export function bundlePercent(panelQty: number, now: Date = new Date()): number {
  if (!isBundleOfferActive(now)) return 0
  const tier = BUNDLE_OFFER.tiers.find((t) => panelQty >= t.minQty)
  return tier ? tier.percent : 0
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
  unitCents: number
  totalCents: number
  fullCents: number
  savingCents: number
  gift: boolean
}

/** Everything the UI and the server need for one panel quantity. */
export function quoteBundle(baseUnitCents: number, panelQty: number, now: Date = new Date()): BundleQuote {
  const percent = bundlePercent(panelQty, now)
  const unitCents = bundleUnitCents(baseUnitCents, percent)
  const fullCents = baseUnitCents * panelQty
  const totalCents = unitCents * panelQty
  return { percent, unitCents, totalCents, fullCents, savingCents: fullCents - totalCents, gift: hasFreeGift(panelQty, now) }
}

export const formatGBP = (cents: number) => `£${(cents / 100).toFixed(2)}`
