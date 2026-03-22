"use client"

import { useState } from "react"
import { Download, Eye, X, Search, Filter } from "lucide-react"

export default function AdminTransactions({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [type, setType] = useState<"POS" | "Load">("POS")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  const posTransactions = [
    { 
      id: "42288", 
      date: "02/03/2026", 
      time: "01:33 PM", 
      type: "debit", 
      card: "xxxxxxxxxxxx1138", 
      channel: "pos", 
      product: "cng", 
      amount: 14947, 
      openingBalance: 58469, 
      closingBalance: 43522, 
      station: "MGL Hind CNG Filling Station", 
      merchantCode: "100069", 
      driver: "", 
      vehicle: "MH47BY2770", 
      reversedBy: "", 
      reversalOf: "", 
      status: "Successful" as const 
    },
    { 
      id: "42287", 
      date: "02/03/2026", 
      time: "01:24 PM", 
      type: "debit", 
      card: "xxxxxxxxxxxx3175", 
      channel: "pos", 
      product: "cng", 
      amount: 3260.6, 
      openingBalance: 30742.9, 
      closingBalance: 27482.3, 
      station: "MGL Amul Chemicals Thane Belapur Road Rabale", 
      merchantCode: "100119", 
      driver: "", 
      vehicle: "MH47BY1688", 
      reversedBy: "", 
      reversalOf: "", 
      status: "Successful" as const 
    },
  ]

  const loadTransactions = [
    { id: "LOAD001", dateTime: "Mar 21, 2024 11:00 AM", fo: "ABC Logistics", amount: "₹50,000", status: "Successful" as const },
    { id: "LOAD002", dateTime: "Mar 21, 2024 10:45 AM", fo: "Sunrise Transport", amount: "₹2,500", status: "Failed" as const },
    { id: "LOAD003", dateTime: "Mar 20, 2024 06:00 PM", fo: "National Logistics", amount: "₹45,000", status: "Pending" as const },
    { id: "LOAD004", dateTime: "Mar 20, 2024 02:30 PM", fo: "Metro Freight", amount: "₹75,000", status: "Processing" as const },
    { id: "LOAD005", dateTime: "Mar 20, 2024 11:00 AM", fo: "City Express", amount: "₹30,000", status: "Successful" as const },
  ]

  const parseAmount = (amt) => typeof amt === 'number' ? amt : parseInt((amt || '0').replace(/[₹,]/g, '')) || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful": return "bg-green-50 text-green-700 border border-green-200"
      case "Failed": return "bg-red-50 text-red-700 border border-red-200"
      case "Pending": return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      case "Processing": return "bg-blue-50 text-blue-700 border border-blue-200"
      default: return "bg-gray-50 text-gray-700 border border-gray-200"
    }
  }

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "Successful": return "border-t-green-600"
      case "Failed": return "border-t-red-600"
      case "Pending": return "border-t-yellow-600"
      case "Processing": return "border-t-blue-600"
      default: return "border-t-gray-600"
    }
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (statusFilter !== "all") count++
    if (fromDate) count++
    if (toDate) count++
    return count
  }

  const successful = posTransactions.filter(t => t.status === "Successful")
  const pendingProcessing = posTransactions.filter(t => t.status === "Pending" || t.status === "Processing")
  const failed = posTransactions.filter(t => t.status === "Failed")
  const totalAmount = posTransactions.reduce((sum, t) => sum + parseAmount(t.amount), 0)

  const lSuccessful = loadTransactions.filter(t => t.status === "Successful")
  const lPending = loadTransactions.filter(t => t.status === "Pending")
  const lFailed = loadTransactions.filter(t => t.status === "Failed")
  const totalLoadAmount = loadTransactions.reduce((sum, t) => sum + parseAmount(t.amount), 0)

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">Monitor all transaction statuses</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Search Row */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm bg-card"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted relative">
          <Filter className="w-4 h-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel - sibling, no shared wrapper */}
      {showFilters && (
        <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              >
                <option value="all">All</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Channel</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "POS" | "Load")}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              >
                <option value="POS">POS</option>
                <option value="Load">Load</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted"
              onClick={() => {}}
            >
              Apply
            </button>
            <button
              onClick={() => {
                setStatusFilter("all")
                setFromDate("")
                setToDate("")
              }}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted text-muted-foreground"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setType("POS")}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${type === "POS" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          POS
        </button>
        <button
          onClick={() => setType("Load")}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${type === "Load" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Load
        </button>
      </div>

      {type === "POS" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-medium text-green-800">Successful</p>
              <p className="text-lg font-bold text-green-900 mt-1">₹{(successful.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-green-700 mt-0.5">{successful.length} transactions</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-800">Pending / Processing</p>
              <p className="text-lg font-bold text-amber-900 mt-1">₹{(pendingProcessing.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-amber-700 mt-0.5">{pendingProcessing.length} transactions</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-medium text-red-800">Failed</p>
              <p className="text-lg font-bold text-red-900 mt-1">₹{(failed.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-red-700 mt-0.5">{failed.length} transactions</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-800">Total</p>
              <p className="text-lg font-bold text-blue-900 mt-1">₹{(totalAmount / 100000).toFixed(1)}L</p>
              <p className="text-xs text-blue-700 mt-0.5">{posTransactions.length} transactions</p>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">TXN ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Card</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Vehicle</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Station</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {posTransactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{txn.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{txn.date}</td>
                      <td className="px-4 py-3 text-muted-foreground">{txn.time}</td>
                      <td className="px-4 py-3 font-mono text-xs">{txn.card}</td>
                      <td className="px-4 py-3">{txn.vehicle}</td>
                      <td className="px-4 py-3 font-semibold">₹{txn.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{txn.station}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedTransaction(txn)}
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
        </>
      )}

      {type === "Load" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-800">Total Load Attempted</p>
              <p className="text-lg font-bold text-blue-900 mt-1">₹{(totalLoadAmount / 100000).toFixed(1)}L</p>
              <p className="text-xs text-blue-700 mt-0.5">{loadTransactions.length} transactions</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-medium text-green-800">Successful Load</p>
              <p className="text-lg font-bold text-green-900 mt-1">₹{(lSuccessful.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-green-700 mt-0.5">{lSuccessful.length} transactions</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs font-medium text-yellow-800">Pending Load</p>
              <p className="text-lg font-bold text-yellow-900 mt-1">₹{(lPending.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-yellow-700 mt-0.5">{lPending.length} transactions</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-medium text-red-800">Failed Load</p>
              <p className="text-lg font-bold text-red-900 mt-1">₹{(lFailed.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-red-700 mt-0.5">{lFailed.length} transactions</p>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">TXN ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Date & Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">FO</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadTransactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{txn.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{txn.dateTime}</td>
                      <td className="px-4 py-3">{txn.fo}</td>
                      <td className="px-4 py-3 font-semibold">{txn.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(txn.status)}`}>{txn.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedTransaction(txn)}
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
        </>
      )}

      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSelectedTransaction(null)}
        />
      )}

      {selectedTransaction && (
        <div className={`fixed bottom-0 right-0 top-0 z-[61] w-full max-w-lg bg-card h-full overflow-y-auto shadow-xl border-l border-border border-t-4 transform transition-transform duration-300 ${getStatusBorderColor(selectedTransaction.status)}`}>
          <div className="sticky top-0 bg-card border-b border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Transaction Details</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-mono text-muted-foreground">{selectedTransaction.id}</span>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                {selectedTransaction.status}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4 pb-24">
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Transaction Info</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">ID:</span><span className="font-semibold">{selectedTransaction.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date:</span><span className="font-semibold">{selectedTransaction.date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time:</span><span className="font-semibold">{selectedTransaction.time}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
