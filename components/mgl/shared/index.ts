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

// ─── FO Portal Components ─────────────────────────────────────────────────────
export { default as FOWalletView } from "@/components/mgl/FOWalletView"
export { default as CardDetailsView } from "@/components/mgl/CardDetailsView"

// ─── Approval Queue Components ────────────────────────────────────────────────
export { default as L1ApprovalQueue } from "@/components/mgl/L1ApprovalQueue"
export { default as L2ApprovalQueue } from "@/components/mgl/L2ApprovalQueue"
export { default as IncentiveApprovalUI } from "@/components/mgl/IncentiveApprovalUI"

// ─── Shell & Layout Components ────────────────────────────────────────────────
export { default as MGLHeader } from "@/components/mgl/MGLHeader"
export { default as MGLSidebar } from "@/components/mgl/MGLSidebar"
export { PoweredByFooter } from "@/components/mgl/PoweredByFooter"

// ─── FO Page Components ───────────────────────────────────────────────────────
export { default as FODashboard } from "@/components/mgl/fo/FODashboard"
export { default as FOVehiclesList } from "@/components/mgl/fo/FOVehiclesList"
export { default as FOAddVehicle } from "@/components/mgl/fo/FOAddVehicle"
export { default as FOCardsView } from "@/components/mgl/fo/FOCardsView"
export { default as FOFundManagement } from "@/components/mgl/fo/FOFundManagement"
export { default as FODeliveryTracking } from "@/components/mgl/fo/FODeliveryTracking"
export { default as FONotificationsView } from "@/components/mgl/fo/FONotificationsView"
export { default as FOSignupFlow } from "@/components/mgl/fo/FOSignupFlow"
