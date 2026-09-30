import { cache } from "react"

import { createClient } from "@/lib/supabase/server"
import type { Json } from "@/lib/supabase/database.types"
import type { CourseSummary } from "@/lib/courses"

export function average(values: number[]) {
  if (values.length === 0) return null
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

// Averages are computed here for now. Move them into a DB view once the
// review count makes pulling every review row too heavy.
export async function getCourseSummaries(): Promise<CourseSummary[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, course_code, course_name, credit_amount, type, reviews(rating)"
    )
    .order("course_code")

  if (error) throw new Error(`Failed to load courses: ${error.message}`)

  return data.map((c) => ({
    id: c.id,
    code: c.course_code,
    name: c.course_name,
    credits: c.credit_amount,
    type: c.type,
    reviewCount: c.reviews.length,
    rating: average(c.reviews.map((r) => r.rating)),
  }))
}

export type CourseReview = {
  id: string
  rating: number
  workload: number
  gradingFairness: number
  attendance: string
  comment: string
  createdAt: string
  updatedAt: string | null
  userId: string
  username: string | null
  fullName: string | null
  avatarUrl: string | null
  bio: string | null
}

export type CourseDetail = {
  id: string
  code: string
  name: string
  credits: number
  type: string
  description: string | null
  assessmentMethods: Json | null
  // Newest first
  reviews: CourseReview[]
}

// Cached per request so generateMetadata and the page share one query.
// `code` is the URL segment (lowercase); codes are stored uppercase.
export const getCourseDetail = cache(
  async (code: string): Promise<CourseDetail | null> => {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("courses")
      .select(
        "id, course_code, course_name, credit_amount, type, description, assessment_methods, reviews(id, rating, workload, grading_fairness, attendance, comment, created_at, updated_at, user_id, profiles!reviews_user_id_fkey(username, full_name, avatar_url, bio))"
      )
      .eq("course_code", code.toUpperCase())
      .order("created_at", { referencedTable: "reviews", ascending: false })
      .maybeSingle()

    if (error) throw new Error(`Failed to load course: ${error.message}`)
    if (!data) return null

    return {
      id: data.id,
      code: data.course_code,
      name: data.course_name,
      credits: data.credit_amount,
      type: data.type,
      description: data.description,
      assessmentMethods: data.assessment_methods,
      reviews: data.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        workload: r.workload,
        gradingFairness: r.grading_fairness,
        attendance: r.attendance,
        comment: r.comment,
        createdAt: r.created_at ?? r.updated_at ?? new Date(0).toISOString(),
        updatedAt: r.updated_at,
        userId: r.user_id,
        username: r.profiles?.username ?? null,
        fullName: r.profiles?.full_name ?? null,
        avatarUrl: r.profiles?.avatar_url ?? null,
        bio: r.profiles?.bio ?? null,
      })),
    }
  }
)
