"use client"

import * as React from "react"
import { MovingGradientText } from "@/registry/wise-ui/components/moving-gradient-text"

const defaultSetupSnippet = `// app/layout.tsx
import { Inter } from "next/font/google"
import { Cormorant } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const cormorant = Cormorant({ subsets: ["latin"], variable: "--font-cormorant" })

export default function RootLayout({ children }) {
  return (
    <html className={\`\${inter.variable} \${cormorant.variable}\`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}`

const defaultCssSnippet = `/* globals.css - default heading rule */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-cormorant), Georgia, serif;
}`

// ── Custom font snippets ──────────────────────────────────────────────

const customHeadingSnippet = `// app/layout.tsx - swap the heading font
import { Inter } from "next/font/google"
import { Playfair_Display } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",   // any variable name you like
})

export default function RootLayout({ children }) {
  return (
    <html className={\`\${inter.variable} \${playfair.variable}\`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

// globals.css - point headings at the new variable
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), Georgia, serif;
}`

const customBodySnippet = `// app/layout.tsx - swap the body font
import { DM_Sans } from "next/font/google"
import { Cormorant } from "next/font/google"

const dm = DM_Sans({ subsets: ["latin"], variable: "--font-body" })
const cormorant = Cormorant({ subsets: ["latin"], variable: "--font-cormorant" })

export default function RootLayout({ children }) {
  return (
    <html className={\`\${dm.variable} \${cormorant.variable}\`}>
      <body className={dm.className}>{children}</body>
    </html>
  )
}`

const localFontSnippet = `// app/layout.tsx - use a local/self-hosted font
import localFont from "next/font/local"

const myFont = localFont({
  src: [
    { path: "../public/fonts/MyFont-Regular.woff2", weight: "400" },
    { path: "../public/fonts/MyFont-Bold.woff2", weight: "700" },
  ],
  variable: "--font-heading",
})

export default function RootLayout({ children }) {
  return (
    <html className={myFont.variable}>
      <body>{children}</body>
    </html>
  )
}

// globals.css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), sans-serif;
}`

const perComponentSnippet = `{/* Override a specific heading */}
<h1 style={{ fontFamily: "var(--font-heading), sans-serif" }}>
  Uses your heading font
</h1>

{/* Or skip the global rule entirely and use inline styles */}
<p style={{ fontFamily: "var(--font-body), sans-serif" }}>
  Uses your body font
</p>

{/* Tailwind approach - register the variable in your config */}
<h1 className="font-heading text-4xl font-bold">
  Tailwind font utility
</h1>`

const tailwindFontSnippet = `// tailwind.config.ts (or @theme inline in globals.css)
@theme inline {
  --font-heading: var(--font-playfair);
  --font-body: var(--font-dm-sans);
}

// Then use in components:
<h1 className="font-heading text-4xl">Heading</h1>
<p className="font-body text-base">Body text</p>`

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

export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background p-8 pt-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground">Typography</h1>
        <p
          className="mt-1 text-muted-foreground"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Font setup, customization, and text styling for wise-ui.
        </p>

        <div className="mt-10 space-y-12">
          {/* Section 1: Defaults */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Defaults</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Out of the box, wise-ui uses two fonts. Both are optional and can be replaced.
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-2xl font-medium text-foreground">
                  Inter - body and UI
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sans-serif for paragraphs, labels, buttons, and component text.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p
                  className="text-2xl font-medium text-foreground"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Cormorant - headings
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Serif for h1-h6. Applied via a global CSS rule.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <CodeBlock title="Default setup - app/layout.tsx">{defaultSetupSnippet}</CodeBlock>
              <CodeBlock title="Default heading rule - globals.css">{defaultCssSnippet}</CodeBlock>
            </div>
          </section>

          {/* Section 2: Using your own heading font */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Use your own heading font</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Replace Cormorant with any Google Font in two steps: change the import in your layout, then update the CSS variable in globals.css.
            </p>
            <div className="mt-4">
              <CodeBlock title="Example: Playfair Display for headings">{customHeadingSnippet}</CodeBlock>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              The CSS variable name is up to you. Just make sure the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">globals.css</code>{" "}
              rule points at the same variable you defined in your layout.
            </p>
          </section>

          {/* Section 3: Using your own body font */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Use your own body font</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Swap Inter for a different sans-serif (or any font family) by changing the import and applying it to the body.
            </p>
            <div className="mt-4">
              <CodeBlock title="Example: DM Sans for body text">{customBodySnippet}</CodeBlock>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              wise-ui components inherit the body font automatically - no extra configuration needed.
            </p>
          </section>

          {/* Section 4: Local / self-hosted fonts */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Local / self-hosted fonts</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              If you have custom font files (woff2, ttf, etc.), use Next.js{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">localFont</code>{" "}
              instead of a Google Font import.
            </p>
            <div className="mt-4">
              <CodeBlock title="Self-hosted font setup">{localFontSnippet}</CodeBlock>
            </div>
          </section>

          {/* Section 5: Per-component overrides */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Per-component overrides</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You can override the font on any element using inline styles or Tailwind utilities. This is useful when you want a specific component to use a different font from the global rule.
            </p>
            <div className="mt-4 space-y-4">
              <CodeBlock title="Inline and Tailwind overrides">{perComponentSnippet}</CodeBlock>
              <CodeBlock title="Register font variables in Tailwind">{tailwindFontSnippet}</CodeBlock>
            </div>
          </section>

          {/* Section 6: Type scale preview */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Type scale</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Preview of heading sizes with the default serif font.
            </p>
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-6">
              {[
                { tag: "h1", size: "text-5xl", label: "Heading 1" },
                { tag: "h2", size: "text-4xl", label: "Heading 2" },
                { tag: "h3", size: "text-3xl", label: "Heading 3" },
                { tag: "h4", size: "text-2xl", label: "Heading 4" },
                { tag: "h5", size: "text-xl", label: "Heading 5" },
                { tag: "h6", size: "text-lg", label: "Heading 6" },
              ].map(({ tag, size, label }) => (
                <div key={tag} className="flex items-baseline gap-4">
                  <span className="w-8 shrink-0 text-xs text-muted-foreground/50">{tag}</span>
                  <p
                    className={`font-bold text-foreground ${size}`}
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
              <div className="mt-2 border-t border-border pt-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-8 shrink-0 text-xs text-muted-foreground/50">p</span>
                  <p className="text-base text-foreground">
                    Body text in Inter. Paragraphs, descriptions, and general content.
                  </p>
                </div>
                <div className="mt-3 flex items-baseline gap-4">
                  <span className="w-8 shrink-0 text-xs text-muted-foreground/50">sm</span>
                  <p className="text-sm text-muted-foreground">
                    Small text for labels, captions, and secondary information.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Gradient text */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Gradient text</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">MovingGradientText</code>{" "}
              to add animated gradient effects. Works with any font.
            </p>
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-card p-6">
              <p
                className="text-4xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                <MovingGradientText gradientFrom="#008274" gradientTo="#6c50be">
                  Gradient heading
                </MovingGradientText>
              </p>
              <p className="text-lg">
                Works{" "}
                <MovingGradientText gradientFrom="#3b82f6" gradientTo="#a855f7" className="font-semibold">
                  inline too
                </MovingGradientText>{" "}
                <span className="text-muted-foreground">within regular text.</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
