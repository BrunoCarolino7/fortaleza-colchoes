"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { useMobileNav } from "@/hooks/use-mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { open, setOpen } = useMobileNav()

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      <MobileNav open={open} onOpenChange={setOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  )
}
