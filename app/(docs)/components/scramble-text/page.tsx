"use client"

import * as React from "react"
import { ScrambleText } from "@/registry/wise-ui/components/scramble-text"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import * as React from "react"
import { ScrambleText } from "@/components/ui/scramble-text"

export default function ScrambleTextDemo() {
  const [key, setKey] = React.useState(0)
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Scrambles on mount (click to replay):</p>
        <div className="cursor-pointer" onClick={() => setKey((k) => k + 1)}>
          <ScrambleText
            key={key}
            text="ACCESS GRANTED"
            speed={40}
            className="text-4xl font-bold tracking-tight text-foreground"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Scrambles on hover:</p>
        <ScrambleText
          text="Hover over this text to decode it"
          trigger="hover"
          speed={30}
          className="text-xl font-medium text-foreground"
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Non-sequential (all at once):</p>
        <ScrambleText
          key={\`ns-\${key}\`}
          text="SIMULTANEOUS RESOLVE"
          sequential={false}
          speed={80}
          className="text-2xl font-mono font-bold text-foreground"
        />
      </div>
    </div>
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

# Create components/ui/scramble-text.tsx

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrambleTextProps {
  text: string
  trigger?: "mount" | "hover"
  speed?: number
  characterSet?: string
  sequential?: boolean
  className?: string
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*"

function ScrambleText({
  text,
  trigger = "mount",
  speed = 50,
  characterSet = DEFAULT_CHARS,
  sequential = true,
  className,
}: ScrambleTextProps) {
  const [display, setDisplay] = React.useState(trigger === "mount" ? "" : text)
  const rafRef = React.useRef<number>(0)
  const startTimeRef = React.useRef<number>(0)

  const scramble = React.useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    startTimeRef.current = 0

    const chars = text.split("")
    const totalDuration = sequential
      ? chars.length * speed + speed * 3
      : speed * 8

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current

      let result = ""
      let allResolved = true

      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === " ") {
          result += " "
          continue
        }

        const resolveAt = sequential ? i * speed + speed * 2 : speed * 4
        if (elapsed >= resolveAt) {
          result += chars[i]
        } else {
          allResolved = false
          result += characterSet[Math.floor(Math.random() * characterSet.length)]
        }
      }

      setDisplay(result)

      if (!allResolved && elapsed < totalDuration) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(text)
      }
    }

    rafRef.current = requestAnimationFrame(step)
  }, [text, speed, characterSet, sequential])

  React.useEffect(() => {
    if (trigger === "mount") {
      scramble()
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [trigger, scramble])

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      scramble()
    }
  }

  return (
    <span
      className={cn("inline-block whitespace-pre", className)}
      onMouseEnter={handleMouseEnter}
    >
      {display || "\\u00A0"}
    </span>
  )
}
ScrambleText.displayName = "ScrambleText"

export { ScrambleText }
export type { ScrambleTextProps }`

const scrambleProps = [
  {
    name: "text",
    type: "string",
    default: "-",
    description: "The target text to reveal.",
  },
  {
    name: "trigger",
    type: '"mount" | "hover"',
    default: '"mount"',
    description: "When to start the scramble animation.",
  },
  {
    name: "speed",
    type: "number",
    default: "50",
    description: "Milliseconds per character resolve step.",
  },
  {
    name: "characterSet",
    type: "string",
    default: "A-Z, a-z, 0-9, symbols",
    description: "Characters used for the random scramble effect.",
  },
  {
    name: "sequential",
    type: "boolean",
    default: "true",
    description: "Resolve characters left-to-right (true) or all at once (false).",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional classes for the text element.",
  },
]

function ScrambleTextDemo() {
  const [key, setKey] = React.useState(0)
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Scrambles on mount (click to replay):</p>
        <div
          className="cursor-pointer"
          onClick={() => setKey((k) => k + 1)}
        >
          <ScrambleText
            key={key}
            text="ACCESS GRANTED"
            speed={40}
            className="text-4xl font-bold tracking-tight text-foreground"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Scrambles on hover:</p>
        <ScrambleText
          text="Hover over this text to decode it"
          trigger="hover"
          speed={30}
          className="text-xl font-medium text-foreground"
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Non-sequential (all at once):</p>
        <ScrambleText
          key={`ns-${key}`}
          text="SIMULTANEOUS RESOLVE"
          sequential={false}
          speed={80}
          className="text-2xl font-mono font-bold text-foreground"
        />
      </div>
    </div>
  )
}

export default function ScrambleTextPage() {
  return (
    <ComponentPage
      name="Scramble Text"
      description="Text that decrypts character by character with randomized intermediate characters."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/scramble-text.json"
      manualSource={manualSource}
      props={scrambleProps}
    >
      <ScrambleTextDemo />
    </ComponentPage>
  )
}
