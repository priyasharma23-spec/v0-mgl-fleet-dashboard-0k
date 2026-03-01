"use client"
import { useState, useMemo } from "react"
import { CreditCard, Eye, EyeOff, Lock, Unlock, Copy, Download, Phone, Mail, MapPin, CheckCircle, Clock, AlertCircle, ChevronRight, MoreVertical, Search } from "lucide-react"

export default function FOCardsView({ onViewChange }: { onViewChange?: (view: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCard, setSelectedCard] = useState(null)
  const [showCardNumber, setShowCardNumber] = useState({})

  // Mock card data
  const cards = [
    {
      id: "CARD001",
      cardNumber: "1234567890123456",
      vehicleNumber: "MH-01-AB-0001",
      vehicleName: "Tata 407g Gold",
      status: "active",
      issuedDate: "2025-02-15",
      expiryDate: "2028-02-15",
      cardLimit: 50000,
      spent: 12500,
      blocked: false,
      embossingStatus: "done",
      deliveryStatus: "delivered"
    },
    {
      id: "CARD002",
      cardNumber: "2345678901234567",
      vehicleNumber: "MH-01-AB-0002",
      vehicleName: "Tata 609g SFC",
      status: "active",
      issuedDate: "2025-02-10",
      expiryDate: "2028-02-10",
      cardLimit: 75000,
      spent: 45200,
      blocked: false,
      embossingStatus: "done",
      deliveryStatus: "delivered"
    },
    {
      id: "CARD003",
      cardNumber: "3456789012345678",
      vehicleNumber: "MH-01-AB-0003",
      vehicleName: "Eicher Pro 2095XP",
      status: "pending",
      issuedDate: null,
      expiryDate: null,
      cardLimit: 60000,
      spent: 0,
      blocked: false,
      embossingStatus: "in-progress",
      deliveryStatus: "embossing"
    },
    {
      id: "CARD004",
      cardNumber: "4567890123456789",
      vehicleNumber: "MH-01-AB-0004",
      vehicleName: "Tata LPT 2518",
      status: "inactive",
      issuedDate: "2024-12-20",
      expiryDate: "2027-12-20",
      cardLimit: 100000,
      spent: 98700,
      blocked: true,
      embossingStatus: "done",
      deliveryStatus: "delivered"
    },
    {
      id: "CARD005",
      cardNumber: "5678901234567890",
      vehicleNumber: "MH-01-AB-0005",
      vehicleName: "Tata 1109g LPT",
      status: "replacement",
      issuedDate: "2025-01-10",
      expiryDate: "2028-01-10",
      cardLimit: 55000,
      spent: 8900,
      blocked: false,
      embossingStatus: "pending",
      deliveryStatus: "processing"
    }
  ]

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch = card.cardNumber.includes(searchTerm) || 
                           card.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || card.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  const stats = {
    total: cards.length,
    active: cards.filter(c => c.status === "active").length,
    pending: cards.filter(c => c.status === "pending").length,
    blocked: cards.filter(c => c.blocked).length
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
      pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
      inactive: { bg: "bg-gray-100", text: "text-gray-700", label: "Inactive" },
      replacement: { bg: "bg-blue-100", text: "text-blue-700", label: "Replacement" }
    }
    return badges[status] || badges.pending
  }

  const getDeliveryIcon = (status) => {
    const icons = {
      embossing: <Clock className="w-4 h-4" />,
      processing: <Clock className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />
    }
    return icons[status] || <Clock className="w-4 h-4" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">My Cards</h1>
        <p className="text-sm text-muted-foreground">Manage and track your fuel cards</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">Total Cards</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <p className="text-xs text-green-600 font-medium">Active</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{stats.active}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">{stats.pending}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <p className="text-xs text-red-600 font-medium">Blocked</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{stats.blocked}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by card number, vehicle number, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
          <option value="replacement">Replacement</option>
        </select>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filteredCards.map((card) => (
          <div key={card.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div
              className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 cursor-pointer flex items-center justify-between"
              onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{card.vehicleName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.vehicleNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadge(card.status).bg} ${getStatusBadge(card.status).text}`}>
                  {getStatusBadge(card.status).label}
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedCard === card.id ? "rotate-90" : ""}`} />
              </div>
            </div>

            {/* Card Details (Expandable) */}
            {selectedCard === card.id && (
              <div className="p-4 border-t border-border bg-card space-y-4">
                {/* Card Number & Limit */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Card Number</p>
                    <div className="flex items-center gap-2">
                      <input
                        type={showCardNumber[card.id] ? "text" : "password"}
                        value={card.cardNumber}
                        readOnly
                        className="text-sm font-mono bg-input px-2.5 py-1.5 rounded border border-border"
                      />
                      <button
                        onClick={() => setShowCardNumber({ ...showCardNumber, [card.id]: !showCardNumber[card.id] })}
                        className="p-1.5 hover:bg-muted rounded text-muted-foreground"
                      >
                        {showCardNumber[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Card Limit</p>
                    <p className="text-sm font-semibold text-foreground">₹{card.cardLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Spent</p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">₹{card.spent.toLocaleString()}</p>
                      <div className="w-full bg-border rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(card.spent / card.cardLimit) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates and Status */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
                  {card.issuedDate && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Issued Date</p>
                      <p className="text-sm font-medium text-foreground">{new Date(card.issuedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {card.expiryDate && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                      <p className="text-sm font-medium text-foreground">{new Date(card.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Embossing</p>
                    <div className="flex items-center gap-2">
                      {getDeliveryIcon(card.embossingStatus)}
                      <span className="text-xs capitalize text-foreground">{card.embossingStatus}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Delivery</p>
                    <div className="flex items-center gap-2">
                      {getDeliveryIcon(card.deliveryStatus)}
                      <span className="text-xs capitalize text-foreground">{card.deliveryStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  {card.status === "active" && !card.blocked && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      <Lock className="w-4 h-4" />
                      Block Card
                    </button>
                  )}
                  {card.blocked && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                      <Unlock className="w-4 h-4" />
                      Unblock Card
                    </button>
                  )}
                  {card.status === "pending" && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                    <Phone className="w-4 h-4" />
                    Support
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="p-8 text-center bg-muted/30 rounded-lg">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground">No cards found matching your search</p>
        </div>
      )}
    </div>
  )
}
