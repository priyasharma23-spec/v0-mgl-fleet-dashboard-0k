"use client"

import { TrendingUp, Wallet, CreditCard } from "lucide-react"

export default function FOFundManagement({ onViewChange }: { onViewChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Fund Management</h1>
        <p className="text-sm text-muted-foreground">Load funds and manage your wallet balances</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Wallet Balance", value: "₹45,320", icon: Wallet, bg: "bg-blue-100", color: "text-blue-600" },
          { label: "Incentive Balance", value: "₹8,200", icon: TrendingUp, bg: "bg-green-100", color: "text-green-600" },
          { label: "Available to Load", value: "₹100,000", icon: CreditCard, bg: "bg-purple-100", color: "text-purple-600" },
        ].map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                  <p className="text-lg font-bold text-foreground">{card.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load Funds Section */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Load Funds to Wallet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Amount (₹)</label>
            <input type="number" placeholder="Enter amount" className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Select Account</label>
            <select className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option>Primary Account</option>
              <option>Secondary Account</option>
            </select>
          </div>
        </div>
        <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">
          Load Funds
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h2 className="font-semibold text-foreground mb-4">Recent Transactions</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>No recent transactions</p>
        </div>
      </div>
    </div>
  )
}
