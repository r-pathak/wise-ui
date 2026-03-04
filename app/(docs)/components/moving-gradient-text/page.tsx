"use client"

import * as React from "react"
import { MovingGradientText } from "@/registry/wise-ui/components/moving-gradient-text"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { MovingGradientText } from "@/components/ui/moving-gradient-text"

export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold">
        Build with <MovingGradientText>wise-ui</MovingGradientText>
      </h1>

      <MovingGradientText
        gradientFrom="#f97316"
        gradientTo="#ef4444"
        className="text-2xl font-semibold"
      >
        Custom colors
      </MovingGradientText>

      <p className="text-lg">
        Inline gradient{" "}
        <MovingGradientText speed={2} className="font-semibold">
          with faster speed
        </MovingGradientText>{" "}
        in a paragraph.
      </p>
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

# Create components/ui/moving-gradient-text.tsx

"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface MovingGradientTextProps {
  gradientFrom?: string
  gradientTo?: string
  speed?: number
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

const MovingGradientText = React.forwardRef<
  HTMLSpanElement,
  MovingGradientTextProps
>(
  (
    {
      gradientFrom = "#00a896",
      gradientTo = "#c084fc",
      speed = 1,
      children,
      className,
      style,
    },
    ref
  ) => {
    const rotation = useMotionValue(0)
    const controlRef = React.useRef<ReturnType<typeof animate> | null>(null)

    React.useEffect(() => {
      controlRef.current = animate(
        rotation,
        rotation.get() + 360 * 10000,
        { duration: (3 / speed) * 10000, ease: "linear" }
      )
      return () => {
        controlRef.current?.stop()
      }
    }, [speed, rotation])

    const backgroundPosition = useTransform(
      rotation,
      (v) => \`\${-(v * 100) / 360}% 0%\`
    )

    return (
      <motion.span
        ref={ref}
        className={cn("inline-block", className)}
        style={{
          backgroundImage: \`linear-gradient(90deg, \${gradientFrom}, \${gradientTo}, \${gradientFrom})\`,
          backgroundSize: "200% 100%",
          backgroundRepeat: "repeat",
          backgroundPosition,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          ...style,
        }}
      >
        {children}
      </motion.span>
    )
  }
)
MovingGradientText.displayName = "MovingGradientText"

export { MovingGradientText }
export type { MovingGradientTextProps }
`

const movingGradientTextProps = [
  {
    name: "gradientFrom",
    type: "string",
    default: '"#00a896"',
    description: "Starting color of the gradient.",
  },
  {
    name: "gradientTo",
    type: "string",
    default: '"#c084fc"',
    description: "Ending color of the gradient.",
  },
  {
    name: "speed",
    type: "number",
    default: "1",
    description: "Animation speed multiplier. Higher values = faster movement.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional CSS classes for font size, weight, etc.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "-",
    description: "The text content to apply the gradient to.",
  },
]

function MovingGradientTextDemo() {
  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <h2
        className="text-4xl font-bold text-foreground sm:text-5xl"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Build with{" "}
        <MovingGradientText>wise-ui</MovingGradientText>
      </h2>

      <h3 className="text-3xl font-bold">
        <MovingGradientText
          gradientFrom="#f97316"
          gradientTo="#ec4899"
        >
          Warm gradient text
        </MovingGradientText>
      </h3>

      <h3 className="text-3xl font-bold">
        <MovingGradientText
          gradientFrom="#3b82f6"
          gradientTo="#a855f7"
        >
          Cool gradient text
        </MovingGradientText>
      </h3>

      <p className="max-w-md text-center text-lg text-muted-foreground">
        You can use it{" "}
        <MovingGradientText
          speed={2}
          className="font-semibold"
        >
          inline within paragraphs
        </MovingGradientText>{" "}
        to highlight key phrases.
      </p>
    </div>
  )
}

export default function MovingGradientTextPage() {
  return (
    <ComponentPage
      name="Moving Gradient Text"
      description="Text with a continuously flowing gradient animation. Configurable colors and speed."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/moving-gradient-text.json"
      manualSource={manualSource}
      props={movingGradientTextProps}
    >
      <MovingGradientTextDemo />
    </ComponentPage>
  )
}
