"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { useMobileNav } from "@/hooks/use-mobile-nav"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useMobileNav()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated === undefined) return null
  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      <MobileNav open={open} onOpenChange={setOpen} />

      <div className="flex flex-1 flex-col overflow-auto scrollbar-thin">
        {children}
      </div>
    </div>
  )
}
