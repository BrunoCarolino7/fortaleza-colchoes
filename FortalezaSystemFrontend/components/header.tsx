"use client"

import { MenuIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useMobileNav } from "@/hooks/use-mobile-nav"

export function Header({ title }: { title: string }) {
  const { setOpen } = useMobileNav()

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-accent/10" onClick={() => setOpen(true)}>
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      </div>
    </header>
  )
}
