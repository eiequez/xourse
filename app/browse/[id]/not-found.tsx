import Link from "next/link"
import { SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function CourseNotFound() {
  return (
    <div className="px-6 py-24 lg:px-24">
      <Empty className="mx-auto max-w-7xl border border-umber/50 py-20">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="size-11 rounded-full bg-bone/6 text-bone/60"
          >
            <SearchXIcon className="size-5" />
          </EmptyMedia>
          <EmptyTitle className="text-lg font-semibold tracking-tight text-white">
            Course not found
          </EmptyTitle>
          <EmptyDescription className="text-bone/55">
            There is no course with this code. Check the link, or find the
            course in the list.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            render={<Link href="/browse" />}
            nativeButton={false}
            className="bg-wine text-white hover:bg-wine/90"
          >
            Browse electives
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
