"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

// Returns to the previous page on this site, or to `fallback` when the page
// was opened directly (new tab, bookmark, link from another site)
export function BackButton({ fallback = "/browse" }: { fallback?: string }) {
  const router = useRouter()

  function goBack() {
    const cameFromThisSite =
      document.referrer &&
      new URL(document.referrer).origin === window.location.origin
    if (cameFromThisSite && window.history.length > 1) router.back()
    else router.push(fallback)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={goBack}
      className="-ml-2.5 text-bone/60 hover:bg-bone/6 hover:text-bone"
    >
      <ArrowLeftIcon />
      Back
    </Button>
  )
}
