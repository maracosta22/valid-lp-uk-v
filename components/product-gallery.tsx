"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
  video?: string
  videoThumbnail?: string
  videoPosition?: number
}

export function ProductGallery({ images, productName, video, videoThumbnail, videoPosition = 1 }: ProductGalleryProps) {
  // Build ordered items: images with the video inserted at `videoPosition` (default: second slot)
  const imageItems = images.map((src) => ({ type: "image" as const, src }))
  const orderedItems: Array<{ type: "image"; src: string } | { type: "video" }> = video
    ? [
        ...imageItems.slice(0, videoPosition),
        { type: "video" },
        ...imageItems.slice(videoPosition),
      ]
    : imageItems

  const totalItems = orderedItems.length
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const isExternalImage = (src: string) => src.startsWith("http")
  const currentItem = orderedItems[selectedIndex]
  const isVideoSelected = currentItem?.type === "video"

  const handlePlayVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsVideoPlaying(true)
    }
  }, [])

  // Swipe on main image area — disabled when video is selected
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isVideoSelected) return
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX // reset so a tap never triggers swipe
  }, [isVideoSelected])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isVideoSelected) return
    touchEndX.current = e.touches[0].clientX
  }, [isVideoSelected])

  const handleTouchEnd = useCallback(() => {
    if (isVideoSelected) return
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && selectedIndex < totalItems - 1) {
        setSelectedIndex((prev) => prev + 1)
        setIsVideoPlaying(false)
      } else if (diff < 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1)
        setIsVideoPlaying(false)
      }
    }
  }, [isVideoSelected, selectedIndex, totalItems])

  const handleSelectIndex = useCallback((index: number) => {
    setSelectedIndex(index)
    setIsVideoPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  return (
    <div className="flex flex-col gap-3 overflow-hidden max-w-full">
      {/* Main display area */}
      <div
        className="w-full max-w-[350px] sm:max-w-[400px] mx-auto overflow-hidden bg-secondary aspect-square flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isVideoSelected && video ? (
          <div className="relative h-full w-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={video}
              controls={isVideoPlaying}
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
            />
            {!isVideoPlaying && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePlayVideo() }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); handlePlayVideo() }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
                aria-label="Play video"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110">
                  <Play className="h-7 w-7 text-foreground fill-foreground ml-1" />
                </div>
              </button>
            )}
          </div>
        ) : (
          currentItem?.type === "image" && (
            <Image
              src={currentItem.src || "/placeholder.svg"}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              width={400}
              height={400}
              className="h-full w-full object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
              sizes="(max-width: 350px) 100vw, 400px"
              unoptimized={isExternalImage(currentItem.src || "")}
            />
          )
        )}
      </div>

      {/* Thumbnail strip — ordered: img0, video (pos 1), img1, img2, ... */}
      {totalItems > 1 && (
        <div className="max-w-[350px] sm:max-w-[400px] mx-auto w-full overflow-hidden">
          <div
            className="flex gap-1 overflow-x-auto pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {orderedItems.map((item, index) =>
              item.type === "video" ? (
                <button
                  type="button"
                  key="video-thumb"
                  onClick={() => handleSelectIndex(index)}
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 min-w-[40px] sm:min-w-[48px] min-h-[40px] sm:min-h-[48px] overflow-hidden transition-all flex-shrink-0 flex items-center justify-center relative",
                    selectedIndex === index ? "ring-1 ring-foreground" : "opacity-60 hover:opacity-100",
                  )}
                  aria-label="Play video"
                >
                  {videoThumbnail ? (
                    <>
                      <Image
                        src={videoThumbnail}
                        alt="Video thumbnail"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover absolute inset-0"
                        unoptimized={isExternalImage(videoThumbnail)}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-foreground/90 flex items-center justify-center">
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 text-background fill-background" />
                    </div>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  key={`img-${index}`}
                  onClick={() => handleSelectIndex(index)}
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 min-w-[40px] sm:min-w-[48px] min-h-[40px] sm:min-h-[48px] overflow-hidden bg-secondary transition-all flex-shrink-0",
                    selectedIndex === index ? "ring-1 ring-foreground" : "opacity-60 hover:opacity-100",
                  )}
                >
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={`${productName} thumbnail ${index + 1}`}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    style={{ width: "auto", height: "auto" }}
                    sizes="48px"
                    unoptimized={isExternalImage(item.src)}
                  />
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
