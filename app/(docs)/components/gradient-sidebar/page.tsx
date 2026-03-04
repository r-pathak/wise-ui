"use client"

import * as React from "react"
import {
  GradientSidebar,
  type GradientSidebarSection,
} from "@/registry/wise-ui/components/gradient-sidebar"
import { useTheme } from "../../_components/theme-provider"
import { ComponentPage } from "../../_components/component-page"

// ── Icons ────────────────────────────────────────────────────────────

function Icon({ d, ...props }: { d: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d={d} />
    </svg>
  )
}

const icons = {
  dashboard: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  analytics: <Icon d="M18 20V10 M12 20V4 M6 20v-6" />,
  projects: <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
  active: <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />,
  archived: <Icon d="M21 8v13H3V8 M1 3h22v5H1z M10 12h4" />,
  settings: <Icon d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  team: <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />,
  billing: <Icon d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M1 10h22" />,
}

const sections: GradientSidebarSection[] = [
  {
    title: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: icons.dashboard },
      { id: "analytics", label: "Analytics", icon: icons.analytics, badge: "New" },
      {
        id: "projects",
        label: "Projects",
        icon: icons.projects,
        children: [
          { id: "active", label: "Active", icon: icons.active, badge: 3 },
          { id: "archived", label: "Archived", icon: icons.archived },
        ],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      { id: "general", label: "General", icon: icons.settings },
      { id: "team", label: "Team", icon: icons.team },
      { id: "billing", label: "Billing", icon: icons.billing },
    ],
  },
]

const usageCode = `import { GradientSidebar } from "@/components/ui/gradient-sidebar"

const sections = [
  {
    title: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: <HomeIcon /> },
      { id: "analytics", label: "Analytics", icon: <ChartIcon /> },
      {
        id: "projects", label: "Projects", icon: <FolderIcon />,
        children: [
          { id: "active", label: "Active" },
          { id: "archived", label: "Archived" },
        ],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      { id: "general", label: "General", icon: <GearIcon /> },
      { id: "team", label: "Team", icon: <UsersIcon /> },
    ],
  },
]

export default function Layout() {
  const [activeId, setActiveId] = React.useState("dashboard")

  return (
    <div className="flex h-screen">
      <GradientSidebar
        sections={sections}
        activeId={activeId}
        onItemClick={(item) => setActiveId(item.id)}
        header={<h2 className="text-lg font-bold">Acme</h2>}
      />
      <main className="flex-1 p-8">Content</main>
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

# Create components/ui/gradient-sidebar.tsx

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
            background: \`radial-gradient(circle, \${colorA} 0%, transparent 65%)\`,
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
            background: \`radial-gradient(circle, \${colorB} 0%, transparent 65%)\`,
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
            background: \`radial-gradient(circle, \${colorC} 0%, transparent 60%)\`,
            filter: "blur(35px)",
            animation: "gradient-sidebar-blob-3 19s ease-in-out infinite",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 backdrop-blur-sm"
        style={{
          background: \`rgba(var(--background-rgb, 30,31,34), \${overlayOpacity})\`,
        }}
      />
      <style>{\`
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
      \`}</style>
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
`

const gradientSidebarProps = [
  {
    name: "sections",
    type: "GradientSidebarSection[]",
    default: "-",
    description: "Array of sections, each with optional `title` and `items`.",
  },
  {
    name: "activeId",
    type: "string",
    default: "-",
    description: "ID of the currently active item (sliding highlight).",
  },
  {
    name: "onItemClick",
    type: "(item: GradientSidebarItem) => void",
    default: "-",
    description: "Called when any item is clicked.",
  },
  {
    name: "header",
    type: "ReactNode",
    default: "-",
    description: "Brand/logo slot rendered at the top.",
  },
  {
    name: "footer",
    type: "ReactNode",
    default: "-",
    description: "User/profile slot rendered at the bottom.",
  },
  {
    name: "collapsed / defaultCollapsed",
    type: "boolean",
    default: "false",
    description: "Controlled or uncontrolled collapse state.",
  },
  {
    name: "onCollapsedChange",
    type: "(collapsed: boolean) => void",
    default: "-",
    description: "Called when the collapse state changes.",
  },
  {
    name: "width",
    type: "number",
    default: "256",
    description: "Expanded sidebar width in pixels.",
  },
  {
    name: "collapsedWidth",
    type: "number",
    default: "64",
    description: "Collapsed sidebar width in pixels.",
  },
  {
    name: "colorA / colorB / colorC",
    type: "string",
    default: "teal / purple / teal-accent",
    description: "Colors for the three animated gradient orbs.",
  },
  {
    name: "overlayOpacity",
    type: "number",
    default: "0.55",
    description: "Opacity of the semi-transparent backdrop overlay.",
  },
]

function GradientSidebarDemo() {
  const [activeId, setActiveId] = React.useState("dashboard")
  const { theme } = useTheme()
  const isDark = theme === "dark"

  function findLabel(secs: GradientSidebarSection[], id: string): string {
    for (const sec of secs) {
      for (const item of sec.items) {
        if (item.id === id) return item.label
        if (item.children) {
          const child = item.children.find((c) => c.id === id)
          if (child) return child.label
        }
      }
    }
    return id
  }

  return (
    <div className="relative flex h-[550px] w-full overflow-hidden rounded-2xl border border-border bg-background">
      <GradientSidebar
        sections={sections}
        activeId={activeId}
        onItemClick={(item) => {
          if (!item.children) setActiveId(item.id)
        }}
        overlayOpacity={isDark ? 0.55 : 0.65}
        header={
          <div
            className="px-1 text-lg font-bold text-foreground"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            wise-ui
          </div>
        }
        footer={
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-bold text-foreground">
              JP
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                Jane Park
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                jane@acme.co
              </p>
            </div>
          </div>
        }
      />

      <main className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <h2
            className="text-3xl font-bold text-foreground sm:text-4xl"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {findLabel(sections, activeId)}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Navigate the sidebar to switch views.
          </p>
        </div>
      </main>
    </div>
  )
}

export default function GradientSidebarPage() {
  return (
    <ComponentPage
      name="Gradient Sidebar"
      description="Full-featured sidebar with animated drifting gradient orbs, hierarchical menus, sliding active indicator, and collapsible layout."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/gradient-sidebar.json"
      manualSource={manualSource}
      props={gradientSidebarProps}
    >
      <GradientSidebarDemo />
    </ComponentPage>
  )
}
