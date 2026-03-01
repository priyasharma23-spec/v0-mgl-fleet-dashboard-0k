"use client"

import { useState, useMemo } from "react"
import {
  Wallet, Plus, Clock, CreditCard, Gift, IndianRupee, History,
  ArrowRightLeft, X, Info, Search, Filter, Download, ChevronRight,
  RefreshCw, ArrowDownLeft, ArrowUpRight, AlertCircle
} from "lucide-react"

// Mock wallet data - expandable to 100+ vehicles
const parentWallet = {
  balance: 125000,
  pendingCredits: 50000,
  pendingSettlementDate: "03 Mar 2026, 10:00 AM",
  lastUpdated: "01 Mar 2026, 02:35 PM"
}

const generateVehicleCards = (count: number) => {
  const vehicles = []
  const statuses = ["active", "inactive", "replacement"]
  for (let i = 0; i < count; i++) {
    vehicles.push({
      id: `VC${String(i + 1).padStart(3, "0")}`,
      vehicleNo: `MH 01 ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))} ${1000 + i}`,
      cardNo: `5678 **** **** ${String(i + 1000).slice(-4)}`,
      card: Math.random() * 25000,
      incentive: Math.random() * 6000,
      autoLoad: Math.random() > 0.5,
      lastTransaction: `${Math.floor(Math.random() * 7) + 1} Mar 2026`,
      status: statuses[Math.floor(Math.random() * 3)]
    })
  }
  return vehicles
}

const vehicleCards = generateVehicleCards(50) // Demo with 50, scales to 100+

const recentTransactions = [
  { id: "T001", type: "credit", source: "PG Load", amount: 50000, status: "pending", date: "01 Mar 2026, 11:30 AM", vehicle: null, eta: "03 Mar 2026" },
  { id: "T002", type: "transfer", source: "Parent → Card", amount: 10000, status: "completed", date: "28 Feb 2026, 03:15 PM", vehicle: "MH 01 AB 1234" },
  { id: "T003", type: "credit", source: "PG Load", amount: 75000, status: "completed", date: "25 Feb 2026, 10:00 AM", vehicle: null },
]

export default function FOWalletView() {
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "replacement">("all")
  const [sortBy, setSortBy] = useState<"vehicle" | "balance" | "recent">("vehicle")
  const [transferAmount, setTransferAmount] = useState("")
  const [addAmount, setAddAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount))
  }

  // Search and filter logic
  const filteredVehicles = useMemo(() => {
    let filtered = vehicleCards.filter(card => {
      const matchesSearch = card.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.cardNo.includes(searchQuery)
      const matchesStatus = filterStatus === "all" || card.status === filterStatus
      return matchesSearch && matchesStatus
    })

    // Sort
    if (sortBy === "balance") {
      filtered.sort((a, b) => (b.card + b.incentive) - (a.card + a.incentive))
    } else if (sortBy === "recent") {
      filtered.sort((a, b) => b.id.localeCompare(a.id))
    } else {
      filtered.sort((a, b) => a.vehicleNo.localeCompare(b.vehicleNo))
    }

    return filtered
  }, [searchQuery, filterStatus, sortBy])

  const handleAddMoney = async () => {
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsProcessing(false)
    setShowAddMoney(false)
    setAddAmount("")
  }

  const handleTransfer = async () => {
    if (!selectedVehicle || !transferAmount) return
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1200))
    setIsProcessing(false)
    setShowTransfer(false)
    setSelectedVehicle(null)
    setTransferAmount("")
  }

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">Wallet & Funds</h1>
          <p className="text-xs text-muted-foreground">{vehicleCards.length} vehicle cards</p>
        </div>
        <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md flex items-center gap-1 w-fit">
          <IndianRupee className="w-3 h-3" />
          1 MGL Coin = 1 INR
        </span>
      </div>

      {/* T+1 Pending Credit Banner */}
      {parentWallet.pendingCredits > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-800">Pending Credit: T+1 Settlement</p>
              <p className="text-xs text-amber-700 mt-0.5">{formatCurrency(parentWallet.pendingCredits)} Coins available on {parentWallet.pendingSettlementDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Parent Wallet (Left) + Content (Right) */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Left Column - Parent Wallet Summary (Sticky) */}
        <div className="lg:col-span-1 space-y-3">
          {/* Parent Wallet Card */}
          <div className="bg-gradient-to-br from-[#1a472a] to-[#2d5a3d] rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-medium text-white/80">Parent Wallet</span>
            </div>

            <div className="mb-3">
              <p className="text-white/60 text-xs mb-0.5">Available Balance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{formatCurrency(parentWallet.balance)}</span>
                <span className="text-xs text-white/70">Coins</span>
              </div>
            </div>

            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setShowAddMoney(true)}
                className="flex-1 py-2 bg-white text-[#1a472a] rounded-lg font-semibold flex items-center justify-center gap-1 hover:bg-white/90 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
              <button
                onClick={() => setShowTransfer(true)}
                className="flex-1 py-2 bg-white/20 text-white rounded-lg font-semibold flex items-center justify-center gap-1 hover:bg-white/30 transition-colors border border-white/20"
              >
                <ArrowRightLeft className="w-3 h-3" />
                Move
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-1">Total Cards</p>
              <p className="font-bold text-foreground">{formatCurrency(vehicleCards.reduce((a, c) => a + c.card, 0))}</p>
            </div>
            <div className="p-2.5 bg-card border border-border rounded-lg">
              <p className="text-muted-foreground mb-1">Total Incentives</p>
              <p className="font-bold text-foreground">{formatCurrency(vehicleCards.reduce((a, c) => a + c.incentive, 0))}</p>
            </div>
            <div className="p-2.5 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium mb-1">Active Cards</p>
              <p className="font-bold text-green-700">{vehicleCards.filter(v => v.status === "active").length}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Transactions + Vehicle List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Recent Transactions */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Recent Transactions
              </h3>
              <button className="text-xs text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-border max-h-32 overflow-y-auto">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-2.5 flex items-center gap-2 hover:bg-muted/50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    tx.type === "credit" 
                      ? tx.status === "pending" ? "bg-amber-100" : "bg-green-100"
                      : "bg-blue-100"
                  }`}>
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className={`w-3 h-3 ${tx.status === "pending" ? "text-amber-600" : "text-green-600"}`} />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{tx.source}</p>
                    <p className="text-xs text-muted-foreground">{tx.date.split(",")[0]}</p>
                  </div>
                  <p className="text-xs font-semibold text-green-600 shrink-0">+{formatCurrency(tx.amount)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 text-xs">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vehicle or card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="replacement">Replacement</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="vehicle">By Vehicle</option>
              <option value="balance">By Balance</option>
              <option value="recent">Recent</option>
            </select>

            <button className="px-3 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5 shrink-0">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-xs">
            <p className="text-muted-foreground">Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of {vehicleCards.length}</p>
            {filterStatus !== "all" && (
              <button onClick={() => setFilterStatus("all")} className="text-primary font-medium hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* Compact Vehicle Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">Vehicle</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">Card</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-foreground">Incentive</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-foreground">Total</th>
                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Status</th>
                    <th className="px-3 py-2.5 text-center font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredVehicles.map((card) => (
                    <tr key={card.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-3 py-2">
                        <div>
                          <p className="font-medium text-foreground">{card.vehicleNo}</p>
                          <p className="text-xs text-muted-foreground">{card.cardNo}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-blue-700">{formatCurrency(card.card)}</p>
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-medium text-green-700">{formatCurrency(card.incentive)}</p>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <p className="font-bold text-foreground">{formatCurrency(card.card + card.incentive)}</p>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          card.status === "active" ? "bg-green-100 text-green-700" :
                          card.status === "inactive" ? "bg-gray-100 text-gray-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {card.status === "active" ? "Active" : card.status === "inactive" ? "Inactive" : "Replacement"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button 
                          onClick={() => { setSelectedVehicle(card.id); setShowTransfer(true); }}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Load
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredVehicles.length === 0 && (
              <div className="p-8 text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No vehicles found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-2xl max-w-md w-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Add Money to Parent Wallet</h2>
              <button onClick={() => setShowAddMoney(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(parentWallet.balance)} <span className="text-xs font-normal text-muted-foreground">Coins</span></p>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Amount (INR)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                <p className="text-blue-700"><strong>New Balance:</strong> {formatCurrency(parentWallet.balance + (parseInt(addAmount) || 0))} Coins</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddMoney}
                  disabled={isProcessing || !addAmount}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {isProcessing ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                  {isProcessing ? "Processing" : "Proceed"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-2xl max-w-md w-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Load Card Wallet</h2>
              <button onClick={() => setShowTransfer(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {selectedVehicle && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Vehicle</p>
                  <p className="text-sm font-bold text-foreground">{vehicleCards.find(v => v.id === selectedVehicle)?.vehicleNo}</p>
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700"><strong>Available:</strong> {formatCurrency(parentWallet.balance)} Coins</p>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground">Amount (Coins)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowTransfer(false)}
                  className="flex-1 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTransfer}
                  disabled={isProcessing || !transferAmount}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {isProcessing ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                  {isProcessing ? "Loading" : "Load Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
