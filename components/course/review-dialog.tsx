"use client"

import { useId, useRef, useState, useTransition, type FormEvent } from "react"
import { CheckIcon, Loader2Icon, PencilIcon, StarIcon } from "lucide-react"
import { toast } from "sonner"

import { deleteReview, saveReview } from "@/app/browse/[id]/actions"
import type { CourseReview } from "@/lib/course-queries"
import {
  ATTENDANCE_OPTIONS,
  COMMENT_MAX,
  COMMENT_MIN,
  GRADING_WORDS,
  RATING_WORDS,
  scaleWord,
  validateReview,
  WORKLOAD_WORDS,
  type ReviewField,
  type ReviewInput,
} from "@/lib/review-scales"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Errors = Partial<Record<ReviewField, string>>

function initialForm(existing?: CourseReview): ReviewInput {
  return {
    rating: existing?.rating ?? null,
    workload: existing?.workload ?? null,
    gradingFairness: existing?.gradingFairness ?? null,
    attendance: existing?.attendance ?? null,
    comment: existing?.comment ?? "",
  }
}

// Selected state for every toggle in the form
const TOGGLE_ITEM =
  "h-9 flex-1 border border-umber/60 text-bone/70 hover:bg-bone/6 hover:text-bone aria-pressed:border-wine aria-pressed:bg-wine aria-pressed:text-white aria-pressed:hover:bg-wine/90 aria-pressed:hover:text-white"

type CourseInfo = {
  courseId: string
  courseCode: string
  courseName: string
}

// Main course-page button. Students write one review per course, so once
// they have, it turns grey; editing moves to the ⋯ menu on their review.
export function WriteReviewButton({
  hasReview,
  ...course
}: CourseInfo & { hasReview: boolean }) {
  const [open, setOpen] = useState(false)

  if (hasReview) {
    return (
      <Button
        size="lg"
        disabled
        className="rounded-full bg-bone/10 px-5 text-bone/55 disabled:opacity-100"
      >
        <CheckIcon />
        You reviewed this course
      </Button>
    )
  }

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="rounded-full bg-wine px-5 text-white hover:bg-wine/90"
      >
        <PencilIcon />
        Write a review
      </Button>
      <ReviewDialog {...course} open={open} onOpenChange={setOpen} />
    </>
  )
}

type ReviewDialogProps = CourseInfo & {
  open: boolean
  onOpenChange: (open: boolean) => void
  // The signed-in student's review of this course, when editing
  existing?: CourseReview
}

export function ReviewDialog({
  open,
  onOpenChange,
  ...props
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] flex-col gap-0 p-0 sm:max-w-xl">
        {/* Mounted only while open, so the form starts fresh every time */}
        <ReviewForm {...props} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function ReviewForm({
  courseId,
  courseCode,
  courseName,
  existing,
  onDone,
}: CourseInfo & { existing?: CourseReview; onDone: () => void }) {
  const [form, setForm] = useState<ReviewInput>(() => initialForm(existing))
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const isEdit = Boolean(existing)

  function update<K extends ReviewField>(key: K, value: ReviewInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function showErrors(next: Errors) {
    setErrors(next)
    // The form scrolls, so bring the first problem into view
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector("[data-slot=field-error]")
        ?.scrollIntoView({ block: "center", behavior: "smooth" })
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const clientErrors = validateReview(form)
    if (Object.keys(clientErrors).length > 0) return showErrors(clientErrors)

    startTransition(async () => {
      const result = await saveReview(courseId, form)
      if (result.ok) {
        onDone()
        toast.success(
          result.status === "created" ? "Review posted" : "Review updated"
        )
      } else {
        if (result.fieldErrors) showErrors(result.fieldErrors)
        setFormError(result.error ?? null)
      }
    })
  }

  const commentLength = form.comment.trim().length

  return (
    <>
      <DialogHeader className="border-b border-umber/50 px-6 pt-6 pb-4">
        <DialogTitle className="text-lg font-semibold tracking-tight text-white">
          {isEdit ? "Edit your review" : `Review ${courseCode}`}
        </DialogTitle>
        <DialogDescription className="text-bone/60">
          {courseName}
        </DialogDescription>
      </DialogHeader>

      <form
        id="review-form"
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="flex-1 overflow-y-auto px-6 py-6"
      >
        <FieldGroup className="gap-7">
          {formError && (
            <Alert className="border-signal/40 bg-signal/10 text-signal">
              <AlertDescription className="text-signal">
                {formError}
              </AlertDescription>
            </Alert>
          )}

          <FieldSet>
            <FieldLegend variant="label" className="text-bone">
              Your rating
            </FieldLegend>
            <StarPicker
              value={form.rating}
              onChange={(v) => update("rating", v)}
            />
            <FieldError>{errors.rating}</FieldError>
          </FieldSet>

          <ScaleField
            legend="Workload"
            words={WORKLOAD_WORDS}
            value={form.workload}
            onChange={(v) => update("workload", v)}
            error={errors.workload}
          />

          <ScaleField
            legend="Grading fairness"
            words={GRADING_WORDS}
            value={form.gradingFairness}
            onChange={(v) => update("gradingFairness", v)}
            error={errors.gradingFairness}
          />

          <FieldSet>
            <FieldLegend variant="label" className="text-bone">
              Attendance
            </FieldLegend>
            <ToggleGroup
              aria-label="Attendance policy"
              value={form.attendance ? [form.attendance] : []}
              onValueChange={(v) => v[0] && update("attendance", v[0])}
              // Same height for all three even when one label wraps
              className="w-full items-stretch"
            >
              {ATTENDANCE_OPTIONS.map((o) => (
                <ToggleGroupItem
                  key={o.value}
                  value={o.value}
                  className={cn(
                    TOGGLE_ITEM,
                    "h-auto min-h-9 py-1.5 whitespace-normal"
                  )}
                >
                  {o.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FieldError>{errors.attendance}</FieldError>
          </FieldSet>

          <Field>
            <FieldLabel htmlFor="review-comment" className="text-bone">
              Your review
            </FieldLabel>
            <Textarea
              id="review-comment"
              value={form.comment}
              onChange={(e) => update("comment", e.target.value)}
              placeholder="What should students know before taking this course?"
              rows={5}
              aria-invalid={Boolean(errors.comment)}
              aria-describedby="review-comment-count"
              className="min-h-32 border-umber/60 bg-bone/3"
            />
            <div className="flex items-start justify-between gap-4">
              {errors.comment ? (
                <FieldError>{errors.comment}</FieldError>
              ) : (
                <FieldDescription className="text-bone/45">
                  At least {COMMENT_MIN} characters.
                </FieldDescription>
              )}
              <span
                id="review-comment-count"
                className={cn(
                  "shrink-0 text-xs tabular-nums",
                  commentLength > COMMENT_MAX ? "text-signal" : "text-bone/45"
                )}
              >
                {commentLength} / {COMMENT_MAX}
              </span>
            </div>
          </Field>
        </FieldGroup>
      </form>

      <DialogFooter className="mx-0 mb-0 border-umber/50 bg-transparent px-6 py-4">
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <DialogClose
            disabled={pending}
            render={
              <Button
                variant="outline"
                className="border-umber/70 text-bone hover:bg-bone/6"
              />
            }
          >
            Cancel
          </DialogClose>
          <Button
            type="submit"
            form="review-form"
            disabled={pending}
            className="bg-wine text-white hover:bg-wine/90"
          >
            {pending && <Loader2Icon className="animate-spin" />}
            {isEdit ? "Save changes" : "Post review"}
          </Button>
        </div>
      </DialogFooter>
    </>
  )
}

// Five radio buttons drawn as stars. Hover previews, arrow keys move.
function StarPicker({
  value,
  onChange,
}: {
  value: number | null
  onChange: (value: number) => void
}) {
  const [hover, setHover] = useState<number | null>(null)
  const name = useId()
  const shown = hover ?? value ?? 0

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <div className="flex" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className="cursor-pointer p-0.5"
            onMouseEnter={() => setHover(n)}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              aria-label={`${n} of 5, ${scaleWord(RATING_WORDS, n)}`}
              className="peer sr-only"
            />
            <StarIcon
              aria-hidden
              className={cn(
                "size-8 rounded-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
                n <= shown ? "fill-star text-star" : "fill-bone/10 text-bone/25"
              )}
            />
          </label>
        ))}
      </div>
      <span className="text-sm text-bone/70">
        {shown ? scaleWord(RATING_WORDS, shown) : "Select a rating"}
      </span>
    </div>
  )
}

function ScaleField({
  legend,
  words,
  value,
  onChange,
  error,
}: {
  legend: string
  words: string[]
  value: number | null
  onChange: (value: number) => void
  error?: string
}) {
  return (
    <FieldSet>
      <FieldLegend
        variant="label"
        className="flex w-full items-baseline justify-between text-bone"
      >
        {legend}
        {value && (
          <span className="text-xs font-normal text-bone/60">
            {scaleWord(words, value)}
          </span>
        )}
      </FieldLegend>
      <div className="flex flex-col gap-2">
        <ToggleGroup
          aria-label={`${legend}, 1 ${words[0]} to 5 ${words[4]}`}
          value={value ? [String(value)] : []}
          onValueChange={(v) => v[0] && onChange(Number(v[0]))}
          className="w-full"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <ToggleGroupItem
              key={n}
              value={String(n)}
              aria-label={`${n}, ${scaleWord(words, n)}`}
              className={cn(TOGGLE_ITEM, "tabular-nums")}
            >
              {n}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex justify-between text-xs text-bone/45">
          <span>{words[0]}</span>
          <span>{words[4]}</span>
        </div>
      </div>
      <FieldError>{error}</FieldError>
    </FieldSet>
  )
}

export function DeleteReviewDialog({
  open,
  onOpenChange,
  courseId,
  courseCode,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  courseCode: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [deleting, startDelete] = useTransition()

  function confirmDelete() {
    setError(null)
    startDelete(async () => {
      const result = await deleteReview(courseId)
      if (result.ok) {
        onOpenChange(false)
        toast.success("Review deleted")
      } else {
        setError(result.error ?? "Your review could not be deleted.")
      }
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => !deleting && onOpenChange(next)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Delete your review?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-bone/65">
            This removes your rating and comment for {courseCode}. You can write
            a new review later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-signal">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={deleting}
            className="border-umber/70 text-bone hover:bg-bone/6"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            disabled={deleting}
            className="bg-signal text-white hover:bg-signal/90"
          >
            {deleting && <Loader2Icon className="animate-spin" />}
            Delete review
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
