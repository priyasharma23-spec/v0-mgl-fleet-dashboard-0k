"use client";
import { useState } from "react";
import { Truck, CheckCircle, XCircle, Eye, Upload, AlertCircle, ChevronRight } from "lucide-react";
import { mockVehicles } from "@/lib/mgl-data";
import { VehicleStatusBadge } from "@/components/mgl/StatusBadge";
import type { Vehicle } from "@/lib/mgl-data";

export default function L2ApprovalQueue({ onViewChange }: { onViewChange: (view: string) => void }) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [processed, setProcessed] = useState<Record<string, "approved" | "rejected">>({});
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [docType, setDocType] = useState<"new_purchase" | "retrofit">("new_purchase");

  const queue = vehicles.filter((v) => v.status === "L2_SUBMITTED" || processed[v.id]);

  const handleApprove = () => {
    if (!selectedVehicle) return;
    setProcessed({ ...processed, [selectedVehicle.id]: "approved" });
    setVehicles(vehicles.map((v) =>
      v.id === selectedVehicle.id ? { ...v, status: "L2_APPROVED" as const, l2ApprovedAt: new Date().toISOString().split("T")[0] } : v
    ));
    setSelectedVehicle({ ...selectedVehicle, status: "L2_APPROVED" });
    setComment("");
    setAction(null);
  };

  const handleReject = () => {
    if (!selectedVehicle || !comment) return;
    setProcessed({ ...processed, [selectedVehicle.id]: "rejected" });
    setVehicles(vehicles.map((v) =>
      v.id === selectedVehicle.id ? { ...v, status: "L2_REJECTED" as const, l2Comments: comment } : v
    ));
    setSelectedVehicle({ ...selectedVehicle, status: "L2_REJECTED" });
    setComment("");
    setAction(null);
  };

  const newPurchaseDocs = [
    { name: "Delivery Challan / Delivery Note", key: "challan" },
    { name: "RTO Receipt / Challan / RC Book", key: "rto" },
  ];

  const retrofitDocs = [
    { name: "CNG Kit Installation Certificate", key: "cng" },
    { name: "E-Fitment Certificate", key: "eFitment" },
    { name: "RTO Endorsement (CNG conversion)", key: "rtoEndorse" },
    { name: "Type Approval Certificate", key: "typeApproval" },
    { name: "Tax Invoice (Retrofit Center)", key: "taxInvoice" },
  ];

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">L2 Approval Queue</h1>
        <p className="text-sm text-muted-foreground">Review post-delivery documents and approve card orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Queue */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-3 border-b border-border bg-muted/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Queue ({queue.filter((v) => v.status === "L2_SUBMITTED").length} pending)
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
                  <button key={v.id}
                    onClick={() => { setSelectedVehicle(v); setAction(null); setComment(""); }}
                    className={`w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-start gap-3 ${selectedVehicle?.id === v.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      processed[v.id] === "approved" ? "bg-green-100" : processed[v.id] === "rejected" ? "bg-red-100" : "bg-amber-100"
                    }`}>
                      <Truck className={`w-4 h-4 ${processed[v.id] === "approved" ? "text-green-600" : processed[v.id] === "rejected" ? "text-red-600" : "text-amber-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{v.vehicleNumber || v.id}</p>
                      <p className="text-xs text-muted-foreground truncate">{v.foName}</p>
                      <div className="mt-1"><VehicleStatusBadge status={v.status} /></div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {!selectedVehicle ? (
            <div className="bg-card rounded-xl border border-border h-full flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Select a vehicle to review</p>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-foreground">{selectedVehicle.vehicleNumber || selectedVehicle.id}</p>
                  <p className="text-xs text-muted-foreground">{selectedVehicle.foName} · {selectedVehicle.model}</p>
                </div>
                <div className="flex items-center gap-2">
                  <VehicleStatusBadge status={selectedVehicle.status} />
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedVehicle.onboardingType === "MIC_ASSISTED" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                    {selectedVehicle.onboardingType === "MIC_ASSISTED" ? "New Purchase" : "Self-Service"}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Vehicle info */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Vehicle", selectedVehicle.vehicleNumber || "—"],
                    ["Model", selectedVehicle.model],
                    ["Category", selectedVehicle.category],
                    ["Delivery Date", selectedVehicle.deliveryDate || selectedVehicle.l2SubmittedAt || "—"],
                    ["L1 Approved", selectedVehicle.l1ApprovedAt || "—"],
                    ["L2 Submitted", selectedVehicle.l2SubmittedAt || "—"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-medium text-foreground">{v}</p>
                    </div>
                  ))}
                </div>

                {/* Doc type selector */}
                {selectedVehicle.status === "L2_SUBMITTED" && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Verification Type</p>
                    <div className="flex gap-2">
                      {(["new_purchase", "retrofit"] as const).map((t) => (
                        <button key={t} onClick={() => setDocType(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${docType === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>
                          {t === "new_purchase" ? "New Purchase" : "Retrofitment"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">L2 Documents</p>
                  <div className="space-y-2">
                    {(docType === "new_purchase" ? newPurchaseDocs : retrofitDocs).map((doc) => (
                      <div key={doc.key} className="flex items-center gap-2 p-2.5 rounded-lg border border-green-200 bg-green-50">
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                        <span className="text-sm flex-1">{doc.name}</span>
                        <button className="text-xs text-primary font-medium hover:underline">View</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incentive info */}
                {selectedVehicle.onboardingType === "MIC_ASSISTED" && selectedVehicle.status === "L2_SUBMITTED" && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-xs font-semibold text-primary mb-1">Incentive-Eligible Vehicle</p>
                    <p className="text-xs text-muted-foreground">Upon L2 approval, physical card order will be placed automatically and incentive disbursement will be triggered.</p>
                  </div>
                )}

                {/* Action */}
                {selectedVehicle.status === "L2_SUBMITTED" && !processed[selectedVehicle.id] && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Decision</p>
                    {action === "reject" && (
                      <div className="mb-3">
                        <label className="text-xs font-medium text-muted-foreground">Rejection Reason <span className="text-destructive">*</span></label>
                        <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)}
                          placeholder="Provide clear reasons with specific document issues..."
                          className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {action !== "reject" ? (
                        <button onClick={() => setAction("reject")}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/40 text-destructive text-sm font-medium hover:bg-destructive/5">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      ) : (
                        <>
                          <button onClick={() => setAction(null)} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
                          <button onClick={handleReject} disabled={!comment}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 disabled:opacity-40">
                            <XCircle className="w-4 h-4" /> Confirm Reject
                          </button>
                        </>
                      )}
                      {action !== "reject" && (
                        <button onClick={handleApprove}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                          <CheckCircle className="w-4 h-4" /> Approve L2 & Place Card Order
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {processed[selectedVehicle.id] && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${processed[selectedVehicle.id] === "approved" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    {processed[selectedVehicle.id] === "approved" ? (
                      <><CheckCircle className="w-4 h-4 text-green-600" /><p className="text-sm text-green-700 font-medium">L2 Approved — Physical card order placed</p></>
                    ) : (
                      <><XCircle className="w-4 h-4 text-red-600" /><p className="text-sm text-red-700 font-medium">L2 Rejected — FO notified via SMS & email</p></>
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
