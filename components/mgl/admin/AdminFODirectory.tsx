"use client"

import { useState } from "react"
import { Search, Download, Eye, X, ArrowRight, Filter, Edit3, Check } from "lucide-react"

function FODetailDrawer({ foId, onClose, fleetOperators }: { foId: string; onClose: () => void; fleetOperators: any[] }) {
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  
  let fo = fleetOperators.find(f => f.id === foId)
  if (!fo) return null
  
  if (editMode && editData) {
    fo = editData
  }

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
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <button 
                onClick={() => {
                  const originalFO = fleetOperators.find(f => f.id === foId)
                  if (originalFO) {
                    Object.assign(originalFO, editData)
                  }
                  setEditMode(false)
                  setEditData(null)
                }}
                className="p-2 hover:bg-muted rounded-lg text-green-600">
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setEditMode(false)
                  setEditData(null)
                }}
                className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  setEditData(fleetOperators.find(f => f.id === foId))
                  setEditMode(true)
                }}
                className="p-2 hover:bg-muted rounded-lg">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

        <div className="p-4 space-y-5">
          {/* FO Info */}
          <div className="space-y-3">
            {editMode && editData ? (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name</label>
                  <input 
                    type="text" 
                    value={editData.name} 
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Region</label>
                  <input 
                    type="text" 
                    value={editData.region} 
                    onChange={(e) => setEditData({...editData, region: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Status</label>
                    <select 
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">KYC Status</label>
                    <select 
                      value={editData.kycStatus}
                      onChange={(e) => setEditData({...editData, kycStatus: e.target.value})}
                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
                    >
                      <option value="Verified">Verified</option>
                      <option value="Expiring">Expiring</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">{fo.name}</p>
                  <p className="text-sm text-muted-foreground">{fo.id} • {fo.region}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  fo.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>{fo.status}</span>
              </div>
            )}

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

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs text-green-700">Incentive Wallet</p>
                <p className="text-lg font-bold text-green-900">{fo.incentiveWallet}</p>
                <p className="text-xs text-green-600">MGL Funded</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-700">Cashback Earned</p>
                <p className="text-lg font-bold text-blue-900">{fo.cashback}</p>
                <p className="text-xs text-blue-600">Lifetime</p>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Bank Account Details</h3>
            {editMode && editData ? (
              <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Bank Name</label>
                  <input 
                    type="text" 
                    value={editData.bankName} 
                    onChange={(e) => setEditData({...editData, bankName: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Account Number</label>
                  <input 
                    type="text" 
                    value={editData.accountNumber} 
                    onChange={(e) => setEditData({...editData, accountNumber: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-input"
                    placeholder="****4521"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">IFSC Code</label>
                  <input 
                    type="text" 
                    value={editData.ifsc} 
                    onChange={(e) => setEditData({...editData, ifsc: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-input"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Account Type</label>
                  <select 
                    value={editData.accountType}
                    onChange={(e) => setEditData({...editData, accountType: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
                  >
                    <option value="Current">Current</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/30 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank Name:</span>
                  <span className="font-medium">{fo.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number:</span>
                  <span className="font-mono text-xs">{fo.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IFSC Code:</span>
                  <span className="font-medium">{fo.ifsc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type:</span>
                  <span className="font-medium">{fo.accountType}</span>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Cards */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Vehicle Cards</h3>
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
  const [showFilters, setShowFilters] = useState(false)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [kycFilter, setKycFilter] = useState("all")
  const [selectedFO, setSelectedFO] = useState<string | null>(null)

  const fleetOperators = [
    { id: "FO001", name: "ABC Logistics Pvt. Ltd.", region: "Mumbai", status: "Active", vehicles: 15, cards: 12, parentWallet: "₹2.4L", kycStatus: "Verified", joinedDate: "Jan 2025", bankName: "HDFC Bank", accountNumber: "****4521", ifsc: "HDFC0001234", accountType: "Current", incentiveWallet: "₹2.4L", cashback: "₹12,500" },
    { id: "FO002", name: "Metro Freight Solutions", region: "Pune", status: "Active", vehicles: 20, cards: 18, parentWallet: "₹5.1L", kycStatus: "Verified", joinedDate: "Mar 2025", bankName: "ICICI Bank", accountNumber: "****7890", ifsc: "ICIC0005678", accountType: "Savings", incentiveWallet: "₹3.8L", cashback: "₹28,900" },
    { id: "FO003", name: "Sunrise Transport Co.", region: "Thane", status: "Active", vehicles: 8, cards: 8, parentWallet: "₹1.2L", kycStatus: "Expiring", joinedDate: "Dec 2024", bankName: "Axis Bank", accountNumber: "****3456", ifsc: "UTIB0001111", accountType: "Current", incentiveWallet: "₹0.8L", cashback: "₹5,200" },
    { id: "FO004", name: "Quick Move Logistics", region: "Navi Mumbai", status: "Suspended", vehicles: 5, cards: 3, parentWallet: "₹0", kycStatus: "Expired", joinedDate: "Nov 2024", bankName: "Kotak Bank", accountNumber: "****9012", ifsc: "KKBK0002222", accountType: "Savings", incentiveWallet: "₹0.2L", cashback: "₹1,800" },
    { id: "FO005", name: "City Express Carriers", region: "Mumbai", status: "Active", vehicles: 25, cards: 22, parentWallet: "₹8.3L", kycStatus: "Verified", joinedDate: "Feb 2025", bankName: "Yes Bank", accountNumber: "****5678", ifsc: "YESB0003333", accountType: "Current", incentiveWallet: "₹5.2L", cashback: "₹42,100" },
  ]

  const getActiveFilterCount = () => {
    let count = 0
    if (statusFilter !== "all") count++
    if (kycFilter !== "all") count++
    if (fromDate) count++
    if (toDate) count++
    return count
  }

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

      {/* Search Row */}
      <div className="flex gap-3 items-center">
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
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted relative">
          <Filter className="w-4 h-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel - sibling, no shared wrapper */}
      {showFilters && (
        <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/30">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">KYC Status</label>
              <select
                value={kycFilter}
                onChange={(e) => setKycFilter(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="expiring">Expiring</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted"
              onClick={() => {}}
            >
              Apply
            </button>
            <button
              onClick={() => {
                setStatusFilter("all")
                setKycFilter("all")
                setFromDate("")
                setToDate("")
              }}
              className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted text-muted-foreground"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

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
