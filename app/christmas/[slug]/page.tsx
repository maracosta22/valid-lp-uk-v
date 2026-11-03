import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check } from "lucide-react"
import { CHRISTMAS_ORDER_BY, christmasCategories, christmasProducts, getChristmasProduct } from "@/lib/christmas"
import { ChristmasGallery } from "@/components/christmas/christmas-gallery"
import { ChristmasBuyBox } from "@/components/christmas/christmas-buy-box"
import { ChristmasProductCard } from "@/components/christmas/christmas-product-card"
import { ChristmasReviews } from "@/components/christmas/christmas-reviews"
import { ChristmasQuickAdd } from "@/components/christmas/christmas-quick-add"
import {
  ChristmasFaq,
  ChristmasHighlights,
  ChristmasLoveIt,
  ChristmasPairWithPanel,
  ChristmasStepsAndSpecs,
} from "@/components/christmas/christmas-product-sections"

export function generateStaticParams() {
  return christmasProducts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getChristmasProduct(slug)
  if (!product) return { title: "Christmas | SLATURA WOOD" }
  return {
    title: `${product.name} | Christmas | SLATURA WOOD`,
    description: product.tagline ?? product.description ?? `${product.name} from the Slatura Wood Christmas Collection.`,
  }
}

export default async function ChristmasProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getChristmasProduct(slug)
  if (!product) notFound()

  const category = christmasCategories.find((c) => c.id === product.category)
  const related = christmasProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4)
  const rich = Boolean(product.tagline)
  const alsoBought = christmasProducts
    .filter((p) => p.category === "baubles-bows" && /bauble/i.test(p.name) && p.slug !== product.slug)
    .slice(0, 4)

  return (
    <div className="flex flex-col pb-12 lg:pb-20">
      <p className="bg-accent px-4 py-2.5 text-center text-sm text-accent-foreground">
        <strong className="font-semibold">{`Order by ${CHRISTMAS_ORDER_BY}`}</strong> for delivery before Christmas
      </p>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 pt-6 sm:px-6 lg:gap-20 lg:px-8 lg:pt-10">
        <div className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/christmas" className="hover:text-foreground">
                  Christmas
                </Link>
              </li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/christmas?category=${category.id}`} className="hover:text-foreground">
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
            <ChristmasGallery images={product.images} name={product.name} video={product.video} />

            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex flex-col items-start gap-4">
                {category && (
                  <p className="rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                    {`Christmas 2026 · ${category.name}`}
                  </p>
                )}
                <h1 className="font-serif text-4xl leading-tight text-balance sm:text-5xl">{product.name}</h1>
                {product.tagline && (
                  <p className="leading-relaxed text-muted-foreground text-pretty">{product.tagline}</p>
                )}
              </div>

              <ChristmasBuyBox product={product}>
                {product.highlights && <ChristmasHighlights items={product.highlights} />}
              </ChristmasBuyBox>

              {!rich && product.description && (
                <div className="flex flex-col gap-3 border-t border-border pt-6">
                  <h2 className="font-serif text-xl">Description</h2>
                  <p className="leading-relaxed text-muted-foreground text-pretty">{product.description}</p>
                </div>
              )}

              {!product.specs && product.details && (
                <div className="flex flex-col gap-3 border-t border-border pt-6">
                  <h2 className="font-serif text-xl">Details</h2>
                  <ul className="flex flex-col gap-2">
                    {product.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm leading-relaxed">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {product.loveIt && alsoBought.length > 0 && (
          <section aria-labelledby="also-bought" className="flex flex-col gap-6">
            <h2 id="also-bought" className="font-serif text-3xl sm:text-4xl">
              Others also bought
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              {alsoBought.map((p) => (
  <li key={p.slug} className="flex min-w-0 flex-col gap-3">
  <Link href={`/christmas/${p.slug}`} className="block">
  <ChristmasProductCard product={p} />
  </Link>
  <ChristmasQuickAdd product={p} className="mt-auto" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {product.loveIt && <ChristmasLoveIt items={product.loveIt} />}
        <ChristmasStepsAndSpecs product={product} />
        {product.pairWithPanel && <ChristmasPairWithPanel />}
        {product.category === "trees" && <ChristmasReviews />}

        {related.length > 0 && (
          <section aria-labelledby="related" className="flex flex-col gap-6">
            <h2 id="related" className="font-serif text-3xl sm:text-4xl">
              More in {category?.name}
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:gap-6">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/christmas/${p.slug}`} className="block">
                    <ChristmasProductCard product={p} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {product.faq && <ChristmasFaq items={product.faq} />}
      </div>
    </div>
  )
}
