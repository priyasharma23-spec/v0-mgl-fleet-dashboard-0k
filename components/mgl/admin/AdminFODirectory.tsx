"use client"

import { useState } from "react"
import { Search, Download, Eye, X, ArrowRight, Filter, Edit3, Check, Users, CheckCircle, AlertTriangle, CreditCard, Wallet } from "lucide-react"
import { KPICard } from "@/components/mgl/shared"

function FODetailDrawer({ foId, onClose, fleetOperators }: { foId: string; onClose: () => void; fleetOperators: any[] }) {
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [showTransactions, setShowTransactions] = useState(false)
  const [txnTab, setTxnTab] = useState<"POS"|"Load"|"All">("All")
  const fo = fleetOperators.find(f => f.id === foId)
  if (!fo) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
      <div className="w-96 bg-card h-full overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-semibold text-foreground">{showTransactions ? "Transaction History" : "Fleet Operator Details"}</h2>
            {showTransactions && <p className="text-xs text-muted-foreground">{fo.name}</p>}
          </div>
          <div className="flex items-center gap-2">
            {!showTransactions && !editMode && <button onClick={() => { setEditData({...fo}); setEditMode(true) }} className="p-2 hover:bg-muted rounded-lg"><Edit3 className="w-4 h-4 text-muted-foreground" /></button>}
            {editMode && <button onClick={() => { setEditMode(false); setEditData(null) }} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>}
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {showTransactions ? (
          <div className="p-4 space-y-4">
            <button onClick={() => setShowTransactions(false)} className="flex items-center gap-2 text-sm text-primary hover:underline">← Back</button>
            <div className="flex gap-1 border-b border-border">
              {["All", "POS", "Load"].map(tab => (
                <button key={tab} onClick={() => setTxnTab(tab as any)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${txnTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                  {tab}
                </button>
              ))}
            </div>
            {(() => {
              const filteredTxns = txnTab === "All" ? fo.transactions : fo.transactions?.filter((t: any) => t.type === txnTab)
              return (
                <>
                  <div className="flex gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                    <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold">{filteredTxns?.length || 0}</p></div>
                    <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-bold">₹{(filteredTxns?.reduce((s: number, t: any) => s + t.amount, 0) || 0).toLocaleString()}</p></div>
                  </div>
                  <div className="space-y-2">
                    {filteredTxns?.map((txn: any) => (
                      <div key={txn.id} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50">
                        <div className="flex-1"><p className="text-xs font-mono font-semibold">{txn.id}</p><p className="text-xs text-muted-foreground">{txn.date}</p></div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${txn.type === 'POS' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{txn.type}</span>
                        <div className="text-right"><p className="font-bold text-sm">₹{txn.amount.toLocaleString()}</p><p className={`text-xs ${txn.status === 'Successful' ? 'text-green-600' : txn.status === 'Failed' ? 'text-red-600' : 'text-amber-600'}`}>{txn.status}</p></div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })()}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div><h3 className="font-bold text-lg">{fo.name}</h3><p className="text-sm text-muted-foreground">{fo.id} • {fo.region}</p></div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${fo.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{fo.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg"><p className="text-xs text-muted-foreground">Parent Wallet</p><p className="font-bold text-lg">{fo.parentWallet}</p><p className="text-xs text-amber-600">T+1 Pending: ₹15,000</p></div>
              <div className="p-3 bg-muted/30 rounded-lg"><p className="text-xs text-muted-foreground">Total Cards</p><p className="font-bold text-lg">{fo.cards}</p><p className="text-xs text-muted-foreground">{fo.vehicles} vehicles</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Incentive Wallet</p>
                <p className="font-bold text-lg">{fo.incentiveWallet}</p>
                <p className="text-xs text-green-600">Unused: {fo.incentiveUnused}</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Cashback Earned</p>
                <p className="font-bold text-lg">{fo.cashback}</p>
                <p className="text-xs text-blue-600">Unused: {fo.cashbackUnused}</p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold">Bank Account Details</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Bank Name</span><span className="font-medium">{fo.bankName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Number</span><span className="font-mono font-medium">{fo.accountNumber}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">IFSC Code</span><span className="font-mono font-medium">{fo.ifsc}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Type</span><span className="font-medium">{fo.accountType}</span></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Vehicle Cards</p>
              <div className="space-y-2">
                {fo.cards && Array.from({length: 3}, (_, i) => (
                  <div key={i} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1"><span className="font-medium text-sm">MH-12-AB-{1234+i}</span><span className={`px-2 py-0.5 text-xs rounded-full ${i === 2 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{i === 2 ? 'Blocked' : 'Active'}</span></div>
                    <p className="text-xs text-muted-foreground">Card: ****{4521+i}</p>
                    <div className="flex gap-3 mt-1 text-xs"><span className="text-blue-600">Card Wallet: ₹{(12500-i*4000).toLocaleString()}</span><span className="text-green-600">Incentive: ₹{(2100-i*600).toLocaleString()}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setShowTransactions(true)} className="w-full py-3 border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 flex items-center justify-center gap-2">View Transaction History →</button>
            <p className="text-xs text-muted-foreground text-center">Read-only access • FO-funded wallet modifications restricted</p>
          </div>
        )}
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
    { id: "FO001", name: "ABC Logistics Pvt. Ltd.", region: "Mumbai", status: "Active", vehicles: 15, cards: 12, parentWallet: "₹2.4L", kycStatus: "Verified", joinedDate: "Jan 2025", bankName: "HDFC Bank", accountNumber: "****4521", ifsc: "HDFC0001234", accountType: "Current", incentiveWallet: "₹2.4L", cashback: "₹12,500", incentiveLifetime: "₹5.2L", incentiveUnused: "₹2.4L", cashbackLifetime: "₹18,500", cashbackUnused: "₹12,500", transactions: [{ id: 'TXN001', date: 'Mar 21, 2024 10:30 AM', type: 'POS', amount: 50000, status: 'Successful' }, { id: 'TXN002', date: 'Mar 20, 2024 02:15 PM', type: 'Load', amount: 25000, status: 'Successful' }, { id: 'TXN003', date: 'Mar 19, 2024 11:00 AM', type: 'POS', amount: 15000, status: 'Failed' }, { id: 'TXN004', date: 'Mar 18, 2024 04:45 PM', type: 'POS', amount: 8000, status: 'Pending' }] },
    { id: "FO002", name: "Metro Freight Solutions", region: "Pune", status: "Active", vehicles: 20, cards: 18, parentWallet: "₹5.1L", kycStatus: "Verified", joinedDate: "Mar 2025", bankName: "ICICI Bank", accountNumber: "****7890", ifsc: "ICIC0005678", accountType: "Savings", incentiveWallet: "₹3.8L", cashback: "₹28,900", incentiveLifetime: "₹8.5L", incentiveUnused: "₹3.8L", cashbackLifetime: "₹42,100", cashbackUnused: "₹28,900", transactions: [{ id: 'TXN101', date: 'Mar 21, 2024 09:00 AM', type: 'POS', amount: 75000, status: 'Successful' }, { id: 'TXN102', date: 'Mar 20, 2024 03:30 PM', type: 'Load', amount: 50000, status: 'Successful' }, { id: 'TXN103', date: 'Mar 19, 2024 01:15 PM', type: 'POS', amount: 30000, status: 'Pending' }] },
    { id: "FO003", name: "Sunrise Transport Co.", region: "Thane", status: "Active", vehicles: 8, cards: 8, parentWallet: "₹1.2L", kycStatus: "Expiring", joinedDate: "Dec 2024", bankName: "Axis Bank", accountNumber: "****3456", ifsc: "UTIB0001111", accountType: "Current", incentiveWallet: "₹0.8L", cashback: "₹5,200", incentiveLifetime: "₹2.1L", incentiveUnused: "₹0.8L", cashbackLifetime: "₹9,800", cashbackUnused: "₹5,200", transactions: [{ id: 'TXN201', date: 'Mar 21, 2024 11:45 AM', type: 'POS', amount: 20000, status: 'Successful' }, { id: 'TXN202', date: 'Mar 20, 2024 05:20 PM', type: 'POS', amount: 10000, status: 'Failed' }] },
    { id: "FO004", name: "Quick Move Logistics", region: "Navi Mumbai", status: "Suspended", vehicles: 5, cards: 3, parentWallet: "₹0", kycStatus: "Expired", joinedDate: "Nov 2024", bankName: "Kotak Bank", accountNumber: "****9012", ifsc: "KKBK0002222", accountType: "Savings", incentiveWallet: "₹0.2L", cashback: "₹1,800", incentiveLifetime: "₹0.6L", incentiveUnused: "₹0.2L", cashbackLifetime: "₹3,200", cashbackUnused: "₹1,800", transactions: [{ id: 'TXN301', date: 'Mar 21, 2024 02:10 PM', type: 'Load', amount: 5000, status: 'Failed' }] },
    { id: "FO005", name: "City Express Carriers", region: "Mumbai", status: "Active", vehicles: 25, cards: 22, parentWallet: "₹8.3L", kycStatus: "Verified", joinedDate: "Feb 2025", bankName: "Yes Bank", accountNumber: "****5678", ifsc: "YESB0003333", accountType: "Current", incentiveWallet: "₹5.2L", cashback: "₹42,100", incentiveLifetime: "₹12.8L", incentiveUnused: "₹5.2L", cashbackLifetime: "₹68,500", cashbackUnused: "₹42,100", transactions: [{ id: 'TXN401', date: 'Mar 21, 2024 08:30 AM', type: 'POS', amount: 120000, status: 'Successful' }, { id: 'TXN402', date: 'Mar 20, 2024 04:00 PM', type: 'Load', amount: 80000, status: 'Successful' }, { id: 'TXN403', date: 'Mar 19, 2024 02:25 PM', type: 'POS', amount: 45000, status: 'Successful' }, { id: 'TXN404', date: 'Mar 18, 2024 06:15 PM', type: 'POS', amount: 35000, status: 'Pending' }] },
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

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard label="Total FOs" value="127" icon={Users} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <KPICard label="Active" value="118" icon={CheckCircle} iconBg="bg-green-100" iconColor="text-green-600" />
        <KPICard label="KYC Expiring" value="8" icon={AlertTriangle} iconBg="bg-amber-100" iconColor="text-amber-600" subtitle="Within 30 days" subtitleColor="text-amber-600" />
        <KPICard label="Total Cards" value="2,847" icon={CreditCard} iconBg="bg-purple-100" iconColor="text-purple-600" />
        <KPICard label="Total Wallet Balance" value="₹4.2Cr" icon={Wallet} iconBg="bg-green-100" iconColor="text-green-600" />
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
