"use client"

import { useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

type Media = { type: "image"; src: string } | { type: "video"; src: string }

export function ChristmasGallery({
  images,
  name,
  video,
}: {
  images: string[]
  name: string
  video?: { src: string; position?: number }
}) {
  const [active, setActive] = useState(0)

  const media: Media[] = images.map((src) => ({ type: "image", src }))
  if (video) {
    const at = Math.min(Math.max((video.position ?? 2) - 1, 0), media.length)
    media.splice(at, 0, { type: "video", src: video.src })
  }

  if (media.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md bg-tile-sage text-xs text-muted-foreground">
        Photo coming soon
      </div>
    )
  }

  const current = media[active]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        {current.type === "video" ? (
          <>
            {/* Blurred copy fills the square so the portrait video keeps its full frame without letterbox bars. */}
            <video
              key={`${current.src}-bg`}
              src={current.src}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              tabIndex={-1}
              style={{ width: "100%", height: "100%" }}
              className="absolute inset-0 scale-110 object-cover opacity-70 blur-2xl"
            />
            <video
              key={current.src}
              src={current.src}
              autoPlay
              muted
              loop
              playsInline
              aria-label={`${name} — video`}
              style={{ width: "100%", height: "100%" }}
              className="absolute inset-0 object-contain"
            />
          </>
        ) : (
          <Image
            src={current.src || "/placeholder.svg"}
            alt={`${name} — photo ${active + 1} of ${media.length}`}
            fill
            priority={active === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      {media.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto" aria-label="Product media">
          {media.map((m, i) => (
            <li key={m.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={m.type === "video" ? "Play video" : `Show photo ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-md border-2 bg-muted transition-colors sm:size-20",
                  i === active ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                {m.type === "video" ? (
                  <>
                    <video
                      src={`${m.src}#t=0.5`}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      style={{ width: "100%", height: "100%" }}
                      className="object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex size-7 items-center justify-center rounded-full bg-background/85 text-foreground">
                        <Play className="size-3.5 translate-x-px fill-current" aria-hidden="true" />
                      </span>
                    </span>
                  </>
                ) : (
                  <Image src={m.src || "/placeholder.svg"} alt="" fill sizes="80px" className="object-cover" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
