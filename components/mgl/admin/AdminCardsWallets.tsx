"use client"

import { CreditCard, CheckCircle, XCircle, Wallet, Gift, Percent, AlertCircle, Lock } from "lucide-react"

export default function AdminCardsWallets({ onViewChange }: { onViewChange: (v: string) => void }) {
  const topFOs = [
    { name: "ABC Logistics", allocated: 15, issued: 12, active: 11, inactive: 0, blocked: 1, locked: 0, balance: "₹12,500", cashback: "₹2,100" },
    { name: "Metro Freight", allocated: 18, issued: 16, active: 15, inactive: 0, blocked: 1, locked: 0, balance: "₹18,200", cashback: "₹3,450" },
    { name: "City Express", allocated: 22, issued: 20, active: 19, inactive: 0, blocked: 1, locked: 0, balance: "₹22,800", cashback: "₹4,200" },
    { name: "Sunrise Transport", allocated: 8, issued: 7, active: 6, inactive: 0, blocked: 1, locked: 0, balance: "₹8,900", cashback: "₹1,650" },
    { name: "Quick Move", allocated: 12, issued: 10, active: 9, inactive: 0, blocked: 1, locked: 0, balance: "₹11,200", cashback: "₹2,050" },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Cards & Wallets Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor card status and wallet balances across all fleet operators</p>
      </div>

      {/* Summary Cards (7 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cards Allocated */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3,200</p>
              <p className="text-xs text-muted-foreground">Total Cards Allocated</p>
            </div>
          </div>
        </div>

        {/* Total Cards Issued */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">2,847</p>
              <p className="text-xs text-muted-foreground">Total Cards Issued</p>
            </div>
          </div>
        </div>

        {/* Total Active */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">2,654</p>
              <p className="text-xs text-muted-foreground">Total Active</p>
            </div>
          </div>
        </div>

        {/* Total Inactive */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">193</p>
              <p className="text-xs text-muted-foreground">Total Inactive</p>
            </div>
          </div>
        </div>

        {/* Total Blocked */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">Total Blocked</p>
            </div>
          </div>
        </div>

        {/* Total Locked */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">89</p>
              <p className="text-xs text-muted-foreground">Total Locked</p>
            </div>
          </div>
        </div>

        {/* Total Balance on Cards */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">₹1.2Cr</p>
              <p className="text-xs text-muted-foreground">Total Balance on Cards</p>
            </div>
          </div>
        </div>

        {/* Total Cashback Unutilised */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">₹18.5L</p>
              <p className="text-xs text-muted-foreground">Total Cashback Unutilised</p>
            </div>
          </div>
        </div>

        {/* Incentive Wallet (MGL) */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <Percent className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">₹45.2L</p>
              <p className="text-xs text-muted-foreground">Total Incentive Unutilised</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards by Status */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4">Cards by Status</h2>
        <div>
          <div className="flex h-8 rounded-full overflow-hidden border border-border">
            <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold" style={{width: '76.5%'}}>Active</div>
            <div className="bg-gray-400 flex items-center justify-center text-white text-xs font-bold" style={{width: '5.6%'}}>Inactive</div>
            <div className="bg-red-500 flex items-center justify-center text-white text-xs font-bold" style={{width: '4.5%'}}>Blocked</div>
            <div className="bg-amber-500 flex items-center justify-center text-white text-xs font-bold" style={{width: '2.6%'}}>Locked</div>
          </div>
          <div className="flex gap-4 mt-3 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-foreground">Active: <span className="font-bold">2,654 (76.5%)</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-foreground">Inactive: <span className="font-bold">193 (5.6%)</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-foreground">Blocked: <span className="font-bold">156 (4.5%)</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-foreground">Locked: <span className="font-bold">89 (2.6%)</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards by FO Table */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-foreground mb-4">Cards by FO (Top 5)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-foreground">FO Name</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Allocated</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Issued</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Active</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Inactive</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground">Issues</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">Balance</th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">Cashback</th>
              </tr>
            </thead>
            <tbody>
              {topFOs.map((fo, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground font-medium">{fo.name}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{fo.allocated}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{fo.issued}</td>
                  <td className="px-4 py-3 text-center text-green-600 font-medium">{fo.active}</td>
                  <td className="px-4 py-3 text-center text-gray-600 font-medium">{fo.inactive}</td>
                  <td className="px-4 py-3 text-center text-red-600 font-medium">{fo.blocked + fo.locked}</td>
                  <td className="px-4 py-3 text-right text-foreground">{fo.balance}</td>
                  <td className="px-4 py-3 text-right text-amber-600 font-medium">{fo.cashback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card Wallets (FO Funded) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">Card Wallets (FO Funded)</h2>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
            <p className="text-3xl font-bold text-foreground mb-4">₹1.2Cr</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700"><span className="font-medium">Admin read-only access:</span> View wallet balances and transaction history only.</p>
            </div>
          </div>
        </div>

        {/* Incentive Wallets (MGL Funded) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">Incentive Wallets (MGL Funded)</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold text-foreground">₹45.2L</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Utilised</span>
                <span className="font-medium text-foreground">₹26.7L</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '59%'}} />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Unutilised</span>
              <span className="font-medium text-amber-600">₹18.5L</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
