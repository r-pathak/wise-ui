"use client"

import { ThemeProvider } from "./_components/theme-provider"
import { ThemeToggle } from "./_components/theme-toggle"
import { Sidebar } from "./_components/sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <Sidebar />
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <main>{children}</main>
    </ThemeProvider>
  )
}
