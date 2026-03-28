"use client"

export function SkeletonText({ width = "w-full", height = "h-4" }: { width?: string; height?: string }) {
  return <div className={`${width} ${height} bg-muted animate-pulse rounded`} />
}

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-muted animate-pulse rounded-lg" />
      </div>
      <div className="space-y-2 mt-3">
        <div className="h-7 bg-muted animate-pulse rounded w-1/2" />
        <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-4 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-muted animate-pulse rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border px-4 py-3 flex gap-4"
          style={{ opacity: Math.max(0.3, 1 - i * 0.15) }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-muted animate-pulse rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonTray() {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <div className="h-5 bg-muted animate-pulse rounded w-1/2" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-muted/30 rounded-xl p-4 space-y-3">
          <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="flex justify-between gap-4">
              <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonKPIGrid({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-${count} gap-3`}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

export function SkeletonPage() {
  return (
    <div className="flex flex-col gap-5 p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-48" />
          <div className="h-3 bg-muted rounded w-64" />
        </div>
        <div className="h-9 bg-muted rounded w-24" />
      </div>
      <SkeletonKPIGrid count={4} />
      <SkeletonTable rows={6} cols={5} />
    </div>
  )
}
