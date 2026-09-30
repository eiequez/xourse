"use client"

import { useMemo, useState, type ReactNode } from "react"
import { MessageSquareTextIcon } from "lucide-react"

import type { CourseReview } from "@/lib/course-queries"
import { ReviewCard } from "@/components/course/review-card"
import type { CourseInfo } from "@/components/course/review-actions-menu"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PAGE_SIZE = 10

const REVIEW_SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
] as const

type ReviewSort = (typeof REVIEW_SORTS)[number]["value"]

const time = (r: CourseReview) => new Date(r.createdAt).getTime()

const comparators: Record<
  ReviewSort,
  (a: CourseReview, b: CourseReview) => number
> = {
  newest: (a, b) => time(b) - time(a),
  oldest: (a, b) => time(a) - time(b),
  highest: (a, b) => b.rating - a.rating || time(b) - time(a),
  lowest: (a, b) => a.rating - b.rating || time(b) - time(a),
}

type ReviewListProps = {
  reviews: CourseReview[]
  currentUserId: string | null
  // Needed by the ⋯ menu on the student's own review
  course: CourseInfo
  // Shown in the empty state, e.g. the "Write a review" button
  emptyAction?: ReactNode
}

export function ReviewList({
  reviews,
  currentUserId,
  course,
  emptyAction,
}: ReviewListProps) {
  const [sort, setSort] = useState<ReviewSort>("newest")
  const [shown, setShown] = useState(PAGE_SIZE)
  const [now] = useState(() => Date.now())

  const sorted = useMemo(
    () => [...reviews].sort(comparators[sort]),
    [reviews, sort]
  )

  return (
    <section aria-labelledby="reviews-heading" className="mt-16">
      <div className="flex items-center justify-between gap-4 border-b border-umber/50 pb-4">
        <h2
          id="reviews-heading"
          className="font-heading text-2xl font-semibold tracking-tight text-white"
        >
          Reviews
          {reviews.length > 0 && (
            <span className="ml-2 font-normal text-bone/40 tabular-nums">
              {reviews.length}
            </span>
          )}
        </h2>
        {reviews.length > 1 && (
          <Select
            items={REVIEW_SORTS}
            value={sort}
            onValueChange={(value) => {
              if (!value) return
              setSort(value)
              setShown(PAGE_SIZE)
            }}
          >
            <SelectTrigger
              aria-label="Sort reviews"
              className="h-8 rounded-full border-umber/60 px-3.5 text-bone/80 dark:bg-transparent"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {REVIEW_SORTS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {reviews.length === 0 ? (
        <Empty className="mt-6 border border-umber/50 py-16">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="size-11 rounded-full bg-sand/10 text-sand"
            >
              <MessageSquareTextIcon className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="text-lg font-semibold tracking-tight text-white">
              No reviews yet
            </EmptyTitle>
            <EmptyDescription className="text-bone/55">
              Reviews from students who took this course will show up here.
            </EmptyDescription>
          </EmptyHeader>
          {emptyAction && <EmptyContent>{emptyAction}</EmptyContent>}
        </Empty>
      ) : (
        <>
          <ol className="mt-6 flex flex-col gap-3">
            {sorted.slice(0, shown).map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isMine={review.userId === currentUserId}
                now={now}
                course={course}
              />
            ))}
          </ol>
          {shown < sorted.length && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShown((n) => n + PAGE_SIZE)}
                className="rounded-full border-umber/70 px-5 text-bone hover:bg-bone/6"
              >
                Show more reviews
                <span className="text-bone/45 tabular-nums">
                  {sorted.length - shown}
                </span>
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
