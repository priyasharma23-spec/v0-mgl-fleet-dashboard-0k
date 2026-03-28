"use client"
import { ReactNode } from "react"

interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  width?: string
  align?: "left" | "center" | "right"
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptySubtitle?: string
  loading?: boolean
  keyField?: string
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}

export function DataTable<T extends Record<string, any>>({
  columns, data, onRowClick,
  emptyTitle = "No records found",
  emptySubtitle = "Try adjusting your search or filters.",
  loading = false,
  keyField = "id"
}: DataTableProps<T>) {
  const alignClass = (align?: string) =>
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold text-foreground ${alignClass(col.align)} ${col.width ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} cols={columns.length} />
                ))
              : data.length === 0
              ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
                    <p className="text-xs text-muted-foreground mt-1">{emptySubtitle}</p>
                  </td>
                </tr>
              )
              : data.map((row, i) => (
                <tr
                  key={row[keyField] ?? i}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-muted/30 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map(col => (
                    <td key={col.key} className={`px-4 py-3 ${alignClass(col.align)}`}>
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
