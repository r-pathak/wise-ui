"use client"

import * as React from "react"
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1]

// ── Types ────────────────────────────────────────────────────────────

interface KanbanTag {
  id: string
  label: string
  color?: string
}

interface KanbanColumn<T extends { id: string | number }> {
  id: string
  title: string
  items: T[]
}

interface KanbanBoardProps<T extends { id: string | number }> {
  columns: KanbanColumn<T>[]
  onColumnsChange: (columns: KanbanColumn<T>[]) => void
  renderItem: (item: T, columnId: string) => React.ReactNode
  onAddItem?: (columnId: string, title: string, tagId?: string) => void
  tags?: KanbanTag[]
  /** Extract the tag id from an item - used for tag filtering */
  getItemTagId?: (item: T) => string | undefined
  collapsible?: boolean
  className?: string
  columnClassName?: string
  minColumnWidth?: number
  collapsedColumnWidth?: number
}

// ── Sortable Item ────────────────────────────────────────────────────

function KanbanSortableItem({
  id,
  children,
  isDragOverlay,
}: {
  id: string | number
  children: React.ReactNode
  isDragOverlay?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({ id })

  if (isDragOverlay) {
    return (
      <motion.div
        className="touch-none cursor-grabbing"
        initial={{ scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        animate={{
          scale: 1.03,
          boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
      >
        {children}
      </motion.div>
    )
  }

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging
      ? "opacity 200ms ease"
      : "transform 250ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  )
}

// ── Add Item Form ────────────────────────────────────────────────────

function AddItemForm({
  tags,
  onSubmit,
  onCancel,
}: {
  tags?: KanbanTag[]
  onSubmit: (title: string, tagId?: string) => void
  onCancel: () => void
}) {
  const [title, setTitle] = React.useState("")
  const [selectedTag, setSelectedTag] = React.useState<string | undefined>()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onSubmit(trimmed, selectedTag)
    setTitle("")
    setSelectedTag(undefined)
    inputRef.current?.focus()
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
      className="overflow-hidden px-3 pb-3"
      onSubmit={handleSubmit}
    >
      <div className="rounded-lg border border-border bg-card p-2.5">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title…"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel()
          }}
        />

        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() =>
                  setSelectedTag((s) => (s === tag.id ? undefined : tag.id))
                }
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 ease-out",
                  tag.color,
                  selectedTag === tag.id
                    ? "ring-1 ring-foreground/30 scale-110 opacity-100"
                    : "opacity-40 hover:opacity-70 hover:scale-105"
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-2 flex items-center gap-1.5">
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-md bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-foreground/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.form>
  )
}

// ── Droppable Column ─────────────────────────────────────────────────

function KanbanColumnContainer<T extends { id: string | number }>({
  column,
  renderItem,
  onAddItem,
  tags,
  collapsible,
  columnClassName,
  minColumnWidth,
  collapsedColumnWidth,
}: {
  column: KanbanColumn<T>
  renderItem: (item: T, columnId: string) => React.ReactNode
  onAddItem?: (columnId: string, title: string, tagId?: string) => void
  tags?: KanbanTag[]
  collapsible: boolean
  columnClassName?: string
  minColumnWidth: number
  collapsedColumnWidth: number
}) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [addingItem, setAddingItem] = React.useState(false)

  const { setNodeRef } = useSortable({
    id: column.id,
    data: { type: "column" },
    disabled: true,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-xl border border-border bg-muted/30 overflow-hidden",
        collapsed ? "shrink-0" : "flex-1 basis-0",
        columnClassName
      )}
      style={{
        width: collapsed ? collapsedColumnWidth : undefined,
        minWidth: collapsed ? collapsedColumnWidth : minColumnWidth,
        transition: "width 400ms cubic-bezier(0.25, 1, 0.5, 1), min-width 400ms cubic-bezier(0.25, 1, 0.5, 1), flex 400ms cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      {collapsed ? (
        /* ── Collapsed state: rotated title + count + eye icon ── */
        <button
          onClick={() => setCollapsed(false)}
          className="flex h-full w-full flex-col items-center gap-3 py-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          {/* Eye icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>

          {/* Count badge */}
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-medium">
            {column.items.length}
          </span>

          {/* Rotated title */}
          <span
            className="text-sm font-semibold whitespace-nowrap"
            style={{
              writingMode: "vertical-lr",
              transform: "rotate(180deg)",
            }}
          >
            {column.title}
          </span>
        </button>
      ) : (
        /* ── Expanded state ── */
        <>
          {/* Column header */}
          <div className="flex items-center gap-2 px-3 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              {column.title}
            </h3>
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
              {column.items.length}
            </span>
            {collapsible && (
              <button
                onClick={() => setCollapsed(true)}
                className="ml-auto flex size-5 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:text-foreground"
                aria-label={`Collapse ${column.title}`}
              >
                {/* Eye-off icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            )}
          </div>

          {/* Column items */}
          <SortableContext
            items={column.items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex min-h-[40px] flex-1 flex-col gap-2 px-3 pb-2">
              {column.items.map((item) => (
                <KanbanSortableItem key={item.id} id={item.id}>
                  {renderItem(item, column.id)}
                </KanbanSortableItem>
              ))}
            </div>
          </SortableContext>

          {/* Add item(s) */}
          {onAddItem && (
            <AnimatePresence initial={false} mode="wait">
              {addingItem ? (
                <AddItemForm
                  key="form"
                  tags={tags}
                  onSubmit={(title, tagId) =>
                    onAddItem(column.id, title, tagId)
                  }
                  onCancel={() => setAddingItem(false)}
                />
              ) : (
                <motion.div
                  key="button"
                  className="px-3 pb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
                >
                  <button
                    onClick={() => setAddingItem(true)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <line x1="7" y1="2" x2="7" y2="12" />
                      <line x1="2" y1="7" x2="12" y2="7" />
                    </svg>
                    Add item(s)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  )
}

// ── Main KanbanBoard ─────────────────────────────────────────────────

function KanbanBoard<T extends { id: string | number }>({
  columns,
  onColumnsChange,
  renderItem,
  onAddItem,
  tags,
  getItemTagId,
  collapsible = true,
  className,
  columnClassName,
  minColumnWidth = 200,
  collapsedColumnWidth = 44,
}: KanbanBoardProps<T>) {
  const [activeId, setActiveId] = React.useState<string | number | null>(null)
  const [activeTagFilter, setActiveTagFilter] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter columns by active tag
  const displayColumns = React.useMemo(() => {
    if (!activeTagFilter || !getItemTagId) return columns
    return columns.map((col) => ({
      ...col,
      items: col.items.filter(
        (item) => getItemTagId(item) === activeTagFilter
      ),
    }))
  }, [columns, activeTagFilter, getItemTagId])

  function findColumnOfItem(itemId: string | number): string | undefined {
    // Always search in the unfiltered columns for DnD
    return columns.find((col) => col.items.some((i) => i.id === itemId))?.id
  }

  const activeItem = React.useMemo(() => {
    if (!activeId) return null
    for (const col of columns) {
      const item = col.items.find((i) => i.id === activeId)
      if (item) return { item, columnId: col.id }
    }
    return null
  }, [columns, activeId])

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string | number)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeColId = findColumnOfItem(active.id as string | number)
    let overColId = findColumnOfItem(over.id as string | number)
    if (!overColId && columns.some((c) => c.id === over.id)) {
      overColId = over.id as string
    }
    if (!activeColId || !overColId || activeColId === overColId) return

    const newColumns = columns.map((col) => ({
      ...col,
      items: [...col.items],
    }))

    const sourceCol = newColumns.find((c) => c.id === activeColId)!
    const destCol = newColumns.find((c) => c.id === overColId)!

    const activeIndex = sourceCol.items.findIndex((i) => i.id === active.id)
    const [movedItem] = sourceCol.items.splice(activeIndex, 1)

    const overIndex = destCol.items.findIndex((i) => i.id === over.id)
    if (overIndex >= 0) {
      destCol.items.splice(overIndex, 0, movedItem)
    } else {
      destCol.items.push(movedItem)
    }

    onColumnsChange(newColumns)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    const activeColId = findColumnOfItem(active.id as string | number)
    const overColId = findColumnOfItem(over.id as string | number)

    if (activeColId && overColId && activeColId === overColId) {
      const newColumns = columns.map((col) => {
        if (col.id !== activeColId) return col
        const oldIndex = col.items.findIndex((i) => i.id === active.id)
        const newIndex = col.items.findIndex((i) => i.id === over.id)
        return { ...col, items: arrayMove(col.items, oldIndex, newIndex) }
      })
      onColumnsChange(newColumns)
    }
  }

  const allItemIds = displayColumns.flatMap((col) => col.items.map((i) => i.id))

  return (
    <div className="flex h-full flex-col">
      {/* Tag filter bar */}
      {tags && tags.length > 0 && getItemTagId && (
        <div className="flex items-center gap-1.5 px-1 pb-2">
          <button
            onClick={() => setActiveTagFilter(null)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 ease-out",
              activeTagFilter === null
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground/60 hover:text-muted-foreground"
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() =>
                setActiveTagFilter((f) => (f === tag.id ? null : tag.id))
              }
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ease-out",
                tag.color,
                activeTagFilter === tag.id
                  ? "opacity-100 ring-1 ring-foreground/20"
                  : "opacity-40 hover:opacity-70"
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={[...allItemIds, ...displayColumns.map((c) => c.id)]}>
          <div className={cn("flex flex-1 gap-3 p-1", className)}>
            {displayColumns.map((column) => (
              <KanbanColumnContainer
                key={column.id}
                column={column}
                renderItem={renderItem}
                onAddItem={activeTagFilter ? undefined : onAddItem}
                tags={tags}
                collapsible={collapsible}
                columnClassName={columnClassName}
                minColumnWidth={minColumnWidth}
                collapsedColumnWidth={collapsedColumnWidth}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <KanbanSortableItem id={activeItem.item.id} isDragOverlay>
              {renderItem(activeItem.item, activeItem.columnId)}
            </KanbanSortableItem>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export { KanbanBoard }
export type { KanbanBoardProps, KanbanColumn, KanbanTag }
