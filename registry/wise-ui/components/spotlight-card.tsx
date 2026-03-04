"use client"

import * as React from "react"
import { motion, useMotionValue, useMotionTemplate } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface SpotlightCardProps {
  spotlightColor?: string
  spotlightSize?: number
  children: React.ReactNode
  className?: string
}

function SpotlightCard({
  spotlightColor = "rgba(255,255,255,0.08)",
  spotlightSize = 200,
  children,
  className,
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = React.useState(false)

  const background = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{ background, opacity: isHovered ? 1 : 0 }}
      />
      <div className="relative z-20">{children}</div>
    </div>
  )
}
SpotlightCard.displayName = "SpotlightCard"

export { SpotlightCard }
export type { SpotlightCardProps }
