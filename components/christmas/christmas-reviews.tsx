import Image from "next/image"
import { CircleCheck, Star } from "lucide-react"

const review = {
  author: "Heather",
  location: "Weobley",
  totalReviews: 1,
  rating: 4,
  title: "Laura Ashley tree",
  country: "United Kingdom",
  when: "10 months ago",
  body: "Beautiful tree. Very happy, easy to assemble, no fuss with putting lights on. Would definitely recommend and brilliant quality.",
  photo: "/images/christmas/review-heather.png",
}

export function ChristmasReviews() {
  return (
    <section aria-labelledby="reviews" className="flex flex-col gap-6">
      <h2 id="reviews" className="font-serif text-3xl sm:text-4xl">
        Customer reviews
      </h2>

      <article className="flex flex-col gap-6 border-t border-border pt-6 md:flex-row md:gap-12">
        <div className="flex flex-col gap-2 md:w-56 md:shrink-0">
          <p className="font-semibold">{review.author}</p>
          <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <CircleCheck className="size-5 text-foreground" aria-hidden="true" />
            Verified purchaser
          </p>
          <p className="text-sm">{review.location}</p>
          <p className="text-sm text-muted-foreground">{`Total reviews posted ${review.totalReviews}`}</p>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={i < review.rating ? "size-4 fill-foreground text-foreground" : "size-4 fill-muted text-muted"}
                aria-hidden="true"
              />
            ))}
          </div>
          <h3 className="font-semibold">{review.title}</h3>
          <p className="text-sm text-muted-foreground">
            {`Reviewed in ${review.country} · ${review.when}`}
          </p>
          <p className="leading-relaxed text-pretty">{review.body}</p>
          <div className="relative mt-2 aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-muted">
            <Image
              src={review.photo || "/placeholder.svg"}
              alt="Customer photo of the boxed 9ft pre-lit tree next to a rattan tree skirt"
              fill
              sizes="(min-width: 768px) 320px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </article>
    </section>
  )
}
