"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  color?: string
  className?: string
}

function BorderBeam({
  size = 80,
  duration = 6,
  delay = 0,
  color = "hsl(var(--primary))",
  className,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg, transparent 0%, transparent 70%, ${color} 85%, transparent 100%)`,
          width: "200%",
          height: "200%",
          left: "-50%",
          top: "-50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Inner mask to show only the border strip */}
      <div className="absolute inset-[1.5px] rounded-[inherit] bg-background" />
    </div>
  )
}
BorderBeam.displayName = "BorderBeam"

export { BorderBeam }
export type { BorderBeamProps }
