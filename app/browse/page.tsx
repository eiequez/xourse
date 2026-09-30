import type { Metadata } from "next"

import { getCourseSummaries } from "@/lib/course-queries"
import { parseSort } from "@/lib/courses"
import { CourseBrowser } from "@/components/browse/course-browser"
import { BrowseHeader } from "@/components/browse/browse-header"

export const metadata: Metadata = {
  title: "Browse electives",
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function Browse(props: PageProps<"/browse">) {
  const searchParams = await props.searchParams
  const courses = await getCourseSummaries()

  return (
    <div className="px-6 pt-14 pb-24 lg:px-24 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <BrowseHeader />
        <CourseBrowser
          courses={courses}
          initialQuery={firstParam(searchParams.q) ?? ""}
          initialType={firstParam(searchParams.type) ?? "all"}
          initialSort={parseSort(firstParam(searchParams.sort))}
        />
      </div>
    </div>
  )
}
