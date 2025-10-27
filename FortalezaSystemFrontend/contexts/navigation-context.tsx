"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { usePathname, useSearchParams } from "next/navigation"

interface NavigationContextType {
  isNavigating: boolean
  progress: number
  startNavigation: () => void
  completeNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startNavigation = useCallback(() => {
    setIsNavigating(true)
    setProgress(0)

    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress < 90) {
        setProgress(currentProgress)
      } else {
        clearInterval(interval)
        setProgress(90)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const completeNavigation = useCallback(() => {
    setProgress(100)
    setTimeout(() => {
      setIsNavigating(false)
      setProgress(0)
    }, 200)
  }, [])

  useEffect(() => {
    if (isNavigating) {
      completeNavigation()
    }
  }, [pathname, searchParams, isNavigating, completeNavigation])

  return (
    <NavigationContext.Provider value={{ isNavigating, progress, startNavigation, completeNavigation }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
