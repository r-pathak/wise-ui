"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "motion/react"
import {
  GradientSidebar,
  type GradientSidebarSection,
  type GradientSidebarItem,
} from "@/registry/wise-ui/components/gradient-sidebar"
import { useTheme } from "./theme-provider"

const categories = [
  {
    label: "Data & Lists",
    items: [
      { name: "kanban-board", title: "Kanban Board" },
      { name: "data-table", title: "Data Table" },
      { name: "reorderable-list", title: "Reorderable List" },
    ],
  },
  {
    label: "Backgrounds",
    items: [
      { name: "metallic-lava", title: "Metallic Lava" },
      { name: "nebula", title: "Nebula" },
      { name: "dot-matrix", title: "Dot Matrix" },
    ],
  },
  {
    label: "Cards",
    items: [
      { name: "spotlight-card", title: "Spotlight Card" },
      { name: "tilt-card", title: "Tilt Card" },
      { name: "border-beam", title: "Border Beam" },
    ],
  },
  {
    label: "Navigation",
    items: [
      { name: "gradient-sidebar", title: "Gradient Sidebar" },
      { name: "dock", title: "Dock" },
    ],
  },
  {
    label: "Text",
    items: [
      { name: "editable-text", title: "Editable Text" },
      { name: "moving-gradient-text", title: "Moving Gradient Text" },
      { name: "scramble-text", title: "Scramble Text" },
    ],
  },
  {
    label: "Buttons",
    items: [
      { name: "moving-gradient-button", title: "Moving Gradient Button" },
      { name: "magnetic-button", title: "Magnetic Button" },
      { name: "pulse-button", title: "Pulse Button" },
    ],
  },
  {
    label: "Layout",
    items: [
      { name: "marquee", title: "Marquee" },
    ],
  },
]

function buildSections(): GradientSidebarSection[] {
  const homeSection: GradientSidebarSection = {
    items: [
      {
        id: "/",
        label: "Home",
        href: "/",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      {
        id: "/guides/installation",
        label: "Installation",
        href: "/guides/installation",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        ),
      },
      {
        id: "/guides/theme-customization",
        label: "Custom Colors",
        href: "/guides/theme-customization",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>
        ),
      },
      {
        id: "/guides/typography",
        label: "Typography",
        href: "/guides/typography",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
        ),
      },
    ],
  }

  const catSections: GradientSidebarSection[] = categories.map((cat) => ({
    title: cat.label,
    items: cat.items.map((c) => ({
      id: `/components/${c.name}`,
      label: c.title,
      href: `/components/${c.name}`,
    })),
  }))

  return [homeSection, ...catSections]
}

const sections = buildSections()

export function Sidebar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [collapsed, setCollapsed] = React.useState(false)

  function handleItemClick(item: GradientSidebarItem) {
    if (item.href) {
      router.push(item.href)
    }
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-screen">
        <GradientSidebar
          sections={sections}
          activeId={pathname}
          onItemClick={handleItemClick}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          overlayOpacity={isDark ? 0.55 : 0.65}
          header={
            <div
              className="px-1 pb-1"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              <span className="text-2xl font-bold tracking-tight text-foreground">
                wise-ui
              </span>
            </div>
          }
        />
      </div>

      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      >
        {children}
        <footer className="border-t border-border px-8 py-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-muted-foreground">
            <p>
              Built by{" "}
              <a
                href="https://www.linkedin.com/in/rohan--pathak/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Rohan Pathak
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/rohan--pathak/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://github.com/r-pathak"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </motion.main>
    </>
  )
}
