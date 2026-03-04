"use client"

import * as React from "react"
import { Nebula } from "@/registry/wise-ui/components/nebula"
import { useTheme } from "../../_components/theme-provider"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { Nebula } from "@/components/ui/nebula"

export default function Hero() {
  return (
    <Nebula className="h-screen w-full">
      <div className="flex h-screen flex-col items-center justify-center px-6 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-purple-300/60">
          Deep Space
        </span>
        <h1 className="mt-3 text-6xl font-bold tracking-tight text-white">
          Into the Nebula
        </h1>
        <p className="mt-4 max-w-lg text-lg text-white/50">
          Cosmic clouds of gas and dust, illuminated by newborn stars.
        </p>
        <div className="mt-10 flex gap-4">
          <button className="rounded-full bg-white/10 px-8 py-3 text-sm font-medium text-white backdrop-blur border border-white/15 hover:bg-white/20 transition-all">
            Launch app
          </button>
          <button className="rounded-full px-8 py-3 text-sm font-medium text-white/50 hover:text-white transition-colors">
            Documentation
          </button>
        </div>
      </div>
    </Nebula>
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

# Create components/ui/nebula.tsx

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface NebulaProps extends React.HTMLAttributes<HTMLDivElement> {
  colorA?: string
  colorB?: string
  colorC?: string
  grain?: boolean
  speed?: number
  blobCount?: number
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return \`rgba(\${r},\${g},\${b},\${alpha})\`
}

const Nebula = React.forwardRef<HTMLDivElement, NebulaProps>(
  ({ colorA = "#6b1d9e", colorB = "#0d3b7a", colorC = "#c2185b", grain = true, speed = 1, blobCount = 18, className, children, ...props }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const uniqueId = React.useId()
    const filterId = \`nebula-grain-\${uniqueId}\`
    React.useImperativeHandle(ref, () => containerRef.current!)

    React.useEffect(() => {
      const canvas = canvasRef.current, container = containerRef.current
      if (!canvas || !container) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      let w = 0, h = 0, rafId = 0
      const colors = [colorA, colorB, colorC]

      interface Blob { x: number; y: number; r: number; color: string; phaseX: number; phaseY: number; freqX: number; freqY: number; ampX: number; ampY: number; rotPhase: number; rotSpeed: number }
      let blobs: Blob[] = []

      function initBlobs() {
        blobs = Array.from({ length: blobCount }, (_, i) => ({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.max(w, h) * (0.15 + Math.random() * 0.25),
          color: colors[i % colors.length],
          phaseX: Math.random() * Math.PI * 2, phaseY: Math.random() * Math.PI * 2,
          freqX: 0.15 + Math.random() * 0.35, freqY: 0.12 + Math.random() * 0.3,
          ampX: w * (0.1 + Math.random() * 0.2), ampY: h * (0.1 + Math.random() * 0.2),
          rotPhase: Math.random() * Math.PI * 2, rotSpeed: 0.05 + Math.random() * 0.15,
        }))
      }

      function resize() {
        const rect = container!.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio, 2)
        w = rect.width; h = rect.height
        canvas!.width = w * dpr; canvas!.height = h * dpr
        canvas!.style.width = w + "px"; canvas!.style.height = h + "px"
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
        initBlobs()
      }

      function animate(time: number) {
        const t = time * 0.001 * speed
        ctx!.globalCompositeOperation = "source-over"
        ctx!.fillStyle = "#080012"; ctx!.fillRect(0, 0, w, h)
        ctx!.globalCompositeOperation = "screen"
        for (const b of blobs) {
          const dx = Math.sin(t * b.freqX + b.phaseX) * b.ampX + Math.sin(t * b.freqX * 0.4 + b.phaseX * 2.1) * b.ampX * 0.4
          const dy = Math.cos(t * b.freqY + b.phaseY) * b.ampY + Math.cos(t * b.freqY * 0.3 + b.phaseY * 1.7) * b.ampY * 0.3
          const pulse = 1 + Math.sin(t * b.rotSpeed + b.rotPhase) * 0.15
          const r = b.r * pulse
          const grad = ctx!.createRadialGradient(b.x + dx, b.y + dy, 0, b.x + dx, b.y + dy, r)
          grad.addColorStop(0, hexToRgba(b.color, 0.7))
          grad.addColorStop(0.3, hexToRgba(b.color, 0.4))
          grad.addColorStop(0.6, hexToRgba(b.color, 0.12))
          grad.addColorStop(1, "rgba(0,0,0,0)")
          ctx!.fillStyle = grad; ctx!.beginPath(); ctx!.arc(b.x + dx, b.y + dy, r, 0, Math.PI * 2); ctx!.fill()
        }
        rafId = requestAnimationFrame(animate)
      }

      resize(); rafId = requestAnimationFrame(animate)
      const ro = new ResizeObserver(resize); ro.observe(container)
      return () => { cancelAnimationFrame(rafId); ro.disconnect() }
    }, [colorA, colorB, colorC, blobCount, speed])

    return (
      <div ref={containerRef} className={cn("relative overflow-hidden bg-[#080012]", className)} {...props}>
        {grain && (
          <svg className="absolute" width="0" height="0" aria-hidden="true">
            <defs>
              <filter id={filterId}>
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" result="grain" />
                <feColorMatrix type="saturate" values="0" in="grain" result="bwGrain" />
                <feComponentTransfer in="bwGrain" result="thresholded">
                  <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0.04 0.12" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>
        )}
        <div className="absolute inset-0" style={{ filter: "blur(30px)" }}>
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
        {grain && <div className="absolute inset-0 mix-blend-screen" style={{ filter: \`url(#\${filterId})\`, background: "white" }} />}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)" }} />
        {children && <div className="relative z-10">{children}</div>}
      </div>
    )
  }
)
Nebula.displayName = "Nebula"
export { Nebula }
export type { NebulaProps }`

const nebulaProps = [
  {
    name: "colorA",
    type: "string",
    default: '"#6b1d9e"',
    description: "Primary nebula cloud color.",
  },
  {
    name: "colorB",
    type: "string",
    default: '"#0d3b7a"',
    description: "Secondary nebula cloud color.",
  },
  {
    name: "colorC",
    type: "string",
    default: '"#c2185b"',
    description: "Tertiary accent color for highlights and wisps.",
  },
  {
    name: "grain",
    type: "boolean",
    default: "true",
    description: "Show a star-dust grain texture overlay.",
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
    default: "18",
    description: "Number of nebula cloud blobs.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "-",
    description: "Content rendered on top of the background.",
  },
]

function NebulaDemo() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Nebula
      className="relative min-h-[600px] w-full rounded-2xl"
      mode={isDark ? "dark" : "light"}
      colorA={isDark ? "#6b1d9e" : "#d8b4fe"}
      colorB={isDark ? "#0d3b7a" : "#93c5fd"}
      colorC={isDark ? "#c2185b" : "#f9a8d4"}
    >
      <div className="flex min-h-[600px] flex-col items-center justify-center px-6 text-center">
        <span className={`text-xs font-medium uppercase tracking-[0.3em] ${isDark ? "text-purple-300/50" : "text-purple-800/70"}`}>
          Deep Space
        </span>
        <h2
          className={`mt-3 text-5xl font-bold tracking-tight sm:text-6xl ${isDark ? "text-white" : "text-gray-900"}`}
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Into the Nebula
        </h2>
        <p className={`mt-4 max-w-lg text-base ${isDark ? "text-white/40" : "text-gray-700"}`}>
          Cosmic clouds of gas and dust drift through the void, illuminated by the light of newborn stars.
        </p>
        <div className="mt-10 flex gap-4">
          <button className={`rounded-full px-7 py-2.5 text-sm font-medium backdrop-blur-sm border transition-all ${
            isDark
              ? "bg-white/10 text-white border-white/15 hover:bg-white/20 hover:border-white/25"
              : "bg-black/10 text-gray-800 border-black/15 hover:bg-black/15 hover:border-black/20"
          }`}>
            Launch app
          </button>
          <button className={`rounded-full px-7 py-2.5 text-sm font-medium transition-colors ${
            isDark ? "text-white/40 hover:text-white/70" : "text-gray-600 hover:text-gray-900"
          }`}>
            Documentation
          </button>
        </div>
      </div>
    </Nebula>
  )
}

export default function NebulaPage() {
  return (
    <ComponentPage
      name="Nebula"
      description="A canvas-driven cosmic background with smooth flowing nebula clouds, emission highlights, and star-dust grain."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/nebula.json"
      manualSource={manualSource}
      props={nebulaProps}
    >
      <NebulaDemo />
    </ComponentPage>
  )
}
