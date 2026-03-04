"use client"

import * as React from "react"
import {
  ReorderableList,
  ReorderableListDragHandle,
} from "@/registry/wise-ui/components/reorderable-list"
import { ComponentPage } from "../../_components/component-page"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design system tokens",
    description: "Define color, spacing, and typography tokens for the component library.",
    priority: "high",
  },
  {
    id: "2",
    title: "Set up CI pipeline",
    description: "Configure GitHub Actions for automated testing and deployment.",
    priority: "medium",
  },
  {
    id: "3",
    title: "Write documentation",
    description: "Create usage guides and API references for each component.",
    priority: "low",
  },
  {
    id: "4",
    title: "Accessibility audit",
    description: "Review all components for WCAG 2.1 AA compliance.",
    priority: "high",
  },
  {
    id: "5",
    title: "Performance benchmarks",
    description: "Measure render times and bundle sizes across components.",
    priority: "medium",
  },
  {
    id: "6",
    title: "Dark mode polish",
    description: "Fine-tune contrast ratios and color mappings for dark theme.",
    priority: "low",
  },
]

const priorityColors: Record<string, string> = {
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
}

const usageCode = `import { ReorderableList } from "@/components/ui/reorderable-list"

const tasks = [
  { id: "1", title: "Design tokens", description: "Define color and spacing tokens." },
  { id: "2", title: "CI pipeline", description: "Set up automated testing." },
  { id: "3", title: "Documentation", description: "Write usage guides." },
]

export default function Example() {
  const [items, setItems] = React.useState(tasks)

  return (
    <ReorderableList
      items={items}
      onReorder={setItems}
      renderItem={(task) => (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium text-foreground">{task.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
        </div>
      )}
    />
  )
}`

const manualSource = `# Install dependencies
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities motion clsx tailwind-merge

# Add the cn utility to lib/utils.ts (skip if already set up)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# Create components/ui/reorderable-list.tsx

"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1]

interface ReorderableListProps<T extends { id: string | number }> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  itemClassName?: string
  gap?: number
  dragTarget?: "card" | "handle"
}

interface SortableItemProps {
  id: string | number
  children: React.ReactNode
  className?: string
  isDragOverlay?: boolean
  activeId: string | number | null
  dragTarget: "card" | "handle"
}

function SortableItem({
  id,
  children,
  className,
  isDragOverlay,
  activeId,
  dragTarget,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const overlayStyle: React.CSSProperties = isDragOverlay
    ? {
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        transform: "scale(1.02)",
      }
    : {}

  const dragProps = dragTarget === "card" ? { ...attributes, ...listeners } : {}

  return (
    <motion.div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={{ ...style, ...overlayStyle }}
      className={cn(
        "touch-none",
        dragTarget === "card" && "cursor-grab active:cursor-grabbing",
        isDragOverlay && "cursor-grabbing",
        isDragging && "opacity-40",
        className
      )}
      layout={!isDragOverlay}
      transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
      {...dragProps}
    >
      {dragTarget === "handle" ? (
        <ReorderableListHandleContext.Provider
          value={{ attributes, listeners }}
        >
          {children}
        </ReorderableListHandleContext.Provider>
      ) : (
        children
      )}
    </motion.div>
  )
}

// Context for drag handle
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReorderableListHandleContext = React.createContext<{
  attributes: any
  listeners: any
}>({ attributes: {}, listeners: undefined })

function ReorderableListDragHandle({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  const { attributes, listeners } = React.useContext(
    ReorderableListHandleContext
  )
  return (
    <button
      className={cn("touch-none cursor-grab active:cursor-grabbing", className)}
      {...attributes}
      {...(listeners as React.HTMLAttributes<HTMLButtonElement>)}
    >
      {children ?? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="text-muted-foreground"
        >
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      )}
    </button>
  )
}

function ReorderableList<T extends { id: string | number }>({
  items,
  onReorder,
  renderItem,
  className,
  itemClassName,
  gap = 8,
  dragTarget = "card",
}: ReorderableListProps<T>) {
  const [activeId, setActiveId] = React.useState<string | number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeItem = React.useMemo(
    () => items.find((i) => i.id === activeId),
    [items, activeId]
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string | number)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("flex flex-col", className)} style={{ gap }}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className={itemClassName}
              activeId={activeId}
              dragTarget={dragTarget}
            >
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem ? (
          <SortableItem
            id={activeItem.id}
            className={itemClassName}
            isDragOverlay
            activeId={activeId}
            dragTarget={dragTarget}
          >
            {renderItem(
              activeItem,
              items.findIndex((i) => i.id === activeId)
            )}
          </SortableItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export { ReorderableList, ReorderableListDragHandle }
export type { ReorderableListProps }
`

const reorderableListProps = [
  {
    name: "items",
    type: "T[]",
    default: "-",
    description: "Array of items to render. Each must have a unique `id` field.",
  },
  {
    name: "onReorder",
    type: "(items: T[]) => void",
    default: "-",
    description: "Callback when items are reordered via drag-and-drop.",
  },
  {
    name: "renderItem",
    type: "(item: T, index: number) => ReactNode",
    default: "-",
    description: "Render function for each sortable item.",
  },
  {
    name: "gap",
    type: "number",
    default: "8",
    description: "Gap between items in pixels.",
  },
  {
    name: "dragTarget",
    type: '"card" | "handle"',
    default: '"card"',
    description: 'Whether the entire card is draggable or only a drag handle.',
  },
  {
    name: "className",
    type: "string",
    default: "-",
    description: "Class applied to the list container.",
  },
  {
    name: "itemClassName",
    type: "string",
    default: "-",
    description: "Class applied to each sortable item wrapper.",
  },
]

function ReorderableListDemo() {
  const [tasks, setTasks] = React.useState(initialTasks)

  return (
    <div className="mx-auto w-full max-w-lg">
      <ReorderableList
        items={tasks}
        onReorder={setTasks}
        gap={10}
        dragTarget="handle"
        renderItem={(task) => (
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors">
            <ReorderableListDragHandle className="mt-0.5 shrink-0 text-muted-foreground/50 hover:text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-foreground">{task.title}</h3>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {task.description}
              </p>
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default function ReorderableListPage() {
  return (
    <ComponentPage
      name="Reorderable List"
      description="Drag-and-drop sortable list with smooth layout animations. Supports full-card or handle-based dragging."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/reorderable-list.json"
      manualSource={manualSource}
      props={reorderableListProps}
    >
      <ReorderableListDemo />
    </ComponentPage>
  )
}
