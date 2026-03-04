"use client"

import * as React from "react"
import { PulseButton } from "@/registry/wise-ui/components/pulse-button"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { PulseButton } from "@/components/ui/pulse-button"

export default function PulseButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-8">
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Default</p>
        <PulseButton>Get Started</PulseButton>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Red urgent</p>
        <PulseButton pulseColor="#ef4444" duration={1.5} className="bg-red-500 hover:bg-red-600">
          Buy Now
        </PulseButton>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Slow pulse</p>
        <PulseButton pulseColor="#a855f7" duration={3} className="bg-purple-600 hover:bg-purple-700">
          Explore
        </PulseButton>
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

# Create components/ui/pulse-button.tsx

"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface PulseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string
  duration?: number
  children: React.ReactNode
}

const PulseButton = React.forwardRef<HTMLButtonElement, PulseButtonProps>(
  (
    {
      pulseColor = "hsl(var(--primary))",
      duration = 2,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative inline-flex">
        {!disabled && (
          <>
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                border: \`2px solid \${pulseColor}\`,
                borderRadius: "inherit",
              }}
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                border: \`2px solid \${pulseColor}\`,
                borderRadius: "inherit",
              }}
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{
                duration,
                delay: duration / 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </>
        )}

        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            "relative inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </div>
    )
  }
)
PulseButton.displayName = "PulseButton"

export { PulseButton }
export type { PulseButtonProps }`

const pulseButtonProps = [
  {
    name: "pulseColor",
    type: "string",
    default: "hsl(var(--primary))",
    description: "Color of the pulsing ring.",
  },
  {
    name: "duration",
    type: "number",
    default: "2",
    description: "Seconds per pulse cycle.",
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

function PulseButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-8">
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Default</p>
        <PulseButton>Get Started</PulseButton>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Red urgent</p>
        <PulseButton pulseColor="#ef4444" duration={1.5} className="bg-red-500 hover:bg-red-600">
          Buy Now
        </PulseButton>
      </div>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">Slow pulse</p>
        <PulseButton pulseColor="#a855f7" duration={3} className="bg-purple-600 hover:bg-purple-700">
          Explore
        </PulseButton>
      </div>
    </div>
  )
}

export default function PulseButtonPage() {
  return (
    <ComponentPage
      name="Pulse Button"
      description="CTA button with animated pulsing rings radiating outward to draw attention."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/pulse-button.json"
      manualSource={manualSource}
      props={pulseButtonProps}
    >
      <PulseButtonDemo />
    </ComponentPage>
  )
}
