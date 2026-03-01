"use client"

import { useState } from "react"
import {
  Wallet, Plus, ArrowRight, Clock, CheckCircle, AlertCircle, 
  Truck, RefreshCw, ChevronRight, Download, ArrowUpRight,
  ArrowDownLeft, CreditCard, Gift, IndianRupee, History,
  ArrowRightLeft, X, Info
} from "lucide-react"

// Mock wallet data
const parentWallet = {
  balance: 125000, // MGL Coins (1 MGL Coin = 1 INR)
  pendingCredits: 50000,
  pendingSettlementDate: "03 Mar 2026, 10:00 AM",
  lastUpdated: "01 Mar 2026, 02:35 PM"
}

const vehicleCards = [
  {
    id: "VC001",
    vehicleNo: "MH 01 AB 1234",
    cardNo: "5678 **** **** 1234",
    cardWallet: 15000, // FO-funded
    incentiveWallet: 3500, // MGL-funded
    autoLoad: true,
    lastTransaction: "28 Feb 2026"
  },
  {
    id: "VC002",
    vehicleNo: "MH 01 CD 5678",
    cardNo: "5678 **** **** 5678",
    cardWallet: 8500,
    incentiveWallet: 2100,
    autoLoad: false,
    lastTransaction: "27 Feb 2026"
  },
  {
    id: "VC003",
    vehicleNo: "MH 01 EF 9012",
    cardNo: "5678 **** **** 9012",
    cardWallet: 22000,
    incentiveWallet: 5200,
    autoLoad: true,
    lastTransaction: "01 Mar 2026"
  },
  {
    id: "VC004",
    vehicleNo: "MH 01 GH 3456",
    cardNo: "5678 **** **** 3456",
    cardWallet: 5000,
    incentiveWallet: 1800,
    autoLoad: false,
    lastTransaction: "25 Feb 2026"
  }
]

const recentTransactions = [
  { id: "T001", type: "credit", source: "PG Load", amount: 50000, status: "pending", date: "01 Mar 2026, 11:30 AM", vehicle: null, eta: "03 Mar 2026" },
  { id: "T002", type: "transfer", source: "Parent → Card", amount: 10000, status: "completed", date: "28 Feb 2026, 03:15 PM", vehicle: "MH 01 AB 1234" },
  { id: "T003", type: "credit", source: "PG Load", amount: 75000, status: "completed", date: "25 Feb 2026, 10:00 AM", vehicle: null },
  { id: "T004", type: "transfer", source: "Parent → Card", amount: 8000, status: "completed", date: "24 Feb 2026, 04:20 PM", vehicle: "MH 01 CD 5678" },
  { id: "T005", type: "incentive", source: "MGL Cashback", amount: 1500, status: "completed", date: "23 Feb 2026, 09:00 AM", vehicle: "MH 01 EF 9012" },
  { id: "T006", type: "transfer", source: "Parent → Card", amount: 15000, status: "completed", date: "22 Feb 2026, 11:45 AM", vehicle: "MH 01 GH 3456" },
]

export default function FOWalletView() {
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [transferAmount, setTransferAmount] = useState("")
  const [addAmount, setAddAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount)
  }

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
          <h1 className="text-xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">View your wallet activity and recent transactions</p>
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
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-amber-800">Pending Credit: T+1 Settlement</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    {formatCurrency(parentWallet.pendingCredits)} MGL Coins will be available on {parentWallet.pendingSettlementDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-700">{formatCurrency(parentWallet.pendingCredits)}</p>
                  <p className="text-[10px] text-amber-600">MGL Coins</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-amber-600 mb-1">
                  <span>Processing</span>
                  <span>Settlement ETA: ~24 hrs</span>
                </div>
                <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-amber-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Column - Parent Wallet */}
        <div className="lg:col-span-2 space-y-4">
          {/* Parent Wallet Card */}
          <div className="bg-gradient-to-br from-[#1a472a] to-[#2d5a3d] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-white/80">Parent Wallet</span>
                </div>
                <button className="text-white/60 hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-white/60 text-xs mb-1">Available Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{formatCurrency(parentWallet.balance)}</span>
                  <span className="text-sm text-white/70">MGL Coins</span>
                </div>
                <p className="text-xs text-white/50 mt-1">= INR {formatCurrency(parentWallet.balance)}</p>
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
                  className="flex-1 py-2.5 bg-white/20 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-colors border border-white/20"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Transfer
                </button>
              </div>

              <p className="text-[10px] text-white/40 mt-3 text-center">
                Last updated: {parentWallet.lastUpdated}
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card border border-border rounded-xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                Recent Transactions
              </h3>
              <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-border">
              {recentTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === "credit" 
                      ? tx.status === "pending" ? "bg-amber-100" : "bg-green-100"
                      : tx.type === "incentive" 
                        ? "bg-emerald-100" 
                        : "bg-blue-100"
                  }`}>
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className={`w-4 h-4 ${tx.status === "pending" ? "text-amber-600" : "text-green-600"}`} />
                    ) : tx.type === "incentive" ? (
                      <Gift className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{tx.source}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {tx.vehicle || "Parent Wallet"} • {tx.date.split(",")[0]}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      tx.type === "transfer" ? "text-foreground" : tx.status === "pending" ? "text-amber-600" : "text-green-600"
                    }`}>
                      {tx.type === "transfer" ? "-" : "+"}{formatCurrency(tx.amount)}
                    </p>
                    {tx.status === "pending" && (
                      <span className="text-[10px] text-amber-600 flex items-center justify-end gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Vehicle Cards */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Vehicle Card Wallets</h3>
            <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              <Download className="w-3 h-3" /> Download Statement
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {vehicleCards.map((card) => (
              <div key={card.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                {/* Card Header */}
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{card.vehicleNo}</p>
                        <p className="text-[10px] text-muted-foreground">{card.cardNo}</p>
                      </div>
                    </div>
                    {card.autoLoad && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5" /> Auto
                      </span>
                    )}
                  </div>
                </div>

                {/* Wallet Balances */}
                <div className="p-4 space-y-3">
                  {/* Card Wallet - Blue */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <CreditCard className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-800">Card Wallet</p>
                        <p className="text-[10px] text-blue-600">Your Funds</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-700">{formatCurrency(card.cardWallet)}</p>
                      <p className="text-[10px] text-blue-500">MGL Coins</p>
                    </div>
                  </div>

                  {/* Incentive Wallet - Green */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Gift className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-800">Incentive Wallet</p>
                        <p className="text-[10px] text-green-600">MGL Rewards</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-700">{formatCurrency(card.incentiveWallet)}</p>
                      <p className="text-[10px] text-green-500">MGL Coins</p>
                    </div>
                  </div>

                  {/* Total & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Balance</p>
                      <p className="text-base font-bold text-foreground">{formatCurrency(card.cardWallet + card.incentiveWallet)}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedVehicle(card.id); setShowTransfer(true); }}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Load Funds
                    </button>
                  </div>

                  <p className="text-[10px] text-muted-foreground text-center">
                    Last transaction: {card.lastTransaction}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">Wallet Management Info</p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1 list-disc list-inside">
                  <li><strong>Card Wallet (Blue):</strong> Funds you load from Parent Wallet for fuel purchases</li>
                  <li><strong>Incentive Wallet (Green):</strong> Cashback and rewards credited by MGL</li>
                  <li>Each vehicle maintains separate wallets - no commingling of funds</li>
                  <li>Auto-load vehicles automatically receive funds when balance is low</li>
                </ul>
              </div>
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
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-border bg-input text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">= {addAmount ? formatCurrency(Number(addAmount)) : "0"} MGL Coins</p>
              </div>

              <div className="flex gap-2">
                {[5000, 10000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAddAmount(String(amt))}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      addAmount === String(amt) 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    ₹{formatCurrency(amt)}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700">
                    <p className="font-medium">T+1 Settlement</p>
                    <p>Funds will be credited to your Parent Wallet by next business day, typically by 10:00 AM.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddMoney}
                disabled={!addAmount || Number(addAmount) < 100 || isProcessing}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {isProcessing ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Proceed to EnKash Payment <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
              <p className="text-[10px] text-muted-foreground text-center">Powered by EnKash Payment Gateway</p>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Transfer to Card Wallet</h2>
              <button onClick={() => { setShowTransfer(false); setSelectedVehicle(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#1a472a]/10 to-[#2d5a3d]/10 rounded-xl border border-[#2d5a3d]/20">
                <p className="text-xs text-muted-foreground mb-1">Available in Parent Wallet</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(parentWallet.balance)} <span className="text-sm font-normal text-muted-foreground">MGL Coins</span></p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Select Vehicle</label>
                <select
                  value={selectedVehicle || ""}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full mt-1 px-3 py-3 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Choose a vehicle</option>
                  {vehicleCards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.vehicleNo} - Card Wallet: {formatCurrency(card.cardWallet)} MGL
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Transfer Amount (MGL Coins)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full mt-1 px-4 py-3 rounded-lg border border-border bg-input text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">= INR {transferAmount ? formatCurrency(Number(transferAmount)) : "0"}</p>
              </div>

              {Number(transferAmount) > parentWallet.balance && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-xs text-destructive font-medium">Insufficient balance in Parent Wallet</p>
                </div>
              )}

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-green-700">
                    <p className="font-medium">Instant Transfer</p>
                    <p>Funds will be immediately available in the selected vehicle's Card Wallet.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTransfer}
                disabled={!selectedVehicle || !transferAmount || Number(transferAmount) > parentWallet.balance || Number(transferAmount) < 100 || isProcessing}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {isProcessing ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Transfer Funds <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
