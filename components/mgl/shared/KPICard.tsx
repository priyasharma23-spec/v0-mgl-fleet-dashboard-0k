"use client"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
  subtitle?: string
  subtitleColor?: string
  breakdown?: { label: string; value: string | number; color?: string }[]
  topRight?: string
  onClick?: () => void
}

export function KPICard({
  label, value, icon: Icon,
  iconBg = "bg-gray-100", iconColor = "text-gray-600",
  subtitle, subtitleColor = "text-muted-foreground",
  breakdown, topRight, onClick
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-xl border border-border p-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {topRight && <span className="text-xs text-muted-foreground">{topRight}</span>}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        {subtitle && <p className={`text-xs mt-1 font-medium ${subtitleColor}`}>{subtitle}</p>}
        {breakdown && breakdown.length > 0 && (
          <div className={`grid grid-cols-${Math.min(breakdown.length, 4)} gap-2 mt-2`}>
            {breakdown.map((b, i) => (
              <div key={i}>
                <p className="text-xs text-muted-foreground">{b.label}</p>
                <p className={`text-sm font-bold ${b.color ?? "text-foreground"}`}>{b.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
