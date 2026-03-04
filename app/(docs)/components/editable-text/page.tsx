"use client"

import * as React from "react"
import { EditableText } from "@/registry/wise-ui/components/editable-text"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import * as React from "react"
import { EditableText } from "@/components/ui/editable-text"

export default function Example() {
  const [heading, setHeading] = React.useState("Click me to edit")
  const [body, setBody] = React.useState(
    "Hover to see the shimmer, click to edit, Enter to save, Escape to cancel."
  )
  const [small, setSmall] = React.useState("Small inline text")

  return (
    <div className="flex flex-col gap-6">
      <EditableText
        value={heading}
        onChange={setHeading}
        className="text-xl font-semibold text-foreground"
      />
      <EditableText
        value={body}
        onChange={setBody}
        className="text-sm text-muted-foreground"
      />
      <div className="flex items-center gap-2 pl-2 text-sm text-muted-foreground">
        <span>Author:</span>
        <EditableText
          value={small}
          onChange={setSmall}
          className="text-foreground"
        />
      </div>
    </div>
  )
}`

const manualSource = `# Install dependencies
npm install motion @tabler/icons-react clsx tailwind-merge

# Add the cn utility to lib/utils.ts (skip if already set up)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# Create components/ui/editable-text.tsx

"use client"

import * as React from "react"
import { motion } from "motion/react"
import { IconPencil, IconCheck, IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

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
    const [textWidth, setTextWidth] = React.useState<number | undefined>(undefined)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const textRef = React.useRef<HTMLSpanElement>(null)
    const blurTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

    React.useEffect(() => {
      if (!isEditing) setDraft(value)
    }, [value, isEditing])

    React.useEffect(() => {
      if (isEditing) {
        const timeout = setTimeout(() => inputRef.current?.focus(), 50)
        return () => clearTimeout(timeout)
      }
    }, [isEditing])

    React.useEffect(() => {
      return () => clearTimeout(blurTimeoutRef.current)
    }, [])

    function startEditing() {
      if (textRef.current) setTextWidth(textRef.current.offsetWidth)
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
          <div className="inline-flex items-center gap-1.5">
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
                style={{ font: "inherit", width: textWidth ? textWidth + 16 + "px" : undefined, minWidth: "80px" }}
              />
            </div>
            <div className="flex items-center gap-0.5">
              <motion.button
                type="button"
                onClick={save}
                className="rounded p-0.5 text-neutral-400 transition-colors hover:text-emerald-500"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 500, damping: 25 }}
              >
                <IconCheck size={14} strokeWidth={2.5} />
              </motion.button>
              <motion.button
                type="button"
                onClick={cancel}
                className="rounded p-0.5 text-neutral-400 transition-colors hover:text-red-500"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 25 }}
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
                {value || <span className="text-neutral-500">{placeholder}</span>}
              </span>
              {isHovered && (
                <motion.span
                  key={shimmerKey}
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              )}
            </span>
            <motion.span
              className="inline-flex items-center overflow-hidden text-neutral-500"
              initial={false}
              animate={isHovered ? { width: 22, opacity: 1 } : { width: 0, opacity: 0 }}
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
export type { EditableTextProps }`

const editableTextProps = [
  {
    name: "value",
    type: "string",
    default: "-",
    description: "The controlled text value.",
  },
  {
    name: "onChange",
    type: "(value: string) => void",
    default: "-",
    description: "Callback fired when the user saves edited text.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional CSS classes applied to the wrapper. Font styles are inherited by the input.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Click to edit..."',
    description: "Placeholder shown when value is empty.",
  },
]

function EditableTextDemo() {
  const [heading, setHeading] = React.useState("Click me to edit")
  const [body, setBody] = React.useState(
    "Hover to see the shimmer, click to edit, Enter to save, Escape to cancel."
  )
  const [small, setSmall] = React.useState("Small inline text")

  return (
    <div className="flex flex-col gap-6">
      <EditableText
        value={heading}
        onChange={setHeading}
        className="text-xl font-semibold text-foreground"
      />
      <EditableText
        value={body}
        onChange={setBody}
        className="text-sm text-muted-foreground"
      />
      <div className="flex items-center gap-2 pl-2 text-sm text-muted-foreground">
        <span>Author:</span>
        <EditableText
          value={small}
          onChange={setSmall}
          className="text-foreground"
        />
      </div>
    </div>
  )
}

export default function EditableTextPage() {
  return (
    <ComponentPage
      name="Editable Text"
      description="Inline editable text with animated border reveal, shimmer effect, and smooth save/cancel controls."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/editable-text.json"
      manualSource={manualSource}
      props={editableTextProps}
    >
      <EditableTextDemo />
    </ComponentPage>
  )
}
