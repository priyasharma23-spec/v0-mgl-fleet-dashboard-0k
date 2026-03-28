"use client"
import { useState, ReactNode } from "react"
import { Search, Filter } from "lucide-react"

interface FilterPanelProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  children?: ReactNode
  activeFilterCount?: number
  actions?: ReactNode
}

export function FilterPanel({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  children,
  activeFilterCount = 0,
  actions
}: FilterPanelProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {children && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
        {actions}
      </div>

      {showFilters && children && (
        <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

export function FilterGrid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const colClass = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[cols]
  return <div className={`grid ${colClass} gap-4`}>{children}</div>
}

export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground block mb-1">{label}</label>
      {children}
    </div>
  )
}

export function FilterSelect({
  value, onChange, options
}: {
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

export function FilterDateRange({
  fromValue, toValue, onFromChange, onToChange
}: {
  fromValue: string
  toValue: string
  onFromChange: (v: string) => void
  onToChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FilterField label="From Date">
        <input type="date" value={fromValue} onChange={e => onFromChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" />
      </FilterField>
      <FilterField label="To Date">
        <input type="date" value={toValue} onChange={e => onToChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" />
      </FilterField>
    </div>
  )
}

export function FilterActions({ onClear, onApply }: { onClear: () => void; onApply: () => void }) {
  return (
    <div className="flex gap-3 justify-end pt-1">
      <button onClick={onClear} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Clear All
      </button>
      <button onClick={onApply} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
        Apply
      </button>
    </div>
  )
}
