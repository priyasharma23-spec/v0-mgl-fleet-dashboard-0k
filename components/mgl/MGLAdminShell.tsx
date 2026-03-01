"use client"

import { useState } from "react"
import MGLHeader from "@/components/mgl/MGLHeader"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import { 
  TrendingUp, TrendingDown, Users, CreditCard, Wallet, Gift, Clock, CheckCircle, 
  AlertTriangle, ArrowRight, Search, Filter, Download, ChevronRight, Eye,
  Calendar, BarChart3, PieChart, Activity, Building2, ArrowRightLeft,
  Play, Pause, Edit3, FileText, Settings, RefreshCw, AlertCircle, X, Check
} from "lucide-react"

interface Props {
  user: { name: string; role: "mgl-admin" }
  onLogout: () => void
}

export default function MGLAdminShell({ user, onLogout }: Props) {
  const [activeView, setActiveView] = useState("admin-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function renderView() {
    switch (activeView) {
      case "admin-dashboard": return <AdminDashboard onViewChange={setActiveView} />
      case "admin-fo-directory": return <AdminFODirectory onViewChange={setActiveView} />
      case "admin-cards": return <AdminCardsWallets onViewChange={setActiveView} />
      case "admin-incentives": return <AdminIncentives onViewChange={setActiveView} />
      case "admin-transactions": return <AdminTransactions onViewChange={setActiveView} />
      case "admin-reports": return <AdminReports />
      case "admin-analytics": return <AdminAnalytics />
      case "admin-config": return <AdminConfig />
      default: return <AdminDashboard onViewChange={setActiveView} />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <MGLSidebar
        role="mgl-admin"
        activeView={activeView}
        onViewChange={setActiveView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MGLHeader
          role="mgl-admin"
          userName={user.name}
          onLogout={onLogout}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  )
}

// ============ ADMIN DASHBOARD ============
function AdminDashboard({ onViewChange }: { onViewChange: (v: string) => void }) {
  const kpis = [
    { label: "Active Fleet Operators", value: "127", change: "+8", trend: "up", icon: Users, color: "blue" },
    { label: "Total Active Cards", value: "2,847", change: "+156", trend: "up", icon: CreditCard, color: "green" },
    { label: "Parent Wallet Balance", value: "₹4.2Cr", change: "+12%", trend: "up", icon: Wallet, color: "purple" },
    { label: "Incentive Pool Used", value: "₹18.5L", change: "42%", trend: "neutral", icon: Gift, color: "amber" },
  ]

  const recentActivity = [
    { type: "settlement", desc: "T+1 Settlement completed for 156 transactions", time: "2 mins ago", status: "success" },
    { type: "offer", desc: "Winter Bonus offer launched - 5% cashback", time: "1 hr ago", status: "info" },
    { type: "alert", desc: "Low incentive fund alert - ₹2L remaining", time: "3 hrs ago", status: "warning" },
    { type: "settlement", desc: "Settlement batch #4521 processed - ₹12.4L", time: "5 hrs ago", status: "success" },
    { type: "escalation", desc: "FO ABC Logistics - KYC document expiring", time: "1 day ago", status: "warning" },
  ]

  const settlementStatus = {
    pending: 23,
    processing: 8,
    completed: 156,
    failed: 2,
    totalAmount: "₹45.8L"
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">System overview and operations monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last updated: 2 mins ago</span>
          <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                kpi.color === "blue" ? "bg-blue-100" :
                kpi.color === "green" ? "bg-green-100" :
                kpi.color === "purple" ? "bg-purple-100" : "bg-amber-100"
              }`}>
                <kpi.icon className={`w-5 h-5 ${
                  kpi.color === "blue" ? "text-blue-600" :
                  kpi.color === "green" ? "text-green-600" :
                  kpi.color === "purple" ? "text-purple-600" : "text-amber-600"
                }`} />
              </div>
              {kpi.trend !== "neutral" && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </div>
              )}
              {kpi.trend === "neutral" && (
                <span className="text-xs font-medium text-amber-600">{kpi.change} used</span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Settlement Status & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Settlement Overview */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Settlement Status</h2>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-foreground">{settlementStatus.totalAmount}</p>
            <p className="text-xs text-muted-foreground">Total Settlement Value</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <span className="text-sm font-medium">{settlementStatus.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Processing</span>
              </div>
              <span className="text-sm font-medium">{settlementStatus.processing}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <span className="text-sm font-medium">{settlementStatus.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Failed</span>
              </div>
              <span className="text-sm font-medium">{settlementStatus.failed}</span>
            </div>
          </div>

          <button 
            onClick={() => onViewChange("admin-transactions")}
            className="w-full mt-4 py-2 text-sm text-primary font-medium border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
          >
            View All Transactions <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Activity</h2>
            <button className="text-xs text-primary font-medium hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  item.status === "success" ? "bg-green-100" :
                  item.status === "warning" ? "bg-amber-100" : "bg-blue-100"
                }`}>
                  {item.status === "success" ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                   item.status === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-600" /> :
                   <Activity className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.desc}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800">System Alerts</h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-700">
              <li>• Incentive fund balance below threshold (₹2L remaining) - <button className="underline font-medium">Top up now</button></li>
              <li>• 3 settlements delayed beyond T+1 SLA - <button className="underline font-medium">Review</button></li>
              <li>• 5 FO KYC documents expiring this week - <button className="underline font-medium">View list</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ FLEET OPERATOR DIRECTORY ============
function AdminFODirectory({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFO, setSelectedFO] = useState<string | null>(null)

  const fleetOperators = [
    { id: "FO001", name: "ABC Logistics Pvt. Ltd.", region: "Mumbai", status: "Active", vehicles: 15, cards: 12, parentWallet: "₹2.4L", kycStatus: "Verified", joinedDate: "Jan 2025" },
    { id: "FO002", name: "Metro Freight Solutions", region: "Pune", status: "Active", vehicles: 20, cards: 18, parentWallet: "₹5.1L", kycStatus: "Verified", joinedDate: "Mar 2025" },
    { id: "FO003", name: "Sunrise Transport Co.", region: "Thane", status: "Active", vehicles: 8, cards: 8, parentWallet: "₹1.2L", kycStatus: "Expiring", joinedDate: "Dec 2024" },
    { id: "FO004", name: "Quick Move Logistics", region: "Navi Mumbai", status: "Suspended", vehicles: 5, cards: 3, parentWallet: "₹0", kycStatus: "Expired", joinedDate: "Nov 2024" },
    { id: "FO005", name: "City Express Carriers", region: "Mumbai", status: "Active", vehicles: 25, cards: 22, parentWallet: "₹8.3L", kycStatus: "Verified", joinedDate: "Feb 2025" },
  ]

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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

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

function FODetailDrawer({ foId, onClose, fleetOperators }: { foId: string; onClose: () => void; fleetOperators: any[] }) {
  const fo = fleetOperators.find(f => f.id === foId)
  if (!fo) return null

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
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* FO Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-lg">{fo.name}</p>
                <p className="text-sm text-muted-foreground">{fo.id} • {fo.region}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                fo.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>{fo.status}</span>
            </div>

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
          </div>

          {/* Cards List */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Card Wallets</h3>
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

          {/* Transaction History Link */}
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

// ============ CARDS & WALLETS VIEW ============
function AdminCardsWallets({ onViewChange }: { onViewChange: (v: string) => void }) {
  const summary = {
    totalCards: 2847,
    activeCards: 2654,
    blockedCards: 193,
    totalParentWallet: "₹4.2Cr",
    totalCardWallet: "₹1.8Cr",
    totalIncentiveWallet: "₹45.2L"
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Cards & Wallets Overview</h1>
        <p className="text-sm text-muted-foreground">Monitor card status and wallet balances across all fleet operators</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.totalCards.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Cards</p>
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-xs">
            <span className="text-green-600">{summary.activeCards} Active</span>
            <span className="text-red-600">{summary.blockedCards} Blocked</span>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.totalParentWallet}</p>
              <p className="text-xs text-muted-foreground">Parent Wallet Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.totalCardWallet}</p>
              <p className="text-xs text-muted-foreground">Card Wallet (FO Funded)</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 lg:col-span-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{summary.totalIncentiveWallet}</p>
              <p className="text-xs text-muted-foreground">Incentive Wallet (MGL Funded)</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">42% of allocated incentive pool utilized</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Note:</span> Admin has read-only access to FO-funded Card Wallets. Only MGL-funded Incentive Wallets can be configured.
        </p>
      </div>
    </div>
  )
}

// ============ INCENTIVES & OFFERS ============
function AdminIncentives({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<"active" | "draft" | "completed">("active")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const offers = [
    { id: "OFF001", name: "Winter Bonus 2025", type: "Cashback", value: "5%", status: "Live", startDate: "01 Dec 2025", endDate: "31 Jan 2026", redemptions: 1250, budget: "₹10L", spent: "₹4.2L" },
    { id: "OFF002", name: "New FO Welcome", type: "Flat", value: "₹500", status: "Live", startDate: "01 Jan 2025", endDate: "31 Mar 2025", redemptions: 45, budget: "₹2.5L", spent: "₹22,500" },
    { id: "OFF003", name: "Festival Special", type: "Cashback", value: "10%", status: "Completed", startDate: "15 Oct 2025", endDate: "15 Nov 2025", redemptions: 3200, budget: "₹15L", spent: "₹14.8L" },
  ]

  const filteredOffers = offers.filter(o => {
    if (activeTab === "active") return o.status === "Live"
    if (activeTab === "completed") return o.status === "Completed"
    return o.status === "Draft"
  })

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Incentives & Offers</h1>
          <p className="text-sm text-muted-foreground">Manage MGL-funded incentive campaigns</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          + Create Offer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {[
          { key: "active", label: "Active Offers" },
          { key: "draft", label: "Drafts" },
          { key: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-card shadow-sm" : "hover:bg-card/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Offers List */}
      <div className="space-y-3">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{offer.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    offer.status === "Live" ? "bg-green-100 text-green-700" :
                    offer.status === "Draft" ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700"
                  }`}>{offer.status}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {offer.type} • {offer.value} • {offer.startDate} to {offer.endDate}
                </p>
              </div>
              <div className="flex gap-2">
                {offer.status === "Live" && (
                  <button className="p-2 border border-border rounded-lg hover:bg-muted">
                    <Pause className="w-4 h-4 text-amber-600" />
                  </button>
                )}
                <button className="p-2 border border-border rounded-lg hover:bg-muted">
                  <Edit3 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Redemptions</p>
                <p className="text-lg font-bold">{offer.redemptions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-lg font-bold">{offer.budget}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-lg font-bold text-green-600">{offer.spent}</p>
              </div>
            </div>

            <div className="mt-3 w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${(parseFloat(offer.spent.replace(/[₹L,]/g, "")) / parseFloat(offer.budget.replace(/[₹L,]/g, ""))) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <CreateOfferModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

function CreateOfferModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Create New Offer</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Offer Name</label>
            <input type="text" placeholder="e.g., Summer Bonus 2026" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm">
                <option>Cashback %</option>
                <option>Flat Amount</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Value</label>
              <input type="text" placeholder="e.g., 5% or ₹500" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input type="date" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <input type="date" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Budget (MGL Funded)</label>
            <input type="text" placeholder="e.g., ₹10,00,000" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium">Eligible FOs</label>
            <select className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm">
              <option>All Active FOs</option>
              <option>Select Specific FOs</option>
              <option>FOs with 10+ vehicles</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              Cancel
            </button>
            <button className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">
              Create Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ TRANSACTIONS VIEW ============
function AdminTransactions({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<"all" | "settlements" | "loads" | "transfers">("all")

  const transactions = [
    { id: "TXN001", type: "PG Load", fo: "ABC Logistics", amount: "₹50,000", status: "Completed", time: "10:30 AM", settlementStatus: "T+1 Pending" },
    { id: "TXN002", type: "Card Transfer", fo: "Metro Freight", amount: "₹15,000", status: "Completed", time: "10:15 AM", settlementStatus: "-" },
    { id: "TXN003", type: "Incentive Credit", fo: "Sunrise Transport", amount: "₹2,500", status: "Completed", time: "09:45 AM", settlementStatus: "-" },
    { id: "TXN004", type: "PG Load", fo: "City Express", amount: "₹1,00,000", status: "Processing", time: "09:30 AM", settlementStatus: "Pending" },
    { id: "TXN005", type: "Settlement", fo: "Multiple", amount: "₹12,45,000", status: "Completed", time: "Yesterday", settlementStatus: "Settled to MGL" },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Transactions & Settlements</h1>
          <p className="text-sm text-muted-foreground">Monitor all wallet transactions and settlement status</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          <Download className="w-4 h-4" />
          Export Ledger
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">T+1 Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2">₹28.5L</p>
          <p className="text-xs text-amber-700">23 transactions</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Processing</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">₹5.2L</p>
          <p className="text-xs text-blue-700">8 transactions</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Settled Today</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">₹45.8L</p>
          <p className="text-xs text-green-700">156 transactions</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Failed</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-2">₹1.2L</p>
          <p className="text-xs text-red-700">2 transactions - <button className="underline">Retry</button></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {[
          { key: "all", label: "All" },
          { key: "settlements", label: "Settlements" },
          { key: "loads", label: "PG Loads" },
          { key: "transfers", label: "Transfers" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-card shadow-sm" : "hover:bg-card/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Txn ID", "Type", "Fleet Operator", "Amount", "Status", "Time", "Settlement"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-mono text-xs">{txn.id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      txn.type === "PG Load" ? "bg-purple-100 text-purple-700" :
                      txn.type === "Card Transfer" ? "bg-blue-100 text-blue-700" :
                      txn.type === "Settlement" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>{txn.type}</span>
                  </td>
                  <td className="px-4 py-3">{txn.fo}</td>
                  <td className="px-4 py-3 font-medium">{txn.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      txn.status === "Completed" ? "bg-green-100 text-green-700" :
                      txn.status === "Processing" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                    }`}>{txn.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{txn.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${
                      txn.settlementStatus.includes("Pending") ? "text-amber-600" :
                      txn.settlementStatus.includes("Settled") ? "text-green-600" : "text-muted-foreground"
                    }`}>{txn.settlementStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============ MIS & REPORTS ============
function AdminReports() {
  const reportTemplates = [
    { name: "FO Balance Summary", desc: "Parent wallet and card balances by FO", format: "Excel" },
    { name: "Settlement Reconciliation", desc: "Daily T+1 settlement report", format: "Excel" },
    { name: "Incentive Program Report", desc: "Offer performance and redemptions", format: "PDF" },
    { name: "Card Issuance Report", desc: "New cards issued by region and FO", format: "Excel" },
    { name: "Transaction Ledger", desc: "Complete transaction history", format: "CSV" },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">MIS & Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and download compliance and business reports</p>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTemplates.map((report, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{report.name}</h3>
                  <p className="text-xs text-muted-foreground">{report.desc}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{report.format}</span>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90">
                <Download className="w-3 h-3" /> Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Report Builder */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Custom Report Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Report Type</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm">
              <option>Transaction Report</option>
              <option>Settlement Report</option>
              <option>Incentive Report</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Date Range</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Fleet Operator</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm">
              <option>All FOs</option>
              <option>ABC Logistics</option>
              <option>Metro Freight</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Scheduled Reports</h2>
          <button className="text-sm text-primary font-medium hover:underline">+ Add Schedule</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium text-sm">Daily Settlement Report</p>
              <p className="text-xs text-muted-foreground">Every day at 9:00 AM • finance@mgl.co.in</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
              <button className="p-1.5 hover:bg-muted rounded"><Edit3 className="w-3 h-3" /></button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium text-sm">Weekly Incentive Summary</p>
              <p className="text-xs text-muted-foreground">Every Monday at 10:00 AM • marketing@mgl.co.in</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
              <button className="p-1.5 hover:bg-muted rounded"><Edit3 className="w-3 h-3" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ ANALYTICS ============
function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Usage trends, performance insights, and predictive analytics</p>
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">FO Growth Trend</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Monthly FO registrations chart</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Wallet Utilization</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <PieChart className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Card vs Incentive wallet usage</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Settlement Heatmap</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Settlement delays by time of day</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Incentive Redemption Rate</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Offer performance over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground">89%</p>
            <p className="text-xs text-muted-foreground mt-1">Card Activation Rate</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground">₹45K</p>
            <p className="text-xs text-muted-foreground mt-1">Avg Monthly Load/FO</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground">98.5%</p>
            <p className="text-xs text-muted-foreground mt-1">Settlement Success Rate</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground">4.2x</p>
            <p className="text-xs text-muted-foreground mt-1">Incentive ROI</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ CONFIGURATION ============
function AdminConfig() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">System Configuration</h1>
        <p className="text-sm text-muted-foreground">View system parameters and governance settings</p>
      </div>

      {/* System Parameters (Read Only) */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">System Parameters</h2>
          <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">Read Only</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium text-sm">Settlement Cut-off Time</p>
              <p className="text-xs text-muted-foreground">Daily cut-off for T+1 processing</p>
            </div>
            <span className="font-mono text-sm">6:00 PM IST</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium text-sm">Minimum Load Amount</p>
              <p className="text-xs text-muted-foreground">Via Payment Gateway</p>
            </div>
            <span className="font-mono text-sm">₹1,000</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium text-sm">Max Card Wallet Limit</p>
              <p className="text-xs text-muted-foreground">Per vehicle card</p>
            </div>
            <span className="font-mono text-sm">₹50,000</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Incentive Pool Threshold</p>
              <p className="text-xs text-muted-foreground">Low balance alert</p>
            </div>
            <span className="font-mono text-sm">₹2,00,000</span>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Audit Logs</h2>
          <button className="text-sm text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-2">
          {[
            { action: "Offer Created", user: "Arun Verma", time: "2 hrs ago", details: "Winter Bonus 2025" },
            { action: "Report Generated", user: "Arun Verma", time: "5 hrs ago", details: "Settlement Reconciliation" },
            { action: "Config Updated", user: "Super Admin", time: "1 day ago", details: "Incentive pool threshold" },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-sm">{log.action}</p>
                <p className="text-xs text-muted-foreground">{log.details} • by {log.user}</p>
              </div>
              <span className="text-xs text-muted-foreground">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          {[
            { label: "Settlement Alerts", desc: "Failed or delayed settlements", enabled: true },
            { label: "Low Balance Alerts", desc: "Incentive pool below threshold", enabled: true },
            { label: "New FO Registration", desc: "When new FOs are onboarded", enabled: false },
            { label: "Daily Summary", desc: "End of day operations summary", enabled: true },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <button className={`w-12 h-6 rounded-full transition-colors ${pref.enabled ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${pref.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
