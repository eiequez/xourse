import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const STAR_SIZE = {
  sm: "size-3.5 sm:size-4",
  lg: "size-6 sm:size-7",
}

type StarRatingProps = {
  // Average from 1 to 5; null when the course has no reviews yet
  value: number | null
  size?: keyof typeof STAR_SIZE
  className?: string
}

// Five stars filled to the exact average: 4.3 is four yellow stars and a
// fifth that is 30% yellow. Unfilled parts stay grey.
export function StarRating({ value, size = "sm", className }: StarRatingProps) {
  const star = STAR_SIZE[size]

  return (
    <span
      role="img"
      aria-label={
        value === null ? "No ratings yet" : `Rated ${value.toFixed(1)} out of 5`
      }
      className={cn(
        "inline-flex items-center",
        size === "lg" ? "gap-1" : "gap-0.5",
        className
      )}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const fill = value === null ? 0 : Math.min(Math.max(value - i, 0), 1)
        return (
          <span key={i} className="relative inline-flex">
            <StarIcon className={cn(star, "fill-bone/15 text-bone/15")} />
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <StarIcon className={cn(star, "fill-star text-star")} />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
