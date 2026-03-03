"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"

const components = [
  { name: "editable-text", title: "Editable Text" },
  { name: "moving-gradient-button", title: "Moving Gradient Button" },
]

export function Sidebar() {
  const [open, setOpen] = React.useState(true)
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop overlay (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.nav
        className="fixed left-0 top-0 z-40 h-screen overflow-hidden"
        initial={false}
        animate={{ width: open ? 256 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="relative flex h-full min-w-[256px] flex-col sidebar-gradient-bg"
        >
          {/* Gradient mesh background — large overlapping orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Teal — starts top-right, spills across */}
            <div className="absolute rounded-full" style={{ width: "130%", height: "110%", top: "-40%", right: "-50%", background: "radial-gradient(circle, rgba(0,130,116,0.85) 0%, transparent 65%)", filter: "blur(40px)", animation: "blob-1 23s ease-in-out infinite" }} />
            {/* Purple — starts bottom-left, overlaps with teal */}
            <div className="absolute rounded-full" style={{ width: "120%", height: "100%", bottom: "-35%", left: "-40%", background: "radial-gradient(circle, rgba(108,80,190,0.8) 0%, transparent 65%)", filter: "blur(45px)", animation: "blob-2 29s ease-in-out infinite" }} />
            {/* Smaller teal accent — center, drifts through both */}
            <div className="absolute rounded-full" style={{ width: "80%", height: "70%", top: "20%", left: "-10%", background: "radial-gradient(circle, rgba(0,155,140,0.65) 0%, transparent 60%)", filter: "blur(35px)", animation: "blob-3 19s ease-in-out infinite" }} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-background/55 backdrop-blur-sm" />

          {/* Border right */}
          <div className="absolute right-0 top-0 h-full w-px bg-border" />

          {/* Content */}
          <div className="relative flex h-full flex-col px-4 pt-8 pb-6">
            {/* Branding */}
            <div className="mb-6 px-2" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                wise-ui
              </span>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className={`px-2 py-1.5 text-sm transition-colors ${
                  pathname === "/"
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Home
              </Link>

              <div className="mt-4 mb-2 px-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                  Components
                </span>
              </div>

              {components.map((c) => (
                <Link
                  key={c.name}
                  href={`/components/${c.name}`}
                  className={`px-2 py-1.5 text-sm transition-colors ${
                    pathname === `/components/${c.name}`
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Collapse/expand toggle — sits on the sidebar edge */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed top-4 z-50 flex size-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        initial={false}
        animate={{ left: open ? 244 : 8 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <polyline points="15 18 9 12 15 6" />
        </motion.svg>
      </motion.button>
    </>
  )
}
