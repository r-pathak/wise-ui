"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MetallicLavaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base metallic color */
  color?: string
  /** Highlight/specular color */
  highlightColor?: string
  /** Animation speed multiplier (1 = default) */
  speed?: number
  /** Number of lava blobs */
  blobCount?: number
  /** Visual mode - "dark" renders light blobs on dark, "light" inverts */
  mode?: "dark" | "light"
}

const MetallicLava = React.forwardRef<HTMLDivElement, MetallicLavaProps>(
  (
    {
      color = "#8a9bae",
      highlightColor = "#c5d0dc",
      speed = 1,
      blobCount = 28,
      mode = "dark",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => containerRef.current!)

    React.useEffect(() => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Padding around canvas for blur/contrast filter - prevents edge artifacts
      const PAD = 80
      let w = 0
      let h = 0
      let rafId = 0

      interface Blob {
        x: number
        y: number
        rx: number
        ry: number
        rotation: number
        rotSpeed: number
        vx: number
        vy: number
        phase: number
        freq: number
        ampX: number
        ampY: number
        pulsePhase: number
        pulseSpeed: number
        numPoints: number
        offsets: number[]
      }

      let blobs: Blob[] = []

      function initBlobs() {
        // Distribute blobs in a jittered grid for even coverage
        const cols = Math.max(1, Math.ceil(Math.sqrt(blobCount * w / h)))
        const rows = Math.max(1, Math.ceil(blobCount / cols))
        const cellW = w / cols
        const cellH = h / rows

        blobs = Array.from({ length: blobCount }, (_, i) => {
          const col = i % cols
          const row = Math.floor(i / cols)
          const baseSpeed = 0.12 + Math.random() * 0.35
          const angle = Math.random() * Math.PI * 2
          const baseR = 50 + Math.random() * 120
          const stretch = 0.5 + Math.random() * 1.0
          const numPoints = 8 + Math.floor(Math.random() * 5)
          const offsets = Array.from(
            { length: numPoints },
            () => 0.7 + Math.random() * 0.6
          )
          return {
            x: (col + 0.5) * cellW + (Math.random() - 0.5) * cellW * 0.8,
            y: (row + 0.5) * cellH + (Math.random() - 0.5) * cellH * 0.8,
            rx: baseR * stretch,
            ry: baseR / stretch,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            vx: Math.cos(angle) * baseSpeed,
            vy: Math.sin(angle) * baseSpeed,
            phase: Math.random() * Math.PI * 2,
            freq: 0.15 + Math.random() * 0.35,
            ampX: 25 + Math.random() * 70,
            ampY: 25 + Math.random() * 70,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.12 + Math.random() * 0.3,
            numPoints,
            offsets,
          }
        })
      }

      function resize() {
        const rect = container!.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio, 2)
        w = rect.width
        h = rect.height
        // Canvas is larger than container to include padding for filter
        const cw = w + PAD * 2
        const ch = h + PAD * 2
        canvas!.width = cw * dpr
        canvas!.height = ch * dpr
        canvas!.style.width = `${cw}px`
        canvas!.style.height = `${ch}px`
        // Scale for DPR and translate so container (0,0) → canvas (PAD, PAD)
        ctx!.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr)
        if (blobs.length === 0) initBlobs()
      }

      function animate(time: number) {
        const t = time * 0.001 * speed

        ctx!.globalCompositeOperation = "source-over"
        ctx!.fillStyle = "#0a0a0f"
        // Clear the full canvas including padding
        ctx!.fillRect(-PAD, -PAD, w + PAD * 2, h + PAD * 2)

        ctx!.globalCompositeOperation = "lighter"

        for (const b of blobs) {
          b.x += b.vx * speed
          b.y += b.vy * speed

          const wobbleX =
            Math.sin(t * b.freq + b.phase) * b.ampX +
            Math.sin(t * b.freq * 0.37 + b.phase * 2.1) * b.ampX * 0.3
          const wobbleY =
            Math.cos(t * b.freq * 0.8 + b.phase) * b.ampY +
            Math.cos(t * b.freq * 0.29 + b.phase * 1.7) * b.ampY * 0.25

          const pulse = 1 + Math.sin(t * b.pulseSpeed + b.pulsePhase) * 0.15
          const rx = b.rx * pulse
          const ry = b.ry * pulse
          const rot = b.rotation + t * b.rotSpeed

          const drawX = b.x + wobbleX
          const drawY = b.y + wobbleY

          const pad = Math.max(b.rx, b.ry) * 2.5
          if (b.x > w + pad) b.x = -pad
          if (b.x < -pad) b.x = w + pad
          if (b.y > h + pad) b.y = -pad
          if (b.y < -pad) b.y = h + pad

          // Sharper radial gradient for glassy metallic look
          const outerR = Math.max(rx, ry)
          const grad = ctx!.createRadialGradient(
            drawX, drawY, 0,
            drawX, drawY, outerR
          )
          grad.addColorStop(0, "rgba(255, 255, 255, 1.0)")
          grad.addColorStop(0.12, "rgba(255, 255, 255, 0.88)")
          grad.addColorStop(0.3, "rgba(225, 232, 245, 0.55)")
          grad.addColorStop(0.5, "rgba(180, 195, 215, 0.18)")
          grad.addColorStop(0.72, "rgba(140, 155, 175, 0.04)")
          grad.addColorStop(1, "rgba(0, 0, 0, 0)")

          ctx!.fillStyle = grad

          // Draw blobby shape using deformed ellipse points + smooth bezier
          const rotCos = Math.cos(rot)
          const rotSin = Math.sin(rot)
          const pts: { x: number; y: number }[] = []
          for (let i = 0; i < b.numPoints; i++) {
            const a = (i / b.numPoints) * Math.PI * 2
            const ex = rx * Math.cos(a) * b.offsets[i]
            const ey = ry * Math.sin(a) * b.offsets[i]
            pts.push({
              x: drawX + ex * rotCos - ey * rotSin,
              y: drawY + ex * rotSin + ey * rotCos,
            })
          }

          ctx!.beginPath()
          const last = pts[pts.length - 1]
          const first = pts[0]
          ctx!.moveTo((last.x + first.x) / 2, (last.y + first.y) / 2)
          for (let i = 0; i < b.numPoints; i++) {
            const next = pts[(i + 1) % b.numPoints]
            ctx!.quadraticCurveTo(
              pts[i].x, pts[i].y,
              (pts[i].x + next.x) / 2, (pts[i].y + next.y) / 2
            )
          }
          ctx!.closePath()
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
    }, [blobCount, speed])

    const isDark = mode === "dark"
    const bgColor = isDark ? "#0a0a0f" : "#f0f0f5"
    const canvasFilter = isDark
      ? "blur(12px) contrast(14)"
      : "blur(12px) contrast(14) invert(1)"
    const overlayBlend = isDark ? "multiply" : "screen"

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        style={{ background: bgColor }}
        {...props}
      >
        {/* Canvas with blur + contrast = metaball merging effect */}
        <div
          className="absolute"
          style={{
            inset: -80,
            filter: canvasFilter,
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>

        {/* Metallic color overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(
              135deg,
              ${color} 0%,
              ${highlightColor} 25%,
              ${color} 50%,
              ${isDark ? "#6b7a8a" : "#a0b0c0"} 75%,
              ${highlightColor} 100%
            )`,
            backgroundSize: "400% 400%",
            animation: "metallic-lava-gradient 20s ease-in-out infinite",
            mixBlendMode: overlayBlend,
          }}
        />

        {/* Moving specular sheen for chrome/glass effect */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "120%",
            height: "80%",
            top: "-10%",
            left: "-10%",
            background: `radial-gradient(ellipse, rgba(255,255,255,${isDark ? 0.15 : 0.08}) 0%, transparent 55%)`,
            mixBlendMode: isDark ? "screen" : "overlay",
            animation: "metallic-lava-sheen 18s ease-in-out infinite",
          }}
        />

        {children && <div className="relative z-10">{children}</div>}

        <style>{`
          @keyframes metallic-lava-sheen {
            0%   { transform: translate(0%, 0%); }
            25%  { transform: translate(20%, 15%); }
            50%  { transform: translate(5%, 30%); }
            75%  { transform: translate(-10%, 10%); }
            100% { transform: translate(0%, 0%); }
          }
          @keyframes metallic-lava-gradient {
            0%   { background-position: 0% 0%; }
            25%  { background-position: 100% 30%; }
            50%  { background-position: 60% 100%; }
            75%  { background-position: 0% 60%; }
            100% { background-position: 0% 0%; }
          }
        `}</style>
      </div>
    )
  }
)
MetallicLava.displayName = "MetallicLava"

export { MetallicLava }
export type { MetallicLavaProps }
