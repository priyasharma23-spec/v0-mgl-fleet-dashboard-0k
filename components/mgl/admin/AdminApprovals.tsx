"use client"

import { useState } from "react"
import { Download, Search, X, Eye, Filter, CheckCircle, Clock, AlertCircle, Plus, Trash2 } from "lucide-react"

export default function AdminApprovals({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState("process-config")
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ processName: "", module: "", description: "", status: "Draft", stages: [{ id: 1, name: "", order: 1, type: "Serial", levels: [{ id: 1, role: "", required: 1 }] }] })
  const [rules, setRules] = useState<any[]>([])

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
          <div className="flex gap-3 items-center justify-between">
            <div className="flex gap-3 items-center flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" placeholder="Search processes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
            <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
              <Plus className="w-4 h-4" /> New Workflow
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

      {/* Create Workflow Tray */}
      {showCreateForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => { setShowCreateForm(false); setStep(1); setFormData({ processName: "", module: "", description: "", status: "Draft", stages: [{ id: 1, name: "", order: 1, type: "Serial", levels: [{ id: 1, role: "", required: 1 }] }] }); setRules([]); }} />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Create Approval Workflow</h3>
              <button onClick={() => { setShowCreateForm(false); setStep(1); }} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Step Indicator */}
              <div className="flex items-center justify-between">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${s < step ? 'bg-green-100 text-green-700' : s === step ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-700'}`}>{s}</div>
                    {s < 3 && <div className={`h-1 w-8 ${s < step ? 'bg-green-100' : 'bg-gray-100'}`}></div>}
                  </div>
                ))}
              </div>

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div><label className="text-sm font-medium">Process Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.processName} onChange={e => setFormData({...formData, processName: e.target.value})} placeholder="e.g. L1 Approval for FO Onboarding" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-background" />
                  </div>
                  <div><label className="text-sm font-medium">Module <span className="text-red-500">*</span></label>
                    <select value={formData.module} onChange={e => setFormData({...formData, module: e.target.value})} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-background">
                      <option value="">Select Module</option>
                      <option value="Vehicle Registration">Vehicle Registration</option>
                      <option value="FO Registration">FO Registration</option>
                      <option value="Card Allocation">Card Allocation</option>
                      <option value="Issuance">Issuance</option>
                      <option value="Incentive Calculation">Incentive Calculation</option>
                      <option value="Credit Approval">Credit Approval</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div><label className="text-sm font-medium">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the purpose and flow" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-background h-20" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Status</label>
                    <div className="flex gap-2">
                      {['Draft', 'Active'].map(s => (
                        <button key={s} onClick={() => setFormData({...formData, status: s})} className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.status === s ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Stages & Levels */}
              {step === 2 && (
                <div className="space-y-4">
                  {formData.stages.map((stage, idx) => (
                    <div key={stage.id} className="bg-muted/30 rounded-xl p-4 border border-border space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                        <input type="text" value={stage.name} onChange={e => { const updated = [...formData.stages]; updated[idx].name = e.target.value; setFormData({...formData, stages: updated}); }} placeholder="e.g. L1 Approval" className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm bg-background" />
                        <button onClick={() => { const updated = formData.stages.filter((_, i) => i !== idx); setFormData({...formData, stages: updated}); }} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="flex gap-2">
                        {['Serial', 'Parallel'].map(t => (
                          <button key={t} onClick={() => { const updated = [...formData.stages]; updated[idx].type = t; setFormData({...formData, stages: updated}); }} className={`px-3 py-1 rounded-lg text-xs font-medium ${stage.type === t ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{t}</button>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {stage.levels.map((level, lvlIdx) => (
                          <div key={level.id} className="flex gap-3 items-center p-3 bg-background rounded-lg border border-border">
                            <span className="text-xs font-medium text-muted-foreground w-6">L{lvlIdx + 1}</span>
                            <select value={level.role} onChange={e => { const updated = [...formData.stages]; updated[idx].levels[lvlIdx].role = e.target.value; setFormData({...formData, stages: updated}); }} className="flex-1 px-2 py-1.5 border border-border rounded-lg text-xs bg-card">
                              <option value="">Select Role</option>
                              <option value="Ops Executive">Ops Executive</option>
                              <option value="Territory Manager">Territory Manager</option>
                              <option value="Finance Exec">Finance Exec</option>
                              <option value="Finance Manager">Finance Manager</option>
                              <option value="Ops Supervisor">Ops Supervisor</option>
                              <option value="Ops Lead">Ops Lead</option>
                              <option value="Compliance">Compliance</option>
                              <option value="Zonal Head">Zonal Head</option>
                              <option value="Head of Business">Head of Business</option>
                              <option value="Sr. Finance">Sr. Finance</option>
                              <option value="Credit Analyst">Credit Analyst</option>
                            </select>
                            <input type="number" min="1" value={level.required} onChange={e => { const updated = [...formData.stages]; updated[idx].levels[lvlIdx].required = parseInt(e.target.value); setFormData({...formData, stages: updated}); }} className="w-16 px-2 py-1.5 border border-border rounded-lg text-xs bg-card" placeholder="Req" />
                            <button onClick={() => { const updated = [...formData.stages]; updated[idx].levels.splice(lvlIdx, 1); setFormData({...formData, stages: updated}); }} className="p-1.5 hover:bg-red-100 rounded text-red-600"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                        <button onClick={() => { const updated = [...formData.stages]; const newLevel = { id: Date.now(), role: "", required: 1 }; updated[idx].levels.push(newLevel); setFormData({...formData, stages: updated}); }} className="text-xs text-primary font-medium hover:underline">+ Add Level</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { const newStage = { id: Date.now(), name: "", type: "Serial", levels: [{ id: Date.now(), role: "", required: 1 }] }; setFormData({...formData, stages: [...formData.stages, newStage]}); }} className="text-sm text-primary font-medium hover:underline">+ Add Stage</button>
                </div>
              )}

              {/* Step 3: Rules */}
              {step === 3 && (
                <div className="space-y-4">
                  {formData.stages.map((stage, stageIdx) => (
                    <div key={stage.id} className="border border-border rounded-lg p-3 bg-muted/20">
                      <p className="text-xs font-semibold mb-3">{stage.name || `Stage ${stageIdx + 1}`}</p>
                      {rules.filter(r => r.stageId === stage.id).map((rule, ruleIdx) => (
                        <div key={rule.id} className={`mb-3 rounded-lg p-3 border ${rule.type === 'ESCALATE' ? 'bg-amber-50 border-amber-200' : rule.type === 'AUTO_APPROVE' ? 'bg-green-50 border-green-200' : rule.type === 'SKIP_LEVEL' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex gap-2 items-end mb-2">
                            <select value={rule.type} onChange={e => { const updated = [...rules]; updated[ruleIdx].type = e.target.value; setRules(updated); }} className="flex-1 px-2 py-1 border border-border rounded text-xs bg-card">
                              <option value="AUTO_APPROVE">AUTO_APPROVE</option>
                              <option value="ESCALATE">ESCALATE</option>
                              <option value="SKIP_LEVEL">SKIP_LEVEL</option>
                              <option value="NOTIFY">NOTIFY</option>
                              <option value="MANDATORY_COMMENT">MANDATORY_COMMENT</option>
                            </select>
                            <button onClick={() => setRules(rules.filter((_, i) => i !== ruleIdx))} className="p-1.5 hover:bg-red-100 rounded text-red-600"><X className="w-3 h-3" /></button>
                          </div>
                          <div className="space-y-2">
                            <input type="text" value={rule.condition} onChange={e => { const updated = [...rules]; updated[ruleIdx].condition = e.target.value; setRules(updated); }} placeholder="Condition key (e.g. vehicleValue)" className="w-full px-2 py-1 border border-border rounded text-xs bg-card" />
                            <div className="flex gap-2">
                              <select value={rule.operator} onChange={e => { const updated = [...rules]; updated[ruleIdx].operator = e.target.value; setRules(updated); }} className="w-24 px-2 py-1 border border-border rounded text-xs bg-card">
                                <option value="eq">eq</option><option value="ne">ne</option><option value="gt">gt</option><option value="lt">lt</option><option value="gte">gte</option><option value="lte">lte</option><option value="in">in</option><option value="notIn">notIn</option>
                              </select>
                              <input type="text" value={rule.value} onChange={e => { const updated = [...rules]; updated[ruleIdx].value = e.target.value; setRules(updated); }} placeholder="Value" className="flex-1 px-2 py-1 border border-border rounded text-xs bg-card" />
                            </div>
                            {rule.type === 'ESCALATE' && <select className="w-full px-2 py-1 border border-border rounded text-xs bg-card"><option>Select role to escalate</option></select>}
                            {rule.type === 'SKIP_LEVEL' && <input type="number" min="1" placeholder="Skip level" className="w-full px-2 py-1 border border-border rounded text-xs bg-card" />}
                            {rule.type === 'MANDATORY_COMMENT' && <label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked /> Require comment</label>}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => setRules([...rules, { id: Date.now(), stageId: stage.id, type: 'AUTO_APPROVE', condition: '', operator: 'eq', value: '', action: {} }])} className="text-xs text-primary font-medium hover:underline">+ Add Rule</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-border">
                {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">Back</button>}
                {step < 3 && <button onClick={() => setStep(step + 1)} disabled={step === 1 && (!formData.processName || !formData.module)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">Next</button>}
                {step === 3 && <button onClick={() => { setShowCreateForm(false); setStep(1); alert("Workflow created successfully!"); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Create Workflow</button>}
              </div>
            </div>
          </div>
        </>
      )}
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

export function ApprovalProcessList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<any>(null)

  const processConfig = [
    { id: "PC-001", module: "FO Onboarding", process: "L1 Approval", approvers: 2, avgTime: "2.5h", lastModified: "Mar 20 2026", status: "Active", desc: "Two-level approval for new FO registration" },
    { id: "PC-002", module: "Vehicle Registration", process: "L1 + L2", approvers: 3, avgTime: "4.2h", lastModified: "Mar 18 2026", status: "Active", desc: "Three-level approval with final review" },
    { id: "PC-003", module: "Card Issuance", process: "L1 Approval", approvers: 1, avgTime: "1.5h", lastModified: "Mar 15 2026", status: "Active", desc: "Single-level approval for card requests" },
    { id: "PC-004", module: "Fund Load", process: "L1 + Compliance", approvers: 2, avgTime: "3.1h", lastModified: "Mar 22 2026", status: "Active", desc: "Dual approval with compliance check" },
    { id: "PC-005", module: "Dispute Settlement", process: "L1 + L2 + Manager", approvers: 3, avgTime: "5.5h", lastModified: "Mar 10 2026", status: "Draft", desc: "Multi-level approval for dispute cases" },
  ]

  const statusBadgeColor = (status: string) => {
    const map: Record<string, string> = {
      Active: "bg-green-100 text-green-700", Draft: "bg-gray-100 text-gray-700", Pending: "bg-amber-100 text-amber-700",
      Approved: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700", Credited: "bg-blue-100 text-blue-700",
      "Approved with conditions": "bg-yellow-100 text-yellow-700",
    }
    return map[status] || "bg-gray-100 text-gray-700"
  }

  const filteredConfig = processConfig.filter(p => (searchTerm === "" || p.module.toLowerCase().includes(searchTerm.toLowerCase()) || p.process.toLowerCase().includes(searchTerm.toLowerCase())) && (statusFilter === "All" || p.status === statusFilter))

  return (
    <div className="space-y-3">
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
    </div>
  )
}

export function CreateWorkflowTray({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ processName: "", module: "", description: "", status: "Draft", stages: [{ id: 1, name: "", type: "Serial", levels: [{ id: 1, role: "", required: 1 }] }] })
  const [rules, setRules] = useState<any[]>([])

  const handleClose = () => {
    onClose()
    setStep(1)
    setFormData({ processName: "", module: "", description: "", status: "Draft", stages: [{ id: 1, name: "", type: "Serial", levels: [{ id: 1, role: "", required: 1 }] }] })
    setRules([])
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={handleClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Create Approval Workflow</h3>
          <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${s < step ? 'bg-green-100 text-green-700' : s === step ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-700'}`}>{s}</div>
                {s < 3 && <div className={`h-1 w-8 ${s < step ? 'bg-green-100' : 'bg-gray-100'}`}></div>}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Process Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.processName} onChange={e => setFormData({...formData, processName: e.target.value})} placeholder="e.g. L1 Approval for FO Onboarding" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-background" />
              </div>
              <div><label className="text-sm font-medium">Module <span className="text-red-500">*</span></label>
                <select value={formData.module} onChange={e => setFormData({...formData, module: e.target.value})} className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-background">
                  <option value="">Select Module</option>
                  <option value="Vehicle Registration">Vehicle Registration</option>
                  <option value="FO Registration">FO Registration</option>
                  <option value="Card Allocation">Card Allocation</option>
                  <option value="Issuance">Issuance</option>
                  <option value="Incentive Calculation">Incentive Calculation</option>
                  <option value="Credit Approval">Credit Approval</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div><label className="text-sm font-medium">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the purpose and flow" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-background h-20" />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">Status</label>
                <div className="flex gap-2">
                  {['Draft', 'Active'].map(s => (
                    <button key={s} onClick={() => setFormData({...formData, status: s})} className={`px-3 py-1 rounded-lg text-xs font-medium ${formData.status === s ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Stages & Levels */}
          {step === 2 && (
            <div className="space-y-4">
              {formData.stages.map((stage, idx) => (
                <div key={stage.id} className="bg-muted/30 rounded-xl p-4 border border-border space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                    <input type="text" value={stage.name} onChange={e => { const updated = [...formData.stages]; updated[idx].name = e.target.value; setFormData({...formData, stages: updated}); }} placeholder="e.g. L1 Approval" className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm bg-background" />
                    <button onClick={() => { const updated = formData.stages.filter((_, i) => i !== idx); setFormData({...formData, stages: updated}); }} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex gap-2">
                    {['Serial', 'Parallel'].map(t => (
                      <button key={t} onClick={() => { const updated = [...formData.stages]; updated[idx].type = t; setFormData({...formData, stages: updated}); }} className={`px-3 py-1 rounded-lg text-xs font-medium ${stage.type === t ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{t}</button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {stage.levels.map((level, lvlIdx) => (
                      <div key={level.id} className="flex gap-3 items-center p-3 bg-background rounded-lg border border-border">
                        <span className="text-xs font-medium text-muted-foreground w-6">L{lvlIdx + 1}</span>
                        <select value={level.role} onChange={e => { const updated = [...formData.stages]; updated[idx].levels[lvlIdx].role = e.target.value; setFormData({...formData, stages: updated}); }} className="flex-1 px-2 py-1.5 border border-border rounded-lg text-xs bg-card">
                          <option value="">Select Role</option>
                          <option value="Ops Executive">Ops Executive</option>
                          <option value="Territory Manager">Territory Manager</option>
                          <option value="Finance Exec">Finance Exec</option>
                          <option value="Finance Manager">Finance Manager</option>
                          <option value="Ops Supervisor">Ops Supervisor</option>
                          <option value="Ops Lead">Ops Lead</option>
                          <option value="Compliance">Compliance</option>
                          <option value="Zonal Head">Zonal Head</option>
                          <option value="Head of Business">Head of Business</option>
                          <option value="Sr. Finance">Sr. Finance</option>
                          <option value="Credit Analyst">Credit Analyst</option>
                        </select>
                        <input type="number" min="1" value={level.required} onChange={e => { const updated = [...formData.stages]; updated[idx].levels[lvlIdx].required = parseInt(e.target.value); setFormData({...formData, stages: updated}); }} className="w-16 px-2 py-1.5 border border-border rounded-lg text-xs bg-card" placeholder="Req" />
                        <button onClick={() => { const updated = [...formData.stages]; updated[idx].levels.splice(lvlIdx, 1); setFormData({...formData, stages: updated}); }} className="p-1.5 hover:bg-red-100 rounded text-red-600"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <button onClick={() => { const updated = [...formData.stages]; const newLevel = { id: Date.now(), role: "", required: 1 }; updated[idx].levels.push(newLevel); setFormData({...formData, stages: updated}); }} className="text-xs text-primary font-medium hover:underline">+ Add Level</button>
                  </div>
                </div>
              ))}
              <button onClick={() => { const newStage = { id: Date.now(), name: "", type: "Serial", levels: [{ id: Date.now(), role: "", required: 1 }] }; setFormData({...formData, stages: [...formData.stages, newStage]}); }} className="text-sm text-primary font-medium hover:underline">+ Add Stage</button>
            </div>
          )}

          {/* Step 3: Rules */}
          {step === 3 && (
            <div className="space-y-4">
              {formData.stages.map((stage, stageIdx) => (
                <div key={stage.id} className="border border-border rounded-lg p-3 bg-muted/20">
                  <p className="text-xs font-semibold mb-3">{stage.name || `Stage ${stageIdx + 1}`}</p>
                  {rules.filter(r => r.stageId === stage.id).map((rule, ruleIdx) => (
                    <div key={rule.id} className={`mb-3 rounded-lg p-3 border ${rule.type === 'ESCALATE' ? 'bg-amber-50 border-amber-200' : rule.type === 'AUTO_APPROVE' ? 'bg-green-50 border-green-200' : rule.type === 'SKIP_LEVEL' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex gap-2 items-end mb-2">
                        <select value={rule.type} onChange={e => { const updated = [...rules]; updated[ruleIdx].type = e.target.value; setRules(updated); }} className="flex-1 px-2 py-1 border border-border rounded text-xs bg-card">
                          <option value="AUTO_APPROVE">AUTO_APPROVE</option>
                          <option value="ESCALATE">ESCALATE</option>
                          <option value="SKIP_LEVEL">SKIP_LEVEL</option>
                          <option value="NOTIFY">NOTIFY</option>
                          <option value="MANDATORY_COMMENT">MANDATORY_COMMENT</option>
                        </select>
                        <button onClick={() => setRules(rules.filter((_, i) => i !== ruleIdx))} className="p-1.5 hover:bg-red-100 rounded text-red-600"><X className="w-3 h-3" /></button>
                      </div>
                      <div className="space-y-2">
                        <input type="text" value={rule.condition} onChange={e => { const updated = [...rules]; updated[ruleIdx].condition = e.target.value; setRules(updated); }} placeholder="Condition key (e.g. vehicleValue)" className="w-full px-2 py-1 border border-border rounded text-xs bg-card" />
                        <div className="flex gap-2">
                          <select value={rule.operator} onChange={e => { const updated = [...rules]; updated[ruleIdx].operator = e.target.value; setRules(updated); }} className="w-24 px-2 py-1 border border-border rounded text-xs bg-card">
                            <option value="eq">eq</option><option value="ne">ne</option><option value="gt">gt</option><option value="lt">lt</option><option value="gte">gte</option><option value="lte">lte</option><option value="in">in</option><option value="notIn">notIn</option>
                          </select>
                          <input type="text" value={rule.value} onChange={e => { const updated = [...rules]; updated[ruleIdx].value = e.target.value; setRules(updated); }} placeholder="Value" className="flex-1 px-2 py-1 border border-border rounded text-xs bg-card" />
                        </div>
                        {rule.type === 'ESCALATE' && <select className="w-full px-2 py-1 border border-border rounded text-xs bg-card"><option>Select role to escalate</option></select>}
                        {rule.type === 'SKIP_LEVEL' && <input type="number" min="1" placeholder="Skip level" className="w-full px-2 py-1 border border-border rounded text-xs bg-card" />}
                        {rule.type === 'MANDATORY_COMMENT' && <label className="flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked /> Require comment</label>}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setRules([...rules, { id: Date.now(), stageId: stage.id, type: 'AUTO_APPROVE', condition: '', operator: 'eq', value: '', action: {} }])} className="text-xs text-primary font-medium hover:underline">+ Add Rule</button>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-border">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">Back</button>}
            {step < 3 && <button onClick={() => setStep(step + 1)} disabled={step === 1 && (!formData.processName || !formData.module)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">Next</button>}
            {step === 3 && <button onClick={handleClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Create Workflow</button>}
          </div>
        </div>
      </div>
    </>
  )
}
