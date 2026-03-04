"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface TiltCardProps {
  tiltMax?: number
  glare?: boolean
  glareOpacity?: number
  scale?: number
  perspective?: number
  children: React.ReactNode
  className?: string
}

const springConfig = { stiffness: 300, damping: 20, mass: 0.5 }

function TiltCard({
  tiltMax = 15,
  glare = true,
  glareOpacity = 0.15,
  scale = 1.02,
  perspective = 1000,
  children,
  className,
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rawScale = useMotionValue(1)

  const rotateX = useSpring(rawX, springConfig)
  const rotateY = useSpring(rawY, springConfig)
  const springScale = useSpring(rawScale, springConfig)

  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${glareOpacity}), transparent 60%)`
  )

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const offsetX = (e.clientX - centerX) / (rect.width / 2)
    const offsetY = (e.clientY - centerY) / (rect.height / 2)

    rawX.set(offsetY * tiltMax)
    rawY.set(-offsetX * tiltMax)

    // Glare follows mouse position as percentage
    glareX.set(((e.clientX - rect.left) / rect.width) * 100)
    glareY.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  function handleMouseEnter() {
    rawScale.set(scale)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
    rawScale.set(1)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{
        perspective,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        scale: springScale,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  )
}
TiltCard.displayName = "TiltCard"

export { TiltCard }
export type { TiltCardProps }
