export type CourseSummary = {
  id: string
  code: string
  name: string
  credits: number
  type: string
  reviewCount: number
  // Average over all reviews; null when the course has no reviews yet
  rating: number | null
}

export function courseHref(code: string) {
  return `/browse/${code.toLowerCase()}`
}

// Course types are stored lowercase ("arts"); show them capitalized
export function typeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

// Solid badge colors per course type; unknown types get a neutral badge
export const TYPE_BADGE: Record<string, string> = {
  arts: "bg-arts text-night",
  business: "bg-business text-white",
  science: "bg-science text-night",
}

export function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`
}

export function ratingTextClass(rating: number) {
  if (rating >= 4.0) return "text-sand"
  if (rating >= 3.0) return "text-bone/60"
  return "text-signal"
}

export const SORT_OPTIONS = [
  { value: "rating", label: "Highest rated" },
  { value: "reviews", label: "Most reviewed" },
  { value: "code", label: "Course code" },
] as const

export type SortKey = (typeof SORT_OPTIONS)[number]["value"]

export const DEFAULT_SORT: SortKey = "rating"

export function parseSort(value: string | undefined): SortKey {
  return SORT_OPTIONS.some((o) => o.value === value)
    ? (value as SortKey)
    : DEFAULT_SORT
}
