"use client"

import { ReactNode } from "react"
import { X, Search, Filter, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================================================
// DetailPanel — Fixed right-side tray for displaying entity details
// ============================================================================
interface DetailPanelProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export function DetailPanel({ title, onClose, children }: DetailPanelProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  )
}

// ============================================================================
// SearchInput — Search icon left-aligned input field
// ============================================================================
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  )
}

// ============================================================================
// SectionHeader — Flex row with title and optional right-aligned content slot
// ============================================================================
interface SectionHeaderProps {
  title: string
  children?: ReactNode
}

export function SectionHeader({ title, children }: SectionHeaderProps) {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      {children && <div>{children}</div>}
    </div>
  )
}

// ============================================================================
// TabBar — Horizontal tabs with active state indicator
// ============================================================================
interface Tab {
  label: string
  value: string
}

interface TabBarProps {
  tabs: Tab[]
  active: string
  onChange: (value: string) => void
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 border-b border-border overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
            active === tab.value
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// FilterPanel — Collapsible filter section wrapper
// ============================================================================
interface FilterPanelProps {
  open: boolean
  onToggle: () => void
  children: ReactNode
}

export function FilterPanel({ open, onToggle, children }: FilterPanelProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filters
        <ChevronRight className={cn("w-4 h-4 transition-transform", open && "rotate-90")} />
      </button>

      {open && (
        <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
          {children}
        </div>
      )}
    </>
  )
}

// ============================================================================
// WorkflowModal — Multi-step modal with progress bar
// ============================================================================
interface WorkflowModalProps {
  steps: string[]
  currentStep: number
  onClose: () => void
  children: ReactNode
}

export function WorkflowModal({ steps, currentStep, onClose, children }: WorkflowModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card rounded-xl border border-border shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-muted/50 p-4 border-b border-border">
          <div className="flex gap-2 items-center mb-3">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                    idx < currentStep
                      ? "bg-green-100 text-green-700"
                      : idx === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {idx < currentStep ? "✓" : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn("flex-1 h-1 rounded-full", idx < currentStep ? "bg-green-100" : "bg-muted")} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  )
}
