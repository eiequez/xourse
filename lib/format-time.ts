const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
]

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

// "just now", "5 minutes ago", "yesterday", "3 weeks ago", "last year"
export function formatRelativeTime(date: string | Date, now = Date.now()) {
  const seconds = (new Date(date).getTime() - now) / 1000
  if (Math.abs(seconds) < 60) return "just now"
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      // Truncate so 45 days reads "last month", not "2 months ago"
      return relative.format(Math.trunc(seconds / size), unit)
    }
  }
  return "just now"
}

const full = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

// "29 Sep 2026, 14:05"
export function formatFullDate(date: string | Date) {
  return full.format(new Date(date))
}
