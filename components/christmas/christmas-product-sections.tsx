import Image from "next/image"
import Link from "next/link"
import { Lightbulb, Plus, Ruler, SlidersHorizontal, Sparkles, TreePine, type LucideIcon } from "lucide-react"
import type { ChristmasIcon, ChristmasProduct } from "@/lib/christmas"

const PANEL_PHOTO =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/flexible%20acustic%20panel-fIRiWckcEuGm5PWQUPK5qg0VWTtxPO.jpg"

const icons: Record<ChristmasIcon, LucideIcon> = {
  height: Ruler,
  lights: Lightbulb,
  colours: Sparkles,
  remote: SlidersHorizontal,
  tree: TreePine,
}

function IconCircle({ icon, className = "size-8" }: { icon: ChristmasIcon; className?: string }) {
  const Icon = icons[icon]
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-muted ${className}`}>
      <Icon className="size-4 text-primary" aria-hidden="true" />
    </span>
  )
}

export function ChristmasHighlights({ items }: { items: NonNullable<ChristmasProduct["highlights"]> }) {
  return (
    <ul className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap">
      {items.map((h) => (
        <li key={h.label} className="flex items-center gap-3 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4">
          <IconCircle icon={h.icon} />
          <span className="text-sm font-medium">{h.label}</span>
        </li>
      ))}
    </ul>
  )
}

export function ChristmasLoveIt({ items }: { items: NonNullable<ChristmasProduct["loveIt"]> }) {
  return (
    <section aria-labelledby="love-it" className="flex flex-col gap-6">
      <h2 id="love-it" className="font-serif text-3xl sm:text-4xl">
        {"Why you'll love it"}
      </h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {items.map((f) => (
          <li key={f.title} className="flex flex-col gap-3 rounded-3xl bg-card p-6">
            <IconCircle icon={f.icon} className="size-10" />
            <h3 className="font-serif text-2xl">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ChristmasStepsAndSpecs({ product }: { product: ChristmasProduct }) {
  const { steps, specs } = product
  if (!steps && !specs) return null
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      {steps && (
        <section aria-labelledby="steps" className="flex flex-col gap-6">
          <h2 id="steps" className="font-serif text-3xl sm:text-4xl">
            Up in three steps
          </h2>
          <ol className="flex flex-col gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
      {specs && (
        <section aria-labelledby="details" className="flex flex-col gap-4 rounded-3xl bg-card p-6 sm:p-8">
          <h2 id="details" className="font-serif text-3xl">
            Details
          </h2>
          <dl className="flex flex-col">
            {specs.map((s) => (
              <div key={s.label} className="grid grid-cols-2 gap-4 border-b border-border py-3 text-sm last:border-b-0">
                <dt className="font-medium">{s.label}</dt>
                <dd className="text-muted-foreground">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}

export function ChristmasPairWithPanel() {
  return (
    <section aria-labelledby="pair-panel" className="relative overflow-hidden rounded-[2rem]">
      <div className="relative aspect-[4/5] sm:aspect-[16/7]">
        <Image
          src={PANEL_PHOTO}
          alt="Living room decorated for Christmas with a flexible slat wall panel"
          fill
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-auto sm:left-6 sm:top-1/2 sm:max-w-md sm:-translate-y-1/2">
        <div className="glass-strong flex flex-col gap-3 rounded-3xl p-5 sm:p-8">
          <p className="text-xs font-semibold text-accent">Complete the room</p>
          <h2 id="pair-panel" className="font-serif text-3xl leading-tight text-balance">
            Christmas looks better against wood
          </h2>
          <p className="hidden text-sm leading-relaxed text-muted-foreground sm:block">
            Pair your tree with a warm slat wall. Our Flexible Acoustic Panel goes up in an afternoon.
          </p>
          <Link
            href="/product/flexible-acoustic-panel-uk"
            className="mt-1 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:self-start"
          >
            Shop the Flexible Acoustic Panel
          </Link>
        </div>
      </div>
    </section>
  )
}

export function ChristmasFaq({ items }: { items: NonNullable<ChristmasProduct["faq"]> }) {
  return (
    <section aria-labelledby="faq" className="flex max-w-3xl flex-col gap-6">
      <h2 id="faq" className="font-serif text-3xl sm:text-4xl">
        Questions
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((f, i) => (
          <details key={f.q} open={i === 0} className="group rounded-3xl bg-card px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <Plus className="size-4 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
