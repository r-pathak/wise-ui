"use client"

import * as React from "react"
import { BorderBeam } from "@/registry/wise-ui/components/border-beam"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { BorderBeam } from "@/components/ui/border-beam"

export default function BorderBeamDemo() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      {/* Single beam */}
      <div className="relative w-72 rounded-xl border border-border bg-card p-6">
        <BorderBeam />
        <h3 className="text-lg font-semibold text-foreground">Single Beam</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A light particle orbiting the card edge.
        </p>
      </div>

      {/* Dual beams */}
      <div className="relative w-72 rounded-xl border border-border bg-card p-6">
        <BorderBeam color="hsl(220, 90%, 60%)" duration={4} />
        <BorderBeam color="hsl(280, 80%, 65%)" duration={4} delay={2} />
        <h3 className="text-lg font-semibold text-foreground">Dual Beams</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Blue and purple beams with a 2s offset.
        </p>
      </div>

      {/* Small badge */}
      <div className="relative inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5">
        <BorderBeam color="hsl(150, 80%, 50%)" duration={2} />
        <span className="text-sm font-medium text-foreground">New Feature</span>
      </div>
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

# Create components/ui/border-beam.tsx

"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface BorderBeamProps {
  size?: number
  duration?: number
  delay?: number
  color?: string
  className?: string
}

function BorderBeam({
  size = 80,
  duration = 6,
  delay = 0,
  color = "hsl(var(--primary))",
  className,
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: \`conic-gradient(from 0deg, transparent 0%, transparent 70%, \${color} 85%, transparent 100%)\`,
          width: "200%",
          height: "200%",
          left: "-50%",
          top: "-50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="absolute inset-[1.5px] rounded-[inherit] bg-background" />
    </div>
  )
}
BorderBeam.displayName = "BorderBeam"

export { BorderBeam }
export type { BorderBeamProps }`

const borderBeamProps = [
  {
    name: "size",
    type: "number",
    default: "80",
    description: "Beam arc length in pixels (visual reference).",
  },
  {
    name: "duration",
    type: "number",
    default: "6",
    description: "Seconds for one full orbit.",
  },
  {
    name: "delay",
    type: "number",
    default: "0",
    description: "Delay offset in seconds (useful for stacking multiple beams).",
  },
  {
    name: "color",
    type: "string",
    default: "hsl(var(--primary))",
    description: "Beam color.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional classes for the beam container.",
  },
]

function BorderBeamDemo() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      {/* Single beam */}
      <div className="relative w-72 rounded-xl border border-border bg-card p-6">
        <BorderBeam />
        <h3 className="text-lg font-semibold text-foreground">Single Beam</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A light particle orbiting the card edge.
        </p>
      </div>

      {/* Dual beams */}
      <div className="relative w-72 rounded-xl border border-border bg-card p-6">
        <BorderBeam color="hsl(220, 90%, 60%)" duration={4} />
        <BorderBeam color="hsl(280, 80%, 65%)" duration={4} delay={2} />
        <h3 className="text-lg font-semibold text-foreground">Dual Beams</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Blue and purple beams with a 2s offset.
        </p>
      </div>

      {/* Small badge */}
      <div className="relative inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5">
        <BorderBeam color="hsl(150, 80%, 50%)" duration={2} />
        <span className="text-sm font-medium text-foreground">New Feature</span>
      </div>
    </div>
  )
}

export default function BorderBeamPage() {
  return (
    <ComponentPage
      name="Border Beam"
      description="Animated beam of light continuously tracing along an element's border."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/border-beam.json"
      manualSource={manualSource}
      props={borderBeamProps}
    >
      <BorderBeamDemo />
    </ComponentPage>
  )
}
