"use client"
import React, { useState } from "react"
import { Search, Plus, User, Car, Shield, Copy, CheckCircle, AlertCircle, X, RefreshCw, ChevronRight, Clock, MapPin, Calendar } from "lucide-react"
import {
  mockDrivers, mockVehicles, mockDriverVehicleBindings,
  type Driver, type DriverVehicleBinding
} from "@/lib/mgl-data"

const myDrivers = mockDrivers.filter((d: Driver) => d.foId === "FO001")
const myVehicles = mockVehicles.filter(v => v.foId === "FO001" && v.status === "CARD_ACTIVE")

const AUTH_MODES = {
  vehicle_linked: { label: "Vehicle-linked", color: "bg-green-100 text-green-700", icon: "🔗" },
  shift_based: { label: "Shift-based", color: "bg-amber-100 text-amber-700", icon: "🕐" },
  trip_linked: { label: "Trip-linked", color: "bg-blue-100 text-blue-700", icon: "🗺️" },
}

const BINDING_STATES = {
  PENDING_ACCEPTANCE: { label: "Awaiting acceptance", color: "bg-amber-100 text-amber-700" },
  ACCEPTED_PENDING_START: { label: "Accepted · starts", color: "bg-blue-100 text-blue-700" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  SUSPENDED: { label: "Suspended", color: "bg-red-100 text-red-700" },
  REVOKED: { label: "Revoked", color: "bg-gray-100 text-gray-700" },
  EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-700" },
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <p className="font-bold text-red-700 mb-2">Driver page crash:</p>
          <p className="text-sm font-mono text-red-600">{this.state.error.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}

function FODriversViewInner({ onboardingType = "MIC_ASSISTED" }: { onboardingType?: string }) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unassigned" | "suspended">("all")
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [assignStep, setAssignStep] = useState(1)
  const [bindings, setBindings] = useState<DriverVehicleBinding[]>(mockDriverVehicleBindings ?? [])
  const [detailTab, setDetailTab] = useState<"details" | "vehicles" | "pairing" | "policy">("vehicles")

  // Assign flow state
  const [assignForm, setAssignForm] = useState({
    vehicleId: "",
    authMode: "vehicle_linked" as "vehicle_linked" | "shift_based" | "trip_linked",
    shifts: [{ days: [], start: "06:00", end: "14:00" }],
    trip: { date: "", start: "", end: "", origin: "", destination: "", notes: "" },
  })

  const getDriverBindings = (driverId: string) =>
    (bindings ?? []).filter(b => b.driverId === driverId)

  const getActiveBindingCount = (driverId: string) =>
    getDriverBindings(driverId).filter(b => b.state === "ACTIVE").length

  const getPendingBindingCount = () =>
    bindings.filter(b => b.state === "PENDING_ACCEPTANCE").length

  const stats = {
    total: myDrivers.length,
    activeBindings: bindings.filter(b => b.state === "ACTIVE").length,
    unassigned: myDrivers.filter(d => getActiveBindingCount(d.id) === 0).length,
    pendingAcceptance: getPendingBindingCount(),
  }

  const filteredDrivers = myDrivers.filter((d: Driver) => {
    const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || (d.phone || "").includes(search)
    const activeCount = getActiveBindingCount(d.id)
    
    if (statusFilter === "active") return matchesSearch && d.status === "ACTIVE"
    if (statusFilter === "unassigned") return matchesSearch && activeCount === 0
    if (statusFilter === "suspended") return matchesSearch && d.status === "SUSPENDED"
    return matchesSearch
  })

  const handleAssignVehicle = () => {
    if (!selectedDriver || !assignForm.vehicleId) return
    
    const newBinding: DriverVehicleBinding = {
      id: `BND${Date.now()}`,
      driverId: selectedDriver.id,
      vehicleId: assignForm.vehicleId,
      authMode: assignForm.authMode,
      state: "PENDING_ACCEPTANCE",
      createdAt: new Date().toISOString(),
      ...(assignForm.authMode === "shift_based" && { shifts: assignForm.shifts }),
      ...(assignForm.authMode === "trip_linked" && { trip: assignForm.trip }),
    }
    
    setBindings([...bindings, newBinding])
    setShowAssignModal(false)
    setAssignStep(1)
    setAssignForm({
      vehicleId: "",
      authMode: "vehicle_linked",
      shifts: [{ days: [], start: "06:00", end: "14:00" }],
      trip: { date: "", start: "", end: "", origin: "", destination: "", notes: "" },
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Drivers</h2>
        <button onClick={() => { setSelectedDriver(null); setShowAssignModal(false); }} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
          <Plus className="w-4 h-4 inline mr-1" /> Add Driver
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground font-medium">Total Drivers</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground font-medium">Active Bindings</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeBindings}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground font-medium">Unassigned</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.unassigned}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground font-medium">Pending Acceptance</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.pendingAcceptance}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, mobile, or VRN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "unassigned", "suspended"] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Driver Cards */}
      <div className="space-y-3">
        {filteredDrivers.map((driver: Driver) => {
          const driverBindings = getDriverBindings(driver.id)
          const activeBindings = driverBindings.filter(b => b.state === "ACTIVE")
          
          return (
            <div
              key={driver.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/40 cursor-pointer"
              onClick={() => { setSelectedDriver(driver); setDetailTab("vehicles") }}
            >
              {/* Left: Avatar & Info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{driver.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{driver.name}</p>
                  <p className="text-xs text-muted-foreground">{driver.phone || "—"} · {driver.id}</p>
                </div>
              </div>

              {/* Center: Vehicles */}
              <div className="flex-1 mx-4">
                {activeBindings.length === 0 ? (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">Unassigned</span>
                ) : activeBindings.length === 1 ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{myVehicles.find(v => v.id === activeBindings[0].vehicleId)?.vehicleNumber || "—"}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${AUTH_MODES[activeBindings[0].authMode as keyof typeof AUTH_MODES]?.color ?? "bg-gray-100 text-gray-700"}`}>
                      {AUTH_MODES[activeBindings[0].authMode as keyof typeof AUTH_MODES]?.label ?? activeBindings[0].authMode}}
                    </span>
                  </div>
                ) : (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">{activeBindings.length} vehicles</span>
                )}
              </div>

              {/* Right: Status & Chevron */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  driver.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {driver.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Tray */}
      {selectedDriver && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedDriver(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto">
            {/* Tray Header */}
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{selectedDriver.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedDriver.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedDriver.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {selectedDriver.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedDriver(null)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-6 border-b border-border">
              <button
                onClick={() => { setShowAssignModal(true); setAssignStep(1); }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                <Plus className="w-4 h-4 inline mr-1" /> Assign Vehicle
              </button>
              <button className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
                {selectedDriver.status === "ACTIVE" ? "Suspend" : "Reactivate"} Driver
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border sticky top-20 bg-card">
              {(["details", "vehicles", "pairing", "policy"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    detailTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-4">
              {detailTab === "details" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Name</label>
                    <p className="text-foreground">{selectedDriver.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Mobile</label>
                    <p className="text-foreground">{selectedDriver.phone || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">License Number</label>
                    <p className="text-foreground">{selectedDriver.licenseNumber || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">License Expiry</label>
                    <p className="text-foreground">{selectedDriver.licenseExpiry || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Driver ID</label>
                    <p className="text-foreground">{selectedDriver.id}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Registered</label>
                    <p className="text-foreground">{new Date(selectedDriver.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {detailTab === "vehicles" && (
                <div className="space-y-4">
                  {getDriverBindings(selectedDriver.id).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No vehicle assignments yet</p>
                      <button
                        onClick={() => { setShowAssignModal(true); setAssignStep(1); }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 inline mr-1" /> Assign Vehicle
                      </button>
                    </div>
                  ) : (
                    getDriverBindings(selectedDriver.id).map((binding: DriverVehicleBinding) => {
                      const vehicle = myVehicles.find(v => v.id === binding.vehicleId)
                      const stateBadge = BINDING_STATES[binding.state as keyof typeof BINDING_STATES] ?? { label: binding.state, color: "bg-gray-100 text-gray-700" }
                      
                      return (
                        <div key={binding.id} className="border border-border rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-foreground">{vehicle?.vehicleNumber || "—"}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${AUTH_MODES[binding.authMode as keyof typeof AUTH_MODES]?.color ?? "bg-gray-100 text-gray-700"}`}>
                                {AUTH_MODES[binding.authMode as keyof typeof AUTH_MODES]?.label ?? binding.authMode}}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded text-xs font-medium ${stateBadge?.color ?? "bg-gray-100 text-gray-700"}`}>
                              {stateBadge?.label ?? binding.state}
                            </span>
                          </div>

                          {binding.authMode === "shift_based" && binding.shifts && (
                            <div className="bg-muted/30 rounded p-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-2">Shift Schedule</p>
                              {binding.shifts.map((shift, idx) => (
                                <div key={idx} className="flex gap-2 text-sm mb-1">
                                  <span>{shift.days.join(", ")}</span>
                                  <span>{shift.start} – {shift.end}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {binding.authMode === "trip_linked" && binding.trip && (
                            <div className="bg-muted/30 rounded p-3 space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground">Trip Details</p>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{binding.trip.origin} → {binding.trip.destination}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{binding.trip.date} {binding.trip.start}–{binding.trip.end}</span>
                              </div>
                              {binding.trip.notes && <p className="text-xs text-muted-foreground">{binding.trip.notes}</p>}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 border border-border rounded text-xs font-medium hover:bg-muted">
                              {binding.state === "PENDING_ACCEPTANCE" ? "Resend" : binding.state === "ACTIVE" ? (binding.authMode === "shift_based" ? "Edit Schedule" : binding.authMode === "trip_linked" ? "Extend" : "Suspend") : "Re-assign"}
                            </button>
                            {binding.state !== "REVOKED" && binding.state !== "EXPIRED" && (
                              <button className="flex-1 px-3 py-2 border border-border rounded text-xs font-medium hover:bg-muted">
                                {binding.state === "PENDING_ACCEPTANCE" || binding.state === "ACTIVE" ? "Revoke" : "Suspend"}
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {detailTab === "pairing" && (
                <div className="text-muted-foreground">Pairing tab content</div>
              )}

              {detailTab === "policy" && (
                <div className="text-muted-foreground">Policy tab content</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Assign Vehicle Modal */}
      {showAssignModal && selectedDriver && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowAssignModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-semibold text-foreground">Assign Vehicle</h3>
                <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 pt-4 px-5">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all ${s === assignStep ? "w-8 bg-primary" : s < assignStep ? "w-4 bg-primary/40" : "w-4 bg-muted"}`} />
                ))}
              </div>

              <div className="p-5 space-y-4">
                {assignStep === 1 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Select Vehicle</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {myVehicles.map(v => {
                        const alreadyAssigned = getDriverBindings(selectedDriver.id).some(
                          b => b.vehicleId === v.id && ["ACTIVE", "PENDING_ACCEPTANCE"].includes(b.state)
                        )
                        return (
                          <button
                            key={v.id}
                            onClick={() => setAssignForm(f => ({ ...f, vehicleId: v.id }))}
                            disabled={alreadyAssigned}
                            className={`w-full p-3 rounded-lg border text-left text-sm transition-colors ${
                              assignForm.vehicleId === v.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40"
                            } ${alreadyAssigned ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">{v.vehicleNumber}</p>
                                <p className="text-xs text-muted-foreground">{v.category}</p>
                              </div>
                              {alreadyAssigned && <span className="text-xs text-muted-foreground">Already assigned</span>}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : assignStep === 2 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Auth Mode</p>
                    {(["vehicle_linked", "shift_based", "trip_linked"] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => setAssignForm(f => ({ ...f, authMode: mode }))}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          assignForm.authMode === mode ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <p className="font-semibold text-sm">
                          {mode === "vehicle_linked" ? "🔗 Vehicle-linked" : mode === "shift_based" ? "🕐 Shift-based" : "🗺️ Trip-linked"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {mode === "vehicle_linked" ? "Permanent assignment until you revoke it"
                            : mode === "shift_based" ? "Driver can only fuel during configured shifts"
                            : "One-time assignment for a specific trip"}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Confirm & Generate</p>
                    <div className="bg-muted/30 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Driver</span>
                        <span className="font-medium">{selectedDriver.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vehicle</span>
                        <span className="font-medium">{myVehicles.find(v => v.id === assignForm.vehicleId)?.vehicleNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Auth Mode</span>
                        <span className="font-medium">{AUTH_MODES[assignForm.authMode].label}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-5 border-t border-border">
                {assignStep > 1 && (
                  <button
                    onClick={() => setAssignStep(s => s - 1)}
                    className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    Back
                  </button>
                )}
                {assignStep < 3 ? (
                  <button
                    onClick={() => setAssignStep(s => s + 1)}
                    disabled={assignStep === 1 && !assignForm.vehicleId}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleAssignVehicle}
                    className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                  >
                    Assign Vehicle
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function FODriversView(props: any) {
  return (
    <ErrorBoundary>
      <FODriversViewInner {...props} />
    </ErrorBoundary>
  )
}
