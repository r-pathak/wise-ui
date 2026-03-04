"use client"

import * as React from "react"
import { MovingGradientButton } from "@/registry/wise-ui/components/moving-gradient-button"
import { useTheme } from "../../_components/theme-provider"

const globalVarsSnippet = `:root {
  --background: #E8F1F2;
  --foreground: #2A2B2E;
  --primary: #00a896;
  --primary-foreground: #ffffff;
  --secondary: #d3d4d9;
  --muted: #d3d4d9;
  --muted-foreground: #5a5a66;
  --card: #F2F7F8;
  --card-foreground: #2A2B2E;
  --border: #bcc3c4;
  --ring: #00a896;
  --background-rgb: 232,241,242;
}

.dark {
  --background: #1E1F22;
  --foreground: #E8F1F2;
  --primary: #00a896;
  --card: #353639;
  --card-foreground: #E8F1F2;
  --muted: #3e3f43;
  --muted-foreground: #9a9ba6;
  --border: #44454a;
  --ring: #00a896;
  --background-rgb: 30,31,34;
}`

const warmPalette = `:root {
  --background: #FDF6EC;
  --foreground: #3D2E1C;
  --primary: #D97706;
  --primary-foreground: #ffffff;
  --secondary: #E8D5B7;
  --muted: #E8D5B7;
  --muted-foreground: #8B7355;
  --card: #FFF8F0;
  --card-foreground: #3D2E1C;
  --border: #D4C4A8;
  --ring: #D97706;
  --background-rgb: 253,246,236;
}

.dark {
  --background: #1C1510;
  --foreground: #F5E6D3;
  --primary: #F59E0B;
  --card: #2A2016;
  --card-foreground: #F5E6D3;
  --muted: #3A2E20;
  --muted-foreground: #B8A080;
  --border: #4A3D2E;
  --ring: #F59E0B;
  --background-rgb: 28,21,16;
}`

const componentColorSnippet = `{/* Gradient Sidebar - change the animated orb colors */}
<GradientSidebar
  colorA="rgba(217,119,6,0.85)"
  colorB="rgba(245,158,11,0.8)"
  colorC="rgba(251,191,36,0.65)"
  overlayOpacity={0.55}
  sections={sections}
/>

{/* Moving Gradient Button - change the gradient colors */}
<MovingGradientButton
  gradientFrom="#D97706"
  gradientTo="#F59E0B"
>
  Warm Button
</MovingGradientButton>

{/* Nebula - change the cloud colors */}
<Nebula
  colorA="#6b1d9e"
  colorB="#0d3b7a"
  colorC="#c2185b"
/>

{/* Metallic Lava - change the metallic surface colors */}
<MetallicLava
  color="#8a6b3e"
  highlightColor="#c5a870"
/>`

const componentProps = [
  {
    component: "Gradient Sidebar",
    props: [
      { name: "colorA / colorB / colorC", desc: "Colors for the three animated gradient orbs. Accepts rgba strings." },
      { name: "overlayOpacity", desc: "Opacity of the dark overlay on top of the gradient (0-1)." },
    ],
  },
  {
    component: "Moving Gradient Button",
    props: [
      { name: "gradientFrom", desc: "Starting color of the rotating gradient. Hex string." },
      { name: "gradientTo", desc: "Ending color of the rotating gradient. Hex string." },
    ],
  },
  {
    component: "Nebula",
    props: [
      { name: "colorA / colorB / colorC", desc: "The three nebula cloud colors. Hex strings." },
    ],
  },
  {
    component: "Metallic Lava",
    props: [
      { name: "color", desc: "Base metallic surface color. Hex string." },
      { name: "highlightColor", desc: "Specular highlight color for the metallic sheen. Hex string." },
    ],
  },
]

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

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-8 shrink-0 rounded-md border border-border"
        style={{ background: color }}
      />
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{color}</p>
      </div>
    </div>
  )
}

export default function ThemeCustomizationPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="min-h-screen bg-background p-8 pt-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground">Custom Colors</h1>
        <p
          className="mt-1 text-muted-foreground"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          How to use your own color palettes with wise-ui components.
        </p>

        <div className="mt-10 space-y-12">
          {/* Section 1: Global CSS Variables */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Global theme via CSS variables</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              wise-ui components use semantic color tokens defined in your{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">globals.css</code>.
              These control backgrounds, text, borders, cards, and interactive states across all components.
              Change them to match your brand.
            </p>

            <div className="mt-4">
              <CodeBlock title="globals.css - default palette">{globalVarsSnippet}</CodeBlock>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Key variables</h3>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <ColorSwatch color={isDark ? "#1E1F22" : "#E8F1F2"} label="--background" />
                <ColorSwatch color={isDark ? "#E8F1F2" : "#2A2B2E"} label="--foreground" />
                <ColorSwatch color="#00a896" label="--primary" />
                <ColorSwatch color={isDark ? "#353639" : "#F2F7F8"} label="--card" />
                <ColorSwatch color={isDark ? "#3e3f43" : "#d3d4d9"} label="--muted" />
                <ColorSwatch color={isDark ? "#44454a" : "#bcc3c4"} label="--border" />
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              The{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">--background-rgb</code>{" "}
              variable is used by the Gradient Sidebar for its translucent overlay. Keep it in sync with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">--background</code>.
            </p>
          </section>

          {/* Section 2: Example custom palette */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Example: warm palette</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Replace the default teal/gray palette with a warm amber scheme.
              Drop this into your{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">globals.css</code>{" "}
              to instantly retheme every component.
            </p>

            <div className="mt-4">
              <CodeBlock title="globals.css - warm palette">{warmPalette}</CodeBlock>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Preview</h3>
              <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-6">
                <MovingGradientButton
                  gradientFrom="#D97706"
                  gradientTo="#F59E0B"
                >
                  Warm gradient
                </MovingGradientButton>
                <MovingGradientButton
                  gradientFrom="#7C3AED"
                  gradientTo="#A78BFA"
                >
                  Cool gradient
                </MovingGradientButton>
                <MovingGradientButton
                  gradientFrom="#059669"
                  gradientTo="#34D399"
                >
                  Green gradient
                </MovingGradientButton>
              </div>
            </div>
          </section>

          {/* Section 3: Per-component color props */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Per-component color props</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Beyond global CSS variables, several components accept color props directly.
              This lets you use different palettes for different instances on the same page.
            </p>

            <div className="mt-4">
              <CodeBlock title="Component-level color customization">{componentColorSnippet}</CodeBlock>
            </div>

            <div className="mt-6 space-y-4">
              {componentProps.map((group) => (
                <div key={group.component} className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-sm font-semibold text-foreground">{group.component}</h4>
                  <div className="mt-2 space-y-1.5">
                    {group.props.map((prop) => (
                      <div key={prop.name} className="flex gap-2 text-sm">
                        <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">
                          {prop.name}
                        </code>
                        <span className="text-muted-foreground">{prop.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Tips */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Tips</h2>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-primary">1.</span>
                <span>
                  <strong className="text-foreground">Use both light and dark tokens.</strong>{" "}
                  Define both <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">:root</code>{" "}
                  and <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">.dark</code>{" "}
                  variables so your palette works in both modes.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-primary">2.</span>
                <span>
                  <strong className="text-foreground">Keep contrast accessible.</strong>{" "}
                  Ensure at least 4.5:1 contrast between <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">--foreground</code>{" "}
                  and <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">--background</code>{" "}
                  for WCAG AA compliance.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-primary">3.</span>
                <span>
                  <strong className="text-foreground">Sync --background-rgb.</strong>{" "}
                  The Gradient Sidebar uses this for its translucent overlay. If you change{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">--background</code>,
                  update <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">--background-rgb</code>{" "}
                  to match (as comma-separated R,G,B values).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-primary">4.</span>
                <span>
                  <strong className="text-foreground">Component props override globals.</strong>{" "}
                  Props like <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">gradientFrom</code>{" "}
                  and <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground">colorA</code>{" "}
                  are independent of CSS variables. Use them for per-instance customization.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
