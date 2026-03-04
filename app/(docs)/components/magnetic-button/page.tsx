"use client"

import * as React from "react"
import { MagneticButton } from "@/registry/wise-ui/components/magnetic-button"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { MagneticButton } from "@/components/ui/magnetic-button"

export default function MagneticButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-8">
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Default</p>
        <MagneticButton>Hover nearby</MagneticButton>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Strong pull</p>
        <MagneticButton strength={20} range={200}>
          Come closer
        </MagneticButton>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Subtle</p>
        <MagneticButton strength={6} range={100}>
          Gentle magnet
        </MagneticButton>
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

# Create components/ui/magnetic-button.tsx

"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number
  range?: number
  children: React.ReactNode
}

const springConfig = { stiffness: 200, damping: 15, mass: 0.5 }

const MagneticButton = React.forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(
  (
    {
      strength = 12,
      range = 150,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)

    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const x = useSpring(rawX, springConfig)
    const y = useSpring(rawY, springConfig)

    React.useEffect(() => {
      const el = containerRef.current
      if (!el || disabled) return

      function handleMouseMove(e: MouseEvent) {
        const rect = el!.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distX = e.clientX - centerX
        const distY = e.clientY - centerY
        const dist = Math.sqrt(distX * distX + distY * distY)

        if (dist < range) {
          const pull = 1 - dist / range
          rawX.set(distX * pull * (strength / range) * 2)
          rawY.set(distY * pull * (strength / range) * 2)
        } else {
          rawX.set(0)
          rawY.set(0)
        }
      }

      function handleMouseLeave() {
        rawX.set(0)
        rawY.set(0)
      }

      window.addEventListener("mousemove", handleMouseMove)
      el.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        el.removeEventListener("mouseleave", handleMouseLeave)
      }
    }, [disabled, range, strength, rawX, rawY])

    return (
      <motion.div
        ref={containerRef}
        className="inline-flex"
        style={{ x, y }}
      >
        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            "relative inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </motion.div>
    )
  }
)
MagneticButton.displayName = "MagneticButton"

export { MagneticButton }
export type { MagneticButtonProps }`

const magneticButtonProps = [
  {
    name: "strength",
    type: "number",
    default: "12",
    description: "Maximum distance (px) the button can travel toward the cursor.",
  },
  {
    name: "range",
    type: "number",
    default: "150",
    description: "Radius (px) around the button that activates the magnetic pull.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "-",
    description: "Button label content.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional classes for the button element.",
  },
]

function MagneticButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-8">
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Default</p>
        <MagneticButton>Hover nearby</MagneticButton>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Strong pull</p>
        <MagneticButton strength={20} range={200}>
          Come closer
        </MagneticButton>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Subtle</p>
        <MagneticButton strength={6} range={100}>
          Gentle magnet
        </MagneticButton>
      </div>
    </div>
  )
}

export default function MagneticButtonPage() {
  return (
    <ComponentPage
      name="Magnetic Button"
      description="Button that gravitates toward your cursor with a spring-physics magnetic pull."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/magnetic-button.json"
      manualSource={manualSource}
      props={magneticButtonProps}
    >
      <MagneticButtonDemo />
    </ComponentPage>
  )
}
