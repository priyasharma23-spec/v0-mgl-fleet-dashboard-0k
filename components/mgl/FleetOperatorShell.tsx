"use client"

import { useState } from "react"
import {
  Truck, CreditCard, MapPin, Bell, LayoutDashboard, UserPlus, Upload,
  CheckCircle, Clock, XCircle, AlertCircle, Package, Eye, EyeOff,
  ChevronRight, ArrowRight, Shield, Smartphone, Star, RefreshCw
} from "lucide-react"
import Image from "next/image"
import MGLHeader from "@/components/mgl/MGLHeader"
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter"
import FOWalletView from "@/components/mgl/FOWalletView"
import FOCardWalletsView from "@/components/mgl/FOCardWalletsView"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import FOWalletView from "@/components/mgl/FOWalletView"
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
      case "fo-card-wallets": return <FOCardWalletsView />
      case "fo-cards": return <FOCardsView onViewChange={setActiveView} />
      case "fo-vehicles": return <FOVehiclesList onViewChange={setActiveView} />
      case "fo-add-vehicle": return <FOAddVehicle onViewChange={setActiveView} />
      case "fo-delivery": return <FODeliveryTracking />
      case "fo-notifications": return <FONotificationsView />
      // Account Management
      case "fo-account": return <FOPlaceholder title="Account Settings" description="Manage your account details and profile information" />
      case "fo-security": return <FOPlaceholder title="Security & Access" description="Manage security settings, passwords, and access permissions" />
      // Driver Management
      case "fo-drivers": return <FOPlaceholder title="Driver Management" description="Add, manage, and track your fleet drivers" />
      // Fund Management
      case "fo-funds": return <FOPlaceholder title="Fund Management" description="Manage fund allocation and wallet distributions" />
      // Transaction Management
      case "fo-transactions": return <FOPlaceholder title="Transaction History" description="View detailed transaction history and records" />
      // Reports
      case "fo-reports": return <FOPlaceholder title="Reports & Analytics" description="Generate and download transaction reports" />
      // Incentives & Loyalty
      case "fo-incentives": return <FOPlaceholder title="Incentives & Loyalty" description="View available incentives, loyalty rewards, and offers" />
      // Support
      case "fo-support": return <FOPlaceholder title="Support Tickets" description="Manage your support requests and get help" />
      // Analytics
      case "fo-analytics": return <FOPlaceholder title="Analytics & Insights" description="View fleet analytics and business insights" />
      default: return <FODashboard onViewChange={setActiveView} />
    }
  }

  // Placeholder component for coming soon modules
  const FOPlaceholder = ({ title, description }: { title: string; description: string }) => (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
            <Clock className="w-4 h-4" />
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  )

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

// ─── FO Signup Flow ─────────────────────────────────────────────────────────
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0faf3] via-white to-[#e8f4ff] flex items-center justify-center p-4">
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
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    step > s ? "bg-primary text-white" : step === s ? "bg-primary/20 text-primary ring-2 ring-primary/30" : "bg-muted text-muted-foreground"
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

// ─── FO Dashboard ────────────────────────────────────────────────────────────
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
        })}
      </div>
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
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step > s ? "bg-primary text-white" : step === s ? "bg-primary/20 text-primary ring-2 ring-primary/30" : "bg-muted text-muted-foreground"
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
function FOCardsView({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activatingCard, setActivatingCard] = useState<string | null>(null)
  const [pinStep, setPinStep] = useState<"enter" | "confirm" | "done">("enter")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")

  const cards = myVehicles.filter((v) => v.cardNumber)

  function CardVisual({ cardNumber, status }: { cardNumber: string; status: VehicleStatus }) {
    const isActive = status === "CARD_ACTIVE"
    return (
      <div className={`relative w-full max-w-xs rounded-2xl p-5 text-white overflow-hidden ${isActive ? "bg-[#1565C0]" : "bg-gray-500"}`}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-10 -translate-x-8" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70">MGL Fleet Card</p>
              <p className="text-xs font-medium opacity-90">CNG Fuel Card</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#F5A800]" />
            </div>
          </div>
          <p className="text-lg font-mono font-bold tracking-widest mb-4">{cardNumber.replace("****", "•••• •••• ")}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] opacity-60 uppercase">Card Holder</p>
              <p className="text-xs font-semibold">{myFO.name.toUpperCase().slice(0, 20)}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-green-400 text-green-900" : "bg-gray-300 text-gray-800"}`}>
              {isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">My CNG Cards</h1>
        <p className="text-sm text-muted-foreground">Manage your fleet fuel cards</p>
      </div>

      {activatingCard ? (
        <div className="max-w-md mx-auto w-full bg-card rounded-2xl border border-border p-6">
          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-bold text-foreground">Card Activation & PIN Setup</h2>
            <p className="text-sm text-muted-foreground mt-1">Card: {activatingCard}</p>
          </div>

          {pinStep === "enter" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Enter 4-digit PIN</label>
                <input type="password" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)}
                  placeholder="• • • •"
                  className="w-full mt-1 px-3 py-3 rounded-lg border border-border bg-input text-center text-xl font-bold tracking-[1em] focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <p className="text-xs text-muted-foreground text-center">Choose a secure PIN. Do not share with anyone.</p>
              <button onClick={() => pin.length === 4 && setPinStep("confirm")} disabled={pin.length < 4}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-primary/90">
                Continue
              </button>
            </div>
          )}

          {pinStep === "confirm" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Confirm PIN</label>
                <input type="password" maxLength={4} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="• • • •"
                  className="w-full mt-1 px-3 py-3 rounded-lg border border-border bg-input text-center text-xl font-bold tracking-[1em] focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {confirmPin.length === 4 && confirmPin !== pin && (
                <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> PINs do not match</p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setPinStep("enter")} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">Back</button>
                <button onClick={() => confirmPin === pin && confirmPin.length === 4 && setPinStep("done")}
                  disabled={confirmPin !== pin || confirmPin.length < 4}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-primary/90">
                  Activate Card
                </button>
              </div>
            </div>
          )}

          {pinStep === "done" && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Card Activated!</p>
                <p className="text-sm text-muted-foreground mt-1">Your card is now active and ready to use at CNG stations.</p>
              </div>
              <button onClick={() => { setActivatingCard(null); setPinStep("enter"); setPin(""); setConfirmPin(""); }}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">
                Back to Cards
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((v) => (
            <div key={v.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <CardVisual cardNumber={v.cardNumber!} status={v.status} />
                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">{v.vehicleNumber || v.id}</p>
                    <p className="text-xs text-muted-foreground">{v.model} · {v.category}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      ["Card No.", v.cardNumber!],
                      ["Status", v.status.replace(/_/g, " ")],
                      ["Dispatch Date", v.cardDispatchDate || "—"],
                      ["Activated", v.cardActivatedAt || "Pending"],
                    ].map(([k, val]) => (
                      <div key={k}>
                        <p className="text-muted-foreground">{k}</p>
                        <p className="font-semibold text-foreground">{val}</p>
                      </div>
                    ))}
                  </div>
                  {v.status === "CARD_DISPATCHED" && (
                    <button onClick={() => { setActivatingCard(v.cardNumber!); setPinStep("enter"); setPin(""); setConfirmPin(""); }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F5A800] text-white rounded-lg text-sm font-semibold hover:bg-[#e09800] transition-colors">
                      <Shield className="w-4 h-4" />
                      Activate Card & Set PIN
                    </button>
                  )}
                  {v.status === "CARD_ACTIVE" && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-green-700 font-medium">Card is active and ready to use</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {cards.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No cards issued yet</p>
              <p className="text-xs mt-1">Cards are issued after L2 approval</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── FO Delivery Tracking ─────────────────────────────────────────────────────
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

// ─── FO Notifications ─────────────────────────────────────────────────────────
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
