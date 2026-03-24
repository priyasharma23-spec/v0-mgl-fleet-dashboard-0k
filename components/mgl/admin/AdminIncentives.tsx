"use client"

import { useState } from "react"
import { Download, Search, X, Eye, CheckCircle, FileText, XCircle, Gift, Filter } from "lucide-react"

export default function AdminIncentives({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState("programs")
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const programs = [
    { id: "INC-001", code: "INC-001", name: "Assisted Onboarding Incentive", category: "Incentive", subtype: "One-time", trigger: "Onboarding Complete", postingMode: "Immediate", validUntil: "Mar 31 2026", status: "Active", desc: "Incentive for new FOs completing onboarding", walletRouting: "Same wallet", capPerEvent: "₹5,000", capPerBeneficiary: "₹5,000", capPerProgram: "₹50L" },
    { id: "INC-002", code: "INC-002", name: "Vehicle Registration Incentive", category: "Incentive", subtype: "One-time", trigger: "Vehicle Approved", postingMode: "Immediate", validUntil: "Jun 30 2026", status: "Active", desc: "Incentive for vehicle registration", walletRouting: "Same wallet", capPerEvent: "₹3,000", capPerBeneficiary: "₹15,000", capPerProgram: "₹75L" },
    { id: "INC-003", code: "INC-003", name: "Monthly CNG Cashback", category: "Cashback", subtype: "Recurring", trigger: "Transaction Posted", postingMode: "Immediate", validUntil: "Ongoing", status: "Active", desc: "Recurring cashback on CNG transactions", walletRouting: "Separate wallets", capPerEvent: "₹2,000", capPerBeneficiary: "₹50,000", capPerProgram: "₹100L" },
    { id: "INC-004", code: "INC-004", name: "Milestone Volume Bonus", category: "Incentive", subtype: "Milestone", trigger: "MOU Threshold", postingMode: "Cool-off (7d)", validUntil: "Dec 31 2026", status: "Active", desc: "Bonus on reaching volume milestones", walletRouting: "Same wallet", capPerEvent: "₹10,000", capPerBeneficiary: "₹50,000", capPerProgram: "₹150L" },
    { id: "INC-005", code: "INC-005", name: "Retrofit Vehicle Incentive", category: "Incentive", subtype: "One-time", trigger: "Vehicle Approved", postingMode: "Immediate", validUntil: "Jun 30 2026", status: "Draft", desc: "Incentive for retrofit vehicle approval", walletRouting: "Same wallet", capPerEvent: "₹5,000", capPerBeneficiary: "₹10,000", capPerProgram: "₹40L" },
    { id: "INC-006", code: "INC-006", name: "Q1 Campaign Booster", category: "Cashback", subtype: "Promotional", trigger: "Transaction Posted", postingMode: "Immediate", validUntil: "Mar 31 2026", status: "Exhausted", desc: "Campaign booster for Q1", walletRouting: "Separate wallets", capPerEvent: "₹1,500", capPerBeneficiary: "₹30,000", capPerProgram: "₹60L" },
    { id: "INC-007", code: "INC-007", name: "New FO Welcome Bonus", category: "Incentive", subtype: "One-time", trigger: "Onboarding Complete", postingMode: "Cool-off (3d)", validUntil: "Ongoing", status: "Draft", desc: "Welcome bonus for new FOs", walletRouting: "Same wallet", capPerEvent: "₹2,500", capPerBeneficiary: "₹2,500", capPerProgram: "₹30L" },
  ]

  const rewardHistory = [
    { id: "RWD-001", beneficiary: "ABC Logistics", program: "Assisted Onboarding", category: "Incentive", type: "One-time", grossAmount: "₹5,000", netAmount: "₹5,000", postingMode: "Immediate", status: "Credited", creditDate: "Mar 20 2026", expiryDate: "Jun 20 2026" },
    { id: "RWD-002", beneficiary: "Metro Freight", program: "Monthly CNG Cashback", category: "Cashback", type: "Recurring", grossAmount: "₹2,500", netAmount: "₹2,500", postingMode: "Immediate", status: "Credited", creditDate: "Mar 22 2026", expiryDate: "Apr 22 2026" },
    { id: "RWD-003", beneficiary: "Sunrise Transport", program: "Vehicle Registration Incentive", category: "Incentive", type: "One-time", grossAmount: "₹3,000", netAmount: "₹3,000", postingMode: "Immediate", status: "Pending", creditDate: "Mar 23 2026", expiryDate: "Jun 23 2026" },
    { id: "RWD-004", beneficiary: "City Express", program: "Milestone Volume Bonus", category: "Incentive", type: "Milestone", grossAmount: "₹8,500", netAmount: "₹8,500", postingMode: "Cool-off (7d)", status: "Credited", creditDate: "Mar 18 2026", expiryDate: "Jun 18 2026" },
    { id: "RWD-005", beneficiary: "Quick Move", program: "Q1 Campaign Booster", category: "Cashback", type: "Promotional", grossAmount: "₹1,500", netAmount: "₹1,500", postingMode: "Immediate", status: "Expired", creditDate: "Mar 10 2026", expiryDate: "Mar 24 2026" },
    { id: "RWD-006", beneficiary: "ABC Logistics", program: "Monthly CNG Cashback", category: "Cashback", type: "Recurring", grossAmount: "₹2,000", netAmount: "₹2,000", postingMode: "Immediate", status: "Reversed", creditDate: "Mar 15 2026", expiryDate: "Apr 15 2026" },
  ]

  const beneficiaryData = {
    fo: "ABC Logistics", totalIncentive: "₹16,000", totalCashback: "₹4,500", earnedThisMonth: "₹10,000", expiredThisMonth: "₹1,200",
    incentiveEntries: [
      { program: "Assisted Onboarding Incentive", amount: "₹5,000", status: "Available", creditDate: "Mar 20", expiryDate: "Jun 20" },
      { program: "Vehicle Registration Incentive", amount: "₹6,000", status: "Consumed", creditDate: "Mar 10", expiryDate: "Jun 10" },
      { program: "Milestone Volume Bonus", amount: "₹5,000", status: "Available", creditDate: "Mar 23", expiryDate: "Jun 23" },
    ],
    cashbackEntries: [
      { program: "Monthly CNG Cashback", amount: "₹2,500", status: "Available", creditDate: "Mar 22", expiryDate: "Apr 22" },
      { program: "Q1 Campaign Booster", amount: "₹2,000", status: "Expired", creditDate: "Mar 10", expiryDate: "Mar 24" },
    ],
  }

  const ledgerData = [
    { id: "LED-001", beneficiary: "ABC Logistics", program: "Assisted Onboarding", gross: "₹5,000", net: "₹5,000", available: "₹5,000", consumed: "₹0", expired: "₹0", reversed: "₹0", creditDate: "Mar 20", expiryDate: "Jun 20", status: "Active" },
    { id: "LED-002", beneficiary: "Metro Freight", program: "Monthly CNG Cashback", gross: "₹2,500", net: "₹2,500", available: "₹2,500", consumed: "₹0", expired: "₹0", reversed: "₹0", creditDate: "Mar 22", expiryDate: "Apr 22", status: "Active" },
    { id: "LED-003", beneficiary: "Sunrise Transport", program: "Vehicle Registration", gross: "₹3,000", net: "₹3,000", available: "₹0", consumed: "₹3,000", expired: "₹0", reversed: "₹0", creditDate: "Mar 15", expiryDate: "Jun 15", status: "Consumed" },
  ]

  const auditLog = [
    { timestamp: "2026-03-24 14:32:15", actor: "admin@mgl.com", action: "Viewed Program", entityType: "Program", entityId: "INC-001", details: "Viewed Assisted Onboarding Incentive", ip: "192.168.1.100" },
    { timestamp: "2026-03-24 13:15:42", actor: "admin@mgl.com", action: "Inactivated Program", entityType: "Program", entityId: "INC-006", details: "Q1 Campaign Booster inactivated due to exhaustion", ip: "192.168.1.100" },
    { timestamp: "2026-03-24 11:28:09", actor: "system@mgl.com", action: "Manual Adjustment", entityType: "Ledger", entityId: "LED-001", details: "Adjusted ABC Logistics incentive balance by +��2,500", ip: "10.0.0.1" },
    { timestamp: "2026-03-24 09:45:33", actor: "system@mgl.com", action: "Reward Credited", entityType: "Reward", entityId: "RWD-008", details: "Credited ₹5,000 to Sunrise Transport", ip: "10.0.0.1" },
    { timestamp: "2026-03-24 08:12:15", actor: "scheduler@mgl.com", action: "Expiry Processed", entityType: "Ledger", entityId: "LED-002", details: "Processed expiry for Q1 Campaign entries", ip: "10.0.0.2" },
  ]

  const statusBadgeColor = (status: string) => {
    const map: Record<string, string> = {
      Active: "bg-green-100 text-green-700", Draft: "bg-gray-100 text-gray-700", Inactive: "bg-red-100 text-red-700",
      Expired: "bg-amber-100 text-amber-700", Exhausted: "bg-red-100 text-red-700", Credited: "bg-green-100 text-green-700",
      Pending: "bg-amber-100 text-amber-700", Reversed: "bg-gray-100 text-gray-700", Available: "bg-green-100 text-green-700",
      Consumed: "bg-blue-100 text-blue-700",
    }
    return `inline-block px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"}`
  }

  const categoryBadge = (category: string) => {
    return category === "Incentive" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
  }

  const filteredPrograms = programs.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "All" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredRewards = rewardHistory.filter(r => {
    const matchSearch = r.beneficiary.toLowerCase().includes(searchTerm.toLowerCase()) || r.program.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = categoryFilter === "All" || r.category === categoryFilter
    const matchStatus = statusFilter === "All" || r.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  })

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Incentive Management</h1>
          <p className="text-sm text-muted-foreground">Manage incentive and cashback programs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">4</p>
            <p className="text-xs text-muted-foreground mt-0.5">Active Programs</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">2</p>
            <p className="text-xs text-muted-foreground mt-0.5">Draft Programs</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">1</p>
            <p className="text-xs text-muted-foreground mt-0.5">Exhausted</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Gift className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-foreground">₹12.4L</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Credited</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {[
          { id: "programs", label: "Programs" },
          { id: "reward-history", label: "Reward History" },
          { id: "beneficiary-view", label: "Beneficiary View" },
          { id: "ledger-view", label: "Ledger View" },
          { id: "audit-log", label: "Audit Log" }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "programs" && (
        <>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search programs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">From Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">To Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option value="All">All</option><option value="Active">Active</option><option value="Draft">Draft</option><option value="Inactive">Inactive</option><option value="Expired">Expired</option><option value="Exhausted">Exhausted</option>
                  </select>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Category</label>
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option value="All">All</option><option value="Incentive">Incentive</option><option value="Cashback">Cashback</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-3">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear All</button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply</button>
              </div>
            </div>
          )}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Program Code</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Subtype</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Trigger</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Posting</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Valid Until</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPrograms.map(p => (
                    <tr key={p.id} className="hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.code}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryBadge(p.category)}`}>{p.category}</span></td>
                      <td className="px-4 py-3 text-muted-foreground">{p.subtype}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.trigger}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.postingMode}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.validUntil}</td>
                      <td className="px-4 py-3"><span className={statusBadgeColor(p.status)}>{p.status}</span></td>
                      <td className="px-4 py-3 text-center"><button onClick={() => setSelectedEntity(p)} className="text-primary hover:underline text-xs font-medium flex items-center justify-center gap-1"><Eye className="w-3 h-3" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "reward-history" && (
        <>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search by beneficiary or program..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">From Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">To Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option value="All">All</option><option value="Credited">Credited</option><option value="Pending">Pending</option><option value="Expired">Expired</option><option value="Reversed">Reversed</option>
                  </select>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Category</label>
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option value="All">All</option><option value="Incentive">Incentive</option><option value="Cashback">Cashback</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-3">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear All</button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply</button>
              </div>
            </div>
          )}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Reward ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Beneficiary</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Program</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Gross</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Net</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Credit Date</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRewards.map(r => (
                    <tr key={r.id} className="hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{r.beneficiary}</td>
                      <td className="px-4 py-3 text-foreground">{r.program}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryBadge(r.category)}`}>{r.category}</span></td>
                      <td className="px-4 py-3 font-bold text-foreground">{r.grossAmount}</td>
                      <td className="px-4 py-3 text-foreground">{r.netAmount}</td>
                      <td className="px-4 py-3"><span className={statusBadgeColor(r.status)}>{r.status}</span></td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{r.creditDate}</td>
                      <td className="px-4 py-3 text-center"><button onClick={() => setSelectedEntity(r)} className="text-primary hover:underline text-xs font-medium flex items-center justify-center gap-1"><Eye className="w-3 h-3" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "beneficiary-view" && (
        <>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search by FO name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">From Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">To Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div colSpan={2}><label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option>All</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-3">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear All</button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply</button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Total Incentive</p>
              <p className="text-2xl font-bold text-foreground mt-2">{beneficiaryData.totalIncentive}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Total Cashback</p>
              <p className="text-2xl font-bold text-foreground mt-2">{beneficiaryData.totalCashback}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Earned This Month</p>
              <p className="text-2xl font-bold text-foreground mt-2">{beneficiaryData.earnedThisMonth}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Expired This Month</p>
              <p className="text-2xl font-bold text-foreground mt-2">{beneficiaryData.expiredThisMonth}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-muted/30 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Incentive Entries</h3>
              <div className="space-y-3">{beneficiaryData.incentiveEntries.map((e, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="font-medium text-sm">{e.program}</p>
                      <p className="text-xs text-muted-foreground mt-1">{e.creditDate} → {e.expiryDate}</p></div>
                    <span className={statusBadgeColor(e.status)}>{e.status}</span>
                  </div>
                  <p className="font-bold text-sm mt-2">{e.amount}</p>
                </div>
              ))}</div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Cashback Entries</h3>
              <div className="space-y-3">{beneficiaryData.cashbackEntries.map((e, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="font-medium text-sm">{e.program}</p>
                      <p className="text-xs text-muted-foreground mt-1">{e.creditDate} → {e.expiryDate}</p></div>
                    <span className={statusBadgeColor(e.status)}>{e.status}</span>
                  </div>
                  <p className="font-bold text-sm mt-2">{e.amount}</p>
                </div>
              ))}</div>
            </div>
          </div>
        </>
      )}

      {activeTab === "ledger-view" && (
        <>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search ledger..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">From Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">To Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div colSpan={2}><label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Consumed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-3">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear All</button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply</button>
              </div>
            </div>
          )}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Beneficiary</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Program</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Gross</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Net</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Available</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Consumed</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Expired</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ledgerData.map(l => (
                    <tr key={l.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{l.beneficiary}</td>
                      <td className="px-4 py-3 text-foreground">{l.program}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{l.gross}</td>
                      <td className="px-4 py-3 text-foreground">{l.net}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">{l.available}</td>
                      <td className="px-4 py-3 text-blue-600 font-medium">{l.consumed}</td>
                      <td className="px-4 py-3 text-amber-600 font-medium">{l.expired}</td>
                      <td className="px-4 py-3"><span className={statusBadgeColor(l.status)}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "audit-log" && (
        <>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search audit log..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">From Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">To Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div colSpan={2}><label className="text-xs font-medium text-muted-foreground">Action</label>
                  <select className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option>All Actions</option>
                    <option>Viewed Program</option>
                    <option>Inactivated Program</option>
                    <option>Manual Adjustment</option>
                    <option>Reward Credited</option>
                    <option>Expiry Processed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-3">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear All</button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply</button>
              </div>
            </div>
          )}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Timestamp</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Actor</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Entity Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Details</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLog.map((log, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{log.timestamp}</td>
                      <td className="px-4 py-3 text-xs text-foreground font-mono">{log.actor}</td>
                      <td className="px-4 py-3 text-xs font-medium">{log.action}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{log.entityType}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{log.details}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedEntity && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedEntity(null)} />
          <div className="fixed bottom-0 right-0 top-0 z-50 w-96 bg-card border-l border-border shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">{selectedEntity.name || selectedEntity.program || selectedEntity.action} Details</h2>
              <button onClick={() => setSelectedEntity(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              {selectedEntity.code && (
                <>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Program Code</p>
                    <p className="font-mono font-bold">{selectedEntity.code}</p>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{selectedEntity.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Cap Per Event</p>
                      <p className="font-bold">{selectedEntity.capPerEvent}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Cap Per Beneficiary</p>
                      <p className="font-bold">{selectedEntity.capPerBeneficiary}</p>
                    </div>
                  </div>
                </>
              )}
              {selectedEntity.grossAmount && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Gross Amount</p>
                      <p className="font-bold text-lg">{selectedEntity.grossAmount}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Net Amount</p>
                      <p className="font-bold text-lg">{selectedEntity.netAmount}</p>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Posting Mode</p>
                    <p className="font-medium">{selectedEntity.postingMode}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
