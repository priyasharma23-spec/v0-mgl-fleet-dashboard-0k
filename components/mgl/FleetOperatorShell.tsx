"use client"
// Fleet Operator Shell - Restored from v54

import { useState } from "react"
import {
  Truck, CreditCard, MapPin, Bell, LayoutDashboard, UserPlus, Upload,
  CheckCircle, Clock, XCircle, AlertCircle, Package, Eye, EyeOff,
  ChevronRight, ArrowRight, Shield, Smartphone, Star, RefreshCw
} from "lucide-react"
import Image from "next/image"
import MGLHeader from "@/components/mgl/MGLHeader"
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import FOWalletView from "@/components/mgl/FOWalletView"
import CardDetailsView from "@/components/mgl/CardDetailsView"
import {
  mockVehicles, mockFleetOperators,
  oems, dealers, retrofitters,
  getDealersByOEM, getCategoriesByOEM, getModelsByOEMAndCategory,
  calculateVehicleAge,
  type VehicleCategory
} from "@/lib/mgl-data"
import { VehicleStatusBadge, WorkflowStepper } from "@/components/mgl/StatusBadge"
import type { VehicleStatus } from "@/lib/mgl-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

type FOOnboardingType = "MIC_ASSISTED" | "SELF_SERVICE"

interface Props {
  user: { name: string; role: "fleet-operator" }
  onLogout: () => void
  onboardingType?: FOOnboardingType
  isNewRegistration?: boolean
}

// The FO data for this logged-in user
const myFO = mockFleetOperators[0]
const myVehicles = mockVehicles.filter((v) => v.foId === "FO001")

export default function FleetOperatorShell({ user, onLogout, onboardingType = "SELF_SERVICE", isNewRegistration = false }: Props) {
  const [activeView, setActiveView] = useState("fo-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(onboardingType === "MIC_ASSISTED")
  const [selectedCardVehicle, setSelectedCardVehicle] = useState<string | null>(null)

  // Determine if this is a new FO that needs to complete registration
  // Self-service flow: needs full KYB registration
  // MIC-assisted flow: already registered, can directly add vehicles
  const isSelfServiceNewFO = onboardingType === "SELF_SERVICE" && isNewRegistration

  // New FO signup state (only for self-service registration)
  const [signupDone, setSignupDone] = useState(!isSelfServiceNewFO)

  // For self-service new registration, show signup flow
  if (isSelfServiceNewFO && !signupDone) {
    return <FOSignupFlow onComplete={() => setSignupDone(true)} onLogin={onLogout} />
  }

  // Welcome modal for MIC-assisted FO (activated via link)
  const WelcomeModal = () => showWelcomeModal ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Account Activated!</h2>
            <p className="text-sm text-muted-foreground mt-1">Welcome to MGL Fleet Platform, {user.name}</p>
          </div>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-green-800">Your account has been set up by MIC</p>
          <p className="text-xs text-green-700">Your KYB details and MoU documents have already been verified. You can now:</p>
          <ul className="text-xs text-green-700 list-disc list-inside space-y-1 mt-2">
            <li>Add vehicles to your fleet</li>
            <li>Upload vehicle documents for card issuance</li>
            <li>Track card delivery status</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowWelcomeModal(false)}
            className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Explore Dashboard
          </button>
          <button
            onClick={() => { setShowWelcomeModal(false); setActiveView("fo-add-vehicle"); }}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>
    </div>
  ) : null

  function renderView() {
    switch (activeView) {
      case "fo-dashboard": return <FODashboard onViewChange={setActiveView} />
      case "fo-wallet": return <FOWalletView />
      case "fo-cards": return selectedCardVehicle ? (
        <CardDetailsView
          vehicle={myVehicles.find(v => v.id === selectedCardVehicle)!}
          onBack={() => setSelectedCardVehicle(null)}
          onActionModal={setActionModal}
        />
      ) : (
        <FOCardsView onViewChange={setActiveView} onManageCard={(vehicleId) => setSelectedCardVehicle(vehicleId)} />
      )
      case "fo-vehicles": return <FOVehiclesList onViewChange={setActiveView} />
      case "fo-add-vehicle": return <FOAddVehicle onViewChange={setActiveView} />
      case "fo-funds": return <FOFundManagement />
      case "fo-delivery": return <FODeliveryTracking />
      case "fo-notifications": return <FONotificationsView />
      default: return <FODashboard onViewChange={setActiveView} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        <WelcomeModal />
        <MGLSidebar
          role="fleet-operator"
          activeView={activeView}
          onViewChange={setActiveView}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <MGLHeader
            role="fleet-operator"
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

// ─── FO Signup Flow ─────────────────────────────────────────────�����───────────
function FOSignupFlow({ onComplete, onLogin }: { onComplete: () => void; onLogin: () => void }) {
  const [step, setStep] = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [form, setForm] = useState({
    name: "", contact: "", email: "", pan: "", gstn: "",
    address: "", deliveryAddress: "", password: "", confirmPassword: ""
  })

  const steps = ["Account Setup", "KYB Details", "Verification", "Complete"]

  function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
    return (
      <div>
        <label className="text-xs font-medium text-muted-foreground">{label} <span className="text-destructive">*</span></label>
        <input
          type={type}
          placeholder={placeholder || label}
          value={(form as Record<string, string>)[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0faf3] via-white to-[#e8f4ff] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow border border-border flex items-center justify-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-agxPFremWBWY82BTBrfdO5RnOzVori.png"
                alt="MGL" width={48} height={48} className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground">Fleet Operator Registration</h1>
          <p className="text-sm text-muted-foreground">Mahanagar Gas Limited – CNG Fleet Platform</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-6">
          {steps.map((label, i) => {
            const s = i + 1
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${step > s ? "bg-primary text-white" : step === s ? "bg-primary/20 text-primary ring-2 ring-primary/30" : "bg-muted text-muted-foreground"
                    }`}>
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap ${step === s ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 w-10 sm:w-16 mx-1 mb-4 shrink-0 ${step > s ? "bg-primary" : "bg-border"}`} />}
              </div>
            )
          })}
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-xl p-6 space-y-4">
          {step === 1 && (
            <>
              <p className="font-semibold text-foreground border-b border-border pb-2">Create Your Account</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name / Company Name" name="name" />
                <Field label="Mobile Number" name="contact" type="tel" />
                <Field label="Email Address" name="email" type="email" />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Password <span className="text-destructive">*</span></label>
                  <div className="relative mt-1">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pr-10 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="font-semibold text-foreground border-b border-border pb-2">KYB — Business Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="PAN Number" name="pan" placeholder="AABCA1234F" />
                <Field label="GSTN Number" name="gstn" placeholder="27AABCA1234F1Z5" />
                <div className="sm:col-span-2">
                  <Field label="Registered Business Address" name="address" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Card Delivery Address" name="deliveryAddress" />
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                Your PAN and GSTN will be verified against government records. Ensure accuracy to avoid delays.
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="font-semibold text-foreground border-b border-border pb-2">Mobile Verification</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                  <Smartphone className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">OTP Verification</p>
                    <p className="text-xs text-muted-foreground">We will send a 6-digit OTP to {form.contact || "+91 98765 XXXXX"}</p>
                  </div>
                </div>
                {!otpSent ? (
                  <button onClick={() => setOtpSent(true)}
                    className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">
                    Send OTP
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Enter 6-digit OTP</label>
                      <input
                        type="text" maxLength={6}
                        value={otp} onChange={(e) => setOtp(e.target.value)}
                        placeholder="• • • • • •"
                        className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm tracking-[0.5em] text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Demo: enter any 6 digits. <button onClick={() => setOtpSent(false)} className="text-primary hover:underline">Resend OTP</button>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center py-4 gap-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">Registration Complete!</p>
                <p className="text-sm text-muted-foreground mt-1">Your account has been created successfully.</p>
                <p className="text-xs text-muted-foreground mt-0.5">FO ID: <span className="font-mono font-semibold text-foreground">FO-2025-00{Math.floor(Math.random() * 99 + 1)}</span></p>
              </div>
              <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-left">
                <p className="font-semibold mb-1">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Your MIC officer will review and activate your account</li>
                  <li>Once active, you can register your vehicles</li>
                  <li>Upload delivery documents for L2 verification</li>
                  <li>Receive your CNG fuel card after L2 approval</li>
                </ol>
              </div>
              <button onClick={onComplete}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">
                Go to My Dashboard
              </button>
            </div>
          )}

          {step < 4 && (
            <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
              <button onClick={() => step > 1 ? setStep(step - 1) : onLogin()}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">
                {step === 1 ? "Back to Login" : "Back"}
              </button>
              <button
                onClick={() => step === 3 && otp.length < 6 ? null : setStep(step + 1)}
                disabled={step === 3 && otpSent && otp.length < 6}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40">
                {step === 3 ? (otpSent ? "Verify & Continue" : "Skip Verification") : "Continue"}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Already registered? <button onClick={onLogin} className="text-primary font-medium hover:underline">Sign in here</button>
        </p>
      </div>
    </div>
  )
}

// ─── FO Dashboard ─────────────────────────────────────────�����──────────────────
function FODashboard({ onViewChange }: { onViewChange: (v: string) => void }) {
  const totalVehicles = myVehicles.length
  const activeCards = myVehicles.filter((v) => v.status === "CARD_ACTIVE").length
  const pendingDocs = myVehicles.filter((v) => ["DRAFT", "L1_REJECTED", "L2_REJECTED"].includes(v.status)).length
  const inProgress = myVehicles.filter((v) => ["L1_SUBMITTED", "L1_APPROVED", "L2_SUBMITTED", "L2_APPROVED", "CARD_PRINTED", "CARD_DISPATCHED"].includes(v.status)).length

  const activityData = [
    { month: "Oct", submitted: 3, approved: 2 },
    { month: "Nov", submitted: 2, approved: 2 },
    { month: "Dec", submitted: 4, approved: 3 },
    { month: "Jan", submitted: 5, approved: 4 },
    { month: "Feb", submitted: 3, approved: 3 },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Welcome banner */}
      <div className="bg-[#1a2e1a] rounded-xl p-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[#F5A800] text-xs font-semibold tracking-wider uppercase mb-1">Welcome back</p>
          <h1 className="text-white text-xl font-bold">{myFO.name}</h1>
          <p className="text-gray-400 text-sm mt-1">MoU: {myFO.mouNumber} · Active until {myFO.mouExpiryDate}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-green-900/60 text-green-300 rounded-full border border-green-700">
              ACTIVE
            </span>
            <span className="text-xs text-gray-400">FO ID: {myFO.id}</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-agxPFremWBWY82BTBrfdO5RnOzVori.png"
            alt="MGL" width={56} height={56} className="object-contain" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Vehicles", value: totalVehicles, icon: Truck, bg: "bg-blue-100", color: "text-blue-600", action: () => onViewChange("fo-vehicles") },
          { label: "Active Cards", value: activeCards, icon: CreditCard, bg: "bg-green-100", color: "text-green-600", action: () => onViewChange("fo-cards") },
          { label: "In Progress", value: inProgress, icon: Clock, bg: "bg-amber-100", color: "text-amber-600", action: () => onViewChange("fo-vehicles") },
          { label: "Action Needed", value: pendingDocs, icon: AlertCircle, bg: "bg-red-100", color: "text-red-500", action: () => onViewChange("fo-vehicles") },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} onClick={s.action}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity chart */}
        <div className="bg-card rounded-xl border border-border p-4 lg:col-span-2">
          <p className="font-semibold text-sm text-foreground mb-1">Vehicle Activity</p>
          <p className="text-xs text-muted-foreground mb-4">Submitted vs approved (last 5 months)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData} barGap={4} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Bar dataKey="submitted" fill="#1565C0" radius={[4, 4, 0, 0]} name="Submitted" />
              <Bar dataKey="approved" fill="#2EAD4B" radius={[4, 4, 0, 0]} name="Approved" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="font-semibold text-sm text-foreground mb-3">Quick Actions</p>
          <div className="space-y-2">
            {[
              { label: "Register New Vehicle", icon: Truck, view: "fo-add-vehicle", bg: "bg-blue-50 text-blue-700 border-blue-200" },
              { label: "Track Card Delivery", icon: MapPin, view: "fo-delivery", bg: "bg-amber-50 text-amber-700 border-amber-200" },
              { label: "View My Cards", icon: CreditCard, view: "fo-cards", bg: "bg-green-50 text-green-700 border-green-200" },
              { label: "Notifications", icon: Bell, view: "fo-notifications", bg: "bg-purple-50 text-purple-700 border-purple-200" },
            ].map((a) => {
              const Icon = a.icon
              return (
                <button key={a.view} onClick={() => onViewChange(a.view)}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg border text-sm font-medium hover:opacity-80 transition-opacity ${a.bg}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {a.label}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* My vehicles summary */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-sm text-foreground">My Vehicles</p>
          <button onClick={() => onViewChange("fo-vehicles")} className="text-xs text-primary font-medium hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {myVehicles.slice(0, 3).map((v) => {
            const steps: { label: string; status: "done" | "active" | "pending" }[] = [
              { label: "Registered", status: "done" },
              { label: "L1 Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },
              { label: "L2 Review", status: v.l2ApprovedAt ? "done" : v.l2SubmittedAt ? "active" : "pending" },
              { label: "Card", status: v.cardActivatedAt ? "done" : v.cardNumber ? "active" : "pending" },
            ]
            return (
              <div key={v.id} className="p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => onViewChange("fo-vehicles")}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{v.vehicleNumber || v.id}</p>
                      <p className="text-xs text-muted-foreground">{v.model} · {v.category}</p>
                    </div>
                  </div>
                  <VehicleStatusBadge status={v.status} />
                </div>
                <div className="mt-2 overflow-x-auto">
                  <WorkflowStepper steps={steps} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── FO Vehicles List ────────────────────────────────────────────────────────
function FOVehiclesList({ onViewChange }: { onViewChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Vehicles</h1>
          <p className="text-sm text-muted-foreground">{myVehicles.length} vehicles registered</p>
        </div>
        <button onClick={() => onViewChange("fo-add-vehicle")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          + Add Vehicle
        </button>
      </div>
      <div className="space-y-3">
        {myVehicles.map((v) => {
          const steps: { label: string; status: "done" | "active" | "pending" }[] = [
            { label: "Registered", status: "done" },
            { label: "L1 Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },
            { label: "L2 Review", status: v.l2ApprovedAt ? "done" : v.l2SubmittedAt ? "active" : "pending" },
            { label: "Card Issued", status: v.cardActivatedAt ? "done" : v.cardNumber ? "active" : "pending" },
          ]
          return (
            <div key={v.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{v.vehicleNumber || v.id}</p>
                    <p className="text-xs text-muted-foreground">{v.oem} {v.model} · {v.category} · {v.onboardingType === "MIC_ASSISTED" ? "New Purchase" : "Self-Service"}</p>
                  </div>
                </div>
                <VehicleStatusBadge status={v.status} />
              </div>

              <div className="overflow-x-auto mb-3">
                <WorkflowStepper steps={steps} />
              </div>

              {/* Rejection alert */}
              {(v.status === "L1_REJECTED" || v.status === "L2_REJECTED") && (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 mb-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-700">Action Required</p>
                    <p className="text-xs text-red-600">{v.l1Comments || v.l2Comments || "Please re-upload the required documents."}</p>
                    <button className="text-xs text-red-700 font-semibold mt-1 hover:underline">Resubmit Documents →</button>
                  </div>
                </div>
              )}

              {/* Card info */}
              {v.cardNumber && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                  <CreditCard className="w-4 h-4 text-green-600 shrink-0" />
                  <p className="text-xs text-green-700 font-medium">Card: {v.cardNumber}</p>
                  {v.trackingId && <p className="text-xs text-muted-foreground ml-auto">Track: {v.trackingId}</p>}
                </div>
      )}
    </div>
  )
}

// ─── FO Add Vehicle ──────────────────────────────────────────────────────────
function FOAddVehicle({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [vehicleType, setVehicleType] = useState<"new_purchase" | "retrofit">("new_purchase")
  const [form, setForm] = useState({
    vehicleNumber: "",
    oemId: "",
    dealerId: "",
    retrofitterId: "",
    category: "" as VehicleCategory | "",
    model: "",
    customModel: "",
    bookingDate: "",
    registrationDate: "",
    driverName: "",
    driverContact: "",
    driverLicense: "",
    deliveryAddress: "",
    bookingReceipt: null as File | null,
    deliveryChallan: null as File | null,
    rcBook: null as File | null,
    cngCert: null as File | null,
    eFitment: null as File | null,
    rtoEndorsement: null as File | null,
    typeApproval: null as File | null,
    taxInvoice: null as File | null,
    driverLicenseFile: null as File | null,
  })

  // Get filtered options based on selections
  const selectedOEM = oems.find(o => o.id === form.oemId)
  const availableDealers = form.oemId ? getDealersByOEM(form.oemId) : []
  const availableCategories = form.oemId ? getCategoriesByOEM(form.oemId) : []
  const availableModels = form.oemId && form.category ? getModelsByOEMAndCategory(form.oemId, form.category as VehicleCategory) : []

  // Calculate vehicle age for retrofits
  const vehicleAge = form.registrationDate ? calculateVehicleAge(form.registrationDate) : null

  function Field({ label, name, type = "text", placeholder, required = false }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
    return (
      <div>
        <label className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
        <input
          type={type} placeholder={placeholder || label}
          value={(form as Record<string, string>)[name] || ""}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
    )
  }

  function FileField({ label, fieldName, required = false }: { label: string; fieldName: keyof typeof form; required?: boolean }) {
    const file = form[fieldName] as File | null
    return (
      <div>
        <label className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
        <label className="mt-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
          <Upload className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{file ? file.name : "Upload PDF / JPG (max 10MB)"}</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
            onChange={(e) => setForm({ ...form, [fieldName]: e.target.files?.[0] || null })} />
        </label>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">Register New Vehicle</h1>
        <p className="text-sm text-muted-foreground">Add a CNG vehicle to your fleet for card issuance</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0">
        {["Vehicle Type", "Vehicle Details", "Driver & Address", "Documents", "Review"].map((label, i) => {
          const s = i + 1
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step > s ? "bg-primary text-white" : step === s ? "bg-primary/20 text-primary ring-2 ring-primary/30" : "bg-muted text-muted-foreground"
                  }`}>{step > s ? "✓" : s}</div>
                <span className={`text-[9px] sm:text-[10px] font-medium whitespace-nowrap hidden sm:block ${step === s ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < 4 && <div className={`h-0.5 w-6 sm:w-10 mx-0.5 sm:mx-1 mb-4 shrink-0 ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          )
        })}
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        {/* Step 1: Vehicle Type */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Select Vehicle Onboarding Type</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { id: "new_purchase" as const, label: "New CNG Vehicle", desc: "Factory-fitted CNG from OEM dealer", icon: Truck, bg: "bg-blue-50 border-blue-200" },
                { id: "retrofit" as const, label: "Retrofitted Vehicle", desc: "Existing vehicle converted to CNG", icon: RefreshCw, bg: "bg-amber-50 border-amber-200" },
              ]).map((t) => {
                const Icon = t.icon
                return (
                  <button key={t.id} onClick={() => { setVehicleType(t.id); setForm({ ...form, oemId: "", dealerId: "", retrofitterId: "", category: "", model: "" }); }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${vehicleType === t.id ? "border-primary ring-2 ring-primary/20 " + t.bg : "border-border hover:border-muted-foreground/30"}`}>
                    <Icon className={`w-6 h-6 mb-2 ${vehicleType === t.id ? "text-primary" : "text-muted-foreground"}`} />
                    <p className={`font-semibold text-sm ${vehicleType === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                  </button>
                )
              })}
            </div>
            <div className={`p-3 rounded-lg text-xs ${vehicleType === "new_purchase" ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
              {vehicleType === "new_purchase"
                ? "New vehicles require L1 (pre-delivery) and L2 (post-delivery) approvals before card issuance."
                : "Retrofitted vehicles go directly to L2 approval. Ensure all CNG conversion documents are ready."}
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Details - Cascading Dropdowns */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">
              {vehicleType === "new_purchase" ? "New Vehicle Details" : "Retrofitted Vehicle Details"}
            </p>

            {vehicleType === "new_purchase" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* OEM Selection */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">OEM / Manufacturer <span className="text-destructive">*</span></label>
                  <select
                    value={form.oemId}
                    onChange={(e) => setForm({ ...form, oemId: e.target.value, dealerId: "", category: "", model: "" })}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select OEM</option>
                    {oems.filter(o => o.type === "New Vehicle").map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>

                {/* Dealership Selection */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Dealership Name <span className="text-destructive">*</span></label>
                  <select
                    value={form.dealerId}
                    onChange={(e) => setForm({ ...form, dealerId: e.target.value })}
                    disabled={!form.oemId}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                  >
                    <option value="">Select Dealership</option>
                    {availableDealers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} - {d.city}</option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Category */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Vehicle Category <span className="text-destructive">*</span></label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as VehicleCategory, model: "" })}
                    disabled={!form.oemId}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                  >
                    <option value="">Select Category</option>
                    {availableCategories.map(c => (
                      <option key={c} value={c}>
                        {c === "HCV" ? "HCV (≥15T)" : c === "ICV" ? "ICV (≥10T, <15T)" : c === "LCV" ? "LCV (>3.5T, <10T)" : "Bus"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Model */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Vehicle Model <span className="text-destructive">*</span></label>
                  <select
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    disabled={!form.category}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="__other">Other (specify)</option>
                  </select>
                  {form.model === "__other" && (
                    <input
                      type="text"
                      placeholder="Enter model name"
                      value={form.customModel}
                      onChange={(e) => setForm({ ...form, customModel: e.target.value })}
                      className="w-full mt-2 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </div>

                <Field label="Vehicle Booking Receipt No." name="vehicleNumber" placeholder="Booking reference" required />
                <Field label="Vehicle Booking Date" name="bookingDate" type="date" required />
              </div>
            ) : (
              /* Retrofit flow */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Retrofitter Selection */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Retrofitter Name <span className="text-destructive">*</span></label>
                  <select
                    value={form.retrofitterId}
                    onChange={(e) => setForm({ ...form, retrofitterId: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select Retrofitter</option>
                    {retrofitters.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Category */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Vehicle Category <span className="text-destructive">*</span></label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as VehicleCategory })}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select Category</option>
                    <option value="LCV">LCV ({'>'}3.5T, {'<'}10T)</option>
                    <option value="ICV">ICV (≥10T, {'<'}15T)</option>
                    <option value="HCV">HCV (≥15T)</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>

                <Field label="Vehicle Registration Number" name="vehicleNumber" placeholder="MH04AB1234" required />
                <Field label="Vehicle Registration Date" name="registrationDate" type="date" required />

                {vehicleAge && (
                  <div className="sm:col-span-2 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground">Vehicle Age (calculated)</p>
                    <p className="text-sm font-semibold text-foreground">{vehicleAge.years} years, {vehicleAge.months} months</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Driver & Delivery Address */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Driver Details & Card Delivery Address</p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              Driver details are optional. Card delivery address is required for physical card dispatch.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Driver Name" name="driverName" placeholder="Full name" />
              <Field label="Driver Contact Number" name="driverContact" type="tel" placeholder="10-digit mobile" />
              <Field label="Driver License Number" name="driverLicense" placeholder="DL number" />
              <FileField label="Driver License Copy" fieldName="driverLicenseFile" />
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Card Delivery Address <span className="text-destructive">*</span></label>
                <textarea
                  rows={2}
                  placeholder="Full address with PIN code for card delivery"
                  value={form.deliveryAddress}
                  onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">
              {vehicleType === "new_purchase" ? "L1 Pre-Delivery Documents" : "L2 Retrofitment Documents"}
            </p>
            {vehicleType === "new_purchase" ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  <strong>L1 Review:</strong> Upload booking receipt now. Delivery challan and RC Book are required for L2 approval after delivery.
                </div>
                <FileField label="Vehicle Booking Receipt" fieldName="bookingReceipt" required />
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Post-Delivery Documents (for L2 - can upload later)</p>
                  <div className="space-y-3">
                    <FileField label="Delivery Challan / Delivery Note" fieldName="deliveryChallan" />
                    <FileField label="RTO Receipt / RC Book" fieldName="rcBook" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <strong>L2 Review:</strong> All documents are mandatory for retrofitted vehicles. Physical card will be ordered after L2 approval.
                </div>
                <FileField label="CNG Kit Installation Certificate" fieldName="cngCert" required />
                <FileField label="E-Fitment Certificate" fieldName="eFitment" required />
                <FileField label="RTO Endorsement (CNG conversion)" fieldName="rtoEndorsement" required />
                <FileField label="Type Approval Certificate" fieldName="typeApproval" required />
                <FileField label="Tax Invoice from Retrofitment Center" fieldName="taxInvoice" required />
                <FileField label="RC Book" fieldName="rcBook" required />
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && !submitted && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Review & Submit</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Onboarding Type", vehicleType === "new_purchase" ? "New Purchase" : "Retrofit"],
                ["Vehicle/Booking No.", form.vehicleNumber || "—"],
                ["Category", form.category || "—"],
                vehicleType === "new_purchase"
                  ? ["OEM", selectedOEM?.name || "—"]
                  : ["Retrofitter", retrofitters.find(r => r.id === form.retrofitterId)?.name || "—"],
                ["Model", form.model === "__other" ? form.customModel : form.model || "—"],
                vehicleType === "new_purchase"
                  ? ["Dealership", availableDealers.find(d => d.id === form.dealerId)?.name || "—"]
                  : ["Vehicle Age", vehicleAge ? `${vehicleAge.years}y ${vehicleAge.months}m` : "—"],
                ["Driver", form.driverName || "Not provided"],
                ["Delivery Address", form.deliveryAddress ? "Provided" : "Not provided"],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-medium text-foreground">{v}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary">
              By submitting, you confirm all uploaded documents are authentic. The vehicle will be sent to {vehicleType === "new_purchase" ? "L1 (MIC)" : "L2 (ZIC)"} for review.
            </div>
          </div>
        )}

        {submitted && (
          <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Vehicle Submitted for Review!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {vehicleType === "new_purchase"
                  ? "Your MIC officer will review the documents for L1 approval."
                  : "Your ZIC officer will review the documents for L2 approval."}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Expected TAT: 2-3 business days</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setSubmitted(false); setStep(1); setForm({ ...form, vehicleNumber: "", oemId: "", dealerId: "", retrofitterId: "", category: "", model: "", customModel: "" }); }}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">
                Add Another Vehicle
              </button>
              <button onClick={() => onViewChange("fo-vehicles")}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                View My Vehicles
              </button>
            </div>
          </div>
        )}

        {!submitted && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted">
              Back
            </button>
            {step < 5 ? (
              <button onClick={() => setStep(step + 1)}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
                Continue
              </button>
            ) : (
              <button onClick={() => setSubmitted(true)}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
                Submit for Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FO Cards View ───────────────────────────────────────────────────────────
function FOCardsView({ onViewChange, onManageCard }: { onViewChange: (v: string) => void; onManageCard?: (vehicleId: string) => void }) {
  const [activatingCard, setActivatingCard] = useState<string | null>(null)
  const [pinStep, setPinStep] = useState<"enter" | "confirm" | "done">("enter")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [activeTab, setActiveTab] = useState<"vehicles" | "cards">("vehicles")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "CARD_ACTIVE" | "CARD_DISPATCHED" | "L1_APPROVED">("all")

  // Card Actions Menu States
  const [openMenuCard, setOpenMenuCard] = useState<string | null>(null)
  const [actionModal, setActionModal] = useState<"reset-pin" | "lock-unlock" | "block" | "limits" | "replacement" | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [cardLocked, setCardLocked] = useState<Record<string, boolean>>({})
  const [newPin, setNewPin] = useState("")
  const [confirmNewPin, setConfirmNewPin] = useState("")
  const [dailyLimit, setDailyLimit] = useState("5000")
  const [monthlyLimit, setMonthlyLimit] = useState("50000")
  const [replacementReason, setReplacementReason] = useState("")

  // Card Activation Flow States
  const [activationStep, setActivationStep] = useState<"confirmation" | "set-pin" | "confirm-pin" | "otp" | "success" | null>(null)
  const [activationCardId, setActivationCardId] = useState<string | null>(null)
  const [cardReceived, setCardReceived] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpResendCountdown, setOtpResendCountdown] = useState(0)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [activationPin, setActivationPin] = useState("")
  const [activationPinConfirm, setActivationPinConfirm] = useState("")

  // Load Card Flow States
  const [loadCardStep, setLoadCardStep] = useState<"amount" | "otp" | "success" | null>(null)
  const [loadCardId, setLoadCardId] = useState<string | null>(null)
  const [loadAmount, setLoadAmount] = useState("")
  const [loadOtp, setLoadOtp] = useState("")
  const [loadOtpAttempts, setLoadOtpAttempts] = useState(0)
  const [cardBalances, setCardBalances] = useState<Record<string, number>>({})

  const cards = myVehicles.filter((v) => v.cardNumber)

  // Filter vehicles based on search and status - only show vehicles post L1 approval with digital card issued
  const filteredVehicles = myVehicles.filter((v) => {
    // Only show vehicles that have passed L1 approval and have a card number (digital card issued)
    const isPostL1Approved = ["L1_APPROVED", "L2_SUBMITTED", "L2_APPROVED", "L2_REJECTED", "CARD_PRINTED", "CARD_DISPATCHED", "CARD_ACTIVE"].includes(v.status)
    const hasCard = v.cardNumber

    const matchesSearch = searchTerm === "" ||
      v.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.cardNumber && v.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || v.status === statusFilter
    return isPostL1Approved && hasCard && matchesSearch && matchesStatus
  })

  function CardVisual({ cardNumber, status }: { cardNumber: string; status: VehicleStatus }) {
    const isActive = status === "CARD_ACTIVE"
    const vehicleNumber = myVehicles.find(v => v.cardNumber === cardNumber)?.vehicleNumber || "MH 23 HD 2456"

    return (
      <div className={`relative w-full max-w-sm rounded-2xl p-6 text-white overflow-hidden h-56 flex flex-col justify-between ${isActive ? "bg-linear-to-br from-green-400 via-teal-400 to-blue-500" : "bg-linear-to-br from-gray-400 to-gray-600"}`}>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-16 translate-x-16" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10">
          {/* Top section: Logo & Company */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/90">MGL</p>
              <p className="text-sm font-bold uppercase tracking-wider text-white">Fleet</p>
              <p className="text-xs font-medium uppercase tracking-widest text-white/80">Connect</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase opacity-75">Fuel Card</p>
              <p className="text-xs font-bold text-white mt-1">Mahanagar Gas</p>
            </div>
          </div>

          {/* Chip - EMV style */}
          <div className="absolute left-6 top-32 w-12 h-9 bg-yellow-500 rounded-lg border-2 border-yellow-600 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-1 h-1 bg-yellow-700 rounded-sm" />
              <div className="w-1 h-1 bg-yellow-700 rounded-sm" />
              <div className="w-1 h-1 bg-yellow-700 rounded-sm" />
              <div className="w-1 h-1 bg-yellow-700 rounded-sm" />
            </div>
          </div>

          {/* Card Number */}
          <p className="text-2xl font-mono font-bold tracking-widest mb-2 text-white drop-shadow-sm mt-4">{cardNumber.toUpperCase()}</p>

          {/* Bottom section: Cardholder & Validity */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[8px] opacity-60 uppercase font-semibold">Card Holder</p>
              <p className="text-xs font-semibold text-white">{myFO.name.toUpperCase().slice(0, 18)}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] opacity-60 uppercase font-semibold">Valid Thru</p>
              <p className="text-xs font-mono font-bold text-white">12/27</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-5 h-full">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Cards</h1>
        <p className="text-sm text-muted-foreground">Manage your fleet fuel cards and vehicle wallets</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => { setActiveTab("vehicles"); setSearchTerm(""); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "vehicles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          Vehicle Card Wallets
        </button>
        <button
          onClick={() => { setActiveTab("cards"); setSearchTerm(""); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "cards"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          My Physical Cards
        </button>
      </div>

      {/* Vehicle Card Wallets Tab */}
      {activeTab === "vehicles" && (
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Search & Filter */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search by vehicle number or card..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Status</option>
              <option value="CARD_ACTIVE">Active</option>
              <option value="CARD_DISPATCHED">Dispatched</option>
              <option value="L1_APPROVED">Approved</option>
            </select>
          </div>

          {/* Vehicle Cards Table */}
          <div className="border border-border rounded-lg overflow-hidden flex-1 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2 font-semibold text-xs">Vehicle</th>
                    <th className="text-left px-4 py-2 font-semibold text-xs">Card</th>
                    <th className="text-right px-4 py-2 font-semibold text-xs">Card Balance</th>
                    <th className="text-right px-4 py-2 font-semibold text-xs">Incentive</th>
                    <th className="text-left px-4 py-2 font-semibold text-xs">Status</th>
                    <th className="text-center px-4 py-2 font-semibold text-xs">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No vehicles found</td></tr>
                  ) : (
                    filteredVehicles.map((v) => (
                      <tr key={v.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-4 py-3">{v.vehicleNumber}</td>
                        <td className="px-4 py-3 font-mono text-xs">{v.cardNumber || "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-blue-600 font-semibold">₹{(Math.random() * 5000 + 500).toFixed(0)}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-green-600 font-semibold">₹{(Math.random() * 1000).toFixed(0)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${v.status === "CARD_ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : v.status === "CARD_DISPATCHED"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                            {v.status === "CARD_ACTIVE" ? "Active" : v.status === "CARD_DISPATCHED" ? "Dispatched" : v.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {v.status === "CARD_ACTIVE" && (
                            <button
                              onClick={() => setActivatingCard(v.cardNumber || null)}
                              className="text-primary text-xs font-semibold hover:underline"
                            >
                              Manage
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Physical Cards Tab */}
      {activeTab === "cards" && (
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          <div className="space-y-4 flex flex-col flex-1 overflow-hidden">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pb-3 border-b border-border sticky top-0 bg-background z-10">
              <input
                type="text"
                placeholder="Search by vehicle, card number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="all">All Status</option>
                <option value="CARD_ACTIVE">Active</option>
                <option value="CARD_DISPATCHED">Dispatched</option>
                <option value="L1_APPROVED">Approved</option>
              </select>
            </div>

            {/* Results Summary */}
            {cards.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Displaying {cards.length} {cards.length === 1 ? "card" : "cards"}
              </div>
            )}

            {/* Card Grid - Responsive */}
            <div className="flex-1 overflow-y-auto pr-2">
              {cards.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium text-foreground">No cards found</p>
                    <p className="text-xs text-muted-foreground mt-1">Cards appear here after L2 approval</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {cards.map((v) => (
                    <div key={v.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{v.vehicleNumber || v.id}</p>
                          <p className="text-xs text-muted-foreground">{v.model} · {v.category}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${v.status === "CARD_ACTIVE" ? "bg-green-100 text-green-800" :
                            v.status === "CARD_DISPATCHED" ? "bg-blue-100 text-blue-800" :
                              v.status === "CARD_PRINTED" ? "bg-orange-100 text-orange-800" :
                                "bg-gray-100 text-gray-800"
                          }`}>
                          {v.status === "CARD_ACTIVE" ? "Active" :
                            v.status === "CARD_DISPATCHED" ? "Dispatched" :
                              v.status === "CARD_PRINTED" ? "Printing" : "Processing"}
                        </div>
                      </div>

                      {/* Card Image with Masked Number */}
                      <div className="mb-3">
                        <CardVisual cardNumber={v.cardNumber!} status={v.status} />
                        <p className="text-xs text-muted-foreground mt-2">Card: {v.cardNumber ? `••••${v.cardNumber.slice(-4)}` : "—"}</p>
                      </div>

                      {/* Wallets Side by Side */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-blue-700 font-semibold mb-1">Card Wallet</p>
                          <p className="text-sm font-bold text-blue-900">₹{(cardBalances[v.id] || 0).toLocaleString()}</p>
                          <p className="text-xs text-blue-600 mt-1">(Available)</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                          <p className="text-xs text-green-700 font-semibold mb-1">Incentive</p>
                          <p className="text-sm font-bold text-green-900">₹{(Math.random() * 2000).toFixed(0)}</p>
                          <p className="text-xs text-green-600 mt-1">(Coins)</p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setLoadCardId(v.id);
                            setLoadCardStep("amount");
                            setLoadAmount("");
                            setLoadOtp("");
                            setLoadOtpAttempts(0);
                          }}
                          disabled={v.status !== "CARD_ACTIVE"}
                          className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Load Card
                        </button>
                        <button
                          onClick={() => {
                            setActivationCardId(v.id);
                            setActivationStep("confirmation");
                            setCardReceived(false);
                            setActivationPin("");
                            setActivationPinConfirm("");
                            setOtp("");
                            setOtpAttempts(0);
                          }}
                          className="flex-1 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors">
                          Activate Card
                        </button>
                        {/* Card Actions Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuCard(openMenuCard === v.id ? null : v.id)}
                            className="px-3 py-2 border border-border rounded-lg text-xs font-semibold hover:bg-muted transition-colors">
                            ⋮
                          </button>
                          {openMenuCard === v.id && (
                            <div className="absolute right-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                              <button onClick={() => { setSelectedCard(v.id); setActionModal("reset-pin"); setOpenMenuCard(null); }} className="w-full text-left px-4 py-2 text-xs hover:bg-muted text-foreground border-b border-border">Reset PIN</button>
                              <button onClick={() => { setSelectedCard(v.id); setActionModal("lock-unlock"); setOpenMenuCard(null); }} className="w-full text-left px-4 py-2 text-xs hover:bg-muted text-foreground border-b border-border">Lock/Unlock Card</button>
                              <button onClick={() => { setSelectedCard(v.id); setActionModal("block"); setOpenMenuCard(null); }} className="w-full text-left px-4 py-2 text-xs hover:bg-muted text-foreground border-b border-border">Block Card</button>
                              <button onClick={() => { setSelectedCard(v.id); setActionModal("limits"); setOpenMenuCard(null); }} className="w-full text-left px-4 py-2 text-xs hover:bg-muted text-foreground border-b border-border">Set Limits</button>
                              <button onClick={() => { setSelectedCard(v.id); setActionModal("replacement"); setOpenMenuCard(null); }} className="w-full text-left px-4 py-2 text-xs hover:bg-muted text-foreground">Order Replacement</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {actionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 relative">
            {/* Reset PIN Modal */}
            {actionModal === "reset-pin" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Reset Card PIN</h3>
                <p className="text-sm text-muted-foreground mb-4">Enter and confirm a new 4-digit PIN for card {selectedCard}</p>
                <div className="space-y-3 mb-4">
                  <input type="password" placeholder="New PIN" value={newPin} onChange={(e) => setNewPin(e.target.value)} maxLength={4} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="password" placeholder="Confirm PIN" value={confirmNewPin} onChange={(e) => setConfirmNewPin(e.target.value)} maxLength={4} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                  <button onClick={() => { setActionModal(null); setNewPin(""); setConfirmNewPin(""); }} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">Reset PIN</button>
                </div>
              </div>
            )}

            {/* Lock/Unlock Modal */}
            {actionModal === "lock-unlock" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">{cardLocked[selectedCard!] ? "Unlock" : "Lock"} Card</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {cardLocked[selectedCard!]
                    ? "Card will be unlocked and transactions will be allowed again."
                    : "Card will be temporarily locked. No transactions will be allowed."}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                  <button
                    onClick={() => {
                      setCardLocked({ ...cardLocked, [selectedCard!]: !cardLocked[selectedCard!] });
                      setActionModal(null);
                    }}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">
                    {cardLocked[selectedCard!] ? "Unlock Card" : "Lock Card"}
                  </button>
                </div>
              </div>
            )}

            {/* Block Card Modal */}
            {actionModal === "block" && (
              <div>
                <h3 className="text-lg font-bold text-red-600 mb-4">Block Card</h3>
                <p className="text-sm text-muted-foreground mb-4">This action cannot be undone. The card will be permanently blocked and cannot be used for any transactions. A replacement card can be ordered.</p>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                  <button onClick={() => { setActionModal(null); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Block Card</button>
                </div>
              </div>
            )}

            {/* Set Limits Modal */}
            {actionModal === "limits" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Set Transaction Limits</h3>
                <p className="text-sm text-muted-foreground mb-4">Set daily and monthly spending limits for this card</p>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Daily Limit (₹)</label>
                    <input type="number" value={dailyLimit} onChange={(e) => setDailyLimit(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Monthly Limit (₹)</label>
                    <input type="number" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                  <button onClick={() => { setActionModal(null); }} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">Set Limits</button>
                </div>
              </div>
            )}

            {/* Order Replacement Modal */}
            {actionModal === "replacement" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Order Replacement Card</h3>
                <p className="text-sm text-muted-foreground mb-4">Request a replacement card. The new card will be sent to your registered address.</p>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-foreground mb-2 block">Reason for Replacement</label>
                  <select value={replacementReason} onChange={(e) => setReplacementReason(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select reason</option>
                    <option value="damaged">Card Damaged</option>
                    <option value="lost">Card Lost</option>
                    <option value="stolen">Card Stolen</option>
                    <option value="expired">Card Expired</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                  <button onClick={() => { setActionModal(null); setReplacementReason(""); }} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">Order Replacement</button>
                </div>
              </div>
            )}

            {/* Step 1: Physical Card Confirmation */}
            {activationStep === "confirmation" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Confirm Card Receipt</h3>
                <p className="text-sm text-muted-foreground mb-4">Please confirm you have received the physical card for Vehicle {myVehicles.find(v => v.id === activationCardId)?.vehicleNumber}.</p>
                <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
                  <p className="text-foreground font-semibold">Card Details:</p>
                  <p className="text-muted-foreground mt-2">Card: ••••{myVehicles.find(v => v.id === activationCardId)?.cardNumber?.slice(-4)}</p>
                  <p className="text-muted-foreground">Expiry: 12/27</p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" checked={cardReceived} onChange={(e) => setCardReceived(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-sm text-foreground">I confirm I have received the card.</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setActivationStep(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                  <button
                    onClick={() => { setActivationStep("set-pin"); setActivationPin(""); }}
                    disabled={!cardReceived}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Set PIN */}
            {activationStep === "set-pin" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Set Your Card PIN</h3>
                <p className="text-sm text-muted-foreground mb-4">Create a 4-digit PIN for your card. You'll use this PIN for all transactions.</p>
                <input
                  type="password"
                  placeholder="••••"
                  value={activationPin}
                  onChange={(e) => setActivationPin(e.target.value.slice(0, 4))}
                  maxLength={4}
                  className="w-full px-3 py-2 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
                />
                {activationPin && /^(\d)\1{3}$|^1234$|^4321$|^0123$|^9876$/.test(activationPin) && (
                  <p className="text-xs text-red-600 mb-3">PIN cannot be sequential or repetitive</p>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setActivationStep("confirmation")} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Back</button>
                  <button
                    onClick={() => setActivationStep("confirm-pin")}
                    disabled={activationPin.length < 4 || /^(\d)\1{3}$|^1234$|^4321$|^0123$|^9876$/.test(activationPin)}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Reconfirm PIN */}
            {activationStep === "confirm-pin" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Reconfirm PIN</h3>
                <p className="text-sm text-muted-foreground mb-4">Re-enter your PIN to confirm.</p>
                <input
                  type="password"
                  placeholder="••••"
                  value={activationPinConfirm}
                  onChange={(e) => setActivationPinConfirm(e.target.value.slice(0, 4))}
                  maxLength={4}
                  className="w-full px-3 py-2 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
                />
                {activationPin !== activationPinConfirm && activationPinConfirm && (
                  <p className="text-xs text-red-600 mb-3">PINs do not match</p>
                )}
                {activationPin === activationPinConfirm && activationPinConfirm && (
                  <p className="text-xs text-green-600 mb-3">PINs match</p>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setActivationStep("set-pin")} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Back</button>
                  <button
                    onClick={() => { setActivationStep("otp"); setOtp(""); setOtpAttempts(0); setOtpResendCountdown(30); }}
                    disabled={activationPin !== activationPinConfirm || activationPinConfirm.length < 4}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Enter OTP */}
            {activationStep === "otp" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Verify Your Identity</h3>
                <p className="text-sm text-muted-foreground mb-4">Enter the 6-digit OTP sent to your registered mobile ending in ••••23.</p>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6).replace(/\D/g, ""))}
                  maxLength={6}
                  className="w-full px-3 py-2 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
                />
                <div className="text-xs text-muted-foreground mb-4">
                  {otpResendCountdown > 0 ? (
                    <p>Resend OTP in {otpResendCountdown}s</p>
                  ) : (
                    <button onClick={() => setOtpResendCountdown(30)} className="text-primary hover:underline font-semibold">Resend OTP</button>
                  )}
                </div>
                {otpAttempts > 0 && <p className="text-xs text-red-600 mb-2">Invalid OTP. Attempts remaining: {3 - otpAttempts}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setActivationStep("confirm-pin")} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Back</button>
                  <button
                    onClick={() => {
                      if (otp === "123456") {
                        setActivationStep("success");
                      } else {
                        setOtpAttempts(otpAttempts + 1);
                        if (otpAttempts >= 2) {
                          setActivationStep(null);
                          setOtpAttempts(0);
                        }
                      }
                    }}
                    disabled={otp.length < 6}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    Verify OTP
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Card Activated */}
            {activationStep === "success" && (
              <div className="text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-lg font-bold text-green-600 mb-4">Card Activated Successfully!</h3>
                <p className="text-sm text-muted-foreground mb-4">Your card for Vehicle {myVehicles.find(v => v.id === activationCardId)?.vehicleNumber} is now active and ready to use.</p>
                <div className="mb-4 p-3 bg-green-50 rounded-lg text-sm border border-green-200 text-left">
                  <p className="text-foreground font-semibold mb-2">Next Steps:</p>
                  <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Load funds to start using your card</li>
                    <li>Share the PIN securely with your driver</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    setActivationStep(null);
                    setActivationCardId(null);
                  }}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">
                  Done
                </button>
              </div>
            )}

            {/* Close Button */}
            {activationStep !== "success" && (
              <button onClick={() => setActivationStep(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg">✕</button>
            )}
          </div>
        </div>
      )}

      {/* Load Card Modal */}
      {loadCardStep && loadCardId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setLoadCardStep(null);
                setLoadCardId(null);
                setLoadAmount("");
                setLoadOtp("");
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg"
            >
              ✕
            </button>

            {/* Progress Indicator */}
            <div className="flex gap-1 mb-6">
              {["amount", "otp", "success"].map((step, idx) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full ${["amount", "otp", "success"].indexOf(loadCardStep) >= idx ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

            {/* Step 1: Enter Amount */}
            {loadCardStep === "amount" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Load Card</h3>
                <p className="text-sm text-muted-foreground mb-4">Enter the amount you want to load on your card.</p>
                
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Card</p>
                  <p className="font-medium text-foreground">••••{myVehicles.find(v => v.id === loadCardId)?.cardNumber?.slice(-4)}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-muted-foreground mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={loadAmount}
                    onChange={(e) => setLoadAmount(e.target.value)}
                    min="100"
                    max="50000"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Min: ₹100 | Max: ₹50,000</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLoadCardStep(null);
                      setLoadCardId(null);
                    }}
                    className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setLoadCardStep("otp");
                      setLoadOtp("");
                      setLoadOtpAttempts(0);
                    }}
                    disabled={!loadAmount || parseInt(loadAmount) < 100}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {loadCardStep === "otp" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Verify with OTP</h3>
                <p className="text-sm text-muted-foreground mb-4">Enter the 6-digit OTP sent to your registered mobile. (Test: 123456)</p>

                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Load Amount</p>
                  <p className="text-lg font-bold text-foreground">₹{parseInt(loadAmount).toLocaleString()}</p>
                </div>

                <input
                  type="text"
                  placeholder="000000"
                  value={loadOtp}
                  onChange={(e) => setLoadOtp(e.target.value.slice(0, 6).replace(/\D/g, ""))}
                  maxLength={6}
                  className="w-full px-3 py-2 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
                />

                {loadOtpAttempts > 0 && <p className="text-xs text-red-600 mb-2">Invalid OTP. Attempts remaining: {3 - loadOtpAttempts}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={() => setLoadCardStep("amount")}
                    className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (loadOtp === "123456") {
                        setCardBalances({
                          ...cardBalances,
                          [loadCardId]: (cardBalances[loadCardId] || 0) + parseInt(loadAmount),
                        });
                        setLoadCardStep("success");
                      } else {
                        setLoadOtpAttempts(loadOtpAttempts + 1);
                        if (loadOtpAttempts >= 2) {
                          setLoadCardStep("amount");
                          setLoadOtpAttempts(0);
                        }
                      }
                    }}
                    disabled={loadOtp.length < 6}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {loadCardStep === "success" && (
              <div className="text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-lg font-bold text-green-600 mb-4">Load Successful!</h3>
                <p className="text-sm text-muted-foreground mb-4">₹{parseInt(loadAmount).toLocaleString()} has been loaded to your card.</p>
                
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 text-left">
                  <p className="text-xs text-foreground font-semibold mb-2">Card Balance Updated</p>
                  <p className="text-sm font-bold text-green-600">₹{(cardBalances[loadCardId] || 0).toLocaleString()}</p>
                </div>

                <button
                  onClick={() => {
                    setLoadCardStep(null);
                    setLoadCardId(null);
                    setLoadAmount("");
                  }}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── FO Fund Management ──────────────────────────────────────────────────────
function FOFundManagement() {
  const [activeTab, setActiveTab] = useState<"overview" | "load" | "allocate">("overview")
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [loadAmount, setLoadAmount] = useState("")
  const [selectedAllocationVehicle, setSelectedAllocationVehicle] = useState<string | null>(null)
  const [allocationAmount, setAllocationAmount] = useState("")

  const parentWalletBalance = 150000
  const totalAllocated = 45000
  const availableToLoad = parentWalletBalance - totalAllocated

  const allocationHistory = [
    { id: 1, vehicle: "MGL-001", amount: 15000, type: "Auto", date: "28 Feb 2025", status: "Success" },
    { id: 2, vehicle: "MGL-002", amount: 10000, type: "Manual", date: "27 Feb 2025", status: "Success" },
    { id: 3, vehicle: "MGL-003", amount: 8000, type: "Auto", date: "26 Feb 2025", status: "Success" },
    { id: 4, vehicle: "MGL-004", amount: 12000, type: "Manual", date: "25 Feb 2025", status: "Success" },
  ]

  const pgLoadHistory = [
    { id: 1, amount: 50000, date: "25 Feb 2025", status: "Settled", refId: "PG-2025-001" },
    { id: 2, amount: 75000, date: "22 Feb 2025", status: "Settled", refId: "PG-2025-002" },
  ]

  return (
    <div className="flex flex-col gap-5 p-5 h-full overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">Fund Management</h1>
        <p className="text-sm text-muted-foreground">Manage parent wallet and card allocations</p>
      </div>

      {/* Parent Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Parent Wallet Balance</p>
          <p className="text-2xl font-bold text-primary">₹{parentWalletBalance.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Allocated to Cards</p>
          <p className="text-2xl font-bold text-orange-600">₹{totalAllocated.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground font-semibold mb-1">Available for Load</p>
          <p className="text-2xl font-bold text-green-600">₹{availableToLoad.toLocaleString()}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: "overview", label: "Overview" },
          { id: "load", label: "Load from PG" },
          { id: "allocate", label: "Allocate to Cards" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-4">
          {/* Fund Allocation History */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-4">Recent Allocations</h3>
            <div className="space-y-3">
              {allocationHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{item.vehicle}</p>
                    <p className="text-xs text-muted-foreground">{item.type} Load • {item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₹{item.amount.toLocaleString()}</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PG Load History */}
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="font-semibold text-foreground mb-4">PG Load History</h3>
            <div className="space-y-3">
              {pgLoadHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{item.refId}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₹{item.amount.toLocaleString()}</p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Load from PG Tab */}
      {activeTab === "load" && (
        <div className="max-w-md space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900"><strong>Note:</strong> Funds will be credited to your parent wallet on T+1 day after successful PG processing.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Amount to Load (₹)</label>
            <input
              type="number"
              value={loadAmount}
              onChange={(e) => setLoadAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Proceed to Payment Gateway
          </button>
        </div>
      )}

      {/* Allocate to Cards Tab */}
      {activeTab === "allocate" && (
        <div className="max-w-md space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900"><strong>Available:</strong> ₹{availableToLoad.toLocaleString()} for allocation</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Select Vehicle</label>
            <select
              value={selectedAllocationVehicle || ""}
              onChange={(e) => setSelectedAllocationVehicle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Choose a vehicle</option>
              {myVehicles.filter(v => v.status === "L1_APPROVED" || v.status === "CARD_ACTIVE").map((v) => (
                <option key={v.id} value={v.id}>
                  {v.vehicleNumber} • Current: ₹{(Math.random() * 10000).toFixed(0)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Allocation Method</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 flex-1">
                <input type="radio" name="method" defaultChecked className="w-4 h-4" />
                <span className="text-sm">Auto Load</span>
              </label>
              <label className="flex items-center gap-2 flex-1">
                <input type="radio" name="method" className="w-4 h-4" />
                <span className="text-sm">Manual Load</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Amount (₹)</label>
            <input
              type="number"
              value={allocationAmount}
              onChange={(e) => setAllocationAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Allocate Funds
          </button>
        </div>
      )}
    </div>
  )
}

// ─── FO Delivery Tracking ──────────────��──────────────────────────────────────
function FODeliveryTracking() {
  const dispatched = myVehicles.filter((v) => v.trackingId)

  const trackingEvents = [
    { label: "Card Ordered", done: true, date: "12 Feb 2025" },
    { label: "Card Printed", done: true, date: "13 Feb 2025" },
    { label: "Dispatched via DTDC", done: true, date: "14 Feb 2025" },
    { label: "In Transit – Mumbai", done: true, date: "14 Feb 2025" },
    { label: "Out for Delivery", done: true, date: "15 Feb 2025" },
    { label: "Delivered", done: true, date: "15 Feb 2025" },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Card Delivery Tracking</h1>
        <p className="text-sm text-muted-foreground">Track physical card delivery for your fleet</p>
      </div>

      {dispatched.map((v) => (
        <div key={v.id} className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{v.cardNumber}</p>
                <p className="text-xs text-muted-foreground">{v.vehicleNumber} · {v.foName}</p>
              </div>
            </div>
            <VehicleStatusBadge status={v.status} />
          </div>

          {/* Tracking info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-xs">
            {[
              ["Courier", "DTDC / Blue Dart"],
              ["Tracking ID", v.trackingId || "—"],
              ["Dispatch Date", v.cardDispatchDate || "—"],
              ["Delivery Address", myFO.deliveryAddress],
              ["Delivered On", v.cardDeliveryDate || "In Transit"],
            ].map(([k, val]) => (
              <div key={k}>
                <p className="text-muted-foreground">{k}</p>
                <p className="font-medium text-foreground truncate">{val}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Delivery Timeline</p>
            <div className="space-y-2">
              {trackingEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${ev.done ? "bg-primary" : "bg-muted border border-border"}`}>
                    {ev.done && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className={`h-4 w-0.5 absolute left-[37px] ${i < trackingEvents.length - 1 ? "block" : "hidden"}`} />
                  <div className="flex-1 flex items-center justify-between">
                    <p className={`text-sm ${ev.done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{ev.label}</p>
                    <p className="text-xs text-muted-foreground">{ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {dispatched.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No cards dispatched yet</p>
          <p className="text-xs mt-1">Tracking information will appear once your card ships</p>
        </div>
      )}
    </div>
  )
}

// ─── FO Notifications ───────────────────────────────���─────────────────────────
function FONotificationsView() {
  const notifs = [
    { title: "Document Rejected — Action Required", message: "Vehicle MH04EF9012 L1 documents rejected. Reason: Booking receipt is unclear. Please resubmit.", type: "error", time: "2 hrs ago", read: false },
    { title: "Card Dispatched", message: "Your CNG card MGL****7832 has been dispatched. Tracking ID: BLUEDART987654", type: "success", time: "1 day ago", read: true },
    { title: "Vehicle L1 Approved", message: "Vehicle MH04AB1234 has been approved by your MIC officer. Awaiting delivery documents.", type: "success", time: "3 days ago", read: true },
    { title: "MoU Execution Confirmation", message: "Your MoU MGL/MOU/2025/001 has been executed. Onboarding is now active.", type: "info", time: "5 days ago", read: true },
  ]
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">{notifs.filter((n) => !n.read).length} unread</p>
      </div>
      <div className="space-y-2">
        {notifs.map((n, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${!n.read ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}>
            <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.type === "success" ? "bg-green-500" : n.type === "error" ? "bg-red-500" : "bg-blue-500"}`} />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
