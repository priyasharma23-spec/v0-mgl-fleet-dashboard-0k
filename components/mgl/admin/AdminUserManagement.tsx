"use client"

import { useState } from "react"
import { Search, Filter, X, Download } from "lucide-react"

export default function AdminUserManagement() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
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
    const errors: Record<string, string> = {}
    
    if (!newUserForm.name.trim()) {
      errors.name = "Name is required"
    }
    if (!newUserForm.empId.trim()) {
      errors.empId = "Employee ID is required"
    }
    if (!newUserForm.mobile.trim()) {
      errors.mobile = "Mobile is required"
    } else if (!/^\d{10}$/.test(newUserForm.mobile.replace(/\D/g, ''))) {
      errors.mobile = "Mobile must be 10 digits"
    }
    if (!newUserForm.role) {
      errors.role = "Role is required"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

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
    setFormErrors({})
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

  const getActiveFilterCount = () => {
    let count = 0
    if (roleFilter !== "all") count++
    if (statusFilter !== "all") count++
    if (fromDate) count++
    if (toDate) count++
    return count
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">User Management </h1>
          <p className="text-sm text-muted-foreground">Manage MGL portal users and access control</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          <Download className="w-4 h-4" />
          Export
        </button>
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

      {/* Search Row */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or emp ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted relative">
          <Filter className="w-4 h-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          + Add User
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
              <label className="text-xs font-medium text-muted-foreground">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
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
                className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
              >
                <option value="all">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
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
                setRoleFilter("all")
                setStatusFilter("all")
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
        <div className="fixed bottom-0 right-0 top-0 z-50 w-96 bg-card h-full overflow-y-auto shadow-xl border-l border-border">
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
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Personal Info</h3>
                <div className="space-y-3">
                  <div><label className="text-sm font-medium">Name <span className="text-red-500">*</span></label><input className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" value={newUserForm.name} onChange={e => { setNewUserForm(f => ({...f, name: e.target.value})); setFormErrors(prev => ({...prev, name: ''})) }} placeholder="Full name" />{formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}</div>
                  <div><label className="text-sm font-medium">Employee ID <span className="text-red-500">*</span></label><input className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" value={newUserForm.empId} onChange={e => { setNewUserForm(f => ({...f, empId: e.target.value})); setFormErrors(prev => ({...prev, empId: ''})) }} placeholder="Employee ID" />{formErrors.empId && <p className="text-xs text-red-500 mt-1">{formErrors.empId}</p>}</div>
                  <div><label className="text-sm font-medium">Email</label><input type="email" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" value={newUserForm.email} onChange={e => setNewUserForm(f => ({...f, email: e.target.value}))} placeholder="email@mahanagargas.com" /></div>
                  <div><label className="text-sm font-medium">Mobile <span className="text-red-500">*</span></label><input type="tel" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" value={newUserForm.mobile} onChange={e => { setNewUserForm(f => ({...f, mobile: e.target.value})); setFormErrors(prev => ({...prev, mobile: ''})) }} placeholder="10-digit mobile number" />{formErrors.mobile && <p className="text-xs text-red-500 mt-1">{formErrors.mobile}</p>}</div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Role & Access</h3>
                <div className="space-y-3">
                  <div><label className="text-sm font-medium">Role <span className="text-red-500">*</span></label><select className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm" value={newUserForm.role} onChange={e => { setNewUserForm(f => ({...f, role: e.target.value})); setFormErrors(prev => ({...prev, role: ''})) }}><option value="">Select Role</option><option value="ZIC">ZIC</option><option value="MIC">MIC</option><option value="Admin">Admin</option></select>{formErrors.role && <p className="text-xs text-red-500 mt-1">{formErrors.role}</p>}</div>
                  <div><label className="text-sm font-medium">Mapping</label><input className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" value={newUserForm.mapping} onChange={e => setNewUserForm(f => ({...f, mapping: e.target.value}))} placeholder="Region / Zone / NA" /></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Location & Department</h3>
                <div className="space-y-3">
                  <div><label className="text-sm font-medium">State</label><select className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm" value={newUserForm.state} onChange={e => setNewUserForm(f => ({...f, state: e.target.value}))}><option value="">Select State</option><option>Maharashtra</option><option>Delhi</option><option>Karnataka</option><option>Tamil Nadu</option><option>Gujarat</option><option>Rajasthan</option><option>Uttar Pradesh</option><option>West Bengal</option><option>Telangana</option><option>Kerala</option><option>Punjab</option><option>Haryana</option><option>Madhya Pradesh</option><option>Bihar</option><option>Odisha</option><option>Other</option></select></div>
                  <div><label className="text-sm font-medium">City</label><input className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" value={newUserForm.city} onChange={e => setNewUserForm(f => ({...f, city: e.target.value}))} placeholder="City" /></div>
                  <div><label className="text-sm font-medium">Department</label><input className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" value={newUserForm.department} onChange={e => setNewUserForm(f => ({...f, department: e.target.value}))} placeholder="Department" /></div>
                  <div><label className="text-sm font-medium">Branch</label><input className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" value={newUserForm.branch} onChange={e => setNewUserForm(f => ({...f, branch: e.target.value}))} placeholder="Branch" /></div>
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
