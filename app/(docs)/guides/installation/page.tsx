"use client"

import * as React from "react"

function CodeBlock({ children, title }: { children: string; title?: string }) {
  const [copied, setCopied] = React.useState(false)

  function copy() {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg border border-border bg-card">
      {title && (
        <div className="border-b border-border px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
        </div>
      )}
      <button
        onClick={copy}
        className="absolute right-3 top-3 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-muted-foreground">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export default function InstallationPage() {
  return (
    <div className="min-h-screen bg-background p-8 pt-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground">Installation</h1>
        <p
          className="mt-1 text-muted-foreground"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Get wise-ui components into your project in under a minute.
        </p>

        <div className="mt-10 space-y-12">
          {/* Section 1: Quick Start */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Quick Start (Recommended)</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The fastest way to add a component is the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">shadcn</code>{" "}
              CLI. It handles dependencies, creates files, and wires everything up automatically.
            </p>

            <div className="mt-4">
              <CodeBlock title="Terminal">
                {`npx shadcn@latest add https://wise-ui.com/r/kanban-board.json`}
              </CodeBlock>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Replace{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">kanban-board</code>{" "}
              with any component name. You can find the exact CLI command on each component&apos;s page under the{" "}
              <strong className="text-foreground">Installation</strong> section.
            </p>
          </section>

          {/* Section 2: Manual Installation */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Manual Installation</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              If you prefer to set things up by hand, follow these three steps.
            </p>

            <div className="mt-6 space-y-6">
              {/* Step A */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">A. Install base dependencies</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  All wise-ui components use{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">motion</code>{" "}
                  for animations and{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">clsx</code>{" "}
                  +{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">tailwind-merge</code>{" "}
                  for class merging.
                </p>
                <div className="mt-3">
                  <CodeBlock title="Terminal">
                    {`npm install motion clsx tailwind-merge`}
                  </CodeBlock>
                </div>
              </div>

              {/* Step B */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">B. Set up the cn() utility</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  If you don&apos;t already have a{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">cn()</code>{" "}
                  helper (common in shadcn/ui projects), create one:
                </p>
                <div className="mt-3">
                  <CodeBlock title="lib/utils.ts">
{`import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}
                  </CodeBlock>
                </div>
              </div>

              {/* Step C */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">C. Copy the component code</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  On each component page, switch to the{" "}
                  <strong className="text-foreground">Manual</strong>{" "}
                  tab in the Installation section. Copy the full source into your project
                  (e.g.{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">components/ui/kanban-board.tsx</code>).
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Why source lives in your project */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Why component code lives in your project</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              wise-ui follows the same philosophy as shadcn/ui — component source code is added directly
              to your codebase, not hidden inside{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">node_modules</code>.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-primary">1.</span>
                <span>
                  <strong className="text-foreground">Full customization.</strong>{" "}
                  Tweak styling, animation timing, layout, and behavior to match your exact design system.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-primary">2.</span>
                <span>
                  <strong className="text-foreground">No version lock-in.</strong>{" "}
                  You own the code. Update, extend, or simplify components whenever you want — no waiting for upstream releases.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-primary">3.</span>
                <span>
                  <strong className="text-foreground">Transparency.</strong>{" "}
                  Every line is visible and debuggable. No black-box abstractions.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
