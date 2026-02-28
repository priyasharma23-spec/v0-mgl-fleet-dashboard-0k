"use client";
import { cn } from "@/lib/utils";
import type { VehicleStatus, FOStatus, OnboardingType } from "@/lib/mgl-data";
import { vehicleStatusConfig, foStatusConfig } from "@/lib/mgl-data";

// State Machine: Happy Flow per PRD
// DRAFT → L1_SUBMITTED → L1_APPROVED (Card Allocated) → L2_SUBMITTED → L2_APPROVED → CARD_PRINTED → CARD_DISPATCHED → CARD_ACTIVE
// Rejections: L1_REJECTED / L2_REJECTED (mandatory comments, reupload)
// Self-service retrofit: DRAFT → L2_SUBMITTED → L2_APPROVED → CARD_PRINTED → CARD_DISPATCHED → CARD_ACTIVE

export const WORKFLOW_STATES: Record<string, { next: string[]; prev: string | null; description: string }> = {
  DRAFT: { next: ["L1_SUBMITTED", "L2_SUBMITTED"], prev: null, description: "Vehicle registered, documents pending" },
  L1_SUBMITTED: { next: ["L1_APPROVED", "L1_REJECTED"], prev: "DRAFT", description: "Awaiting MIC L1 review" },
  L1_APPROVED: { next: ["L2_SUBMITTED"], prev: "L1_SUBMITTED", description: "L1 approved, card allocated" },
  L1_REJECTED: { next: ["L1_SUBMITTED"], prev: "L1_SUBMITTED", description: "L1 rejected, resubmit required" },
  L2_SUBMITTED: { next: ["L2_APPROVED", "L2_REJECTED"], prev: "L1_APPROVED", description: "Awaiting ZIC L2 review" },
  L2_APPROVED: { next: ["CARD_PRINTED"], prev: "L2_SUBMITTED", description: "L2 approved, card order placed" },
  L2_REJECTED: { next: ["L2_SUBMITTED"], prev: "L2_SUBMITTED", description: "L2 rejected, resubmit required" },
  CARD_PRINTED: { next: ["CARD_DISPATCHED"], prev: "L2_APPROVED", description: "Card printed by vendor" },
  CARD_DISPATCHED: { next: ["CARD_ACTIVE"], prev: "CARD_PRINTED", description: "Card dispatched to FO" },
  CARD_ACTIVE: { next: [], prev: "CARD_DISPATCHED", description: "Card active and ready for use" },
};

export function getWorkflowSteps(currentStatus: VehicleStatus, onboardingType: OnboardingType): { label: string; status: "done" | "active" | "pending" }[] {
  // Different flows for MIC-assisted (new purchase) vs self-service (retrofit)
  const isAssistedFlow = onboardingType === "MIC_ASSISTED";
  
  const allSteps = isAssistedFlow ? [
    { key: "DRAFT", label: "Registered" },
    { key: "L1_SUBMITTED", label: "L1 Review" },
    { key: "L1_APPROVED", label: "L1 Approved" },
    { key: "L2_SUBMITTED", label: "L2 Review" },
    { key: "L2_APPROVED", label: "L2 Approved" },
    { key: "CARD_ACTIVE", label: "Card Active" },
  ] : [
    { key: "DRAFT", label: "Registered" },
    { key: "L2_SUBMITTED", label: "L2 Review" },
    { key: "L2_APPROVED", label: "L2 Approved" },
    { key: "CARD_ACTIVE", label: "Card Active" },
  ];

  const statusOrder = allSteps.map(s => s.key);
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  // Handle rejection states
  const isRejected = currentStatus === "L1_REJECTED" || currentStatus === "L2_REJECTED";
  
  return allSteps.map((step, i) => {
    if (isRejected) {
      if (currentStatus === "L1_REJECTED" && step.key === "L1_SUBMITTED") {
        return { label: "L1 Rejected", status: "active" as const };
      }
      if (currentStatus === "L2_REJECTED" && step.key === "L2_SUBMITTED") {
        return { label: "L2 Rejected", status: "active" as const };
      }
    }
    
    // Map intermediate states
    if (["CARD_PRINTED", "CARD_DISPATCHED"].includes(currentStatus) && step.key === "CARD_ACTIVE") {
      return { label: currentStatus === "CARD_PRINTED" ? "Printing" : "Dispatched", status: "active" as const };
    }
    
    return {
      label: step.label,
      status: i < currentIndex ? "done" as const : i === currentIndex ? "active" as const : "pending" as const
    };
  });
}

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  className?: string;
}

export function VehicleStatusBadge({ status, className }: VehicleStatusBadgeProps) {
  const cfg = vehicleStatusConfig[status];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold", cfg.bg, cfg.color, className)}>
      {cfg.label}
    </span>
  );
}

interface FOStatusBadgeProps {
  status: FOStatus;
  className?: string;
}

export function FOStatusBadge({ status, className }: FOStatusBadgeProps) {
  const cfg = foStatusConfig[status];
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold", cfg.bg, cfg.color, className)}>
      {cfg.label}
    </span>
  );
}

interface StepBadgeProps {
  steps: { label: string; status: "done" | "active" | "pending" }[];
}

export function WorkflowStepper({ steps }: StepBadgeProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isRejected = step.label.includes("Rejected");
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                step.status === "done" ? "bg-primary text-primary-foreground" :
                step.status === "active" && isRejected ? "bg-destructive text-destructive-foreground ring-2 ring-destructive/30" :
                step.status === "active" ? "bg-accent text-accent-foreground ring-2 ring-accent/30" :
                "bg-muted text-muted-foreground"
              )}>
                {step.status === "done" ? "✓" : isRejected ? "!" : i + 1}
              </div>
              <span className={cn("text-[9px] font-medium text-center whitespace-nowrap",
                step.status === "done" ? "text-primary" :
                step.status === "active" && isRejected ? "text-destructive" :
                step.status === "active" ? "text-foreground" :
                "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 w-8 mx-1 mb-4 shrink-0",
                step.status === "done" ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Full workflow timeline component for detailed view
interface WorkflowTimelineProps {
  status: VehicleStatus;
  onboardingType: OnboardingType;
  dates?: {
    l1SubmittedAt?: string;
    l1ApprovedAt?: string;
    l1RejectedAt?: string;
    l2SubmittedAt?: string;
    l2ApprovedAt?: string;
    l2RejectedAt?: string;
    cardDispatchDate?: string;
    cardActivatedAt?: string;
  };
  comments?: {
    l1Comments?: string;
    l2Comments?: string;
  };
}

export function WorkflowTimeline({ status, onboardingType, dates = {}, comments = {} }: WorkflowTimelineProps) {
  const isRejected = status === "L1_REJECTED" || status === "L2_REJECTED";
  const stateInfo = WORKFLOW_STATES[status];

  return (
    <div className="space-y-3">
      <div className={cn(
        "p-3 rounded-lg border",
        isRejected ? "bg-red-50 border-red-200" : "bg-primary/5 border-primary/20"
      )}>
        <div className="flex items-center justify-between mb-1">
          <p className={cn("text-xs font-semibold", isRejected ? "text-red-700" : "text-primary")}>
            Current Status
          </p>
          <VehicleStatusBadge status={status} />
        </div>
        <p className="text-xs text-muted-foreground">{stateInfo?.description}</p>
      </div>

      {/* Timeline events */}
      <div className="space-y-2">
        {dates.l1SubmittedAt && (
          <TimelineEvent label="L1 Submitted" date={dates.l1SubmittedAt} type="info" />
        )}
        {dates.l1ApprovedAt && (
          <TimelineEvent label="L1 Approved (Card Allocated)" date={dates.l1ApprovedAt} type="success" />
        )}
        {dates.l1RejectedAt && comments.l1Comments && (
          <TimelineEvent label="L1 Rejected" date={dates.l1RejectedAt} type="error" comment={comments.l1Comments} />
        )}
        {dates.l2SubmittedAt && (
          <TimelineEvent label="L2 Submitted" date={dates.l2SubmittedAt} type="info" />
        )}
        {dates.l2ApprovedAt && (
          <TimelineEvent label="L2 Approved (Card Order Placed)" date={dates.l2ApprovedAt} type="success" />
        )}
        {dates.l2RejectedAt && comments.l2Comments && (
          <TimelineEvent label="L2 Rejected" date={dates.l2RejectedAt} type="error" comment={comments.l2Comments} />
        )}
        {dates.cardDispatchDate && (
          <TimelineEvent label="Card Dispatched" date={dates.cardDispatchDate} type="info" />
        )}
        {dates.cardActivatedAt && (
          <TimelineEvent label="Card Activated" date={dates.cardActivatedAt} type="success" />
        )}
      </div>

      {/* Next steps hint */}
      {stateInfo?.next.length > 0 && !isRejected && (
        <p className="text-[10px] text-muted-foreground">
          Next: {stateInfo.next.filter(s => !s.includes("REJECTED")).join(" or ")}
        </p>
      )}
      {isRejected && (
        <p className="text-xs text-red-600 font-medium">
          Action required: Review comments and resubmit documents
        </p>
      )}
    </div>
  );
}

function TimelineEvent({ label, date, type, comment }: { label: string; date: string; type: "info" | "success" | "error"; comment?: string }) {
  return (
    <div className={cn(
      "flex items-start gap-2 p-2 rounded text-xs",
      type === "success" ? "bg-green-50" : type === "error" ? "bg-red-50" : "bg-muted/50"
    )}>
      <div className={cn(
        "w-2 h-2 rounded-full mt-1 shrink-0",
        type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
      )} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className={cn("font-medium", type === "error" ? "text-red-700" : "text-foreground")}>{label}</span>
          <span className="text-muted-foreground">{date}</span>
        </div>
        {comment && <p className="text-muted-foreground mt-0.5">{comment}</p>}
      </div>
    </div>
  );
}
