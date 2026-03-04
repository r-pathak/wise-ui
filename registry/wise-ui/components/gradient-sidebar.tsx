"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1]

// ── Types ────────────────────────────────────────────────────────────

interface GradientSidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  children?: GradientSidebarItem[]
  badge?: string | number
}

interface GradientSidebarSection {
  title?: string
  items: GradientSidebarItem[]
}

interface GradientSidebarProps {
  sections: GradientSidebarSection[]
  activeId?: string
  onItemClick?: (item: GradientSidebarItem) => void
  header?: React.ReactNode
  footer?: React.ReactNode
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  width?: number
  collapsedWidth?: number
  colorA?: string
  colorB?: string
  colorC?: string
  overlayOpacity?: number
  className?: string
}

// ── Gradient Background ──────────────────────────────────────────────

function GradientBackground({
  colorA = "rgba(0,130,116,0.85)",
  colorB = "rgba(108,80,190,0.8)",
  colorC = "rgba(0,155,140,0.65)",
  overlayOpacity = 0.55,
}: {
  colorA?: string
  colorB?: string
  colorC?: string
  overlayOpacity?: number
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: "130%",
            height: "110%",
            top: "-40%",
            right: "-50%",
            background: `radial-gradient(circle, ${colorA} 0%, transparent 65%)`,
            filter: "blur(40px)",
            animation: "gradient-sidebar-blob-1 23s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "120%",
            height: "100%",
            bottom: "-35%",
            left: "-40%",
            background: `radial-gradient(circle, ${colorB} 0%, transparent 65%)`,
            filter: "blur(45px)",
            animation: "gradient-sidebar-blob-2 29s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "80%",
            height: "70%",
            top: "20%",
            left: "-10%",
            background: `radial-gradient(circle, ${colorC} 0%, transparent 60%)`,
            filter: "blur(35px)",
            animation: "gradient-sidebar-blob-3 19s ease-in-out infinite",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 backdrop-blur-sm"
        style={{
          background: `rgba(var(--background-rgb, 30,31,34), ${overlayOpacity})`,
        }}
      />
      <style>{`
        @keyframes gradient-sidebar-blob-1 {
          0%   { transform: translate(0, 0) scale(1); }
          20%  { transform: translate(-15%, 25%) scale(1.05); }
          45%  { transform: translate(-25%, 55%) scale(0.95); }
          70%  { transform: translate(-5%, 35%) scale(1.08); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes gradient-sidebar-blob-2 {
          0%   { transform: translate(0, 0) scale(1); }
          30%  { transform: translate(25%, -40%) scale(1.12); }
          55%  { transform: translate(40%, -20%) scale(0.9); }
          80%  { transform: translate(15%, -55%) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes gradient-sidebar-blob-3 {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(-20%, -15%) scale(1.15); }
          50%  { transform: translate(10%, 20%) scale(0.88); }
          75%  { transform: translate(-10%, 5%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </>
  )
}

// ── Sidebar Item ─────────────────────────────────────────────────────

function SidebarMenuItem({
  item,
  activeId,
  onItemClick,
  depth,
  isCollapsed,
}: {
  item: GradientSidebarItem
  activeId?: string
  onItemClick?: (item: GradientSidebarItem) => void
  depth: number
  isCollapsed: boolean
}) {
  const [expanded, setExpanded] = React.useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = activeId === item.id

  React.useEffect(() => {
    if (hasChildren && activeId) {
      const hasActiveChild = (items: GradientSidebarItem[]): boolean =>
        items.some(
          (child) =>
            child.id === activeId ||
            (child.children && hasActiveChild(child.children))
        )
      if (hasActiveChild(item.children!)) {
        setExpanded(true)
      }
    }
  }, [activeId, hasChildren, item.children])

  function handleClick() {
    if (hasChildren) {
      setExpanded((e) => !e)
    }
    onItemClick?.(item)
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "group relative flex w-full items-center rounded-md py-2 text-sm transition-colors",
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
          isCollapsed ? "justify-center px-1" : "gap-2 px-2.5 pr-3",
          depth > 0 && !isCollapsed && "pl-7"
        )}
      >
        {isActive && !isCollapsed && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute inset-0 rounded-md bg-foreground/10"
            transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
          />
        )}

        {item.icon && (
          <span className="relative z-10 shrink-0">{item.icon}</span>
        )}

        {!isCollapsed && (
          <span className="relative z-10 flex-1 truncate text-left font-medium">
            {item.label}
          </span>
        )}

        {!isCollapsed && item.badge != null && (
          <span className="relative z-10 shrink-0 inline-flex items-center justify-center rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {item.badge}
          </span>
        )}

        {!isCollapsed && hasChildren && (
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10 shrink-0 text-muted-foreground/60"
            initial={false}
            animate={{ rotate: expanded ? 0 : -90 }}
            transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
          >
            <polyline points="2 4 6 8 10 4" />
          </motion.svg>
        )}
      </button>

      {hasChildren && !isCollapsed && (
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
              className="overflow-hidden"
            >
              {item.children!.map((child) => (
                <SidebarMenuItem
                  key={child.id}
                  item={child}
                  activeId={activeId}
                  onItemClick={onItemClick}
                  depth={depth + 1}
                  isCollapsed={isCollapsed}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

// ── Main GradientSidebar ─────────────────────────────────────────────

function GradientSidebar({
  sections,
  activeId,
  onItemClick,
  header,
  footer,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  width = 256,
  collapsedWidth = 64,
  colorA,
  colorB,
  colorC,
  overlayOpacity,
  className,
}: GradientSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] =
    React.useState(defaultCollapsed)

  const isControlled = controlledCollapsed !== undefined
  const isCollapsed = isControlled ? controlledCollapsed : internalCollapsed

  function toggleCollapse() {
    const next = !isCollapsed
    if (!isControlled) setInternalCollapsed(next)
    onCollapsedChange?.(next)
  }

  const currentWidth = isCollapsed ? collapsedWidth : width

  return (
    <motion.div
      className={cn(
        "relative flex h-full shrink-0 flex-col overflow-hidden",
        className
      )}
      initial={false}
      animate={{ width: currentWidth }}
      transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
    >
      {/* Animated gradient background */}
      <GradientBackground
        colorA={colorA}
        colorB={colorB}
        colorC={colorC}
        overlayOpacity={overlayOpacity}
      />

      {/* Right border */}
      <div className="absolute right-0 top-0 h-full w-px bg-border" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col overflow-y-auto overflow-x-hidden">
        {/* Header - wrapper always renders with fixed height to keep icons stable */}
        <div className="shrink-0 px-3 pt-4 pb-2 min-h-[48px] overflow-hidden">
          {!isCollapsed && header}
        </div>

        <div className={cn("flex-1 py-2", isCollapsed ? "px-1" : "px-2")}>
          {sections.map((section, sIdx) => (
            <div
              key={section.title ?? sIdx}
              className={sIdx > 0 ? "mt-5" : ""}
            >
              {section.title && !isCollapsed && (
                <p className="mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                  {section.title}
                </p>
              )}
              {/* Keep section title spacing even when collapsed */}
              {section.title && isCollapsed && (
                <div className="mb-1.5 h-3" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarMenuItem
                    key={item.id}
                    item={item}
                    activeId={activeId}
                    onItemClick={onItemClick}
                    depth={0}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-border/40 px-3 py-3">
            {footer}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute right-2 top-3 z-20 flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
        >
          <polyline points="15 18 9 12 15 6" />
        </motion.svg>
      </button>
    </motion.div>
  )
}

export { GradientSidebar }
export type { GradientSidebarProps, GradientSidebarSection, GradientSidebarItem }
