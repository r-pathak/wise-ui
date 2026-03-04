"use client"

import * as React from "react"
import {
  IconHome,
  IconSearch,
  IconMail,
  IconCalendar,
  IconSettings,
  IconMusic,
  IconPhoto,
} from "@tabler/icons-react"
import { Dock, type DockItem } from "@/registry/wise-ui/components/dock"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { Dock } from "@/components/ui/dock"
import { IconHome, IconSearch, IconMail, IconSettings } from "@tabler/icons-react"

const items = [
  { id: "home", icon: <IconHome size={22} />, label: "Home" },
  { id: "search", icon: <IconSearch size={22} />, label: "Search" },
  { id: "mail", icon: <IconMail size={22} />, label: "Mail" },
  { id: "settings", icon: <IconSettings size={22} />, label: "Settings" },
]

export default function Example() {
  return <Dock items={items} />
}`

const manualSource = `# Install dependencies
npm install motion clsx tailwind-merge

# Add the cn utility to lib/utils.ts (skip if already set up)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# Create components/ui/dock.tsx

"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "motion/react"
import { cn } from "@/lib/utils"

interface DockItem {
  id: string
  icon: React.ReactNode
  label: string
  href?: string
}

interface DockProps {
  items: DockItem[]
  onItemClick?: (item: DockItem) => void
  magnification?: number
  distance?: number
  className?: string
}

function Dock({
  items,
  onItemClick,
  magnification = 1.5,
  distance = 150,
  className,
}: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <div
      className={cn(
        "inline-flex items-end gap-2 rounded-2xl border border-border bg-background/80 px-3 py-2 backdrop-blur-md",
        className
      )}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item) => (
        <DockIcon
          key={item.id}
          item={item}
          mouseX={mouseX}
          magnification={magnification}
          distance={distance}
          onClick={() => onItemClick?.(item)}
        />
      ))}
    </div>
  )
}
Dock.displayName = "Dock"

function DockIcon({
  item,
  mouseX,
  magnification,
  distance,
  onClick,
}: {
  item: DockItem
  mouseX: ReturnType<typeof useMotionValue<number>>
  magnification: number
  distance: number
  onClick: () => void
}) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = React.useState(false)

  const distanceCalc = useTransform(mouseX, (val) => {
    const el = ref.current
    if (!el) return distance
    const rect = el.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    return Math.abs(val - center)
  })

  const baseSize = 40
  const scaleRaw = useTransform(distanceCalc, [0, distance], [magnification, 1])
  const scale = useSpring(scaleRaw, { stiffness: 300, damping: 25 })
  const size = useTransform(scale, (s) => s * baseSize)

  const Wrapper = item.href ? "a" : "button"
  const wrapperProps = item.href
    ? { href: item.href, target: "_blank" as const, rel: "noopener noreferrer" }
    : {}

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -4 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -top-8 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 text-xs text-background shadow"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div style={{ width: size, height: size }}>
        <Wrapper
          ref={ref as React.Ref<HTMLButtonElement & HTMLAnchorElement>}
          className="flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-muted/60 text-foreground transition-colors hover:bg-muted"
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          {...wrapperProps}
        >
          {item.icon}
        </Wrapper>
      </motion.div>
    </div>
  )
}

export { Dock }
export type { DockProps, DockItem }`

const dockProps = [
  {
    name: "items",
    type: "{ id: string; icon: ReactNode; label: string; href?: string }[]",
    default: "-",
    description: "Array of dock items to display.",
  },
  {
    name: "onItemClick",
    type: "(item: DockItem) => void",
    default: "-",
    description: "Callback when a dock item is clicked.",
  },
  {
    name: "magnification",
    type: "number",
    default: "1.5",
    description: "Maximum scale factor when hovered.",
  },
  {
    name: "distance",
    type: "number",
    default: "150",
    description: "Pixel radius of the magnification influence.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional classes for the dock container.",
  },
]

const dockItems: DockItem[] = [
  { id: "home", icon: <IconHome size={22} />, label: "Home" },
  { id: "search", icon: <IconSearch size={22} />, label: "Search" },
  { id: "mail", icon: <IconMail size={22} />, label: "Mail" },
  { id: "calendar", icon: <IconCalendar size={22} />, label: "Calendar" },
  { id: "photos", icon: <IconPhoto size={22} />, label: "Photos" },
  { id: "music", icon: <IconMusic size={22} />, label: "Music" },
  { id: "settings", icon: <IconSettings size={22} />, label: "Settings" },
]

function DockDemo() {
  return (
    <div className="flex h-40 items-end justify-center">
      <Dock items={dockItems} />
    </div>
  )
}

export default function DockPage() {
  return (
    <ComponentPage
      name="Dock"
      description="macOS-style dock with magnification on hover."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/dock.json"
      manualSource={manualSource}
      props={dockProps}
    >
      <DockDemo />
    </ComponentPage>
  )
}
