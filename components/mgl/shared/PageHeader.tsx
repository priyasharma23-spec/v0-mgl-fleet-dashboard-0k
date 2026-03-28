"use client"
import { ReactNode } from "react"
import { Download } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

export function ExportButton({ onClick, label = "Export" }: { onClick?: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  )
}

export function PrimaryButton({ onClick, label, icon: Icon }: { onClick?: () => void; label: string; icon?: React.ElementType }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  )
}
