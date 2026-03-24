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

      {/* Cards by Status */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Cards by Status</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Total Cards:</span>
            <span className="text-sm font-bold text-foreground">3,465</span>
          </div>
        </div>
        
        {/* Stacked bar with rounded ends and spacing */}
        <div className="flex rounded-full overflow-hidden h-4 gap-0.5 mb-5">
          <div className="bg-green-500 transition-all" style={{width: '76.5%'}} />
          <div className="bg-gray-300 transition-all" style={{width: '5.6%'}} />
          <div className="bg-red-500 transition-all" style={{width: '4.5%'}} />
          <div className="bg-amber-400 transition-all" style={{width: '2.6%'}} />
        </div>

        {/* 4 stat cards below the bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <p className="text-xs text-green-700 font-medium">Active</p>
            </div>
            <p className="text-xl font-bold text-green-900">2,654</p>
            <p className="text-xs text-green-600 mt-0.5">76.5% of total</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <p className="text-xs text-gray-600 font-medium">Inactive</p>
            </div>
            <p className="text-xl font-bold text-gray-800">193</p>
            <p className="text-xs text-gray-500 mt-0.5">5.6% of total</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <p className="text-xs text-red-700 font-medium">Blocked</p>
            </div>
            <p className="text-xl font-bold text-red-900">156</p>
            <p className="text-xs text-red-600 mt-0.5">4.5% of total</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <p className="text-xs text-amber-700 font-medium">Locked</p>
            </div>
            <p className="text-xl font-bold text-amber-900">89</p>
            <p className="text-xs text-amber-600 mt-0.5">2.6% of total</p>
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

      {/* Total Balance on Cards */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Total Balance on Cards</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Total:</span>
            <span className="text-sm font-bold text-foreground">₹1.2Cr</span>
          </div>
        </div>
        
        {/* Stacked bar */}
        <div className="flex rounded-full overflow-hidden h-4 gap-0.5 mb-5">
          <div className="bg-blue-500 transition-all" style={{width: '71.2%'}} />
          <div className="bg-purple-500 transition-all" style={{width: '20.5%'}} />
          <div className="bg-amber-400 transition-all" style={{width: '8.3%'}} />
        </div>

        {/* Inline legend */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">FO Funded Wallet</span>
            <span className="text-sm font-bold text-blue-700">₹85.4L</span>
            <span className="text-xs text-muted-foreground">(71.2%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-sm text-muted-foreground">MGL Incentive Wallet</span>
            <span className="text-sm font-bold text-purple-700">₹24.6L</span>
            <span className="text-xs text-muted-foreground">(20.5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-sm text-muted-foreground">Cashback Wallet</span>
            <span className="text-sm font-bold text-amber-700">₹10.0L</span>
            <span className="text-xs text-muted-foreground">(8.3%)</span>
          </div>
        </div>
      </div>

      {/* Total Cashback Unutilised */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Total Cashback Unutilised</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Total:</span>
            <span className="text-sm font-bold text-foreground">₹18.5L</span>
          </div>
        </div>
        
        {/* Stacked bar */}
        <div className="flex rounded-full overflow-hidden h-4 gap-0.5 mb-5">
          <div className="bg-green-500 transition-all" style={{width: '67%'}} />
          <div className="bg-amber-400 transition-all" style={{width: '22.7%'}} />
          <div className="bg-red-500 transition-all" style={{width: '10.3%'}} />
        </div>

        {/* Inline legend */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Earned but unused</span>
            <span className="text-sm font-bold text-green-700">₹12.4L</span>
            <span className="text-xs text-muted-foreground">(67%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-sm text-muted-foreground">Expiring in 30 days</span>
            <span className="text-sm font-bold text-amber-700">₹4.2L</span>
            <span className="text-xs text-muted-foreground">(22.7%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Expired (pending clearance)</span>
            <span className="text-sm font-bold text-red-700">₹1.9L</span>
            <span className="text-xs text-muted-foreground">(10.3%)</span>
          </div>
        </div>
      </div>

      {/* Total Incentive Unutilised */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Total Incentive Unutilised</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Total:</span>
            <span className="text-sm font-bold text-foreground">₹45.2L</span>
          </div>
        </div>
        
        {/* Stacked bar */}
        <div className="flex rounded-full overflow-hidden h-4 gap-0.5 mb-5">
          <div className="bg-purple-500 transition-all" style={{width: '71%'}} />
          <div className="bg-amber-400 transition-all" style={{width: '19%'}} />
          <div className="bg-gray-400 transition-all" style={{width: '10%'}} />
        </div>

        {/* Inline legend */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-sm text-muted-foreground">Active incentives</span>
            <span className="text-sm font-bold text-purple-700">₹32.1L</span>
            <span className="text-xs text-muted-foreground">(71%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-sm text-muted-foreground">Expiring in 30 days</span>
            <span className="text-sm font-bold text-amber-700">₹8.6L</span>
            <span className="text-xs text-muted-foreground">(19%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            <span className="text-sm text-muted-foreground">Pending allocation</span>
            <span className="text-sm font-bold text-gray-700">₹4.5L</span>
            <span className="text-xs text-muted-foreground">(10%)</span>
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
