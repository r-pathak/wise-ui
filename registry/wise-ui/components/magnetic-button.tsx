"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** How far the button can travel toward the cursor (px) */
  strength?: number
  /** Radius around the button that activates the magnetic pull (px) */
  range?: number
  children: React.ReactNode
}

const springConfig = { stiffness: 200, damping: 15, mass: 0.5 }

const MagneticButton = React.forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(
  (
    {
      strength = 12,
      range = 150,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)

    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const x = useSpring(rawX, springConfig)
    const y = useSpring(rawY, springConfig)

    React.useEffect(() => {
      const el = containerRef.current
      if (!el || disabled) return

      function handleMouseMove(e: MouseEvent) {
        const rect = el!.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distX = e.clientX - centerX
        const distY = e.clientY - centerY
        const dist = Math.sqrt(distX * distX + distY * distY)

        if (dist < range) {
          const pull = 1 - dist / range
          rawX.set(distX * pull * (strength / range) * 2)
          rawY.set(distY * pull * (strength / range) * 2)
        } else {
          rawX.set(0)
          rawY.set(0)
        }
      }

      function handleMouseLeave() {
        rawX.set(0)
        rawY.set(0)
      }

      window.addEventListener("mousemove", handleMouseMove)
      el.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        el.removeEventListener("mouseleave", handleMouseLeave)
      }
    }, [disabled, range, strength, rawX, rawY])

    return (
      <motion.div
        ref={containerRef}
        className="inline-flex"
        style={{ x, y }}
      >
        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            "relative inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </motion.div>
    )
  }
)
MagneticButton.displayName = "MagneticButton"

export { MagneticButton }
export type { MagneticButtonProps }
