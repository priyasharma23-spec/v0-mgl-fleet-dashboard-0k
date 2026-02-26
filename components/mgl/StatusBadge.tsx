"use client";
import { cn } from "@/lib/utils";
import type { VehicleStatus, FOStatus } from "@/lib/mgl-data";
import { vehicleStatusConfig, foStatusConfig } from "@/lib/mgl-data";

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
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
              step.status === "done" ? "bg-primary text-primary-foreground" :
              step.status === "active" ? "bg-accent text-accent-foreground ring-2 ring-accent/30" :
              "bg-muted text-muted-foreground"
            )}>
              {step.status === "done" ? "✓" : i + 1}
            </div>
            <span className={cn("text-[9px] font-medium text-center whitespace-nowrap",
              step.status === "done" ? "text-primary" :
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
      ))}
    </div>
  );
}
