import { ExternalLink, MailCheck, Truck } from "lucide-react"

const COPY = {
  UK: {
    title: "Track your order",
    codeLabel: "Tracking code",
    pending: "You can follow your delivery at any time using the button below.",
    sentTitle: "Tracking sent to your e-mail",
    sentTo: "We've sent your tracking details to",
    sentNoEmail: "We've sent your tracking details to the e-mail used at checkout. Check your inbox and spam folder.",
    button: "Track my order",
  },
  FR: {
    title: "Suivez votre commande",
    codeLabel: "Code de suivi",
    pending: "Vous pouvez suivre votre livraison à tout moment avec le bouton ci-dessous.",
    sentTitle: "Suivi envoyé par e-mail",
    sentTo: "Nous avons envoyé vos informations de suivi à",
    sentNoEmail: "Nous avons envoyé vos informations de suivi à l'e-mail utilisé lors du paiement. Vérifiez votre boîte de réception et vos spams.",
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

      <div
        role="status"
        className="flex items-start gap-3 rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 mb-3"
      >
        <MailCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-bold text-foreground">{t.sentTitle}</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            {email ? (
              <>
                {t.sentTo} <strong className="text-foreground break-all">{email}</strong>
              </>
            ) : (
              t.sentNoEmail
            )}
          </p>
        </div>
      </div>

      {trackingCode ? (
        <div className="rounded-lg bg-secondary/40 border border-border px-4 py-3 text-center mb-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{t.codeLabel}</p>
          <p className="font-mono text-lg font-bold text-foreground mt-1 select-all">{trackingCode}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t.pending}</p>
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
