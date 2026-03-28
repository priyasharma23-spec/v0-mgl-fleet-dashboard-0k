"use client"
import { ReactNode } from "react"
import { X } from "lucide-react"

interface RightTrayProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  badge?: ReactNode
  zIndex?: string
}

export function RightTray({ open, onClose, title, subtitle, children, footer, badge, zIndex = "z-50" }: RightTrayProps) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className={`fixed bottom-0 right-0 top-0 w-96 bg-card border-l border-border shadow-xl flex flex-col ${zIndex}`}>
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-foreground">{title}</h2>
              {badge}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">{children}</div>
        {footer && (
          <div className="sticky bottom-0 bg-card border-t border-border p-4 shrink-0">{footer}</div>
        )}
      </div>
    </>
  )
}

export function TraySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

export function TrayRow({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium text-foreground text-right ${mono ? "font-mono" : ""}`}>{value ?? "—"}</span>
    </div>
  )
}

export function TrayDivider() {
  return <div className="border-t border-border my-1" />
}
