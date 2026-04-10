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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Incentive Approvals</h1>
          <p className="text-base text-muted-foreground">Review and approve vehicle incentive eligibility across MOU categories</p>
        </div>

        {/* KPI Cards - Enhanced with better visual hierarchy */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Not Eligible",     value: incentiveVehicles.filter(v => v.incentiveStatus === "not_eligible").length, color: "text-slate-600", bg: "bg-slate-500/10", border: "border-slate-200", accent: "bg-slate-100", status: "not_eligible" },
            { label: "Eligible",         value: counts.eligible,  color: "text-amber-600",  bg: "bg-amber-500/10",  border: "border-amber-200",  accent: "bg-amber-100",  status: "eligible"         },
            { label: "Pending",          value: counts.pending,   color: "text-purple-600", bg: "bg-purple-500/10", border: "border-purple-200", accent: "bg-purple-100", status: "pending_approval" },
            { label: "Approved",         value: counts.approved,  color: "text-blue-600",   bg: "bg-blue-500/10",   border: "border-blue-200",   accent: "bg-blue-100",   status: "approved"         },
            { label: "Paid",             value: counts.paid,      color: "text-green-600",  bg: "bg-green-500/10",  border: "border-green-200",  accent: "bg-green-100",  status: "paid"             },
          ].map(card => (
            <button key={card.status} onClick={() => setStatusFilter(card.status)}
              className={`relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                statusFilter === card.status 
                  ? `${card.bg} ${card.border} shadow-lg scale-105` 
                  : `bg-card ${card.border} hover:${card.bg} hover:shadow-md`
              }`}>
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-lg ${card.accent} flex items-center justify-center`}>
                  <Gift className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{card.label}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Waiting for trigger section - Enhanced styling */}
        {(() => {
          const notEligible = incentiveVehicles.filter(v => v.incentiveStatus === "not_eligible")
          if (notEligible.length === 0) return null

          const groups = new Map<string, typeof notEligible>()
          notEligible.forEach(v => {
            const key = `${v.mouId}__${v.category}__${v.vehicleType}`
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key)!.push(v)
          })

          return (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">Waiting for 2nd Vehicle Trigger</p>
                    <p className="text-sm text-amber-700 mt-0.5">First vehicles in their category that will auto-activate on 2nd vehicle approval</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from(groups.entries()).map(([key, vehicles]) => {
                    const v = vehicles[0]
                    const allInGroup = incentiveVehicles.filter(x =>
                      x.mouId === v.mouId &&
                      x.category === v.category &&
                      x.vehicleType === v.vehicleType
                    )
                    const has2nd = allInGroup.length >= 2
                    const second = allInGroup.find(x => x.categorySequence === 2)

                    return (
                      <div key={key} className="bg-white border border-amber-200 rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm font-semibold text-foreground truncate">{v.vehicleNumber || v.id}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{v.foName}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[11px] font-medium">{v.category}</span>
                              <span className="text-[11px] text-muted-foreground">{v.vehicleType === "new_purchase" ? "New" : "Retrofit"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-amber-100">
                          {has2nd ? (
                            <div className="flex items-center gap-2 text-xs text-green-700 font-medium">
                              <CheckCircle className="w-4 h-4 shrink-0" />
                              <span>2nd vehicle ready</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-amber-700">
                              <Clock className="w-4 h-4 shrink-0" />
                              <span>Waiting for 2nd</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Search + Filter - Refined */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search vehicles, FO names..."
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-fit">
            <option value="all">All Status</option>
            <option value="not_eligible">Not Eligible</option>
            <option value="eligible">Eligible</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Table - Cleaner styling */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Vehicle", "FO", "Category", "Type", "MOU", "Slab", "Amount", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">No vehicles found</td></tr>
                )}
                {filtered.map(v => {
                  const status = actionDone[v.id] === "approved" ? "approved" : actionDone[v.id] === "rejected" ? "not_eligible" : v.incentiveStatus
                  const cfg = STATUS_CONFIG[status ?? "not_eligible"]
                  const amount = v.incentiveAmount ?? getIncentiveAmount(v.mouId ?? "", v.categorySequence ?? 1, v.vehicleType as any ?? "new_purchase", v.category)
                  const slab = v.slabNumber ?? getSlabNumber(v.mouId ?? "", v.categorySequence ?? 1)
                  return (
                    <tr key={v.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{v.vehicleNumber || v.id}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground truncate">{v.foName}</td>
                      <td className="px-4 py-3 text-xs font-medium">{v.category}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{v.vehicleType === "new_purchase" ? "New" : "Retrofit"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.mouId}</td>
                      <td className="px-4 py-3 text-xs font-medium text-center">{slab ?? "—"}</td>
                      <td className="px-4 py-3 font-bold text-green-700">{amount ? `₹${amount.toLocaleString("en-IN")}` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelectedVehicle(v)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors" title="View details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {(status === "eligible" || status === "pending_approval") && (role === "zic" || role === "admin") && !actionDone[v.id] && (
                            <>
                              <button onClick={() => handleApprove(v.id)}
                                className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(v.id)}
                                className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {actionDone[v.id] && (
                            <span className={`text-xs font-medium ${actionDone[v.id] === "approved" ? "text-green-600" : "text-red-600"}`}>
                              {actionDone[v.id] === "approved" ? "✓ Approved" : "✗ Rejected"}
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

        {/* Detail tray - Unified styling */}
        {selectedVehicle && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedVehicle(null)} />
            <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50 overflow-y-auto flex flex-col">
              <div className="sticky top-0 bg-gradient-to-b from-card via-card to-muted/5 border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-foreground">{selectedVehicle.vehicleNumber || selectedVehicle.id}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedVehicle.foName} • {selectedVehicle.category}</p>
                </div>
                <button onClick={() => setSelectedVehicle(null)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {/* Vehicle Details */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vehicle Info</p>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2.5">
                    {[
                      ["Vehicle Number", selectedVehicle.vehicleNumber || selectedVehicle.id],
                      ["Fleet Operator", selectedVehicle.foName],
                      ["OEM", selectedVehicle.oem],
                      ["Category", selectedVehicle.category],
                      ["Type", selectedVehicle.vehicleType === "new_purchase" ? "New Purchase" : "Retrofitment"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium">{label}</span>
                        <span className="text-sm font-semibold text-foreground">{value ?? "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incentive Eligibility */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Eligibility</p>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2.5">
                    {[
                      ["MOU Number", selectedVehicle.mouId],
                      ["Category Sequence", `Vehicle #${selectedVehicle.categorySequence}`],
                      ["Slab", `Slab ${selectedVehicle.slabNumber ?? getSlabNumber(selectedVehicle.mouId ?? "", selectedVehicle.categorySequence ?? 1)}`],
                      ["Status", STATUS_CONFIG[selectedVehicle.incentiveStatus ?? "not_eligible"]?.label],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium">{label}</span>
                        <span className="text-sm font-semibold text-foreground">{value ?? "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incentive Amount */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Incentive Amount</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2.5">
                    {(() => {
                      const amount = selectedVehicle.incentiveAmount ?? getIncentiveAmount(selectedVehicle.mouId ?? "", selectedVehicle.categorySequence ?? 1, selectedVehicle.vehicleType as any ?? "new_purchase", selectedVehicle.category)
                      const tds = amount ? Math.round(amount * 0.1) : 0
                      const net = amount ? Math.round(amount * 0.9) : 0
                      return (
                        <>
                          <div className="flex items-center justify-between py-1.5 border-b border-green-200">
                            <span className="text-xs text-green-700 font-medium">Gross Amount</span>
                            <span className="text-sm font-bold text-green-700">{amount ? `₹${amount.toLocaleString("en-IN")}` : "—"}</span>
                          </div>
                          <div className="flex items-center justify-between py-1.5 border-b border-green-200">
                            <span className="text-xs text-red-600 font-medium">TDS (10%)</span>
                            <span className="text-sm font-bold text-red-600">{tds ? `₹${tds.toLocaleString("en-IN")}` : "—"}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1.5">
                            <span className="text-xs text-green-700 font-bold">Net Amount</span>
                            <span className="text-lg font-bold text-green-700">{net ? `₹${net.toLocaleString("en-IN")}` : "—"}</span>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>

                {/* Approval action */}
                {(selectedVehicle.incentiveStatus === "eligible" || selectedVehicle.incentiveStatus === "pending_approval") && !actionDone[selectedVehicle.id] && (role === "zic" || role === "admin") && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Decision</p>
                    <textarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)}
                      placeholder="Add a note (optional)..."
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => handleReject(selectedVehicle.id)}
                        className="flex-1 py-2.5 border border-red-300 text-red-700 bg-red-50 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button onClick={() => handleApprove(selectedVehicle.id)}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </div>
                )}

                {actionDone[selectedVehicle.id] && (
                  <div className={`flex items-start gap-3 p-4 rounded-xl border ${actionDone[selectedVehicle.id] === "approved" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${actionDone[selectedVehicle.id] === "approved" ? "text-green-600" : "text-red-600"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${actionDone[selectedVehicle.id] === "approved" ? "text-green-900" : "text-red-900"}`}>
                        {actionDone[selectedVehicle.id] === "approved" ? "Incentive Approved" : "Incentive Rejected"}
                      </p>
                      <p className={`text-xs mt-1.5 ${actionDone[selectedVehicle.id] === "approved" ? "text-green-700" : "text-red-700"}`}>
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
    </div>
  )
}
