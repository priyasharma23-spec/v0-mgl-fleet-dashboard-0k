"use client";
import { useState } from "react";
import { Truck, CheckCircle, XCircle, AlertCircle, Eye, ChevronRight } from "lucide-react";
import { mockVehicles } from "@/lib/mgl-data";
import { VehicleStatusBadge } from "@/components/mgl/StatusBadge";
import type { Vehicle } from "@/lib/mgl-data";

interface L1ApprovalQueueProps {
  onViewChange: (view: string) => void;
}

export default function L1ApprovalQueue({ onViewChange }: L1ApprovalQueueProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [processed, setProcessed] = useState<Record<string, "approved" | "rejected">>({});
  const [vehicles, setVehicles] = useState(mockVehicles);

  const queue = vehicles.filter((v) =>
    v.status === "L1_SUBMITTED" || processed[v.id]
  );

  const handleApprove = () => {
    if (!selectedVehicle) return;
    setProcessed({ ...processed, [selectedVehicle.id]: "approved" });
    setVehicles(vehicles.map((v) =>
      v.id === selectedVehicle.id ? { ...v, status: "L1_APPROVED" as const } : v
    ));
    setSelectedVehicle(null);
    setComment("");
    setAction(null);
  };

  const handleReject = () => {
    if (!selectedVehicle || !comment) return;
    setProcessed({ ...processed, [selectedVehicle.id]: "rejected" });
    setVehicles(vehicles.map((v) =>
      v.id === selectedVehicle.id ? { ...v, status: "L1_REJECTED" as const, l1Comments: comment } : v
    ));
    setSelectedVehicle(null);
    setComment("");
    setAction(null);
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">L1 Approval Queue</h1>
        <p className="text-sm text-muted-foreground">Review and approve vehicle pre-delivery documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Queue list */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Pending ({queue.filter((v) => v.status === "L1_SUBMITTED").length})
              </p>
            </div>
            <div className="divide-y divide-border">
              {queue.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  All caught up!
                </div>
              ) : (
                queue.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVehicle(v); setAction(null); setComment(""); }}
                    className={`w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-start gap-3 ${selectedVehicle?.id === v.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      processed[v.id] === "approved" ? "bg-green-100" :
                      processed[v.id] === "rejected" ? "bg-red-100" : "bg-amber-100"
                    }`}>
                      <Truck className={`w-4 h-4 ${
                        processed[v.id] === "approved" ? "text-green-600" :
                        processed[v.id] === "rejected" ? "text-red-600" : "text-amber-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{v.vehicleNumber || v.id}</p>
                      <p className="text-xs text-muted-foreground truncate">{v.foName}</p>
                      <p className="text-xs text-muted-foreground">{v.model}</p>
                      <div className="mt-1">
                        <VehicleStatusBadge status={v.status} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {!selectedVehicle ? (
            <div className="bg-card rounded-xl border border-border h-full flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Select a vehicle to review</p>
                <p className="text-xs mt-1">Click on any item from the queue</p>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{selectedVehicle.vehicleNumber || selectedVehicle.id}</p>
                  <p className="text-xs text-muted-foreground">{selectedVehicle.foName} · {selectedVehicle.model} · {selectedVehicle.category}</p>
                </div>
                <VehicleStatusBadge status={selectedVehicle.status} />
              </div>

              <div className="p-4 space-y-4">
                {/* Vehicle details */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Vehicle Information</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["OEM", selectedVehicle.oem],
                      ["Category", selectedVehicle.category],
                      ["Dealership", selectedVehicle.dealership],
                      ["Booking Date", selectedVehicle.bookingDate],
                      ["Onboarding Type", selectedVehicle.onboardingType === "MIC_ASSISTED" ? "MIC-Assisted" : "Self-Service"],
                      ["Submitted", selectedVehicle.l1SubmittedAt || "—"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs text-muted-foreground">{k}</p>
                        <p className="text-sm font-medium text-foreground">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* L1 Pre-Delivery Documents */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">L1 Pre-Delivery Documents</p>
                  <div className="space-y-2">
                    {[
                      { name: "Vehicle Booking Receipt", uploaded: true, required: true },
                      { name: "Vehicle Booking Date", uploaded: !!selectedVehicle.bookingDate, required: true, value: selectedVehicle.bookingDate },
                      { name: "Dealership Information", uploaded: !!selectedVehicle.dealership, required: true, value: selectedVehicle.dealership },
                      { name: "Driver License (Optional)", uploaded: !!selectedVehicle.driverName, required: false },
                    ].map((doc) => (
                      <div key={doc.name} className={`flex items-center gap-2 p-2.5 rounded-lg border ${doc.uploaded ? "border-green-200 bg-green-50" : doc.required ? "border-red-200 bg-red-50" : "border-border bg-muted/30"}`}>
                        {doc.uploaded ? (
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                        ) : doc.required ? (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-sm flex-1">{doc.name}</span>
                        {doc.value && <span className="text-xs text-muted-foreground">{doc.value}</span>}
                        {doc.uploaded && !doc.value && (
                          <button className="text-xs text-primary font-medium hover:underline">View</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Info */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 mb-1">L1 Verification Checklist</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Verify booking receipt matches declared vehicle model</li>
                    <li>• Confirm dealership is an authorized MGL partner</li>
                    <li>• Check booking date is within valid MoU period (if applicable)</li>
                    <li>• Upon approval, card will be allocated automatically</li>
                  </ul>
                </div>

                {/* Action area */}
                {selectedVehicle.status === "L1_SUBMITTED" && !processed[selectedVehicle.id] && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Decision</p>
                    {action === "reject" && (
                      <div className="mb-3">
                        <label className="text-xs font-medium text-muted-foreground">Rejection Comments <span className="text-destructive">*</span></label>
                        <textarea
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Provide specific reasons for rejection so FO can resubmit..."
                          className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {action !== "reject" ? (
                        <button
                          onClick={() => setAction("reject")}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      ) : (
                        <>
                          <button onClick={() => setAction(null)} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
                          <button
                            onClick={handleReject}
                            disabled={!comment}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 disabled:opacity-40"
                          >
                            <XCircle className="w-4 h-4" />
                            Confirm Reject
                          </button>
                        </>
                      )}
                      {action !== "reject" && (
                        <button
                          onClick={handleApprove}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve L1
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Post-action display */}
                {processed[selectedVehicle.id] && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${processed[selectedVehicle.id] === "approved" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    {processed[selectedVehicle.id] === "approved" ? (
                      <><CheckCircle className="w-4 h-4 text-green-600" /><p className="text-sm text-green-700 font-medium">L1 Approved — Card allocation triggered</p></>
                    ) : (
                      <><XCircle className="w-4 h-4 text-red-600" /><p className="text-sm text-red-700 font-medium">L1 Rejected — FO notified with comments</p></>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
