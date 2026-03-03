interface Prop {
  name: string
  type: string
  default: string
  description: string
}

interface PropsTableProps {
  props: Prop[]
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-medium text-muted-foreground">
              Prop
            </th>
            <th className="px-4 py-3 font-medium text-muted-foreground">
              Type
            </th>
            <th className="px-4 py-3 font-medium text-muted-foreground">
              Default
            </th>
            <th className="px-4 py-3 font-medium text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {props.map((prop) => (
            <tr key={prop.name}>
              <td className="px-4 py-3 font-mono text-sm text-violet-500 dark:text-violet-400">
                {prop.name}
              </td>
              <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-sm text-muted-foreground/70">
                {prop.default}
              </td>
              <td className="px-4 py-3 text-foreground/80">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
