import { BrowseHeader } from "@/components/browse/browse-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="px-6 pt-14 pb-24 lg:px-24 lg:pt-20">
      <div className="mx-auto max-w-7xl" aria-busy="true">
        <BrowseHeader />
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
          <Skeleton className="h-11 w-full rounded-xl bg-bone/5 lg:max-w-md" />
          <Skeleton className="h-8 w-56 rounded-full bg-bone/5" />
        </div>
        <Skeleton className="mt-8 h-4 w-24 bg-bone/5" />
        <ol className="mt-4 border-t border-umber/50">
          {Array.from({ length: 8 }, (_, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-6 border-b border-umber/50 py-5"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16 bg-bone/5" />
                <Skeleton className="h-4 w-52 bg-bone/5" />
              </div>
              <Skeleton className="h-7 w-10 bg-bone/5" />
            </li>
          ))}
        </ol>
        <span className="sr-only">Loading courses</span>
      </div>
    </div>
  )
}
