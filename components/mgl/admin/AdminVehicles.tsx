"use client"

import { useState } from "react"
import { Search, Filter, X, Truck, CheckCircle, Clock, AlertTriangle, Eye, Users } from "lucide-react"

export default function AdminVehicles() {
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [foFilter, setFoFilter] = useState("All")
  const [fuelFilter, setFuelFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const vehicles = [
    { id: "MH12AB1234", fo: "ABC Logistics", foId: "FO-2026-0088", driver: "Ramesh Kumar", driverMobile: "+91 98765 43210", fuel: "CNG", card: "****4521", cardStatus: "Active", status: "Active", lastTxn: "Mar 23 2026", lastTxnAmt: "₹2,450", txnCount: 127, regDate: "Jan 15 2026", approval: "Approved" },
    { id: "MH12CD5678", fo: "Metro Freight", foId: "FO-2026-0091", driver: "Suresh Patil", driverMobile: "+91 98765 43211", fuel: "CNG", card: "****4522", cardStatus: "Active", status: "Active", lastTxn: "Mar 22 2026", lastTxnAmt: "₹3,100", txnCount: 94, regDate: "Feb 10 2026", approval: "Approved" },
    { id: "KA05XY5678", fo: "Metro Freight", foId: "FO-2026-0091", driver: "Vikram Singh", driverMobile: "+91 98765 43212", fuel: "CNG", card: "****3175", cardStatus: "Active", status: "Active", lastTxn: "Mar 23 2026", lastTxnAmt: "₹1,890", txnCount: 156, regDate: "Jan 22 2026", approval: "Approved" },
    { id: "DL08CD9012", fo: "Urban Transport", foId: "FO-2026-0150", driver: "Amit Sharma", driverMobile: "+91 98765 43213", fuel: "CNG", card: "****2891", cardStatus: "Inactive", status: "Inactive", lastTxn: "Mar 20 2026", lastTxnAmt: "₹1,200", txnCount: 45, regDate: "Mar 01 2026", approval: "Approved" },
    { id: "TN03EF3456", fo: "City Express", foId: "FO-2026-0201", driver: "Rajan Kumar", driverMobile: "+91 98765 43214", fuel: "CNG", card: "****1654", cardStatus: "Active", status: "Active", lastTxn: "Mar 23 2026", lastTxnAmt: "₹2,750", txnCount: 89, regDate: "Feb 28 2026", approval: "Approved" },
    { id: "MH47BY2770", fo: "ABC Logistics", foId: "FO-2026-0088", driver: "Deepak Nair", driverMobile: "+91 98765 43215", fuel: "CNG", card: "****1138", cardStatus: "Active", status: "Active", lastTxn: "Mar 23 2026", lastTxnAmt: "₹2,100", txnCount: 203, regDate: "Jan 05 2026", approval: "Approved" },
    { id: "MH47BY1688", fo: "ABC Logistics", foId: "FO-2026-0088", driver: "Pradeep Rao", driverMobile: "+91 98765 43216", fuel: "CNG", card: "****3175", cardStatus: "Blocked", status: "Active", lastTxn: "Mar 21 2026", lastTxnAmt: "₹1,650", txnCount: 112, regDate: "Jan 28 2026", approval: "Approved" },
    { id: "KA09ZZ0021", fo: "Quick Move", foId: "FO-2026-0315", driver: "Sunil Mehta", driverMobile: "+91 98765 43217", fuel: "CNG", card: "****9901", cardStatus: "Active", status: "Pending", lastTxn: "Mar 18 2026", lastTxnAmt: "₹890", txnCount: 12, regDate: "Mar 15 2026", approval: "Pending Approval" },
  ]

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Active: "bg-green-100 text-green-700",
      Inactive: "bg-gray-100 text-gray-700",
      Blocked: "bg-red-100 text-red-700",
      Pending: "bg-amber-100 text-amber-700",
    }
    return map[status] || "bg-gray-100 text-gray-700"
  }

  const filteredVehicles = vehicles.filter(v => 
    (searchTerm === "" || v.id.toLowerCase().includes(searchTerm.toLowerCase()) || v.driver.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "All" || v.status === statusFilter) &&
    (foFilter === "All" || v.fo === foFilter) &&
    (fuelFilter === "All" || v.fuel === fuelFilter)
  )

  const summaryCards = [
    { label: "Total Vehicles", value: "3,200", icon: Truck, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
    { label: "Active", value: "2,654", icon: CheckCircle, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { label: "Drivers", value: "2,847", icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Pending Approval", value: "45", icon: AlertTriangle, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between">
                <div className={`${card.iconBg} rounded-lg p-2`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search by vehicle number or driver..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">From Date</label>
                <input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">To Date</label>
                <input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                  <option value="All">All</option><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Blocked">Blocked</option><option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">FO Name</label>
                <select value={foFilter} onChange={e => setFoFilter(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                  <option value="All">All</option><option value="ABC Logistics">ABC Logistics</option><option value="Metro Freight">Metro Freight</option><option value="Sunrise Transport">Sunrise Transport</option><option value="City Express">City Express</option><option value="Quick Move">Quick Move</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Fuel Type</label>
                <select value={fuelFilter} onChange={e => setFuelFilter(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                  <option value="All">All</option><option value="CNG">CNG</option><option value="Diesel">Diesel</option><option value="Electric">Electric</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setStatusFilter("All"); setFoFilter("All"); setFuelFilter("All"); }} className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear All</button>
              <button onClick={() => setShowFilters(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply</button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicles Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-semibold">Vehicle No</th>
              <th className="px-4 py-3 text-left font-semibold">FO Name</th>
              <th className="px-4 py-3 text-left font-semibold">Driver</th>
              <th className="px-4 py-3 text-left font-semibold">Fuel Type</th>
              <th className="px-4 py-3 text-left font-semibold">Card Number</th>
              <th className="px-4 py-3 text-left font-semibold">Card Status</th>
              <th className="px-4 py-3 text-left font-semibold">Vehicle Status</th>
              <th className="px-4 py-3 text-left font-semibold">Last Transaction</th>
              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredVehicles.map(v => (
              <tr key={v.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono font-medium">{v.id}</td>
                <td className="px-4 py-3">{v.fo}</td>
                <td className="px-4 py-3 text-sm">{v.driver}</td>
                <td className="px-4 py-3 text-sm">{v.fuel}</td>
                <td className="px-4 py-3 font-mono text-sm">{v.card}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge(v.cardStatus)}`}>{v.cardStatus}</span></td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge(v.status)}`}>{v.status}</span></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{v.lastTxn}</td>
                <td className="px-4 py-3 text-center"><button onClick={() => setSelectedEntity(v)} className="text-primary hover:underline text-xs font-medium"><Eye className="w-3.5 h-3.5 inline" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right Tray */}
      {selectedEntity && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedEntity(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-semibold">Vehicle Details</h3>
              <button onClick={() => setSelectedEntity(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="font-mono text-2xl font-bold">{selectedEntity.id}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusBadge(selectedEntity.status)}`}>{selectedEntity.status}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><p className="text-muted-foreground">FO Name</p><p className="font-medium">{selectedEntity.fo}</p></div>
                <div><p className="text-muted-foreground">FO ID</p><p className="font-mono text-xs">{selectedEntity.foId}</p></div>
              </div>
              <div className="space-y-2 text-sm">
                <div><p className="text-muted-foreground">Driver Name</p><p className="font-medium">{selectedEntity.driver}</p></div>
                <div><p className="text-muted-foreground">Mobile</p><p className="font-mono">{selectedEntity.driverMobile}</p></div>
              </div>
              <div><span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${selectedEntity.fuel === 'CNG' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{selectedEntity.fuel}</span></div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold mb-3">Card Information</p>
                <div className="space-y-2 text-sm">
                  <div><p className="text-muted-foreground">Card Number</p><p className="font-mono">{selectedEntity.card}</p></div>
                  <div><p className="text-muted-foreground">Card Status</p><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge(selectedEntity.cardStatus)}`}>{selectedEntity.cardStatus}</span></div>
                  <div><p className="text-muted-foreground">Wallet Balance</p><p className="font-medium">₹5,200</p></div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold mb-3">Vehicle Details</p>
                <div className="space-y-2 text-sm">
                  <div><p className="text-muted-foreground">Registration Date</p><p>{selectedEntity.regDate}</p></div>
                  <div><p className="text-muted-foreground">Last Transaction</p><p>{selectedEntity.lastTxn} • {selectedEntity.lastTxnAmt}</p></div>
                  <div><p className="text-muted-foreground">Total Transactions</p><p className="font-medium">{selectedEntity.txnCount}</p></div>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold mb-3">Approval Status</p>
                <p className="text-sm">{selectedEntity.approval}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
