"use client"

import { Gift } from "lucide-react"
import { BUNDLE_OFFER, formatGBP, isBundleOfferActive, quoteBundle } from "@/lib/checkout/offers"

/**
 * Early Black Friday bundle picker for the UK Flexible Acoustic Panel.
 * Display only: it sets the quantity. The discount itself is applied on the server
 * (app/api/stripe/checkout-session) with the same functions, so prices always match.
 * Renders nothing once the offer has ended.
 */
interface BundleSelectorUKProps {
  unitCents: number
  quantity: number
  onQuantityChange: (qty: number) => void
}

export function BundleSelectorUK({ unitCents, quantity, onQuantityChange }: BundleSelectorUKProps) {
  if (!isBundleOfferActive()) return null

  const [tier12, tier6] = BUNDLE_OFFER.tiers
  const options = [
    { key: "single", qty: quantity < tier6.minQty ? quantity : 1, title: `1 to ${tier6.minQty - 1} panels`, selected: quantity < tier6.minQty },
    { key: "six", qty: tier6.minQty, title: `${tier6.minQty} panels`, selected: quantity >= tier6.minQty && quantity < tier12.minQty },
    { key: "twelve", qty: tier12.minQty, title: `${tier12.minQty} panels`, selected: quantity >= tier12.minQty, badge: "Most popular" },
  ]

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="rounded-3xl bg-foreground text-background px-4 py-3">
        <p className="text-sm font-semibold">Early Black Friday: buy more, save more</p>
        <p className="text-xs opacity-80">
          Save {tier6.percent}% on {tier6.minQty}+ panels and {tier12.percent}% on {tier12.minQty}+, with free adhesive. Ends 30 November.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-semibold">Choose your bundle</legend>
        {options.map((o) => {
          const q = quoteBundle(unitCents, o.qty)
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={o.selected}
              onClick={() => onQuantityChange(o.qty)}
              className={`relative w-full text-left rounded-3xl p-4 flex gap-3 items-start transition-colors ${
                o.selected ? "border-2 border-primary bg-white" : "border border-border bg-card hover:bg-white"
              }`}
            >
              {o.badge && (
                <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                  {o.badge}
                </span>
              )}
              <span
                className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
                  o.selected ? "border-primary" : "border-muted-foreground/50"
                }`}
              >
                {o.selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </span>
              <span className="flex-1 flex flex-col gap-1">
                <span className="flex justify-between gap-2 items-baseline">
                  <span className="text-base font-semibold">
                    {o.title}
                    {q.percent > 0 && ` · save ${q.percent}%`}
                  </span>
                  <span className="flex gap-2 items-baseline">
                    {q.percent > 0 && <span className="text-sm text-muted-foreground line-through">{formatGBP(q.fullCents)}</span>}
                    <span className="text-base font-bold">{q.percent > 0 ? formatGBP(q.totalCents) : formatGBP(unitCents)}</span>
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatGBP(q.unitCents)} per panel
                  {q.savingCents > 0 && ` · you save ${formatGBP(q.savingCents)}`}
                </span>
                {q.gift && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    <Gift className="h-4 w-4" aria-hidden="true" />
                    Free Pro Fixing Adhesive (worth {formatGBP(BUNDLE_OFFER.giftValueCents)})
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </fieldset>
    </div>
  )
}
