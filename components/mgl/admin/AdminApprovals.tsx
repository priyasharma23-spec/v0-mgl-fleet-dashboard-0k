"use client"

import { useState } from "react"
import { Download, Search, X, Eye, Filter, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default function AdminApprovals({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState("process-config")
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const processConfig = [
    { id: "PC-001", module: "FO Onboarding", process: "L1 Approval", approvers: 2, avgTime: "2.5h", lastModified: "Mar 20 2026", status: "Active", desc: "Two-level approval for new FO registration" },
    { id: "PC-002", module: "Vehicle Registration", process: "L1 + L2", approvers: 3, avgTime: "4.2h", lastModified: "Mar 18 2026", status: "Active", desc: "Three-level approval with final review" },
    { id: "PC-003", module: "Card Issuance", process: "L1 Approval", approvers: 1, avgTime: "1.5h", lastModified: "Mar 15 2026", status: "Active", desc: "Single-level approval for card requests" },
    { id: "PC-004", module: "Fund Load", process: "L1 + Compliance", approvers: 2, avgTime: "3.1h", lastModified: "Mar 22 2026", status: "Active", desc: "Dual approval with compliance check" },
    { id: "PC-005", module: "Dispute Settlement", process: "L1 + L2 + Manager", approvers: 3, avgTime: "5.5h", lastModified: "Mar 10 2026", status: "Draft", desc: "Multi-level approval for dispute cases" },
  ]

  const pendingApprovals = [
    { id: "APR-001", fo: "ABC Logistics", type: "FO Onboarding", requestedBy: "Priya Singh", requestDate: "Mar 24 2026 10:30", currentApprover: "Rahul Kumar", priority: "High", status: "Pending", desc: "Onboarding request for new FO" },
    { id: "APR-002", fo: "Metro Freight", type: "Vehicle Registration", requestedBy: "Vikram Patel", requestDate: "Mar 24 2026 09:15", currentApprover: "Ananya Sharma", priority: "Normal", status: "Pending", desc: "CNG retrofit vehicle approval needed" },
    { id: "APR-003", fo: "Sunrise Transport", type: "Card Issuance", requestedBy: "Arjun Desai", requestDate: "Mar 23 2026 14:45", currentApprover: "Deepak Reddy", priority: "Low", status: "Pending", desc: "Additional card request for FO" },
    { id: "APR-004", fo: "Quick Move", type: "Fund Load", requestedBy: "Neha Gupta", requestDate: "Mar 23 2026 11:20", currentApprover: "Compliance Team", priority: "High", status: "Pending", desc: "Large fund load request - compliance review" },
  ]

  const approvalHistory = [
    { id: "HST-001", fo: "City Express", type: "FO Onboarding", approvers: "Rahul Kumar → Ananya Sharma", requestDate: "Mar 23 2026", completionDate: "Mar 23 2026 15:30", totalTime: "3h 45m", status: "Approved", outcome: "Approved with conditions" },
    { id: "HST-002", fo: "Eco Transport", type: "Vehicle Registration", approvers: "Deepak Reddy → Vikram Singh", requestDate: "Mar 22 2026", completionDate: "Mar 22 2026 16:20", totalTime: "4h 20m", status: "Approved", outcome: "Approved" },
    { id: "HST-003", fo: "Fast Movers", type: "Card Issuance", approvers: "Rahul Kumar", requestDate: "Mar 22 2026", completionDate: "Mar 22 2026 13:15", totalTime: "1h 30m", status: "Approved", outcome: "Approved" },
    { id: "HST-004", fo: "Swift Logistics", type: "Dispute Settlement", approvers: "Deepak Reddy → Ananya Sharma → Manager", requestDate: "Mar 21 2026", completionDate: "Mar 21 2026 18:45", totalTime: "6h 15m", status: "Rejected", outcome: "Rejected - insufficient docs" },
    { id: "HST-005", fo: "Peak Freight", type: "Fund Load", approvers: "Compliance Team", requestDate: "Mar 20 2026", completionDate: "Mar 20 2026 12:00", totalTime: "2h 10m", status: "Approved", outcome: "Approved" },
  ]

  const auditLog = [
    { timestamp: "2026-03-24 15:45:20", actor: "rahul.kumar@mgl.com", action: "Request Approved", entity: "APR-001 (FO Onboarding)", details: "Approved onboarding request for ABC Logistics", ip: "192.168.1.50" },
    { timestamp: "2026-03-24 14:30:15", actor: "system@mgl.com", action: "Escalation", entity: "APR-004 (Fund Load)", details: "Auto-escalated after 8 hours pending", ip: "10.0.0.1" },
    { timestamp: "2026-03-24 12:20:08", actor: "ananya.sharma@mgl.com", action: "Request Rejected", entity: "HST-004 (Dispute)", details: "Rejected Swift Logistics dispute - insufficient documentation", ip: "192.168.1.75" },
    { timestamp: "2026-03-24 11:15:33", actor: "system@mgl.com", action: "Reminder Sent", entity: "APR-002 (Vehicle Reg)", details: "Sent reminder notification to approver", ip: "10.0.0.1" },
    { timestamp: "2026-03-24 09:50:42", actor: "deepak.reddy@mgl.com", action: "Process Config Updated", entity: "PC-002", details: "Updated approval chain for vehicle registration", ip: "192.168.1.100" },
  ]

  const statusBadgeColor = (status: string) => {
    const map: Record<string, string> = {
      Active: "bg-green-100 text-green-700", Draft: "bg-gray-100 text-gray-700", Pending: "bg-amber-100 text-amber-700",
      Approved: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700", "Approved with conditions": "bg-blue-100 text-blue-700",
    }
    return `inline-block px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"}`
  }

  const priorityBadge = (priority: string) => {
    const map: Record<string, string> = { High: "bg-red-100 text-red-700", Normal: "bg-blue-100 text-blue-700", Low: "bg-green-100 text-green-700" }
    return `inline-block px-2.5 py-1 rounded-full text-xs font-medium ${map[priority] || "bg-gray-100 text-gray-700"}`
  }

  const filteredConfig = processConfig.filter(p => {
    const matchSearch = p.module.toLowerCase().includes(searchTerm.toLowerCase()) || p.process.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "All" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredPending = pendingApprovals.filter(p => {
    const matchSearch = p.fo.toLowerCase().includes(searchTerm.toLowerCase()) || p.type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSearch
  })

  const filteredHistory = approvalHistory.filter(h => {
    const matchSearch = h.fo.toLowerCase().includes(searchTerm.toLowerCase()) || h.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === "All" || h.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredAudit = auditLog.filter(a => searchTerm === "" || a.actor.toLowerCase().includes(searchTerm.toLowerCase()) || a.action.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Approval Workflows</h1>
          <p className="text-sm text-muted-foreground">Configure and monitor approval processes across all modules</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 border-b border-border">
        {[
          { id: "process-config", label: "Process Configuration" },
          { id: "pending-approvals", label: "Pending Approvals" },
          { id: "approval-history", label: "Approval History" },
          { id: "audit-log", label: "Audit Log" }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Process Configuration Tab */}
      {activeTab === "process-config" && (
        <>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search processes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">Module</label><input type="text" placeholder="Filter by module" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option value="All">All</option><option value="Active">Active</option><option value="Draft">Draft</option>
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
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">Module</th>
                <th className="px-4 py-3 text-left font-semibold">Process</th>
                <th className="px-4 py-3 text-left font-semibold">Approvers</th>
                <th className="px-4 py-3 text-left font-semibold">Avg Time</th>
                <th className="px-4 py-3 text-left font-semibold">Last Modified</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filteredConfig.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{p.module}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.process}</td>
                    <td className="px-4 py-3 text-sm">{p.approvers}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.avgTime}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.lastModified}</td>
                    <td className="px-4 py-3"><span className={statusBadgeColor(p.status)}>{p.status}</span></td>
                    <td className="px-4 py-3 text-center"><button onClick={() => setSelectedEntity(p)} className="text-primary hover:underline text-xs font-medium flex items-center justify-center gap-1"><Eye className="w-3 h-3" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pending Approvals Tab */}
      {activeTab === "pending-approvals" && (
        <>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search pending approvals..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-muted-foreground">Type</label><input type="text" placeholder="Filter by type" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <select className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                    <option>All</option><option>High</option><option>Normal</option><option>Low</option>
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
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">FO</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Requested By</th>
                <th className="px-4 py-3 text-left font-semibold">Current Approver</th>
                <th className="px-4 py-3 text-left font-semibold">Requested</th>
                <th className="px-4 py-3 text-left font-semibold">Priority</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filteredPending.map(p => (
                  <tr key={p.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{p.fo}</td>
                    <td className="px-4 py-3">{p.type}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">{p.requestedBy}</td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">{p.currentApprover}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.requestDate}</td>
                    <td className="px-4 py-3"><span className={priorityBadge(p.priority)}>{p.priority}</span></td>
                    <td className="px-4 py-3 text-center"><button onClick={() => setSelectedEntity(p)} className="text-primary hover:underline text-xs font-medium flex items-center justify-center gap-1"><Eye className="w-3 h-3" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Approval History Tab */}
      {activeTab === "approval-history" && (
        <>
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search history..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                    <option value="All">All</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Type</label><input type="text" placeholder="Filter by type" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
              </div>
              <div className="flex gap-3 justify-end mt-3">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear All</button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply</button>
              </div>
            </div>
          )}

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">FO</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Approvers</th>
                <th className="px-4 py-3 text-left font-semibold">Completion</th>
                <th className="px-4 py-3 text-left font-semibold">Time Taken</th>
                <th className="px-4 py-3 text-left font-semibold">Outcome</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filteredHistory.map(h => (
                  <tr key={h.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{h.fo}</td>
                    <td className="px-4 py-3 text-muted-foreground">{h.type}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{h.approvers}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{h.completionDate}</td>
                    <td className="px-4 py-3 text-sm font-medium">{h.totalTime}</td>
                    <td className="px-4 py-3"><span className={statusBadgeColor(h.outcome)}>{h.outcome}</span></td>
                    <td className="px-4 py-3 text-center"><button onClick={() => setSelectedEntity(h)} className="text-primary hover:underline text-xs font-medium flex items-center justify-center gap-1"><Eye className="w-3 h-3" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Audit Log Tab */}
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
                    <option>All Actions</option><option>Request Approved</option><option>Request Rejected</option><option>Escalation</option><option>Reminder Sent</option><option>Process Config Updated</option>
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
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-left font-semibold">Actor</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
                <th className="px-4 py-3 text-left font-semibold">Entity</th>
                <th className="px-4 py-3 text-left font-semibold">Details</th>
                <th className="px-4 py-3 text-left font-semibold">IP Address</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filteredAudit.map((a, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{a.timestamp}</td>
                    <td className="px-4 py-3 text-xs">{a.actor}</td>
                    <td className="px-4 py-3 text-sm font-medium">{a.action}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{a.entity}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{a.details}</td>
                    <td className="px-4 py-3 text-xs font-mono">{a.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
