"use client"

import * as React from "react"
import { Check, Clipboard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InstallationSectionProps {
  cliCommand: string
  manualSource: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)

  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="absolute right-3 top-3 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {copied ? (
        <Check className="size-4" />
      ) : (
        <Clipboard className="size-4" />
      )}
    </button>
  )
}

export function InstallationSection({
  cliCommand,
  manualSource,
}: InstallationSectionProps) {
  return (
    <Tabs defaultValue="cli" className="gap-4">
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="cli">
        <div className="relative rounded-lg border border-border bg-card">
          <CopyButton text={cliCommand} />
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-muted-foreground">
            <code>{cliCommand}</code>
          </pre>
        </div>
      </TabsContent>
      <TabsContent value="manual">
        <div className="relative rounded-lg border border-border bg-card">
          <CopyButton text={manualSource} />
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-muted-foreground">
            <code>{manualSource}</code>
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  )
}
