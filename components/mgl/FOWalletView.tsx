"use client"

import { useState, useMemo } from "react"
import {
  Wallet, Plus, Clock, CreditCard, Gift, IndianRupee, History,
  ArrowRightLeft, Search, Download, ChevronRight, RefreshCw, 
  ArrowDownLeft, ArrowUpRight, AlertCircle, Filter
} from "lucide-react"

const parentWallet = {
  balance: 125000,
  pendingCredits: 50000,
  pendingSettlementDate: "03 Mar 2026, 10:00 AM",
  lastUpdated: "01 Mar 2026, 02:35 PM"
}

const generateTransactions = (count: number) => {
  const transactions = []
  const sources = ["PG Load", "Parent → Card", "Settlement", "Reversal"]
  const statuses = ["pending", "completed", "failed"]
  for (let i = 0; i < count; i++) {
    transactions.push({
      id: `T${String(i + 1).padStart(4, "0")}`,
      type: Math.random() > 0.5 ? "credit" : "transfer",
      source: sources[Math.floor(Math.random() * sources.length)],
      amount: Math.random() * 100000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: `${Math.floor(Math.random() * 28) + 1} Mar 2026, ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} ${Math.random() > 0.5 ? "AM" : "PM"}`,
      vehicle: Math.random() > 0.4 ? `MH 01 AB ${1000 + i}` : null,
      eta: Math.random() > 0.7 ? "03 Mar 2026" : null
    })
  }
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const recentTransactions = generateTransactions(100)

export default function FOWalletView() {
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "credit" | "transfer">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed" | "failed">("all")
  const [addAmount, setAddAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount))
  }

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter(tx => {
      const matchesSearch = tx.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tx.vehicle?.includes(searchQuery) ||
                           tx.id.includes(searchQuery)
      const matchesType = filterType === "all" || tx.type === filterType
      const matchesStatus = filterStatus === "all" || tx.status === filterStatus
      return matchesSearch && matchesType && matchesStatus
    })
  }, [searchQuery, filterType, filterStatus])

  const handleAddMoney = async () => {
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsProcessing(false)
    setShowAddMoney(false)
    setAddAmount("")
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet & Funds</h1>
        <p className="text-sm text-muted-foreground mt-1">Transaction history and fund management</p>
      </div>

      {/* Parent Wallet Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Available Balance */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700 font-medium">Available Balance</p>
              <p className="text-2xl font-bold text-green-900 mt-1">₹{formatCurrency(parentWallet.balance)}</p>
            </div>
            <Wallet className="w-8 h-8 text-green-600 opacity-30" />
          </div>
        </div>

        {/* Pending Credit */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-700 font-medium">Pending Credit (T+1)</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">₹{formatCurrency(parentWallet.pendingCredits)}</p>
              <p className="text-xs text-amber-700 mt-1">ETA: {parentWallet.pendingSettlementDate}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600 opacity-30" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 font-medium mb-2">Quick Actions</p>
          <button
            onClick={() => setShowAddMoney(true)}
            className="w-full py-2 px-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Money
          </button>
        </div>
      </div>

      {/* Transaction Filters */}
      <div className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="transfer">Transfer</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <button className="px-3 py-2 text-sm flex items-center gap-2 rounded-lg border border-border hover:bg-muted transition-colors whitespace-nowrap">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Type</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Source</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Vehicle/Details</th>
                <th className="px-4 py-2 text-right font-semibold text-foreground">Amount</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground">Date & Time</th>
                <th className="px-4 py-2 text-center font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, idx) => (
                <tr key={tx.id} className={idx % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      {tx.type === "credit" ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="font-medium capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{tx.source}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{tx.vehicle || "Parent Wallet"}</td>
                  <td className="px-4 py-2.5 text-right font-bold">₹{formatCurrency(tx.amount)}</td>
                  <td className="px-4 py-2.5">
                    <div className="text-muted-foreground">
                      <p className="text-xs">{tx.date}</p>
                      {tx.eta && <p className="text-xs text-amber-600 mt-0.5">ETA: {tx.eta}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === "completed" ? "bg-green-100 text-green-700" :
                      tx.status === "pending" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
        <span>Showing {filteredTransactions.length} of {recentTransactions.length} transactions</span>
        <button className="text-primary hover:underline">Clear filters</button>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Add Money</h2>
              <button onClick={() => setShowAddMoney(false)} className="p-1 hover:bg-muted rounded">
                <ChevronRight className="w-5 h-5 rotate-90" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                <p className="font-semibold mb-1">Payment Gateway: EnKash</p>
                <p>You will be redirected to complete the payment securely.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAddMoney(false)}
                className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                disabled={!addAmount || isProcessing}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
