"use client";
import { ArrowLeft, Lock, Trash2, Key, Sliders, Package, Wallet, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Vehicle } from "@/lib/mgl-data";
import { mockCardTransactions } from "@/lib/mgl-data";
import { cn } from "@/lib/utils";

interface CardDetailsViewProps {
  vehicle: Vehicle;
  onBack: () => void;
  onActionModal: (action: "reset-pin" | "lock-unlock" | "block" | "limits" | "replacement") => void;
}

export default function CardDetailsView({ vehicle, onBack, onActionModal }: CardDetailsViewProps) {
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocateAmount, setAllocateAmount] = useState("");
  const [allocationStep, setAllocationStep] = useState<"input" | "review" | "success">("input");
  const [parentWalletBalance, setParentWalletBalance] = useState(125000);
  const [isAllocating, setIsAllocating] = useState(false);

  // Mock balance data
  const balances = {
    cardWallet: { balance: 2000, coins: 2000 },
    incentiveWallet: { balance: 350, coins: 350 },
  };

  const lastLoad = mockCardTransactions.find((t) => t.type === "load" && t.wallet === "card");
  const lastCashback = mockCardTransactions.find((t) => t.type === "incentive");
  const recentTransactions = mockCardTransactions.slice(0, 10);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    return { date: `${day}-${month}`, time };
  };

  const getTransactionColor = (type: string) => {
    if (type === "load") return "text-blue-600";
    if (type === "incentive") return "text-green-600";
    if (type === "spend") return "text-red-600";
    return "text-gray-600";
  };

  const getStatusColor = (status: string) => {
    if (status === "success") return "text-green-600";
    if (status === "pending") return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border z-20">
        <div className="flex items-center gap-4 p-4">
          <button onClick={onBack} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-xs text-muted-foreground">Vehicle Card Details</p>
            <h2 className="text-lg font-bold">{vehicle.vehicleNumber}</h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
        {/* Card Summary Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Card Visual - Left */}
          <div className="lg:col-span-1">
            <div className="bg-linear-to-br from-green-400 via-teal-400 to-blue-500 rounded-2xl p-6 text-white h-56 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-16 translate-x-16" />
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-wider">MGL</p>
                <p className="text-sm font-bold uppercase tracking-wider">Fleet</p>
                <p className="text-xs font-medium uppercase tracking-widest opacity-75">Connect</p>
                <div className="absolute left-6 top-32 w-12 h-9 bg-yellow-500 rounded-lg border-2 border-yellow-600 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-yellow-700 rounded-sm" />
                    ))}
                  </div>
                </div>
                <p className="text-2xl font-mono font-bold tracking-widest mt-4 drop-shadow-sm">{vehicle.cardNumber?.replace(/\d/g, "*").replace(/\*{4}$/, vehicle.cardNumber.slice(-4)) || "•••• •••• •••• ••••"}</p>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-[8px] opacity-60 uppercase font-semibold">Card Holder</p>
                    <p className="text-xs font-semibold">Fleet Operator</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] opacity-60 uppercase font-semibold">Valid Thru</p>
                    <p className="text-xs font-mono font-bold">12/27</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              ACTIVE
            </div>
          </div>

          {/* Card Details - Right */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">VEHICLE</p>
                  <p className="text-sm font-semibold text-foreground">{vehicle.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">DRIVER</p>
                  <p className="text-sm font-semibold text-foreground">{vehicle.driverName || "Not Assigned"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">CARD NUMBER</p>
                  <p className="text-sm font-mono font-semibold text-foreground">{vehicle.cardNumber?.replace(/\d/g, "*").replace(/\*{4}$/, vehicle.cardNumber.slice(-4)) || "•••• •••• •••• ••••"}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">EXPIRY</p>
                    <p className="text-sm font-semibold text-foreground">12/2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold">CARD TYPE</p>
                    <p className="text-sm font-semibold text-foreground">Physical</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Balance Section */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Card Wallet */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase">Card Wallet</p>
                <p className="text-2xl font-bold text-foreground mt-1">₹{balances.cardWallet.balance.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">💳</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{balances.cardWallet.coins.toLocaleString()} MGL Coins</p>
          </div>

          {/* Incentive Wallet */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-green-600 uppercase">Incentive Wallet</p>
                <p className="text-2xl font-bold text-foreground mt-1">₹{balances.incentiveWallet.balance.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{balances.incentiveWallet.coins.toLocaleString()} MGL Coins</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Last Load */}
            {lastLoad && (
              <div className="pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Last Load</p>
                    <p className="text-sm font-semibold text-foreground mt-1">₹{lastLoad.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(lastLoad.date).toLocaleDateString("en-GB")} at {new Date(lastLoad.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{lastLoad.source}</p>
                    <button className="text-xs text-primary hover:underline font-semibold mt-2">View Details →</button>
                  </div>
                </div>
              </div>
            )}

            {/* Last Cashback */}
            {lastCashback && (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Last Cashback</p>
                    <p className="text-sm font-semibold text-foreground mt-1">₹{lastCashback.amount} ({lastCashback.amount} MGL Coins)</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(lastCashback.date).toLocaleDateString("en-GB")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{lastCashback.campaign}</p>
                    <button className="text-xs text-primary hover:underline font-semibold mt-2">View Offer →</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Last 10 Transactions</h3>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Date/Time</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Wallet</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">Amount</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => {
                  const { date, time } = formatDate(txn.date);
                  return (
                    <tr key={txn.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{date} {time}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold capitalize", getTransactionColor(txn.type))}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground capitalize">{txn.wallet === "card" ? "Card Wallet" : "Incentive Wallet"}</td>
                      <td className={cn("px-4 py-3 text-right text-xs font-semibold", txn.amount > 0 ? "text-green-600" : "text-red-600")}>
                        {txn.amount > 0 ? "+" : ""}₹{Math.abs(txn.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("text-xs font-semibold capitalize flex items-center justify-center gap-1", getStatusColor(txn.status))}>
                          {txn.status === "success" ? "✓" : txn.status === "pending" ? "⏳" : "✗"} {txn.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2 p-4">
            {recentTransactions.map((txn) => {
              const { date, time } = formatDate(txn.date);
              const isExpanded = expandedTxn === txn.id;
              return (
                <button
                  key={txn.id}
                  onClick={() => setExpandedTxn(isExpanded ? null : txn.id)}
                  className="w-full bg-muted rounded-lg p-3 text-left hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{date} • {time}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-xs font-semibold capitalize", getTransactionColor(txn.type))}>
                          {txn.type}
                        </span>
                        <span className={cn("text-xs font-semibold", txn.amount > 0 ? "text-green-600" : "text-red-600")}>
                          {txn.amount > 0 ? "+" : ""}₹{Math.abs(txn.amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className={cn("text-xs font-semibold", getStatusColor(txn.status))}>
                      {txn.status === "success" ? "✓" : txn.status === "pending" ? "⏳" : "✗"}
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border text-xs space-y-1">
                      <p><span className="text-muted-foreground">Wallet:</span> {txn.wallet === "card" ? "Card Wallet" : "Incentive Wallet"}</p>
                      {txn.source && <p><span className="text-muted-foreground">Source:</span> {txn.source}</p>}
                      {txn.campaign && <p><span className="text-muted-foreground">Campaign:</span> {txn.campaign}</p>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-border text-center">
            <button className="text-xs text-primary hover:underline font-semibold">View All Transactions →</button>
          </div>
        </div>

        {/* Card Actions Section */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Card Actions</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => { setShowAllocateModal(true); setAllocationStep("input"); setAllocateAmount(""); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors lg:col-start-1"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Load Card</span>
              <span className="sm:hidden">Load</span>
            </button>
            <button
              onClick={() => onActionModal("reset-pin")}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Reset PIN</span>
              <span className="sm:hidden">PIN</span>
            </button>
            <button
              onClick={() => onActionModal("lock-unlock")}
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Lock Card</span>
              <span className="sm:hidden">Lock</span>
            </button>
            <button
              onClick={() => onActionModal("limits")}
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Set Limits</span>
              <span className="sm:hidden">Limits</span>
            </button>
            <button
              onClick={() => onActionModal("block")}
              className="flex items-center gap-2 px-4 py-2.5 border border-destructive text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Block Card</span>
              <span className="sm:hidden">Block</span>
            </button>
            <button
              onClick={() => onActionModal("replacement")}
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Order Replacement</span>
              <span className="sm:hidden">Replace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Allocate Funds Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 relative">
            {/* Progress Steps */}
            <div className="flex gap-2 mb-6">
              {["input", "review", "success"].map((step, idx) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full ${
                    ["input", "review", "success"].indexOf(allocationStep) >= idx ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Enter Amount */}
            {allocationStep === "input" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Load Card</h3>
                <p className="text-sm text-muted-foreground mb-4">Allocate funds from your parent wallet to {vehicle.vehicleNumber}'s Card Wallet.</p>
                
                {/* Parent Wallet Balance */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-600 font-semibold uppercase">Parent Wallet Balance</p>
                  <p className="text-xl font-bold text-foreground mt-1">₹{parentWalletBalance.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{parentWalletBalance.toLocaleString()} MGL Coins</p>
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-foreground mb-2 block">Enter Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={allocateAmount}
                      onChange={(e) => setAllocateAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-lg font-semibold"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Available: ₹{parentWalletBalance.toLocaleString()}</p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">Quick Select</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[1000, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAllocateAmount(amt.toString())}
                        className="px-2 py-1.5 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors"
                      >
                        ₹{(amt / 1000).toFixed(0)}K
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                <button
                  onClick={() => setShowAllocateModal(false)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
                >
                    Cancel
                  </button>
                  <button
                    onClick={() => setAllocationStep("review")}
                    disabled={!allocateAmount || parseInt(allocateAmount) <= 0 || parseInt(allocateAmount) > parentWalletBalance}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Review <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review & Confirm */}
            {allocationStep === "review" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Review Transfer</h3>
                <p className="text-sm text-muted-foreground mb-4">Confirm the details of your fund allocation.</p>

                <div className="space-y-3 mb-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Vehicle</span>
                    <span className="font-semibold text-foreground">{vehicle.vehicleNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Transfer Amount</span>
                    <span className="text-lg font-bold text-green-600">₹{parseInt(allocateAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Processing Fee</span>
                    <span className="text-sm font-semibold text-foreground">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Total Debit</span>
                    <span className="text-lg font-bold text-foreground">₹{parseInt(allocateAmount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="text-blue-900 font-semibold">✓ Instant Transfer</p>
                  <p className="text-xs text-blue-700 mt-1">Funds will be credited to the Card Wallet immediately after approval.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setAllocationStep("input")}
                    className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setIsAllocating(true);
                      setTimeout(() => {
                        setIsAllocating(false);
                        setAllocationStep("success");
                        setParentWalletBalance(parentWalletBalance - parseInt(allocateAmount));
                      }, 1500);
                    }}
                    disabled={isAllocating}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all"
                  >
                    {isAllocating ? "Processing..." : "Confirm & Transfer"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {allocationStep === "success" && (
              <div className="text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-lg font-bold text-green-600 mb-2">Transfer Successful!</h3>
                <p className="text-sm text-muted-foreground mb-4">₹{parseInt(allocateAmount).toLocaleString()} has been loaded to {vehicle.vehicleNumber}'s Card Wallet.</p>
                
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-left">
                  <p className="text-xs text-green-700 font-semibold mb-2">✓ Transfer Details</p>
                  <div className="space-y-1 text-xs text-green-700">
                    <p>Status: <span className="font-semibold">Completed</span></p>
                    <p>Amount: <span className="font-semibold">₹{parseInt(allocateAmount).toLocaleString()}</span></p>
                    <p>To: <span className="font-semibold">{vehicle.vehicleNumber} Card Wallet</span></p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAllocateModal(false)}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90"
                >
                  Done
                </button>
              </div>
            )}

            {/* Close Button */}
            {allocationStep !== "success" && (
              <button
                onClick={() => setShowAllocateModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
