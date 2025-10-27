"use client"

import type React from "react"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useNavigation } from "@/contexts/navigation-context"
import type { ComponentProps, MouseEvent } from "react"

interface ProgressLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode
}

export function ProgressLink({ href, onClick, children, ...props }: ProgressLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { startNavigation } = useNavigation()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const targetPath = typeof href === "string" ? href : href.pathname || ""
    if (targetPath !== pathname) {
      startNavigation()
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
