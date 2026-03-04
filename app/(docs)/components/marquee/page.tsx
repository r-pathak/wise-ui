"use client"

import * as React from "react"
import { Marquee } from "@/registry/wise-ui/components/marquee"
import { SpotlightCard } from "@/registry/wise-ui/components/spotlight-card"
import { ComponentPage } from "../../_components/component-page"

const testimonials = [
  {
    name: "Freddie Gibbs",
    song: "1995",
    quote: "Nothing in your catalogue classic, you shaqting like Thanasis. Godfather Kane, I turned these sons to b******s.",
  },
  {
    name: "Skepta",
    song: "Pure Water",
    quote: "I just came back from Mars in my new spaceship, it was a perfect landing. I'm a king she's a queen, man you know what's happening.",
  },
  {
    name: "YT",
    song: "2Real",
    quote: "Five hunnid, I just spent it on a meal. I could take your girl, but Bible told me not to steal.",
  },
  {
    name: "Headie One",
    song: "Both",
    quote: "T house up north or near the coast, rudeboy, there's both. Spend this bread on jewels or spend it on smoke, man spend it on both.",
  },
  {
    name: "Freddie Gibbs",
    song: "1995",
    quote: "Man, this s*** crazy how a n**** done went from nick rocks to wet whip. Gen Pop to Netflix.",
  },
  {
    name: "YT",
    song: "2Real",
    quote: "I be liftin' others up cause I'm a real n****. Spreadin' love, I don't hate, I'm a real n****.",
  },
  {
    name: "Skepta",
    song: "Pure Water",
    quote: "N****s sleepin' on me must be sippin' on the lean. She knows I be the boss of life, still Roll Deep.",
  },
  {
    name: "Headie One",
    song: "Both",
    quote: "Now they say that I'm the king of drill, trap, rap, I'm doing it all. Everywhere and everywhere, the gang's smokey, let the gangdem bring it on tour.",
  },
]

const topRow = testimonials.slice(0, 4)
const bottomRow = testimonials.slice(4)

const usageCode = `import { Marquee } from "@/components/ui/marquee"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const testimonials = [
  { name: "Freddie Gibbs", song: "1995", quote: "Nothing in your catalogue classic, you shaqting like Thanasis. Godfather Kane, I turned these sons to b******s." },
  { name: "Skepta", song: "Pure Water", quote: "I just came back from Mars in my new spaceship, it was a perfect landing. I'm a king she's a queen, man you know what's happening." },
  { name: "YT", song: "2Real", quote: "Five hunnid, I just spent it on a meal. I could take your girl, but Bible told me not to steal." },
  { name: "Headie One", song: "Both", quote: "T house up north or near the coast, rudeboy, there's both. Spend this bread on jewels or spend it on smoke, man spend it on both." },
  { name: "Freddie Gibbs", song: "1995", quote: "Man, this s*** crazy how a n**** done went from nick rocks to wet whip. Gen Pop to Netflix." },
  { name: "YT", song: "2Real", quote: "I be liftin' others up cause I'm a real n****. Spreadin' love, I don't hate, I'm a real n****." },
  { name: "Skepta", song: "Pure Water", quote: "N****s sleepin' on me must be sippin' on the lean. She knows I be the boss of life, still Roll Deep." },
  { name: "Headie One", song: "Both", quote: "Now they say that I'm the king of drill, trap, rap, I'm doing it all. Everywhere and everywhere, the gang's smokey, let the gangdem bring it on tour." },
]

const topRow = testimonials.slice(0, 4)
const bottomRow = testimonials.slice(4)

function TestimonialCard({ name, song, quote }) {
  return (
    <SpotlightCard className="mx-3 w-80 shrink-0 p-5">
      <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      <div className="mt-4">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{song}</p>
      </div>
    </SpotlightCard>
  )
}

export default function MarqueeDemo() {
  return (
    <div className="space-y-4">
      <Marquee speed={30} pauseOnHover>
        {topRow.map((t, i) => (
          <TestimonialCard key={\`\${t.name}-\${t.song}-\${i}\`} {...t} />
        ))}
      </Marquee>

      <Marquee speed={25} direction="right" pauseOnHover>
        {bottomRow.map((t, i) => (
          <TestimonialCard key={\`\${t.name}-\${t.song}-\${i}\`} {...t} />
        ))}
      </Marquee>
    </div>
  )
}`

const manualSource = `# Install dependencies
npm install clsx tailwind-merge

# Add the cn utility to lib/utils.ts (skip if already set up)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# Create components/ui/marquee.tsx

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
  children: React.ReactNode
  className?: string
}

function Marquee({
  speed = 40,
  direction = "left",
  pauseOnHover = false,
  children,
  className,
}: MarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = React.useState(0)
  const scopedId = React.useId().replace(/:/g, "")
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const first = el.firstElementChild as HTMLElement | null
      if (first) setContentWidth(first.scrollWidth)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])

  const duration = contentWidth > 0 ? contentWidth / speed : 0
  const keyframeName = \`marquee-\${scopedId}\`
  const from = direction === "left" ? "0%" : "-50%"
  const to = direction === "left" ? "-50%" : "0%"

  return (
    <div className={cn("overflow-hidden", className)}>
      <style>{\`
        @keyframes \${keyframeName} {
          from { transform: translateX(\${from}); }
          to { transform: translateX(\${to}); }
        }
      \`}</style>
      <div
        ref={containerRef}
        className="flex w-max"
        style={{
          animationName: keyframeName,
          animationDuration: \`\${duration}s\`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
        onMouseEnter={() => pauseOnHover && setPaused(true)}
        onMouseLeave={() => pauseOnHover && setPaused(false)}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>{children}</div>
      </div>
    </div>
  )
}
Marquee.displayName = "Marquee"

export { Marquee }
export type { MarqueeProps }`

const marqueeProps = [
  {
    name: "speed",
    type: "number",
    default: "40",
    description: "Scroll speed in pixels per second.",
  },
  {
    name: "direction",
    type: '"left" | "right"',
    default: '"left"',
    description: "Scroll direction.",
  },
  {
    name: "pauseOnHover",
    type: "boolean",
    default: "false",
    description: "Pause the animation when hovered.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "-",
    description: "Content to scroll. Duplicated internally for seamless looping.",
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Additional classes for the outer container.",
  },
]

function TestimonialCard({ name, song, quote }: { name: string; song: string; quote: string }) {
  return (
    <SpotlightCard className="mx-3 w-80 shrink-0 p-5">
      <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      <div className="mt-4">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{song}</p>
      </div>
    </SpotlightCard>
  )
}

function MarqueeDemo() {
  return (
    <div className="space-y-4">
      <Marquee speed={30} pauseOnHover>
        {topRow.map((t, i) => (
          <TestimonialCard key={`${t.name}-${t.song}-${i}`} {...t} />
        ))}
      </Marquee>

      <Marquee speed={25} direction="right" pauseOnHover>
        {bottomRow.map((t, i) => (
          <TestimonialCard key={`${t.name}-${t.song}-${i}`} {...t} />
        ))}
      </Marquee>
    </div>
  )
}

export default function MarqueePage() {
  return (
    <ComponentPage
      name="Testimonial Marquee"
      description="Infinite horizontal scrolling testimonial cards with seamless looping."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/marquee.json"
      manualSource={manualSource}
      props={marqueeProps}
    >
      <MarqueeDemo />
    </ComponentPage>
  )
}
