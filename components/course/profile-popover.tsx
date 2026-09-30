"use client"

import type { ReactNode } from "react"

import { avatarSrc, displayName } from "@/lib/profile"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export type ReviewerProfile = {
  username: string | null
  fullName: string | null
  avatarUrl: string | null
  bio: string | null
}

// Clicking a reviewer's avatar or name shows their basic profile
export function ProfilePopover({
  profile,
  children,
}: {
  profile: ReviewerProfile
  children: ReactNode
}) {
  const name = displayName(profile.fullName, profile.username)
  const bio = profile.bio?.trim()

  return (
    <Popover>
      <PopoverTrigger
        aria-label={`View ${name}'s profile`}
        className="flex min-w-0 items-center gap-3 rounded-full text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {children}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 gap-0 p-5">
        <Avatar className="size-16">
          <AvatarImage src={avatarSrc(profile.avatarUrl)} alt="" />
        </Avatar>
        <PopoverTitle className="mt-3 text-base font-semibold text-white">
          {name}
        </PopoverTitle>
        {profile.username && (
          <p className="text-sm text-bone/50">@{profile.username}</p>
        )}
        <PopoverDescription
          className={
            bio
              ? "mt-3 text-sm leading-relaxed text-bone/80"
              : "mt-3 text-sm text-bone/40"
          }
        >
          {bio || "No bio yet."}
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  )
}
