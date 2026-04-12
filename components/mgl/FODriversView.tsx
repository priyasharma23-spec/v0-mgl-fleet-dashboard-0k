"use client"
import { useState } from "react"
import { Search, Plus, User, Car, Shield, Copy, CheckCircle, AlertCircle, X, RefreshCw, ChevronRight } from "lucide-react"
import {
  mockDrivers, mockVehicles, mockDriverVehicleBindings,
  resolveEffectivePolicy,
  type Driver, type DriverPairingPolicy
} from "@/lib/mgl-data"

const myDrivers = mockDrivers.filter(d => d.foId === "FO001")
const myVehicles = mockVehicles.filter(v => v.foId === "FO001" && v.status === "CARD_ACTIVE")

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function getRiskLevel(policy?: DriverPairingPolicy) {
  if (!policy) return { level: "medium" as const, label: "Balanced", color: "text-amber-600" }
  const noExpiry = policy.expiryHours === null
  const multiUse = policy.codeType === "multi_use"
  const unlimited = policy.maxUsesPerCode === null
  if (noExpiry && multiUse && unlimited) return { level: "high" as const, label: "Open", color: "text-red-600" }
  if (policy.codeType === "single_use" && policy.expiryHours && policy.expiryHours <= 48)
    return { level: "low" as const, label: "High Security", color: "text-green-600" }
  return { level: "medium" as const, label: "Balanced", color: "text-amber-600" }
}

const ASSIGNMENT_TYPES = [
  {
    id: "permanent",
    icon: "🔒",
    label: "Permanent",
    desc: "Driver always operates this vehicle. Set once.",
    policyLabel: "Multi-use · 30-day expiry · Monthly reset",
    policyDetail: "Best for dedicated driver-vehicle pairs. Code renews monthly.",
    extraFields: [] as string[],
  },
  {
    id: "shift",
    icon: "🕐",
    label: "Shift-based",
    desc: "Multiple drivers share one vehicle across shifts.",
    policyLabel: "Single-use · 12h expiry · Daily reset",
    policyDetail: "New code each shift. Prevents previous shift driver from fueling.",
    extraFields: ["shift"],
  },
  {
    id: "trip",
    icon: "🗺️",
    label: "Trip-based",
    desc: "Assigned per delivery run or trip.",
    policyLabel: "Single-use · 48h expiry · Per-trip reset",
    policyDetail: "Code valid for trip duration only. Auto-expires after 48h.",
    extraFields: ["tripId"],
  },
  {
    id: "pool",
    icon: "🚛",
    label: "Pool / Float",
    desc: "Driver covers multiple vehicles across the fleet.",
    policyLabel: "Multi-use · 7-day expiry · Resets on vehicle change",
    policyDetail: "Flexible for pool drivers. Code resets when driver switches vehicles.",
    extraFields: [] as string[],
  },
  {
    id: "contractor",
    icon: "📋",
    label: "Contractor / Temp",
    desc: "Short-term or one-time assignment.",
    policyLabel: "Single-use · 48h expiry · No re-pairing",
    policyDetail: "Tight security. Code cannot be reused. No automatic renewal.",
    extraFields: [] as string[],
  },
]

type BindingForm = {
  assignmentType: string
  vehicleId: string
  spendLimitPerFueling: string
  spendLimitPerDay: string
  shiftStart: string
  shiftEnd: string
  tripId: string
  notes: string
}

const EMPTY_FORM: BindingForm = {
  assignmentType: "", vehicleId: "",
  spendLimitPerFueling: "", spendLimitPerDay: "",
  shiftStart: "", shiftEnd: "", tripId: "", notes: "",
}

export default function FODriversView({ onboardingType = "MIC_ASSISTED" }: { onboardingType?: string }) {
  const [search, setSearch] = useState("")
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [activeTab, setActiveTab] = useState<"details" | "pairing" | "policy" | "bindings">("details")
  const [copiedCode, setCopiedCode] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState(false)
  const [draftPolicy, setDraftPolicy] = useState<DriverPairingPolicy | null>(null)

  // Pairing modal
  const [showPairingModal, setShowPairingModal] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")

  // Binding modal
  const [showBindingModal, setShowBindingModal] = useState(false)
  const [bindingStep, setBindingStep] = useState(1)
  const [bindingForm, setBindingForm] = useState<BindingForm>(EMPTY_FORM)
  const [bindingCreated, setBindingCreated] = useState(false)
  const [generatedBindingCode, setGeneratedBindingCode] = useState("")

  const drivers = myDrivers
  const filtered = drivers.filter(d =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.contactNumber.includes(search) ||
    d.licenseNumber?.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    total: drivers.length,
    active: drivers.filter(d => d.status === "active").length,
    assigned: drivers.filter(d => d.assignedVehicleIds.length > 0).length,
    unassigned: drivers.filter(d => d.assignedVehicleIds.length === 0).length,
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const openBindingModal = () => {
    setBindingForm(EMPTY_FORM)
    setBindingStep(1)
    setBindingCreated(false)
    setShowBindingModal(true)
  }

  const selectedType = ASSIGNMENT_TYPES.find(t => t.id === bindingForm.assignmentType)

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Drivers</h1>
          <p className="text-sm text-muted-foreground">{drivers.length} drivers in your fleet</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: counts.total, bg: "bg-blue-100", color: "text-blue-600" },
          { label: "Active", value: counts.active, bg: "bg-green-100", color: "text-green-600" },
          { label: "Assigned", value: counts.assigned, bg: "bg-primary/10", color: "text-primary" },
          { label: "Unassigned", value: counts.unassigned, bg: "bg-amber-100", color: "text-amber-600" },
        ].map((c, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center mb-2`}>
              <User className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, contact or license..."
          className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" />
      </div>

      {/* Driver List */}
      <div className="space-y-3">
        {filtered.map(driver => {
          const risk = getRiskLevel(driver.pairingPolicy)
          const vehicles = myVehicles.filter(v => driver.assignedVehicleIds.includes(v.id))
          return (
            <div key={driver.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{driver.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.contactNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${driver.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                  </span>
                  <button onClick={() => { setSelectedDriver(driver); setActiveTab("details") }}
                    className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-border">
                <div>
                  <p className="text-muted-foreground">Vehicles</p>
                  <p className="font-medium mt-0.5 truncate">{vehicles.length > 0 ? vehicles.map(v => v.vehicleNumber).join(", ") : "Unassigned"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pairing Code</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-mono font-bold">{driver.pairingCode || "—"}</span>
                    {driver.pairingCode && (
                      <button onClick={() => copyCode(driver.pairingCode!)} className="text-muted-foreground hover:text-primary">
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Security</p>
                  <p className={`font-medium mt-0.5 ${risk.color}`}>{risk.label}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => { setGeneratedCode(generateCode()); setShowPairingModal(true) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted">
                  <RefreshCw className="w-3.5 h-3.5" /> New Code
                </button>
                {driver.pairingCode && (
                  <button onClick={() => copyCode(driver.pairingCode!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted">
                    {copiedCode ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? "Copied!" : "Copy Code"}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── DETAIL TRAY ── */}
      {selectedDriver && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedDriver(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 flex flex-col">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{selectedDriver.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{selectedDriver.name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedDriver.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDriver(null)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex border-b border-border shrink-0">
              {(["details","pairing","policy","bindings"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* ── DETAILS TAB ── */}
              {activeTab === "details" && (
                <>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Personal Details</p>
                    {[
                      ["Name", selectedDriver.name],
                      ["Contact", selectedDriver.contactNumber],
                      ["License No.", selectedDriver.licenseNumber || "—"],
                      ["License Expiry", selectedDriver.licenseExpiry || "—"],
                      ["Status", selectedDriver.status],
                      ["Added On", selectedDriver.createdAt],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assigned Vehicles</p>
                    {selectedDriver.assignedVehicleIds.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No vehicles assigned</p>
                    ) : myVehicles.filter(v => selectedDriver.assignedVehicleIds.includes(v.id)).map(v => (
                      <div key={v.id} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-xs font-medium">{v.vehicleNumber}</span>
                        <span className="text-xs text-muted-foreground">{v.category} · {v.oem}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── PAIRING TAB ── */}
              {activeTab === "pairing" && (
                <div className="space-y-4">
                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${selectedDriver.lastPairedAt ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedDriver.lastPairedAt ? "bg-green-500" : "bg-amber-500"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${selectedDriver.lastPairedAt ? "text-green-900" : "text-amber-900"}`}>
                        {selectedDriver.lastPairedAt ? "Device Paired" : "Code Issued — Not Yet Paired"}
                      </p>
                      <p className={`text-xs mt-0.5 ${selectedDriver.lastPairedAt ? "text-green-700" : "text-amber-700"}`}>
                        {selectedDriver.lastPairedAt ? `Last paired ${selectedDriver.lastPairedAt}` : "Driver has not yet used this code"}
                      </p>
                    </div>
                  </div>

                  {selectedDriver.pairingCode && (
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active Code</p>
                      <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                        <span className="text-2xl font-mono font-bold tracking-widest">{selectedDriver.pairingCode}</span>
                        <button onClick={() => copyCode(selectedDriver.pairingCode!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                          {copiedCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedCode ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      {[
                        ["Expiry", selectedDriver.pairingCodeExpiry || "No expiry"],
                        ["Times Used", String(selectedDriver.pairingCodeUsed ?? 0)],
                        ["Last Paired", selectedDriver.lastPairedAt || "Never"],
                      ].map(([l, v]) => (
                        <div key={l} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pairing History</p>
                    {selectedDriver.lastPairedAt ? (
                      <div className="space-y-3">
                        {[
                          { date: selectedDriver.lastPairedAt, label: "Device paired successfully", type: "success" },
                          { date: selectedDriver.createdAt, label: "Driver added to fleet", type: "info" },
                        ].map((e, i, arr) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${e.type === "success" ? "bg-green-600" : "bg-blue-600"}`} />
                              {i < arr.length - 1 && <div className="w-0.5 h-6 bg-border mt-1" />}
                            </div>
                            <div className="pb-1">
                              <p className="text-xs font-medium text-foreground">{e.label}</p>
                              <p className="text-[10px] text-muted-foreground">{e.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-muted-foreground">No activity yet</p>}
                  </div>

                  <div className="flex gap-2">
                    {["📱 SMS", "💬 WhatsApp", "📧 Email"].map(m => (
                      <button key={m} className="flex-1 py-2 border border-border rounded-lg text-xs font-medium hover:bg-muted">{m}</button>
                    ))}
                  </div>

                  <button onClick={() => { setGeneratedCode(generateCode()); setShowPairingModal(true) }}
                    className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Generate New Code
                  </button>
                  {selectedDriver.pairingCode && (
                    <button className="w-full py-2.5 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50">
                      Revoke Current Code
                    </button>
                  )}
                </div>
              )}

              {/* ── POLICY TAB ── */}
              {activeTab === "policy" && (
                <div className="space-y-4">
                  {(() => {
                    const policy = editingPolicy ? draftPolicy! : selectedDriver.pairingPolicy
                    const risk = getRiskLevel(policy)
                    return (
                      <>
                        <div className={`flex items-center gap-3 p-3 rounded-xl border ${risk.level === "low" ? "bg-green-50 border-green-200" : risk.level === "high" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                          <Shield className={`w-5 h-5 shrink-0 ${risk.color}`} />
                          <div>
                            <p className={`text-sm font-semibold ${risk.color}`}>Security: {risk.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {risk.level === "low" ? "Strong — tight expiry and limited uses" :
                               risk.level === "high" ? "Open — consider adding expiry or limiting uses" :
                               "Balanced between security and convenience"}
                            </p>
                          </div>
                        </div>

                        {!editingPolicy ? (
                          <>
                            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Policy</p>
                              {[
                                ["Code Type", policy?.codeType === "single_use" ? "Single use" : "Multi use"],
                                ["Expiry", policy?.expiryHours === null ? "No expiry" : `${policy?.expiryHours}h`],
                                ["Max Uses", policy?.maxUsesPerCode === null ? "Unlimited" : String(policy?.maxUsesPerCode)],
                                ["Re-pairing", policy?.repairingTrigger === "never" ? "Manual only" : policy?.repairingTrigger === "monthly" ? "Monthly reset" : "On vehicle change"],
                              ].map(([l, v]) => (
                                <div key={l} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{l}</span>
                                  <span className="font-medium text-foreground">{v ?? "—"}</span>
                                </div>
                              ))}
                            </div>
                            <button onClick={() => { setEditingPolicy(true); setDraftPolicy({ ...selectedDriver.pairingPolicy! }) }}
                              className="w-full py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
                              Edit Policy
                            </button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Code Type</p>
                              <div className="flex gap-2">
                                {[{value:"single_use",label:"Single use"},{value:"multi_use",label:"Multi use"}].map(o => (
                                  <button key={o.value} onClick={() => setDraftPolicy(p => ({ ...p!, codeType: o.value as any }))}
                                    className={`flex-1 p-3 rounded-lg border text-xs font-semibold transition-colors ${draftPolicy?.codeType === o.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-foreground"}`}>
                                    {o.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Expiry</p>
                              <div className="grid grid-cols-3 gap-2">
                                {[{l:"24h",v:24},{l:"48h",v:48},{l:"7 days",v:168},{l:"30 days",v:720},{l:"No expiry",v:null}].map(o => (
                                  <button key={String(o.v)} onClick={() => setDraftPolicy(p => ({ ...p!, expiryHours: o.v }))}
                                    className={`py-2 rounded-lg border text-xs font-medium transition-colors ${draftPolicy?.expiryHours === o.v ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"}`}>
                                    {o.l}
                                  </button>
                                ))}
                              </div>
                              {draftPolicy?.expiryHours === null && (
                                <p className="text-[10px] text-amber-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> No expiry — pair with single-use to reduce risk.</p>
                              )}
                            </div>

                            {draftPolicy?.codeType === "multi_use" && (
                              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Max Uses</p>
                                <div className="grid grid-cols-4 gap-2">
                                  {[{l:"1",v:1},{l:"5",v:5},{l:"10",v:10},{l:"Unlimited",v:null}].map(o => (
                                    <button key={String(o.v)} onClick={() => setDraftPolicy(p => ({ ...p!, maxUsesPerCode: o.v }))}
                                      className={`py-2 rounded-lg border text-xs font-medium transition-colors ${draftPolicy?.maxUsesPerCode === o.v ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"}`}>
                                      {o.l}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Re-pairing Trigger</p>
                              {[
                                {v:"never",l:"Manual only",d:"FO generates new code manually"},
                                {v:"monthly",l:"Monthly reset",d:"Code resets every month"},
                                {v:"on_vehicle_change",l:"On vehicle change",d:"New code when driver switches vehicles"},
                              ].map(o => (
                                <button key={o.v} onClick={() => setDraftPolicy(p => ({ ...p!, repairingTrigger: o.v as any }))}
                                  className={`w-full p-3 rounded-lg border text-left transition-colors ${draftPolicy?.repairingTrigger === o.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                                  <p className="text-xs font-semibold text-foreground">{o.l}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{o.d}</p>
                                </button>
                              ))}
                            </div>

                            <div className="bg-muted/20 border border-border rounded-xl p-3">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Summary</p>
                              <p className="text-xs text-foreground leading-relaxed">
                                <strong>{draftPolicy?.codeType === "single_use" ? "Single-use" : "Reusable"}</strong> code
                                {draftPolicy?.expiryHours ? `, valid for ${draftPolicy.expiryHours}h` : ", no expiry"}.
                                {draftPolicy?.codeType === "multi_use" && draftPolicy?.maxUsesPerCode ? ` Max ${draftPolicy.maxUsesPerCode} uses.` : ""}
                                {" "}Re-pairs{" "}
                                {draftPolicy?.repairingTrigger === "never" ? "manually." : draftPolicy?.repairingTrigger === "monthly" ? "monthly." : "on vehicle change."}
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <button onClick={() => { setEditingPolicy(false); setDraftPolicy(null) }}
                                className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">Cancel</button>
                              <button onClick={() => { setEditingPolicy(false); setDraftPolicy(null) }}
                                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Save</button>
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              )}

              {/* ── BINDINGS TAB ── */}
              {activeTab === "bindings" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Bindings</p>
                    <button onClick={openBindingModal} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                      <Plus className="w-3.5 h-3.5" /> Add Binding
                    </button>
                  </div>

                  {(() => {
                    const bindings = mockDriverVehicleBindings.filter(b => b.driverId === selectedDriver.id)
                    if (bindings.length === 0) return (
                      <div className="text-center py-8 bg-muted/30 rounded-xl border border-dashed border-border">
                        <Car className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm text-muted-foreground">No vehicle bindings yet</p>
                        <button onClick={openBindingModal} className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                          Create Binding
                        </button>
                      </div>
                    )
                    return bindings.map(b => {
                      const v = mockVehicles.find(x => x.id === b.vehicleId)
                      return (
                        <div key={b.bindingId} className="bg-muted/30 rounded-xl border border-border p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Car className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold font-mono">{v?.vehicleNumber || b.vehicleId}</p>
                                <p className="text-xs text-muted-foreground">{v?.category} · {v?.oem}</p>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.state === "active" ? "bg-green-100 text-green-700" : b.state === "pending_binding" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                              {b.state === "pending_binding" ? "Pending" : b.state.charAt(0).toUpperCase() + b.state.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Pairing Code</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="font-mono font-bold">{b.pairingCode || "—"}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${b.pairingCodeState === "used" ? "bg-green-100 text-green-700" : b.pairingCodeState === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                                  {b.pairingCodeState}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Auth Mode</p>
                              <p className="font-medium mt-0.5 capitalize">{b.authMode?.replace("_", " ")}</p>
                            </div>
                            {b.spendLimitPerFueling && <div><p className="text-muted-foreground">Per Fueling</p><p className="font-medium mt-0.5">₹{b.spendLimitPerFueling.toLocaleString("en-IN")}</p></div>}
                            {b.spendLimitPerDay && <div><p className="text-muted-foreground">Daily Limit</p><p className="font-medium mt-0.5">₹{b.spendLimitPerDay.toLocaleString("en-IN")}</p></div>}
                            {b.shiftStart && <div><p className="text-muted-foreground">Shift</p><p className="font-medium mt-0.5">{b.shiftStart} – {b.shiftEnd}</p></div>}
                            <div><p className="text-muted-foreground">Activated</p><p className="font-medium mt-0.5">{b.activatedAt || "Not yet"}</p></div>
                          </div>

                          {b.notes && <p className="text-xs text-muted-foreground italic border-t border-border pt-2">{b.notes}</p>}

                          <div className="flex gap-2">
                            {b.state === "active" && (
                              <button className="flex-1 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50">Suspend</button>
                            )}
                            {b.state === "pending_binding" && (
                              <button className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">Send Code</button>
                            )}
                            <button className="flex-1 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted">Edit Limits</button>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── GENERATE CODE MODAL ── */}
      {showPairingModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowPairingModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6 space-y-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">New Pairing Code</h3>
                <p className="text-xs text-muted-foreground mt-1">Share with driver to pair their device</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl">
                <span className="text-3xl font-mono font-bold tracking-widest">{generatedCode}</span>
                <button onClick={() => copyCode(generatedCode)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                  {copiedCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">📱 SMS</button>
                <button className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">💬 WhatsApp</button>
              </div>
              <button onClick={() => setShowPairingModal(false)}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Done</button>
            </div>
          </div>
        </>
      )}

      {/* ── BINDING CREATION MODAL ── */}
      {showBindingModal && selectedDriver && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => !bindingCreated && setShowBindingModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {bindingCreated ? "Assignment Created" : bindingStep === 1 ? "Choose Assignment Type" : bindingStep === 2 ? "Set Limits" : "Confirm & Generate"}
                  </h3>
                  {!bindingCreated && selectedDriver && (
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedDriver.name}</p>
                  )}
                </div>
                {!bindingCreated && (
                  <button onClick={() => setShowBindingModal(false)} className="p-2 hover:bg-muted rounded-lg shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Step dots */}
              {!bindingCreated && (
                <div className="flex items-center justify-center gap-2 pt-4 px-5">
                  {[1,2,3].map(s => (
                    <div key={s} className={`h-1.5 rounded-full transition-all ${s === bindingStep ? "w-8 bg-primary" : s < bindingStep ? "w-4 bg-primary/40" : "w-4 bg-muted"}`} />
                  ))}
                </div>
              )}

              <div className="p-5 space-y-4">

                {/* ── SUCCESS ── */}
                {bindingCreated ? (
                  <div className="text-center space-y-4 py-2">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Assignment Created</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedDriver?.name} → {myVehicles.find(v => v.id === bindingForm.vehicleId)?.vehicleNumber}
                      </p>
                      <p className="text-xs text-muted-foreground">{selectedType?.label} assignment</p>
                    </div>
                    <div className="p-4 bg-muted/30 border border-border rounded-xl text-left space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pairing Code</p>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-mono font-bold tracking-widest">{generatedBindingCode}</span>
                        <button onClick={() => copyCode(generatedBindingCode)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                          {copiedCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedCode ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{selectedType?.policyLabel}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 border border-border rounded-lg text-xs font-medium hover:bg-muted">📱 SMS</button>
                      <button className="flex-1 py-2 border border-border rounded-lg text-xs font-medium hover:bg-muted">💬 WhatsApp</button>
                    </div>
                    <button onClick={() => setShowBindingModal(false)}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                      Done
                    </button>
                  </div>

                ) : bindingStep === 1 ? (
                  /* ── STEP 1: Assignment type + vehicle ── */
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Vehicle <span className="text-destructive">*</span></label>
                      <select value={bindingForm.vehicleId} onChange={e => setBindingForm(f => ({ ...f, vehicleId: e.target.value }))}
                        className="w-full mt-1 px-3 py-2.5 border border-border rounded-lg text-sm bg-card">
                        <option value="">Select vehicle</option>
                        {myVehicles.map(v => {
                          const alreadyBound = mockDriverVehicleBindings.some(b => b.vehicleId === v.id && b.driverId === selectedDriver?.id && b.state === "active")
                          return <option key={v.id} value={v.id} disabled={alreadyBound}>{v.vehicleNumber} — {v.category}{alreadyBound ? " (assigned)" : ""}</option>
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">Assignment Type <span className="text-destructive">*</span></label>
                      <div className="space-y-2">
                        {ASSIGNMENT_TYPES.map(type => (
                          <button key={type.id} onClick={() => setBindingForm(f => ({ ...f, assignmentType: type.id }))}
                            className={`w-full p-3 rounded-xl border text-left transition-colors ${bindingForm.assignmentType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-base leading-none">{type.icon}</span>
                                  <p className="text-sm font-semibold text-foreground">{type.label}</p>
                                </div>
                                <p className="text-[11px] text-muted-foreground mt-1 ml-6">{type.desc}</p>
                                <p className="text-[10px] text-primary/70 mt-0.5 ml-6">{type.policyLabel}</p>
                              </div>
                              {bindingForm.assignmentType === type.id && <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                ) : bindingStep === 2 ? (
                  /* ── STEP 2: Limits ── */
                  <div className="space-y-4">
                    <p className="text-xs text-muted-foreground">Optional — leave blank to use fleet defaults. Limits here can only be equal or stricter.</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Per Fueling (₹)</label>
                        <input type="number" value={bindingForm.spendLimitPerFueling}
                          onChange={e => setBindingForm(f => ({ ...f, spendLimitPerFueling: e.target.value }))}
                          placeholder="Fleet default"
                          className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Per Day (₹)</label>
                        <input type="number" value={bindingForm.spendLimitPerDay}
                          onChange={e => setBindingForm(f => ({ ...f, spendLimitPerDay: e.target.value }))}
                          placeholder="Fleet default"
                          className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                      </div>
                    </div>

                    {bindingForm.assignmentType === "shift" && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Shift Hours</label>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                          <input type="time" value={bindingForm.shiftStart}
                            onChange={e => setBindingForm(f => ({ ...f, shiftStart: e.target.value }))}
                            className="px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                          <input type="time" value={bindingForm.shiftEnd}
                            onChange={e => setBindingForm(f => ({ ...f, shiftEnd: e.target.value }))}
                            className="px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                        </div>
                      </div>
                    )}

                    {bindingForm.assignmentType === "trip" && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Trip ID / Reference</label>
                        <input type="text" value={bindingForm.tripId}
                          onChange={e => setBindingForm(f => ({ ...f, tripId: e.target.value }))}
                          placeholder="e.g. TRIP-2026-0042"
                          className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
                      <input type="text" value={bindingForm.notes}
                        onChange={e => setBindingForm(f => ({ ...f, notes: e.target.value }))}
                        placeholder="e.g. Temporary assignment, covering for DRV002"
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" />
                    </div>
                  </div>

                ) : (
                  /* ── STEP 3: Confirm ── */
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assignment Summary</p>
                      {[
                        ["Driver", selectedDriver?.name],
                        ["Vehicle", myVehicles.find(v => v.id === bindingForm.vehicleId)?.vehicleNumber || "—"],
                        ["Type", `${selectedType?.icon} ${selectedType?.label}`],
                        ...(bindingForm.spendLimitPerFueling ? [["Per Fueling Limit", `₹${bindingForm.spendLimitPerFueling}`]] : []),
                        ...(bindingForm.spendLimitPerDay ? [["Daily Limit", `₹${bindingForm.spendLimitPerDay}`]] : []),
                        ...(bindingForm.shiftStart ? [["Shift", `${bindingForm.shiftStart} – ${bindingForm.shiftEnd}`]] : []),
                        ...(bindingForm.tripId ? [["Trip ID", bindingForm.tripId]] : []),
                      ].map(([l, v]) => (
                        <div key={l} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{l}</span>
                          <span className="font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pairing Policy</p>
                      <p className="text-xs font-medium text-foreground">{selectedType?.policyLabel}</p>
                      <p className="text-[10px] text-muted-foreground">{selectedType?.policyDetail}</p>
                    </div>

                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-xs text-primary">A pairing code will be generated after confirmation. Share it with the driver to activate their access.</p>
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                {!bindingCreated && (
                  <div className="flex gap-3 pt-1">
                    {bindingStep > 1 && (
                      <button onClick={() => setBindingStep(s => s - 1)}
                        className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
                        Back
                      </button>
                    )}
                    {bindingStep < 3 ? (
                      <button
                        onClick={() => setBindingStep(s => s + 1)}
                        disabled={!bindingForm.vehicleId || !bindingForm.assignmentType}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                        Continue
                      </button>
                    ) : (
                      <button
                        onClick={() => { setGeneratedBindingCode(generateCode()); setBindingCreated(true) }}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                        Create & Generate Code
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
