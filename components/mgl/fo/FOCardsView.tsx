"use client"

import { useState } from "react"
import { Search, Filter, MoreVertical, Wallet, Coins, CreditCard } from "lucide-react"
import { myVehicles, myFO } from "@/data/mock"
import { VehicleStatusBadge } from "@/components/mgl/shared"

interface FOCardsViewProps {
  onViewChange: (v: string) => void
  onManageCard?: (vehicleId: string) => void
}

export default function FOCardsView({ onViewChange, onManageCard }: FOCardsViewProps) {
  const [activeTab, setActiveTab] = useState<"vehicles" | "cards">("vehicles")
  const [searchVehicles, setSearchVehicles] = useState("")
  const [statusFilterVehicles, setStatusFilterVehicles] = useState("all")
  const [searchCards, setSearchCards] = useState("")
  const [statusFilterCards, setStatusFilterCards] = useState("all")

  const cardVehicles = myVehicles.filter((v) => v.cardNumber)

  const filteredCardVehicles = cardVehicles
    .filter((v) => {
      const query = searchVehicles.toLowerCase()
      return (
        v.vehicleNumber?.toLowerCase().includes(query) ||
        v.cardNumber?.toLowerCase().includes(query)
      )
    })
    .filter((v) => {
      if (statusFilterVehicles === "all") return true
      const statusMap: Record<string, string> = {
        active: "CARD_ACTIVE",
        inactive: "CARD_INACTIVE",
        blocked: "CARD_BLOCKED",
      }
      return v.status === statusMap[statusFilterVehicles]
    })

  const filteredCards = cardVehicles
    .filter((v) => {
      const query = searchCards.toLowerCase()
      return (
        v.vehicleNumber?.toLowerCase().includes(query) ||
        v.cardNumber?.toLowerCase().includes(query)
      )
    })
    .filter((v) => {
      if (statusFilterCards === "all") return true
      const statusMap: Record<string, string> = {
        active: "CARD_ACTIVE",
        inactive: "CARD_INACTIVE",
        blocked: "CARD_BLOCKED",
      }
      return v.status === statusMap[statusFilterCards]
    })

  const maskCardNumber = (cardNum?: string) => {
    if (!cardNum) return "MGL****0000"
    return `MGL****${cardNum.slice(-4)}`
  }

  return (
    <div className="flex flex-col gap-5 p-5 h-full">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Cards</h1>
        <p className="text-sm text-muted-foreground">Manage your fleet fuel cards and vehicle wallets</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "vehicles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Vehicle Card Wallets
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "cards"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          My Physical Cards
        </button>
      </div>

      {/* Tab 1: Vehicle Card Wallets */}
      {activeTab === "vehicles" && (
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by vehicle number or card..."
                value={searchVehicles}
                onChange={(e) => setSearchVehicles(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <select
              value={statusFilterVehicles}
              onChange={(e) => setStatusFilterVehicles(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Vehicle</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Card</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Card Balance</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Incentive</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCardVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No cards found
                      </td>
                    </tr>
                  ) : (
                    filteredCardVehicles.map((v) => (
                      <tr key={v.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{v.vehicleNumber || v.id}</td>
                        <td className="px-4 py-3 font-mono text-foreground">{maskCardNumber(v.cardNumber)}</td>
                        <td className="px-4 py-3">
                          <span className="text-blue-600 font-semibold">₹{v.cardBalance || 0}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-600 font-semibold">₹{v.incentiveBalance || 0}</span>
                        </td>
                        <td className="px-4 py-3">
                          <VehicleStatusBadge status={v.status} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => onManageCard?.(v.id)}
                            className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Physical Cards */}
      {activeTab === "cards" && (
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by vehicle, card number..."
                value={searchCards}
                onChange={(e) => setSearchCards(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <select
              value={statusFilterCards}
              onChange={(e) => setStatusFilterCards(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Cards count */}
          <p className="text-sm text-muted-foreground">Displaying {filteredCards.length} card(s)</p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto">
            {filteredCards.length === 0 ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <p className="text-muted-foreground">No cards found</p>
              </div>
            ) : (
              filteredCards.map((v) => (
                <div key={v.id} className="flex flex-col gap-3">
                  {/* Visual Card */}
                  <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl p-6 text-white h-40 flex flex-col justify-between relative overflow-hidden">
                    {/* Chip */}
                    <div className="absolute top-4 right-4 w-12 h-8 bg-yellow-400 rounded-lg opacity-60"></div>

                    {/* Card Number */}
                    <div>
                      <p className="text-sm font-semibold opacity-75">CARD NUMBER</p>
                      <p className="text-2xl font-bold tracking-widest mt-1">{maskCardNumber(v.cardNumber)}</p>
                    </div>

                    {/* Holder and Valid Thru */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-75">CARD HOLDER</p>
                        <p className="text-sm font-semibold mt-0.5">{myFO.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-75">VALID THRU</p>
                        <p className="text-sm font-semibold mt-0.5">12/27</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="bg-card rounded-xl border border-border p-3">
                    <p className="text-xs text-muted-foreground font-mono mb-3">{maskCardNumber(v.cardNumber)}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Card Wallet</p>
                        <p className="text-sm font-bold text-foreground">₹{v.cardBalance || 0}</p>
                        <p className="text-xs text-muted-foreground">Available</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Incentive</p>
                        <p className="text-sm font-bold text-green-600">₹{v.incentiveBalance || 0}</p>
                        <p className="text-xs text-muted-foreground">Coins</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors">
                        Load Card
                      </button>
                      <button className="flex-1 px-3 py-2 border border-border text-foreground text-xs font-semibold rounded-lg hover:bg-muted transition-colors">
                        Activate
                      </button>
                      <button className="px-3 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
