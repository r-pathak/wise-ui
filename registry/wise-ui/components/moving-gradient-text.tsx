"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface MovingGradientTextProps {
  gradientFrom?: string
  gradientTo?: string
  speed?: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

const MovingGradientText = React.forwardRef<
  HTMLSpanElement,
  MovingGradientTextProps
>(
  (
    {
      gradientFrom = "#00a896",
      gradientTo = "#c084fc",
      speed = 1,
      children,
      className,
      style,
    },
    ref
  ) => {
    const rotation = useMotionValue(0)
    const controlRef = React.useRef<ReturnType<typeof animate> | null>(null)

    React.useEffect(() => {
      controlRef.current = animate(
        rotation,
        rotation.get() + 360 * 10000,
        { duration: (3 / speed) * 10000, ease: "linear" }
      )
      return () => {
        controlRef.current?.stop()
      }
    }, [speed, rotation])

    const backgroundPosition = useTransform(
      rotation,
      (v) => `${-(v * 100) / 360}% 0%`
    )

    return (
      <motion.span
        ref={ref}
        className={cn("inline-block", className)}
        style={{
          backgroundImage: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo}, ${gradientFrom})`,
          backgroundSize: "200% 100%",
          backgroundRepeat: "repeat",
          backgroundPosition,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          ...style,
        }}
      >
        {children}
      </motion.span>
    )
  }
)
MovingGradientText.displayName = "MovingGradientText"

export { MovingGradientText }
export type { MovingGradientTextProps }
