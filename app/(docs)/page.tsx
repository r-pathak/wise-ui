export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-4" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          wise-ui
        </h1>
        <p className="text-lg text-center text-muted-foreground">
          Animated components for React. <br/> Built with shadcn/ui.
        </p>
      </div>
    </div>
  )
}
