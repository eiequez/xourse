"use client"

import Link from "next/link"
import { LogOutIcon, UserIcon } from "lucide-react"

import { signOut } from "@/lib/actions/auth"
import { avatarSrc } from "@/lib/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserMenuProps = {
  name: string | null
  email: string | null
  avatarUrl: string | null
}

function initials(name: string | null, email: string | null) {
  const source = name ?? email ?? "?"
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("")
}

export function UserMenu({ name, email, avatarUrl }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          <AvatarImage src={avatarSrc(avatarUrl)} alt="" />
          <AvatarFallback className="bg-sand/15 text-xs font-semibold text-sand">
            {initials(name, email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-1.5">
            {name && (
              <span className="truncate text-sm font-medium text-bone">
                {name}
              </span>
            )}
            {email && (
              <span className="truncate text-xs text-bone/50">{email}</span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account" />}>
          <UserIcon />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
