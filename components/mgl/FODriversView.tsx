"use client"
import React, { useState, useEffect } from "react"
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
  const [vehicleSearch, setVehicleSearch] = useState("")
  const [bindings, setBindings] = useState<DriverVehicleBinding[]>(mockDriverVehicleBindings ?? [])
  const [localBindings, setLocalBindings] = useState<DriverVehicleBinding[]>(mockDriverVehicleBindings ?? [])
  const [detailTab, setDetailTab] = useState<"details" | "vehicles" | "pairing" | "policy">("vehicles")
  const [unpairConfirm, setUnpairConfirm] = useState<string | null>(null)
  const [draftPolicy, setDraftPolicy] = useState<{
    codeType: string
    expiryHours: number | null
    maxUsesPerCode: number | null
    repairingTrigger: string
  } | null>(null)

  // Assign flow state
  const [assignForm, setAssignForm] = useState({
    vehicleId: "",
    authMode: "vehicle_linked" as "vehicle_linked" | "shift_based" | "trip_linked",
    shifts: [{ days: [], start: "06:00", end: "14:00" }],
    trip: { date: "", start: "", end: "", origin: "", destination: "", notes: "" },
  })

  // Sync draft policy when selected driver changes
  useEffect(() => {
    if (selectedDriver?.pairingPolicy) {
      setDraftPolicy({
        codeType: selectedDriver.pairingPolicy.codeType ?? "single_use",
        expiryHours: selectedDriver.pairingPolicy.expiryHours ?? 24,
        maxUsesPerCode: selectedDriver.pairingPolicy.maxUsesPerCode ?? 1,
        repairingTrigger: selectedDriver.pairingPolicy.repairingTrigger ?? "on_vehicle_change",
      })
    } else {
      setDraftPolicy({
        codeType: "single_use",
        expiryHours: 24,
        maxUsesPerCode: 1,
        repairingTrigger: "on_vehicle_change",
      })
    }
  }, [selectedDriver])

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
    setVehicleSearch("")
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
              {localBindings.filter(b => b.driverId === selectedDriver.id).length === 0 ? (
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
                localBindings.filter(b => b.driverId === selectedDriver.id).map((binding: DriverVehicleBinding) => {
                  const vehicle = myVehicles.find(v => v.id === binding.vehicleId) || mockVehicles.find(v => v.id === binding.vehicleId)
                  const stateBadge = BINDING_STATES[binding.state as keyof typeof BINDING_STATES] ?? { label: binding.state, color: "bg-gray-100 text-gray-700" }
                  const showUnpairButton = ["ACTIVE", "active", "PENDING_ACCEPTANCE", "pending_acceptance"].includes(binding.state)
                  
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
                      {binding.pairingCode && (
                        <>
                          <TrayDivider />
                          <div className="flex items-center justify-between py-2">
                            <span className="text-xs text-muted-foreground">
                              Pairing code
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-foreground tracking-widest bg-muted px-2 py-0.5 rounded">
                                {binding.pairingCode}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                binding.pairingCodeState === "used"
                                  ? "bg-green-50 text-green-700"
                                  : binding.pairingCodeState === "pending"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                {binding.pairingCodeState === "used"
                                  ? "Used"
                                  : binding.pairingCodeState === "pending"
                                  ? "Pending"
                                  : binding.pairingCodeState}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      {showUnpairButton && (
                        <>
                          <TrayDivider />
                          <button
                            onClick={() => setUnpairConfirm(binding.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors w-full justify-center"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                            Unpair
                          </button>
                        </>
                      )}
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
          {detailTab === "policy" && selectedDriver && (() => {
            const expiryOptions = [
              { label: "2h", value: 2 },
              { label: "24h", value: 24 },
              { label: "72h", value: 72 },
              { label: "7 days", value: 168 },
              { label: "No expiry", value: null },
            ]
            const triggerOptions = [
              { id: "on_vehicle_change", label: "On vehicle change", desc: "New code when vehicle changes" },
              { id: "monthly", label: "Monthly", desc: "Auto-regenerates on 1st of month" },
              { id: "manual", label: "Manual only", desc: "FO manually regenerates" },
            ]
            const policy = draftPolicy ?? { codeType: "single_use", expiryHours: 24, maxUsesPerCode: 1, repairingTrigger: "on_vehicle_change" }
            const getRisk = () => {
              if (policy.maxUsesPerCode === 1 && policy.expiryHours && policy.expiryHours <= 24)
                return { label: "High security", color: "bg-green-50 text-green-700 border-green-200" }
              if (policy.maxUsesPerCode === null && policy.expiryHours === null)
                return { label: "Open access", color: "bg-red-50 text-red-700 border-red-200" }
              return { label: "Balanced", color: "bg-amber-50 text-amber-700 border-amber-200" }
            }
            const risk = getRisk()
            const driverBindings = localBindings.filter(b => b.driverId === selectedDriver.id && ["active","ACTIVE","PENDING_ACCEPTANCE","pending_acceptance"].includes(b.state))
            const [activePolicyMode, setActivePolicyMode] = React.useState<"vehicle_linked"|"shift_based"|"trip_linked"|"pairing_code">("vehicle_linked")
            return (
              <div className="space-y-4 mt-4">
                {/* Mode selector */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "vehicle_linked", label: "Vehicle-linked" },
                    { id: "shift_based", label: "Shift-based" },
                    { id: "trip_linked", label: "Trip-linked" },
                    { id: "pairing_code", label: "Code override" },
                  ].map(mode => (
                    <button key={mode.id}
                      onClick={() => { setActivePolicyMode(mode.id as any); setDraftPolicy({ codeType: "single_use", expiryHours: 24, maxUsesPerCode: 1, repairingTrigger: "on_vehicle_change" }) }}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${activePolicyMode === mode.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {mode.label}
                    </button>
                  ))}
                </div>
                {/* Description */}
                <div className="px-3 py-2 rounded-xl border text-xs bg-blue-50 border-blue-200 text-blue-700">
                  {activePolicyMode === "vehicle_linked" && "Default policy for all vehicle-linked assignments."}
                  {activePolicyMode === "shift_based" && "Default policy for shift-based assignments."}
                  {activePolicyMode === "trip_linked" && "Default policy for trip-linked assignments."}
                  {activePolicyMode === "pairing_code" && "Override policy for a specific pairing code."}
                </div>
                {/* Pairing code selector */}
                {activePolicyMode === "pairing_code" && (
                  <TraySection title="Active Bindings">
                    {driverBindings.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">No active bindings. Assign a vehicle first.</p>
                    ) : (
                      <div className="space-y-2 pt-1">
                        {driverBindings.map(b => {
                          const v = myVehicles.find(v => v.id === b.vehicleId) || mockVehicles.find(v => v.id === b.vehicleId)
                          return (
                            <div key={b.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                              <div>
                                <p className="font-mono font-bold text-sm tracking-widest">{b.pairingCode ?? "—"}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{v?.vehicleNumber ?? b.vehicleId}</p>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.pairingCodeState === "used" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                                {b.pairingCodeState ?? "pending"}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </TraySection>
                )}
                {/* Risk */}
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs ${risk.color}`}>
                  <span className="font-semibold">{risk.label}</span>
                  <span>{activePolicyMode === "pairing_code" ? "Code override" : "Auth mode default"}</span>
                </div>
                {/* Code type */}
                <TraySection title="Code Type">
                  <div className="flex gap-2 pt-1">
                    {[{ id: "single_use", label: "Single use", desc: "One fueling per code" }, { id: "multi_use", label: "Multi use", desc: "Reusable until expiry" }].map(opt => (
                      <button key={opt.id} onClick={() => setDraftPolicy(p => p ? { ...p, codeType: opt.id as any, maxUsesPerCode: opt.id === "single_use" ? 1 : p.maxUsesPerCode } : p)}
                        className={`flex-1 p-3 rounded-xl border text-left transition-all ${policy.codeType === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                        <p className="text-xs font-semibold">{opt.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </TraySection>
                {/* Expiry */}
                <TraySection title="Code Expiry">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {expiryOptions.map(opt => (
                      <button key={String(opt.value)} onClick={() => setDraftPolicy(p => p ? { ...p, expiryHours: opt.value } : p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${policy.expiryHours === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </TraySection>
                {/* Max uses */}
                <TraySection title="Max Uses Per Code">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[1, 3, 5, 10, null].map(n => (
                      <button key={String(n)} disabled={policy.codeType === "single_use" && n !== 1}
                        onClick={() => setDraftPolicy(p => p ? { ...p, maxUsesPerCode: n } : p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${policy.maxUsesPerCode === n ? "bg-primary text-primary-foreground border-primary" : policy.codeType === "single_use" && n !== 1 ? "opacity-30 cursor-not-allowed border-border" : "bg-background border-border hover:border-primary/50"}`}>
                        {n === null ? "Unlimited" : n}
                      </button>
                    ))}
                  </div>
                </TraySection>
                {/* Trigger */}
                <TraySection title="Re-pairing Trigger">
                  <div className="space-y-2 pt-1">
                    {triggerOptions.map(opt => (
                      <button key={opt.id} onClick={() => setDraftPolicy(p => p ? { ...p, repairingTrigger: opt.id } : p)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${policy.repairingTrigger === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                        </div>
                        {policy.repairingTrigger === opt.id && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </TraySection>
                {/* Save */}
                <button onClick={() => { if (selectedDriver && draftPolicy) { selectedDriver.pairingPolicy = { ...selectedDriver.pairingPolicy, ...draftPolicy } as any } }}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-all">
                  Save Policy
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  {activePolicyMode === "pairing_code" ? "Overrides fleet policy for this pairing code only" : "Applies to all vehicles using this auth mode"}
                </p>
              </div>
            )
          })()}
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

      {/* Assign Vehicle Modal */}
      {showAssignModal && selectedDriver && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => {
              setShowAssignModal(false)
              setVehicleSearch("")
            }}
          />

          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-xl border border-border w-[480px] z-50 max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h3 className="font-semibold text-base">
                  Assign Vehicle
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedDriver.name} · Step {assignStep} of 3
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setVehicleSearch("")
                }}
                className="p-1.5 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="flex items-center px-5 pt-4 gap-2">
              {["Select Vehicle", "Auth Mode", "Review"].map(
                (label, i) => (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                        assignStep > i + 1 
                          ? "bg-primary text-primary-foreground"
                          : assignStep === i + 1
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {assignStep > i + 1 ? "✓" : i + 1}
                      </div>
                      <span className={`text-xs font-medium ${
                        assignStep === i + 1 
                          ? "text-foreground" 
                          : "text-muted-foreground"
                      }`}>
                        {label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className={`flex-1 h-px ${
                        assignStep > i + 1 
                          ? "bg-primary" 
                          : "bg-border"
                      }`} />
                    )}
                  </React.Fragment>
                )
              )}
            </div>

            {/* Step content */}
            <div className="p-5">

              {/* STEP 1: Select Vehicle */}
              {assignStep === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Select a vehicle to assign to{" "}
                    <span className="font-medium text-foreground">
                      {selectedDriver.name}
                    </span>
                  </p>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search by vehicle number or model..."
                      value={vehicleSearch}
                      onChange={e => setVehicleSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm bg-background"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {myVehicles
                      .filter(v => {
                        if (!vehicleSearch) return true
                        const q = vehicleSearch.toLowerCase()
                        return v.vehicleNumber.toLowerCase().includes(q) || 
                          v.model.toLowerCase().includes(q) ||
                          v.category.toLowerCase().includes(q)
                      })
                      .map(v => {
                      const alreadyAssigned = 
                        localBindings.some(b => 
                          b.vehicleId === v.id && 
                          b.driverId === selectedDriver.id &&
                          ["active","ACTIVE",
                           "PENDING_ACCEPTANCE",
                           "pending_acceptance"]
                            .includes(b.state))
                      return (
                        <button
                          key={v.id}
                          disabled={alreadyAssigned}
                          onClick={() => setAssignForm(
                            f => ({...f, vehicleId: v.id})
                          )}
                          className={`w-full p-3 rounded-xl border text-left transition-all ${
                            alreadyAssigned 
                              ? "opacity-40 cursor-not-allowed border-border bg-muted"
                              : assignForm.vehicleId === v.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 bg-card"
                          }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono font-semibold text-sm">
                                {v.vehicleNumber}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {v.model} · {v.category}
                              </p>
                            </div>
                            {alreadyAssigned && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                Already assigned
                              </span>
                            )}
                            {assignForm.vehicleId === v.id && 
                              !alreadyAssigned && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <svg width="10" height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Auth Mode */}
              {assignStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose how this driver is authorised 
                    to fuel this vehicle
                  </p>

                  {/* Auth mode cards */}
                  <div className="space-y-2">
                    {[
                      {
                        id: "vehicle_linked",
                        label: "Vehicle-linked",
                        desc: "Driver can fuel at any time",
                        icon: (
                          <svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" 
                            strokeWidth="2">
                            <path d="M19 17h2c1.1 0 2-.9 2-2v-4l-3-5H4L1 11v4c0 1.1.9 2 2 2h2"/>
                            <circle cx="7" cy="17" r="2"/>
                            <circle cx="17" cy="17" r="2"/>
                          </svg>
                        )
                      },
                      {
                        id: "shift_based",
                        label: "Shift-based",
                        desc: "Driver can fuel within shift hours",
                        icon: (
                          <svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                          </svg>
                        )
                      },
                      {
                        id: "trip_linked",
                        label: "Trip-linked",
                        desc: "Driver can fuel for a single trip window",
                        icon: (
                          <svg width="16" height="16"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor"
                            strokeWidth="2">
                            <circle cx="12" cy="10" r="3"/>
                            <path d="M12 2a8 8 0 00-8 8c0 5.4 7 12 8 12s8-6.6 8-12a8 8 0 00-8-8z"/>
                          </svg>
                        )
                      },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setAssignForm(
                          f => ({...f, authMode: mode.id as any})
                        )}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                          assignForm.authMode === mode.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          assignForm.authMode === mode.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {mode.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {mode.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {mode.desc}
                          </p>
                        </div>
                        {assignForm.authMode === mode.id && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <svg width="10" height="10"
                              viewBox="0 0 24 24" fill="none"
                              stroke="white" strokeWidth="3">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Shift schedule inputs */}
                  {assignForm.authMode === "shift_based" && (
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Shift Schedule
                      </p>
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">
                          Working days
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => {
                            const selected = (assignForm.shifts[0].days as string[]).includes(day)
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  const currentDays = assignForm.shifts[0].days as string[]
                                  const newDays = selected
                                    ? currentDays.filter(d => d !== day)
                                    : [...currentDays, day]
                                  setAssignForm(f => ({
                                    ...f,
                                    shifts: [{
                                      ...f.shifts[0],
                                      days: newDays
                                    }]
                                  }))
                                }}
                                className={`w-10 h-10 rounded-lg text-xs font-semibold transition-all border ${
                                  selected
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                                }`}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Start time
                          </label>
                          <input
                            type="time"
                            value={assignForm.shifts[0].start}
                            onChange={e => setAssignForm(f => ({
                              ...f,
                              shifts: [{
                                ...f.shifts[0],
                                start: e.target.value
                              }]
                            }))}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            End time
                          </label>
                          <input
                            type="time"
                            value={assignForm.shifts[0].end}
                            onChange={e => setAssignForm(f => ({
                              ...f,
                              shifts: [{
                                ...f.shifts[0],
                                end: e.target.value
                              }]
                            }))}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trip inputs */}
                  {assignForm.authMode === "trip_linked" && (
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Trip Details
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Date
                          </label>
                          <input type="date"
                            value={assignForm.trip.date}
                            onChange={e => setAssignForm(f => ({
                              ...f, trip: {
                                ...f.trip, 
                                date: e.target.value
                              }
                            }))}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Window start
                          </label>
                          <input type="time"
                            value={assignForm.trip.start}
                            onChange={e => setAssignForm(f => ({
                              ...f, trip: {
                                ...f.trip, 
                                start: e.target.value
                              }
                            }))}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Origin
                          </label>
                          <input type="text"
                            placeholder="e.g. Andheri East"
                            value={assignForm.trip.origin}
                            onChange={e => setAssignForm(f => ({
                              ...f, trip: {
                                ...f.trip, 
                                origin: e.target.value
                              }
                            }))}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">
                            Destination
                          </label>
                          <input type="text"
                            placeholder="e.g. Pune"
                            value={assignForm.trip.destination}
                            onChange={e => setAssignForm(f => ({
                              ...f, trip: {
                                ...f.trip, 
                                destination: e.target.value
                              }
                            }))}
                            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Review */}
              {assignStep === 3 && (() => {
                const vehicle = myVehicles.find(
                  v => v.id === assignForm.vehicleId)
                return (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Review the assignment before confirming
                    </p>
                    <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
                      {[
                        ["Driver", selectedDriver.name],
                        ["Vehicle", vehicle?.vehicleNumber 
                          || assignForm.vehicleId],
                        ["Model", vehicle?.model || "—"],
                        ["Auth mode", 
                          assignForm.authMode === 
                            "vehicle_linked" 
                            ? "Vehicle-linked" 
                            : assignForm.authMode === 
                              "shift_based" 
                            ? "Shift-based" 
                            : "Trip-linked"],
                        ...(assignForm.authMode === 
                          "shift_based" 
                          ? [["Shift hours", 
                              `${assignForm.shifts[0].start}–${assignForm.shifts[0].end}`]] 
                          : []),
                        ...(assignForm.authMode === 
                          "trip_linked" 
                          ? [
                              ["Trip date", 
                                assignForm.trip.date],
                              ["Route", 
                                `${assignForm.trip.origin} → ${assignForm.trip.destination}`],
                            ] 
                          : []),
                        ["Status after", 
                          "Pending driver acceptance"],
                      ].map(([label, value], i) => (
                        <div key={i} 
                          className="flex justify-between items-center px-4 py-3 border-b border-border last:border-0 text-sm">
                          <span className="text-muted-foreground">
                            {label}
                          </span>
                          <span className="font-medium">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Generated pairing code */}
                    <div className="bg-muted/30 border border-border rounded-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Pairing Code
                        </p>
                        <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                          Auto-generated
                        </span>
                      </div>
                      <div className="px-4 py-4 text-center">
                        <p className="font-mono font-bold text-3xl tracking-widest text-foreground">
                          {(() => {
                            const seed = (assignForm.vehicleId + (selectedDriver?.id ?? "")).slice(-6)
                            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
                            let code = ""
                            for (let i = 0; i < 6; i++) {
                              code += chars[(seed.charCodeAt(i % seed.length) + i * 7) % chars.length]
                            }
                            return code
                          })()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Share this code with the driver to activate fueling
                        </p>
                      </div>
                      <div className="px-4 pb-4 flex gap-2">
                        <button
                          onClick={() => {
                            const seed = (assignForm.vehicleId + (selectedDriver?.id ?? "")).slice(-6)
                            const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
                            let code = ""
                            for (let i = 0; i < 6; i++) {
                              code += chars[(seed.charCodeAt(i % seed.length) + i * 7) % chars.length]
                            }
                            navigator.clipboard.writeText(code)
                          }}
                          className="flex-1 py-2 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                          </svg>
                          Copy
                        </button>
                        <button
                          className="flex-1 py-2 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9a16 16 0 006.29 6.29l1.56-1.56a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                          </svg>
                          WhatsApp
                        </button>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-xs text-amber-700">
                        The driver will receive a 
                        notification to accept this 
                        assignment. Scan & Pay will be 
                        unlocked once they accept.
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 px-5 pb-5">
              {assignStep > 1 && (
                <button
                  onClick={() => setAssignStep(s => s - 1)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                  Back
                </button>
              )}
              {assignStep < 3 ? (
                <button
                  disabled={assignStep === 1 && 
                    !assignForm.vehicleId}
                  onClick={() => setAssignStep(s => s + 1)}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              ) : (
                <button
                  onClick={handleAssignVehicle}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Confirm Assignment
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Unpair Confirmation Modal */}
      {unpairConfirm && (() => {
        const binding = localBindings.find(b => b.id === unpairConfirm)
        if (!binding) return null
        return (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setUnpairConfirm(null)}
            />
            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-xl border border-border p-6 w-[360px] z-50">
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </div>

              <h3 className="font-semibold text-base text-foreground text-center mb-1">
                Unpair vehicle?
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-1">
                {binding.vehicleId}
              </p>
              <p className="text-xs text-muted-foreground text-center mb-5">
                The driver will lose access to this vehicle immediately. Their active session (if any) will be allowed to complete.
              </p>

              {/* Consequences list */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 space-y-1.5">
                <p className="text-xs font-medium text-amber-800">
                  What happens:
                </p>
                {[
                  "Binding set to REVOKED",
                  "Pairing code invalidated",
                  "Driver notified via app",
                  "Cannot be undone — FO must re-assign to restore access",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-600 mt-1.5 flex-shrink-0"/>
                    <p className="text-xs text-amber-700">{item}</p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setUnpairConfirm(null)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Mark binding as revoked in local state
                    setLocalBindings(prev => 
                      prev.map(b => b.id === unpairConfirm
                        ? { ...b, state: "REVOKED" }
                        : b
                      )
                    )
                    setUnpairConfirm(null)
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Yes, unpair
                </button>
              </div>
            </div>
          </>
        )
      })()}
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
