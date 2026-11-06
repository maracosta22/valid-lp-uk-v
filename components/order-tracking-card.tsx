import { ExternalLink, Truck } from "lucide-react"

const COPY = {
  UK: {
    title: "Track your order",
    codeLabel: "Tracking code",
    pending: "Your tracking code has been sent to your e-mail. You can follow your delivery at any time.",
    sentTo: "Tracking details sent to",
    button: "Track my order",
  },
  FR: {
    title: "Suivez votre commande",
    codeLabel: "Code de suivi",
    pending: "Votre code de suivi a été envoyé par e-mail. Vous pouvez suivre votre livraison à tout moment.",
    sentTo: "Informations de suivi envoyées à",
    button: "Suivre ma commande",
  },
} as const

export function OrderTrackingCard({
  market,
  trackingUrl,
  trackingCode,
  email,
}: {
  market: "UK" | "FR"
  trackingUrl: string
  trackingCode: string | null
  email: string | null
}) {
  const t = COPY[market]
  return (
    <section aria-labelledby="tracking-title" className="rounded-xl bg-white border border-border shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
        <h2 id="tracking-title" className="text-base font-bold text-foreground">{t.title}</h2>
      </div>

      {trackingCode ? (
        <div className="rounded-lg bg-secondary/40 border border-border px-4 py-3 text-center mb-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.codeLabel}</p>
          <p className="font-mono text-lg font-bold text-foreground mt-1 select-all">{trackingCode}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.pending}</p>
      )}

      {email && (
        <p className="text-xs text-muted-foreground mb-3">
          {t.sentTo} <strong>{email}</strong>
        </p>
      )}

      <a
        href={trackingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm py-3 transition-colors"
      >
        {t.button}
        <ExternalLink className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      </a>
    </section>
  )
}
