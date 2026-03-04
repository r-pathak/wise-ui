"use client"

import * as React from "react"
import { MetallicLava } from "@/registry/wise-ui/components/metallic-lava"
import { useTheme } from "../../_components/theme-provider"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { MetallicLava } from "@/components/ui/metallic-lava"

export default function Example() {
  return (
    <MetallicLava className="h-screen w-full">
      <div className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-white drop-shadow-lg">
          Liquid Metal
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/60">
          Mercury blobs that merge, split, and reform into liquid metal.
        </p>
        <button className="mt-8 rounded-full bg-white/10 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
          Explore
        </button>
      </div>
    </MetallicLava>
  )
}`

const manualSource = `# Install dependencies
npm install clsx tailwind-merge

# Add the cn utility to lib/utils.ts (skip if already set up)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# Create components/ui/metallic-lava.tsx

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MetallicLavaProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string
  highlightColor?: string
  speed?: number
  blobCount?: number
}

const MetallicLava = React.forwardRef<HTMLDivElement, MetallicLavaProps>(
  ({ color = "#8a9bae", highlightColor = "#c5d0dc", speed = 1, blobCount = 24, className, children, ...props }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => containerRef.current!)

    React.useEffect(() => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      let w = 0, h = 0, rafId = 0

      interface Blob { x: number; y: number; r: number; vx: number; vy: number; phase: number; freq: number; ampX: number; ampY: number; pulsePhase: number; pulseSpeed: number }
      let blobs: Blob[] = []

      function initBlobs() {
        blobs = Array.from({ length: blobCount }, () => {
          const baseSpeed = 0.15 + Math.random() * 0.4
          const angle = Math.random() * Math.PI * 2
          return { x: Math.random() * w, y: Math.random() * h, r: 30 + Math.random() * 80, vx: Math.cos(angle) * baseSpeed, vy: Math.sin(angle) * baseSpeed, phase: Math.random() * Math.PI * 2, freq: 0.2 + Math.random() * 0.4, ampX: 20 + Math.random() * 60, ampY: 20 + Math.random() * 60, pulsePhase: Math.random() * Math.PI * 2, pulseSpeed: 0.15 + Math.random() * 0.35 }
        })
      }

      function resize() {
        const rect = container!.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio, 2)
        w = rect.width; h = rect.height
        canvas!.width = w * dpr; canvas!.height = h * dpr
        canvas!.style.width = w + "px"; canvas!.style.height = h + "px"
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        if (blobs.length === 0) initBlobs()
      }

      function animate(time: number) {
        const t = time * 0.001 * speed
        ctx!.globalCompositeOperation = "source-over"
        ctx!.fillStyle = "#0a0a0f"
        ctx!.fillRect(0, 0, w, h)
        ctx!.globalCompositeOperation = "lighter"

        for (const b of blobs) {
          b.x += b.vx * speed; b.y += b.vy * speed
          const wobbleX = Math.sin(t * b.freq + b.phase) * b.ampX + Math.sin(t * b.freq * 0.37 + b.phase * 2.1) * b.ampX * 0.3
          const wobbleY = Math.cos(t * b.freq * 0.8 + b.phase) * b.ampY + Math.cos(t * b.freq * 0.29 + b.phase * 1.7) * b.ampY * 0.25
          const pulse = 1 + Math.sin(t * b.pulseSpeed + b.pulsePhase) * 0.15
          const r = b.r * pulse, drawX = b.x + wobbleX, drawY = b.y + wobbleY
          const pad = b.r * 2.5
          if (b.x > w + pad) b.x = -pad; if (b.x < -pad) b.x = w + pad
          if (b.y > h + pad) b.y = -pad; if (b.y < -pad) b.y = h + pad
          const grad = ctx!.createRadialGradient(drawX, drawY, 0, drawX, drawY, r)
          grad.addColorStop(0, "rgba(255,255,255,0.92)")
          grad.addColorStop(0.2, "rgba(235,240,248,0.65)")
          grad.addColorStop(0.45, "rgba(200,212,228,0.30)")
          grad.addColorStop(0.7, "rgba(160,175,195,0.08)")
          grad.addColorStop(1, "rgba(0,0,0,0)")
          ctx!.fillStyle = grad; ctx!.beginPath(); ctx!.arc(drawX, drawY, r, 0, Math.PI * 2); ctx!.fill()
        }
        rafId = requestAnimationFrame(animate)
      }

      resize(); rafId = requestAnimationFrame(animate)
      const ro = new ResizeObserver(resize); ro.observe(container)
      return () => { cancelAnimationFrame(rafId); ro.disconnect() }
    }, [blobCount, speed])

    return (
      <div ref={containerRef} className={cn("relative overflow-hidden", className)} style={{ background: "#0a0a0f" }} {...props}>
        <div className="absolute" style={{ inset: -60, filter: "blur(12px) contrast(18)" }}>
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
        <div className="absolute inset-0" style={{ background: \\\`linear-gradient(135deg, \\\${color}, \\\${highlightColor}, \\\${color}, #6b7a8a, \\\${highlightColor})\\\`, backgroundSize: "400% 400%", animation: "metallic-lava-gradient 20s ease-in-out infinite", mixBlendMode: "multiply" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.5) 0%, transparent 40%), radial-gradient(ellipse at 75% 50%, rgba(255,255,255,0.3) 0%, transparent 35%)", opacity: 0.25, mixBlendMode: "screen" }} />
        {children && <div className="relative z-10">{children}</div>}
        <style>{\\\`
          @keyframes metallic-lava-gradient { 0% { background-position: 0% 0%; } 25% { background-position: 100% 30%; } 50% { background-position: 60% 100%; } 75% { background-position: 0% 60%; } 100% { background-position: 0% 0%; } }
        \\\`}</style>
      </div>
    )
  }
)
MetallicLava.displayName = "MetallicLava"
export { MetallicLava }
export type { MetallicLavaProps }`

const metallicLavaProps = [
  {
    name: "color",
    type: "string",
    default: '"#8a9bae"',
    description: "Base metallic color for the lava surface.",
  },
  {
    name: "highlightColor",
    type: "string",
    default: '"#c5d0dc"',
    description: "Specular highlight color for the metallic sheen.",
  },
  {
    name: "speed",
    type: "number",
    default: "1",
    description: "Animation speed multiplier. Values < 1 slow down, > 1 speed up.",
  },
  {
    name: "blobCount",
    type: "number",
    default: "28",
    description: "Number of metaball blobs in the simulation.",
  },
  {
    name: "mode",
    type: '"dark" | "light"',
    default: '"dark"',
    description: "Visual mode - dark renders light blobs on dark, light inverts.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "\u2014",
    description: "Content rendered on top of the background.",
  },
]

function MetallicLavaDemo() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <MetallicLava
      className="relative min-h-[600px] w-full rounded-2xl"
      mode={isDark ? "dark" : "light"}
      color={isDark ? "#8a9bae" : "#7a8fa5"}
      highlightColor={isDark ? "#c5d0dc" : "#94a8b8"}
    >
      <div className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
        <p className={`text-xs font-medium uppercase tracking-[0.3em] ${isDark ? "text-white/40" : "text-black/30"}`}>
          Forged in liquid metal
        </p>
        <h2
          className={`mt-3 text-5xl font-bold tracking-tight drop-shadow-lg sm:text-6xl ${isDark ? "text-white" : "text-black/80"}`}
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Metallic Lava
        </h2>
        <p className={`mt-4 max-w-md text-base ${isDark ? "text-white/50" : "text-black/40"}`}>
          Mercury blobs that merge, split, and reform - a living metallic surface.
        </p>
        <div className="mt-8 flex gap-3">
          <button className={`rounded-full px-7 py-2.5 text-sm font-medium backdrop-blur-sm border transition-all ${
            isDark
              ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30"
              : "bg-black/10 text-black/70 border-black/15 hover:bg-black/15 hover:border-black/25"
          }`}>
            Get started
          </button>
          <button className={`rounded-full px-7 py-2.5 text-sm font-medium transition-colors ${
            isDark ? "text-white/60 hover:text-white" : "text-black/40 hover:text-black/70"
          }`}>
            Learn more
          </button>
        </div>
      </div>
    </MetallicLava>
  )
}

export default function MetallicLavaPage() {
  return (
    <ComponentPage
      name="Metallic Lava"
      description="A canvas-driven mercury simulation with metaball merging, specular highlights, and organic liquid motion."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/metallic-lava.json"
      manualSource={manualSource}
      props={metallicLavaProps}
    >
      <MetallicLavaDemo />
    </ComponentPage>
  )
}
