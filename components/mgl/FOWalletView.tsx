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
  const statuses = ["active", "low-balance", "inactive"]
  for (let i = 0; i < count; i++) {
    vehicles.push({
      id: `VC${String(i + 1).padStart(3, "0")}`,
      vehicleNo: `MH 01 ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))} ${1000 + i}`,
      cardNo: `5678 **** **** ${String(i + 1000).slice(-4)}`,
      cardWallet: Math.random() * 25000,
      incentiveWallet: Math.random() * 6000,
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
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "low-balance" | "inactive">("all")
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
      filtered.sort((a, b) => (b.cardWallet + b.incentiveWallet) - (a.cardWallet + a.incentiveWallet))
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
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Wallet & Funds</h1>
          <p className="text-sm text-muted-foreground">Manage your parent wallet and {vehicleCards.length} vehicle card balances</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
            <IndianRupee className="w-3 h-3" />
            1 MGL Coin = 1 INR
          </span>
        </div>
      </div>

      {/* T+1 Pending Credit Banner */}
      {parentWallet.pendingCredits > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Pending Credit: T+1 Settlement</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {formatCurrency(parentWallet.pendingCredits)} MGL Coins will be available on {parentWallet.pendingSettlementDate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Layout: Parent Wallet (Left) + Vehicle Cards (Right) */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column - Parent Wallet Summary */}
        <div className="lg:col-span-1 space-y-4">
          {/* Parent Wallet Card */}
          <div className="bg-gradient-to-br from-[#1a472a] to-[#2d5a3d] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-white/80">Parent Wallet</span>
              </div>

              <div className="mb-4">
                <p className="text-white/60 text-xs mb-1">Available Balance</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatCurrency(parentWallet.balance)}</span>
                  <span className="text-xs text-white/70">Coins</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddMoney(true)}
                  className="flex-1 py-2.5 bg-white text-[#1a472a] rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Money
                </button>
                <button
                  onClick={() => setShowTransfer(true)}
                  className="flex-1 py-2.5 bg-white/20 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1 hover:bg-white/30 transition-colors border border-white/20"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  Transfer
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-2">
            <div className="p-3 bg-card border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Card Wallets</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(vehicleCards.reduce((a, c) => a + c.cardWallet, 0))}</p>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Incentives</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(vehicleCards.reduce((a, c) => a + c.incentiveWallet, 0))}</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-700 font-medium mb-1">Active Vehicles</p>
              <p className="text-lg font-bold text-green-700">{vehicleCards.filter(v => v.status === "active").length}</p>
            </div>
          </div>
        </div>

        {/* Right Column - Vehicle Cards Table/List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by vehicle no. or card number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="low-balance">Low Balance</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="vehicle">Sort by Vehicle</option>
              <option value="balance">Sort by Balance</option>
              <option value="recent">Sort by Recent</option>
            </select>

            <button className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Showing <span className="font-semibold text-foreground">{filteredVehicles.length}</span> of {vehicleCards.length} vehicles</p>
            {filterStatus !== "all" && (
              <button onClick={() => setFilterStatus("all")} className="text-primary text-xs font-medium hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* Compact Vehicle Cards Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Vehicle</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Card Wallet</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Incentive</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Total Balance</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredVehicles.map((card) => (
                    <tr key={card.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{card.vehicleNo}</p>
                          <p className="text-xs text-muted-foreground">{card.cardNo}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-blue-700">{formatCurrency(card.cardWallet)}</p>
                          <p className="text-xs text-muted-foreground">Coins</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-green-700">{formatCurrency(card.incentiveWallet)}</p>
                          <p className="text-xs text-muted-foreground">Rewards</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-bold text-foreground">{formatCurrency(card.cardWallet + card.incentiveWallet)}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          card.status === "active" ? "bg-green-100 text-green-700" :
                          card.status === "low-balance" ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {card.status === "active" ? "Active" : card.status === "low-balance" ? "Low Balance" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => { setSelectedVehicle(card.id); setShowTransfer(true); }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span className="hidden sm:inline">Load</span>
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
                <p className="text-muted-foreground">No vehicles found matching your search.</p>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-card border border-border rounded-xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Recent Transactions
              </h3>
              <button className="text-xs text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === "credit" 
                      ? tx.status === "pending" ? "bg-amber-100" : "bg-green-100"
                      : "bg-blue-100"
                  }`}>
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className={`w-4 h-4 ${tx.status === "pending" ? "text-amber-600" : "text-green-600"}`} />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{tx.source}</p>
                    <p className="text-xs text-muted-foreground">{tx.date.split(",")[0]}</p>
                  </div>
                  <p className="text-sm font-semibold text-green-600">+{formatCurrency(tx.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Add Money to Parent Wallet</h2>
              <button onClick={() => setShowAddMoney(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 bg-muted rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(parentWallet.balance)} <span className="text-sm font-normal text-muted-foreground">MGL Coins</span></p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Amount to Add (INR)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-input text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700"><strong>New Balance:</strong> {formatCurrency(parentWallet.balance + (parseInt(addAmount) || 0))} MGL Coins</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddMoney}
                  disabled={isProcessing || !addAmount}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  {isProcessing ? "Processing" : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Load Funds to Vehicle Card</h2>
              <button onClick={() => setShowTransfer(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {selectedVehicle && (
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-xs text-muted-foreground mb-2">Selected Vehicle</p>
                  <p className="font-bold text-foreground">{vehicleCards.find(v => v.id === selectedVehicle)?.vehicleNo}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground">Transfer Amount (INR)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-input text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700"><strong>New Vehicle Balance:</strong> {formatCurrency((vehicleCards.find(v => v.id === selectedVehicle)?.cardWallet || 0) + (parseInt(transferAmount) || 0))} MGL Coins</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowTransfer(false)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTransfer}
                  disabled={isProcessing || !transferAmount || !selectedVehicle}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  {isProcessing ? "Processing" : "Confirm Transfer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
