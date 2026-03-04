"use client"

import * as React from "react"
import {
  DataTable,
  type DataTableColumn,
} from "@/registry/wise-ui/components/data-table"
import { ComponentPage } from "../../_components/component-page"

// ── Demo data ──────────────────────────────────────────────────────────────────

interface Employee {
  id: number
  name: string
  role: string
  department: string
  status: "Active" | "On Leave" | "Remote"
  startDate: string
}

const employees: Employee[] = [
  { id: 1, name: "Ava Chen", role: "Staff Engineer", department: "Engineering", status: "Active", startDate: "2019-03-14" },
  { id: 2, name: "Marcus Johnson", role: "Product Designer", department: "Design", status: "Remote", startDate: "2020-07-22" },
  { id: 3, name: "Priya Sharma", role: "Engineering Manager", department: "Engineering", status: "Active", startDate: "2018-01-10" },
  { id: 4, name: "James Walker", role: "Data Scientist", department: "Analytics", status: "On Leave", startDate: "2021-11-05" },
  { id: 5, name: "Sofia Rodriguez", role: "Frontend Developer", department: "Engineering", status: "Active", startDate: "2022-02-28" },
  { id: 6, name: "Liam O'Brien", role: "DevOps Engineer", department: "Infrastructure", status: "Remote", startDate: "2020-09-15" },
  { id: 7, name: "Yuki Tanaka", role: "UX Researcher", department: "Design", status: "Active", startDate: "2021-06-01" },
  { id: 8, name: "Elena Popov", role: "Backend Developer", department: "Engineering", status: "Active", startDate: "2023-01-09" },
  { id: 9, name: "Noah Kim", role: "Product Manager", department: "Product", status: "Remote", startDate: "2019-08-20" },
  { id: 10, name: "Zara Ahmed", role: "QA Engineer", department: "Engineering", status: "Active", startDate: "2022-05-17" },
]

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "On Leave": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Remote: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
}

const columns: DataTableColumn<Employee>[] = [
  { key: "name", label: "Name", sortable: true, editable: true, width: 180 },
  { key: "role", label: "Role", sortable: true, editable: true, width: 180 },
  { key: "department", label: "Department", sortable: true, width: 140 },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: 120,
    render: (value) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
          statusColors[String(value)] ?? ""
        }`}
      >
        {String(value)}
      </span>
    ),
  },
  { key: "startDate", label: "Start Date", sortable: true, width: 130 },
]

// ── Code strings ───────────────────────────────────────────────────────────────

const usageCode = `import { DataTable, type DataTableColumn } from "@/components/ui/data-table"

interface Employee {
  id: number
  name: string
  role: string
  department: string
  status: "Active" | "On Leave" | "Remote"
  startDate: string
}

const employees: Employee[] = [
  { id: 1, name: "Ava Chen", role: "Staff Engineer", department: "Engineering", status: "Active", startDate: "2019-03-14" },
  { id: 2, name: "Marcus Johnson", role: "Product Designer", department: "Design", status: "Remote", startDate: "2020-07-22" },
  // ...
]

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "On Leave": "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Remote: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
}

const columns: DataTableColumn<Employee>[] = [
  { key: "name", label: "Name", sortable: true, editable: true, width: 180 },
  { key: "role", label: "Role", sortable: true, editable: true, width: 180 },
  { key: "department", label: "Department", sortable: true, width: 140 },
  {
    key: "status",
    label: "Status",
    sortable: true,
    width: 120,
    render: (value) => (
      <span className={\`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium \${statusColors[String(value)] ?? ""}\`}>
        {String(value)}
      </span>
    ),
  },
  { key: "startDate", label: "Start Date", sortable: true, width: 130 },
]

export default function DataTableDemo() {
  return (
    <DataTable
      data={employees}
      columns={columns}
      searchable
      searchKeys={["name", "role", "department", "status"]}
      selectable
      paginated
    />
  )
}`

const manualSource = `# Install dependencies
npm install motion clsx tailwind-merge

# Add the cn utility to lib/utils.ts (skip if already set up)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# Create components/ui/data-table.tsx
# Copy the full component source from the component page.`

const dataTableProps = [
  { name: "data", type: "T[]", default: "-", description: "Array of row objects. Each must have an `id` field (string | number)." },
  { name: "columns", type: "DataTableColumn<T>[]", default: "-", description: "Column definitions with key, label, and optional features." },
  { name: "searchable", type: "boolean", default: "false", description: "Show the search toolbar for filtering rows." },
  { name: "searchKeys", type: "(keyof T)[]", default: "all columns", description: "Which fields to search across." },
  { name: "selectable", type: "boolean", default: "false", description: "Enable row selection with checkboxes." },
  { name: "onSelectionChange", type: "(rows: T[]) => void", default: "-", description: "Callback fired when selection changes." },
  { name: "paginated", type: "boolean", default: "false", description: "Enable pagination controls." },
  { name: "pageSize", type: "number", default: "10", description: "Rows per page when paginated." },
  { name: "className", type: "string", default: "-", description: "Additional CSS classes on the wrapper." },
]

// ── Demo component ─────────────────────────────────────────────────────────────

function DataTableDemo() {
  return (
    <DataTable
      data={employees}
      columns={columns}
      searchable
      searchKeys={["name", "role", "department", "status"]}
      selectable
      paginated
    />
  )
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default function DataTablePage() {
  return (
    <ComponentPage
      name="Data Table"
      description="A fully-featured, animated data table with sorting, search, selection, inline editing, column resizing, and pagination."
      code={usageCode}
      cliCommand="npx shadcn@latest add https://wise-ui.com/r/data-table.json"
      manualSource={manualSource}
      props={dataTableProps}
    >
      <DataTableDemo />
    </ComponentPage>
  )
}
