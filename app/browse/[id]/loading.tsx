import { Skeleton } from "@/components/ui/skeleton"

const bar = "bg-bone/5"

export default function Loading() {
  return (
    <div className="px-6 pt-10 pb-24 lg:px-24 lg:pt-14">
      <div className="mx-auto max-w-7xl" aria-busy="true">
        <Skeleton className={`h-4 w-32 ${bar}`} />
        <div className="mt-8 flex gap-3">
          <Skeleton className={`h-6 w-16 rounded-full ${bar}`} />
          <Skeleton className={`h-6 w-28 ${bar}`} />
        </div>
        <Skeleton className={`mt-4 h-12 w-full max-w-xl ${bar}`} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <Skeleton className={`h-64 rounded-xl ${bar}`} />
          <Skeleton className={`h-64 rounded-xl ${bar}`} />
        </div>
        <Skeleton className={`mt-6 h-48 rounded-xl ${bar}`} />

        <Skeleton className={`mt-16 h-8 w-40 ${bar}`} />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex gap-4 border-b border-umber/50 py-7">
            <Skeleton className={`size-10 rounded-full ${bar}`} />
            <div className="flex flex-1 flex-col gap-2.5">
              <Skeleton className={`h-4 w-32 ${bar}`} />
              <Skeleton className={`h-3 w-24 ${bar}`} />
              <Skeleton className={`h-4 w-full max-w-prose ${bar}`} />
            </div>
          </div>
        ))}
        <span className="sr-only">Loading course</span>
      </div>
    </div>
  )
}
