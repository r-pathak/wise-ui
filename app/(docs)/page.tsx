"use client"

import Link from "next/link"
import { MovingGradientButton } from "@/registry/wise-ui/components/moving-gradient-button"
import { MovingGradientText } from "@/registry/wise-ui/components/moving-gradient-text"
import { useTheme } from "./_components/theme-provider"

export default function Home() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-background">
      <h1
        className="text-7xl font-bold tracking-tight text-foreground sm:text-8xl"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        <MovingGradientText
          gradientFrom="#008274"
          gradientTo="#6c50be"
        >
          wise-ui
        </MovingGradientText>
      </h1>
      <p
        className="mt-4 max-w-sm text-xl text-muted-foreground"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Customizable, animated components for React.
        <br />
        Built with shadcn/ui.
      </p>
      <div className="mt-10">
        <Link href="/components/kanban-board">
          <MovingGradientButton
            gradientFrom="#008274"
            gradientTo="#6c50be"
            endIcon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            }
          >
            Browse components
          </MovingGradientButton>
        </Link>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <a
          href="https://www.linkedin.com/in/rohan--pathak/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="LinkedIn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
