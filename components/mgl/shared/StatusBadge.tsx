"use client"

export type BadgeVariant =
  | "active" | "inactive" | "pending" | "suspended" | "blocked" | "locked"
  | "success" | "failed" | "processing" | "hold"
  | "verified" | "expiring" | "expired"
  | "draft" | "exhausted"
  | "approved" | "rejected" | "escalated" | "on-hold" | "auto-approved"
  | "approval-pending" | "under-review"
  | "incentive" | "cashback"
  | "pos" | "load" | "debit" | "credit"
  | "high" | "normal" | "low"
  | "new" | "retrofit"
  | "neft" | "rtgs" | "imps" | "ft" | "pg"
  | "settled" | "completed" | "cancelled"

interface StatusBadgeProps {
  variant: BadgeVariant
  label?: string
  size?: "sm" | "md"
}

const variantMap: Record<BadgeVariant, { bg: string; text: string; label: string }> = {
  active:             { bg: "bg-green-100",   text: "text-green-700",   label: "Active" },
  inactive:           { bg: "bg-gray-100",    text: "text-gray-600",    label: "Inactive" },
  pending:            { bg: "bg-amber-100",   text: "text-amber-700",   label: "Pending" },
  suspended:          { bg: "bg-red-100",     text: "text-red-700",     label: "Suspended" },
  blocked:            { bg: "bg-red-100",     text: "text-red-700",     label: "Blocked" },
  locked:             { bg: "bg-orange-100",  text: "text-orange-700",  label: "Locked" },
  success:            { bg: "bg-green-100",   text: "text-green-700",   label: "Success" },
  failed:             { bg: "bg-red-100",     text: "text-red-700",     label: "Failed" },
  processing:         { bg: "bg-blue-100",    text: "text-blue-700",    label: "Processing" },
  hold:               { bg: "bg-orange-100",  text: "text-orange-700",  label: "On Hold" },
  verified:           { bg: "bg-green-100",   text: "text-green-700",   label: "Verified" },
  expiring:           { bg: "bg-amber-100",   text: "text-amber-700",   label: "Expiring" },
  expired:            { bg: "bg-red-100",     text: "text-red-700",     label: "Expired" },
  draft:              { bg: "bg-gray-100",    text: "text-gray-600",    label: "Draft" },
  exhausted:          { bg: "bg-red-100",     text: "text-red-700",     label: "Exhausted" },
  approved:           { bg: "bg-green-100",   text: "text-green-700",   label: "Approved" },
  rejected:           { bg: "bg-red-100",     text: "text-red-700",     label: "Rejected" },
  escalated:          { bg: "bg-orange-100",  text: "text-orange-700",  label: "Escalated" },
  "on-hold":          { bg: "bg-gray-100",    text: "text-gray-600",    label: "On Hold" },
  "auto-approved":    { bg: "bg-teal-100",    text: "text-teal-700",    label: "Auto Approved" },
  "approval-pending": { bg: "bg-amber-100",   text: "text-amber-700",   label: "Approval Pending" },
  "under-review":     { bg: "bg-blue-100",    text: "text-blue-700",    label: "Under Review" },
  incentive:          { bg: "bg-purple-100",  text: "text-purple-700",  label: "Incentive" },
  cashback:           { bg: "bg-blue-100",    text: "text-blue-700",    label: "Cashback" },
  pos:                { bg: "bg-blue-100",    text: "text-blue-700",    label: "POS" },
  load:               { bg: "bg-purple-100",  text: "text-purple-700",  label: "Load" },
  debit:              { bg: "bg-red-100",     text: "text-red-700",     label: "Debit" },
  credit:             { bg: "bg-green-100",   text: "text-green-700",   label: "Credit" },
  high:               { bg: "bg-red-100",     text: "text-red-700",     label: "High" },
  normal:             { bg: "bg-blue-100",    text: "text-blue-700",    label: "Normal" },
  low:                { bg: "bg-gray-100",    text: "text-gray-600",    label: "Low" },
  new:                { bg: "bg-green-100",   text: "text-green-700",   label: "New" },
  retrofit:           { bg: "bg-blue-100",    text: "text-blue-700",    label: "Retrofit" },
  neft:               { bg: "bg-blue-50",     text: "text-blue-700",    label: "NEFT" },
  rtgs:               { bg: "bg-purple-50",   text: "text-purple-700",  label: "RTGS" },
  imps:               { bg: "bg-green-50",    text: "text-green-700",   label: "IMPS" },
  ft:                 { bg: "bg-gray-100",    text: "text-gray-600",    label: "FT" },
  pg:                 { bg: "bg-amber-50",    text: "text-amber-700",   label: "PG" },
  settled:            { bg: "bg-green-100",   text: "text-green-700",   label: "Settled" },
  completed:          { bg: "bg-green-100",   text: "text-green-700",   label: "Completed" },
  cancelled:          { bg: "bg-gray-100",    text: "text-gray-600",    label: "Cancelled" },
}

export function StatusBadge({ variant, label, size = "md" }: StatusBadgeProps) {
  const config = variantMap[variant] ?? { bg: "bg-gray-100", text: "text-gray-600", label: variant }
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${config.bg} ${config.text}`}>
      {label ?? config.label}
    </span>
  )
}
