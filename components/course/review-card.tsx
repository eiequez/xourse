"use client"

import type { ReactNode } from "react"

import type { CourseReview } from "@/lib/course-queries"
import { formatFullDate, formatRelativeTime } from "@/lib/format-time"
import { avatarSrc, displayName } from "@/lib/profile"
import {
  attendanceLabel,
  GRADING_WORDS,
  scaleWord,
  WORKLOAD_WORDS,
} from "@/lib/review-scales"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/browse/star-rating"
import { ProfilePopover } from "@/components/course/profile-popover"
import {
  ReviewActionsMenu,
  type CourseInfo,
} from "@/components/course/review-actions-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// An edit more than a minute after posting counts as "Edited"
function wasEdited(r: CourseReview) {
  if (!r.updatedAt) return false
  return (
    new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime() > 60_000
  )
}

// One review as an outlined, tweet-style card
export function ReviewCard({
  review: r,
  isMine,
  now,
  course,
}: {
  review: CourseReview
  isMine: boolean
  now: number
  course: CourseInfo
}) {
  const name = displayName(r.fullName, r.username)
  const username = r.username?.trim()

  return (
    <li
      className={cn(
        "rounded-2xl border bg-bone/3 p-5 sm:p-6",
        isMine ? "border-sand/25" : "border-umber/50"
      )}
    >
      <div className="flex items-start gap-3">
        <ProfilePopover profile={r}>
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={avatarSrc(r.avatarUrl)} alt="" />
          </Avatar>
        </ProfilePopover>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm">
              <ProfilePopover profile={r}>
                <span className="truncate font-semibold text-white hover:underline">
                  {name}
                </span>
              </ProfilePopover>
              {username && username !== name && (
                <span className="truncate text-bone/45">@{username}</span>
              )}
              <span aria-hidden className="text-bone/30">
                ·
              </span>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <time
                      dateTime={r.createdAt}
                      tabIndex={0}
                      suppressHydrationWarning
                      className="rounded-sm text-bone/45 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  }
                >
                  {formatRelativeTime(r.createdAt, now)}
                </TooltipTrigger>
                <TooltipContent>{formatFullDate(r.createdAt)}</TooltipContent>
              </Tooltip>
              {wasEdited(r) && <span className="text-bone/45">(edited)</span>}
              {isMine && (
                <Badge className="ml-1 h-5 rounded-full bg-wine px-2 text-[0.7rem] text-white">
                  You
                </Badge>
              )}
            </div>
            {isMine && <ReviewActionsMenu review={r} course={course} />}
          </div>

          <StarRating value={r.rating} className="mt-1.5" />

          <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed whitespace-pre-line text-bone/85">
            {r.comment}
          </p>

          <ul
            aria-label="Course details from this review"
            className="mt-4 flex flex-wrap gap-1.5"
          >
            <DetailBadge label="Workload">
              {scaleWord(WORKLOAD_WORDS, r.workload)}
            </DetailBadge>
            <DetailBadge label="Grading">
              {scaleWord(GRADING_WORDS, r.gradingFairness)}
            </DetailBadge>
            <DetailBadge label="Attendance">
              {attendanceLabel(r.attendance)}
            </DetailBadge>
          </ul>
        </div>
      </div>
    </li>
  )
}

function DetailBadge({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <li>
      <Badge
        variant="outline"
        className="h-6 max-w-64 rounded-full border-umber/60 px-2.5 font-normal text-bone/75"
      >
        <span className="text-bone/45">{label}</span>
        <span className="truncate">{children}</span>
      </Badge>
    </li>
  )
}
