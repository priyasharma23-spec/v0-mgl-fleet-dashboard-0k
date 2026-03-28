"use client"

import { useState } from "react"
import { CreditCard, CheckCircle, XCircle, Wallet, Gift, Percent, AlertCircle, Lock, Search } from "lucide-react"
import { FilterPanel, FilterField, FilterSelect, FilterActions } from "@/components/mgl/shared"

export default function AdminCardsWallets({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [cardSearch, setCardSearch] = useState("")
  const [cardStatus, setCardStatus] = useState("all")
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

      {/* Tab Switcher */}
      <div className="flex gap-1 border-b border-border">
        <button onClick={() => setActiveTab("overview")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Overview</button>
        <button onClick={() => setActiveTab("issued-cards")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === "issued-cards" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Issued Cards</button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-5">

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
        <div className="flex gap-1 h-4 mb-5">
          <div className="bg-green-500 transition-all rounded-l-sm" style={{width: '76.5%'}} />
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

      {/* Total Balance on Cards */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Total Balance on Cards</h3>
          <span className="text-sm font-bold text-foreground">₹1.2Cr</span>
        </div>
        <div className="flex gap-1 h-3 mb-4">
          <div className="bg-blue-500 rounded-l-sm" style={{width:'71.2%'}} />
          <div className="bg-green-500" style={{width:'15.2%'}} />
          <div className="bg-red-500" style={{width:'5.3%'}} />
          <div className="bg-amber-400" style={{width:'8.3%'}} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <p className="text-xs text-blue-700 font-medium">FO Loaded</p>
            </div>
            <p className="text-xl font-bold text-blue-900">₹85.4L</p>
            <p className="text-xs text-blue-600 mt-0.5">71.2% of total</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <p className="text-xs text-green-700 font-medium">Incentive (Active)</p>
            </div>
            <p className="text-xl font-bold text-green-900">₹18.2L</p>
            <p className="text-xs text-green-600 mt-0.5">15.2% of total</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <p className="text-xs text-red-700 font-medium">Incentive (Expired)</p>
            </div>
            <p className="text-xl font-bold text-red-900">₹6.4L</p>
            <p className="text-xs text-red-600 mt-0.5">5.3% of total</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <p className="text-xs text-amber-700 font-medium">Cashback</p>
            </div>
            <p className="text-xl font-bold text-amber-900">₹10.0L</p>
            <p className="text-xs text-amber-600 mt-0.5">8.3% of total</p>
          </div>
        </div>
      </div>

      {/* Total Cashback Unutilised */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Total Cashback Unutilised</h3>
          <span className="text-sm font-bold text-foreground">₹18.5L</span>
        </div>
        <div className="flex gap-1 h-3 mb-4">
          <div className="bg-green-500 rounded-l-sm" style={{width:'67%'}} />
          <div className="bg-amber-400" style={{width:'22.7%'}} />
          <div className="bg-red-500" style={{width:'10.3%'}} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-green-500" /><p className="text-xs text-green-700 font-medium">Earned Unused</p></div>
            <p className="text-xl font-bold text-green-900">₹12.4L</p>
            <p className="text-xs text-green-600 mt-0.5">67% of total</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><p className="text-xs text-amber-700 font-medium">Expiring in 30d</p></div>
            <p className="text-xl font-bold text-amber-900">₹4.2L</p>
            <p className="text-xs text-amber-600 mt-0.5">22.7% of total</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><p className="text-xs text-red-700 font-medium">Expired</p></div>
            <p className="text-xl font-bold text-red-900">₹1.9L</p>
            <p className="text-xs text-red-600 mt-0.5">10.3% of total</p>
          </div>
        </div>
      </div>

      {/* Total Incentive Unutilised */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Total Incentive Unutilised</h3>
          <span className="text-sm font-bold text-foreground">₹45.2L</span>
        </div>
        <div className="flex gap-1 h-3 mb-4">
          <div className="bg-purple-500 rounded-l-sm" style={{width:'71%'}} />
          <div className="bg-amber-400" style={{width:'19%'}} />
          <div className="bg-gray-400" style={{width:'10%'}} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-purple-500" /><p className="text-xs text-purple-700 font-medium">Active</p></div>
            <p className="text-xl font-bold text-purple-900">₹32.1L</p>
            <p className="text-xs text-purple-600 mt-0.5">71% of total</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><p className="text-xs text-amber-700 font-medium">Expiring in 30d</p></div>
            <p className="text-xl font-bold text-amber-900">₹8.6L</p>
            <p className="text-xs text-amber-600 mt-0.5">19% of total</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full bg-gray-400" /><p className="text-xs text-gray-700 font-medium">Pending</p></div>
            <p className="text-xl font-bold text-gray-900">₹4.5L</p>
            <p className="text-xs text-gray-600 mt-0.5">10% of total</p>
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
        </div>
      )}

      {/* Issued Cards Tab */}
      {activeTab === "issued-cards" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">Issued Cards</h3>
                <p className="text-xs text-muted-foreground mt-0.5">All cards issued across fleet operators</p>
              </div>
            </div>
            <FilterPanel
              searchPlaceholder="Search by card, vehicle or FO..."
              searchValue={cardSearch}
              onSearchChange={setCardSearch}
              activeFilterCount={cardStatus !== "all" ? 1 : 0}
            >
              <FilterField label="Status">
                <FilterSelect
                  value={cardStatus}
                  onChange={setCardStatus}
                  options={[
                    { label: "All Status", value: "all" },
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                    { label: "Blocked", value: "Blocked" },
                    { label: "Locked", value: "Locked" },
                  ]}
                />
              </FilterField>
              <FilterActions onClear={() => { setCardStatus("all") }} onApply={() => {}} />
            </FilterPanel>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">Card Number</th>
                <th className="px-4 py-3 text-left font-semibold">FO Name</th>
                <th className="px-4 py-3 text-left font-semibold">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold">Driver</th>
                <th className="px-4 py-3 text-left font-semibold">Card Wallet</th>
                <th className="px-4 py-3 text-left font-semibold">Incentive</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Issued Date</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {[
                  { card: "****4521", fo: "ABC Logistics", vehicle: "MH47BY2770", driver: "Deepak Nair", wallet: "₹12,500", incentive: "₹2,100", status: "Active", date: "Jan 15, 2026" },
                  { card: "****4522", fo: "ABC Logistics", vehicle: "MH12AB1234", driver: "Ramesh Kumar", wallet: "₹8,200", incentive: "₹1,500", status: "Active", date: "Jan 18, 2026" },
                  { card: "****3175", fo: "Metro Freight", vehicle: "KA05XY5678", driver: "Vikram Singh", wallet: "₹15,400", incentive: "₹3,200", status: "Active", date: "Feb 02, 2026" },
                  { card: "****2891", fo: "Urban Transport", vehicle: "DL08CD9012", driver: "Amit Sharma", wallet: "₹0", incentive: "₹0", status: "Inactive", date: "Feb 10, 2026" },
                  { card: "****1654", fo: "City Express", vehicle: "TN03EF3456", driver: "Rajan Kumar", wallet: "₹9,800", incentive: "₹1,800", status: "Active", date: "Feb 14, 2026" },
                  { card: "****1138", fo: "ABC Logistics", vehicle: "MH47BY2770", driver: "Deepak Nair", wallet: "₹43,522", incentive: "₹5,400", status: "Active", date: "Mar 01, 2026" },
                  { card: "****9901", fo: "Quick Move", vehicle: "KA09ZZ0021", driver: "Sunil Mehta", wallet: "₹6,200", incentive: "₹900", status: "Locked", date: "Mar 10, 2026" },
                  { card: "****3344", fo: "Metro Freight", vehicle: "MH12CD5678", driver: "Suresh Patil", wallet: "₹0", incentive: "₹800", status: "Blocked", date: "Mar 15, 2026" },
                ].map((row, i) => {
                  const statusColor = row.status === "Active" ? "bg-green-100 text-green-700" : row.status === "Inactive" ? "bg-gray-100 text-gray-600" : row.status === "Blocked" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  return (
                    <tr key={i} className="hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3 font-mono font-medium">{row.card}</td>
                      <td className="px-4 py-3">{row.fo}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.vehicle}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.driver}</td>
                      <td className="px-4 py-3 font-medium">{row.wallet}</td>
                      <td className="px-4 py-3 text-green-700 font-medium">{row.incentive}</td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>{row.status}</span></td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{row.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
