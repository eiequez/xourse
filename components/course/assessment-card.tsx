import {
  FileTextIcon,
  ListChecksIcon,
  BookOpenText,
  PresentationIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import type { AssessmentKind, AssessmentPart } from "@/lib/course-info"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const KIND_ICON: Record<AssessmentKind, LucideIcon> = {
  exam: FileTextIcon,
  quiz: ListChecksIcon,
  presentation: PresentationIcon,
  participation: UsersIcon,
  coursework: BookOpenText,
}

// Heaviest part gets the brightest segment
const SEGMENT = [
  "bg-sand",
  "bg-sand/70",
  "bg-sand/50",
  "bg-sand/35",
  "bg-sand/20",
]

type AssessmentCardProps = {
  parts: AssessmentPart[]
  examWeight: number
}

export function AssessmentCard({ parts, examWeight }: AssessmentCardProps) {
  const summary =
    examWeight === 0
      ? "No exams. 100% coursework."
      : examWeight === 100
        ? "100% exams."
        : `${examWeight}% exams, ${100 - examWeight}% coursework.`

  return (
    <Card className="gap-5 py-6 [--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight text-white">
          Assessment
        </CardTitle>
        {parts.length > 0 && (
          <CardDescription className="text-bone/60">{summary}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {parts.length === 0 ? (
          <p className="text-sm text-bone/45">
            No assessment breakdown available.
          </p>
        ) : (
          <>
            <div aria-hidden className="flex h-2.5 gap-0.5">
              {parts.map((p, i) => (
                <div
                  key={p.name}
                  style={{ width: `${p.weight}%` }}
                  className={cn(
                    "h-full first:rounded-l-full last:rounded-r-full",
                    SEGMENT[i] ?? SEGMENT.at(-1)
                  )}
                />
              ))}
            </div>
            <ul className="mt-6 flex flex-col gap-3.5">
              {parts.map((p, i) => {
                const Icon = KIND_ICON[p.kind]
                return (
                  <li key={p.name} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={cn(
                        "size-1 shrink-0 rounded-full",
                        SEGMENT[i] ?? SEGMENT.at(-1)
                      )}
                    />
                    <Icon
                      aria-hidden
                      className="size-4 shrink-0 text-bone/45"
                    />
                    <span className="min-w-0 flex-1 text-sm text-bone">
                      {p.name}
                    </span>
                    <span className="font-mono text-sm text-white tabular-nums">
                      {p.weight}%
                    </span>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
