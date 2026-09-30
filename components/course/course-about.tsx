import { InfoIcon } from "lucide-react"

import type { EnrollmentNote } from "@/lib/course-info"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CourseAboutProps = {
  notes: EnrollmentNote[]
  body: string
}

export function CourseAbout({ notes, body }: CourseAboutProps) {
  return (
    <Card className="gap-5 py-6 [--card-spacing:--spacing(6)]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight text-white">
          About this course
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {notes.length > 0 && (
          <Alert className="border-sand/25 bg-sand/8 px-4 py-3 text-sand">
            <InfoIcon />
            <AlertTitle className="font-medium">Before you enroll</AlertTitle>
            <AlertDescription className="mt-1.5 text-bone/80">
              <dl className="flex flex-col gap-2">
                {notes.map((note, i) => (
                  <div key={i}>
                    <dt className="text-xs font-medium text-sand/90">
                      {note.label}
                    </dt>
                    <dd className="mt-0.5 leading-relaxed">{note.text}</dd>
                  </div>
                ))}
              </dl>
            </AlertDescription>
          </Alert>
        )}
        {body ? (
          <p className="max-w-prose text-[0.95rem] leading-relaxed text-bone/75">
            {body}
          </p>
        ) : (
          <p className="text-sm text-bone/45">No description available.</p>
        )}
      </CardContent>
    </Card>
  )
}
