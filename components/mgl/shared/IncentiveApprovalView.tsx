"use client"
import { useState, useMemo } from "react"
import { CheckCircle, XCircle, Clock, Gift, Eye } from "lucide-react"
import { mockVehicles, mockMOUIncentiveConfigs } from "@/lib/mgl-data"

type Role = "admin" | "zic" | "finance"

interface Props {
  role?: Role
}

interface SlabBonus {
  id: string
  mouId: string
  foName: string
  category: "HCV" | "ICV" | "LCV" | "Bus"
  vehicleType: "new_purchase" | "retrofit"
  slabNumber: number
  slabRange: string
  vehiclesInSlab: number
  slabSize: number
  completed: boolean
  grossAmount: number
  tds: number
  netAmount: number
  status: "pending_completion" | "eligible" | "pending_approval" | "approved" | "paid"
  vehicles: string[]
}

const STATUS_CONFIG: Record<SlabBonus["status"], { label: string; bg: string; text: string }> = {
  pending_completion: { label: "In progress",         bg: "bg-amber-100",   text: "text-amber-700" },
  eligible:           { label: "Eligible",            bg: "bg-amber-100",   text: "text-amber-700" },
  pending_approval:   { label: "Pending approval",    bg: "bg-purple-100",  text: "text-purple-700" },
  approved:           { label: "Approved",            bg: "bg-blue-100",    text: "text-blue-700" },
  paid:               { label: "Paid",                bg: "bg-green-100",   text: "text-green-700" },
}

export default function IncentiveApprovalView({ role = "zic" }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("eligible")
  const [selectedBonus, setSelectedBonus] = useState<SlabBonus | null>(null)
  const [approvalNote, setApprovalNote] = useState("")
  const [actionDone, setActionDone] = useState<Record<string, "approved" | "rejected">>({})

  const slabBonuses = useMemo(() => {
    const bonuses: SlabBonus[] = []
    const mouVehicles = mockVehicles.filter(v =>
      v.onboardingType === "MIC_ASSISTED" && v.mouId && v.vehicleType
    )

    mockMOUIncentiveConfigs.forEach(config => {
      config.slabs.forEach(slab => {
        const categories = ["HCV", "ICV", "LCV", "Bus"] as const
        const types = ["new_purchase", "retrofit"] as const

        categories.forEach(cat => {
          types.forEach(vType => {
            const slabVehicles = mouVehicles.filter(v =>
              v.mouId === config.mouId &&
              v.category === cat &&
              v.vehicleType === vType &&
              (v.categorySequence ?? 0) >= slab.fromVehicle &&
              (v.categorySequence ?? 0) <= slab.toVehicle
            )

            if (slabVehicles.length === 0) return

            const approvedCount = slabVehicles.filter(v =>
              v.l1ApprovedAt || v.status === "CARD_ACTIVE" || v.status === "L2_SUBMITTED" || 
              v.status === "L2_APPROVED" || v.status === "CARD_PRINTED" || v.status === "CARD_DISPATCHED"
            ).length

            const slabCompletionSize = slab.toVehicle - slab.fromVehicle + 1
            const completed = approvedCount >= slabCompletionSize
            const rate = slab.rates[vType][cat]
            const gross = rate * slabVehicles.length
            const tds = Math.round(gross * 0.1)

            // Derive status from vehicle incentive statuses
            const hasPaid = slabVehicles.every(v => v.incentiveStatus === "paid")
            const hasApproved = slabVehicles.some(v => v.incentiveStatus === "approved")
            const hasEligible = slabVehicles.some(v => v.incentiveStatus === "eligible")
            const status: SlabBonus["status"] = hasPaid ? "paid" : hasApproved ? "approved" : hasEligible ? "eligible" : completed ? "pending_approval" : "pending_completion"

            bonuses.push({
              id: `${config.mouId}__${cat}__${vType}__${slab.slabNumber}`,
              mouId: config.mouId,
              foName: slabVehicles[0].foName,
              category: cat,
              vehicleType: vType,
              slabNumber: slab.slabNumber,
              slabRange: `Vehicles ${slab.fromVehicle}–${slab.toVehicle}`,
              vehiclesInSlab: slabVehicles.length,
              slabSize: slabCompletionSize,
              completed,
              grossAmount: gross,
              tds,
              netAmount: gross - tds,
              status,
              vehicles: slabVehicles.map(v => v.vehicleNumber || v.id),
            })
          })
        })
      })
    })

    return bonuses
  }, [])

  const filtered = slabBonuses.filter(b => {
    const matchSearch = !search ||
      b.mouId.toLowerCase().includes(search.toLowerCase()) ||
      b.foName.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicles.some(v => v.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === "all" || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    pending_completion: slabBonuses.filter(b => b.status === "pending_completion").length,
    eligible: slabBonuses.filter(b => b.status === "eligible").length,
    pending_approval: slabBonuses.filter(b => b.status === "pending_approval").length,
    approved: slabBonuses.filter(b => b.status === "approved").length,
    paid: slabBonuses.filter(b => b.status === "paid").length,
  }

  const handleApprove = (bonusId: string) => {
    setActionDone(prev => ({ ...prev, [bonusId]: "approved" }))
    setSelectedBonus(null)
    setApprovalNote("")
  }

  const handleReject = (bonusId: string) => {
    setActionDone(prev => ({ ...prev, [bonusId]: "rejected" }))
    setSelectedBonus(null)
    setApprovalNote("")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Incentive Approvals</h1>
          <p className="text-base text-muted-foreground">Review and approve slab completion bonuses for Fleet Operators</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "In Progress",       value: counts.pending_completion, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-200", accent: "bg-amber-100", status: "pending_completion" },
            { label: "Eligible",          value: counts.eligible,           color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-200", accent: "bg-amber-100", status: "eligible"           },
            { label: "Pending Approval",  value: counts.pending_approval,   color: "text-purple-600", bg: "bg-purple-500/10", border: "border-purple-200", accent: "bg-purple-100", status: "pending_approval" },
            { label: "Approved",          value: counts.approved,           color: "text-blue-600",   bg: "bg-blue-500/10",   border: "border-blue-200",   accent: "bg-blue-100",   status: "approved"         },
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

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search MOU, FO names, vehicles..."
              className="w-full px-4 py-3 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-border rounded-lg text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-fit">
            <option value="all">All Status</option>
            <option value="pending_completion">In Progress</option>
            <option value="eligible">Eligible</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["MOU", "FO Name", "Category", "Type", "Slab", "Range", "Vehicles", "Gross Amount", "Net Amount", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr><td colSpan={11} className="px-4 py-12 text-center text-sm text-muted-foreground">No slab bonuses found</td></tr>
                )}
                {filtered.map(b => {
                  const actualStatus = actionDone[b.id] === "approved" ? "approved" : actionDone[b.id] === "rejected" ? "pending_completion" : b.status
                  const cfg = STATUS_CONFIG[actualStatus as SlabBonus["status"]]
                  return (
                    <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{b.mouId}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground truncate">{b.foName}</td>
                      <td className="px-4 py-3 text-xs font-medium">{b.category}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{b.vehicleType === "new_purchase" ? "New" : "Retrofit"}</td>
                      <td className="px-4 py-3 text-xs font-medium text-center">{b.slabNumber}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{b.slabRange}</td>
                      <td className="px-4 py-3 text-xs text-center">
                        <span className={`font-medium ${b.vehiclesInSlab >= b.slabSize ? "text-green-700" : "text-amber-700"}`}>
                          {b.vehiclesInSlab}/{b.slabSize}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-green-700">₹{b.grossAmount.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 font-bold text-green-700">₹{b.netAmount.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-colors ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelectedBonus(b)}
                            className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors" title="View details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {(actualStatus === "eligible" || actualStatus === "pending_approval") && (role === "zic" || role === "admin") && !actionDone[b.id] && (
                            <>
                              <button onClick={() => handleApprove(b.id)}
                                className="p-1.5 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(b.id)}
                                className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {actionDone[b.id] && (
                            <span className={`text-xs font-medium ${actionDone[b.id] === "approved" ? "text-green-600" : "text-red-600"}`}>
                              {actionDone[b.id] === "approved" ? "✓ Approved" : "✗ Rejected"}
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
        {selectedBonus && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedBonus(null)} />
            <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50 overflow-y-auto flex flex-col">
              <div className="sticky top-0 bg-gradient-to-b from-card via-card to-muted/5 border-b border-border p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-foreground">Slab {selectedBonus.slabNumber} Bonus</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedBonus.mouId} • {selectedBonus.category} • {selectedBonus.vehicleType === "new_purchase" ? "New Purchase" : "Retrofitment"}</p>
                </div>
                <button onClick={() => setSelectedBonus(null)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                {/* Slab Details */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Slab Details</p>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-2.5">
                    {[
                      ["MOU Number", selectedBonus.mouId],
                      ["Category", selectedBonus.category],
                      ["Vehicle Type", selectedBonus.vehicleType === "new_purchase" ? "New Purchase" : "Retrofitment"],
                      ["Slab Range", selectedBonus.slabRange],
                      ["Fleet Operator", selectedBonus.foName],
                      ["Vehicles Registered", `${selectedBonus.vehiclesInSlab} of ${selectedBonus.slabSize}`],
                      ["Slab Complete", selectedBonus.vehiclesInSlab >= selectedBonus.slabSize ? "Yes" : `${selectedBonus.slabSize - selectedBonus.vehiclesInSlab} more needed`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-b-0">
                        <span className="text-xs text-muted-foreground font-medium">{label}</span>
                        <span className="text-sm font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amount Breakdown */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount Breakdown</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2.5">
                    <div className="flex items-center justify-between py-1.5 border-b border-green-200">
                      <span className="text-xs text-green-700 font-medium">Gross Amount</span>
                      <span className="text-sm font-bold text-green-700">₹{selectedBonus.grossAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-green-200">
                      <span className="text-xs text-red-600 font-medium">TDS (10%)</span>
                      <span className="text-sm font-bold text-red-600">₹{selectedBonus.tds.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5">
                      <span className="text-xs text-green-700 font-bold">Net Amount</span>
                      <span className="text-lg font-bold text-green-700">₹{selectedBonus.netAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicles in Slab */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicles in This Slab</p>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: selectedBonus.slabSize }, (_, i) => {
                      const seq = selectedBonus.slabNumber === 1 ? i + 1 : (selectedBonus.slabNumber - 1) * selectedBonus.slabSize + i + 1
                      const v = mockVehicles.find(x =>
                        x.mouId === selectedBonus.mouId &&
                        x.category === selectedBonus.category &&
                        x.vehicleType === selectedBonus.vehicleType &&
                        x.categorySequence === seq
                      )
                      const status = v?.incentiveStatus
                      return (
                        <div key={i} className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${
                          status === "paid" ? "bg-green-50 border-green-200" :
                          status === "approved" ? "bg-blue-50 border-blue-200" :
                          status === "eligible" ? "bg-amber-50 border-amber-200" :
                          status === "not_eligible" ? "bg-gray-50 border-gray-200" :
                          "bg-muted/50 border-dashed border-border"
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            status === "paid" ? "bg-green-500 text-white" :
                            status === "approved" ? "bg-blue-500 text-white" :
                            status === "eligible" ? "bg-amber-500 text-white" :
                            status === "not_eligible" ? "bg-gray-300 text-gray-600" :
                            "bg-muted text-muted-foreground border-2 border-dashed border-border"
                          }`}>
                            {v ? seq : "—"}
                          </div>
                          <span className={`text-[9px] font-medium text-center leading-tight ${
                            status === "paid" ? "text-green-700" :
                            status === "approved" ? "text-blue-700" :
                            status === "eligible" ? "text-amber-700" :
                            status === "not_eligible" ? "text-gray-500" :
                            "text-muted-foreground"
                          }`}>
                            {status === "paid" ? "Paid" :
                             status === "approved" ? "Approved" :
                             status === "eligible" ? "Eligible" :
                             status === "not_eligible" ? "Not eligible" :
                             "Empty"}
                          </span>
                          {v && (
                            <span className="text-[8px] text-muted-foreground font-mono truncate w-full text-center">
                              {v.vehicleNumber?.slice(-4) || v.id.slice(-4)}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                    {[
                      { color: "bg-green-500", label: "Paid" },
                      { color: "bg-blue-500", label: "Approved" },
                      { color: "bg-amber-500", label: "Eligible" },
                      { color: "bg-gray-300", label: "Not eligible" },
                      { color: "bg-muted border-2 border-dashed border-border", label: "Empty slot" },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-[10px] text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approval action */}
                {(selectedBonus.status === "eligible" || selectedBonus.status === "pending_approval") && !actionDone[selectedBonus.id] && (role === "zic" || role === "admin") && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Approval Decision</p>
                    <textarea value={approvalNote} onChange={e => setApprovalNote(e.target.value)}
                      placeholder="Add a note (optional)..."
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => handleReject(selectedBonus.id)}
                        className="flex-1 py-2.5 border border-red-300 text-red-700 bg-red-50 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button onClick={() => handleApprove(selectedBonus.id)}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    </div>
                  </div>
                )}

                {actionDone[selectedBonus.id] && (
                  <div className={`flex items-start gap-3 p-4 rounded-xl border ${actionDone[selectedBonus.id] === "approved" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                    <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${actionDone[selectedBonus.id] === "approved" ? "text-green-600" : "text-red-600"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${actionDone[selectedBonus.id] === "approved" ? "text-green-900" : "text-red-900"}`}>
                        {actionDone[selectedBonus.id] === "approved" ? "Slab Bonus Approved" : "Slab Bonus Rejected"}
                      </p>
                      <p className={`text-xs mt-1.5 ${actionDone[selectedBonus.id] === "approved" ? "text-green-700" : "text-red-700"}`}>
                        {actionDone[selectedBonus.id] === "approved" ? "The bonus will be processed and credited to the FO wallet." : "The slab completion bonus has been rejected."}
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
