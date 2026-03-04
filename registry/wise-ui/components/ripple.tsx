"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface RippleProps {
  color?: string
  duration?: number
  ringCount?: number
  mode?: "click" | "pulse"
  children: React.ReactNode
  className?: string
}

interface RippleEntry {
  x: number
  y: number
  id: number
}

let nextId = 0

function Ripple({
  color = "currentColor",
  duration = 600,
  ringCount = 3,
  mode = "click",
  children,
  className,
}: RippleProps) {
  const [ripples, setRipples] = React.useState<RippleEntry[]>([])
  const containerRef = React.useRef<HTMLDivElement>(null)

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (mode !== "click") return
    const rect = containerRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipples((prev) => [...prev, { x, y, id: nextId++ }])
  }

  function removeRipple(id: number) {
    setRipples((prev) => prev.filter((r) => r.id !== id))
  }

  const durationS = duration / 1000

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
    >
      {children}

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="pointer-events-none absolute inset-0"
          >
            {Array.from({ length: ringCount }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 20,
                  height: 20,
                  x: "-50%",
                  y: "-50%",
                  border: `1.5px solid ${color}`,
                }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: durationS,
                  delay: i * (durationS * 0.2),
                  ease: "easeOut",
                }}
                onAnimationComplete={() => {
                  if (i === ringCount - 1) removeRipple(ripple.id)
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* Pulse mode */}
      {mode === "pulse" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: ringCount }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 20,
                height: 20,
                border: `1.5px solid ${color}`,
              }}
              animate={{ scale: [0, 2.5], opacity: [0.6, 0] }}
              transition={{
                duration: durationS,
                delay: i * (durationS / ringCount),
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
Ripple.displayName = "Ripple"

export { Ripple }
export type { RippleProps }
