"use client"

import * as React from "react"
import { IconSparkles, IconArrowRight, IconRocket } from "@tabler/icons-react"
import { MovingGradientButton } from "@/registry/wise-ui/components/moving-gradient-button"
import { ComponentPage } from "../../_components/component-page"

const usageCode = `import { MovingGradientButton } from "@/components/ui/moving-gradient-button"
import { IconSparkles, IconArrowRight, IconRocket } from "@tabler/icons-react"

export default function Example() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <MovingGradientButton>Hover me</MovingGradientButton>

      <MovingGradientButton
        startIcon={<IconSparkles size={16} />}
        endIcon={<IconArrowRight size={16} />}
      >
        Get Started
      </MovingGradientButton>

      <MovingGradientButton
        gradientFrom="#f97316"
        gradientTo="#ef4444"
        startIcon={<IconRocket size={16} />}
      >
        Launch
      </MovingGradientButton>

      <MovingGradientButton animateText={false}>
        Border only
      </MovingGradientButton>

      <MovingGradientButton animateBorder={false}>
        Text only
      </MovingGradientButton>
    </div>
  )
}`

const manualSource = `"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { cn } from "@/lib/utils"

interface MovingGradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  animateBorder?: boolean
  animateText?: boolean
  gradientFrom?: string
  gradientTo?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  children: React.ReactNode
}

const MovingGradientButton = React.forwardRef<
  HTMLButtonElement,
  MovingGradientButtonProps
>(
  (
    {
      animateBorder = true,
      animateText = true,
      gradientFrom = "#00a896",
      gradientTo = "#c084fc",
      startIcon,
      endIcon,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const rotation = useMotionValue(0)
    const controlRef = React.useRef<ReturnType<typeof animate> | null>(null)

    React.useEffect(() => {
      if (isHovered && (animateBorder || animateText) && !disabled) {
        controlRef.current = animate(rotation, rotation.get() + 360 * 10000, {
          duration: 3 * 10000,
          ease: "linear",
        })
      } else {
        controlRef.current?.stop()
      }
      return () => { controlRef.current?.stop() }
    }, [isHovered, animateBorder, animateText, disabled, rotation])

    const backgroundPosition = useTransform(rotation, (v) => \`\${-(v * 100) / 360}% 0%\`)

    const showBorderAnimation = isHovered && animateBorder && !disabled
    const showTextAnimation = isHovered && animateText && !disabled

    return (
      <div
        className={cn(
          "group relative inline-flex rounded-md",
          disabled && "pointer-events-none opacity-50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-md border border-border transition-opacity duration-300"
          style={{ opacity: showBorderAnimation ? 0 : 1 }}
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-md transition-opacity duration-300"
          style={{ opacity: showBorderAnimation ? 1 : 0 }}
        >
          <motion.div
            style={{
              position: "absolute",
              width: "200%",
              aspectRatio: "1",
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
              background: \`conic-gradient(from 0deg, \${gradientFrom}, \${gradientTo}, \${gradientFrom})\`,
              rotate: rotation,
            }}
          />
        </div>
        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            "relative z-10 m-[1.5px] inline-flex cursor-pointer items-center gap-2 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors",
            "rounded-[calc(var(--radius-md)-1.5px)]",
            "disabled:cursor-not-allowed",
            className
          )}
          {...props}
        >
          {startIcon && (
            <span
              className="inline-flex shrink-0 transition-colors duration-300"
              style={{ color: showBorderAnimation || (isHovered && !disabled) ? gradientFrom : undefined }}
            >
              {startIcon}
            </span>
          )}
          {showTextAnimation ? (
            <motion.span
              style={{
                backgroundImage: \`linear-gradient(90deg, \${gradientFrom}, \${gradientTo}, \${gradientFrom})\`,
                backgroundSize: "200% 100%",
                backgroundRepeat: "repeat",
                backgroundPosition,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {children}
            </motion.span>
          ) : (
            <span>{children}</span>
          )}
          {endIcon && (
            <span
              className="inline-flex shrink-0 transition-colors duration-300"
              style={{ color: showBorderAnimation || (isHovered && !disabled) ? gradientTo : undefined }}
            >
              {endIcon}
            </span>
          )}
        </button>
      </div>
    )
  }
)
MovingGradientButton.displayName = "MovingGradientButton"

export { MovingGradientButton }
export type { MovingGradientButtonProps }`

const movingGradientButtonProps = [
  {
    name: "animateBorder",
    type: "boolean",
    default: "true",
    description: "Enable the spinning conic-gradient border on hover.",
  },
  {
    name: "animateText",
    type: "boolean",
    default: "true",
    description: "Enable the flowing gradient text on hover.",
  },
  {
    name: "gradientFrom",
    type: "string",
    default: '"#00a896"',
    description: "Starting color of the gradient.",
  },
  {
    name: "gradientTo",
    type: "string",
    default: '"#c084fc"',
    description: "Ending color of the gradient.",
  },
  {
    name: "startIcon",
    type: "React.ReactNode",
    default: "—",
    description: "Icon rendered before the label. Transitions to gradientFrom color on hover.",
  },
  {
    name: "endIcon",
    type: "React.ReactNode",
    default: "—",
    description: "Icon rendered after the label. Transitions to gradientTo color on hover.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    default: "—",
    description: "Button label content.",
  },
]

function MovingGradientButtonDemo() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <MovingGradientButton>Hover me</MovingGradientButton>

      <MovingGradientButton
        startIcon={<IconSparkles size={16} />}
        endIcon={<IconArrowRight size={16} />}
      >
        Get Started
      </MovingGradientButton>

      <MovingGradientButton
        gradientFrom="#f97316"
        gradientTo="#ef4444"
        startIcon={<IconRocket size={16} />}
      >
        Launch
      </MovingGradientButton>

      <MovingGradientButton animateText={false}>
        Border only
      </MovingGradientButton>

      <MovingGradientButton animateBorder={false}>
        Text only
      </MovingGradientButton>
    </div>
  )
}

export default function MovingGradientButtonPage() {
  return (
    <ComponentPage
      name="Moving Gradient Button"
      description="A button that reveals a spinning gradient border and flowing gradient text on hover."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/moving-gradient-button.json"
      manualSource={manualSource}
      props={movingGradientButtonProps}
    >
      <MovingGradientButtonDemo />
    </ComponentPage>
  )
}
