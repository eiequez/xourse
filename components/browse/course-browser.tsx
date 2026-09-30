"use client"

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, MotionConfig } from "motion/react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  LibraryBigIcon,
  SearchIcon,
  SearchXIcon,
  XIcon,
} from "lucide-react"

import {
  courseHref,
  DEFAULT_SORT,
  plural,
  SORT_OPTIONS,
  typeLabel,
  type CourseSummary,
  type SortKey,
} from "@/lib/courses"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/browse/star-rating"
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const ALL_TYPES = "all"

// Selected-chip color per course type; unknown types fall back to "all"
const TYPE_CHIP: Record<string, string> = {
  all: "aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-night aria-pressed:hover:bg-white/90 aria-pressed:hover:text-night",
  arts: "aria-pressed:border-arts aria-pressed:bg-arts aria-pressed:text-night aria-pressed:hover:bg-arts/90 aria-pressed:hover:text-night",
  business:
    "aria-pressed:border-business aria-pressed:bg-business aria-pressed:text-white aria-pressed:hover:bg-business/90 aria-pressed:hover:text-white",
  science:
    "aria-pressed:border-science aria-pressed:bg-science aria-pressed:text-night aria-pressed:hover:bg-science/90 aria-pressed:hover:text-night",
}

// Shared by the column header and every row so the ledger lines up
const LEDGER_COLUMNS =
  "lg:grid-cols-[minmax(0,1fr)_3.5rem_4.5rem_8.5rem] lg:gap-x-6"

function compareNullable(a: number | null, b: number | null, dir: 1 | -1) {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return (a - b) * dir
}

const comparators: Record<
  SortKey,
  (a: CourseSummary, b: CourseSummary) => number
> = {
  rating: (a, b) =>
    compareNullable(a.rating, b.rating, -1) || b.reviewCount - a.reviewCount,
  reviews: (a, b) =>
    b.reviewCount - a.reviewCount || compareNullable(a.rating, b.rating, -1),
  code: () => 0,
}

// Case- and space-insensitive, so "bus 3013" finds BUS3013
function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, "")
}

type CourseBrowserProps = {
  courses: CourseSummary[]
  initialQuery: string
  initialType: string
  initialSort: SortKey
}

export function CourseBrowser({
  courses,
  initialQuery,
  initialType,
  initialSort,
}: CourseBrowserProps) {
  const types = useMemo(
    () => [...new Set(courses.map((c) => c.type))].sort(),
    [courses]
  )

  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(
    types.includes(initialType) ? initialType : ALL_TYPES
  )
  const [sort, setSort] = useState<SortKey>(initialSort)
  const deferredQuery = useDeferredValue(query)
  const inputRef = useRef<HTMLInputElement>(null)

  const visible = useMemo(() => {
    const needle = normalize(deferredQuery)
    return courses
      .filter(
        (c) =>
          (type === ALL_TYPES || c.type === type) &&
          (needle === "" ||
            normalize(c.code).includes(needle) ||
            normalize(c.name).includes(needle))
      )
      .sort((a, b) => comparators[sort](a, b) || a.code.localeCompare(b.code))
  }, [courses, deferredQuery, type, sort])

  // Keep the URL in sync so a filtered view can be shared or reloaded
  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (type !== ALL_TYPES) params.set("type", type)
    if (sort !== DEFAULT_SORT) params.set("sort", sort)
    const search = params.toString()
    window.history.replaceState(
      null,
      "",
      search ? `?${search}` : window.location.pathname
    )
  }, [query, type, sort])

  // "/" jumps to search from anywhere on the page
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.closest("input, textarea, select, [contenteditable='true']"))
        return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const isFiltered = query.trim() !== "" || type !== ALL_TYPES

  function clearFilters() {
    setQuery("")
    setType(ALL_TYPES)
    inputRef.current?.focus()
  }

  if (courses.length === 0) {
    return (
      <Empty className="mt-4 border border-umber/50 py-20">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="size-11 rounded-full bg-sand/10 text-sand"
          >
            <LibraryBigIcon className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="text-lg font-semibold tracking-tight text-white">
            No courses listed yet
          </EmptyTitle>
          <EmptyDescription className="text-bone/55">
            Electives will show up here as soon as the course list is added.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <InputGroup className="h-11 rounded-xl border-umber/60 bg-bone/3 lg:max-w-md dark:bg-bone/3">
          <InputGroupAddon className="pl-3.5 text-bone/40">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Escape") return
              if (query) setQuery("")
              else e.currentTarget.blur()
            }}
            placeholder="Search by course code or name"
            aria-label="Search courses by code or name"
            autoComplete="off"
            spellCheck={false}
            className="text-[0.95rem] text-bone placeholder:text-bone/35 [&::-webkit-search-cancel-button]:appearance-none"
          />
          <InputGroupAddon align="inline-end" className="pr-2.5">
            {query ? (
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("")
                  inputRef.current?.focus()
                }}
                className="text-bone/50 hover:text-bone"
              >
                <XIcon />
              </InputGroupButton>
            ) : (
              <Kbd className="hidden border border-umber/60 bg-transparent font-mono text-bone/45 sm:inline-flex">
                /
              </Kbd>
            )}
          </InputGroupAddon>
        </InputGroup>

        <div className="flex min-w-0 items-center justify-between gap-3">
          {types.length > 1 && (
            <ToggleGroup
              aria-label="Filter by course type"
              value={[type]}
              onValueChange={(value) => setType(value[0] ?? ALL_TYPES)}
              // Chips scroll sideways on small screens; the fade hints at more
              className="w-auto min-w-0 flex-1 scrollbar-none overflow-x-auto mask-[linear-gradient(to_right,black_85%,transparent)] lg:flex-none lg:mask-none"
            >
              {[ALL_TYPES, ...types].map((t) => (
                <ToggleGroupItem
                  key={t}
                  value={t}
                  size="sm"
                  className={cn(
                    "h-8 rounded-full border border-umber/60 px-3.5 text-bone/65 hover:bg-bone/6 hover:text-bone",
                    TYPE_CHIP[t] ?? TYPE_CHIP[ALL_TYPES]
                  )}
                >
                  {t === ALL_TYPES ? "All" : typeLabel(t)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}

          {/* On desktop the column headers do the sorting */}
          <Select
            items={SORT_OPTIONS}
            value={sort}
            onValueChange={(value) => value && setSort(value)}
          >
            <SelectTrigger
              aria-label="Sort courses"
              className="ml-auto h-8 shrink-0 rounded-full border-umber/60 px-3.5 text-bone/80 lg:hidden dark:bg-transparent"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 flex h-8 items-center justify-between">
        <p aria-live="polite" className="text-sm text-bone/50">
          {isFiltered
            ? `${visible.length} of ${plural(courses.length, "course")}`
            : plural(courses.length, "course")}
        </p>
        {/* The no-results panel has its own clear button */}
        {isFiltered && visible.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="-mr-2.5 text-bone/60 hover:bg-bone/6 hover:text-bone"
          >
            Clear filters
          </Button>
        )}
      </div>

      {visible.length === 0 ? (
        <Empty className="mt-2 border border-umber/50 py-16">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="size-11 rounded-full bg-bone/6 text-bone/60"
            >
              <SearchXIcon className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="text-lg font-semibold tracking-tight text-white">
              {query.trim()
                ? `No courses match “${query.trim()}”`
                : "No courses of this type"}
            </EmptyTitle>
            <EmptyDescription className="text-bone/55">
              Try the course code, like BUS3013, or part of the course name.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-umber/70 text-bone hover:bg-bone/6"
            >
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mt-2">
          <LedgerHeader sort={sort} onSort={setSort} />
          <ol className="border-t border-umber/50 lg:border-t-0">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((course) => (
                <motion.li
                  key={course.id}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="border-b border-umber/50"
                >
                  <CourseRow course={course} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
      )}
    </MotionConfig>
  )
}

type Column = {
  label: string
  sort?: SortKey
  // Arrow direction for the column's sort order
  ascending?: boolean
  align?: "right"
}

const columns: Column[] = [
  { label: "Course", sort: "code", ascending: true },
  { label: "Credits", align: "right" },
  { label: "Reviews", sort: "reviews", align: "right" },
  { label: "Rating", sort: "rating", align: "right" },
]

function LedgerHeader({
  sort,
  onSort,
}: {
  sort: SortKey
  onSort: (sort: SortKey) => void
}) {
  return (
    <div
      className={cn(
        "hidden border-b border-umber/50 pb-3 text-xs text-bone/40 lg:grid",
        LEDGER_COLUMNS
      )}
    >
      {columns.map((col) => {
        const active = col.sort === sort
        const Arrow = col.ascending ? ArrowUpIcon : ArrowDownIcon
        const align = col.align === "right" ? "justify-self-end" : ""

        if (!col.sort) {
          return (
            <span key={col.label} className={cn("py-1", align)}>
              {col.label}
            </span>
          )
        }

        const option = SORT_OPTIONS.find((o) => o.value === col.sort)!
        return (
          <button
            key={col.label}
            type="button"
            onClick={() => onSort(col.sort!)}
            aria-pressed={active}
            aria-label={`Sort by ${option.label.toLowerCase()}`}
            className={cn(
              "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors outline-none hover:text-bone focus-visible:ring-3 focus-visible:ring-ring/50",
              active && "text-bone",
              // Right-aligned columns put the arrow first so labels line up with the numbers
              col.align === "right" && "flex-row-reverse",
              align
            )}
          >
            {col.label}
            <Arrow
              aria-hidden
              className={cn("size-3", active ? "opacity-100" : "opacity-0")}
            />
          </button>
        )
      })}
    </div>
  )
}

function CourseRow({ course: c }: { course: CourseSummary }) {
  return (
    <Link
      href={courseHref(c.code)}
      className={cn(
        "group -mx-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 rounded-lg px-3 py-5 transition-colors outline-none hover:bg-bone/3 focus-visible:bg-bone/3 focus-visible:ring-3 focus-visible:ring-ring/50 lg:py-4",
        LEDGER_COLUMNS
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3 font-mono text-xs text-bone/45">
          <span>{c.code}</span>
          <span className="lg:hidden">{plural(c.credits, "credit")}</span>
        </div>
        <p className="mt-1 truncate text-base text-bone transition-colors group-hover:text-sand">
          {c.name}
        </p>
      </div>

      <span className="hidden justify-self-end font-mono text-sm text-bone/60 tabular-nums lg:block">
        {c.credits}
      </span>

      <span className="hidden justify-self-end font-mono text-sm text-bone/60 tabular-nums lg:block">
        {c.reviewCount}
      </span>

      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-2">
          <StarRating value={c.rating} />
          <span
            aria-hidden
            className={cn(
              "w-7 text-right text-sm font-semibold tabular-nums",
              c.rating === null ? "text-bone/30" : "text-white"
            )}
          >
            {c.rating === null ? "–" : c.rating.toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-bone/40 lg:hidden">
          {c.reviewCount > 0
            ? plural(c.reviewCount, "review")
            : "No reviews yet"}
        </span>
      </div>
    </Link>
  )
}
