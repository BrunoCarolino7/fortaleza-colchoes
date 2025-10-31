"use client"

import { MenuIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useMobileNav } from "@/hooks/use-mobile-nav"

export function Header({ title }: { title: string }) {
  const { setOpen } = useMobileNav()

  return (
    <header className="sticky top-0 z-10 mb-6 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-lg">
      <div className="flex h-16 items-center gap-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
          onClick={() => setOpen(true)}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>

        <div className="flex flex-col">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          <div className="mt-1 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>
      </div>
    </header>
  )
}
