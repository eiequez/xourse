"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ClippedCircle } from "@/components/unlumen-ui/clipped-circle"
import { Tilt, type TiltProps } from "@/components/unlumen-ui/tilt"

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  /** left half of the split badge pill; shown as a simple pill if `badgeLabel` is omitted */
  price?: string
  /** right half of the split pill, coloured by `badgeVariant` */
  badgeLabel?: string
  badgeVariant?: "success" | "warning"
  imageSrc?: string
  imageAlt?: string
  /** wraps the card in a plain `<a>` tag */
  href?: string
  children?: React.ReactNode
  tiltProps?: Omit<TiltProps, "children" | "className">
}

const BADGE_LABEL_CLASSES: Record<
  NonNullable<TiltCardProps["badgeVariant"]>,
  string
> = {
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
}

export function TiltCard({
  title,
  description,
  price,
  badgeLabel,
  badgeVariant = "success",
  imageSrc,
  imageAlt = "",
  href,
  children,
  tiltProps,
  className,
  ...props
}: TiltCardProps) {
  const inner = (
    <Tilt
      rotationFactor={11}
      {...tiltProps}
      className={cn(
        "group relative overflow-hidden",
        "rounded-lg border border-border bg-background",
        "flex flex-col gap-4",
        "h-48 w-full sm:h-52 md:h-56",
        "transition-all duration-400 ease-out hover:scale-105 hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-row justify-between px-4 py-4 transition-all duration-200 sm:px-6 sm:py-5">
        <div className="mr-2 flex flex-1 flex-col gap-1">
          <h2 className="text-lg leading-tight font-medium tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-foreground/50">{description}</p>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>

        {price && badgeLabel ? (
          <div className="inline-flex h-fit shrink-0 items-center text-sm whitespace-nowrap">
            <span className="h-fit rounded-l-full bg-secondary px-2 py-1 font-medium">
              {price}
            </span>
            <span
              className={cn(
                "h-fit rounded-r-full px-2 py-1 text-sm font-medium",
                BADGE_LABEL_CLASSES[badgeVariant]
              )}
            >
              {badgeLabel}
            </span>
          </div>
        ) : price ? (
          <span className="h-fit shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium whitespace-nowrap">
            {price}
          </span>
        ) : null}
      </div>

      {imageSrc && (
        <img
          src={imageSrc}
          alt={imageAlt}
          width={288}
          height={224}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute top-27 -right-10 z-10 w-72",
            "rotate-[-5deg] rounded-md border border-border",
            "transition-transform duration-300 ease-out",
            "group-hover:-translate-x-0.5 group-hover:-translate-y-1 group-hover:-rotate-3"
          )}
        />
      )}

      <ClippedCircle circleClassName="bg-white" circleSize={800} />
    </Tilt>
  )

  if (href) {
    return (
      <a
        href={href}
        className="block cursor-pointer"
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    )
  }

  return <div {...props}>{inner}</div>
}
