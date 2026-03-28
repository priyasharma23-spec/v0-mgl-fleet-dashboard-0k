"use client"
import { ReactNode } from "react"
import { X } from "lucide-react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeMap = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }

export function Modal({ open, onClose, title, subtitle, children, footer, size = "md" }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-card rounded-2xl border border-border w-full ${sizeMap[size]} max-h-[90vh] flex flex-col shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div>
            <h2 className="font-semibold text-lg text-foreground">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="border-t border-border p-5 shrink-0">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmModal({
  open, onClose, onConfirm, title, message,
  confirmLabel = "Confirm",
  confirmVariant = "primary"
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  confirmVariant?: "primary" | "danger"
}) {
  if (!open) return null
  const btnClass = confirmVariant === "danger"
    ? "bg-red-600 hover:bg-red-700 text-white"
    : "bg-primary hover:bg-primary/90 text-primary-foreground"
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
            Cancel
          </button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${btnClass}`}>
            {confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">{message}</p>
    </Modal>
  )
}

export function StepModal({
  open, onClose, title, steps, currentStep, children, footer
}: {
  open: boolean
  onClose: () => void
  title: string
  steps: string[]
  currentStep: number
  children: ReactNode
  footer?: ReactNode
}) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} title={title} size="lg" footer={footer}>
      <div className="flex items-center gap-2 mb-6">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              i < currentStep ? "bg-green-500 text-white" :
              i === currentStep ? "bg-primary text-primary-foreground" :
              "bg-muted text-muted-foreground"
            }`}>
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${
              i === currentStep ? "text-foreground" : "text-muted-foreground"
            }`}>{step}</span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 rounded-full ${i < currentStep ? "bg-green-500" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>
      {children}
    </Modal>
  )
}
