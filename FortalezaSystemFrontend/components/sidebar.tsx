"use client"

import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, UsersIcon, PackageIcon, LogOutIcon } from "@/components/icons"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ProgressLink } from "@/components/progress-link"

const navigation = [
  { name: "Painel de Controle", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Clientes", href: "/clientes", icon: UsersIcon },
  { name: "Estoque", href: "/estoque", icon: PackageIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground shadow-xl">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="font-heading text-xl font-bold tracking-tight">Fortaleza Colchões</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <ProgressLink
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </ProgressLink>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        {true && (
          <div className="mb-4 rounded-lg bg-sidebar-accent/50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/60">Bem-vindo</p>
            <p className="mt-1 font-heading text-base font-semibold text-sidebar-foreground">Moisés</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={logout}
        >
          <LogOutIcon className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )
}
