"use client"
import { useState } from "react"
import { Search, Filter, Download, Plus, CheckCircle, Clock, XCircle, AlertTriangle, Banknote, CreditCard, RefreshCw, ArrowRightLeft, X } from "lucide-react"

export default function AdminFundManagement() {
  const [activeTab, setActiveTab] = useState("fo-accounts")
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loadForm, setLoadForm] = useState({ fo: "", amount: "", source: "", reference: "", remarks: "" })

  const foAccounts = [
    { id: "FO001", name: "ABC Logistics", parentAccountId: "PA-2024-001", balance: "₹2.4L", lastLoad: "Mar 23, 2026", lastLoadAmt: "₹50,000", source: "NEFT", t1Pending: "₹15,000", status: "Active" },
    { id: "FO002", name: "Metro Freight", parentAccountId: "PA-2024-002", balance: "₹5.1L", lastLoad: "Mar 22, 2026", lastLoadAmt: "₹1,00,000", source: "PG", t1Pending: "₹28,000", status: "Active" },
    { id: "FO003", name: "Sunrise Transport", parentAccountId: "PA-2024-003", balance: "₹12,500", lastLoad: "Mar 20, 2026", lastLoadAmt: "₹25,000", source: "RTGS", t1Pending: "₹0", status: "Active" },
    { id: "FO004", name: "City Express", parentAccountId: "PA-2024-004", balance: "₹3,200", lastLoad: "Mar 18, 2026", lastLoadAmt: "₹10,000", source: "IMPS", t1Pending: "₹0", status: "Blocked" },
    { id: "FO005", name: "Quick Move", parentAccountId: "PA-2024-005", balance: "₹98,000", lastLoad: "Mar 23, 2026", lastLoadAmt: "₹75,000", source: "FT", t1Pending: "₹42,000", status: "Active" },
  ]

  const pgCollections = [
    { id: "PG001", fo: "ABC Logistics", amount: "₹50,000", pgRef: "PG2026032300012", time: "10:30 AM", creditDate: "Mar 24, 2026", status: "Pending" },
    { id: "PG002", fo: "Metro Freight", amount: "₹1,00,000", pgRef: "PG2026032300018", time: "11:45 AM", creditDate: "Mar 24, 2026", status: "Pending" },
    { id: "PG003", fo: "Quick Move", amount: "₹42,000", pgRef: "PG2026032300024", time: "12:15 PM", creditDate: "Mar 24, 2026", status: "Pending" },
    { id: "PG004", fo: "City Express", amount: "₹18,500", pgRef: "PG2026032200089", time: "09:20 AM", creditDate: "Mar 23, 2026", status: "Success" },
    { id: "PG005", fo: "Sunrise Transport", amount: "₹25,000", pgRef: "PG2026032200091", time: "02:30 PM", creditDate: "Mar 23, 2026", status: "Failed" },
  ]

  const refunds = [
    { id: "REF001", fo: "City Express", amount: "₹5,000", reason: "Duplicate payment", date: "Mar 22, 2026", status: "Pending" },
    { id: "REF002", fo: "Sunrise Transport", amount: "₹12,500", reason: "Cancelled transaction", date: "Mar 21, 2026", status: "Approved" },
    { id: "REF003", fo: "ABC Logistics", amount: "₹8,000", reason: "Overcharge", date: "Mar 20, 2026", status: "Rejected" },
  ]

  const manualLedger = [
    { id: "ML001", fo: "ABC Logistics", amount: "₹50,000", source: "NEFT", ref: "NEFT2026032300012", date: "Mar 23, 2026 10:30 AM", by: "Arun Verma", status: "Success" },
    { id: "ML002", fo: "Metro Freight", amount: "₹1,00,000", source: "RTGS", ref: "RTGS2026032200089", date: "Mar 22, 2026 02:15 PM", by: "Arun Verma", status: "Success" },
    { id: "ML003", fo: "Quick Move", amount: "₹75,000", source: "FT", ref: "FT2026032300024", date: "Mar 23, 2026 11:00 AM", by: "Priya Shah", status: "Success" },
  ]

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Active: "bg-green-100 text-green-700", "Low Balance": "bg-amber-100 text-amber-700",
      Critical: "bg-red-100 text-red-700", Suspended: "bg-gray-100 text-gray-700", Pending: "bg-amber-100 text-amber-700",
      Success: "bg-green-100 text-green-700", Failed: "bg-red-100 text-red-700",
      Approved: "bg-green-100 text-green-700", Rejected: "bg-red-100 text-red-700",
    }
    return `inline-block px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"}`
  }

  const tabs = [
    { id: "fo-accounts", label: "FO Accounts" },
    { id: "pg-collections", label: "PG Collections" },
    { id: "t1-pending", label: "T+1 Pending Credits" },
    { id: "manual-load", label: "Manual Fund Load" },
    { id: "refunds", label: "Refunds" },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Fund Management</h1>
          <p className="text-sm text-muted-foreground">Manage FO parent account funds, PG collections and manual loads</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><CreditCard className="w-4 h-4 text-blue-600" /><p className="text-xs text-blue-700 font-medium">PG Collections Today</p></div>
          <p className="text-2xl font-bold text-blue-900">₹45.8L</p>
          <p className="text-xs text-blue-600 mt-1">3 transactions pending</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-amber-600" /><p className="text-xs text-amber-700 font-medium">Pending T+1 Credits</p></div>
          <p className="text-2xl font-bold text-amber-900">₹12.4L</p>
          <p className="text-xs text-amber-600 mt-1">Credits tomorrow</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Banknote className="w-4 h-4 text-green-600" /><p className="text-xs text-green-700 font-medium">Manual Loads Today</p></div>
          <p className="text-2xl font-bold text-green-900">₹3.2L</p>
          <p className="text-xs text-green-600 mt-1">3 transactions</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><RefreshCw className="w-4 h-4 text-red-600" /><p className="text-xs text-red-700 font-medium">Pending Refunds</p></div>
          <p className="text-2xl font-bold text-red-900">₹1.1L</p>
          <p className="text-xs text-red-600 mt-1">1 awaiting approval</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* FO Accounts Tab */}
      {activeTab === "fo-accounts" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="Search FO..." className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-semibold">FO Name</th>
              <th className="px-4 py-3 text-left font-semibold">Parent A/C ID</th>
              <th className="px-4 py-3 text-left font-semibold">Parent Balance</th>
              <th className="px-4 py-3 text-left font-semibold">Last Load</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Source</th>
              <th className="px-4 py-3 text-left font-semibold">T+1 Pending</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr></thead>
            <tbody>{foAccounts.map(fo => (
              <tr key={fo.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{fo.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{fo.parentAccountId}</td>
                <td className="px-4 py-3 font-bold">{fo.balance}</td>
                <td className="px-4 py-3 text-muted-foreground">{fo.lastLoad}</td>
                <td className="px-4 py-3">{fo.lastLoadAmt}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{fo.source}</span></td>
                <td className="px-4 py-3 text-amber-600 font-medium">{fo.t1Pending}</td>
                <td className="px-4 py-3"><span className={statusBadge(fo.status)}>{fo.status}</span></td>
                <td className="px-4 py-3"><button onClick={() => { setLoadForm(f => ({...f, fo: fo.name})); setShowForm(true) }} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium"><Plus className="w-3 h-3" /> Load</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* PG Collections Tab */}
      {activeTab === "pg-collections" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-semibold">PG Ref</th>
              <th className="px-4 py-3 text-left font-semibold">FO Name</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Collection Time</th>
              <th className="px-4 py-3 text-left font-semibold">Credit Date</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr></thead>
            <tbody>{pgCollections.map(pg => (
              <tr key={pg.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{pg.pgRef}</td>
                <td className="px-4 py-3 font-medium">{pg.fo}</td>
                <td className="px-4 py-3 font-bold">{pg.amount}</td>
                <td className="px-4 py-3 text-muted-foreground">{pg.time}</td>
                <td className="px-4 py-3">{pg.creditDate}</td>
                <td className="px-4 py-3"><span className={statusBadge(pg.status)}>{pg.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* T+1 Pending Tab */}
      {activeTab === "t1-pending" && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-medium">₹12.4L pending — will be credited to FO parent wallets on Mar 24, 2026 by 10:00 AM</p>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">FO Name</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">PG Reference</th>
                <th className="px-4 py-3 text-left font-semibold">Collection Time</th>
                <th className="px-4 py-3 text-left font-semibold">Credit Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr></thead>
              <tbody>{pgCollections.filter(p => p.status === "Pending").map(pg => (
                <tr key={pg.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{pg.fo}</td>
                  <td className="px-4 py-3 font-bold text-amber-700">{pg.amount}</td>
                  <td className="px-4 py-3 font-mono text-xs">{pg.pgRef}</td>
                  <td className="px-4 py-3 text-muted-foreground">{pg.time}</td>
                  <td className="px-4 py-3">{pg.creditDate}</td>
                  <td className="px-4 py-3"><span className={statusBadge("Pending")}>Pending Credit</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Fund Load Tab */}
      {activeTab === "manual-load" && (
        <>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Manual Load Ledger</h3>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                <Plus className="w-4 h-4" /> Load Funds
              </button>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">FO</th>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Source</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">By</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr></thead>
              <tbody>{manualLedger.map(ml => (
                <tr key={ml.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{ml.fo}</td>
                  <td className="px-4 py-3 font-bold text-green-700">{ml.amount}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{ml.source}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{ml.date}</td>
                  <td className="px-4 py-3 text-xs">{ml.by}</td>
                  <td className="px-4 py-3"><span className={statusBadge(ml.status)}>{ml.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}

      {/* Refunds Tab */}
      {activeTab === "refunds" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-semibold">Ref ID</th>
              <th className="px-4 py-3 text-left font-semibold">FO Name</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Reason</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr></thead>
            <tbody>{refunds.map(r => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.fo}</td>
                <td className="px-4 py-3 font-bold">{r.amount}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.reason}</td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3"><span className={statusBadge(r.status)}>{r.status}</span></td>
                <td className="px-4 py-3">
                  {r.status === "Pending" && <div className="flex gap-2">
                    <button className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">Approve</button>
                    <button className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium">Reject</button>
                  </div>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* Right Tray Overlay - Global */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowForm(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-full w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Load Funds to FO Parent Account</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-sm font-medium">Fleet Operator <span className="text-red-500">*</span></label>
                <select value={loadForm.fo} onChange={e => setLoadForm(f => ({...f, fo: e.target.value}))} className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-card">
                  <option value="">Select FO</option>
                  {foAccounts.map(fo => <option key={fo.id} value={fo.name}>{fo.name}</option>)}
                </select></div>
              <div><label className="text-sm font-medium">Amount (₹) <span className="text-red-500">*</span></label>
                <input type="number" value={loadForm.amount} onChange={e => setLoadForm(f => ({...f, amount: e.target.value}))} placeholder="Enter amount" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-card" /></div>
              <div><label className="text-sm font-medium">Source <span className="text-red-500">*</span></label>
                <select value={loadForm.source} onChange={e => setLoadForm(f => ({...f, source: e.target.value}))} className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-card">
                  <option value="">Select source</option>
                  <option value="Third-party PG">Third-party PG</option>
                  <option value="IMPS">FO Bank Account — IMPS</option>
                  <option value="NEFT">FO Bank Account — NEFT</option>
                  <option value="RTGS">FO Bank Account — RTGS</option>
                  <option value="FT">Fund Transfer (FT)</option>
                </select></div>
              <div><label className="text-sm font-medium">Reference Number (UTR/Txn ID) <span className="text-red-500">*</span></label>
                <input value={loadForm.reference} onChange={e => setLoadForm(f => ({...f, reference: e.target.value}))} placeholder="Enter UTR or transaction ID" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-card" /></div>
              <div><label className="text-sm font-medium">Remarks</label>
                <input value={loadForm.remarks} onChange={e => setLoadForm(f => ({...f, remarks: e.target.value}))} placeholder="Optional remarks" className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-card" /></div>
              <button onClick={() => setShowConfirmModal(true)} disabled={!loadForm.fo || !loadForm.amount || !loadForm.source || !loadForm.reference}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
                Load Funds
              </button>
            </div>
          </div>
        </>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md p-6 shadow-xl">
            <h3 className="font-bold text-lg mb-4">Confirm Fund Load</h3>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-muted-foreground">Fleet Operator</span><span className="font-bold">{loadForm.fo}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-green-700">₹{Number(loadForm.amount).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="font-medium">{loadForm.source}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-mono text-xs">{loadForm.reference}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={() => { setShowConfirmModal(false); setLoadForm({ fo: "", amount: "", source: "", reference: "", remarks: "" }) }} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
