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
    <div className="relative flex h-full w-64 flex-col border-r border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl">
      {/* Gradient accent on the edge */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-primary/50 via-accent/50 to-transparent" />

      <div className="flex h-16 items-center border-b border-border/40 px-6 backdrop-blur-sm">
        <h1 className="font-heading text-xl font-bold tracking-tight text-gradient">Fortaleza Colchões</h1>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <ProgressLink
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground hover:shadow-md",
              )}
            >
              {/* Active indicator */}
              {isActive && <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />}

              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover:scale-110",
                )}
              />
              {item.name}

              {/* Hover glow effect */}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              )}
            </ProgressLink>
          )
        })}
      </nav>

      <div className="border-t border-border/40 p-4 backdrop-blur-sm">
        {true && (
          <div className="mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 backdrop-blur-sm border border-primary/20 shadow-lg">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Bem-vindo</p>
            <p className="mt-1 font-heading text-lg font-bold text-foreground">Moisés</p>
            <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
        )}
        <Button
          variant="ghost"
          className="group w-full justify-start gap-3 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive hover:shadow-md"
          onClick={logout}
        >
          <LogOutIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          Sair
        </Button>
      </div>
    </div>
  )
}
