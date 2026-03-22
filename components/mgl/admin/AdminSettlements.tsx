"use client"

import { useState } from "react"
import { Download, Eye, X, CheckCircle, Clock, PauseCircle, XCircle } from "lucide-react"

export default function AdminSettlements({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showTxns, setShowTxns] = useState(false)

  const settlementData = [
    {
      id: "SETL001",
      dateTime: "Mar 21, 2024 10:30 AM",
      dealership: "ABC Motors",
      totalAmount: 152000,
      totalFee: 1520,
      totalTaxes: 15200,
      netAmount: 135280,
      status: "Settled",
      transactionFrom: "Mar 21, 2024 00:00",
      transactionTill: "Mar 21, 2024 23:59",
      settlementDate: "Mar 22, 2024",
      bankUTR: "UTR123456789",
      bankAccount: "****4521",
      bankName: "HDFC Bank",
      transactions: [
        { txnId: "TXN001", dateTime: "Mar 21, 2024 10:30 AM", dealership: "ABC Motors", posId: "POS-001", amount: 50000, fee: 500, taxes: 5000 },
        { txnId: "TXN004", dateTime: "Mar 21, 2024 09:30 AM", dealership: "ABC Motors", posId: "POS-001", amount: 102000, fee: 1020, taxes: 10200 },
      ]
    },
    {
      id: "SETL002",
      dateTime: "Mar 20, 2024 04:00 PM",
      dealership: "XYZ Auto",
      totalAmount: 87500,
      totalFee: 875,
      totalTaxes: 8750,
      netAmount: 77875,
      status: "Pending",
      transactionFrom: "Mar 20, 2024 00:00",
      transactionTill: "Mar 20, 2024 23:59",
      settlementDate: "Mar 21, 2024",
      bankUTR: "UTR987654321",
      bankAccount: "****8765",
      bankName: "ICICI Bank",
      transactions: [
        { txnId: "TXN002", dateTime: "Mar 21, 2024 10:15 AM", dealership: "XYZ Auto", posId: "POS-002", amount: 15000, fee: 150, taxes: 1500 },
        { txnId: "TXN006", dateTime: "Mar 20, 2024 04:00 PM", dealership: "XYZ Auto", posId: "POS-002", amount: 72500, fee: 725, taxes: 7250 },
      ]
    },
  ]

  const filteredSettlements = settlementData.filter(s => 
    (statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase()) &&
    (s.dealership.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Settled": return "bg-green-50 text-green-700 border border-green-200"
      case "Pending": return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      case "Processing": return "bg-blue-50 text-blue-700 border border-blue-200"
      case "On Hold": return "bg-orange-50 text-orange-700 border border-orange-200"
      case "Failed": return "bg-red-50 text-red-700 border border-red-200"
      default: return "bg-gray-50 text-gray-700 border border-gray-200"
    }
  }

  const summaryStats = {
    settled: settlementData.filter(s => s.status === "Settled").reduce((sum, s) => sum + s.netAmount, 0),
    upcoming: settlementData.filter(s => s.status === "Pending" || s.status === "Processing").reduce((sum, s) => sum + s.netAmount, 0),
    onHold: settlementData.filter(s => s.status === "On Hold").reduce((sum, s) => sum + s.totalAmount, 0),
    failed: settlementData.filter(s => s.status === "Failed").reduce((sum, s) => sum + s.totalAmount, 0),
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Settlements</h1>
          <p className="text-sm text-muted-foreground">Monitor settlement status and dealership-wise summary</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm font-medium text-green-800">Today</p>
          </div>
          <p className="text-2xl font-bold text-green-900">₹{(summaryStats.settled / 100000).toFixed(1)}L</p>
          <p className="text-xs text-green-700 mt-1">{settlementData.filter(s => s.status === "Settled").length} dealerships</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">Upcoming</p>
          </div>
          <p className="text-2xl font-bold text-amber-900">₹{(summaryStats.upcoming / 100000).toFixed(1)}L</p>
          <p className="text-xs text-amber-700 mt-1">{settlementData.filter(s => s.status === "Pending" || s.status === "Processing").length} dealerships</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <PauseCircle className="w-4 h-4 text-orange-600" />
            <p className="text-sm font-medium text-orange-800">On Hold</p>
          </div>
          <p className="text-2xl font-bold text-orange-900">₹{(summaryStats.onHold / 100000).toFixed(1)}L</p>
          <p className="text-xs text-orange-700 mt-1">{settlementData.filter(s => s.status === "On Hold").length} dealerships</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm font-medium text-red-800">Failed</p>
          </div>
          <p className="text-2xl font-bold text-red-900">₹{(summaryStats.failed / 100000).toFixed(1)}L</p>
          <p className="text-xs text-red-700 mt-1">{settlementData.filter(s => s.status === "Failed").length} dealerships</p>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search by dealership or settlement ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground">
          <option value="all">All Status</option>
          <option value="settled">Settled</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="on hold">On Hold</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Date & Time</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Dealership</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Total Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Fee</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Taxes</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Net Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSettlements.map(settlement => (
                <tr key={settlement.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-muted-foreground">{settlement.dateTime}</td>
                  <td className="px-4 py-3 font-medium">{settlement.dealership}</td>
                  <td className="px-4 py-3">₹{settlement.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">₹{settlement.totalFee.toLocaleString()}</td>
                  <td className="px-4 py-3">₹{settlement.totalTaxes.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold">₹{settlement.netAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(settlement.status)}`}>
                      {settlement.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelectedSettlement(settlement); setSelectedTransaction(null); setShowTxns(false); }}
                      className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(selectedSettlement || selectedTransaction) && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => { setSelectedSettlement(null); setSelectedTransaction(null); }}
        />
      )}

      {selectedSettlement && !selectedTransaction && (
        <div className={`fixed bottom-0 right-0 top-0 w-96 bg-card border-l border-border shadow-lg overflow-y-auto z-50 border-t-4 transform transition-transform duration-300 border-t-green-600`}>
          <div className="sticky top-0 bg-card border-b border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Settlement Details</h2>
              <button onClick={() => { setSelectedSettlement(null); setSelectedTransaction(null); setShowTxns(false); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <span className="text-sm font-mono text-muted-foreground">{selectedSettlement.id}</span>
          </div>

          {showTxns ? (
            <div className="p-4 space-y-4">
              <button onClick={() => setShowTxns(false)} className="flex items-center gap-2 text-sm text-primary hover:underline">← Back</button>
              <div>
                <h3 className="font-bold text-foreground">Settlement Transactions</h3>
                <p className="text-xs text-muted-foreground">{selectedSettlement.id}</p>
              </div>
              {(() => {
                const successTxns = selectedSettlement.transactions?.filter((t: any) => t.status === 'Success') || []
                return (
                  <>
                    <div className="flex gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                      <div><p className="text-xs text-muted-foreground">Successful</p><p className="font-bold">{successTxns.length}</p></div>
                      <div><p className="text-xs text-muted-foreground">Total Amount</p><p className="font-bold">₹{(successTxns.reduce((s: number, t: any) => s + t.amount, 0) || 0).toLocaleString()}</p></div>
                    </div>
                    <p className="text-xs text-muted-foreground italic">Showing successful transactions in this settlement cycle</p>
                    <div className="space-y-2">
                      {successTxns.map((txn: any) => (
                        <div key={txn.txnId} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50">
                          <div className="flex-1"><p className="text-xs font-mono font-semibold">{txn.txnId}</p><p className="text-xs text-muted-foreground">{txn.dateTime}</p></div>
                          <div className="text-right"><p className="font-bold text-sm">₹{txn.amount.toLocaleString()}</p><span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Success</span></div>
                        </div>
                      ))}
                    </div>
                  </>
                )
              })()}
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground">Transaction Period</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction From:</span>
                    <span className="font-semibold">{selectedSettlement.transactionFrom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Till:</span>
                    <span className="font-semibold">{selectedSettlement.transactionTill}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">Settlement Information</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Settlement ID:</span>
                    <span className="font-mono text-xs">{selectedSettlement.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedSettlement.status)}`}>
                      {selectedSettlement.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Settlement Date:</span>
                    <span className="font-semibold">{selectedSettlement.settlementDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank UTR:</span>
                    <span className="font-mono text-xs">{selectedSettlement.bankUTR}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-mono text-xs">{selectedSettlement.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-semibold">{selectedSettlement.bankName}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">Net Amount Breakdown</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold">₹{selectedSettlement.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee:</span>
                    <span className="font-semibold text-red-600">-₹{selectedSettlement.totalFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes:</span>
                    <span className="font-semibold text-red-600">-₹{selectedSettlement.totalTaxes.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3 flex justify-between">
                    <span className="text-muted-foreground">Net Amount:</span>
                    <span className="text-lg font-bold text-green-600">₹{selectedSettlement.netAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowTxns(true)} className="w-full py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors">
                View Transactions ({selectedSettlement.transactions?.length || 0})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
