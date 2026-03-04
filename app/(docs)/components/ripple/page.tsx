"use client"

import * as React from "react"
import { Ripple } from "@/registry/wise-ui/components/ripple"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { Ripple } from "@/components/ui/ripple"

export default function RippleDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12">
      {/* Click ripple button */}
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Click ripple</p>
        <Ripple className="inline-flex rounded-lg">
          <button className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Click Me
          </button>
        </Ripple>
      </div>

      {/* Pulse status dot */}
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Pulse mode</p>
        <div className="flex items-center justify-center">
          <Ripple
            mode="pulse"
            color="hsl(142, 71%, 45%)"
            duration={1500}
            className="inline-flex h-12 w-12 items-center justify-center"
          >
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </Ripple>
        </div>
      </div>

      {/* Custom color click ripple */}
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Custom color</p>
        <Ripple
          color="hsl(270, 80%, 60%)"
          ringCount={4}
          className="inline-flex rounded-xl border border-border bg-card p-8"
        >
          <span className="text-sm text-muted-foreground">Click anywhere in this card</span>
        </Ripple>
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

# Create components/ui/ripple.tsx

"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

interface RippleProps {
  color?: string
  duration?: number
  ringCount?: number
  mode?: "click" | "pulse"
  children: React.ReactNode
  className?: string
}

interface RippleEntry {
  x: number
  y: number
  id: number
}

let nextId = 0

function Ripple({
  color = "currentColor",
  duration = 600,
  ringCount = 3,
  mode = "click",
  children,
  className,
}: RippleProps) {
  const [ripples, setRipples] = React.useState<RippleEntry[]>([])
  const containerRef = React.useRef<HTMLDivElement>(null)

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (mode !== "click") return
    const rect = containerRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipples((prev) => [...prev, { x, y, id: nextId++ }])
  }

  function removeRipple(id: number) {
    setRipples((prev) => prev.filter((r) => r.id !== id))
  }

  const durationS = duration / 1000

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
    >
      {children}

      <AnimatePresence>
        {ripples.map((ripple) => (
          <div key={ripple.id} className="pointer-events-none absolute inset-0">
            {Array.from({ length: ringCount }, (_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 20,
                  height: 20,
                  x: "-50%",
                  y: "-50%",
                  border: \`1.5px solid \${color}\`,
                }}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: durationS,
                  delay: i * (durationS * 0.2),
                  ease: "easeOut",
                }}
                onAnimationComplete={() => {
                  if (i === ringCount - 1) removeRipple(ripple.id)
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>

      {mode === "pulse" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: ringCount }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 20,
                height: 20,
                border: \`1.5px solid \${color}\`,
              }}
              animate={{ scale: [0, 2.5], opacity: [0.6, 0] }}
              transition={{
                duration: durationS,
                delay: i * (durationS / ringCount),
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
Ripple.displayName = "Ripple"

export { Ripple }
export type { RippleProps }`

const rippleProps = [
  {
    name: "color",
    type: "string",
    default: '"currentColor"',
    description: "Color of the ripple rings.",
  },
  {
    name: "duration",
    type: "number",
    default: "600",
    description: "Duration of the ripple animation in milliseconds.",
  },
  {
    name: "ringCount",
    type: "number",
    default: "3",
    description: "Number of concentric rings per ripple.",
  },
  {
    name: "mode",
    type: '"click" | "pulse"',
    default: '"click"',
    description: "Click spawns ripples at cursor; pulse continuously emits from center.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "-",
    description: "Content to wrap.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional classes for the container.",
  },
]

function RippleDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12">
      {/* Click ripple button */}
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Click ripple</p>
        <Ripple className="inline-flex rounded-lg">
          <button className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Click Me
          </button>
        </Ripple>
      </div>

      {/* Pulse status dot */}
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Pulse mode</p>
        <div className="flex items-center justify-center">
          <Ripple
            mode="pulse"
            color="hsl(142, 71%, 45%)"
            duration={1500}
            className="inline-flex h-12 w-12 items-center justify-center"
          >
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </Ripple>
        </div>
      </div>

      {/* Custom color click ripple */}
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">Custom color</p>
        <Ripple
          color="hsl(270, 80%, 60%)"
          ringCount={4}
          className="inline-flex rounded-xl border border-border bg-card p-8"
        >
          <span className="text-sm text-muted-foreground">Click anywhere in this card</span>
        </Ripple>
      </div>
    </div>
  )
}

export default function RipplePage() {
  return (
    <ComponentPage
      name="Ripple"
      description="Expanding concentric ring outlines from click point or continuous pulse."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/ripple.json"
      manualSource={manualSource}
      props={rippleProps}
    >
      <RippleDemo />
    </ComponentPage>
  )
}
