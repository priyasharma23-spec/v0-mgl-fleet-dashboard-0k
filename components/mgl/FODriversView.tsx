"use client"
import { useState } from "react"
import { Search, Plus, User, Phone, CreditCard, Car, Shield, Copy, CheckCircle, AlertCircle, Clock, X, Eye, RefreshCw, ChevronRight } from "lucide-react"
import { mockVehicles, type OnboardingType } from "@/lib/mgl-data"

// Local types for driver management
export interface Driver {
  id: string
  foId: string
  name: string
  licenseNumber: string
  licenseExpiry: string
  phone: string
  email?: string
  status: "ACTIVE" | "INACTIVE" | "PENDING_KYC"
  assignedVehicleId?: string
  pairingCode?: string
  pairingCodeExpiry?: string
  pairingPolicy?: DriverPairingPolicy
  createdAt: string
}

export interface DriverPairingPolicy {
  codeType: "single_use" | "multi_use"
  expiryHours: number | null
  maxUsesPerCode: number | null
  repairingTrigger: "never" | "monthly" | "on_vehicle_change"
}

// Local mock drivers for FO001
const mockDrivers: Driver[] = [
  {
    id: "DRV001",
    foId: "FO001",
    name: "Ramesh Kumar",
    licenseNumber: "MH04DL20250001",
    licenseExpiry: "2028-05-15",
    phone: "9876501234",
    email: "ramesh@abc.com",
    status: "ACTIVE",
    assignedVehicleId: "VEH001",
    createdAt: "2025-02-01",
    pairingPolicy: { codeType: "single_use", expiryHours: 24, maxUsesPerCode: 1, repairingTrigger: "monthly" },
  },
  {
    id: "DRV002",
    foId: "FO001",
    name: "Anil Sharma",
    licenseNumber: "MH04DL20250002",
    licenseExpiry: "2027-08-22",
    phone: "9876502345",
    email: "anil@abc.com",
    status: "ACTIVE",
    assignedVehicleId: "VEH002",
    createdAt: "2025-02-05",
    pairingPolicy: { codeType: "multi_use", expiryHours: 48, maxUsesPerCode: 5, repairingTrigger: "on_vehicle_change" },
  },
  {
    id: "DRV003",
    foId: "FO001",
    name: "Suresh Singh",
    licenseNumber: "MH04DL20250003",
    licenseExpiry: "2026-12-10",
    phone: "9876503456",
    status: "ACTIVE",
    assignedVehicleId: "VEH003",
    createdAt: "2025-02-10",
    pairingPolicy: { codeType: "single_use", expiryHours: 24, maxUsesPerCode: 1, repairingTrigger: "never" },
  },
  {
    id: "DRV004",
    foId: "FO001",
    name: "Vikram Patel",
    licenseNumber: "MH04DL20250004",
    licenseExpiry: "2029-03-18",
    phone: "9876504567",
    status: "INACTIVE",
    createdAt: "2025-01-15",
    pairingPolicy: { codeType: "multi_use", expiryHours: null, maxUsesPerCode: null, repairingTrigger: "never" },
  },
  {
    id: "DRV005",
    foId: "FO001",
    name: "Mohit Joshi",
    licenseNumber: "MH04DL20250005",
    licenseExpiry: "2028-07-25",
    phone: "9876505678",
    email: "mohit@abc.com",
    status: "PENDING_KYC",
    pairingCode: "ABC123DEF456",
    pairingCodeExpiry: "2026-04-19",
    createdAt: "2025-03-10",
    pairingPolicy: { codeType: "single_use", expiryHours: 72, maxUsesPerCode: 1, repairingTrigger: "monthly" },
  },
]

const myDrivers = mockDrivers.filter(d => d.foId === "FO001")
const myVehicles = mockVehicles.filter(v => v.foId === "FO001" && v.status === "CARD_ACTIVE")

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function getRiskLevel(policy?: DriverPairingPolicy): { level: "low" | "medium" | "high"; label: string; color: string } {
  if (!policy) return { level: "medium", label: "Balanced", color: "text-amber-600" }
  const noExpiry = policy.expiryHours === null
  const multiUse = policy.codeType === "multi_use"
  const unlimited = policy.maxUsesPerCode === null
  if (noExpiry && multiUse && unlimited) return { level: "high", label: "Open", color: "text-red-600" }
  if (policy.codeType === "single_use" && policy.expiryHours && policy.expiryHours <= 48) return { level: "low", label: "High Security", color: "text-green-600" }
  return { level: "medium", label: "Balanced", color: "text-amber-600" }
}

export default function FODriversView({ onboardingType = "MIC_ASSISTED" }: { onboardingType?: string }) {
  const [search, setSearch] = useState("")
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPairingModal, setShowPairingModal] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [drivers, setDrivers] = useState(myDrivers)
  const [generatedCode, setGeneratedCode] = useState("")
  const [activeTab, setActiveTab] = useState<"details" | "pairing" | "policy">("details")
  const [editingPolicy, setEditingPolicy] = useState(false)
  const [draftPolicy, setDraftPolicy] = useState<DriverPairingPolicy | null>(null)

  const filtered = drivers.filter(d =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search) ||
    d.licenseNumber?.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    total: drivers.length,
    active: drivers.filter(d => d.status === "ACTIVE").length,
    assigned: drivers.filter(d => d.assignedVehicleId).length,
    unassigned: drivers.filter(d => !d.assignedVehicleId).length,
  }

  const handleGenerateCode = (driver: Driver) => {
    const code = generateCode()
    setGeneratedCode(code)
    setShowPairingModal(true)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Drivers</h1>
          <p className="text-sm text-muted-foreground">{drivers.length} drivers in your fleet</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Drivers", value: counts.total, icon: User, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { label: "Active", value: counts.active, icon: CheckCircle, iconBg: "bg-green-100", iconColor: "text-green-600" },
          { label: "Assigned", value: counts.assigned, icon: Car, iconBg: "bg-primary/10", iconColor: "text-primary" },
          { label: "Unassigned", value: counts.unassigned, icon: AlertCircle, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
        ].map((card, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, contact or license number..."
          className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" />
      </div>

      {/* Driver Cards */}
      <div className="space-y-3">
        {filtered.map(driver => {
          const assignedVehicles = myVehicles.filter(v => v.id === driver.assignedVehicleId)
          return (
            <div key={driver.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">{driver.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${driver.status === "ACTIVE" ? "bg-green-100 text-green-700" : driver.status === "INACTIVE" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {driver.status}
                  </span>
                  <button onClick={() => { setSelectedDriver(driver); setActiveTab("details") }}
                    className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Vehicle</p>
                  <p className="font-medium mt-0.5">
                    {assignedVehicles.length > 0
                      ? assignedVehicles[0].vehicleNumber
                      : "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pairing Code</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="font-mono font-bold text-foreground">{driver.pairingCode || "—"}</span>
                    {driver.pairingCode && (
                      <button onClick={() => copyCode(driver.pairingCode!)}
                        className="text-muted-foreground hover:text-primary">
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">License</p>
                  <p className="font-mono text-xs font-medium mt-0.5">{driver.licenseNumber}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => handleGenerateCode(driver)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> New Code
                </button>
                {driver.pairingCode && (
                  <button onClick={() => copyCode(driver.pairingCode!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted transition-colors">
                    {copiedCode ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? "Copied!" : "Copy Code"}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Tray */}
      {selectedDriver && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedDriver(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 flex flex-col">
            {/* Tray Header */}
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

            {/* Tabs */}
            <div className="flex border-b border-border">
              {[
                { id: "details", label: "Details" },
                { id: "pairing", label: "Pairing" },
                { id: "policy", label: "Policy" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === "details" && (
                <>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Personal Details</p>
                    {[
                      ["Name", selectedDriver.name],
                      ["Contact", selectedDriver.phone],
                      ["Email", selectedDriver.email || "—"],
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
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assigned Vehicle</p>
                    {!selectedDriver.assignedVehicleId ? (
                      <p className="text-xs text-muted-foreground">No vehicle assigned</p>
                    ) : (
                      myVehicles.filter(v => v.id === selectedDriver.assignedVehicleId).map(v => (
                        <div key={v.id} className="flex items-center justify-between text-sm">
                          <span className="font-mono text-xs font-medium">{v.vehicleNumber}</span>
                          <span className="text-xs text-muted-foreground">{v.category} · {v.oem}</span>
                        </div>
                      ))
                    )}
                    <button className="w-full mt-2 py-2 border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      + Assign Vehicle
                    </button>
                  </div>
                </>
              )}

              {activeTab === "pairing" && (
                <>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Current Pairing Code</p>
                    {selectedDriver.pairingCode ? (
                      <>
                        <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                          <span className="text-2xl font-mono font-bold text-foreground tracking-widest">{selectedDriver.pairingCode}</span>
                          <button onClick={() => copyCode(selectedDriver.pairingCode!)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                            {copiedCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedCode ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        {[
                          ["Expiry", selectedDriver.pairingCodeExpiry || "No expiry"],
                          ["Status", selectedDriver.pairingCode ? "Active" : "Not generated"],
                        ].map(([label, value]) => (
                          <div key={label} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-medium text-foreground">{value}</span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">No active pairing code</p>
                    )}
                    <button onClick={() => handleGenerateCode(selectedDriver)}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Generate New Code
                    </button>
                  </div>
                </>
              )}

              {activeTab === "policy" && (
                <>
                  {(() => {
                    const policy = editingPolicy ? draftPolicy! : selectedDriver.pairingPolicy
                    const risk = getRiskLevel(policy)
                    return (
                      <div className="space-y-4">
                        {/* Risk indicator — updates live */}
                        <div className={`flex items-center gap-3 p-3 rounded-xl border ${risk.level === "low" ? "bg-green-50 border-green-200" : risk.level === "high" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                          <Shield className={`w-5 h-5 shrink-0 ${risk.color}`} />
                          <div>
                            <p className={`text-sm font-semibold ${risk.color}`}>Security: {risk.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {risk.level === "low" ? "Strong — tight expiry and limited uses" :
                               risk.level === "high" ? "Open — no expiry + unlimited uses. Add restrictions to reduce risk." :
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
                              ].map(([label, value]) => (
                                <div key={label} className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{label}</span>
                                  <span className="font-medium text-foreground">{value ?? "—"}</span>
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => { setEditingPolicy(true); setDraftPolicy({ ...selectedDriver.pairingPolicy! }) }}
                              className="w-full py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                              Edit Policy
                            </button>
                          </>
                        ) : (
                          <div className="space-y-4">

                            {/* Code Type */}
                            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Code Type</p>
                              <div className="flex gap-2">
                                {[
                                  { value: "single_use", label: "Single use", desc: "Code expires after first use" },
                                  { value: "multi_use", label: "Multi use", desc: "Code can be used multiple times" },
                                ].map(opt => (
                                  <button key={opt.value} onClick={() => setDraftPolicy(p => ({ ...p!, codeType: opt.value as any }))}
                                    className={`flex-1 p-3 rounded-lg border text-left transition-colors ${draftPolicy?.codeType === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                                    <p className="text-xs font-semibold text-foreground">{opt.label}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Expiry */}
                            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Code Expiry</p>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { label: "24h", value: 24 },
                                  { label: "48h", value: 48 },
                                  { label: "7 days", value: 168 },
                                  { label: "30 days", value: 720 },
                                  { label: "No expiry", value: null },
                                ].map(opt => (
                                  <button key={String(opt.value)} onClick={() => setDraftPolicy(p => ({ ...p!, expiryHours: opt.value }))}
                                    className={`py-2 rounded-lg border text-xs font-medium transition-colors ${draftPolicy?.expiryHours === opt.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-foreground"}`}>
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                              {draftPolicy?.expiryHours === null && (
                                <p className="text-[10px] text-amber-600 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> No-expiry codes stay valid indefinitely. Pair with single-use to limit exposure.
                                </p>
                              )}
                            </div>

                            {/* Max Uses — only for multi_use */}
                            {draftPolicy?.codeType === "multi_use" && (
                              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Max Uses per Code</p>
                                <div className="grid grid-cols-4 gap-2">
                                  {[
                                    { label: "1", value: 1 },
                                    { label: "5", value: 5 },
                                    { label: "10", value: 10 },
                                    { label: "Unlimited", value: null },
                                  ].map(opt => (
                                    <button key={String(opt.value)} onClick={() => setDraftPolicy(p => ({ ...p!, maxUsesPerCode: opt.value }))}
                                      className={`py-2 rounded-lg border text-xs font-medium transition-colors ${draftPolicy?.maxUsesPerCode === opt.value ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50 text-foreground"}`}>
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Re-pairing trigger */}
                            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Re-pairing Trigger</p>
                              {[
                                { value: "never", label: "Manual only", desc: "FO generates new code manually when needed" },
                                { value: "monthly", label: "Monthly reset", desc: "Code resets every month — forces re-verification" },
                                { value: "on_vehicle_change", label: "On vehicle change", desc: "New code required when driver switches vehicles" },
                              ].map(opt => (
                                <button key={opt.value} onClick={() => setDraftPolicy(p => ({ ...p!, repairingTrigger: opt.value as any }))}
                                  className={`w-full p-3 rounded-lg border text-left transition-colors ${draftPolicy?.repairingTrigger === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                                  <p className="text-xs font-semibold text-foreground">{opt.label}</p>
                                  <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                                </button>
                              ))}
                            </div>

                            {/* Policy summary */}
                            <div className="bg-muted/20 border border-border rounded-xl p-3">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Policy Summary</p>
                              <p className="text-xs text-foreground leading-relaxed">
                                Driver gets a <strong>{draftPolicy?.codeType === "single_use" ? "single-use" : "reusable"}</strong> code
                                {draftPolicy?.expiryHours ? ` valid for ${draftPolicy.expiryHours}h` : " with no expiry"}.
                                {draftPolicy?.codeType === "multi_use" && draftPolicy?.maxUsesPerCode ? ` Max ${draftPolicy.maxUsesPerCode} uses.` : ""}
                                {" "}Re-pairing is{" "}
                                {draftPolicy?.repairingTrigger === "never" ? "manual only." : draftPolicy?.repairingTrigger === "monthly" ? "triggered monthly." : "triggered on vehicle change."}
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <button onClick={() => { setEditingPolicy(false); setDraftPolicy(null) }}
                                className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
                                Cancel
                              </button>
                              <button onClick={() => { setEditingPolicy(false); setDraftPolicy(null) }}
                                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                                Save Policy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Generate Code Modal */}
      {showPairingModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowPairingModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm p-6 space-y-4">
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">New Pairing Code Generated</h3>
                <p className="text-xs text-muted-foreground mt-1">Share this code with the driver to pair their device</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl">
                <span className="text-3xl font-mono font-bold text-foreground tracking-widest">{generatedCode}</span>
                <button onClick={() => copyCode(generatedCode)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                  {copiedCode ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">Code expires in 24 hours</p>
              <div className="flex gap-2">
                <button onClick={() => setShowPairingModal(false)}
                  className="flex-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                  Done
                </button>
                <button onClick={() => { copyCode(generatedCode); setShowPairingModal(false) }}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                  Copy & Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
