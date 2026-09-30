import { typeLabel } from "@/lib/courses"
import { createPublicClient } from "@/lib/supabase/public"

export type TrendingCourse = {
  code: string
  name: string
  rating: number
  reviews: number
  tag: string
}

export type LedgerEntry = {
  code: string
  // null when the course has no reviews yet
  rating: number | null
}

export type SpotlightReview = {
  id: string
  courseCode: string
  rating: number
  // Opening sentence, shown plain
  quote: string
  // The rest of the (shortened) comment, shown highlighted
  highlight: string
  username: string | null
  avatarUrl: string | null
}

const TRENDING_MAX = 5
const LEDGER_SIZE = 16
const SPOTLIGHT_MAX = 6
const SPOTLIGHT_CHARS = 220
const SPOTLIGHT_MIN_CHARS = 40

// The landing is public, so keep reviews with swearing out of the spotlight
const PROFANITY =
  /\b(fuck\w*|shit\w*|bitch\w*|asshole\w*|cunt\w*|bastard\w*|dick\w*|wtf)\b/i

// Shorten on a word boundary, then split off the first sentence
function splitComment(comment: string) {
  const text = comment.replace(/\s+/g, " ").trim()
  const clipped =
    text.length > SPOTLIGHT_CHARS
      ? text
          .slice(0, text.lastIndexOf(" ", SPOTLIGHT_CHARS))
          .replace(/[,;:]$/, "") + "…"
      : text
  const match = clipped.match(/^(.+?[.!?])\s+(.+)$/)
  return match
    ? { quote: match[1]!, highlight: match[2]! }
    : { quote: "", highlight: clipped }
}

// One-line summary for a trending card, from the review averages
function courseTag(stats: {
  type: string
  workload: number | null
  grading: number | null
}) {
  if (stats.workload !== null && stats.workload <= 2) return "Light workload"
  if (stats.workload !== null && stats.workload >= 4) return "Heavy workload"
  if (stats.grading !== null && stats.grading >= 4) return "Fair grading"
  if (stats.grading !== null && stats.grading <= 2) return "Tough grading"
  return typeLabel(stats.type)
}

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j]!, copy[i]!]
  }
  return copy
}

// Landing-page data from the course_rating_stats view. The landing page is
// statically rendered and revalidated, so this runs on rebuilds, not per visit.
export async function getLandingData(): Promise<{
  trending: TrendingCourse[]
  ledger: LedgerEntry[]
  spotlight: SpotlightReview[]
}> {
  const supabase = createPublicClient()
  const [stats, recent] = await Promise.all([
    supabase
      .from("course_rating_stats")
      .select(
        "course_code, course_name, type, review_count, avg_rating, avg_workload, avg_grading"
      ),
    supabase
      .from("reviews")
      .select(
        "id, rating, comment, courses(course_code), profiles!reviews_user_id_fkey(username, avatar_url)"
      )
      .order("created_at", { ascending: false })
      .limit(30),
  ])

  if (recent.error) console.error("getLandingData reviews failed", recent.error)
  const spotlight = (recent.data ?? [])
    .filter(
      (r) =>
        r.comment.trim().length >= SPOTLIGHT_MIN_CHARS &&
        !PROFANITY.test(r.comment)
    )
    .slice(0, SPOTLIGHT_MAX)
    .map((r) => ({
      id: r.id,
      courseCode: r.courses?.course_code ?? "",
      rating: r.rating,
      username: r.profiles?.username?.trim() || null,
      avatarUrl: r.profiles?.avatar_url ?? null,
      ...splitComment(r.comment),
    }))

  const { data, error } = stats
  if (error || !data) {
    console.error("getLandingData failed", error)
    return { trending: [], ledger: [], spotlight }
  }

  const courses = data.map((c) => ({
    code: c.course_code ?? "",
    name: c.course_name ?? "",
    type: c.type ?? "",
    reviews: c.review_count ?? 0,
    rating: c.avg_rating,
    workload: c.avg_workload,
    grading: c.avg_grading,
  }))

  // Most reviewed first, then higher rated, then by code
  const reviewed = courses
    .filter((c) => c.reviews > 0 && c.rating !== null)
    .sort(
      (a, b) =>
        b.reviews - a.reviews ||
        b.rating! - a.rating! ||
        a.code.localeCompare(b.code)
    )

  const trending = reviewed.slice(0, TRENDING_MAX).map((c) => ({
    code: c.code,
    name: c.name,
    rating: c.rating!,
    reviews: c.reviews,
    tag: courseTag(c),
  }))

  // Reviewed courses first, topped up with a random mix of unreviewed ones
  const unreviewed = shuffle(courses.filter((c) => c.reviews === 0))
  const ledger = [
    ...reviewed.map((c) => ({ code: c.code, rating: c.rating })),
    ...unreviewed.map((c) => ({ code: c.code, rating: null })),
  ].slice(0, Math.max(LEDGER_SIZE, reviewed.length))

  return { trending, ledger, spotlight }
}
