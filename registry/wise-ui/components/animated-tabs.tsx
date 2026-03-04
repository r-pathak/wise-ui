"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

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
                layoutId={`tab-pill-${layoutId}`}
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
export type { AnimatedTabsProps, Tab }
