import Link from "next/link"

import { plural, TYPE_BADGE, typeLabel } from "@/lib/courses"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type CourseHeaderProps = {
  code: string
  name: string
  credits: number
  type: string
}

export function CourseHeader({ code, name, credits, type }: CourseHeaderProps) {
  return (
    <header>
      <Breadcrumb>
        <BreadcrumbList className="text-bone/50">
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/browse" />}
              className="hover:text-bone"
            >
              Browse
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono text-bone/80">
              {code}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Badge
          className={cn(
            "h-6 rounded-full px-2.5 text-xs font-medium",
            TYPE_BADGE[type] ?? "bg-bone text-night"
          )}
        >
          {typeLabel(type)}
        </Badge>
        <span className="font-mono text-sm text-bone/60">{code}</span>
        <span className="text-sm text-bone/60">
          {plural(credits, "credit")}
        </span>
      </div>

      <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight font-semibold tracking-tight text-balance text-white lg:text-5xl">
        {name}
      </h1>
    </header>
  )
}
