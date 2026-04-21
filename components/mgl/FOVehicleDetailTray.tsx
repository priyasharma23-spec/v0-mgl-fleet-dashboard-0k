"use client"
import { useState } from "react"
import { X, History, Gift, CheckCircle, AlertCircle, Clock, Upload } from "lucide-react"
import type { Vehicle } from "@/lib/mgl-data"
import { VehicleStatusBadge } from "@/components/mgl/shared"

interface Props {
  vehicle: Vehicle
  onClose: () => void
  onboardingType?: string
  l1Files?: Record<string, File | null>
  l2Files?: Record<string, File | null>
  l2Dates?: Record<string, string>
  l1Submitted?: boolean
  l2Submitted?: boolean
  onL1FileChange?: (label: string, file: File | null) => void
  onL2FileChange?: (label: string, file: File | null) => void
  onL2DateChange?: (label: string, value: string) => void
  onL1Submit?: () => void
  onL2Submit?: () => void
  onL2Resubmit?: () => void
}

export default function FOVehicleDetailTray({
  vehicle: v, onClose, onboardingType,
  l1Files = {}, l2Files = {}, l2Dates = {},
  l1Submitted = false, l2Submitted = false,
  onL1FileChange, onL2FileChange, onL2DateChange,
  onL1Submit, onL2Submit, onL2Resubmit
}: Props) {
  const [showTimeline, setShowTimeline] = useState(false)
  const [showIncentive, setShowIncentive] = useState(false)

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">{v.vehicleNumber || v.id}</h2>
            <p className="text-xs text-muted-foreground">{v.oem} · {v.model}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {v.onboardingType === "MIC_ASSISTED" && (
              <button onClick={() => { setShowIncentive(!showIncentive); setShowTimeline(false) }}
                className={`p-2 rounded-lg transition-colors ${showIncentive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}>
                <Gift className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => { setShowTimeline(!showTimeline); setShowIncentive(false) }}
              className={`p-2 rounded-lg transition-colors ${showTimeline ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}>
              <History className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showIncentive ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground">Incentive Details</p>
              <div className="bg-muted/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Linked Program</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Program ID", "INC-2026-001"],
                    ["Program Name", "New Vehicle Onboarding Incentive"],
                    ["Type", "One-time"],
                    ["Gross Amount", "₹3,500"],
                    ["TDS Deducted", "₹350"],
                    ["Net Incentive", "₹3,150"],
                    ["Credit Date", "Mar 21, 2026"],
                    ["Expiry Date", "Mar 21, 2027"],
                    ["Status", "Active"],
                  ].map(([label, value]) => (
                    <div key={label} className="text-sm">
                      <span className="text-xs text-muted-foreground block">{label}</span>
                      <span className={`font-medium block mt-0.5 ${label === "Status" ? "text-green-600" : label === "TDS Deducted" ? "text-red-600" : label === "Net Incentive" ? "text-green-700 font-bold" : "text-foreground"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : showTimeline ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Approval Timeline</p>
              <div className="space-y-4">
                {[
                  { type: "submitted", timestamp: v.l1SubmittedAt, action: "L1 Submitted", actor: "Fleet Operator" },
                  v.l1ApprovedAt ? { type: "approved", timestamp: v.l1ApprovedAt, action: "L1 Approved", actor: "MIC Officer", comment: undefined } : null,
                  v.l1RejectedAt ? { type: "rejected", timestamp: v.l1RejectedAt, action: "L1 Rejected", actor: "MIC Officer", comment: v.l1Comments } : null,
                  v.l2SubmittedAt ? { type: "submitted", timestamp: v.l2SubmittedAt, action: "L2 Submitted", actor: "Fleet Operator" } : null,
                  v.l2ApprovedAt ? { type: "approved", timestamp: v.l2ApprovedAt, action: "L2 Approved", actor: "ZIC Officer" } : null,
                  v.l2RejectedAt ? { type: "rejected", timestamp: v.l2RejectedAt, action: "L2 Rejected", actor: "ZIC Officer", comment: v.l2Comments } : null,
                  v.cardDispatchDate ? { type: "system", timestamp: v.cardDispatchDate, action: "Card Dispatched", actor: "System" } : null,
                  v.cardActivatedAt ? { type: "approved", timestamp: v.cardActivatedAt, action: "Card Activated", actor: "System" } : null,
                ].filter(Boolean).map((entry, idx, arr) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${entry!.type === "approved" ? "bg-green-600" : entry!.type === "rejected" ? "bg-red-600" : entry!.type === "submitted" ? "bg-blue-600" : "bg-gray-400"}`} />
                      {idx < arr.length - 1 && <div className="w-0.5 h-8 bg-border mt-1" />}
                    </div>
                    <div className="pb-2 flex-1">
                      <p className="text-xs text-muted-foreground">{entry!.timestamp}</p>
                      <p className="text-sm font-medium text-foreground">{entry!.action}</p>
                      <p className="text-xs text-muted-foreground">{entry!.actor}</p>
                      {(entry as any).comment && <p className="text-xs italic text-muted-foreground mt-1">"{(entry as any).comment}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <VehicleStatusBadge status={v.status} />
                <span className="text-xs text-muted-foreground">{v.onboardingType === "MIC_ASSISTED" ? "MIC Assisted" : "Self-Service"}</span>
              </div>
              {v.onboardingType === "SELF_SERVICE" && v.vahaaanData ? (
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Registration</p>
                    {[
                      ["Vehicle Number", v.vehicleNumber],
                      ["Status", v.vahaaanData.status],
                      ["Blacklisted", v.vahaaanData.blacklist_status === "false" ? "No" : "Yes"],
                      ["RTO", v.vahaaanData.registered_at],
                      ["Issue Date", v.vahaaanData.issue_date],
                      ["Expiry Date", v.vahaaanData.expiry_date],
                      ["Owner", v.vahaaanData.owner_data.name],
                      ["Mobile", v.vahaaanData.owner_data.mobile],
                    ].map(([label, value]) => value ? (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground text-right max-w-[60%]">{value}</span>
                      </div>
                    ) : null)}
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle</p>
                    {[
                      ["Make", v.vahaaanData.vehicle_data.maker_description],
                      ["Model", v.vahaaanData.vehicle_data.maker_model],
                      ["Category", v.vahaaanData.vehicle_data.category],
                      ["Fuel Type", v.vahaaanData.vehicle_data.fuel_type],
                      ["Body Type", v.vahaaanData.vehicle_data.body_type],
                      ["Chassis No.", v.vahaaanData.vehicle_data.chassis_number],
                      ["Engine No.", v.vahaaanData.vehicle_data.engine_number],
                      ["Colour", v.vahaaanData.vehicle_data.color],
                      ["GVW", v.vahaaanData.vehicle_data.gross_weight + " kg"],
                      ["Mfg. Date", v.vahaaanData.vehicle_data.manufactured_date],
                    ].map(([label, value]) => value ? (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground text-right max-w-[60%]">{value}</span>
                      </div>
                    ) : null)}
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Insurance</p>
                    {[
                      ["Company", v.vahaaanData.insurance_data.company],
                      ["Policy No.", v.vahaaanData.insurance_data.policy_number],
                      ["Expiry", v.vahaaanData.insurance_data.expiry_date],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground text-right max-w-[60%]">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">PUCC</p>
                    {[
                      ["PUCC No.", v.vahaaanData.pucc_data.pucc_number],
                      ["Expiry", v.vahaaanData.pucc_data.expiry_date],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
                  {[
                    ["Registration Type", v.onboardingType === "SELF_SERVICE" ? "Self-Service" : v.vehicleType === "retrofit" ? "Retrofitment" : "New Purchase"],
                    ["Vehicle Number", v.vehicleNumber],
                    ["OEM", v.oem],
                    ["Model", v.model],
                    ["Category", v.category],
                    ["Dealership", v.dealership],
                    ["Booking Date", v.bookingDate],
                    ["Registration Date", v.registrationDate],
                    ["Delivery Date", v.deliveryDate],
                  ].map(([label, value]) => value ? (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground text-right">{value}</span>
                    </div>
                  ) : null)}
                </div>
              )}
              {v.onboardingType === "MIC_ASSISTED" && (
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">MOU & Incentive</p>
                  {[
                    ["MOU Number", v.mouId || "—"],
                    ["Category Sequence", v.categorySequence ? `#${v.categorySequence} in ${v.category}` : "—"],
                    ["Vehicle Type", v.vehicleType === "new_purchase" ? "New Purchase" : v.vehicleType === "retrofit" ? "Retrofitment" : "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Incentive Status</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${v.incentiveStatus === "paid" ? "bg-green-100 text-green-700" : v.incentiveStatus === "approved" ? "bg-blue-100 text-blue-700" : v.incentiveStatus === "eligible" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                        {v.incentiveStatus === "paid" ? "Paid" : v.incentiveStatus === "approved" ? "Approved" : v.incentiveStatus === "eligible" ? "Eligible" : v.incentiveStatus === "not_eligible" ? "Not Yet Eligible" : "—"}
                      </span>
                    </div>
                    {v.incentiveAmount && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Incentive Amount</span>
                        <span className="font-bold text-green-700">₹{v.incentiveAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Driver Details</p>
                {[["Driver Name", v.driverName], ["Contact", v.driverContact]].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value || "—"}</span>
                  </div>
                ))}
              </div>
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Card Details</p>
                {[
                  ["Card Number", v.cardNumber || "Not issued yet"],
                  ["Dispatch Date", v.cardDispatchDate],
                  ["Tracking ID", v.trackingId],
                  ["Activated At", v.cardActivatedAt],
                ].map(([label, value]) => value ? (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ) : null)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
