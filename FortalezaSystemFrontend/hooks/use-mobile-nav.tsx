"use client"

import { create } from "zustand"

interface MobileNavStore {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useMobileNav = create<MobileNavStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))
