"use client"

import * as React from "react"
import { Check, Clipboard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ComponentPreviewProps {
  children: React.ReactNode
  code: string
}

export function ComponentPreview({ children, code }: ComponentPreviewProps) {
  const [copied, setCopied] = React.useState(false)

  function copyCode() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tabs defaultValue="preview" className="gap-4">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="rounded-lg border border-border bg-card p-8">
          {children}
        </div>
      </TabsContent>
      <TabsContent value="code">
        <div className="relative rounded-lg border border-border bg-card">
          <button
            onClick={copyCode}
            className="absolute right-3 top-3 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Clipboard className="size-4" />
            )}
          </button>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-muted-foreground">
            <code>{code}</code>
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  )
}
