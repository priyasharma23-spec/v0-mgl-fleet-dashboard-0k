"use client"

import { useState } from "react"
import { Search, Filter, X, Eye, AlertTriangle, ChevronDown } from "lucide-react"

export default function AdminIncentives({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState("programs")
  const [showDetailTray, setShowDetailTray] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")

  // Programs data
  const programs = [
    { id: "INC-001", code: "INC-001", name: "Assisted Onboarding Incentive", category: "Incentive", subtype: "One-time", trigger: "Onboarding Complete", postingMode: "Immediate", validUntil: "Mar 31 2026", status: "Active", desc: "Incentive for new FOs completing onboarding", walletRouting: "Same wallet", capPerEvent: "₹5,000", capPerBeneficiary: "₹5,000", capPerProgram: "₹50L" },
    { id: "INC-002", code: "INC-002", name: "Vehicle Registration Incentive", category: "Incentive", subtype: "One-time", trigger: "Vehicle Approved", postingMode: "Immediate", validUntil: "Jun 30 2026", status: "Active", desc: "Incentive for vehicle registration", walletRouting: "Same wallet", capPerEvent: "₹3,000", capPerBeneficiary: "₹15,000", capPerProgram: "₹75L" },
    { id: "INC-003", code: "INC-003", name: "Monthly CNG Cashback", category: "Cashback", subtype: "Recurring", trigger: "Transaction Posted", postingMode: "Immediate", validUntil: "Ongoing", status: "Active", desc: "Recurring cashback on CNG transactions", walletRouting: "Separate wallets", capPerEvent: "₹2,000", capPerBeneficiary: "₹50,000", capPerProgram: "₹100L" },
    { id: "INC-004", code: "INC-004", name: "Milestone Volume Bonus", category: "Incentive", subtype: "Milestone", trigger: "MOU Threshold", postingMode: "Cool-off (7d)", validUntil: "Dec 31 2026", status: "Active", desc: "Bonus on reaching volume milestones", walletRouting: "Same wallet", capPerEvent: "₹10,000", capPerBeneficiary: "₹50,000", capPerProgram: "₹150L" },
    { id: "INC-005", code: "INC-005", name: "Retrofit Vehicle Incentive", category: "Incentive", subtype: "One-time", trigger: "Vehicle Approved", postingMode: "Immediate", validUntil: "Jun 30 2026", status: "Draft", desc: "Incentive for retrofit vehicle approval", walletRouting: "Same wallet", capPerEvent: "₹5,000", capPerBeneficiary: "₹10,000", capPerProgram: "₹40L" },
    { id: "INC-006", code: "INC-006", name: "Q1 Campaign Booster", category: "Cashback", subtype: "Promotional", trigger: "Transaction Posted", postingMode: "Immediate", validUntil: "Mar 31 2026", status: "Exhausted", desc: "Campaign booster for Q1", walletRouting: "Separate wallets", capPerEvent: "₹1,500", capPerBeneficiary: "₹30,000", capPerProgram: "₹60L" },
    { id: "INC-007", code: "INC-007", name: "New FO Welcome Bonus", category: "Incentive", subtype: "One-time", trigger: "Onboarding Complete", postingMode: "Cool-off (3d)", validUntil: "Ongoing", status: "Draft", desc: "Welcome bonus for new FOs", walletRouting: "Same wallet", capPerEvent: "₹2,500", capPerBeneficiary: "₹2,500", capPerProgram: "₹30L" },
  ]

  // Reward history data
  const rewardHistory = [
    { id: "RWD-001", beneficiary: "ABC Logistics", program: "Assisted Onboarding", category: "Incentive", type: "One-time", grossAmount: "₹5,000", netAmount: "₹5,000", postingMode: "Immediate", status: "Credited", creditDate: "Mar 20 2026", expiryDate: "Jun 20 2026" },
    { id: "RWD-002", beneficiary: "Metro Freight", program: "Monthly CNG Cashback", category: "Cashback", type: "Recurring", grossAmount: "₹2,500", netAmount: "₹2,500", postingMode: "Immediate", status: "Credited", creditDate: "Mar 22 2026", expiryDate: "Apr 22 2026" },
    { id: "RWD-003", beneficiary: "Sunrise Transport", program: "Vehicle Registration Incentive", category: "Incentive", type: "One-time", grossAmount: "₹3,000", netAmount: "₹3,000", postingMode: "Immediate", status: "Pending", creditDate: "Mar 23 2026", expiryDate: "Jun 23 2026" },
    { id: "RWD-004", beneficiary: "City Express", program: "Milestone Volume Bonus", category: "Incentive", type: "Milestone", grossAmount: "₹8,500", netAmount: "₹8,500", postingMode: "Cool-off (7d)", status: "Credited", creditDate: "Mar 18 2026", expiryDate: "Jun 18 2026" },
    { id: "RWD-005", beneficiary: "Quick Move", program: "Q1 Campaign Booster", category: "Cashback", type: "Promotional", grossAmount: "₹1,500", netAmount: "₹1,500", postingMode: "Immediate", status: "Expired", creditDate: "Mar 10 2026", expiryDate: "Mar 24 2026" },
    { id: "RWD-006", beneficiary: "ABC Logistics", program: "Monthly CNG Cashback", category: "Cashback", type: "Recurring", grossAmount: "₹2,000", netAmount: "₹2,000", postingMode: "Immediate", status: "Reversed", creditDate: "Mar 15 2026", expiryDate: "Apr 15 2026" },
    { id: "RWD-007", beneficiary: "Metro Freight", program: "Vehicle Registration Incentive", category: "Incentive", type: "One-time", grossAmount: "₹3,000", netAmount: "₹3,000", postingMode: "Immediate", status: "Credited", creditDate: "Mar 21 2026", expiryDate: "Jun 21 2026" },
    { id: "RWD-008", beneficiary: "Sunrise Transport", program: "Assisted Onboarding", category: "Incentive", type: "One-time", grossAmount: "₹5,000", netAmount: "₹5,000", postingMode: "Immediate", status: "Pending", creditDate: "Mar 24 2026", expiryDate: "Jun 24 2026" },
  ]

  // Beneficiary data
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

  // Ledger data
  const ledgerData = [
    { id: "LED-001", beneficiary: "ABC Logistics", program: "Assisted Onboarding", gross: "₹5,000", net: "₹5,000", available: "₹5,000", consumed: "₹0", expired: "₹0", reversed: "₹0", creditDate: "Mar 20", expiryDate: "Jun 20", status: "Active" },
    { id: "LED-002", beneficiary: "Metro Freight", program: "Monthly CNG Cashback", gross: "₹2,500", net: "₹2,500", available: "₹2,500", consumed: "₹0", expired: "₹0", reversed: "₹0", creditDate: "Mar 22", expiryDate: "Apr 22", status: "Active" },
    { id: "LED-003", beneficiary: "Sunrise Transport", program: "Vehicle Registration", gross: "₹3,000", net: "₹3,000", available: "₹0", consumed: "₹3,000", expired: "₹0", reversed: "₹0", creditDate: "Mar 15", expiryDate: "Jun 15", status: "Consumed" },
  ]

  // Audit log data
  const auditLog = [
    { timestamp: "2026-03-24 14:32:15", actor: "admin@mgl.com", action: "Viewed Program", entityType: "Program", entityId: "INC-001", details: "Viewed Assisted Onboarding Incentive", ip: "192.168.1.100" },
    { timestamp: "2026-03-24 13:15:42", actor: "admin@mgl.com", action: "Inactivated Program", entityType: "Program", entityId: "INC-006", details: "Q1 Campaign Booster inactivated due to exhaustion", ip: "192.168.1.100" },
    { timestamp: "2026-03-24 11:28:09", actor: "system@mgl.com", action: "Manual Adjustment", entityType: "Ledger", entityId: "LED-001", details: "Adjusted ABC Logistics incentive balance by +₹2,500", ip: "10.0.0.1" },
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
      <div>
        <h1 className="text-xl font-bold text-foreground">Incentive Management</h1>
        <p className="text-sm text-muted-foreground">Manage programs, rewards, and ledger entries</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {["Programs", "Reward History", "Beneficiary View", "Ledger View", "Audit Log"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, "-"))} 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.toLowerCase().replace(/ /g, "-") ? "bg-card shadow-sm" : "hover:bg-card/50"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Programs Tab */}
      {activeTab === "programs" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { label: "Active Programs", value: "4", color: "bg-green-50 border-green-200", textColor: "text-green-700" },
              { label: "Draft Programs", value: "2", color: "bg-gray-50 border-gray-200", textColor: "text-gray-700" },
              { label: "Exhausted", value: "1", color: "bg-red-50 border-red-200", textColor: "text-red-700" },
              { label: "Total Credited This Month", value: "₹12.4L", color: "bg-blue-50 border-blue-200", textColor: "text-blue-700" },
            ].map(card => (
              <div key={card.label} className={`bg-card rounded-xl border border-border p-4 ${card.color}`}>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className={`text-2xl font-bold mt-2 ${card.textColor}`}>{card.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search programs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm">
                <option>All</option><option>Active</option><option>Draft</option><option>Inactive</option><option>Expired</option><option>Exhausted</option>
              </select>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">Program Code</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Subtype</th>
                <th className="px-4 py-3 text-left font-semibold">Trigger</th>
                <th className="px-4 py-3 text-left font-semibold">Posting</th>
                <th className="px-4 py-3 text-left font-semibold">Valid Until</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr></thead>
              <tbody>{filteredPrograms.map(p => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{p.code}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryBadge(p.category)}`}>{p.category}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.subtype}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.trigger}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.postingMode}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.validUntil}</td>
                  <td className="px-4 py-3"><span className={statusBadgeColor(p.status)}>{p.status}</span></td>
                  <td className="px-4 py-3 text-center"><button onClick={() => { setSelectedEntity(p); setShowDetailTray(true); }} className="text-primary hover:underline text-xs font-medium">View</button></td>
                </tr>
              ))}</tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Reward History Tab */}
      {activeTab === "reward-history" && (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search by beneficiary or program..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm">
              <option>All</option><option>Incentive</option><option>Cashback</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm">
              <option>All</option><option>Credited</option><option>Pending</option><option>Expired</option><option>Reversed</option>
            </select>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-semibold">Reward ID</th>
              <th className="px-4 py-3 text-left font-semibold">Beneficiary</th>
              <th className="px-4 py-3 text-left font-semibold">Program</th>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Gross</th>
              <th className="px-4 py-3 text-left font-semibold">Net</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Credit Date</th>
              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr></thead>
            <tbody>{filteredRewards.map(r => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.beneficiary}</td>
                <td className="px-4 py-3">{r.program}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryBadge(r.category)}`}>{r.category}</span></td>
                <td className="px-4 py-3 font-bold">{r.grossAmount}</td>
                <td className="px-4 py-3">{r.netAmount}</td>
                <td className="px-4 py-3"><span className={statusBadgeColor(r.status)}>{r.status}</span></td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{r.creditDate}</td>
                <td className="px-4 py-3 text-center"><button onClick={() => { setSelectedEntity(r); setShowDetailTray(true); }} className="text-primary hover:underline text-xs font-medium">View</button></td>
              </tr>
            ))}</tbody>
            </table>
          </div>
        </>
      )}

      {/* Beneficiary View Tab */}
      {activeTab === "beneficiary-view" && (
        <>
          <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search by FO name or ID..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { label: "Total Incentive Balance", value: beneficiaryData.totalIncentive, color: "bg-purple-50 border-purple-200" },
              { label: "Total Cashback Balance", value: beneficiaryData.totalCashback, color: "bg-blue-50 border-blue-200" },
              { label: "Earned This Month", value: beneficiaryData.earnedThisMonth, color: "bg-green-50 border-green-200" },
              { label: "Expired This Month", value: beneficiaryData.expiredThisMonth, color: "bg-amber-50 border-amber-200" },
            ].map((card, i) => (
              <div key={i} className={`bg-card rounded-xl border border-border p-4 ${card.color}`}>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold mb-4">Incentive Ledger Entries</h3>
              <div className="space-y-3">{beneficiaryData.incentiveEntries.map((e, i) => (
                <div key={i} className="border border-border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="font-medium text-sm">{e.program}</p>
                      <p className="text-xs text-muted-foreground mt-1">{e.creditDate} • Expires: {e.expiryDate}</p></div>
                    <span className={statusBadgeColor(e.status)}>{e.status}</span>
                  </div>
                  <p className="font-bold text-sm mt-2">{e.amount}</p>
                </div>
              ))}</div>
            </div>

            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold mb-4">Cashback Ledger Entries</h3>
              <div className="space-y-3">{beneficiaryData.cashbackEntries.map((e, i) => (
                <div key={i} className="border border-border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div><p className="font-medium text-sm">{e.program}</p>
                      <p className="text-xs text-muted-foreground mt-1">{e.creditDate} • Expires: {e.expiryDate}</p></div>
                    <span className={statusBadgeColor(e.status)}>{e.status}</span>
                  </div>
                  <p className="font-bold text-sm mt-2">{e.amount}</p>
                </div>
              ))}</div>
            </div>
          </div>
        </>
      )}

      {/* Ledger View Tab */}
      {activeTab === "ledger-view" && (
        <>
          <div className="flex gap-2 items-center mb-4">
            <button className="px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium">Incentive Ledger</button>
            <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cashback Ledger</button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">Wallet Routing Note: Entries may share a wallet. Debit allocation: earliest expiry first, oldest credit first.</p>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-semibold">Ledger ID</th>
              <th className="px-4 py-3 text-left font-semibold">Beneficiary</th>
              <th className="px-4 py-3 text-left font-semibold">Program</th>
              <th className="px-4 py-3 text-center font-semibold">Gross</th>
              <th className="px-4 py-3 text-center font-semibold">Net</th>
              <th className="px-4 py-3 text-center font-semibold">Available</th>
              <th className="px-4 py-3 text-center font-semibold">Consumed</th>
              <th className="px-4 py-3 text-center font-semibold">Expired</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr></thead>
            <tbody>{ledgerData.map(l => (
              <tr key={l.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{l.id}</td>
                <td className="px-4 py-3 font-medium">{l.beneficiary}</td>
                <td className="px-4 py-3">{l.program}</td>
                <td className="px-4 py-3 text-center font-bold">{l.gross}</td>
                <td className="px-4 py-3 text-center">{l.net}</td>
                <td className="px-4 py-3 text-center text-green-700 font-medium">{l.available}</td>
                <td className="px-4 py-3 text-center">{l.consumed}</td>
                <td className="px-4 py-3 text-center">{l.expired}</td>
                <td className="px-4 py-3"><span className={statusBadgeColor(l.status)}>{l.status}</span></td>
              </tr>
            ))}</tbody>
            </table>
          </div>
        </>
      )}

      {/* Audit Log Tab */}
      {activeTab === "audit-log" && (
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
            <th className="px-4 py-3 text-left font-semibold">Actor</th>
            <th className="px-4 py-3 text-left font-semibold">Action</th>
            <th className="px-4 py-3 text-left font-semibold">Entity Type</th>
            <th className="px-4 py-3 text-left font-semibold">Entity ID</th>
            <th className="px-4 py-3 text-left font-semibold">Details</th>
            <th className="px-4 py-3 text-left font-semibold">IP</th>
          </tr></thead>
          <tbody>{auditLog.map((log, i) => (
            <tr key={i} className="border-b border-border hover:bg-muted/30">
              <td className="px-4 py-3 text-xs text-muted-foreground">{log.timestamp}</td>
              <td className="px-4 py-3 text-sm">{log.actor}</td>
              <td className="px-4 py-3 text-sm font-medium">{log.action}</td>
              <td className="px-4 py-3 text-xs">{log.entityType}</td>
              <td className="px-4 py-3 font-mono text-xs">{log.entityId}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{log.details}</td>
              <td className="px-4 py-3 font-mono text-xs">{log.ip}</td>
            </tr>
          ))}</tbody>
          </table>
        </div>
      )}

      {/* Detail Tray */}
      {showDetailTray && selectedEntity && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowDetailTray(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Details</h3>
              <button onClick={() => setShowDetailTray(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              {selectedEntity.code && (
                <>
                  <div><p className="text-xs text-muted-foreground">Program ID</p><p className="font-mono text-sm font-medium">{selectedEntity.id}</p></div>
                  <div><p className="text-xs text-muted-foreground">Code</p><p className="font-mono text-sm font-medium">{selectedEntity.code}</p></div>
                  <div><p className="text-xs text-muted-foreground">Name</p><p className="text-sm font-medium">{selectedEntity.name}</p></div>
                  <div><p className="text-xs text-muted-foreground">Description</p><p className="text-sm">{selectedEntity.desc}</p></div>
                  <div><p className="text-xs text-muted-foreground">Category</p><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryBadge(selectedEntity.category)}`}>{selectedEntity.category}</span></div>
                  <div><p className="text-xs text-muted-foreground">Subtype</p><p className="text-sm">{selectedEntity.subtype}</p></div>
                  <div><p className="text-xs text-muted-foreground">Trigger</p><p className="text-sm">{selectedEntity.trigger}</p></div>
                  <div><p className="text-xs text-muted-foreground">Posting Mode</p><p className="text-sm">{selectedEntity.postingMode}</p></div>
                  <div><p className="text-xs text-muted-foreground">Wallet Routing</p><p className="text-sm">{selectedEntity.walletRouting}</p></div>
                  <div><p className="text-xs text-muted-foreground">Cap Per Event</p><p className="text-sm font-bold">{selectedEntity.capPerEvent}</p></div>
                  <div><p className="text-xs text-muted-foreground">Cap Per Beneficiary</p><p className="text-sm font-bold">{selectedEntity.capPerBeneficiary}</p></div>
                  <div><p className="text-xs text-muted-foreground">Cap Per Program</p><p className="text-sm font-bold">{selectedEntity.capPerProgram}</p></div>
                  <div><p className="text-xs text-muted-foreground">Status</p><span className={statusBadgeColor(selectedEntity.status)}>{selectedEntity.status}</span></div>
                  {selectedEntity.status === "Active" && <button className="w-full mt-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Inactivate Program</button>}
                </>
              )}
              {selectedEntity.beneficiary && (
                <>
                  <div><p className="text-xs text-muted-foreground">Reward ID</p><p className="font-mono text-sm font-medium">{selectedEntity.id}</p></div>
                  <div><p className="text-xs text-muted-foreground">Beneficiary</p><p className="text-sm font-medium">{selectedEntity.beneficiary}</p></div>
                  <div><p className="text-xs text-muted-foreground">Program</p><p className="text-sm">{selectedEntity.program}</p></div>
                  <div><p className="text-xs text-muted-foreground">Category</p><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryBadge(selectedEntity.category)}`}>{selectedEntity.category}</span></div>
                  <div><p className="text-xs text-muted-foreground">Type</p><p className="text-sm">{selectedEntity.type}</p></div>
                  <div><p className="text-xs text-muted-foreground">Gross Amount</p><p className="text-sm font-bold">{selectedEntity.grossAmount}</p></div>
                  <div><p className="text-xs text-muted-foreground">Net Amount</p><p className="text-sm font-bold">{selectedEntity.netAmount}</p></div>
                  <div><p className="text-xs text-muted-foreground">Posting Mode</p><p className="text-sm">{selectedEntity.postingMode}</p></div>
                  <div><p className="text-xs text-muted-foreground">Status</p><span className={statusBadgeColor(selectedEntity.status)}>{selectedEntity.status}</span></div>
                  <div><p className="text-xs text-muted-foreground">Credit Date</p><p className="text-sm">{selectedEntity.creditDate}</p></div>
                  <div><p className="text-xs text-muted-foreground">Expiry Date</p><p className="text-sm">{selectedEntity.expiryDate}</p></div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
