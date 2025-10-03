"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, UsersIcon, PackageIcon, LogOutIcon } from "@/components/icons"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Clientes", href: "/clientes", icon: UsersIcon },
  { name: "Estoque", href: "/estoque", icon: PackageIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-semibold text-foreground">Fortaleza System</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        {true && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-foreground">Bem Vindo,</p>
            <p className="text-xs text-muted-foreground">Moisés</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={logout}
        >
          <LogOutIcon className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )
}
