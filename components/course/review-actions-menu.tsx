"use client"

import { useState } from "react"
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"

import type { CourseReview } from "@/lib/course-queries"
import {
  DeleteReviewDialog,
  ReviewDialog,
} from "@/components/course/review-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type CourseInfo = {
  courseId: string
  courseCode: string
  courseName: string
}

// ⋯ menu on the signed-in student's own review: edit or delete it
export function ReviewActionsMenu({
  review,
  course,
}: {
  review: CourseReview
  course: CourseInfo
}) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Review options"
          className="-mt-1 -mr-2 flex size-8 items-center justify-center rounded-full text-bone/50 transition-colors outline-none hover:bg-sand/10 hover:text-sand focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <MoreHorizontalIcon className="size-4.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => setEditing(true)}>
            <PencilIcon />
            Edit review
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleting(true)}
            className="text-signal focus:bg-signal/10 focus:text-signal"
          >
            <Trash2Icon className="text-signal" />
            Delete review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReviewDialog
        {...course}
        existing={review}
        open={editing}
        onOpenChange={setEditing}
      />
      <DeleteReviewDialog
        courseId={course.courseId}
        courseCode={course.courseCode}
        open={deleting}
        onOpenChange={setDeleting}
      />
    </>
  )
}
