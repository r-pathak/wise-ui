"use client"

import * as React from "react"
import { IconEye, IconStar, IconCurrencyDollar, IconHelp } from "@tabler/icons-react"
import { AnimatedTabs } from "@/registry/wise-ui/components/animated-tabs"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { useState } from "react"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
]

export default function Example() {
  const [active, setActive] = useState("overview")
  return <AnimatedTabs tabs={tabs} activeTab={active} onTabChange={setActive} />
}`

const manualSource = `# Install dependencies
npm install motion clsx tailwind-merge

# Add the cn utility to lib/utils.ts (skip if already set up)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# Create components/ui/animated-tabs.tsx

"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
}

interface AnimatedTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

function AnimatedTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: AnimatedTabsProps) {
  const layoutId = React.useId()

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative z-10 inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={\`tab-pill-\${layoutId}\`}
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                style={{ zIndex: -1 }}
              />
            )}
            {tab.icon && <span className="inline-flex shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
AnimatedTabs.displayName = "AnimatedTabs"

export { AnimatedTabs }
export type { AnimatedTabsProps, Tab }`

const animatedTabsProps = [
  {
    name: "tabs",
    type: "{ id: string; label: string; icon?: ReactNode }[]",
    default: "-",
    description: "Array of tab objects to render.",
  },
  {
    name: "activeTab",
    type: "string",
    default: "-",
    description: "The id of the currently active tab.",
  },
  {
    name: "onTabChange",
    type: "(tabId: string) => void",
    default: "-",
    description: "Callback when a tab is clicked.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional classes for the tab bar container.",
  },
]

const simpleTabs = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
]

const iconTabs = [
  { id: "overview", label: "Overview", icon: <IconEye size={16} /> },
  { id: "features", label: "Features", icon: <IconStar size={16} /> },
  { id: "pricing", label: "Pricing", icon: <IconCurrencyDollar size={16} /> },
  { id: "faq", label: "FAQ", icon: <IconHelp size={16} /> },
]

const tabContent: Record<string, string> = {
  overview: "Get a bird's-eye view of everything the platform offers.",
  features: "Explore the powerful features that set us apart from the rest.",
  pricing: "Simple, transparent pricing with no hidden fees.",
  faq: "Find answers to the most commonly asked questions.",
}

function AnimatedTabsDemo() {
  const [active1, setActive1] = React.useState("overview")
  const [active2, setActive2] = React.useState("overview")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <AnimatedTabs tabs={simpleTabs} activeTab={active1} onTabChange={setActive1} />
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          {tabContent[active1]}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">With icons:</p>
        <AnimatedTabs tabs={iconTabs} activeTab={active2} onTabChange={setActive2} />
      </div>
    </div>
  )
}

export default function AnimatedTabsPage() {
  return (
    <ComponentPage
      name="Animated Tabs"
      description="Tab bar with a sliding pill indicator powered by layout animations."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/animated-tabs.json"
      manualSource={manualSource}
      props={animatedTabsProps}
    >
      <AnimatedTabsDemo />
    </ComponentPage>
  )
}
