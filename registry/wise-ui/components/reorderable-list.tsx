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
