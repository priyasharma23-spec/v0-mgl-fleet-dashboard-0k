"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface IncentiveSlabRow {
  segment: string
  minAge: number
  maxAge: number | null
  incentive: number
  tdsRate: number
}

interface IncentiveApprovalData {
  id: string
  vehicleNumber: string
  segment: "LCV" | "3W" | "2W" | "HCV"
  quantity: number
  age?: number
  panStatus: "with-pan" | "without-pan"
  applicableSlabs: IncentiveSlabRow[]
  eligibleSlab: IncentiveSlabRow | null
}

const mockIncentiveData: IncentiveApprovalData[] = [
  {
    id: "1",
    vehicleNumber: "DL-01-AB-1234",
    segment: "LCV",
    quantity: 5,
    age: 2,
    panStatus: "with-pan",
    applicableSlabs: [
      { segment: "LCV", minAge: 0, maxAge: 1, incentive: 80000, tdsRate: 10 },
      { segment: "LCV", minAge: 1, maxAge: 3, incentive: 60000, tdsRate: 10 },
      { segment: "LCV", minAge: 3, maxAge: null, incentive: 40000, tdsRate: 10 },
    ],
    eligibleSlab: { segment: "LCV", minAge: 1, maxAge: 3, incentive: 60000, tdsRate: 10 },
  },
  {
    id: "2",
    vehicleNumber: "DL-01-AB-5678",
    segment: "3W",
    quantity: 10,
    panStatus: "without-pan",
    applicableSlabs: [
      { segment: "3W", minAge: 0, maxAge: 2, incentive: 50000, tdsRate: 20 },
      { segment: "3W", minAge: 2, maxAge: null, incentive: 30000, tdsRate: 20 },
    ],
    eligibleSlab: { segment: "3W", minAge: 0, maxAge: 2, incentive: 50000, tdsRate: 20 },
  },
]

interface IncentiveApprovalModalProps {
  data: IncentiveApprovalData
  onApprove: (data: IncentiveApprovalData, auditNotes: string) => void
  onReject: (data: IncentiveApprovalData, auditNotes: string) => void
  onClose: () => void
}

export function IncentiveApprovalModal({
  data,
  onApprove,
  onReject,
  onClose,
}: IncentiveApprovalModalProps) {
  const [auditNotes, setAuditNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const slab = data.eligibleSlab
  if (!slab) return null

  const grossIncentive = slab.incentive * data.quantity
  const tdsAmount = grossIncentive * (slab.tdsRate / 100)
  const netIncentive = grossIncentive - tdsAmount

  const handleApprove = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onApprove(data, auditNotes)
    setIsProcessing(false)
  }

  const handleReject = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onReject(data, auditNotes)
    setIsProcessing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Incentive Approval</h2>
            <p className="text-sm text-muted-foreground mt-1">Vehicle: {data.vehicleNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl"
          >
            ✕
          </button>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Segment</p>
            <p className="text-sm font-semibold text-foreground">{data.segment}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold">Quantity</p>
            <p className="text-sm font-semibold text-foreground">{data.quantity} vehicles</p>
          </div>
          {data.age !== undefined && (
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Vehicle Age (Retrofit)</p>
              <p className="text-sm font-semibold text-foreground">{data.age} years</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground font-semibold">PAN Status</p>
            <p className="text-sm font-semibold text-foreground">
              {data.panStatus === "with-pan" ? "With PAN" : "Without PAN"}
            </p>
          </div>
        </div>

        {/* Incentive Slabs Table */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Applicable Incentive Slabs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Vehicle Age
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Incentive/Unit
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                    TDS Rate
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.applicableSlabs.map((row, idx) => {
                  const isEligible =
                    row.minAge === slab.minAge && row.maxAge === slab.maxAge
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-border ${
                        isEligible
                          ? "bg-primary/10"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <td className="px-3 py-3 text-foreground font-semibold">
                        {row.minAge} - {row.maxAge === null ? "Above" : row.maxAge} years
                      </td>
                      <td className="px-3 py-3 text-foreground font-semibold">
                        ₹{row.incentive.toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-foreground">{row.tdsRate}%</td>
                      <td className="px-3 py-3">
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            <CheckCircle className="w-3 h-3" />
                            Eligible
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incentive Calculation */}
        <div className="space-y-3 mb-6 p-4 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Gross Incentive</span>
            <span className="text-sm font-semibold text-foreground">
              ₹{grossIncentive.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              TDS ({slab.tdsRate}%)
            </span>
            <span className="text-sm font-semibold text-red-600">
              -₹{tdsAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-3">
            <span className="text-sm font-semibold text-foreground">Net Incentive</span>
            <span className="text-lg font-bold text-green-600">
              ₹{netIncentive.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Audit Notes */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Audit Notes
          </label>
          <textarea
            value={auditNotes}
            onChange={(e) => setAuditNotes(e.target.value)}
            placeholder="Add any audit notes or comments for this approval..."
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            {isProcessing ? "Processing..." : "Reject"}
          </button>
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isProcessing ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function IncentiveApprovalPage() {
  const [approvals, setApprovals] = useState(mockIncentiveData)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [completedActions, setCompletedActions] = useState<
    Record<string, "approved" | "rejected">
  >({})

  const selectedData = approvals.find((a) => a.id === selectedId)

  const handleApprove = (data: IncentiveApprovalData, notes: string) => {
    setCompletedActions((prev) => ({ ...prev, [data.id]: "approved" }))
    setSelectedId(null)
    console.log("[v0] Approved incentive:", data.id, "Notes:", notes)
  }

  const handleReject = (data: IncentiveApprovalData, notes: string) => {
    setCompletedActions((prev) => ({ ...prev, [data.id]: "rejected" }))
    setSelectedId(null)
    console.log("[v0] Rejected incentive:", data.id, "Notes:", notes)
  }

  const pendingCount = approvals.filter((a) => !completedActions[a.id]).length

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Incentive Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve vehicle incentive applications
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground font-semibold mb-1">Total Pending</p>
            <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground font-semibold mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">
              {Object.values(completedActions).filter((a) => a === "approved").length}
            </p>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <p className="text-xs text-muted-foreground font-semibold mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {Object.values(completedActions).filter((a) => a === "rejected").length}
            </p>
          </div>
        </div>

        {/* Approvals List */}
        <div className="space-y-3">
          {approvals.map((approval) => {
            const status = completedActions[approval.id]
            const slab = approval.eligibleSlab
            if (!slab) return null

            const grossIncentive = slab.incentive * approval.quantity
            const tdsAmount = grossIncentive * (slab.tdsRate / 100)
            const netIncentive = grossIncentive - tdsAmount

            return (
              <button
                key={approval.id}
                onClick={() => setSelectedId(approval.id)}
                disabled={!!status}
                className="w-full text-left p-4 bg-card border border-border rounded-lg hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {approval.vehicleNumber}
                      </h3>
                      <span className="px-2 py-1 bg-muted text-xs font-semibold text-muted-foreground rounded">
                        {approval.segment}
                      </span>
                      {status && (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {status === "approved" ? "✓ Approved" : "✗ Rejected"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {approval.quantity} vehicle
                      {approval.quantity > 1 ? "s" : ""} • Net Incentive: ₹
                      {netIncentive.toLocaleString()}
                    </p>
                  </div>
                  {!status && (
                    <AlertCircle className="w-5 h-5 text-yellow-600 group-hover:text-primary transition-colors" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {pendingCount === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              All approvals completed
            </h3>
            <p className="text-muted-foreground">
              No more incentive applications pending review
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedData && (
        <IncentiveApprovalModal
          data={selectedData}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
