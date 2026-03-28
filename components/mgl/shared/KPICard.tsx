"use client"
import type { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

export type KPIVariant = "default" | "value" | "count" | "split" | "alert"

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
  variant?: KPIVariant
  trend?: { value: number; label?: string }
  accent?: string
}

export function KPICard({
  label, value, icon: Icon,
  iconBg = "bg-gray-100", iconColor = "text-gray-600",
  subtitle, subtitleColor = "text-muted-foreground",
  breakdown, topRight, onClick,
  variant = "default",
  trend, accent
}: KPICardProps) {

  // VALUE variant — large currency/amount display, icon top-right
  if (variant === "value") {
    return (
      <div onClick={onClick} className={`bg-card rounded-xl border border-border p-4 ${accent ? `border-l-4 ${accent}` : ""} ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}>
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className={`text-xs mt-1 font-medium ${subtitleColor}`}>{subtitle}</p>}
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trend.value >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label ?? ""}
          </p>
        )}
      </div>
    )
  }

  // COUNT variant — large number, label below, icon background fills
  if (variant === "count") {
    return (
      <div onClick={onClick} className={`bg-card rounded-xl border border-border p-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
        {subtitle && <p className={`text-xs mt-0.5 font-medium ${subtitleColor}`}>{subtitle}</p>}
      </div>
    )
  }

  // SPLIT variant — icon top, value + label, then 2-col breakdown
  if (variant === "split") {
    return (
      <div onClick={onClick} className={`bg-card rounded-xl border border-border p-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}>
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          {topRight && <span className="text-xs text-muted-foreground">{topRight}</span>}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
        {breakdown && breakdown.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border">
            {breakdown.map((b, i) => (
              <div key={i}>
                <p className="text-xs text-muted-foreground">{b.label}</p>
                <p className={`text-sm font-bold ${b.color ?? "text-foreground"}`}>{b.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ALERT variant — colored background card for warnings
  if (variant === "alert") {
    return (
      <div onClick={onClick} className={`rounded-xl border p-4 ${iconBg.replace("bg-", "bg-").replace("100", "50")} border-current ${onClick ? "cursor-pointer" : ""}`}>
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <p className={`text-xs font-medium ${iconColor}`}>{label}</p>
        </div>
        <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
        {subtitle && <p className={`text-xs mt-1 ${iconColor} opacity-80`}>{subtitle}</p>}
      </div>
    )
  }

  // DEFAULT variant — icon top-left, value below
  return (
    <div onClick={onClick} className={`bg-card rounded-xl border border-border p-4 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}>
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
          <div className="grid grid-cols-2 gap-2 mt-2">
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
