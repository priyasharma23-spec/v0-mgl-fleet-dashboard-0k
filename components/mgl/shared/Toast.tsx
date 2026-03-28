"use client"
import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toast: (t: Omit<Toast, "id">) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}

const styleMap = {
  success: { bg: "bg-green-50 border-green-200", icon: "text-green-600", title: "text-green-900" },
  error:   { bg: "bg-red-50 border-red-200",     icon: "text-red-600",   title: "text-red-900" },
  warning: { bg: "bg-amber-50 border-amber-200", icon: "text-amber-600", title: "text-amber-900" },
  info:    { bg: "bg-blue-50 border-blue-200",   icon: "text-blue-600",  title: "text-blue-900" },
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const Icon = iconMap[toast.type]
  const style = styleMap[toast.type]

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${style.bg} min-w-72 max-w-sm`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${style.icon}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${style.title}`}>{toast.title}</p>
        {toast.message && <p className="text-xs text-muted-foreground mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={() => onRemove(toast.id)} className="p-0.5 hover:opacity-70 shrink-0 transition-opacity">
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...t, id }])
  }, [])

  const value: ToastContextValue = {
    toast: add,
    success: (title, message) => add({ type: "success", title, message }),
    error:   (title, message) => add({ type: "error",   title, message }),
    warning: (title, message) => add({ type: "warning", title, message }),
    info:    (title, message) => add({ type: "info",    title, message }),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={remove} />)}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx
}
