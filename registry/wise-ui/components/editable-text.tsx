"use client"

import * as React from "react"
import { motion } from "motion/react"
import { IconPencil, IconCheck, IconX } from "@tabler/icons-react"
import { cn } from "@/registry/wise-ui/lib/utils"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

const EditableText = React.forwardRef<HTMLDivElement, EditableTextProps>(
  ({ value, onChange, className, placeholder = "Click to edit..." }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const [draft, setDraft] = React.useState(value)
    const [shimmerKey, setShimmerKey] = React.useState(0)
    const [textWidth, setTextWidth] = React.useState<number | undefined>(
      undefined
    )
    const inputRef = React.useRef<HTMLInputElement>(null)
    const textRef = React.useRef<HTMLSpanElement>(null)
    const blurTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

    React.useEffect(() => {
      if (!isEditing) setDraft(value)
    }, [value, isEditing])

    React.useEffect(() => {
      if (isEditing) {
        const timeout = setTimeout(() => {
          inputRef.current?.focus()
        }, 50)
        return () => clearTimeout(timeout)
      }
    }, [isEditing])

    React.useEffect(() => {
      return () => clearTimeout(blurTimeoutRef.current)
    }, [])

    function startEditing() {
      if (textRef.current) {
        setTextWidth(textRef.current.offsetWidth)
      }
      setDraft(value)
      setIsEditing(true)
      setIsHovered(false)
    }

    function save() {
      clearTimeout(blurTimeoutRef.current)
      onChange(draft)
      setIsEditing(false)
    }

    function cancel() {
      clearTimeout(blurTimeoutRef.current)
      setDraft(value)
      setIsEditing(false)
    }

    function handleKeyDown(e: React.KeyboardEvent) {
      if (e.key === "Enter") save()
      if (e.key === "Escape") cancel()
    }

    function handleBlur() {
      blurTimeoutRef.current = setTimeout(save, 150)
    }

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center", className)}
        onMouseEnter={() => {
          if (!isEditing) {
            setIsHovered(true)
            setShimmerKey((k) => k + 1)
          }
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isEditing ? (
          <div className="relative inline-flex items-center">
            {/* Input with animated border - same width as display text */}
            <div className="relative">
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-md border border-neutral-400"
                initial={{ clipPath: "inset(99% 50% 0% 50%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              />
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="bg-transparent px-2 py-1 text-inherit outline-none placeholder:text-neutral-500"
                style={{
                  font: "inherit",
                  width: textWidth ? `${textWidth}px` : undefined,
                  minWidth: "80px",
                }}
              />
            </div>

            {/* Save / Cancel - positioned outside layout flow */}
            <div className="absolute left-full ml-1.5 flex items-center gap-0.5">
              <motion.button
                type="button"
                onClick={save}
                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-emerald-500"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.25,
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
              >
                <IconCheck size={14} strokeWidth={2.5} />
              </motion.button>
              <motion.button
                type="button"
                onClick={cancel}
                className="rounded p-0.5 text-muted-foreground transition-colors hover:text-red-500"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                }}
              >
                <IconX size={14} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        ) : (
          <div
            className="relative inline-flex cursor-pointer items-center"
            onClick={startEditing}
          >
            <span ref={textRef} className="relative overflow-hidden rounded-md px-2 py-1">
              <span className="text-inherit">
                {value || (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </span>
              {isHovered && (
                <motion.span
                  key={shimmerKey}
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              )}
            </span>

            {/* Edit icon - slides out from the right */}
            <motion.span
              className="inline-flex items-center overflow-hidden text-muted-foreground"
              initial={false}
              animate={
                isHovered
                  ? { width: 22, opacity: 1 }
                  : { width: 0, opacity: 0 }
              }
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <IconPencil size={14} />
            </motion.span>
          </div>
        )}
      </div>
    )
  }
)
EditableText.displayName = "EditableText"

export { EditableText }
export type { EditableTextProps }
