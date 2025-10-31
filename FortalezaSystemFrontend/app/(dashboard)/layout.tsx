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
    <div className="relative flex h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute inset-0 gradient-mesh opacity-20 animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </div>

      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      <MobileNav open={open} onOpenChange={setOpen} />

      <div className="flex flex-1 flex-col overflow-auto scrollbar-thin">
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  )
}
