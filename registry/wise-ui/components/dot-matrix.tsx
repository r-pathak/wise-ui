"use client"

import * as React from "react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface DotMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number
  dotSize?: number
  color?: string
  activeColor?: string
  influence?: number
  maxScale?: number
}

function parseColor(color: string): [number, number, number] | null {
  const ctx = typeof document !== "undefined"
    ? document.createElement("canvas").getContext("2d")
    : null
  if (!ctx) return null
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const d = ctx.getImageData(0, 0, 1, 1).data
  return [d[0], d[1], d[2]]
}

const DotMatrix = React.forwardRef<HTMLDivElement, DotMatrixProps>(
  (
    {
      gap = 24,
      dotSize = 2,
      color = "currentColor",
      activeColor,
      influence = 100,
      maxScale = 3,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const mouseRef = React.useRef({ x: -9999, y: -9999 })

    React.useImperativeHandle(ref, () => containerRef.current!)

    React.useEffect(() => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let w = 0
      let h = 0
      let rafId = 0
      let baseRgb: [number, number, number] = [128, 128, 128]
      let activeRgb: [number, number, number] = [128, 128, 128]

      function resolveColors() {
        const computed = getComputedStyle(container!)
        const resolvedColor = color === "currentColor" ? computed.color : color
        const resolvedActive = activeColor
          ? (activeColor === "currentColor" ? computed.color : activeColor)
          : resolvedColor
        baseRgb = parseColor(resolvedColor) ?? [128, 128, 128]
        activeRgb = parseColor(resolvedActive) ?? baseRgb
      }

      function resize() {
        const rect = container!.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio, 2)
        w = rect.width
        h = rect.height
        canvas!.width = w * dpr
        canvas!.height = h * dpr
        canvas!.style.width = `${w}px`
        canvas!.style.height = `${h}px`
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        resolveColors()
      }

      function draw() {
        ctx!.clearRect(0, 0, w, h)
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const inf2 = influence * influence

        for (let x = gap / 2; x < w; x += gap) {
          for (let y = gap / 2; y < h; y += gap) {
            const dx = x - mx
            const dy = y - my
            const dist2 = dx * dx + dy * dy
            const t = dist2 < inf2 ? 1 - Math.sqrt(dist2) / influence : 0
            const s = dotSize * (1 + (maxScale - 1) * t)

            const r = Math.round(baseRgb[0] + (activeRgb[0] - baseRgb[0]) * t)
            const g = Math.round(baseRgb[1] + (activeRgb[1] - baseRgb[1]) * t)
            const b = Math.round(baseRgb[2] + (activeRgb[2] - baseRgb[2]) * t)
            const alpha = 0.3 + 0.7 * t

            ctx!.fillStyle = `rgba(${r},${g},${b},${alpha})`
            ctx!.beginPath()
            ctx!.arc(x, y, s, 0, Math.PI * 2)
            ctx!.fill()
          }
        }

        rafId = requestAnimationFrame(draw)
      }

      function handleMouseMove(e: MouseEvent) {
        const rect = container!.getBoundingClientRect()
        mouseRef.current.x = e.clientX - rect.left
        mouseRef.current.y = e.clientY - rect.top
      }

      function handleMouseLeave() {
        mouseRef.current.x = -9999
        mouseRef.current.y = -9999
      }

      resize()
      rafId = requestAnimationFrame(draw)

      const ro = new ResizeObserver(resize)
      ro.observe(container)
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        cancelAnimationFrame(rafId)
        ro.disconnect()
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }, [gap, dotSize, color, activeColor, influence, maxScale])

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
        {children && <div className="relative z-10">{children}</div>}
      </div>
    )
  }
)
DotMatrix.displayName = "DotMatrix"

export { DotMatrix }
export type { DotMatrixProps }
