"use client"



import { useState } from "react"
import MGLHeader from "@/components/mgl/MGLHeader"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter"
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
      case "admin-users": return <AdminUserManagement />
      case "admin-cards": return <AdminCardsWallets onViewChange={setActiveView} />
      case "admin-incentives": return <AdminIncentives onViewChange={setActiveView} />
      case "admin-transactions": return <AdminTransactions onViewChange={setActiveView} />
      case "admin-settlements": return <AdminSettlements onViewChange={setActiveView} />
      case "admin-reports": return <AdminReports />
      case "admin-analytics": return <AdminAnalytics />
      case "admin-config": return <AdminConfig />
      default: return <AdminDashboard onViewChange={setActiveView} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
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
      <PoweredByFooter />
    </div>
  )
}

// ============ USER MANAGEMENT ============
function AdminUserManagement() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    name: "", empId: "", email: "", mobile: "",
    role: "ZIC", mapping: "",
    state: "", city: "", department: "", branch: ""
  })
  const [users, setUsers] = useState([
    { id: 1, empId: '2009', name: 'Bhushan Mayekar', email: 'mayekar.bhushan@mahanagargas.com', mobile: '8879136709', role: 'ZIC', mapping: 'NA', status: 'Pending', state: 'Maharashtra', city: 'Mumbai', department: 'Operations', branch: 'Andheri' },
    { id: 2, empId: '2010', name: 'Rajesh Kumar', email: 'rajesh.kumar@mahanagargas.com', mobile: '9876543210', role: 'MIC', mapping: 'Mumbai Region', status: 'Active', state: 'Maharashtra', city: 'Mumbai', department: 'Sales', branch: 'Bandra' },
    { id: 3, empId: '2011', name: 'Priya Sharma', email: 'priya.sharma@mahanagargas.com', mobile: '8765432109', role: 'ZIC', mapping: 'Thane Zone', status: 'Active', state: 'Maharashtra', city: 'Thane', department: 'Operations', branch: 'Ghodbunder' },
    { id: 4, empId: '2012', name: 'Amit Patel', email: 'amit.patel@mahanagargas.com', mobile: '7654321098', role: 'Admin', mapping: 'National', status: 'Inactive', state: 'Maharashtra', city: 'Mumbai', department: 'Administration', branch: 'HQ' },
    { id: 5, empId: '2013', name: 'Neha Singh', email: 'neha.singh@mahanagargas.com', mobile: '6543210987', role: 'ZIC', mapping: 'NA', status: 'Pending', state: 'Maharashtra', city: 'Pune', department: 'Customer Service', branch: 'Viman Nagar' },
  ])

  const filteredUsers = users.filter(user => {
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.empId.includes(search)
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const activeCount = users.filter(u => u.status === "Active").length
  const pendingCount = users.filter(u => u.status === "Pending" || u.status === "Inactive").length
  const uniqueRoles = new Set(users.map(u => u.role)).size

  const handleActivateDeactivate = (userId: number, newStatus: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u))
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => ({ ...prev, status: newStatus }))
    }
  }

  const handleAddUser = () => {
    const newUser = {
      id: users.length + 1,
      empId: newUserForm.empId,
      name: newUserForm.name,
      email: newUserForm.email,
      mobile: newUserForm.mobile,
      role: newUserForm.role,
      mapping: newUserForm.mapping || 'NA',
      state: newUserForm.state,
      city: newUserForm.city,
      department: newUserForm.department,
      branch: newUserForm.branch,
      status: 'Pending'
    }
    setUsers(prev => [...prev, newUser])
    setShowAddModal(false)
    setNewUserForm({ name: '', empId: '', email: '', mobile: '', role: 'ZIC', mapping: '', state: '', city: '', department: '', branch: '' })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ZIC": return "bg-amber-100 text-amber-700 border border-amber-200"
      case "MIC": return "bg-blue-100 text-blue-700 border border-blue-200"
      case "Admin": return "bg-purple-100 text-purple-700 border border-purple-200"
      default: return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700 border border-green-200"
      case "Inactive": return "bg-red-50 text-red-700 border border-red-200"
      case "Pending": return "bg-amber-50 text-amber-700 border border-amber-200"
      default: return "bg-gray-50 text-gray-700 border border-gray-200"
    }
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">User Management </h1>
        <p className="text-sm text-muted-foreground">Manage MGL portal users and access control</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground">Total Users</p>
          <p className="text-lg font-bold text-foreground mt-1">{users.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">All users</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs font-medium text-green-800">Active</p>
          <p className="text-lg font-bold text-green-900 mt-1">{activeCount}</p>
          <p className="text-xs text-green-700 mt-0.5">Active users</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs font-medium text-amber-800">Pending Activation</p>
          <p className="text-lg font-bold text-amber-900 mt-1">{pendingCount}</p>
          <p className="text-xs text-amber-700 mt-0.5">Pending & Inactive</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs font-medium text-purple-800">Roles</p>
          <p className="text-lg font-bold text-purple-900 mt-1">{uniqueRoles}</p>
          <p className="text-xs text-purple-700 mt-0.5">Unique roles</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or emp ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-40 mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
          >
            <option value="all">All</option>
            <option value="MIC">MIC</option>
            <option value="ZIC">ZIC</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40 mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
          >
            <option value="all">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          + Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Emp ID</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Mobile</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Mapping</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map(user => (
                <tr
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="hover:bg-muted/50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium">{user.empId}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.mobile}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.mapping}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Tray */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSelectedUser(null)}
        />
      )}

      {selectedUser && (
        <div className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-lg bg-card h-full overflow-y-auto shadow-xl border-l border-border">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">{selectedUser.name}</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-muted-foreground">Emp ID: {selectedUser.empId}</div>
            <div className="flex gap-2">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                {selectedUser.role}
              </span>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(selectedUser.status)}`}>
                {selectedUser.status}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4 pb-24">
            {/* Contact Details Card */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Contact Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-semibold">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile:</span>
                  <span className="font-semibold">{selectedUser.mobile}</span>
                </div>
              </div>
            </div>

            {/* Role & Mapping Card */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Role & Mapping</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-semibold">{selectedUser.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mapping:</span>
                  <span className="font-semibold">{selectedUser.mapping}</span>
                </div>
              </div>
            </div>

            {/* Location & Department Card */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Location & Department</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">State:</span>
                  <span className="font-semibold">{selectedUser.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-semibold">{selectedUser.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold">{selectedUser.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Branch:</span>
                  <span className="font-semibold">{selectedUser.branch}</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className={`rounded-lg p-3 border ${selectedUser.status === "Pending" || selectedUser.status === "Inactive" ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}>
              <p className={`text-xs ${selectedUser.status === "Pending" || selectedUser.status === "Inactive" ? "text-blue-700" : "text-amber-700"}`}>
                Upon activation this user will be able to login to the MGL portal based on their assigned role
              </p>
            </div>
          </div>

          {/* Action Button - Fixed at bottom */}
          <div className="fixed bottom-0 right-0 w-full max-w-lg p-4 bg-card border-t border-border">
            {selectedUser.status === "Pending" || selectedUser.status === "Inactive" ? (
              <button
                onClick={() => {
                  handleActivateDeactivate(selectedUser.id, "Active")
                  setSelectedUser(null)
                }}
                className="w-full py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Activate User
              </button>
            ) : (
              <button
                onClick={() => {
                  handleActivateDeactivate(selectedUser.id, "Inactive")
                  setSelectedUser(null)
                }}
                className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Deactivate User
              </button>
            )}
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Personal Info</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Name</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.name} onChange={e => setNewUserForm(f => ({...f, name: e.target.value}))} placeholder="Full name" /></div>
                  <div><label className="text-sm font-medium">Emp ID</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.empId} onChange={e => setNewUserForm(f => ({...f, empId: e.target.value}))} placeholder="Employee ID" /></div>
                  <div><label className="text-sm font-medium">Email</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.email} onChange={e => setNewUserForm(f => ({...f, email: e.target.value}))} placeholder="email@mahanagargas.com" /></div>
                  <div><label className="text-sm font-medium">Mobile</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.mobile} onChange={e => setNewUserForm(f => ({...f, mobile: e.target.value}))} placeholder="10-digit mobile" /></div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Role & Access</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">Role</label><select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm" value={newUserForm.role} onChange={e => setNewUserForm(f => ({...f, role: e.target.value}))}><option value="ZIC">ZIC</option><option value="MIC">MIC</option><option value="Admin">Admin</option></select></div>
                  <div><label className="text-sm font-medium">Mapping</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.mapping} onChange={e => setNewUserForm(f => ({...f, mapping: e.target.value}))} placeholder="Region / Zone / NA" /></div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Location & Department</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium">State</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.state} onChange={e => setNewUserForm(f => ({...f, state: e.target.value}))} placeholder="State" /></div>
                  <div><label className="text-sm font-medium">City</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.city} onChange={e => setNewUserForm(f => ({...f, city: e.target.value}))} placeholder="City" /></div>
                  <div><label className="text-sm font-medium">Department</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.department} onChange={e => setNewUserForm(f => ({...f, department: e.target.value}))} placeholder="Department" /></div>
                  <div><label className="text-sm font-medium">Branch</label><input className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm" value={newUserForm.branch} onChange={e => setNewUserForm(f => ({...f, branch: e.target.value}))} placeholder="Branch" /></div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">Cancel</button>
                <button onClick={handleAddUser} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">Add User</button>
              </div>
            </div>
          </div>
        </div>
      )}
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
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>
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
  const [type, setType] = useState<"POS" | "Load">("POS")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  const posTransactions = [
    { 
      id: "42288", 
      date: "02/03/2026", 
      time: "01:33 PM", 
      type: "debit", 
      card: "xxxxxxxxxxxx1138", 
      channel: "pos", 
      product: "cng", 
      amount: 14947, 
      openingBalance: 58469, 
      closingBalance: 43522, 
      station: "MGL Hind CNG Filling Station", 
      merchantCode: "100069", 
      driver: "", 
      vehicle: "MH47BY2770", 
      reversedBy: "", 
      reversalOf: "", 
      status: "Successful" as const 
    },
    { 
      id: "42287", 
      date: "02/03/2026", 
      time: "01:24 PM", 
      type: "debit", 
      card: "xxxxxxxxxxxx3175", 
      channel: "pos", 
      product: "cng", 
      amount: 3260.6, 
      openingBalance: 30742.9, 
      closingBalance: 27482.3, 
      station: "MGL Amul Chemicals Thane Belapur Road Rabale", 
      merchantCode: "100119", 
      driver: "", 
      vehicle: "MH47BY1688", 
      reversedBy: "", 
      reversalOf: "", 
      status: "Successful" as const 
    },
  ]

  const loadTransactions = [
    { id: "LOAD001", dateTime: "Mar 21, 2024 11:00 AM", fo: "ABC Logistics", amount: "₹50,000", status: "Successful" as const },
    { id: "LOAD002", dateTime: "Mar 21, 2024 10:45 AM", fo: "Sunrise Transport", amount: "₹2,500", status: "Failed" as const },
    { id: "LOAD003", dateTime: "Mar 20, 2024 06:00 PM", fo: "National Logistics", amount: "₹45,000", status: "Pending" as const },
    { id: "LOAD004", dateTime: "Mar 20, 2024 02:30 PM", fo: "Metro Freight", amount: "₹75,000", status: "Processing" as const },
    { id: "LOAD005", dateTime: "Mar 20, 2024 11:00 AM", fo: "City Express", amount: "₹30,000", status: "Successful" as const },
  ]

  const parseAmount = (amt) => typeof amt === 'number' ? amt : parseInt((amt || '0').replace(/[₹,]/g, '')) || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful": return "bg-green-50 text-green-700 border border-green-200"
      case "Failed": return "bg-red-50 text-red-700 border border-red-200"
      case "Pending": return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      case "Processing": return "bg-blue-50 text-blue-700 border border-blue-200"
      default: return "bg-gray-50 text-gray-700 border border-gray-200"
    }
  }

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "Successful": return "border-t-green-600"
      case "Failed": return "border-t-red-600"
      case "Pending": return "border-t-yellow-600"
      case "Processing": return "border-t-blue-600"
      default: return "border-t-gray-600"
    }
  }

  // POS calculations
  const successful = posTransactions.filter(t => t.status === "Successful")
  const pendingProcessing = posTransactions.filter(t => t.status === "Pending" || t.status === "Processing")
  const failed = posTransactions.filter(t => t.status === "Failed")
  const totalAmount = posTransactions.reduce((sum, t) => sum + parseAmount(t.amount), 0)

  // Load calculations
  const lSuccessful = loadTransactions.filter(t => t.status === "Successful")
  const lPending = loadTransactions.filter(t => t.status === "Pending")
  const lFailed = loadTransactions.filter(t => t.status === "Failed")
  const totalLoadAmount = loadTransactions.reduce((sum, t) => sum + parseAmount(t.amount), 0)

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">Monitor all transaction statuses</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setType("POS")}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${type === "POS" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          POS
        </button>
        <button
          onClick={() => setType("Load")}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${type === "Load" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Load
        </button>
      </div>

      {type === "POS" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-medium text-green-800">Successful</p>
              <p className="text-lg font-bold text-green-900 mt-1">₹{(successful.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-green-700 mt-0.5">{successful.length} transactions</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-800">Pending / Processing</p>
              <p className="text-lg font-bold text-amber-900 mt-1">₹{(pendingProcessing.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-amber-700 mt-0.5">{pendingProcessing.length} transactions</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-medium text-red-800">Failed</p>
              <p className="text-lg font-bold text-red-900 mt-1">₹{(failed.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-red-700 mt-0.5">{failed.length} transactions</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-800">Total</p>
              <p className="text-lg font-bold text-blue-900 mt-1">₹{(totalAmount / 100000).toFixed(1)}L</p>
              <p className="text-xs text-blue-700 mt-0.5">{posTransactions.length} transactions</p>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">TXN ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Card</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Vehicle</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Station</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {posTransactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{txn.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{txn.date}</td>
                      <td className="px-4 py-3 text-muted-foreground">{txn.time}</td>
                      <td className="px-4 py-3 font-mono text-xs">{txn.card}</td>
                      <td className="px-4 py-3">{txn.vehicle}</td>
                      <td className="px-4 py-3 font-semibold">₹{txn.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{txn.station}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedTransaction(txn)}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {type === "Load" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-800">Total Load Attempted</p>
              <p className="text-lg font-bold text-blue-900 mt-1">₹{(totalLoadAmount / 100000).toFixed(1)}L</p>
              <p className="text-xs text-blue-700 mt-0.5">{loadTransactions.length} transactions</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-medium text-green-800">Successful Load</p>
              <p className="text-lg font-bold text-green-900 mt-1">₹{(lSuccessful.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-green-700 mt-0.5">{lSuccessful.length} transactions</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs font-medium text-yellow-800">Pending Load</p>
              <p className="text-lg font-bold text-yellow-900 mt-1">₹{(lPending.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-yellow-700 mt-0.5">{lPending.length} transactions</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-medium text-red-800">Failed Load</p>
              <p className="text-lg font-bold text-red-900 mt-1">₹{(lFailed.reduce((s, t) => s + parseAmount(t.amount), 0) / 100000).toFixed(1)}L</p>
              <p className="text-xs text-red-700 mt-0.5">{lFailed.length} transactions</p>
            </div>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">TXN ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Date & Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">FO</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadTransactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{txn.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{txn.dateTime}</td>
                      <td className="px-4 py-3">{txn.fo}</td>
                      <td className="px-4 py-3 font-semibold">{txn.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(txn.status)}`}>{txn.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedTransaction(txn)}
                          className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Dark overlay */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSelectedTransaction(null)}
        />
      )}

      {/* Transaction Details Tray with colored top border */}
      {selectedTransaction && (
        <div className={`fixed bottom-0 right-0 top-0 z-[61] w-full max-w-lg bg-card h-full overflow-y-auto shadow-xl border-l border-border border-t-4 transform transition-transform duration-300 ${getStatusBorderColor(selectedTransaction.status)}`}>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Transaction Details</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-mono text-muted-foreground">{selectedTransaction.id}</span>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                {selectedTransaction.status}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4 pb-24">
            {/* Card 1: Transaction Info */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Transaction Info</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-semibold">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold">{selectedTransaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-semibold">{selectedTransaction.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${selectedTransaction.type === "debit" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {selectedTransaction.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channel:</span>
                  <span className="font-semibold capitalize">{selectedTransaction.channel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-semibold uppercase">{selectedTransaction.product}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Card & Vehicle */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Card & Vehicle</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card:</span>
                  <span className="font-mono text-xs">{selectedTransaction.card}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-semibold">{selectedTransaction.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver:</span>
                  <span className="font-semibold">{selectedTransaction.driver || "—"}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Station Info */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Station Info</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Station:</span>
                  <span className="font-semibold text-right">{selectedTransaction.station}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merchant Code:</span>
                  <span className="font-semibold">{selectedTransaction.merchantCode}</span>
                </div>
              </div>
            </div>

            {/* Card 4: Amount Details */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Amount Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opening Balance:</span>
                  <span className="font-semibold">₹{selectedTransaction.openingBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className={`text-lg font-bold ${selectedTransaction.type === "debit" ? "text-red-600" : "text-green-600"}`}>
                    {selectedTransaction.type === "debit" ? "-" : "+"}₹{selectedTransaction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Closing Balance:</span>
                  <span className="font-semibold">₹{selectedTransaction.closingBalance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Card 5: Reversal Info (only if reversedBy or reversalOf) */}
            {(selectedTransaction.reversedBy || selectedTransaction.reversalOf) && (
              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">Reversal Info</p>
                <div className="space-y-2 text-sm">
                  {selectedTransaction.reversedBy && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reversed By:</span>
                      <span className="font-semibold">{selectedTransaction.reversedBy}</span>
                    </div>
                  )}
                  {selectedTransaction.reversalOf && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reversal Of:</span>
                      <span className="font-semibold">{selectedTransaction.reversalOf}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Download Receipt Button - Fixed at bottom */}
          <div className="fixed bottom-0 right-0 max-w-lg p-4 bg-card border-t border-border w-full">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ SETTLEMENTS ============
function AdminSettlements({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  const settlementData = [
    {
      id: "SETL001",
      dateTime: "Mar 21, 2024 10:30 AM",
      dealership: "ABC Motors",
      totalAmount: 152000,
      totalFee: 1520,
      totalTaxes: 15200,
      netAmount: 135280,
      status: "Settled",
      transactionFrom: "Mar 21, 2024 00:00",
      transactionTill: "Mar 21, 2024 23:59",
      settlementDate: "Mar 22, 2024",
      bankUTR: "UTR123456789",
      bankAccount: "****4521",
      bankName: "HDFC Bank",
      transactions: [
        { txnId: "TXN001", dateTime: "Mar 21, 2024 10:30 AM", dealership: "ABC Motors", posId: "POS-001", amount: 50000, fee: 500, taxes: 5000 },
        { txnId: "TXN004", dateTime: "Mar 21, 2024 09:30 AM", dealership: "ABC Motors", posId: "POS-001", amount: 102000, fee: 1020, taxes: 10200 },
      ]
    },
    {
      id: "SETL002",
      dateTime: "Mar 20, 2024 04:00 PM",
      dealership: "XYZ Auto",
      totalAmount: 87500,
      totalFee: 875,
      totalTaxes: 8750,
      netAmount: 77875,
      status: "Pending",
      transactionFrom: "Mar 20, 2024 00:00",
      transactionTill: "Mar 20, 2024 23:59",
      settlementDate: "Mar 21, 2024",
      bankUTR: "UTR987654321",
      bankAccount: "****8765",
      bankName: "ICICI Bank",
      transactions: [
        { txnId: "TXN002", dateTime: "Mar 21, 2024 10:15 AM", dealership: "XYZ Auto", posId: "POS-002", amount: 15000, fee: 150, taxes: 1500 },
        { txnId: "TXN006", dateTime: "Mar 20, 2024 04:00 PM", dealership: "XYZ Auto", posId: "POS-002", amount: 72500, fee: 725, taxes: 7250 },
      ]
    },
    {
      id: "SETL003",
      dateTime: "Mar 19, 2024 01:15 PM",
      dealership: "Prime Motors",
      totalAmount: 15000,
      totalFee: 150,
      totalTaxes: 1500,
      netAmount: 13350,
      status: "Processing",
      transactionFrom: "Mar 19, 2024 00:00",
      transactionTill: "Mar 19, 2024 23:59",
      settlementDate: "Mar 20, 2024",
      bankUTR: "UTR111222333",
      bankAccount: "****5678",
      bankName: "Axis Bank",
      transactions: [
        { txnId: "TXN003", dateTime: "Mar 21, 2024 09:45 AM", dealership: "Prime Motors", posId: "POS-003", amount: 2500, fee: 25, taxes: 250 },
        { txnId: "TXN008", dateTime: "Mar 20, 2024 01:15 PM", dealership: "Prime Motors", posId: "POS-003", amount: 12500, fee: 125, taxes: 1250 },
      ]
    },
    {
      id: "SETL004",
      dateTime: "Mar 18, 2024 05:15 PM",
      dealership: "Elite Autos",
      totalAmount: 35000,
      totalFee: 350,
      totalTaxes: 3500,
      netAmount: 31150,
      status: "On Hold",
      transactionFrom: "Mar 18, 2024 00:00",
      transactionTill: "Mar 18, 2024 23:59",
      settlementDate: "Mar 19, 2024",
      bankUTR: "UTR444555666",
      bankAccount: "****9012",
      bankName: "Yes Bank",
      transactions: [
        { txnId: "TXN005", dateTime: "Mar 20, 2024 05:15 PM", dealership: "Elite Autos", posId: "POS-004", amount: 35000, fee: 350, taxes: 3500 },
      ]
    },
    {
      id: "SETL005",
      dateTime: "Mar 17, 2024 11:30 AM",
      dealership: "Metro Garage",
      totalAmount: 62500,
      totalFee: 625,
      totalTaxes: 6250,
      netAmount: 55625,
      status: "Failed",
      transactionFrom: "Mar 17, 2024 00:00",
      transactionTill: "Mar 17, 2024 23:59",
      settlementDate: "Mar 18, 2024",
      bankUTR: "UTR777888999",
      bankAccount: "****3456",
      bankName: "Kotak Bank",
      transactions: [
        { txnId: "TXN007", dateTime: "Mar 17, 2024 11:30 AM", dealership: "Metro Garage", posId: "POS-005", amount: 62500, fee: 625, taxes: 6250 },
      ]
    },
    {
      id: "SETL006",
      dateTime: "Mar 16, 2024 03:45 PM",
      dealership: "Prime Motors",
      totalAmount: 45000,
      totalFee: 450,
      totalTaxes: 4500,
      netAmount: 40050,
      status: "Settled",
      transactionFrom: "Mar 16, 2024 00:00",
      transactionTill: "Mar 16, 2024 23:59",
      settlementDate: "Mar 17, 2024",
      bankUTR: "UTR101112131415",
      bankAccount: "****7890",
      bankName: "IndusInd Bank",
      transactions: [
        { txnId: "TXN009", dateTime: "Mar 16, 2024 03:45 PM", dealership: "Prime Motors", posId: "POS-003", amount: 45000, fee: 450, taxes: 4500 },
      ]
    },
  ]

  const filteredSettlements = settlementData.filter(s => 
    (statusFilter === "all" || s.status.toLowerCase() === statusFilter.toLowerCase()) &&
    (s.dealership.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Settled": return "bg-green-50 text-green-700 border border-green-200"
      case "Pending": return "bg-yellow-50 text-yellow-700 border border-yellow-200"
      case "Processing": return "bg-blue-50 text-blue-700 border border-blue-200"
      case "On Hold": return "bg-orange-50 text-orange-700 border border-orange-200"
      case "Failed": return "bg-red-50 text-red-700 border border-red-200"
      default: return "bg-gray-50 text-gray-700 border border-gray-200"
    }
  }

  const summaryStats = {
    settled: settlementData.filter(s => s.status === "Settled").reduce((sum, s) => sum + s.netAmount, 0),
    upcoming: settlementData.filter(s => s.status === "Pending" || s.status === "Processing").reduce((sum, s) => sum + s.netAmount, 0),
    onHold: settlementData.filter(s => s.status === "On Hold").reduce((sum, s) => sum + s.totalAmount, 0),
    failed: settlementData.filter(s => s.status === "Failed").reduce((sum, s) => sum + s.totalAmount, 0),
    settledDealerships: new Set(settlementData.filter(s => s.status === "Settled").map(s => s.dealership)).size,
    upcomingDealerships: new Set(settlementData.filter(s => s.status === "Pending" || s.status === "Processing").map(s => s.dealership)).size,
    onHoldDealerships: new Set(settlementData.filter(s => s.status === "On Hold").map(s => s.dealership)).size,
    failedDealerships: new Set(settlementData.filter(s => s.status === "Failed").map(s => s.dealership)).size,
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Settlements</h1>
          <p className="text-sm text-muted-foreground">Monitor settlement status and dealership-wise summary</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs font-medium text-green-800">Settled</p>
          <p className="text-lg font-bold text-green-900 mt-1">₹{(summaryStats.settled / 100000).toFixed(1)}L</p>
          <p className="text-xs text-green-700 mt-0.5">{summaryStats.settledDealerships} dealerships</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs font-medium text-amber-800">Upcoming</p>
          <p className="text-lg font-bold text-amber-900 mt-1">₹{(summaryStats.upcoming / 100000).toFixed(1)}L</p>
          <p className="text-xs text-amber-700 mt-0.5">{summaryStats.upcomingDealerships} dealerships</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-xs font-medium text-orange-800">On Hold</p>
          <p className="text-lg font-bold text-orange-900 mt-1">₹{(summaryStats.onHold / 100000).toFixed(1)}L</p>
          <p className="text-xs text-orange-700 mt-0.5">{summaryStats.onHoldDealerships} dealerships</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs font-medium text-purple-800">Failed</p>
          <p className="text-lg font-bold text-purple-900 mt-1">₹{(summaryStats.failed / 100000).toFixed(1)}L</p>
          <p className="text-xs text-purple-700 mt-0.5">{summaryStats.failedDealerships} dealerships</p>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search by dealership or settlement ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground">
          <option value="all">All Status</option>
          <option value="settled">Settled</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="on hold">On Hold</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Date & Time</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Dealership</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Total Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Fee</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Taxes</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Net Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSettlements.map(settlement => (
                <tr key={settlement.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-muted-foreground">{settlement.dateTime}</td>
                  <td className="px-4 py-3 font-medium">{settlement.dealership}</td>
                  <td className="px-4 py-3">₹{settlement.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">₹{settlement.totalFee.toLocaleString()}</td>
                  <td className="px-4 py-3">₹{settlement.totalTaxes.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold">₹{settlement.netAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(settlement.status)}`}>
                      {settlement.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelectedSettlement(settlement); setSelectedTransaction(null); }}
                      className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dark overlay */}
      {(selectedSettlement || selectedTransaction) && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => { setSelectedSettlement(null); setSelectedTransaction(null); }}
        />
      )}

      {/* Settlement Details Tray */}
      {selectedSettlement && !selectedTransaction && (
        <div className={`fixed bottom-0 right-0 top-0 w-96 bg-card border-l border-border shadow-lg overflow-y-auto z-50 border-t-4 transform transition-transform duration-300 ${getStatusColor(selectedSettlement.status).replace(/text-\w+-\d+/, '').replace(/bg-\w+-50/, '').replace(/border/, 'border-t-green-600').split(' ')[0] === 'bg-green-50' ? 'border-t-green-600' : selectedSettlement.status === 'Pending' ? 'border-t-yellow-600' : selectedSettlement.status === 'Processing' ? 'border-t-blue-600' : selectedSettlement.status === 'On Hold' ? 'border-t-orange-600' : 'border-t-red-600'}`}>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Settlement Details</h2>
              <button onClick={() => { setSelectedSettlement(null); setSelectedTransaction(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-mono text-muted-foreground">{selectedSettlement.id}</span>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedSettlement.status)}`}>
                {selectedSettlement.status}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Transaction Period Card */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Transaction Period</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-semibold">{selectedSettlement.transactionFrom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Till:</span>
                  <span className="font-semibold">{selectedSettlement.transactionTill}</span>
                </div>
              </div>
            </div>

            {/* Settlement Information Card */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">Settlement Information</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Settlement Date:</span>
                  <span className="font-semibold">{selectedSettlement.settlementDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank UTR:</span>
                  <span className="font-semibold font-mono">{selectedSettlement.bankUTR}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account:</span>
                  <span className="font-semibold font-mono">{selectedSettlement.bankAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank:</span>
                  <span className="font-semibold">{selectedSettlement.bankName}</span>
                </div>
              </div>
            </div>

            {/* Net Amount Breakdown Card */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Net Amount Breakdown</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold">₹{selectedSettlement.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee:</span>
                  <span className="font-semibold text-red-600">-₹{selectedSettlement.totalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes:</span>
                  <span className="font-semibold text-red-600">-₹{selectedSettlement.totalTaxes.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between">
                  <span className="text-muted-foreground">Net Amount:</span>
                  <span className="text-lg font-bold text-green-600">₹{selectedSettlement.netAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Transactions Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-sm font-semibold text-foreground">Transactions</p>
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">{selectedSettlement.transactions.length}</span>
              </div>
              <div className="space-y-2">
                {selectedSettlement.transactions.map(txn => (
                  <button
                    key={txn.txnId}
                    onClick={() => setSelectedTransaction(txn)}
                    className="w-full text-left bg-muted hover:bg-muted/80 rounded-lg p-3 transition-colors space-y-1"
                  >
                    <div className="text-xs font-semibold text-foreground">{txn.txnId}</div>
                    <div className="text-xs text-muted-foreground">₹{txn.amount.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dark overlay for transaction tray */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setSelectedTransaction(null)}
        />
      )}

      {/* Transaction Details Tray */}
      {selectedTransaction && (
        <div className={`fixed bottom-0 right-0 top-0 z-[61] w-full max-w-lg bg-card h-full overflow-y-auto shadow-xl border-l border-border border-t-4 transform transition-transform duration-300 ${
          selectedTransaction.status === "Successful" ? "border-t-green-600" :
          selectedTransaction.status === "Failed" ? "border-t-red-600" :
          selectedTransaction.status === "Pending" ? "border-t-yellow-600" : "border-t-blue-600"
        }`}>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Transaction Details</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{selectedTransaction.txnId}</span>
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                selectedTransaction.status === "Successful" ? "bg-green-50 text-green-700 border border-green-200" :
                selectedTransaction.status === "Failed" ? "bg-red-50 text-red-700 border border-red-200" :
                selectedTransaction.status === "Pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}>
                {selectedTransaction.status}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4 pb-24">
            {/* Transaction Info Card */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Transaction Info</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-semibold">{selectedTransaction.dateTime}</span>
                </div>
                {selectedTransaction.posId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">POS ID:</span>
                    <span className="font-semibold">{selectedTransaction.posId}</span>
                  </div>
                )}
                {selectedTransaction.dealership && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dealership:</span>
                    <span className="font-semibold">{selectedTransaction.dealership}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amount Breakdown Card */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-foreground">Amount Breakdown</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold">₹{selectedTransaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee:</span>
                  <span className="font-semibold text-red-600">-₹{selectedTransaction.fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes:</span>
                  <span className="font-semibold text-red-600">-₹{selectedTransaction.taxes.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between">
                  <span className="text-muted-foreground">Net Amount:</span>
                  <span className="text-xl font-bold text-green-600">₹{(selectedTransaction.amount - selectedTransaction.fee - selectedTransaction.taxes).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Download Receipt Button - Fixed at bottom */}
          <div className="fixed bottom-0 right-0 max-w-md p-4 bg-card border-t border-border">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============ MIS & REPORTS ============
function AdminReports() {
  const [reportType, setReportType] = useState("Transaction Report")
  const [foFilter, setFoFilter] = useState("All FOs")
  const [dateFrom, setDateFrom] = useState(new Date(Date.now() - 86400000).toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [generatedReports, setGeneratedReports] = useState<any[]>([])

  const reportTemplates = [
    { name: "FO Balance Summary", desc: "Parent wallet and card balances by FO", format: "Excel" },
    { name: "Settlement Reconciliation", desc: "Daily T+1 settlement report", format: "Excel" },
    { name: "Incentive Program Report", desc: "Offer performance and redemptions", format: "PDF" },
    { name: "Card Issuance Report", desc: "New cards issued by region and FO", format: "Excel" },
    { name: "Transaction Ledger", desc: "Complete transaction history", format: "CSV" },
  ]

  const handleGenerateReport = () => {
    const newReport = {
      id: Date.now(),
      reportType,
      fo: foFilter,
      dateRange: `${dateFrom} to ${dateTo}`,
      requestedAt: new Date().toLocaleString(),
      status: "Preparing",
      createdAt: Date.now(),
    }
    setGeneratedReports(prev => [...prev, newReport])

    // Change status to Ready after 5 minutes
    setTimeout(() => {
      setGeneratedReports(prev =>
        prev.map(report =>
          report.id === newReport.id ? { ...report, status: "Ready" } : report
        )
      )
    }, 300000)
  }

  const getExpiryDate = (createdAt: number) => {
    const date = new Date(createdAt + 7 * 24 * 60 * 60 * 1000)
    return date.toLocaleDateString()
  }

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
                <Download className="w-3 h-3" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Report Builder */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Custom Report Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            >
              <option>Transaction Report</option>
              <option>Settlement Report</option>
              <option>Incentive Report</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Fleet Operator</label>
            <select
              value={foFilter}
              onChange={(e) => setFoFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            >
              <option>All FOs</option>
              <option>ABC Logistics</option>
              <option>Metro Freight</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Generated Reports */}
      {generatedReports.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-4">Generated Reports</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Report Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">FO</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Date Range</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Requested At</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Expires</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {generatedReports.map((report) => {
                    const requestDate = new Date(report.requestedAt)
                    const formattedDateRange = (() => {
                      const [from, to] = report.dateRange.split(' to ')
                      const fromDate = new Date(from)
                      const toDate = new Date(to)
                      return `${fromDate.getDate()} ${fromDate.toLocaleDateString('en-US', { month: 'short' })} ${fromDate.getFullYear()} → ${toDate.getDate()} ${toDate.toLocaleDateString('en-US', { month: 'short' })} ${toDate.getFullYear()}`
                    })()
                    const formattedRequestedAt = `${String(requestDate.getDate()).padStart(2, '0')}/${String(requestDate.getMonth() + 1).padStart(2, '0')}/${requestDate.getFullYear()} ${String(requestDate.getHours()).padStart(2, '0')}:${String(requestDate.getMinutes()).padStart(2, '0')}`
                    const expiryDate = new Date(report.createdAt + 7 * 24 * 60 * 60 * 1000)
                    const formattedExpiry = `${expiryDate.getDate()} ${expiryDate.toLocaleDateString('en-US', { month: 'short' })} ${expiryDate.getFullYear()}`

                    return (
                      <tr key={report.id} className="hover:bg-muted/50 h-12">
                        <td className="px-4 py-3 whitespace-nowrap">{report.reportType}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{report.fo}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formattedDateRange}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formattedRequestedAt}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                            report.status === "Preparing"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap">{formattedExpiry}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {report.status === "Ready" ? (
                            <button className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium">
                              <Download className="w-4 h-4" /> Download
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
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
