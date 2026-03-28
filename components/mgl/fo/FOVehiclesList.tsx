"use client"

import { Truck, CreditCard, AlertCircle } from "lucide-react"
import { VehicleStatusBadge, WorkflowStepper } from "@/components/mgl/shared"
import { myVehicles } from "@/data/mock"

export function FOVehiclesList({ onViewChange }: { onViewChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Vehicles</h1>
          <p className="text-sm text-muted-foreground">{myVehicles.length} vehicles registered</p>
        </div>
        <button onClick={() => onViewChange("fo-add-vehicle")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          + Add Vehicle
        </button>
      </div>
      <div className="space-y-3">
        {myVehicles.map((v) => {
          const steps: { label: string; status: "done" | "active" | "pending" }[] = [
            { label: "Registered", status: "done" },
            { label: "L1 Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },
            { label: "L2 Review", status: v.l2ApprovedAt ? "done" : v.l2SubmittedAt ? "active" : "pending" },
            { label: "Card Issued", status: v.cardActivatedAt ? "done" : v.cardNumber ? "active" : "pending" },
          ]
          return (
            <div key={v.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{v.vehicleNumber || v.id}</p>
                    <p className="text-xs text-muted-foreground">{v.oem} {v.model} · {v.category} · {v.onboardingType === "MIC_ASSISTED" ? "New Purchase" : "Self-Service"}</p>
                  </div>
                </div>
                <VehicleStatusBadge status={v.status} />
              </div>

              <div className="overflow-x-auto mb-3">
                <WorkflowStepper steps={steps} />
              </div>

              {(v.status === "L1_REJECTED" || v.status === "L2_REJECTED") && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-700">Action Required</p>
                    <p className="text-xs text-red-600">{v.l1Comments || v.l2Comments || "Please re-upload the required documents."}</p>
                    <button className="text-xs text-red-700 font-semibold mt-1 hover:underline">Resubmit Documents →</button>
                  </div>
                </div>
              )}

              {v.cardNumber && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                  <CreditCard className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-xs text-green-700 font-medium">Card: {v.cardNumber}</p>
                  {v.trackingId && <p className="text-xs text-muted-foreground ml-auto">Track: {v.trackingId}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
