// app/components/ReviewSpotlight.tsx
"use client"

import { useCallback, useSyncExternalStore } from "react"
import Link from "next/link"
import { courseHref } from "@/lib/courses"
import { avatarSrc } from "@/lib/profile"
import type { SpotlightReview } from "@/lib/landing-data"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "../ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "../ui/carousel"
import { QuoteHighlight } from "../ui/quote-highlight"

// Dots and arrows under the cards, hidden when every card already fits
function CarouselControls() {
  const { api } = useCarousel()
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!api) return () => {}
      api.on("reInit", onChange).on("select", onChange)
      return () => {
        api.off("reInit", onChange).off("select", onChange)
      }
    },
    [api]
  )
  const count = useSyncExternalStore(
    subscribe,
    () => api?.scrollSnapList().length ?? 0,
    () => 0
  )
  const selected = useSyncExternalStore(
    subscribe,
    () => api?.selectedScrollSnap() ?? 0,
    () => 0
  )

  if (count <= 1) return null

  return (
    <div className="mt-8 flex items-center justify-between gap-6">
      <div className="-ml-2.5 flex items-center">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === selected}
            className="group/dot p-2.5"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full transition-all duration-300",
                i === selected
                  ? "w-6 bg-sand"
                  : "w-1.5 bg-bone/25 group-hover/dot:bg-bone/50"
              )}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <CarouselPrevious size="icon-lg" className="static" />
        <CarouselNext size="icon-lg" className="static" />
      </div>
    </div>
  )
}

export default function ReviewSpotlight({
  reviews,
}: {
  reviews: SpotlightReview[]
}) {
  if (reviews.length === 0) return null

  return (
    <section className="px-6 py-20 lg:px-24 lg:py-24">
      <Carousel opts={{ align: "start" }} className="mx-auto max-w-7xl">
        <div className="mb-10 lg:mb-14">
          <p className="mb-3 font-mono text-xs tracking-[0.2em] text-sand uppercase">
            From the reviews
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-white lg:text-4xl">
            What students actually said
          </h2>
        </div>

        <CarouselContent>
          {reviews.map((r) => (
            <CarouselItem
              key={r.id}
              className="basis-[88%] sm:basis-1/2 lg:basis-1/3"
            >
              <figure className="flex h-full flex-col rounded-2xl border border-umber/50 bg-bone/3 p-6 sm:p-8">
                <blockquote className="text-lg leading-relaxed text-bone/90">
                  <p>
                    &ldquo;{r.quote && `${r.quote} `}
                    <QuoteHighlight>{r.highlight}</QuoteHighlight>&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 pt-6">
                  <Avatar className="size-9">
                    <AvatarImage src={avatarSrc(r.avatarUrl)} alt="" />
                  </Avatar>
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-medium text-bone">
                      {r.username ? `@${r.username}` : "XMUM student"}
                    </p>
                    <p className="font-mono text-xs text-bone/40">
                      <Link
                        href={courseHref(r.courseCode)}
                        className="hover:text-sand"
                      >
                        {r.courseCode}
                      </Link>{" "}
                      · rated {r.rating}/5
                    </p>
                  </div>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselControls />
      </Carousel>
    </section>
  )
}
