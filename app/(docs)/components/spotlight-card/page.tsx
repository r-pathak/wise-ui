"use client"

import * as React from "react"
import { IconBolt, IconPalette, IconCode } from "@tabler/icons-react"
import { SpotlightCard } from "@/registry/wise-ui/components/spotlight-card"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { IconBolt, IconPalette, IconCode } from "@tabler/icons-react"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const features = [
  {
    icon: IconBolt,
    title: "Lightning Fast",
    description: "Built for performance with zero-config optimizations baked in.",
    color: undefined,
  },
  {
    icon: IconPalette,
    title: "Beautiful Design",
    description: "Pixel-perfect components that look great out of the box.",
    color: "rgba(168,85,247,0.12)",
  },
  {
    icon: IconCode,
    title: "Developer First",
    description: "Clean APIs and full TypeScript support for a great DX.",
    color: "rgba(34,211,238,0.12)",
  },
]

export default function SpotlightCardDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {features.map((f) => (
        <SpotlightCard
          key={f.title}
          spotlightColor={f.color}
          className="p-6"
        >
          <f.icon size={28} className="text-primary" />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            {f.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
        </SpotlightCard>
      ))}
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

# Create components/ui/spotlight-card.tsx

"use client"

import * as React from "react"
import { motion, useMotionValue, useMotionTemplate } from "motion/react"
import { cn } from "@/lib/utils"

interface SpotlightCardProps {
  spotlightColor?: string
  spotlightSize?: number
  children: React.ReactNode
  className?: string
}

function SpotlightCard({
  spotlightColor = "rgba(255,255,255,0.08)",
  spotlightSize = 200,
  children,
  className,
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isHovered, setIsHovered] = React.useState(false)

  const background = useMotionTemplate\`radial-gradient(\${spotlightSize}px circle at \${mouseX}px \${mouseY}px, \${spotlightColor}, transparent 80%)\`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{ background, opacity: isHovered ? 1 : 0 }}
      />
      <div className="relative z-20">{children}</div>
    </div>
  )
}
SpotlightCard.displayName = "SpotlightCard"

export { SpotlightCard }
export type { SpotlightCardProps }`

const spotlightCardProps = [
  {
    name: "spotlightColor",
    type: "string",
    default: '"rgba(255,255,255,0.08)"',
    description: "Color of the radial gradient spotlight.",
  },
  {
    name: "spotlightSize",
    type: "number",
    default: "200",
    description: "Diameter of the spotlight in pixels.",
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

const features = [
  {
    icon: IconBolt,
    title: "Lightning Fast",
    description: "Built for performance with zero-config optimizations baked in.",
    color: undefined,
  },
  {
    icon: IconPalette,
    title: "Beautiful Design",
    description: "Pixel-perfect components that look great out of the box.",
    color: "rgba(168,85,247,0.12)",
  },
  {
    icon: IconCode,
    title: "Developer First",
    description: "Clean APIs and full TypeScript support for a great DX.",
    color: "rgba(34,211,238,0.12)",
  },
]

function SpotlightCardDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {features.map((f) => (
        <SpotlightCard
          key={f.title}
          spotlightColor={f.color}
          className="p-6"
        >
          <f.icon size={28} className="text-primary" />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            {f.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
        </SpotlightCard>
      ))}
    </div>
  )
}

export default function SpotlightCardPage() {
  return (
    <ComponentPage
      name="Spotlight Card"
      description="A card with a radial gradient glow that follows the mouse cursor."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/spotlight-card.json"
      manualSource={manualSource}
      props={spotlightCardProps}
    >
      <SpotlightCardDemo />
    </ComponentPage>
  )
}
