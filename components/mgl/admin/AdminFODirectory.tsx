"use client"

import { useState } from "react"
import { Search, Download, Eye, X, ArrowRight } from "lucide-react"

function FODetailDrawer({ foId, onClose, fleetOperators }: { foId: string; onClose: () => void; fleetOperators: any[] }) {
  const fo = fleetOperators.find(f => f.id === foId)
  if (!fo) return null

  const cards = [
    { vehicle: "MH-12-AB-1234", cardNo: "****4521", cardWallet: "₹12,500", incentiveWallet: "₹2,100", status: "Active" },
    { vehicle: "MH-12-CD-5678", cardNo: "****4522", cardWallet: "₹8,200", incentiveWallet: "₹1,500", status: "Active" },
    { vehicle: "MH-12-EF-9012", cardNo: "****4523", cardWallet: "₹0", incentiveWallet: "₹800", status: "Blocked" },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-lg bg-card h-full overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-foreground">Fleet Operator Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* FO Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-lg">{fo.name}</p>
                <p className="text-sm text-muted-foreground">{fo.id} • {fo.region}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                fo.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>{fo.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Parent Wallet</p>
                <p className="text-lg font-bold text-foreground">{fo.parentWallet}</p>
                <p className="text-xs text-amber-600">T+1 Pending: ₹15,000</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Cards</p>
                <p className="text-lg font-bold text-foreground">{fo.cards}</p>
                <p className="text-xs text-muted-foreground">{fo.vehicles} vehicles</p>
              </div>
            </div>
          </div>

          {/* Cards List */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Card Wallets</h3>
            <div className="space-y-2">
              {cards.map((card, i) => (
                <div key={i} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{card.vehicle}</p>
                      <p className="text-xs text-muted-foreground">Card: {card.cardNo}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      card.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>{card.status}</span>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Card Wallet: </span>
                      <span className="font-medium text-blue-600">{card.cardWallet}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Incentive: </span>
                      <span className="font-medium text-green-600">{card.incentiveWallet}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History Link */}
          <button className="w-full py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
            View Transaction History <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Read-only access • FO-funded wallet modifications restricted
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminFODirectory({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFO, setSelectedFO] = useState<string | null>(null)

  const fleetOperators = [
    { id: "FO001", name: "ABC Logistics Pvt. Ltd.", region: "Mumbai", status: "Active", vehicles: 15, cards: 12, parentWallet: "₹2.4L", kycStatus: "Verified", joinedDate: "Jan 2025" },
    { id: "FO002", name: "Metro Freight Solutions", region: "Pune", status: "Active", vehicles: 20, cards: 18, parentWallet: "₹5.1L", kycStatus: "Verified", joinedDate: "Mar 2025" },
    { id: "FO003", name: "Sunrise Transport Co.", region: "Thane", status: "Active", vehicles: 8, cards: 8, parentWallet: "₹1.2L", kycStatus: "Expiring", joinedDate: "Dec 2024" },
    { id: "FO004", name: "Quick Move Logistics", region: "Navi Mumbai", status: "Suspended", vehicles: 5, cards: 3, parentWallet: "₹0", kycStatus: "Expired", joinedDate: "Nov 2024" },
    { id: "FO005", name: "City Express Carriers", region: "Mumbai", status: "Active", vehicles: 25, cards: 22, parentWallet: "₹8.3L", kycStatus: "Verified", joinedDate: "Feb 2025" },
  ]

  const filtered = fleetOperators.filter(fo => {
    const matchesSearch = fo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fo.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || fo.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Fleet Operator Directory</h1>
          <p className="text-sm text-muted-foreground">View and manage all registered fleet operators</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* FO Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["FO ID", "Name", "Region", "Status", "Vehicles", "Cards", "Parent Wallet", "KYC", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((fo) => (
                <tr key={fo.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs">{fo.id}</td>
                  <td className="px-4 py-3 font-medium">{fo.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fo.region}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      fo.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>{fo.status}</span>
                  </td>
                  <td className="px-4 py-3">{fo.vehicles}</td>
                  <td className="px-4 py-3">{fo.cards}</td>
                  <td className="px-4 py-3 font-medium">{fo.parentWallet}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      fo.kycStatus === "Verified" ? "bg-green-100 text-green-700" :
                      fo.kycStatus === "Expiring" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    }`}>{fo.kycStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedFO(fo.id)}
                      className="flex items-center gap-1 text-primary text-xs font-medium hover:underline"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FO Detail Drawer */}
      {selectedFO && (
        <FODetailDrawer 
          foId={selectedFO} 
          onClose={() => setSelectedFO(null)} 
          fleetOperators={fleetOperators}
        />
      )}
    </div>
  )
}
