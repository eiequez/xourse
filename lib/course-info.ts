import type { Json } from "@/lib/supabase/database.types"

export type AssessmentKind =
  "exam" | "quiz" | "presentation" | "participation" | "coursework"

export type AssessmentPart = {
  name: string
  weight: number
  kind: AssessmentKind
}

function assessmentKind(name: string): AssessmentKind {
  const n = name.toLowerCase()
  // Exams first, so "Mid-Term Test/ Quiz" counts toward the exam share
  if (/exam|test|mid-?term/.test(n)) return "exam"
  if (n.includes("quiz")) return "quiz"
  if (/participation|in class|classroom|discussion/.test(n))
    return "participation"
  if (n.includes("presentation") && !n.includes("project"))
    return "presentation"
  return "coursework"
}

// `assessment_methods` is a JSON object of { "Final Examination": 40, ... }.
// Returns the parts heaviest first, plus how much of the grade is exams.
export function organizeAssessment(methods: Json | null) {
  const parts: AssessmentPart[] =
    methods && typeof methods === "object" && !Array.isArray(methods)
      ? Object.entries(methods)
          .filter((entry): entry is [string, number] => {
            return typeof entry[1] === "number" && entry[1] > 0
          })
          .map(([name, weight]) => ({
            name: name.trim(),
            weight,
            kind: assessmentKind(name),
          }))
          .sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name))
      : []

  const examWeight = parts
    .filter((p) => p.kind === "exam")
    .reduce((sum, p) => sum + p.weight, 0)

  return { parts, examWeight }
}

export type EnrollmentNote = {
  label: string
  text: string
}

const NOTE_LABELS: Record<string, string> = {
  restriction: "Who can take it",
  requirement: "Requirement",
  prerequisite: "Prerequisite",
  "pre-requisite": "Prerequisite",
  note: "Note",
}

const NOTE_PREFIX = /^(restriction|requirement|pre-?requisite|note)s?:\s*/i

// Many descriptions open with labelled sentences ("Restriction: ...",
// "Note: ...", "Pre-requisite: ..."). Pull those out so the page can show
// them as enrollment notes, and return the rest as the description body.
export function extractEnrollmentNotes(description: string | null) {
  const sentences = (description ?? "").trim().split(/(?<=\.)\s+(?=[A-Z(（])/)
  const notes: EnrollmentNote[] = []
  let i = 0

  for (; i < sentences.length; i++) {
    const sentence = sentences[i]!
    const match = sentence.match(NOTE_PREFIX)
    if (match) {
      notes.push({
        label: NOTE_LABELS[match[1]!.toLowerCase()] ?? "Note",
        text: sentence.slice(match[0].length),
      })
    } else if (notes.length > 0 && /^\(\d+\)/.test(sentence)) {
      // Numbered follow-ups like "(2) This course is NOT offered to ..."
      notes[notes.length - 1]!.text += ` ${sentence}`
    } else {
      break
    }
  }

  return { notes, body: sentences.slice(i).join(" ") }
}
