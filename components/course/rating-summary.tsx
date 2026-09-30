"use client"

import type { ReactNode } from "react"
import { StarIcon } from "lucide-react"

import { plural } from "@/lib/courses"
import { StarRating } from "@/components/browse/star-rating"
import { Card } from "@/components/ui/card"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Progress } from "@/components/ui/progress"

type RatingSummaryProps = {
  average: number | null
  count: number
  // Number of reviews per star, index 0 = 5 stars ... index 4 = 1 star
  distribution: number[]
  // Write / edit review button
  action?: ReactNode
}

export function RatingSummary({
  average,
  count,
  distribution,
  action,
}: RatingSummaryProps) {
  return (
    <section aria-labelledby="rating-heading" className="mt-6">
      <h2 id="rating-heading" className="sr-only">
        Student rating
      </h2>
      <Card className="gap-0 p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div className="flex items-center gap-6 sm:gap-8">
            <p className="text-7xl leading-none font-semibold tracking-tight text-white tabular-nums sm:text-8xl">
              {average === null ? (
                <span
                  aria-hidden
                  className="font-extralight text-bone/25"
                ></span>
              ) : (
                <>
                  {/* The ticker counts up from 0, so give screen readers the real value */}
                  <span className="sr-only">
                    Average rating {average.toFixed(1)} out of 5
                  </span>
                  <NumberTicker
                    aria-hidden
                    value={Number(average.toFixed(1))}
                    decimalPlaces={1}
                    className="tracking-tight text-white"
                  />
                </>
              )}
            </p>
            <div>
              <StarRating value={average} size="lg" />
              <p className="mt-3 text-sm text-bone/60">
                {count === 0
                  ? "No reviews yet"
                  : `Based on ${plural(count, "review")}`}
              </p>
              {action && <div className="mt-5">{action}</div>}
            </div>
          </div>

          <ul className="flex flex-col gap-2.5" aria-label="Rating breakdown">
            {distribution.map((n, i) => {
              const stars = 5 - i
              const percent = count === 0 ? 0 : (n / count) * 100
              return (
                <li
                  key={stars}
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-sm"
                >
                  <span className="flex items-center gap-1 text-bone/70 tabular-nums">
                    {stars}
                    <StarIcon
                      aria-hidden
                      className="size-3.5 fill-star text-star"
                    />
                  </span>
                  <Progress
                    value={percent}
                    aria-label={`${plural(n, "review")} with ${stars} stars`}
                    className="**:data-[slot=progress-indicator]:bg-star **:data-[slot=progress-track]:h-2 **:data-[slot=progress-track]:bg-bone/10"
                  />
                  <span className="text-right text-bone/60 tabular-nums">
                    {n}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </Card>
    </section>
  )
}
