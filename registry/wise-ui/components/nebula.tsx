"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface NebulaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary nebula color */
  colorA?: string
  /** Secondary nebula color */
  colorB?: string
  /** Tertiary accent color */
  colorC?: string
  /** Show grain/star dust overlay */
  grain?: boolean
  /** Animation speed multiplier (1 = default) */
  speed?: number
  /** Number of nebula blobs */
  blobCount?: number
  /** Visual mode - "dark" for space theme, "light" for bright/pastel */
  mode?: "dark" | "light"
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const Nebula = React.forwardRef<HTMLDivElement, NebulaProps>(
  (
    {
      colorA = "#6b1d9e",
      colorB = "#0d3b7a",
      colorC = "#c2185b",
      grain = true,
      speed = 1,
      blobCount = 18,
      mode = "dark",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDark = mode === "dark"
    const bgColor = isDark ? "#080012" : "#f4f0f8"
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const uniqueId = React.useId()
    const filterId = `nebula-grain-${uniqueId}`

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

      const colors = [colorA, colorB, colorC]

      interface Blob {
        x: number
        y: number
        r: number
        color: string
        phaseX: number
        phaseY: number
        freqX: number
        freqY: number
        ampX: number
        ampY: number
        rotPhase: number
        rotSpeed: number
      }

      let blobs: Blob[] = []

      function initBlobs() {
        blobs = Array.from({ length: blobCount }, (_, i) => {
          const color = colors[i % colors.length]
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.max(w, h) * (0.15 + Math.random() * 0.25),
            color,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            freqX: 0.15 + Math.random() * 0.35,
            freqY: 0.12 + Math.random() * 0.3,
            ampX: w * (0.1 + Math.random() * 0.2),
            ampY: h * (0.1 + Math.random() * 0.2),
            rotPhase: Math.random() * Math.PI * 2,
            rotSpeed: 0.05 + Math.random() * 0.15,
          }
        })
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
        initBlobs()
      }

      function animate(time: number) {
        const t = time * 0.001 * speed

        ctx!.globalCompositeOperation = "source-over"
        ctx!.fillStyle = mode === "dark" ? "#080012" : "#f4f0f8"
        ctx!.fillRect(0, 0, w, h)

        // Screen for dark (additive glow), multiply for light (subtractive tint)
        ctx!.globalCompositeOperation = mode === "dark" ? "screen" : "multiply"

        for (const b of blobs) {
          // Smooth orbital movement
          const dx = Math.sin(t * b.freqX + b.phaseX) * b.ampX
            + Math.sin(t * b.freqX * 0.4 + b.phaseX * 2.1) * b.ampX * 0.4
          const dy = Math.cos(t * b.freqY + b.phaseY) * b.ampY
            + Math.cos(t * b.freqY * 0.3 + b.phaseY * 1.7) * b.ampY * 0.3

          const drawX = b.x + dx
          const drawY = b.y + dy

          // Pulsating radius
          const pulse = 1 + Math.sin(t * b.rotSpeed + b.rotPhase) * 0.15
          const r = b.r * pulse

          // Draw soft color blob
          const grad = ctx!.createRadialGradient(
            drawX, drawY, 0,
            drawX, drawY, r
          )
          grad.addColorStop(0, hexToRgba(b.color, 0.7))
          grad.addColorStop(0.3, hexToRgba(b.color, 0.4))
          grad.addColorStop(0.6, hexToRgba(b.color, 0.12))
          grad.addColorStop(1, "rgba(0,0,0,0)")

          ctx!.fillStyle = grad
          ctx!.beginPath()
          ctx!.arc(drawX, drawY, r, 0, Math.PI * 2)
          ctx!.fill()
        }

        ctx!.globalCompositeOperation = mode === "dark" ? "screen" : "multiply"
        const emissionCount = 3
        for (let i = 0; i < emissionCount; i++) {
          const ex = w * (0.3 + 0.4 * Math.sin(t * 0.2 * (i + 1) + i * 2.1))
          const ey = h * (0.3 + 0.4 * Math.cos(t * 0.17 * (i + 1) + i * 1.3))
          const er = Math.max(w, h) * 0.04
          const brightness = 0.15 + Math.sin(t * 0.5 + i * 1.5) * 0.1

          const eg = ctx!.createRadialGradient(ex, ey, 0, ex, ey, er)
          eg.addColorStop(0, `rgba(255,255,255,${brightness})`)
          eg.addColorStop(0.5, `rgba(200,210,255,${brightness * 0.4})`)
          eg.addColorStop(1, "rgba(0,0,0,0)")

          ctx!.fillStyle = eg
          ctx!.beginPath()
          ctx!.arc(ex, ey, er, 0, Math.PI * 2)
          ctx!.fill()
        }

        rafId = requestAnimationFrame(animate)
      }

      resize()
      rafId = requestAnimationFrame(animate)

      const ro = new ResizeObserver(resize)
      ro.observe(container)

      return () => {
        cancelAnimationFrame(rafId)
        ro.disconnect()
      }
    }, [colorA, colorB, colorC, blobCount, speed, mode])

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        style={{ background: bgColor }}
        {...props}
      >
        {/* SVG filter for grain */}
        {grain && (
          <svg className="absolute" width="0" height="0" aria-hidden="true">
            <defs>
              <filter id={filterId}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.65"
                  numOctaves={3}
                  stitchTiles="stitch"
                  result="grain"
                />
                <feColorMatrix
                  type="saturate"
                  values="0"
                  in="grain"
                  result="bwGrain"
                />
                <feComponentTransfer in="bwGrain" result="thresholded">
                  <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0.04 0.12" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>
        )}

        {/* Nebula canvas with soft blur for extra fluidity */}
        <div className="absolute inset-0" style={{ filter: "blur(30px)" }}>
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>

        {/* Grain / star dust overlay */}
        {grain && (
          <div
            className={`absolute inset-0 ${isDark ? "mix-blend-screen" : "mix-blend-multiply"}`}
            style={{
              filter: `url(#${filterId})`,
              background: isDark ? "white" : "black",
            }}
          />
        )}

        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)"
              : "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.12) 100%)",
          }}
        />

        {/* Children */}
        {children && <div className="relative z-10">{children}</div>}
      </div>
    )
  }
)
Nebula.displayName = "Nebula"

export { Nebula }
export type { NebulaProps }
