"use client"

import * as React from "react"
import { cn } from "@/registry/wise-ui/lib/utils"

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
      {display || "\u00A0"}
    </span>
  )
}
ScrambleText.displayName = "ScrambleText"

export { ScrambleText }
export type { ScrambleTextProps }
