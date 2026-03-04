"use client"

import * as React from "react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface MarqueeProps {
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  children: React.ReactNode
  className?: string
}

function Marquee({
  speed = 40,
  direction = "left",
  pauseOnHover = false,
  children,
  className,
}: MarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = React.useState(0)
  const scopedId = React.useId().replace(/:/g, "")
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const first = el.firstElementChild as HTMLElement | null
      if (first) setContentWidth(first.scrollWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])

  const duration = contentWidth > 0 ? contentWidth / speed : 0
  const keyframeName = `marquee-${scopedId}`

  const from = direction === "left" ? "0%" : "-50%"
  const to = direction === "left" ? "-50%" : "0%"

  return (
    <div className={cn("overflow-hidden", className)}>
      <style>{`
        @keyframes ${keyframeName} {
          from { transform: translateX(${from}); }
          to { transform: translateX(${to}); }
        }
      `}</style>
      <div
        ref={containerRef}
        className="flex w-max"
        style={{
          animationName: keyframeName,
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
Marquee.displayName = "Marquee"

export { Marquee }
export type { MarqueeProps }
