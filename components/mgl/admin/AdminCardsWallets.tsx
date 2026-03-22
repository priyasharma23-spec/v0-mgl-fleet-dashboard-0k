"use client"

import { CreditCard, Wallet, Gift } from "lucide-react"

export default function AdminCardsWallets({ onViewChange }: { onViewChange: (v: string) => void }) {
  const summary = {
    totalCards: 2847,
    activeCards: 2654,
    blockedCards: 193,
    totalParentWallet: "₹4.2Cr",
    totalCardWallet: "₹1.8Cr",
    totalIncentiveWallet: "₹45.2L"
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Cards & Wallets Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor card status and wallet balances across all fleet operators</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.totalCards.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Cards</p>
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs">
            <span className="text-green-600">{summary.activeCards} Active</span>
            <span className="text-red-600">{summary.blockedCards} Blocked</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.totalParentWallet}</p>
              <p className="text-xs text-muted-foreground">Parent Wallet Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.totalCardWallet}</p>
              <p className="text-xs text-muted-foreground">Card Wallet (FO Funded)</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 lg:col-span-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.totalIncentiveWallet}</p>
              <p className="text-xs text-muted-foreground">Incentive Wallet (MGL Funded)</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">42% of allocated incentive pool utilized</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Note:</span> Admin has read-only access to FO-funded Card Wallets. Only MGL-funded Incentive Wallets can be configured.
        </p>
      </div>
    </div>
  )
}
