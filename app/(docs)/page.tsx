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
      <p
        className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground/50"
      >
        Component Library
      </p>
      <h1
        className="mt-3 text-6xl font-bold tracking-tight text-foreground sm:text-7xl"
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
        className="mt-4 max-w-sm text-lg text-muted-foreground"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Customizable, animated components for React.
        <br />
        Built with shadcn/ui.
      </p>
      <div className="mt-10">
        <Link href="/components/metallic-lava">
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
    </div>
  )
}
