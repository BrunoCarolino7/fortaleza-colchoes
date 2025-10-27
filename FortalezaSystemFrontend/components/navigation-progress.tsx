"use client"

import { useNavigation } from "@/contexts/navigation-context"

export function NavigationProgress() {
  const { isNavigating, progress } = useNavigation()

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
        }}
      />
    </div>
  )
}
