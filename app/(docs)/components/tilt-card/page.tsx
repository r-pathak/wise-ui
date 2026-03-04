"use client"

import * as React from "react"
import { TiltCard } from "@/registry/wise-ui/components/tilt-card"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { TiltCard } from "@/components/ui/tilt-card"

export default function TiltCardDemo() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      <TiltCard className="w-72 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">Product Card</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Hover to see the 3D tilt and holographic glare effect in action.
        </p>
        <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5" />
      </TiltCard>

      <TiltCard
        tiltMax={25}
        className="w-72 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground">High Tilt (25°)</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          More dramatic perspective rotation for immersive feel.
        </p>
        <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10" />
      </TiltCard>

      <TiltCard
        glare={false}
        className="w-72 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground">No Glare</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Tilt effect without the holographic glare overlay.
        </p>
        <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10" />
      </TiltCard>
    </div>
  )
}`

const manualSource = `# Install dependencies
npm install motion clsx tailwind-merge

# Add the cn utility to lib/utils.ts (skip if already set up)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# Create components/ui/tilt-card.tsx

"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import { cn } from "@/lib/utils"

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
      \`radial-gradient(circle at \${x}% \${y}%, rgba(255,255,255,\${glareOpacity}), transparent 60%)\`
  )

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const offsetX = (e.clientX - centerX) / (rect.width / 2)
    const offsetY = (e.clientY - centerY) / (rect.height / 2)

    rawX.set(-offsetY * tiltMax)
    rawY.set(offsetX * tiltMax)

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
export type { TiltCardProps }`

const tiltCardProps = [
  {
    name: "tiltMax",
    type: "number",
    default: "15",
    description: "Maximum tilt angle in degrees.",
  },
  {
    name: "glare",
    type: "boolean",
    default: "true",
    description: "Show a glare overlay that follows the mouse.",
  },
  {
    name: "glareOpacity",
    type: "number",
    default: "0.15",
    description: "Peak opacity of the glare effect.",
  },
  {
    name: "scale",
    type: "number",
    default: "1.02",
    description: "Scale factor on hover.",
  },
  {
    name: "perspective",
    type: "number",
    default: "1000",
    description: "CSS perspective value in pixels.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "-",
    description: "Card content.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional classes for the card container.",
  },
]

function TiltCardDemo() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      <TiltCard className="w-72 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">Product Card</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Hover to see the 3D tilt and holographic glare effect in action.
        </p>
        <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5" />
      </TiltCard>

      <TiltCard
        tiltMax={25}
        className="w-72 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground">High Tilt (25&deg;)</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          More dramatic perspective rotation for immersive feel.
        </p>
        <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/10" />
      </TiltCard>

      <TiltCard
        glare={false}
        className="w-72 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground">No Glare</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Tilt effect without the holographic glare overlay.
        </p>
        <div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/10" />
      </TiltCard>
    </div>
  )
}

export default function TiltCardPage() {
  return (
    <ComponentPage
      name="Tilt Card"
      description="3D perspective card with mouse-tracking tilt and holographic glare."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/tilt-card.json"
      manualSource={manualSource}
      props={tiltCardProps}
    >
      <TiltCardDemo />
    </ComponentPage>
  )
}
