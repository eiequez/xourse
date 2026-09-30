import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { extractEnrollmentNotes, organizeAssessment } from "@/lib/course-info"
import { average, getCourseDetail } from "@/lib/course-queries"
import { createClient } from "@/lib/supabase/server"
import { AssessmentCard } from "@/components/course/assessment-card"
import { CourseAbout } from "@/components/course/course-about"
import { CourseHeader } from "@/components/course/course-header"
import { RatingSummary } from "@/components/course/rating-summary"
import { WriteReviewButton } from "@/components/course/review-dialog"
import { ReviewList } from "@/components/course/review-list"

export async function generateMetadata(
  props: PageProps<"/browse/[id]">
): Promise<Metadata> {
  const { id } = await props.params
  const course = await getCourseDetail(id)
  if (!course) return { title: "Course not found" }

  // The body is empty for courses with no description, or one that is nothing
  // but enrollment notes, so fall back to something that still reads as a page.
  const { body } = extractEnrollmentNotes(course.description)
  return {
    title: `${course.name} (${course.code})`,
    description:
      body.slice(0, 160) ||
      `Student reviews of ${course.name} (${course.code}) at XMUM: rating, workload, grading fairness and attendance.`,
  }
}

export default async function CoursePage(props: PageProps<"/browse/[id]">) {
  const { id } = await props.params
  const course = await getCourseDetail(id)
  if (!course) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { notes, body } = extractEnrollmentNotes(course.description)
  const { parts, examWeight } = organizeAssessment(course.assessmentMethods)

  // One review per student per course: the button only writes; edits go
  // through the ⋯ menu on the student's own review
  const myReview = user
    ? course.reviews.find((r) => r.userId === user.id)
    : undefined
  const courseInfo = {
    courseId: course.id,
    courseCode: course.code,
    courseName: course.name,
  }
  const reviewButton = user ? (
    <WriteReviewButton {...courseInfo} hasReview={Boolean(myReview)} />
  ) : null

  const ratings = course.reviews.map((r) => r.rating)
  const distribution = [5, 4, 3, 2, 1].map(
    (stars) => ratings.filter((r) => r === stars).length
  )

  return (
    <div className="px-6 pt-10 pb-24 lg:px-24 lg:pt-14">
      <div className="mx-auto max-w-7xl">
        <CourseHeader
          code={course.code}
          name={course.name}
          credits={course.credits}
          type={course.type}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <CourseAbout notes={notes} body={body} />
          <AssessmentCard parts={parts} examWeight={examWeight} />
        </div>

        <RatingSummary
          average={average(ratings)}
          count={ratings.length}
          distribution={distribution}
          action={reviewButton}
        />

        <ReviewList
          reviews={course.reviews}
          currentUserId={user?.id ?? null}
          course={courseInfo}
          emptyAction={reviewButton}
        />
      </div>
    </div>
  )
}
