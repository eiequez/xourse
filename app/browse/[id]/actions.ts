"use server"

import { revalidatePath } from "next/cache"

import { courseHref } from "@/lib/courses"
import {
  validateReview,
  type ReviewField,
  type ReviewInput,
} from "@/lib/review-scales"
import { createClient } from "@/lib/supabase/server"

export type SaveReviewResult =
  | { ok: true; status: "created" | "updated" }
  | {
      ok: false
      error?: string
      fieldErrors?: Partial<Record<ReviewField, string>>
    }

async function courseCode(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string
) {
  const { data } = await supabase
    .from("courses")
    .select("course_code")
    .eq("id", courseId)
    .maybeSingle()
  return data?.course_code ?? null
}

function refresh(code: string) {
  revalidatePath(courseHref(code))
  // The list shows each course's average and review count
  revalidatePath("/browse")
  // The landing's trending cards and ledger strip use the same numbers
  revalidatePath("/")
}

// Creates the student's review for a course, or updates it if they already
// wrote one. The unique (course_id, user_id) constraint keeps it to one.
export async function saveReview(
  courseId: string,
  input: ReviewInput
): Promise<SaveReviewResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Sign in to write a review." }

  const fieldErrors = validateReview(input)
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors }

  const code = await courseCode(supabase, courseId)
  if (!code) return { ok: false, error: "This course no longer exists." }

  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle()

  const { error } = await supabase.from("reviews").upsert(
    {
      course_id: courseId,
      user_id: user.id,
      rating: input.rating!,
      workload: input.workload!,
      grading_fairness: input.gradingFairness!,
      attendance: input.attendance!,
      comment: input.comment.trim(),
    },
    { onConflict: "course_id,user_id" }
  )

  if (error) {
    console.error("saveReview failed", error)
    return { ok: false, error: "Your review could not be saved. Try again." }
  }

  refresh(code)
  return { ok: true, status: existing ? "updated" : "created" }
}

export async function deleteReview(
  courseId: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Sign in to delete your review." }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("course_id", courseId)
    .eq("user_id", user.id)

  if (error) {
    console.error("deleteReview failed", error)
    return { ok: false, error: "Your review could not be deleted. Try again." }
  }

  const code = await courseCode(supabase, courseId)
  if (code) refresh(code)
  return { ok: true }
}
