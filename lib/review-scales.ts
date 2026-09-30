// Labels and limits shared by the review dialog, the server action and the
// review list, so all three describe the 1-5 scales the same way.

export const RATING_WORDS = ["Poor", "Fair", "Good", "Very good", "Excellent"]
export const WORKLOAD_WORDS = [
  "Very light",
  "Light",
  "Moderate",
  "Heavy",
  "Very heavy",
]
export const GRADING_WORDS = [
  "Totally Unfair",
  "Unfair",
  "Reasonable",
  "Fair",
  "Very fair",
]

// Values must match the CHECK constraint on reviews.attendance
export const ATTENDANCE_OPTIONS = [
  { value: "strict", label: "Very Strict" },
  { value: "tracked", label: "Asks in class" },
  { value: "friendly", label: "Friends can sign for you" },
] as const

export type Attendance = (typeof ATTENDANCE_OPTIONS)[number]["value"]

export const COMMENT_MIN = 10
export const COMMENT_MAX = 2000

// Word for a 1-5 value, e.g. scaleWord(WORKLOAD_WORDS, 4) === "Heavy"
export function scaleWord(words: string[], value: number) {
  return words[value - 1] ?? ""
}

export function attendanceLabel(value: string) {
  return ATTENDANCE_OPTIONS.find((o) => o.value === value)?.label ?? value
}

export type ReviewInput = {
  rating: number | null
  workload: number | null
  gradingFairness: number | null
  attendance: string | null
  comment: string
}

export type ReviewField = keyof ReviewInput

const isScale = (v: unknown): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5

// Returns an error message per invalid field; empty object when valid
export function validateReview(input: ReviewInput) {
  const errors: Partial<Record<ReviewField, string>> = {}
  const comment = input.comment.trim()

  if (!isScale(input.rating)) errors.rating = "Pick a star rating."
  if (!isScale(input.workload))
    errors.workload = "Pick how heavy the workload was."
  if (!isScale(input.gradingFairness))
    errors.gradingFairness = "Pick how fair the grading was."
  if (!ATTENDANCE_OPTIONS.some((o) => o.value === input.attendance))
    errors.attendance = "Pick the attendance policy."
  if (comment.length < COMMENT_MIN)
    errors.comment = `Write at least ${COMMENT_MIN} characters.`
  else if (comment.length > COMMENT_MAX)
    errors.comment = `Keep it under ${COMMENT_MAX} characters.`

  return errors
}
