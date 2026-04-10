// ─── New Shared Components ───────────────────────────────────────────────────
export { StatusBadge } from "./StatusBadge"
export type { BadgeVariant } from "./StatusBadge"

export { KPICard } from "./KPICard"

export { DataTable } from "./DataTable"

export { RightTray, TraySection, TrayRow, TrayDivider } from "./RightTray"

export { Modal, ConfirmModal, StepModal } from "./Modal"

export {
  FilterPanel,
  FilterGrid,
  FilterField,
  FilterSelect,
  FilterDateRange,
  FilterActions,
} from "./FilterPanel"

export { PageHeader, ExportButton, PrimaryButton } from "./PageHeader"

export {
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonTray,
  SkeletonKPIGrid,
  SkeletonPage,
} from "./Skeleton"

export { ToastProvider, useToast } from "./Toast"

export { default as CashbackDetails } from "./CashbackDetails"
export type { CashbackData } from "./CashbackDetails"

export { default as TransactionDetailTray } from "./TransactionDetailTray"
export type { TransactionRecord } from "./TransactionDetailTray"

export { default as ReportsView } from "./ReportsView"
export type { ReportRole } from "./ReportsView"

export { default as IncentiveApprovalView } from "./IncentiveApprovalView"

// ─── Existing MGL Components (re-exported for unified imports) ────────────────
export { default as StatCard } from "@/components/mgl/StatCard"

export {
  DetailPanel,
  SearchInput,
  TabBar,
  FilterPanel as LegacyFilterPanel,
  WorkflowModal,
} from "@/components/mgl/ui"

export {
  VehicleStatusBadge,
  FOStatusBadge,
  WorkflowStepper,
  WorkflowTimeline,
  getWorkflowSteps,
} from "@/components/mgl/StatusBadge"
