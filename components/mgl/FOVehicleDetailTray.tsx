"use client"
import { useState } from "react"
import { X, History, Gift, CheckCircle, AlertCircle, Clock, Upload, ChevronRight } from "lucide-react"
import { Vehicle } from "@/lib/mgl-data"
import { VehicleStatusBadge } from "@/components/mgl/shared"
import CashbackDetails from "@/components/mgl/shared/CashbackDetails"

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

export default function FOVehicleDetailTray({ vehicle: v, onClose, onboardingType, l1Files = {}, l2Files = {}, l2Dates = {}, l1Submitted = false, l2Submitted = false, onL1FileChange, onL2FileChange, onL2DateChange, onL1Submit, onL2Submit, onL2Resubmit }: Props) {
  const [showTimeline, setShowTimeline] = useState(false)
  const [showIncentive, setShowIncentive] = useState(false)

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">{v.vehicleNumber || v.id}</h2>
            <p className="text-xs text-muted-foreground">{v.oem} · {v.model}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {v.onboardingType === "MIC_ASSISTED" && (
              <button onClick={() => { setShowIncentive(!showIncentive); setShowTimeline(false) }}
                className={`p-2 rounded-lg transition-colors ${showIncentive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
                title="Incentive Details">
                <Gift className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => { setShowTimeline(!showTimeline); setShowIncentive(false) }}
              className={`p-2 rounded-lg transition-colors ${showTimeline ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
              title="Approval Timeline">
              <History className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {showIncentive ? (
            <div className="p-4 space-y-4">
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
            <div className="p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Approval Timeline</p>
              <div className="space-y-4">
                {[
                  { type: "submitted", timestamp: v.l1SubmittedAt, action: "L1 Submitted", actor: "Fleet Operator" },
                  v.l1ApprovedAt ? { type: "approved", timestamp: v.l1ApprovedAt, action: "L1 Approved", actor: "MIC Officer" } : null,
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
                      {(entry as any).comment && <p className="text-xs italic text-muted-foreground mt-1">{`"${(entry as any).comment}"`}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <VehicleStatusBadge status={v.status} />
                <span className="text-xs text-muted-foreground">{v.onboardingType === "MIC_ASSISTED" ? "MIC Assisted" : "Self-Service"}</span>
              </div>

              {/* Vehicle Details */}
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

              {/* MOU & Incentive — MIC_ASSISTED only */}
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
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        v.incentiveStatus === "paid" ? "bg-green-100 text-green-700" :
                        v.incentiveStatus === "approved" ? "bg-blue-100 text-blue-700" :
                        v.incentiveStatus === "eligible" ? "bg-amber-100 text-amber-700" :
                        v.incentiveStatus === "pending_approval" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {v.incentiveStatus === "paid" ? "Paid" :
                         v.incentiveStatus === "approved" ? "Approved" :
                         v.incentiveStatus === "eligible" ? "Eligible — Pending Approval" :
                         v.incentiveStatus === "pending_approval" ? "Submitted for Approval" :
                         v.incentiveStatus === "not_eligible" ? "Not Yet Eligible" : "—"}
                      </span>
                    </div>
                    {v.incentiveAmount && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Incentive Amount</span>
                        <span className="font-bold text-green-700">₹{v.incentiveAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {v.incentiveStatus === "not_eligible" && (
                      <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-700">Incentive becomes eligible when a second {v.category} vehicle is added and approved under this MOU.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Driver Details */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Driver Details</p>
                {[
                  ["Driver Name", v.driverName],
                  ["Contact", v.driverContact],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Card Details */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Card Details</p>
                {[
                  ["Card Number", v.cardNumber || "Not issued yet"],
                  ["Dispatch Date", v.cardDispatchDate],
                  ["Delivery Date", v.cardDeliveryDate],
                  ["Activated At", v.cardActivatedAt],
                  ["Tracking ID", v.trackingId],
                ].map(([label, value]) => value ? (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ) : null)}
              </div>

              {/* Documents — branched by onboarding type */}
              {v.onboardingType === "MIC_ASSISTED" ? (
                <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents</p>
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">L1 Documents</p>
                    {[
                      { label: "Vehicle Booking Receipt", url: v.bookingReceiptUrl },
                      { label: "RC Book", url: v.rcBookUrl },
                    ].map(({ label, url }) => (
                      <div key={label} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${url || l1Files[label] ? "bg-green-500" : "bg-muted border border-border"}`}>
                          {(url || l1Files[label]) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className={url || l1Files[label] ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                        {v.status === "L1_REJECTED" && !url && !l1Files[label] && (
                          <label className="ml-auto text-xs text-primary font-medium cursor-pointer hover:underline">
                            Upload <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                              onChange={e => onL1FileChange?.(label, e.target.files?.[0] || null)} />
                          </label>
                        )}
                        {(url || l1Files[label]) && <span className="text-xs text-green-600 font-medium ml-auto">Verified</span>}
                      </div>
                    ))}
                    {v.status === "L1_REJECTED" && v.l1Comments && (
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 mt-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-red-700">L1 Correction Required</p>
                          <p className="text-xs text-red-600 mt-0.5">{v.l1Comments}</p>
                          {!l1Submitted ? (
                            <button onClick={onL1Submit} className="w-full mt-2 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Resubmit for L1 Approval</button>
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg mt-2">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <p className="text-xs text-green-700 font-medium">Resubmitted for MIC review</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* L2 Documents */}
                  {["L1_APPROVED","L2_SUBMITTED","L2_APPROVED","L2_REJECTED","CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(v.status) && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                        L2 Documents {v.status === "L1_APPROVED" && <span className="ml-2 text-amber-600 normal-case">— Upload required</span>}
                      </p>

                      {/* L2 Vehicle Details inputs */}
                      {v.status === "L1_APPROVED" && (
                        <div className="space-y-3 pb-3 border-b border-border">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground">Vehicle Number <span className="text-destructive">*</span></label>
                            <input type="text" placeholder="e.g. MH12AB1234" value={l2Dates["vehicleNumber"] || ""}
                              onChange={e => onL2DateChange?.("vehicleNumber", e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                          </div>
                          {v.vehicleType !== "retrofit" && (
                            <>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Registration Date <span className="text-destructive">*</span></label>
                                <input type="date" value={l2Dates["registrationDate"] || ""}
                                  onChange={e => onL2DateChange?.("registrationDate", e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Delivery Date <span className="text-destructive">*</span></label>
                                <input type="date" value={l2Dates["deliveryDate"] || ""}
                                  onChange={e => onL2DateChange?.("deliveryDate", e.target.value)}
                                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* L2 Document uploads */}
                      {(v.vehicleType === "retrofit" ? [
                        { label: "CNG Kit Installation Certificate", url: v.cngCertUrl },
                        { label: "E-Fitment Certificate", url: v.eFitmentUrl },
                        { label: "RTO Endorsement (CNG Conversion)", url: v.rtoEndorsementUrl },
                        { label: "Type Approval Certificate", url: v.typeApprovalUrl },
                        { label: "Tax Invoice (Retrofitment Center)", url: v.taxInvoiceUrl },
                      ] : [
                        { label: "Delivery Challan / Delivery Note", url: v.deliveryChallanUrl },
                        { label: "RTO Receipt / RC Book", url: v.rtoReceiptUrl },
                      ]).map(({ label, url }) => (
                        <div key={label} className="flex items-center gap-2 text-sm">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${url || l2Files[label] ? "bg-green-500" : "bg-muted border border-border"}`}>
                            {(url || l2Files[label]) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className={url || l2Files[label] ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                          {v.status === "L1_APPROVED" && !url && !l2Files[label] && (
                            <label className="ml-auto text-xs text-primary font-medium cursor-pointer hover:underline">
                              Upload <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                onChange={e => onL2FileChange?.(label, e.target.files?.[0] || null)} />
                            </label>
                          )}
                          {(url || l2Files[label]) && <span className="text-xs text-green-600 font-medium ml-auto">Verified</span>}
                        </div>
                      ))}

                      {v.status === "L1_APPROVED" && (
                        <button onClick={onL2Submit} className="w-full mt-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Submit for L2 Approval</button>
                      )}

                      {v.status === "L2_REJECTED" && v.l2Comments && (
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 mt-2">
                          <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-red-700">L2 Correction Required</p>
                            <p className="text-xs text-red-600 mt-0.5">{v.l2Comments}</p>
                            {!l2Submitted ? (
                              <button onClick={onL2Resubmit} className="w-full mt-2 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Resubmit for L2 Approval</button>
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg mt-2">
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                <p className="text-xs text-green-700 font-medium">Resubmitted for ZIC review</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents</p>
                  {[
                    { label: "Delivery Challan", url: v.deliveryChallanUrl },
                    { label: "RTO Receipt", url: v.rtoReceiptUrl },
                  ].map(({ label, url }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${url ? "bg-green-500" : "bg-muted border border-border"}`}>
                        {url && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={url ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                      {url && <span className="text-xs text-green-600 font-medium ml-auto">Verified</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
