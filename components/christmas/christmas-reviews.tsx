import Image from "next/image"
import { CircleCheck, Star } from "lucide-react"

type Review = {
  author?: string
  location?: string
  rating: number
  title: string
  when: string
  body: string
  photo?: { src: string; alt: string }
}

const reviews: Review[] = [
  {
    rating: 5,
    title: "Stunning 8FT Christmas Tree",
    when: "2 hours ago",
    body: "This tree is beautiful, it looks so real. Perfect height for our room — the 8FT tree has enough lights on it too, plenty of cord to reach the plug sockets without using extensions, stunning in anyone's home. I would definitely recommend having this tree.",
  },
  {
    author: "Heather",
    location: "Weobley",
    rating: 1,
    title: "Laura Ashley tree",
    when: "2 weeks ago",
    body: "Beautiful tree. Very happy, easy to assemble, no fuss with putting lights on. Would definitely recommend and brilliant quality. I'm only giving one star because I bought it two weeks ago for £120 and today the price has dropped to £30... anyway, the product is good, thank you.",
    photo: {
      src: "/images/christmas/review-heather.png",
      alt: "Customer photo of the boxed pre-lit tree next to a rattan tree skirt",
    },
  },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={i < rating ? "size-3.5 fill-foreground text-foreground" : "size-3.5 fill-muted text-muted"}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function ChristmasReviews() {
  return (
    <section aria-labelledby="reviews" className="flex flex-col gap-4">
      <h2 id="reviews" className="font-serif text-2xl sm:text-3xl">
        Customer reviews
      </h2>

      <ul className="flex flex-col divide-y divide-border border-t border-border">
        {reviews.map((review) => (
          <li key={review.title} className="flex flex-col gap-2 py-5">
            <div className="flex items-center justify-between gap-3">
              <Stars rating={review.rating} />
              <span className="text-xs text-muted-foreground">{review.when}</span>
            </div>
            <h3 className="text-sm font-semibold">{review.title}</h3>
            <p className="text-sm leading-relaxed text-pretty">{review.body}</p>
            <div className="flex items-center justify-between gap-3">
              <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                <CircleCheck className="size-3.5 shrink-0 text-foreground" aria-hidden="true" />
                <span className="truncate">
                  {[review.author, "Verified purchaser", review.location ?? "United Kingdom"]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </p>
              {review.photo && (
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={review.photo.src || "/placeholder.svg"}
                    alt={review.photo.alt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
