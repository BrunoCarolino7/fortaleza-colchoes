"use client"

import { MenuIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useMobileNav } from "@/hooks/use-mobile-nav"

export function Header({ title }: { title: string }) {
  const { setOpen } = useMobileNav()

  return (
    <header className="border-b border-border bg-card">
      <div className="flex h-14 items-center gap-4 px-4 sm:h-16 sm:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
        <h2 className="text-lg font-semibold text-foreground sm:text-2xl">{title}</h2>
      </div>
    </header>
  )
}
