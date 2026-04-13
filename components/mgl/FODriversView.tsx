"use client"
import React, { useState } from "react"
import { Search, Plus, User, Car, Shield, Copy, CheckCircle, AlertCircle, X, RefreshCw, ChevronRight, Clock, MapPin, Calendar } from "lucide-react"
import {
  mockDrivers, mockVehicles, mockDriverVehicleBindings,
  type Driver, type DriverVehicleBinding
} from "@/lib/mgl-data"
import { RightTray, TraySection, TrayRow, TrayDivider } from "./shared/RightTray"

const myDrivers = mockDrivers.filter((d: Driver) => d.foId === "FO001")
const myVehicles = mockVehicles.filter(v => v.foId === "FO001" && v.status === "CARD_ACTIVE")

const AUTH_MODES = {
  vehicle_linked: { label: "Vehicle-linked", color: "bg-green-100 text-green-700", icon: "🔗" },
  shift_based: { label: "Shift-based", color: "bg-amber-100 text-amber-700", icon: "🕐" },
  trip_linked: { label: "Trip-linked", color: "bg-blue-100 text-blue-700", icon: "🗺️" },
  VEHICLE_LINKED: { label: "Vehicle-linked", color: "bg-green-100 text-green-700", icon: "🔗" },
  SHIFT_BASED: { label: "Shift-based", color: "bg-amber-100 text-amber-700", icon: "🕐" },
  TRIP_LINKED: { label: "Trip-linked", color: "bg-blue-100 text-blue-700", icon: "🗺️" },
}

const BINDING_STATES = {
  PENDING_ACCEPTANCE: { label: "Awaiting acceptance", color: "bg-amber-100 text-amber-700" },
  ACCEPTED_PENDING_START: { label: "Accepted · starts", color: "bg-blue-100 text-blue-700" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  SUSPENDED: { label: "Suspended", color: "bg-red-100 text-red-700" },
  REVOKED: { label: "Revoked", color: "bg-gray-100 text-gray-700" },
  EXPIRED: { label: "Expired", color: "bg-gray-100 text-gray-700" },
}

function normaliseAuthMode(mode: string): keyof typeof AUTH_MODES {
  const lower = mode?.toLowerCase?.()
  if (lower === "vehicle_linked") return "vehicle_linked"
  if (lower === "shift_based") return "shift_based"
  if (lower === "trip_linked") return "trip_linked"
  return "vehicle_linked"
}

const generateInviteCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({ length: 6 }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join("")
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
  const [showAddDriverModal, setShowAddDriverModal] = useState(false)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const [newDriverInviteCode, setNewDriverInviteCode] = useState("")
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
        <button onClick={() => setShowAddDriverModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
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
                    <span className={`px-2 py-1 rounded text-xs font-medium ${AUTH_MODES[normaliseAuthMode(activeBindings[0].authMode)]?.color ?? "bg-gray-100 text-gray-700"}`}>
                      {AUTH_MODES[normaliseAuthMode(activeBindings[0].authMode)]?.label ?? activeBindings[0].authMode}
                    </span>
                  </div>
                ) : (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">{activeBindings.length} vehicles</span>
                )}
                {/* Invite code row */}
                {driver.inviteCodeUsed === false ? (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">Invite pending</span>
                    <span className="font-mono text-xs font-semibold text-foreground">{driver.inviteCode}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(driver.inviteCode || "")
                        alert("Code copied!")
                      }}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ) : driver.inviteCodeUsed === true ? (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Registered</span>
                  </div>
                ) : null}
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
        <RightTray
          open={!!selectedDriver}
          onClose={() => setSelectedDriver(null)}
          title={selectedDriver.name}
          subtitle={selectedDriver.phone}
          badge={
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedDriver.status === "ACTIVE" || selectedDriver.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {selectedDriver.status === "ACTIVE" || selectedDriver.status === "active" ? "Active" : "Inactive"}
            </span>
          }
          headerActions={
            <button
              onClick={() => { setShowAssignModal(true); setAssignStep(1); }}
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200"
            >
              <Plus className="w-3 h-3 inline mr-1" /> Assign
            </button>
          }
        >
          {/* Tabs */}
          {(() => {
            const tabs = [
              {
                id: "details",
                label: "Details",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )
              },
              {
                id: "vehicles",
                label: "Vehicles",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 17h2c1.1 0 2-.9 2-2v-4l-3-5H4L1 11v4c0 1.1.9 2 2 2h2"/>
                    <circle cx="7" cy="17" r="2"/>
                    <circle cx="17" cy="17" r="2"/>
                    <path d="M9 17h6"/>
                  </svg>
                )
              },
              {
                id: "pairing",
                label: "Pairing",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <path d="M14 14h3v3M17 20v1M20 14v3M20 20h1"/>
                  </svg>
                )
              },
              {
                id: "policy",
                label: "Policy",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                )
              },
            ]

            return (
              <div className="flex border-b border-border -mx-4 px-4 overflow-x-auto sticky top-0 bg-card">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as typeof detailTab)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[11px] font-medium transition-colors border-b-2 -mb-px ${
                      detailTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )
          })()}

          {/* Details Tab */}
          {detailTab === "details" && selectedDriver && (
            <div className="space-y-4 mt-4 pt-2">
              <TraySection title="Personal Information">
                <TrayRow label="Full name" value={selectedDriver.name} />
                <TrayRow label="Phone" value={selectedDriver.phone || "—"} />
                <TrayRow label="Email" value={selectedDriver.email || "—"} />
              </TraySection>

              <TraySection title="License Details">
                <TrayRow label="License Number" value={selectedDriver.licenseNumber || "—"} mono />
                <TrayRow label="Expires" value={selectedDriver.licenseExpiry || "—"} />
              </TraySection>

              <TraySection title="Account">
                <TrayRow label="Created" value={new Date(selectedDriver.createdAt).toLocaleDateString()} />
                <TrayRow label="Status" value={selectedDriver.status} />
              </TraySection>

              {/* Invite Code Section */}
              {selectedDriver.inviteCode && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-amber-900">Invite Code</p>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="font-mono text-lg font-bold tracking-widest text-foreground">
                      {selectedDriver.inviteCode}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Expires: {selectedDriver.inviteCodeExpiry || "No expiry"}
                    </div>
                  </div>
                  {selectedDriver.inviteCodeUsed === false && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedDriver.inviteCode || "")
                        alert("Code copied!")
                      }}
                      className="w-full px-2 py-1.5 bg-amber-100 text-amber-700 rounded text-xs font-medium hover:bg-amber-200"
                    >
                      <Copy className="w-3 h-3 inline mr-1" /> Copy Code
                    </button>
                  )}
                  {selectedDriver.inviteCodeUsed === true && (
                    <p className="text-xs text-green-700 font-medium">✓ Code used · Driver registered</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Vehicles Tab */}
          {detailTab === "vehicles" && selectedDriver && (
            <div className="space-y-3 mt-4 pt-2">
              {getDriverBindings(selectedDriver.id).length === 0 ? (
                <div className="text-center py-8">
                  <Car className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No vehicles assigned</p>
                  <button
                    onClick={() => { setShowAssignModal(true); setAssignStep(1); }}
                    className="mt-3 px-3 py-1.5 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200"
                  >
                    <Plus className="w-3 h-3 inline mr-1" /> Assign Vehicle
                  </button>
                </div>
              ) : (
                getDriverBindings(selectedDriver.id).map((binding: DriverVehicleBinding) => {
                  const vehicle = myVehicles.find(v => v.id === binding.vehicleId)
                  const stateBadge = BINDING_STATES[binding.state as keyof typeof BINDING_STATES] ?? { label: binding.state, color: "bg-gray-100 text-gray-700" }
                  
                  // Parse date safely
                  let pairedDateStr = "—"
                  try {
                    const dateObj = new Date(binding.activatedAt || binding.createdAt)
                    if (!isNaN(dateObj.getTime())) {
                      pairedDateStr = dateObj.toLocaleDateString()
                    }
                  } catch (e) {
                    pairedDateStr = "—"
                  }

                  return (
                    <TraySection key={binding.id} title={vehicle?.vehicleNumber || "Unknown Vehicle"}>
                      <TrayRow label="Auth Mode" value={AUTH_MODES[normaliseAuthMode(binding.authMode)]?.label ?? binding.authMode} />
                      <TrayDivider />
                      <TrayRow label="State" value={stateBadge?.label ?? binding.state} />
                      <TrayDivider />
                      <TrayRow label="Paired" value={pairedDateStr} />
                    </TraySection>
                  )
                })
              )}
            </div>
          )}

          {/* Pairing Tab */}
          {detailTab === "pairing" && selectedDriver && (
            <div className="space-y-4 mt-4 pt-2">
              <TraySection title="Pairing Code">
                {selectedDriver.pairingCode ? (
                  <>
                    <div className="bg-gray-100 rounded-lg p-3 text-center mb-2">
                      <div className="font-mono text-2xl font-bold tracking-widest text-foreground">
                        {selectedDriver.pairingCode}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Expires: {selectedDriver.pairingCodeExpiry ?? "No expiry"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedDriver.pairingCode || "")
                        alert("Copied!")
                      }}
                      className="w-full px-2 py-1.5 bg-muted hover:bg-muted/80 rounded text-xs font-medium"
                    >
                      Copy code
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">No pairing code generated</p>
                )}
              </TraySection>

              <TraySection title="Policy">
                <TrayRow label="Code Type" value={selectedDriver.pairingPolicy?.codeType || "—"} />
                <TrayRow label="Expiry" value={`${selectedDriver.pairingPolicy?.expiryHours || 24}h`} />
                <TrayRow label="Max Uses" value={selectedDriver.pairingPolicy?.maxUsesPerCode === null ? "Unlimited" : selectedDriver.pairingPolicy?.maxUsesPerCode ?? 1} />
                <TrayRow label="Auto-invalidate" value={selectedDriver.pairingPolicy?.repairingTrigger || "never"} />
              </TraySection>
            </div>
          )}

          {/* Policy Tab */}
          {detailTab === "policy" && selectedDriver && (
            <div className="space-y-4 mt-4 pt-2">
              <TraySection title="Pairing Policy Settings">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground mb-2">Code Expiry Window</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["2h", "24h", "72h", "7d", "No expiry"].map((option) => (
                        <span key={option} className={`px-2 py-1 rounded text-xs font-medium ${
                          (selectedDriver.pairingPolicy?.expiryHours === (option === "2h" ? 2 : option === "24h" ? 24 : option === "72h" ? 72 : option === "7d" ? 168 : null) ||
                            (option === "No expiry" && selectedDriver.pairingPolicy?.expiryHours === null))
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-foreground mb-2">Max Uses</p>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {selectedDriver.pairingPolicy?.maxUsesPerCode === null ? "Unlimited" : selectedDriver.pairingPolicy?.maxUsesPerCode ?? 1}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-foreground mb-2">Security Level</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedDriver.pairingPolicy?.maxUsesPerCode === 1 && (selectedDriver.pairingPolicy?.expiryHours === null || selectedDriver.pairingPolicy?.expiryHours && selectedDriver.pairingPolicy?.expiryHours > 24)
                        ? "bg-green-100 text-green-700"
                        : selectedDriver.pairingPolicy?.expiryHours && selectedDriver.pairingPolicy?.expiryHours <= 72
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {selectedDriver.pairingPolicy?.maxUsesPerCode === 1 && (selectedDriver.pairingPolicy?.expiryHours === null || selectedDriver.pairingPolicy?.expiryHours > 24)
                        ? "High"
                        : selectedDriver.pairingPolicy?.expiryHours && selectedDriver.pairingPolicy?.expiryHours <= 72
                        ? "Balanced"
                        : "Open"}
                    </span>
                  </div>
                </div>
              </TraySection>
            </div>
          )}
        </RightTray>
      )}

      {/* Add Driver Modal */}
      {showAddDriverModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => { setShowAddDriverModal(false); setShowSuccessScreen(false); }} />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-xl max-w-md w-full mx-4 p-6">
              {showSuccessScreen ? (
                // Success Screen
                <div className="text-center space-y-6">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Driver added</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedDriver?.name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-2">Invite code</p>
                    <div className="bg-gray-50 border border-border rounded-xl p-4 text-center mb-3">
                      <div className="font-mono text-3xl font-bold tracking-widest text-foreground">
                        {newDriverInviteCode}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Expires in 24 hours · one-time use</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(newDriverInviteCode)
                        alert("Copied!")
                      }}
                      className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted"
                    >
                      Copy code
                    </button>
                    <button
                      onClick={() => {
                        window.open(
                          `https://wa.me/?text=Your MGL Fleet invite code is: ${newDriverInviteCode}. Download the MGL Fleet driver app and enter this code to register. Valid for 24 hours.`,
                          "_blank"
                        )
                      }}
                      className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        window.open(`sms:?body=Your MGL Fleet invite code is: ${newDriverInviteCode}. Download the MGL Fleet driver app to register.`)
                      }}
                      className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted"
                    >
                      SMS
                    </button>
                  </div>

                  <button
                    onClick={() => { setShowAddDriverModal(false); setShowSuccessScreen(false); }}
                    className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Done
                  </button>
                </div>
              ) : (
                // Add Driver Form
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Add Driver</h3>
                  
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Driver Name</label>
                    <input type="text" placeholder="Enter driver name" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" id="driverName" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Mobile Number</label>
                    <input type="tel" placeholder="Enter mobile number" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" id="driverPhone" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">License Number</label>
                    <input type="text" placeholder="Enter license number" className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-card" id="driverLicense" />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowAddDriverModal(false); }}
                      className="flex-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const nameInput = (document.getElementById("driverName") as HTMLInputElement)?.value
                        if (!nameInput) {
                          alert("Please enter driver name")
                          return
                        }
                        const newCode = generateInviteCode()
                        const newDriver: Driver = {
                          id: `DRV${Math.random().toString().slice(2, 5)}`,
                          foId: "FO001",
                          name: nameInput,
                          phone: (document.getElementById("driverPhone") as HTMLInputElement)?.value,
                          licenseNumber: (document.getElementById("driverLicense") as HTMLInputElement)?.value,
                          status: "ACTIVE",
                          assignedVehicleIds: [],
                          pairingCode: "",
                          createdAt: new Date().toISOString(),
                          pairingPolicy: { level: "platform" as const, codeType: "single_use", expiryHours: 24, maxUsesPerCode: 1 },
                          inviteCode: newCode,
                          inviteCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          inviteCodeUsed: false,
                        }
                        setSelectedDriver(newDriver)
                        setNewDriverInviteCode(newCode)
                        setShowSuccessScreen(true)
                      }}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                      Save & Generate Code
                    </button>
                  </div>
                </div>
              )}
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
