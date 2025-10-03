"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { LayoutDashboardIcon, UsersIcon, PackageIcon, LogOutIcon } from "@/components/icons"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Clientes", href: "/clientes", icon: UsersIcon },
  { name: "Estoque", href: "/estoque", icon: PackageIcon },
]

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle>Fortaleza System</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onOpenChange(false)}
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
              <p className="text-sm font-medium text-foreground">Bem Vindo</p>
              <p className="text-xs text-muted-foreground">Moisés</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              onOpenChange(false)
              logout()
            }}
          >
            <LogOutIcon className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
