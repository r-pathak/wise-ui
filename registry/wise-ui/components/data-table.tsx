"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/registry/wise-ui/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  key: keyof T & string
  label: string
  sortable?: boolean
  resizable?: boolean
  editable?: boolean
  width?: number
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface DataTableProps<T extends { id: string | number }> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchable?: boolean
  searchKeys?: (keyof T)[]
  selectable?: boolean
  onSelectionChange?: (rows: T[]) => void
  paginated?: boolean
  pageSize?: number
  className?: string
}

type SortDir = "asc" | "desc" | null

// ── Helpers ────────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function DataTableToolbar({
  searchValue,
  onSearchChange,
  totalRows,
  filteredRows,
}: {
  searchValue: string
  onSearchChange: (v: string) => void
  totalRows: number
  filteredRows: number
}) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-64 rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>
      <span className="text-xs text-muted-foreground">
        {filteredRows === totalRows
          ? `${totalRows} rows`
          : `${filteredRows} of ${totalRows} rows`}
      </span>
    </div>
  )
}

function DataTableHeader<T extends { id: string | number }>({
  columns,
  colWidths,
  sortKey,
  sortDir,
  onSort,
  onResizeStart,
  selectable,
  allSelected,
  onToggleAll,
}: {
  columns: DataTableColumn<T>[]
  colWidths: number[]
  sortKey: string | null
  sortDir: SortDir
  onSort: (key: string) => void
  onResizeStart: (colIdx: number, startX: number) => void
  selectable?: boolean
  allSelected: boolean
  onToggleAll: () => void
}) {
  return (
    <div
      className="grid border-b border-border"
      style={{
        gridTemplateColumns: [
          ...(selectable ? ["40px"] : []),
          ...colWidths.map((w) => `${w}px`),
        ].join(" "),
      }}
    >
      {selectable && (
        <div className="flex items-center justify-center py-3">
          <RoundCheckbox checked={allSelected} onChange={onToggleAll} />
        </div>
      )}
      {columns.map((col, i) => (
        <div
          key={col.key}
          className="group relative flex select-none items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <span
            className={cn(
              col.sortable && "cursor-pointer hover:text-foreground transition-colors"
            )}
            onClick={() => col.sortable && onSort(col.key)}
          >
            {col.label}
          </span>
          {col.sortable && sortKey === col.key && sortDir && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "shrink-0 text-primary transition-transform",
                sortDir === "desc" && "rotate-180"
              )}
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          )}
          {(col.resizable !== false) && i < columns.length - 1 && (
            <div
              className="absolute right-0 top-1/2 z-10 h-4 w-1 -translate-y-1/2 cursor-col-resize rounded-full bg-border opacity-0 transition-opacity group-hover:opacity-100"
              onMouseDown={(e) => {
                e.preventDefault()
                onResizeStart(i, e.clientX)
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function DataTableBody<T extends { id: string | number }>({
  rows,
  columns,
  colWidths,
  selectable,
  selectedIds,
  onToggleRow,
  editingCell,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: {
  rows: T[]
  columns: DataTableColumn<T>[]
  colWidths: number[]
  selectable?: boolean
  selectedIds: Set<string | number>
  onToggleRow: (id: string | number) => void
  editingCell: { rowId: string | number; colKey: string } | null
  onStartEdit: (rowId: string | number, colKey: string) => void
  onSaveEdit: (rowId: string | number, colKey: string, value: string) => void
  onCancelEdit: () => void
}) {
  return (
    <AnimatePresence mode="popLayout">
      {rows.map((row) => (
        <motion.div
          key={row.id}
          layout
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "grid border-b border-border transition-colors",
            selectedIds.has(row.id) && "bg-primary/5"
          )}
          style={{
            gridTemplateColumns: [
              ...(selectable ? ["40px"] : []),
              ...colWidths.map((w) => `${w}px`),
            ].join(" "),
          }}
        >
          {selectable && (
            <div className="flex items-center justify-center py-3">
              <RoundCheckbox checked={selectedIds.has(row.id)} onChange={() => onToggleRow(row.id)} />
            </div>
          )}
          {columns.map((col) => {
            const value = row[col.key]
            const isEditing =
              editingCell?.rowId === row.id && editingCell?.colKey === col.key

            return (
              <div
                key={col.key}
                className="flex items-center px-4 py-3 text-sm text-foreground"
                onDoubleClick={() => {
                  if (col.editable) onStartEdit(row.id, col.key)
                }}
              >
                {isEditing ? (
                  <EditableCell
                    value={String(value ?? "")}
                    onSave={(v) => onSaveEdit(row.id, col.key, v)}
                    onCancel={onCancelEdit}
                  />
                ) : col.render ? (
                  col.render(value, row)
                ) : (
                  <span className="truncate">{String(value ?? "")}</span>
                )}
              </div>
            )
          })}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

function EditableCell({
  value,
  onSave,
  onCancel,
}: {
  value: string
  onSave: (v: string) => void
  onCancel: () => void
}) {
  const [editValue, setEditValue] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  return (
    <input
      ref={inputRef}
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSave(editValue)
        if (e.key === "Escape") onCancel()
      }}
      onBlur={() => onSave(editValue)}
      className="h-7 w-full rounded border border-primary/50 bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
    />
  )
}

function DataTableBatchBar({
  count,
  onClear,
}: {
  count: number
  onClear: () => void
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="mt-3 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5"
        >
          <span className="text-sm text-foreground">
            <strong>{count}</strong> row{count !== 1 && "s"} selected
          </span>
          <button
            onClick={onClear}
            className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Clear selection
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DataTablePagination({
  page,
  totalPages,
  pageSize,
  totalRows,
  onPageChange,
}: {
  page: number
  totalPages: number
  pageSize: number
  totalRows: number
  onPageChange: (p: number) => void
}) {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalRows)

  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-xs text-muted-foreground">
        Showing {start}–{end} of {totalRows}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              p === page
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}

function RoundCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:border-muted-foreground/50"
      )}
    >
      {checked && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function DataTable<T extends { id: string | number }>({
  data: initialData,
  columns,
  searchable = false,
  searchKeys,
  selectable = false,
  onSelectionChange,
  paginated = false,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  // ── Data state (for inline editing) ────────────────────────────────────────
  const [data, setData] = React.useState(initialData)
  React.useEffect(() => setData(initialData), [initialData])

  // ── Search ─────────────────────────────────────────────────────────────────
  const [searchValue, setSearchValue] = React.useState("")
  const debouncedSearch = useDebounce(searchValue, 200)

  const filteredData = React.useMemo(() => {
    if (!debouncedSearch) return data
    const keys = searchKeys ?? columns.map((c) => c.key)
    const lower = debouncedSearch.toLowerCase()
    return data.filter((row) =>
      keys.some((k) => String(row[k] ?? "").toLowerCase().includes(lower))
    )
  }, [data, debouncedSearch, searchKeys, columns])

  // ── Sort ───────────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<SortDir>(null)

  function handleSort(key: string) {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir("asc")
    } else if (sortDir === "asc") {
      setSortDir("desc")
    } else {
      setSortKey(null)
      setSortDir(null)
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir) return filteredData
    return [...filteredData].sort((a, b) => {
      const av = a[sortKey as keyof T]
      const bv = b[sortKey as keyof T]
      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
        numeric: true,
      })
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filteredData, sortKey, sortDir])

  // ── Pagination ─────────────────────────────────────────────────────────────
  const [page, setPage] = React.useState(1)
  const totalPages = paginated
    ? Math.max(1, Math.ceil(sortedData.length / pageSize))
    : 1

  // Reset page when data changes
  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch, sortKey, sortDir])

  const displayData = paginated
    ? sortedData.slice((page - 1) * pageSize, page * pageSize)
    : sortedData

  // ── Selection ──────────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(
    new Set()
  )

  function toggleRow(id: string | number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selectedIds.size === sortedData.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(sortedData.map((r) => r.id)))
    }
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  React.useEffect(() => {
    onSelectionChange?.(data.filter((r) => selectedIds.has(r.id)))
  }, [selectedIds, data, onSelectionChange])

  // ── Inline editing ─────────────────────────────────────────────────────────
  const [editingCell, setEditingCell] = React.useState<{
    rowId: string | number
    colKey: string
  } | null>(null)

  function handleSaveEdit(
    rowId: string | number,
    colKey: string,
    value: string
  ) {
    setData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [colKey]: value } : row
      )
    )
    setEditingCell(null)
  }

  // ── Column widths (resizing) ───────────────────────────────────────────────
  const [colWidths, setColWidths] = React.useState<number[]>(
    columns.map((c) => c.width ?? 160)
  )

  const resizeRef = React.useRef<{
    colIdx: number
    startX: number
    startWidth: number
  } | null>(null)

  function handleResizeStart(colIdx: number, startX: number) {
    resizeRef.current = {
      colIdx,
      startX,
      startWidth: colWidths[colIdx],
    }

    function onMouseMove(e: MouseEvent) {
      if (!resizeRef.current) return
      const diff = e.clientX - resizeRef.current.startX
      const newWidth = Math.max(60, resizeRef.current.startWidth + diff)
      setColWidths((prev) => {
        const next = [...prev]
        next[resizeRef.current!.colIdx] = newWidth
        return next
      })
    }

    function onMouseUp() {
      resizeRef.current = null
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const allSelected =
    sortedData.length > 0 && selectedIds.size === sortedData.length

  return (
    <div className={cn("w-full", className)}>
      {searchable && (
        <DataTableToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          totalRows={data.length}
          filteredRows={filteredData.length}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <DataTableHeader
          columns={columns}
          colWidths={colWidths}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onResizeStart={handleResizeStart}
          selectable={selectable}
          allSelected={allSelected}
          onToggleAll={toggleAll}
        />
        <DataTableBody
          rows={displayData}
          columns={columns}
          colWidths={colWidths}
          selectable={selectable}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          editingCell={editingCell}
          onStartEdit={(rowId, colKey) => setEditingCell({ rowId, colKey })}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={() => setEditingCell(null)}
        />
      </div>

      {selectable && (
        <DataTableBatchBar count={selectedIds.size} onClear={clearSelection} />
      )}

      {paginated && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRows={sortedData.length}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
