"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface PulseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pulse ring color */
  pulseColor?: string
  /** Seconds per pulse cycle */
  duration?: number
  children: React.ReactNode
}

const PulseButton = React.forwardRef<HTMLButtonElement, PulseButtonProps>(
  (
    {
      pulseColor = "hsl(var(--primary))",
      duration = 2,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative inline-flex rounded-md">
        {/* Pulse rings */}
        {!disabled && (
          <>
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{
                border: `2px solid ${pulseColor}`,
              }}
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-md"
              style={{
                border: `2px solid ${pulseColor}`,
              }}
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{
                duration,
                delay: duration / 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </>
        )}

        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            "relative inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </div>
    )
  }
)
PulseButton.displayName = "PulseButton"

export { PulseButton }
export type { PulseButtonProps }
