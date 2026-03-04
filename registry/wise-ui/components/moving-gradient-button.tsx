"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface MovingGradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  animateBorder?: boolean
  animateText?: boolean
  gradientFrom?: string
  gradientTo?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  children: React.ReactNode
}

const MovingGradientButton = React.forwardRef<
  HTMLButtonElement,
  MovingGradientButtonProps
>(
  (
    {
      animateBorder = true,
      animateText = true,
      gradientFrom = "#00a896",
      gradientTo = "#c084fc",
      startIcon,
      endIcon,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const rotation = useMotionValue(0)
    const controlRef = React.useRef<ReturnType<typeof animate> | null>(null)

    React.useEffect(() => {
      if (isHovered && (animateBorder || animateText) && !disabled) {
        controlRef.current = animate(
          rotation,
          rotation.get() + 360 * 10000,
          { duration: 3 * 10000, ease: "linear" }
        )
      } else {
        controlRef.current?.stop()
      }
      return () => {
        controlRef.current?.stop()
      }
    }, [isHovered, animateBorder, animateText, disabled, rotation])

    // Shift –100% per 360° - with backgroundRepeat:"repeat" this scrolls
    // the from→to→from gradient infinitely without any visible seam
    const backgroundPosition = useTransform(
      rotation,
      (v) => `${-(v * 100) / 360}% 0%`
    )

    const showBorderAnimation = isHovered && animateBorder && !disabled
    const showTextAnimation = isHovered && animateText && !disabled

    return (
      <div
        className={cn(
          "group relative inline-flex rounded-md",
          disabled && "pointer-events-none opacity-50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Static border - visible at rest */}
        <div
          className="pointer-events-none absolute inset-0 rounded-md border border-border transition-opacity duration-300"
          style={{ opacity: showBorderAnimation ? 0 : 1 }}
        />

        {/* Spinning conic gradient - visible on hover */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-md transition-opacity duration-300"
          style={{ opacity: showBorderAnimation ? 1 : 0 }}
        >
          <motion.div
            style={{
              position: "absolute",
              width: "200%",
              aspectRatio: "1",
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
              background: `conic-gradient(from 0deg, ${gradientFrom}, ${gradientTo}, ${gradientFrom})`,
              rotate: rotation,
            }}
          />
        </div>

        {/* Inner button */}
        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            "relative z-10 m-[1.5px] inline-flex cursor-pointer items-center gap-2 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors",
            "rounded-[calc(var(--radius-md)-1.5px)]",
            "disabled:cursor-not-allowed",
            className
          )}
          {...props}
        >
          {/* Start icon */}
          {startIcon && (
            <span
              className="inline-flex shrink-0 transition-colors duration-300"
              style={{
                color: showBorderAnimation || (isHovered && !disabled)
                  ? gradientFrom
                  : undefined,
              }}
            >
              {startIcon}
            </span>
          )}

          {/* Text */}
          {showTextAnimation ? (
            <motion.span
              style={{
                backgroundImage: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo}, ${gradientFrom})`,
                backgroundSize: "200% 100%",
                backgroundRepeat: "repeat",
                backgroundPosition,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {children}
            </motion.span>
          ) : (
            <span>{children}</span>
          )}

          {/* End icon */}
          {endIcon && (
            <span
              className="inline-flex shrink-0 transition-colors duration-300"
              style={{
                color: showBorderAnimation || (isHovered && !disabled)
                  ? gradientTo
                  : undefined,
              }}
            >
              {endIcon}
            </span>
          )}
        </button>
      </div>
    )
  }
)
MovingGradientButton.displayName = "MovingGradientButton"

export { MovingGradientButton }
export type { MovingGradientButtonProps }
