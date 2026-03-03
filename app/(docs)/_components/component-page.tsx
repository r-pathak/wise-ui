import * as React from "react"
import { ComponentPreview } from "./component-preview"
import { InstallationSection } from "./installation-section"
import { PropsTable } from "./props-table"

interface ComponentPageProps {
  name: string
  description: string
  children: React.ReactNode
  code: string
  cliCommand: string
  manualSource: string
  props: {
    name: string
    type: string
    default: string
    description: string
  }[]
}

export function ComponentPage({
  name,
  description,
  children,
  code,
  cliCommand,
  manualSource,
  props,
}: ComponentPageProps) {
  return (
    <div className="min-h-screen bg-background p-8 pt-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground">{name}</h1>
        <p className="mt-1 text-muted-foreground" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>{description}</p>

        <div className="mt-8 space-y-10">
          <section>
            <ComponentPreview code={code}>{children}</ComponentPreview>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Installation
            </h2>
            <InstallationSection
              cliCommand={cliCommand}
              manualSource={manualSource}
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Props
            </h2>
            <PropsTable props={props} />
          </section>
        </div>
      </div>
    </div>
  )
}
