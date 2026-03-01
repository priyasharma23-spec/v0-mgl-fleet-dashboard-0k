"use client"

import { useState, useMemo } from "react"
import {
  Search, Filter, ChevronRight, AlertCircle, Download,
  ArrowDownLeft, ArrowUpRight, RefreshCw, CreditCard, Gift
} from "lucide-react"

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

const vehicleCards = generateVehicleCards(50)

export default function FOCardWalletsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "replacement">("all")
  const [sortBy, setSortBy] = useState<"vehicle" | "balance" | "recent">("vehicle")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount))
  }

  const filteredVehicles = useMemo(() => {
    let filtered = vehicleCards.filter(card => {
      const matchesSearch = card.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.cardNo.includes(searchQuery)
      const matchesStatus = filterStatus === "all" || card.status === filterStatus
      return matchesSearch && matchesStatus
    })

    if (sortBy === "balance") {
      filtered.sort((a, b) => (b.card + b.incentive) - (a.card + a.incentive))
    } else if (sortBy === "recent") {
      filtered.sort((a, b) => b.id.localeCompare(a.id))
    } else {
      filtered.sort((a, b) => a.vehicleNo.localeCompare(b.vehicleNo))
    }

    return filtered
  }, [searchQuery, filterStatus, sortBy])

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Card Wallets</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage vehicle card wallets and fund allocation</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by vehicle number or card number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="replacement">Replacement</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="vehicle">Sort: Vehicle</option>
            <option value="balance">Sort: Balance</option>
            <option value="recent">Sort: Recent</option>
          </select>

          <button className="px-3 py-2 text-sm flex items-center gap-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-foreground w-32">Vehicle</th>
                <th className="px-4 py-2 text-left font-semibold text-foreground w-28">Card No</th>
                <th className="px-4 py-2 text-right font-semibold text-foreground w-24">Card</th>
                <th className="px-4 py-2 text-right font-semibold text-foreground w-24">Incentive</th>
                <th className="px-4 py-2 text-right font-semibold text-foreground w-24">Total</th>
                <th className="px-4 py-2 text-center font-semibold text-foreground w-20">Status</th>
                <th className="px-4 py-2 text-center font-semibold text-foreground w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle, idx) => (
                <tr key={vehicle.id} className={idx % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                  <td className="px-4 py-2.5 text-foreground font-medium">{vehicle.vehicleNo}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{vehicle.cardNo}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold">₹{formatCurrency(vehicle.card)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Gift className="w-3.5 h-3.5 text-green-600" />
                      <span className="font-semibold">₹{formatCurrency(vehicle.incentive)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-bold">₹{formatCurrency(vehicle.card + vehicle.incentive)}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.status === "active" ? "bg-green-100 text-green-700" :
                      vehicle.status === "inactive" ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button className="p-1 hover:bg-muted rounded transition-colors">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
        <span>Showing {filteredVehicles.length} of {vehicleCards.length} cards</span>
        <button className="text-primary hover:underline">Clear filters</button>
      </div>
    </div>
  )
}
