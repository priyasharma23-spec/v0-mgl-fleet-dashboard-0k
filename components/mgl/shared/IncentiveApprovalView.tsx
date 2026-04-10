"use client"
import { useState } from "react"
import { CheckCircle, XCircle, Clock, Gift, ChevronRight, Search, Filter, Eye } from "lucide-react"
import { mockVehicles, mockFleetOperators, mockMOUIncentiveConfigs, getIncentiveAmount, getSlabNumber } from "@/lib/mgl-data"
import type { IncentiveStatus } from "@/lib/mgl-data"

type Role = "admin" | "zic" | "finance"

interface Props {
  role?: Role
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  not_eligible:     { label: "Not eligible",      bg: "bg-gray-100",   text: "text-gray-600"  },
  eligible:         { label: "Eligible",           bg: "bg-amber-100",  text: "text-amber-700" },
  pending_approval: { label: "Pending approval",   bg: "bg-purple-100", text: "text-purple-700"},
  approved:         { label: "Approved",           bg: "bg-blue-100",   text: "text-blue-700"  },
  paid:             { label: "Paid",               bg: "bg-green-100",  text: "text-green-700" },
  out_of_scope:     { label: "Out of scope",       bg: "bg-gray-100",   text: "text-gray-500"  },
}

export default function IncentiveApprovalView({ role = "zic" }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("eligible")
  const [selectedVehicle, setSelectedVehicle] = useState<typeof mockVehicles[0] | null>(null)
  const [approvalNote, setApprovalNote] = useState("")
  const [actionDone, setActionDone] = useState<Record<string, "approved" | "rejected">>({})

  const incentiveVehicles = mockVehicles.filter(v =>
    v.onboardingType === "MIC_ASSISTED" &&
    v.mouId &&
    v.incentiveStatus &&
    v.incentiveStatus !== "out_of_scope"
  )

  const filtered = incentiveVehicles.filter(v => {
    const matchSearch = !search ||
      (v.vehicleNumber || v.id).toLowerCase().includes(search.toLowerCase()) ||
      v.foName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || v.incentiveStatus === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    eligible: incentiveVehicles.filter(v => v.incentiveStatus === "eligible").length,
    pending: incentiveVehicles.filter(v => v.incentiveStatus === "pending_approval").length,
    approved: incentiveVehicles.filter(v => v.incentiveStatus === "approved").length,
    paid: incentiveVehicles.filter(v => v.incentiveStatus === "paid").length,
  }

  const handleApprove = (vehicleId: string) => {
    setActionDone(prev => ({ ...prev, [vehicleId]: "approved" }))
    setSelectedVehicle(null)
    setApprovalNote("")
  }

  const handleReject = (vehicleId: string) => {
    setActionDone(prev => ({ ...prev, [vehicleId]: "rejected" }))
    setSelectedVehicle(null)
    setApprovalNote("")
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Incentive Approvals</h1>
        <p className="text-sm text-muted-foreground">Review and approve vehicle incentive eligibility</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Eligible",         value: counts.eligible,  color: "text-amber-600",  bg: "bg-amber-100",  status: "eligible"         },
          { label: "Pending Approval", value: counts.pending,   color: "text-purple-600", bg: "bg-purple-100", status: "pending_approval" },
          { label: "Approved",         value: counts.approved,  color: "text-blue-600",   bg: "bg-blue-100",   status: "approved"         },
          { label: "Paid",             value: counts.paid,      color: "text-green-600",  bg: "bg-green-100",  status: "paid"             },
        ].map(card => (
          <button key={card.status} onClick={() => setStatusFilter(card.status)}
            className={`bg-card rounded-xl border p-4 text-left transition-colors ${statusFilter === card.status ? "border-primary" : "border-border hover:border-primary/50"}`}>
            <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <Gift className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by vehicle number or FO name..."
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg text-sm bg-card">
          <option value="all">All Status</option>
          <option value="not_eligible">Not Eligible</option>
          <option value="eligible">Eligible</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Vehicle", "FO", "Category", "Type", "MOU", "Slab", "Amount", "Status", "Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">No vehicles found</td></tr>
              )}
              {filtered.map(v => {
                const status = actionDone[v.id] === "approved" ? "approved" : actionDone[v.id] === "rejected" ? "not_eligible" : v.incentiveStatus
                const cfg = STATUS_CONFIG[status ?? "not_eligible"]
                const amount = v.incentiveAmount ?? getIncentiveAmount(v.mouId ?? "", v.categorySequence ?? 1, v.vehicleType as any ?? "new_purchase", v.category)
                const slab = v.slabNumber ?? getSlabNumber(v.mouId ?? "", v.categorySequence ?? 1)
                return (
                  <tr key={v.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{v.vehicleNumber || v.id}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{v.foName}</td>
                    <td className="px-4 py-3 text-xs">{v.category}</td>
                    <td className="px-4 py-3 text-xs">{v.vehicleType === "new_purchase" ? "New Purchase" : "Retrofitment"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{v.mouId}</td>
                    <td className="px-4 py-3 text-xs text-center">{slab ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-green-700">{amount ? `₹${amount.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedVehicle(v)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary" title="View details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {(status === "eligible" || status === "pending_approval") && (role === "zic" || role === "admin") && !actionDone[v.id] && (
                          <>
                            <button onClick={() => handleApprove(v.id)}
                              className="p-1.5 hover:bg-green-100 rounded-lg text-green-600" title="Approve">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleReject(v.id)}
                              className="p-1.5 hover:bg-red-100 rounded-lg text-red-600" title="Reject">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {actionDone[v.id] && (
                          <span className={`text-xs font-medium ${actionDone[v.id] === "approved" ? "text-green-600" : "text-red-600"}`}>
                            {actionDone[v.id] === "approved" ? "Approved" : "Rejected"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail tray */}
      {selectedVehicle && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedVehicle(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">{selectedVehicle.vehicleNumber || selectedVehicle.id}</h2>
                <p className="text-xs text-muted-foreground">{selectedVehicle.foName} · {selectedVehicle.category}</p>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="p-2 hover:bg-muted rounded-lg">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {/* Vehicle Details */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
                {[
                  ["Vehicle Number", selectedVehicle.vehicleNumber || selectedVehicle.id],
                  ["Fleet Operator", selectedVehicle.foName],
                  ["OEM", selectedVehicle.oem],
                  ["Category", selectedVehicle.category],
                  ["Type", selectedVehicle.vehicleType === "new_purchase" ? "New Purchase" : "Retrofitment"],
                  ["MOU Number", selectedVehicle.mouId],
                  ["Category Sequence", `#${selectedVehicle.categorySequence}`],
                  ["Slab", `Slab ${selectedVehicle.slabNumber ?? getSlabNumber(selectedVehicle.mouId ?? "", selectedVehicle.categorySequence ?? 1)}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value ?? "—"}</span>
                  </div>
                ))}
              </div>

              {/* Incentive Details */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Incentive Details</p>
                {(() => {
                  const amount = selectedVehicle.incentiveAmount ?? getIncentiveAmount(selectedVehicle.mouId ?? "", selectedVehicle.categorySequence ?? 1, selectedVehicle.vehicleType as any ?? "new_purchase", selectedVehicle.category)
                  const slab = selectedVehicle.slabNumber ?? getSlabNumber(selectedVehicle.mouId ?? "", selectedVehicle.categorySequence ?? 1)
                  const mouConfig = mockMOUIncentiveConfigs.find(c => c.mouId === selectedVehicle.mouId)
                  const slabConfig = mouConfig?.slabs.find(s => s.slabNumber === slab)
                  return (
                    <>
                      {[
                        ["Incentive Status", STATUS_CONFIG[selectedVehicle.incentiveStatus ?? "not_eligible"]?.label],
                        ["Gross Amount", amount ? `₹${amount.toLocaleString("en-IN")}` : "—"],
                        ["TDS (10%)", amount ? `₹${Math.round(amount * 0.1).toLocaleString("en-IN")}` : "—"],
                        ["Net Amount", amount ? `₹${Math.round(amount * 0.9).toLocaleString("en-IN")}` : "—"],
                        ["Slab Range", slabConfig ? `Vehicles ${slabConfig.fromVehicle}–${slabConfig.toVehicle}` : "—"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className={`font-medium ${label === "Net Amount" ? "text-green-700 text-base font-bold" : label === "TDS (10%)" ? "text-red-600" : "text-foreground"}`}>{value}</span>
                        </div>
                      ))}
                    </>
                  )
                })()}
              </div>

              {/* Approval action */}
              {(selectedVehicle.incentiveStatus === "eligible" || selectedVehicle.incentiveStatus === "pending_approval") && !actionDone[selectedVehicle.id] && (role === "zic" || role === "admin") && (
                <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Approval Decision</p>
                  <textarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)}
                    placeholder="Add a note (optional)..."
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card resize-none" />
                  <div className="flex gap-3">
                    <button onClick={() => handleReject(selectedVehicle.id)}
                      className="flex-1 py-2.5 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button onClick={() => handleApprove(selectedVehicle.id)}
                      className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
              )}

              {actionDone[selectedVehicle.id] && (
                <div className={`flex items-start gap-3 p-4 rounded-xl ${actionDone[selectedVehicle.id] === "approved" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${actionDone[selectedVehicle.id] === "approved" ? "text-green-600" : "text-red-600"}`} />
                  <div>
                    <p className={`text-sm font-semibold ${actionDone[selectedVehicle.id] === "approved" ? "text-green-900" : "text-red-900"}`}>
                      {actionDone[selectedVehicle.id] === "approved" ? "Incentive Approved" : "Incentive Rejected"}
                    </p>
                    <p className={`text-xs mt-0.5 ${actionDone[selectedVehicle.id] === "approved" ? "text-green-700" : "text-red-700"}`}>
                      {actionDone[selectedVehicle.id] === "approved" ? "Incentive will be credited to the FO wallet after payment processing." : "The incentive eligibility has been rejected."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
