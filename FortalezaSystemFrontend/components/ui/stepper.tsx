"use client"

import { CheckIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors sm:h-10 sm:w-10",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      isCurrent && "border-primary bg-background text-primary",
                      !isCompleted && !isCurrent && "border-muted-foreground/25 bg-background text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <span>{stepNumber}</span>}
                  </div>
                </div>
                <div className="flex min-w-0 flex-col items-center text-center">
                  <span
                    className={cn(
                      "truncate text-xs font-medium sm:text-sm",
                      isCurrent ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span className="hidden text-xs text-muted-foreground sm:block">{step.description}</span>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-full flex-1 transition-colors",
                    stepNumber < currentStep ? "bg-primary" : "bg-muted-foreground/25",
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
