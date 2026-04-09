"use client"
// Fleet Operator Shell - Restored from v54

import { useState } from "react"
import {
  Truck, CreditCard, MapPin, Bell, LayoutDashboard, UserPlus, Upload,
  CheckCircle, Clock, XCircle, AlertCircle, Package, Eye, EyeOff,
  ChevronRight, ArrowRight, Shield, Smartphone, Star, RefreshCw, Info, Search, X, History, Gift, Bus,
  Download, Filter, Wallet
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

// SELF_SERVICE FO data for testing
const myFO_SS = mockFleetOperators.find(f => f.id === "FO005") ?? mockFleetOperators[0]
const myVehicles_SS = mockVehicles.filter((v) => v.foId === "FO005")

export default function FleetOperatorShell({ user, onLogout, onboardingType = "SELF_SERVICE", isNewRegistration = false }: Props) {
  const [activeView, setActiveView] = useState("fo-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(onboardingType === "MIC_ASSISTED")
  const [selectedCardVehicle, setSelectedCardVehicle] = useState<string | null>(null)
  const [actionModal, setActionModal] = useState<"reset-pin" | "lock" | "block" | "limits" | "replacement" | null>(null)

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
      case "fo-transactions": return <FOTransactionsView />
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
      case "fo-vehicles": return <FOVehiclesList onViewChange={setActiveView} onboardingType={onboardingType} />
      case "fo-add-vehicle": return <FOAddVehicle onViewChange={setActiveView} onboardingType={onboardingType} />
      case "fo-funds": return <FOFundManagement />
      case "fo-delivery": return <FODeliveryTracking />
      case "fo-notifications": return <FONotificationsView />
      case "fo-mou": return <FOMoUView />
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
  const [noGstn, setNoGstn] = useState(false)
  const [sameAddress, setSameAddress] = useState(false)
  const [form, setForm] = useState({
    name: "", contact: "", email: "", pan: "", gstn: "",
    address: "", state: "", city: "", pincode: "",
    deliveryAddress: "", deliveryState: "", deliveryCity: "", deliveryPincode: "",
    password: "", confirmPassword: ""
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
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-muted-foreground">GSTN Number</label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={noGstn} onChange={e => { setNoGstn(e.target.checked); if(e.target.checked) setForm({...form, gstn: ""}) }}
                        className="w-3.5 h-3.5 rounded" />
                      <span className="text-xs text-muted-foreground">I don't have GSTN</span>
                    </label>
                  </div>
                  {!noGstn && (
                    <input type="text" placeholder="27AABCA1234F1Z5" value={form.gstn}
                      onChange={e => setForm({...form, gstn: e.target.value})}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  )}
                  {noGstn && <p className="text-xs text-amber-600 mt-1">GST registration may be required for certain incentive programs.</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Registered Business Address <span className="text-destructive">*</span></label>
                  <input type="text" placeholder="Flat/Shop No., Building, Street" value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">State <span className="text-destructive">*</span></label>
                  <select value={form.state || ""} onChange={e => setForm({...form, state: e.target.value, city: ""})}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm">
                    <option value="">Select State</option>
                    {["Maharashtra","Gujarat","Karnataka","Tamil Nadu","Delhi","Rajasthan","Uttar Pradesh","West Bengal","Telangana","Punjab"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">City <span className="text-destructive">*</span></label>
                  <select value={form.city || ""} onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm">
                    <option value="">Select City</option>
                    {(form.state === "Maharashtra" ? ["Mumbai","Pune","Nagpur","Thane","Nashik"] :
                      form.state === "Gujarat" ? ["Ahmedabad","Surat","Vadodara","Rajkot"] :
                      form.state === "Karnataka" ? ["Bengaluru","Mysuru","Hubli","Mangaluru"] :
                      form.state === "Delhi" ? ["New Delhi","Dwarka","Rohini","Noida"] :
                      ["Select State first"]).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Pincode <span className="text-destructive">*</span></label>
                  <input type="text" placeholder="400001" maxLength={6} value={form.pincode || ""}
                    onChange={e => setForm({...form, pincode: e.target.value.replace(/\D/g, "")})}
                    className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-muted-foreground">Card Delivery Address <span className="text-destructive">*</span></label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={sameAddress} onChange={e => setSameAddress(e.target.checked)}
                        className="w-3.5 h-3.5 rounded" />
                      <span className="text-xs text-muted-foreground">Same as registered address</span>
                    </label>
                  </div>
                  {!sameAddress && (
                    <>
                      <input type="text" placeholder="Flat/Shop No., Building, Street" value={form.deliveryAddress}
                        onChange={e => setForm({...form, deliveryAddress: e.target.value})}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-input text-sm mb-2" />
                      <div className="grid grid-cols-3 gap-2">
                        <select value={form.deliveryState || ""} onChange={e => setForm({...form, deliveryState: e.target.value})}
                          className="px-3 py-2.5 rounded-lg border border-border bg-input text-sm">
                          <option value="">State</option>
                          {["Maharashtra","Gujarat","Karnataka","Tamil Nadu","Delhi","Rajasthan","Uttar Pradesh","West Bengal","Telangana","Punjab"].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={form.deliveryCity || ""} onChange={e => setForm({...form, deliveryCity: e.target.value})}
                          className="px-3 py-2.5 rounded-lg border border-border bg-input text-sm">
                          <option value="">City</option>
                          {(form.deliveryState === "Maharashtra" ? ["Mumbai","Pune","Nagpur","Thane","Nashik"] :
                            form.deliveryState === "Gujarat" ? ["Ahmedabad","Surat","Vadodara","Rajkot"] :
                            form.deliveryState === "Karnataka" ? ["Bengaluru","Mysuru","Hubli","Mangaluru"] :
                            ["Select State"]).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="text" placeholder="Pincode" maxLength={6} value={form.deliveryPincode || ""}
                          onChange={e => setForm({...form, deliveryPincode: e.target.value.replace(/\D/g, "")})}
                          className="px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
                      </div>
                    </>
                  )}
                  {sameAddress && <p className="text-xs text-muted-foreground mt-1">Card will be delivered to your registered address.</p>}
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
function FOVehiclesList({ onViewChange, onboardingType = "MIC_ASSISTED" }: { onViewChange: (v: string) => void; onboardingType?: string }) {
  const vehicles = onboardingType === "SELF_SERVICE" ? myVehicles_SS : myVehicles
  const fo = onboardingType === "SELF_SERVICE" ? myFO_SS : myFO
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null)
  const [showTimeline, setShowTimeline] = useState(false)
  const [showIncentive, setShowIncentive] = useState(false)
  const [l2Files, setL2Files] = useState<Record<string, File | null>>({})
  const [l2Submitted, setL2Submitted] = useState(false)
  const [l2Dates, setL2Dates] = useState<Record<string, string>>({})
  const [l1Files, setL1Files] = useState<Record<string, File | null>>({})
  const [l1Submitted, setL1Submitted] = useState(false)

  const openVehicle = (v: typeof vehicles[0]) => {
    setSelectedVehicle(v)
    setL2Files({})
    setL2Dates({})
    setL2Submitted(false)
    setL1Files({})
    setL1Submitted(false)
    setShowTimeline(false)
    setShowIncentive(false)
  }

  const filtered = vehicles.filter(v => {
    const matchSearch = !search || (v.vehicleNumber || v.id).toLowerCase().includes(search.toLowerCase()) || v.oem?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || v.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === "CARD_ACTIVE").length,
    pending: vehicles.filter(v => ["DRAFT","L1_SUBMITTED","L1_APPROVED","L2_SUBMITTED","CARD_PRINTED","CARD_DISPATCHED"].includes(v.status)).length,
    rejected: vehicles.filter(v => ["L1_REJECTED","L2_REJECTED"].includes(v.status)).length,
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Vehicles</h1>
            <p className="text-sm text-muted-foreground">{vehicles.length} vehicles registered</p>
        </div>
        <button onClick={() => onViewChange("fo-add-vehicle")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          + Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Vehicles", value: counts.total, icon: Truck, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
          { label: "Active", value: counts.active, icon: CheckCircle, iconBg: "bg-green-100", iconColor: "text-green-600" },
          { label: "In Progress", value: counts.pending, icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
          { label: "Action Needed", value: counts.rejected, icon: AlertCircle, iconBg: "bg-red-100", iconColor: "text-red-600" },
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

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by vehicle number or OEM..." className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm bg-card">
          <option value="all">All Status</option>
          <option value="CARD_ACTIVE">Active</option>
          <option value="L1_SUBMITTED">L1 Review</option>
          <option value="L1_APPROVED">L1 Approved</option>
          <option value="L2_SUBMITTED">L2 Review</option>
          <option value="L1_REJECTED">L1 Rejected</option>
          <option value="L2_REJECTED">L2 Rejected</option>
          <option value="CARD_DISPATCHED">Card Dispatched</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const steps: { label: string; status: "done" | "active" | "pending" }[] = v.onboardingType === "SELF_SERVICE" ? [
            { label: "Registered", status: "done" },
            { label: "Under Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },
            { label: "Card Issued", status: v.cardActivatedAt ? "done" : v.cardNumber ? "active" : "pending" },
          ] : [
            { label: "Registered", status: "done" },
            { label: "L1 Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },
            { label: "L2 Review", status: v.l2ApprovedAt ? "done" : v.l2SubmittedAt ? "active" : "pending" },
            { label: "Card Issued", status: v.cardActivatedAt ? "done" : v.cardNumber ? "active" : "pending" },
          ]
          return (
            <div key={v.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    v.vehicleType === "retrofit" ? "bg-amber-100" :
                    v.category === "Bus" ? "bg-purple-100" :
                    v.category === "HCV" ? "bg-blue-100" :
                    v.category === "ICV" ? "bg-green-100" :
                    v.category === "LCV" ? "bg-teal-100" :
                    "bg-gray-100"
                  }`}>
                    {v.vehicleType === "retrofit" ? (
                      <RefreshCw className={`w-5 h-5 text-amber-600`} />
                    ) : v.category === "Bus" ? (
                      <Bus className={`w-5 h-5 text-purple-600`} />
                    ) : v.category === "HCV" ? (
                      <Truck className={`w-5 h-5 text-blue-600`} />
                    ) : v.category === "ICV" ? (
                      <Truck className={`w-5 h-5 text-green-600`} />
                    ) : (
                      <Truck className={`w-5 h-5 text-teal-600`} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{v.vehicleNumber || v.id}</p>
                    <p className="text-xs text-muted-foreground">{v.oem} {v.model} · {v.category} · {v.onboardingType === "SELF_SERVICE" ? "Self-Service" : v.vehicleType === "retrofit" ? "Retrofitment" : "New Purchase"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {v.onboardingType === "SELF_SERVICE" ? (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      v.status === "L1_SUBMITTED" ? "bg-amber-100 text-amber-700" :
                      v.status === "L1_APPROVED" || v.status === "CARD_ACTIVE" || v.status === "CARD_DISPATCHED" || v.status === "CARD_PRINTED" ? "bg-green-100 text-green-700" :
                      v.status === "L1_REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {v.status === "L1_SUBMITTED" ? "Under Review" :
                       v.status === "L1_APPROVED" ? "Approved" :
                       v.status === "L1_REJECTED" ? "Rejected" :
                       v.status === "CARD_ACTIVE" ? "Active" :
                       v.status === "CARD_DISPATCHED" ? "Card Dispatched" :
                       v.status === "CARD_PRINTED" ? "Card Printing" :
                       v.status}
                    </span>
                  ) : (
                    <VehicleStatusBadge status={v.status} />
                  )}
                  <button onClick={() => openVehicle(v)} className="p-1.5 hover:bg-muted rounded-lg ml-1">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto mb-3">
                <WorkflowStepper steps={steps} />
              </div>

              {/* MOU & Incentive — MIC_ASSISTED only */}
              {v.onboardingType === "MIC_ASSISTED" && v.mouId && (
                <div className="flex items-center justify-between mt-2 pt-2 mb-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-mono">{v.mouId}</span>
                    {v.categorySequence && (
                      <span className="text-xs text-muted-foreground">· {v.category} #{v.categorySequence}</span>
                    )}
                  </div>
                  {v.incentiveStatus && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      v.incentiveStatus === "paid" ? "bg-green-100 text-green-700" :
                      v.incentiveStatus === "approved" ? "bg-blue-100 text-blue-700" :
                      v.incentiveStatus === "eligible" ? "bg-amber-100 text-amber-700" :
                      v.incentiveStatus === "pending_approval" ? "bg-purple-100 text-purple-700" :
                      v.incentiveStatus === "not_eligible" ? "bg-gray-100 text-gray-500" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {v.incentiveStatus === "paid" ? "✓ Incentive Paid" :
                       v.incentiveStatus === "approved" ? "✓ Incentive Approved" :
                       v.incentiveStatus === "eligible" ? "⬆ Eligible" :
                       v.incentiveStatus === "pending_approval" ? "⏳ Pending Approval" :
                       v.incentiveStatus === "not_eligible" ? "Awaiting 2nd Vehicle" :
                       ""}
                    </span>
                  )}
                </div>
              )}

              {/* L1 Approved banner */}
              {v.status === "L1_APPROVED" && (
                <div className="border-l-4 border-blue-600 bg-blue-50 px-3 py-2 rounded-r-lg flex items-center justify-between mb-3">
                  {v.onboardingType === "SELF_SERVICE" ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-blue-900">Approved</p>
                        <p className="text-[11px] text-blue-700">Card issuance in progress</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-blue-900">L1 Approved</p>
                          <p className="text-[11px] text-blue-700">Complete L2 Registration to proceed</p>
                        </div>
                      </div>
                      <button onClick={() => openVehicle(v)} className="text-blue-700 hover:text-blue-900 font-semibold whitespace-nowrap text-xs">Complete →</button>
                    </>
                  )}
                </div>
              )}

              {/* Action Required banner */}
              {(v.status === "L1_REJECTED" || v.status === "L2_REJECTED") && (
                <div className="border-l-4 border-red-600 bg-red-50 px-3 py-2 rounded-r-lg flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-red-900">Action Required</p>
                      <p className="text-[11px] text-red-700">{v.l1Comments || v.l2Comments || "Please re-upload the required documents."}</p>
                    </div>
                  </div>
                  <button className="text-red-700 hover:text-red-900 font-semibold whitespace-nowrap text-xs">Resubmit →</button>
                </div>
              )}

              {/* Card info */}
              {v.cardNumber && (
                <div className="border-l-4 border-green-600 bg-green-50 px-3 py-2 rounded-r-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-600 shrink-0" />
                    <p className="text-xs font-semibold text-green-900">Card: {v.cardNumber}</p>
                  </div>
                  {v.trackingId && <p className="text-xs text-muted-foreground">Track: {v.trackingId}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedVehicle && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedVehicle(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">{selectedVehicle.vehicleNumber || selectedVehicle.id}</h2>
                <p className="text-xs text-muted-foreground">{selectedVehicle.oem} · {selectedVehicle.model}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {selectedVehicle.onboardingType === "MIC_ASSISTED" && (
                  <button
                    onClick={() => { setShowIncentive(!showIncentive); setShowTimeline(false) }}
                    className={`p-2 rounded-lg transition-colors ${showIncentive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
                    title="Incentive Details"
                  >
                    <Gift className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => { setShowTimeline(!showTimeline); setShowIncentive(false) }}
                  className={`p-2 rounded-lg transition-colors ${showTimeline ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
                  title="Approval Timeline"
                >
                  <History className="w-4 h-4" />
                </button>
                <button onClick={() => { setSelectedVehicle(null); setShowTimeline(false); setShowIncentive(false) }} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {showIncentive ? (
              <div className="p-4 space-y-4">
                <p className="text-sm font-semibold text-foreground">Incentive Details</p>

                {/* Linked Incentive Program */}
                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Linked Program</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Program ID", "INC-2026-001"],
                      ["Program Name", "New Vehicle Onboarding Incentive"],
                      ["Type", "One-time"],
                      ["Gross Amount", "₹3,500"],
                      ["TDS Deducted", "₹350"],
                      ["Net Incentive", "₹3,150"],
                      ["Credit Date", "Mar 21, 2026"],
                      ["Expiry Date", "Mar 21, 2027"],
                      ["Status", "Active"],
                    ].map(([label, value]) => (
                      <div key={label} className="text-sm">
                        <span className="text-xs text-muted-foreground block">{label}</span>
                        <span className={`font-medium block mt-0.5 ${label === "Status" ? "text-green-600" : label === "TDS Deducted" ? "text-red-600" : label === "Net Incentive" ? "text-green-700 font-bold" : "text-foreground"}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : showTimeline ? (
              <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                <p className="text-sm font-semibold text-foreground">Approval Timeline</p>
                <div className="space-y-4">
                  {[
                    { type: "submitted", timestamp: selectedVehicle.l1SubmittedAt, action: "L1 Submitted", actor: "Fleet Operator" },
                    selectedVehicle.l1ApprovedAt ? { type: "approved", timestamp: selectedVehicle.l1ApprovedAt, action: "L1 Approved", actor: "MIC Officer", comment: undefined } : null,
                    selectedVehicle.l1RejectedAt ? { type: "rejected", timestamp: selectedVehicle.l1RejectedAt, action: "L1 Rejected", actor: "MIC Officer", comment: selectedVehicle.l1Comments } : null,
                    selectedVehicle.l2SubmittedAt ? { type: "submitted", timestamp: selectedVehicle.l2SubmittedAt, action: "L2 Submitted", actor: "Fleet Operator" } : null,
                    selectedVehicle.l2ApprovedAt ? { type: "approved", timestamp: selectedVehicle.l2ApprovedAt, action: "L2 Approved", actor: "ZIC Officer" } : null,
                    selectedVehicle.l2RejectedAt ? { type: "rejected", timestamp: selectedVehicle.l2RejectedAt, action: "L2 Rejected", actor: "ZIC Officer", comment: selectedVehicle.l2Comments } : null,
                    selectedVehicle.cardDispatchDate ? { type: "system", timestamp: selectedVehicle.cardDispatchDate, action: "Card Dispatched for Printing", actor: "System" } : null,
                    selectedVehicle.cardDeliveryDate ? { type: "system", timestamp: selectedVehicle.cardDeliveryDate, action: "Card Delivered", actor: "Courier" } : null,
                    selectedVehicle.cardActivatedAt ? { type: "approved", timestamp: selectedVehicle.cardActivatedAt, action: "Card Activated", actor: "System" } : null,
                  ].filter(Boolean).map((entry, idx, arr) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full shrink-0 ${
                          entry!.type === "approved" ? "bg-green-600" :
                          entry!.type === "rejected" ? "bg-red-600" :
                          entry!.type === "submitted" ? "bg-blue-600" :
                          "bg-gray-400"
                        }`} />
                        {idx < arr.length - 1 && <div className="w-0.5 h-8 bg-border mt-1" />}
                      </div>
                      <div className="pb-2 flex-1">
                        <p className="text-xs text-muted-foreground">{entry!.timestamp}</p>
                        <p className="text-sm font-medium text-foreground">{entry!.action}</p>
                        <p className="text-xs text-muted-foreground">{entry!.actor}</p>
                        {entry!.comment && <p className="text-xs italic text-muted-foreground mt-1">"{entry!.comment}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                {/* Status */}
                <div className="flex items-center gap-2">
                  <VehicleStatusBadge status={selectedVehicle.status} />
                  <span className="text-xs text-muted-foreground">
                    {selectedVehicle.onboardingType === "MIC_ASSISTED" ? "MIC Assisted" : "Self-Service"}
                  </span>
                </div>

                {/* Vehicle Details */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
                  {[
                    ["Registration Type", selectedVehicle.onboardingType === "SELF_SERVICE" ? "Self-Service" : selectedVehicle.vehicleType === "retrofit" ? "Retrofitment" : "New Purchase"],
                    ["Vehicle Number", selectedVehicle.vehicleNumber],
                    ["OEM", selectedVehicle.oem],
                    ["Model", selectedVehicle.model],
                    ["Category", selectedVehicle.category],
                    ["Dealership", selectedVehicle.dealership],
                    ["Booking Date", selectedVehicle.bookingDate],
                    ["Registration Date", selectedVehicle.registrationDate],
                    ["Delivery Date", selectedVehicle.deliveryDate],
                  ].map(([label, value]) => value ? (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground text-right">{value}</span>
                    </div>
                  ) : null)}
                </div>

                {/* MOU Details — MIC_ASSISTED only */}
                {selectedVehicle.onboardingType === "MIC_ASSISTED" && (
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">MOU Details</p>
                    
                    {/* MOU details */}
                    {[
                      ["MOU Number", selectedVehicle.mouId || "—"],
                      ["Category Sequence", selectedVehicle.categorySequence ? `#${selectedVehicle.categorySequence} in ${selectedVehicle.category}` : "—"],
                      ["Vehicle Type", selectedVehicle.vehicleType === "new_purchase" ? "New Purchase" : selectedVehicle.vehicleType === "retrofit" ? "Retrofitment" : "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-foreground text-right">{value}</span>
                      </div>
                    ))}

                    {/* Incentive eligibility status */}
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Incentive Status</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          selectedVehicle.incentiveStatus === "paid" ? "bg-green-100 text-green-700" :
                          selectedVehicle.incentiveStatus === "approved" ? "bg-blue-100 text-blue-700" :
                          selectedVehicle.incentiveStatus === "eligible" ? "bg-amber-100 text-amber-700" :
                          selectedVehicle.incentiveStatus === "pending_approval" ? "bg-purple-100 text-purple-700" :
                          selectedVehicle.incentiveStatus === "not_eligible" ? "bg-gray-100 text-gray-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {selectedVehicle.incentiveStatus === "paid" ? "Paid" :
                           selectedVehicle.incentiveStatus === "approved" ? "Approved" :
                           selectedVehicle.incentiveStatus === "eligible" ? "Eligible — Pending Approval" :
                           selectedVehicle.incentiveStatus === "pending_approval" ? "Submitted for Approval" :
                           selectedVehicle.incentiveStatus === "not_eligible" ? "Not Yet Eligible" :
                           "—"}
                        </span>
                      </div>

                      {/* Not eligible explanation */}
                      {selectedVehicle.incentiveStatus === "not_eligible" && (
                        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-700">
                            This is the first {selectedVehicle.category} vehicle under MOU {selectedVehicle.mouId}. 
                            Incentive becomes eligible when a second {selectedVehicle.category} vehicle is added and approved.
                          </p>
                        </div>
                      )}

                      {/* Approved by */}
                      {selectedVehicle.incentiveApprovedBy && (
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-muted-foreground">Approved By</span>
                          <span className="font-medium text-foreground">{selectedVehicle.incentiveApprovedBy}</span>
                        </div>
                      )}
                      {selectedVehicle.incentiveApprovedAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Approved At</span>
                          <span className="font-medium text-foreground">{selectedVehicle.incentiveApprovedAt}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Driver Details — shown for both, optional fields */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Driver Details</p>
                  {[
                    ["Driver Name", selectedVehicle.driverName],
                    ["Contact", selectedVehicle.driverContact],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{value || "—"}</span>
                    </div>
                  ))}
                </div>

                {/* Card Details */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Card Details</p>
                  {[
                    ["Card Number", selectedVehicle.cardNumber || "Not issued yet"],
                    ["Dispatch Date", selectedVehicle.cardDispatchDate],
                    ["Delivery Date", selectedVehicle.cardDeliveryDate],
                    ["Activated At", selectedVehicle.cardActivatedAt],
                    ["Tracking ID", selectedVehicle.trackingId],
                  ].map(([label, value]) => value ? (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ) : null)}
                  {!selectedVehicle.cardNumber && (
                    <p className="text-xs text-muted-foreground">Card will be issued after L1 approval</p>
                  )}
                </div>

                {/* Documents & Actions — branched by onboarding type */}
                {selectedVehicle.onboardingType === "MIC_ASSISTED" ? (
                  <>
                    {/* MIC_ASSISTED: L1 + L2 documents with upload flow */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents</p>

                      {/* L1 Documents */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">L1 Documents</p>
                        {(selectedVehicle.bookingReceiptUrl || selectedVehicle.rcBookUrl ? [
                          selectedVehicle.bookingReceiptUrl ? { label: "Vehicle Booking Receipt", url: selectedVehicle.bookingReceiptUrl } : null,
                          selectedVehicle.rcBookUrl ? { label: "RC Book", url: selectedVehicle.rcBookUrl } : null,
                        ] : [
                          { label: "Vehicle Booking Receipt", url: selectedVehicle.bookingReceiptUrl },
                          { label: "Driver License", url: null },
                        ]).filter(Boolean).map(({ label, url }) => (
                          <div key={label} className="flex items-center gap-2 text-sm">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${url || l1Files[label] ? "bg-green-500" : "bg-muted border border-border"}`}>
                              {(url || l1Files[label]) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className={url || l1Files[label] ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                            {["L1_REJECTED"].includes(selectedVehicle.status) && !url && !l1Files[label] && (
                              <label className="ml-auto text-xs text-primary font-medium cursor-pointer hover:underline">
                                Upload <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={e => setL1Files(prev => ({ ...prev, [label]: e.target.files?.[0] || null }))} />
                              </label>
                            )}
                            {(url || l1Files[label]) && <span className="text-xs text-green-600 font-medium ml-auto">Verified</span>}
                            {!url && !l1Files[label] && !["L1_REJECTED"].includes(selectedVehicle.status) && <span className="text-xs text-muted-foreground ml-auto">Pending</span>}
                          </div>
                        ))}

                        {/* L1 rejection notice */}
                        {selectedVehicle.status === "L1_REJECTED" && selectedVehicle.l1Comments && (
                          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 mt-2">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-red-700">L1 Correction Required</p>
                              <p className="text-xs text-red-600 mt-0.5">{selectedVehicle.l1Comments}</p>
                            </div>
                          </div>
                        )}

                        {/* Resubmit L1 button */}
                        {selectedVehicle.status === "L1_REJECTED" && !l1Submitted && (
                          <button
                            onClick={() => setL1Submitted(true)}
                            className="w-full mt-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                          >
                            Resubmit for L1 Approval
                          </button>
                        )}
                        {l1Submitted && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200 mt-2">
                            <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-green-800">Documents Resubmitted</p>
                              <p className="text-xs text-green-700 mt-0.5">Your corrected documents have been sent to MIC for review.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* L2 Documents — shown only if L1 approved or beyond */}
                      {["L1_APPROVED","L2_SUBMITTED","L2_APPROVED","L2_REJECTED","CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(selectedVehicle.status) && (
                        <div className="space-y-2 pt-2 border-t border-border">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                            L2 Documents
                            {selectedVehicle.status === "L1_APPROVED" && <span className="ml-2 text-amber-600 normal-case">— Upload required</span>}
                          </p>

                          {/* L2 Vehicle Details — input fields for FO to fill */}
                          {selectedVehicle.status === "L1_APPROVED" && (
                            <div className="space-y-3 pb-3 border-b border-border">
                              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Vehicle Number <span className="text-destructive">*</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. MH12AB1234"
                                  value={l2Dates["vehicleNumber"] || ""}
                                  onChange={e => setL2Dates(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
                                />
                              </div>
                              {selectedVehicle.vehicleType !== "retrofit" && (
                                <>
                                  <div>
                                    <label className="text-xs font-medium text-muted-foreground">Registration Date <span className="text-destructive">*</span></label>
                                    <input
                                      type="date"
                                      value={l2Dates["registrationDate"] || ""}
                                      onChange={e => setL2Dates(prev => ({ ...prev, registrationDate: e.target.value }))}
                                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-muted-foreground">Delivery Date <span className="text-destructive">*</span></label>
                                    <input
                                      type="date"
                                      value={l2Dates["deliveryDate"] || ""}
                                      onChange={e => setL2Dates(prev => ({ ...prev, deliveryDate: e.target.value }))}
                                      className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                          {selectedVehicle.onboardingType === "MIC_ASSISTED" && selectedVehicle.vehicleType === "new_purchase" ? (
                            // New Purchase L2 docs
                            <>
                              {[
                                { label: "Delivery Date", type: "date", url: selectedVehicle.deliveryDate },
                                { label: "Delivery Challan / Delivery Note", type: "file", url: selectedVehicle.deliveryChallanUrl },
                                { label: "Registration Date", type: "date", url: selectedVehicle.registrationDate },
                                { label: "RTO Receipt / RC Book", type: "file", url: selectedVehicle.rcBookUrl },
                              ].map(({ label, type, url }) => (
                                <div key={label} className="flex items-center gap-2 text-sm">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${url || l2Files[label] || l2Dates[label] ? "bg-green-500" : "bg-muted border border-border"}`}>
                                    {(url || l2Files[label] || l2Dates[label]) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                                  </div>
                                  <span className={url || l2Files[label] || l2Dates[label] ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                                  {["L1_APPROVED","L2_REJECTED"].includes(selectedVehicle.status) && !url && (
                                    type === "file" ? (
                                      <label className="ml-auto text-xs text-primary font-medium cursor-pointer hover:underline">
                                        {l2Files[label] ? l2Files[label]!.name.substring(0, 15) + "..." : "Upload"}
                                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                          onChange={e => setL2Files(prev => ({ ...prev, [label]: e.target.files?.[0] || null }))} />
                                      </label>
                                    ) : (
                                      <input type="date" value={l2Dates[label] || ""} 
                                        onChange={e => setL2Dates(prev => ({ ...prev, [label]: e.target.value }))}
                                        className="ml-auto text-xs border border-border rounded px-2 py-1 bg-card" />
                                    )
                                  )}
                                  {(url || l2Files[label] || l2Dates[label]) && <span className="text-xs text-green-600 font-medium ml-auto">Uploaded</span>}
                                  {!url && !l2Files[label] && !l2Dates[label] && !["L1_APPROVED","L2_REJECTED"].includes(selectedVehicle.status) && <span className="text-xs text-muted-foreground ml-auto">Pending</span>}
                                </div>
                              ))}
                            </>
                          ) : (
                            // Retrofitment L2 docs
                            <>
                              {[
                                { label: "CNG Kit Installation Certificate", url: selectedVehicle.cngCertUrl },
                                { label: "E-Fitment Certificate", url: selectedVehicle.eFitmentUrl },
                                { label: "RTO Endorsement (CNG conversion)", url: selectedVehicle.rtoEndorsementUrl },
                                { label: "Type Approval Certificate", url: selectedVehicle.typeApprovalUrl },
                                { label: "Tax Invoice (Retrofitment Center)", url: selectedVehicle.taxInvoiceUrl },
                              ].map(({ label, url }) => (
                                <div key={label} className="flex items-center gap-2 text-sm">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${url || l2Files[label] ? "bg-green-500" : "bg-muted border border-border"}`}>
                                    {(url || l2Files[label]) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                                  </div>
                                  <span className={url || l2Files[label] ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                                  {["L1_APPROVED","L2_REJECTED"].includes(selectedVehicle.status) && !url && (
                                    <label className="ml-auto text-xs text-primary font-medium cursor-pointer hover:underline">
                                      {l2Files[label] ? l2Files[label]!.name.substring(0, 15) + "..." : "Upload"}
                                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={e => setL2Files(prev => ({ ...prev, [label]: e.target.files?.[0] || null }))} />
                                    </label>
                                  )}
                                  {(url || l2Files[label]) && <span className="text-xs text-green-600 font-medium ml-auto">Uploaded</span>}
                                  {!url && !l2Files[label] && !["L1_APPROVED","L2_REJECTED"].includes(selectedVehicle.status) && <span className="text-xs text-muted-foreground ml-auto">Pending</span>}
                                </div>
                              ))}
                            </>
                          )}

                          {/* L2 rejection notice */}
                          {selectedVehicle.status === "L2_REJECTED" && selectedVehicle.l2Comments && (
                            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 mt-2">
                              <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-red-700">L2 Correction Required</p>
                                <p className="text-xs text-red-600 mt-0.5">{selectedVehicle.l2Comments}</p>
                              </div>
                            </div>
                          )}

                          {/* Submit L2 button when L1 approved */}
                          {selectedVehicle.status === "L1_APPROVED" && !l2Submitted && (
                            <button
                              onClick={() => setL2Submitted(true)}
                              className="w-full mt-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                            >
                              Submit L2 Documents
                            </button>
                          )}

                          {/* L2 submission success */}
                          {l2Submitted && (
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200 mt-2">
                              <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-green-800">L2 Documents Submitted</p>
                                <p className="text-xs text-green-700 mt-0.5">Your documents have been sent to ZIC for review. You will be notified once approved.</p>
                              </div>
                            </div>
                          )}

                          {/* Resubmit L2 button for rejected */}
                          {selectedVehicle.status === "L2_REJECTED" && (
                            <button
                              onClick={() => setL2Submitted(false)}
                              className="w-full mt-2 py-2.5 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50"
                            >
                              Resubmit L2 Documents
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* SELF_SERVICE: Simple document status + approval state */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents</p>
                      {[
                        { label: "RC Book", url: selectedVehicle.rcBookUrl },
                        { label: "Driver License", url: null },
                      ].map(({ label, url }) => (
                        <div key={label} className="flex items-center gap-2 text-sm">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${url ? "bg-green-500" : "bg-muted border border-border"}`}>
                            {url && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className={url ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                          <span className={`text-xs ml-auto ${url ? "text-green-600 font-medium" : "text-muted-foreground"}`}>{url ? "Uploaded" : "Pending"}</span>
                        </div>
                      ))}
                    </div>

                    {/* SELF_SERVICE: Approval Status */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Approval Status</p>
                      {selectedVehicle.status === "L1_SUBMITTED" && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-amber-900">Under Review</p>
                            <p className="text-xs text-amber-700 mt-0.5">Your vehicle is being reviewed by MIC. You will be notified once validated.</p>
                          </div>
                        </div>
                      )}
                      {selectedVehicle.status === "L1_APPROVED" && (
                        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-green-900">Approved</p>
                            <p className="text-xs text-green-700 mt-0.5">Your vehicle has been validated. Card issuance is in progress.</p>
                          </div>
                        </div>
                      )}
                      {selectedVehicle.status === "L1_REJECTED" && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-red-900">Rejected</p>
                            <p className="text-xs text-red-700 mt-0.5">{selectedVehicle.l1Comments || "Please re-upload the required documents."}</p>
                            <div className="mt-2 space-y-2">
                              {[{ label: "RC Book", field: "rcBook" as const }].map(({ label, field }) => (
                                <div key={label}>
                                  <label className="text-xs text-red-700 font-medium cursor-pointer hover:underline flex items-center gap-1">
                                    <Upload className="w-3 h-3" /> Re-upload {label}
                                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={e => setL1Files(prev => ({ ...prev, [label]: e.target.files?.[0] || null }))} />
                                  </label>
                                </div>
                              ))}
                              {!l1Submitted && (
                                <button onClick={() => setL1Submitted(true)}
                                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90">
                                  Resubmit for Review
                                </button>
                              )}
                              {l1Submitted && (
                                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                  <p className="text-xs text-green-700 font-medium">Resubmitted for MIC review</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {["CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(selectedVehicle.status) && (
                        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-green-900">Vehicle Active</p>
                            <p className="text-xs text-green-700 mt-0.5">Your vehicle is approved and card has been {selectedVehicle.status === "CARD_ACTIVE" ? "activated" : selectedVehicle.status === "CARD_DISPATCHED" ? "dispatched" : "sent for printing"}.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── FO Add Vehicle ──────────────────────────────────────────────────────────
function FOAddVehicle({ onViewChange, onboardingType = "SELF_SERVICE" }: { onViewChange: (v: string) => void; onboardingType?: "MIC_ASSISTED" | "SELF_SERVICE" }) {
  const [mode, setMode] = useState<"l1" | "l2">("l1")
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [vehicleType, setVehicleType] = useState<"new_purchase" | "retrofit" | "existing_cng">(onboardingType === "SELF_SERVICE" ? "existing_cng" : "new_purchase")
  const [form, setForm] = useState({
    vehicleNumber: "", oemId: "", dealerId: "", retrofitterId: "",
    category: "" as VehicleCategory | "", model: "", customModel: "",
    retrofitModel: "", bookingDate: "", registrationDate: "", deliveryDate: "",
    driverName: "", driverContact: "", driverLicense: "", deliveryAddress: "",
    bookingReceipt: null as File | null,
    rcBook: null as File | null,
    driverLicenseFile: null as File | null,
    deliveryChallan: null as File | null,
    rtoReceipt: null as File | null,
    eFitment: null as File | null,
    rtoEndorsement: null as File | null,
    typeApproval: null as File | null,
    taxInvoice: null as File | null,
    cngCert: null as File | null,
    insurance: null as File | null,
  })

  const selectedOEM = oems.find(o => o.id === form.oemId)
  const availableDealers = form.oemId ? getDealersByOEM(form.oemId) : []
  const availableCategories = form.oemId ? getCategoriesByOEM(form.oemId) : []
  const availableModels = form.oemId && form.category ? getModelsByOEMAndCategory(form.oemId, form.category as VehicleCategory) : []
  const vehicleAge = form.registrationDate ? calculateVehicleAge(form.registrationDate) : null

  const retrofitModelCategoryMap: Record<string, VehicleCategory> = {
    "E Comet 1110": "ICV", "E Comet 1415": "ICV", "E Comet 1115": "ICV",
    "E Comet 1615": "HCV", "E Comet 1915": "HCV", "E Comet 1922": "HCV", "E Comet 2822": "HCV",
    "Pro 2119": "HCV", "Pro 2114XP": "HCV", "Pro 2118": "HCV", "Pro 3018": "HCV",
    "Pro 2109 CNG": "ICV", "Pro 2095XP": "ICV", "Pro 2110": "ICV", "Pro 2110XP": "ICV",
    "Pro 2049 CNG": "LCV", "Pro 2059 CNG": "LCV", "Pro 2059XP CNG": "LCV", "Pro 2075 CNG": "LCV",
    "2090": "Bus", "Pro 2075": "Bus", "Pro 3010": "Bus",
    "1612g": "HCV", "1912g": "HCV", "1109g": "ICV",
    "407g": "LCV", "609g": "LCV", "709g": "LCV",
    "LP410 CNG": "Bus", "LP913": "Bus", "51 S SKI": "Bus", "34 S SKI": "Bus", "24S STAFF NAC/AC": "Bus",
  }
  const derivedRetrofitCategory = retrofitModelCategoryMap[form.retrofitModel] ?? null

  function Field({ label, name, type = "text", placeholder, required = false }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
    return (
      <div>
        <label className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
        <input
          type={type} placeholder={placeholder || label}
          value={(form as Record<string, any>)[name] as string || ""}
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
        <label className="text-xs font-medium text-muted-foreground">
          {label}{required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        <label className="mt-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
          <Upload className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground flex-1 truncate min-w-0">
            {file ? file.name : "Upload PDF / JPG (max 10MB)"}
          </span>
          {file && (
            <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded shrink-0">
              Uploaded
            </span>
          )}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
            onChange={(e) => setForm({ ...form, [fieldName]: e.target.files?.[0] || null })} />
        </label>
      </div>
    )
  }

  const l1Steps = ["Registration Type", "Vehicle Details", "Documentation", "Driver Details", "Review & Submit"]
  const l2Steps = ["Vehicle Details", "L2 Documents", "Review & Submit"]
  const selfServiceSteps = ["Vehicle & Documents", "Driver Details", "Review & Submit"]
  const steps = onboardingType === "SELF_SERVICE" ? selfServiceSteps : mode === "l1" ? l1Steps : l2Steps

  if (submitted) {
    return (
      <div className="flex flex-col gap-5 p-5 max-w-3xl mx-auto">
        <div className="text-center py-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          {onboardingType === "SELF_SERVICE" ? (
            <>
              <h2 className="text-xl font-bold">Vehicle Submitted</h2>
              <p className="text-sm text-muted-foreground mt-2">Your vehicle has been submitted for MIC review. You will be notified once validated.</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">{mode === "l1" ? "Submitted for L1 Approval" : "Submitted for L2 Approval"}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {mode === "l1"
                  ? "MIC will review your documents. Once approved, a card will be issued to your vehicle in inactive state. You will be notified to complete L2 registration."
                  : "ZIC will review your documents. Once approved, your vehicle will be active and the card will be sent for printing."}
              </p>
            </>
          )}
          <button onClick={() => onViewChange("fo-vehicles")} className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            View My Vehicles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          {onboardingType === "SELF_SERVICE" ? "Register Vehicle for Fuel Card" : mode === "l1" ? "Register New Vehicle" : "Complete Vehicle Registration"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {onboardingType === "SELF_SERVICE" ? "Add your vehicle details and documents to apply for a fuel card." : mode === "l1" ? "Choose vehicle type and upload L1 documents." : "Complete your registration by uploading L2 documents."}
        </p>
      </div>

      {mode === "l2" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900">L1 Approved — Complete Registration</p>
            <p className="text-xs text-blue-700 mt-1">Your vehicle has been approved. Upload L2 documents to activate your vehicle and card.</p>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {steps.map((label, i) => {
          const s = i + 1
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s < step ? "bg-green-500 text-white" : s === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {s < step ? "✓" : s}
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{label}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-12 mx-1 mb-4 ${s < step ? "bg-green-500" : "bg-border"}`} />}
            </div>
          )
        })}
      </div>

      <div className="space-y-4">
        {/* L1: Step 1 - Registration Type */}
        {onboardingType !== "SELF_SERVICE" && mode === "l1" && step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "new_purchase", label: "New Purchase", desc: "Brand new CNG vehicle from dealer" },
              { value: "retrofit", label: "Retrofitment", desc: "Existing vehicle converted to CNG" }
            ].map(opt => (
              <button key={opt.value} onClick={() => setVehicleType(opt.value as any)}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${vehicleType === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* L1: Step 2 - Vehicle Details */}
        {onboardingType !== "SELF_SERVICE" && mode === "l1" && step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shared: OEM dropdown for both vehicle types */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">OEM <span className="text-destructive">*</span></label>
              <select
                value={form.oemId}
                onChange={(e) => setForm({ ...form, oemId: e.target.value, dealerId: "", category: "", model: "" })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select OEM</option>
                {oems.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>

            {/* New Purchase only: Dealership dropdown */}
            {vehicleType === "new_purchase" && form.oemId && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Dealership <span className="text-destructive">*</span></label>
                <select
                  value={form.dealerId}
                  onChange={(e) => setForm({ ...form, dealerId: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select Dealership</option>
                  {availableDealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            )}

            {/* Retrofitment only: Retrofitter dropdown */}
            {vehicleType === "retrofit" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Retrofitter <span className="text-destructive">*</span></label>
                <select
                  value={form.retrofitterId}
                  onChange={(e) => setForm({ ...form, retrofitterId: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select Retrofitter</option>
                  {retrofitters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            )}

            {/* New Purchase only: Vehicle Booking Date */}
            {vehicleType === "new_purchase" && (
              <Field label="Vehicle Booking Date" name="bookingDate" type="date" required />
            )}

            {/* Retrofitment only: Vehicle Booking Date */}
            {vehicleType === "retrofit" && (
              <Field label="Vehicle Booking Date" name="bookingDate" type="date" required />
            )}

            {/* Shared: Vehicle Category dropdown */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Vehicle Category <span className="text-destructive">*</span></label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as VehicleCategory })}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm"
              >
                <option value="">Select Category</option>
                <option value="HCV">HCV (≥15T)</option>
                <option value="ICV">ICV (≥10T, &lt;15T)</option>
                <option value="LCV">LCV (&gt;3.5T, &lt;10T)</option>
                <option value="Bus">Bus</option>
              </select>
            </div>

            {/* Shared: Model dropdown (filtered by OEM and category) */}
            {form.oemId && form.category && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Model <span className="text-destructive">*</span></label>
                <select
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select Model</option>
                  {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}

            {/* Retrofitment only: Vehicle Age (read-only) */}
            {vehicleType === "retrofit" && vehicleAge && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Vehicle Age</p>
                <p className="text-sm font-semibold">{vehicleAge.years}y {vehicleAge.months}m</p>
              </div>
            )}
          </div>
        )}

        {/* SELF_SERVICE: Step 1 - Vehicle & Documents */}
        {onboardingType === "SELF_SERVICE" && step === 1 && (
          <div className="space-y-4">
            <Field label="Vehicle Number" name="vehicleNumber" required />

            {/* Documents */}
            <div className="pt-2 border-t border-border space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents</p>
              <FileField label="RC Book" fieldName="rcBook" required />
            </div>
          </div>
        )}

        {/* L1: Step 3 - Documentation */}
        {onboardingType !== "SELF_SERVICE" && mode === "l1" && step === 3 && (
          <div className="space-y-3">
            {/* L1 Documents — based on vehicle type */}
            {vehicleType === "new_purchase" ? (
              <div className="space-y-3">
                <FileField label="Vehicle Booking Receipt" fieldName="bookingReceipt" required />
              </div>
            ) : (
              <div className="space-y-3">
                <FileField label="RC Book" fieldName="rcBook" required />
                <FileField label="Booking Receipt" fieldName="bookingReceipt" required />
              </div>
            )}
          </div>
        )}

        {/* SELF_SERVICE: Step 2 - Driver Details */}
        {onboardingType === "SELF_SERVICE" && step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Driver details are optional and can be updated later.</p>
            <Field label="Driver Name" name="driverName" />
            <Field label="Driver Contact" name="driverContact" type="tel" />
            <Field label="Driver License Number" name="driverLicense" />
            <FileField label="Driver License Copy" fieldName="driverLicenseFile" />
          </div>
        )}

        {/* L1: Step 4 - Driver Details (MIC_ASSISTED only) */}
        {mode === "l1" && step === 4 && onboardingType === "MIC_ASSISTED" && (
          <div className="space-y-4">
            <Field label="Driver Name" name="driverName" />
            <Field label="Driver Contact" name="driverContact" type="tel" />
            <Field label="Driver License Number" name="driverLicense" />
            <FileField label="Driver License" fieldName="driverLicenseFile" />
            <div>
              <label className="text-xs font-medium text-muted-foreground">Delivery Address</label>
              <textarea
                value={form.deliveryAddress}
                onChange={e => setForm({ ...form, deliveryAddress: e.target.value })}
                rows={3}
                placeholder="Enter delivery address"
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}

        {/* SELF_SERVICE: Step 3 - Review & Submit */}
        {onboardingType === "SELF_SERVICE" && step === 3 && (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><p className="text-xs text-muted-foreground">Vehicle No.</p><p className="font-medium">{form.vehicleNumber || "—"}</p></div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Driver Details</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{form.driverName || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Contact</p><p className="font-medium">{form.driverContact || "—"}</p></div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents</p>
              {[
                { label: "RC Book", file: form.rcBook },
                { label: "Driver License", file: form.driverLicenseFile },
              ].filter(d => d.file).map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span className="text-foreground">{doc.label}</span>
                  <span className="text-green-600 text-xs ml-auto font-medium">{doc.file?.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">By submitting, MIC will review your vehicle details and validate your registration.</p>
          </div>
        )}

        {/* L1: Step 5 - Review & Submit */}
        {mode === "l1" && step === 5 && !submitted && (
          <div className="space-y-5">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Review & Submit</p>

            {/* Registration Type Banner */}
            <div className={`flex items-center gap-3 p-3 rounded-lg ${vehicleType === "new_purchase" ? "bg-blue-50 border border-blue-200" : "bg-amber-50 border border-amber-200"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${vehicleType === "new_purchase" ? "bg-blue-100" : "bg-amber-100"}`}>
                {vehicleType === "new_purchase" ? <Truck className="w-4 h-4 text-blue-600" /> : <RefreshCw className="w-4 h-4 text-amber-600" />}
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${vehicleType === "new_purchase" ? "text-blue-700" : "text-amber-700"}`}>Registration Type</p>
                <p className={`text-sm font-bold ${vehicleType === "new_purchase" ? "text-blue-900" : "text-amber-900"}`}>{vehicleType === "new_purchase" ? "New CNG Vehicle" : "Retrofitment"}</p>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-muted/40 rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-2.5 bg-muted border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vehicle Details</p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border">
                {([
                  ["Vehicle Number", form.vehicleNumber || "—"],
                  vehicleType === "new_purchase"
                    ? ["OEM", selectedOEM?.name || "—"]
                    : ["Retrofitter", retrofitters.find(r => r.id === form.retrofitterId)?.name || "—"],
                  ["Category", form.category === "HCV" ? "HCV (≥15T)" : form.category === "ICV" ? "ICV (≥10T, <15T)" : form.category === "LCV" ? "LCV (>3.5T, <10T)" : form.category === "Bus" ? "Bus" : "—"],
                  ["Model", form.model || "—"],
                  vehicleType === "new_purchase"
                    ? ["Dealership", availableDealers.find(d => d.id === form.dealerId)?.name || "—"]
                    : ["Registration Date", form.registrationDate || "—"],
                  ["Booking Date", form.bookingDate || "—"],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="bg-card px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{k}</p>
                    <p className="text-sm font-semibold text-foreground">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Details */}
            <div className="bg-muted/40 rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-2.5 bg-muted border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Driver Details</p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border">
                {([
                  ["Driver Name", form.driverName || "—"],
                  ["Contact", form.driverContact || "—"],
                  ["License Number", form.driverLicense || "—"],
                  ["Delivery Address", form.deliveryAddress || "—"],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className={`bg-card px-4 py-3 ${k === "Delivery Address" ? "col-span-2" : ""}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">{k}</p>
                    <p className="text-sm font-semibold text-foreground">{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-muted/40 rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-2.5 bg-muted border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Documents</p>
              </div>
              <div className="p-4 space-y-2">
                {(vehicleType === "new_purchase" ? (
                  [
                    { label: "Vehicle Booking Receipt", file: form.bookingReceipt, required: true },
                    { label: "Driver License", file: form.driverLicenseFile, required: false },
                  ]
                ) : (
                  [
                    { label: "RC Book", file: form.rcBook, required: true },
                    { label: "Booking Receipt", file: form.bookingReceipt, required: true },
                  ]
                ) as { label: string; file: File | null; required: boolean }[]).map((doc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${doc.file ? "bg-green-500" : "bg-muted border border-border"}`}>
                      {doc.file && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-foreground text-xs">{doc.label}{doc.required && <span className="text-destructive ml-0.5">*</span>}</span>
                    <span className={`text-xs ml-auto ${doc.file ? "text-green-600 font-medium" : "text-muted-foreground"}`}>{doc.file?.name || "Not uploaded"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission note */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary">
              By submitting, you confirm all uploaded documents are authentic. MIC will review your documents and issue a card in inactive state.
            </div>
          </div>
        )}

        {/* L2: Step 1 - Vehicle Details */}
        {mode === "l2" && step === 1 && (
          <div className="space-y-4">
            <Field label="Vehicle Number" name="vehicleNumber" required />
            <Field label="Registration Date" name="registrationDate" type="date" required />
            {vehicleType === "new_purchase" && (
              <Field label="Delivery Date" name="deliveryDate" type="date" required />
            )}
          </div>
        )}

        {/* L2: Step 2 - L2 Documents */}
        {mode === "l2" && step === 2 && (
          <div className="space-y-3">
            {vehicleType === "new_purchase" ? (
              <>
                <p className="text-xs text-muted-foreground">Upload the required delivery and registration documents.</p>
                <FileField label="Delivery Challan / Delivery Note" fieldName="deliveryChallan" required />
                <FileField label="RTO Receipt / RC Book" fieldName="rtoReceipt" required />
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">Upload the required CNG conversion and retrofitment documents.</p>
                <FileField label="CNG Kit Installation Certificate" fieldName="cngCert" required />
                <FileField label="E-Fitment Certificate" fieldName="eFitment" required />
                <FileField label="RTO Endorsement (CNG Conversion)" fieldName="rtoEndorsement" required />
                <FileField label="Type Approval Certificate" fieldName="typeApproval" required />
                <FileField label="Tax Invoice (Retrofitment Center)" fieldName="taxInvoice" required />
              </>
            )}
          </div>
        )}

        {/* L2: Step 3 - Review & Submit */}
        {mode === "l2" && step === 3 && (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div><p className="text-xs text-muted-foreground">Vehicle Number</p><p className="font-medium">{form.vehicleNumber || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Registration Date</p><p className="font-medium">{form.registrationDate || "—"}</p></div>
                {vehicleType === "new_purchase" && <div><p className="text-xs text-muted-foreground">Delivery Date</p><p className="font-medium">{form.deliveryDate || "��"}</p></div>}
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">L2 Documents</p>
              <div className="space-y-2">
                {(vehicleType === "new_purchase" ? [
                  { label: "Delivery Challan / Delivery Note", file: form.deliveryChallan },
                  { label: "RTO Receipt / RC Book", file: form.rtoReceipt },
                ] : [
                  { label: "CNG Kit Installation Certificate", file: form.cngCert },
                  { label: "E-Fitment Certificate", file: form.eFitment },
                  { label: "RTO Endorsement (CNG Conversion)", file: form.rtoEndorsement },
                  { label: "Type Approval Certificate", file: form.typeApproval },
                  { label: "Tax Invoice (Retrofitment Center)", file: form.taxInvoice },
                ]).map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${doc.file ? "bg-green-500" : "bg-muted border border-border"}`}>
                      {doc.file && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-foreground">{doc.label}</span>
                    <span className={`text-xs ml-auto ${doc.file ? "text-green-600 font-medium" : "text-muted-foreground"}`}>{doc.file?.name || "Not uploaded"}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">By submitting, ZIC will review your L2 documents. Once approved, your vehicle will be activated and the card sent for printing.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between pt-4 border-t border-border">
        <button onClick={() => step > 1 ? setStep(step - 1) : onViewChange("fo-vehicles")} className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          {step === 1 ? "Cancel" : "Back"}
        </button>
        <button onClick={() => {
          const maxStep = onboardingType === "SELF_SERVICE" ? 3 : mode === "l1" ? 5 : 3
          step < maxStep ? setStep(step + 1) : setSubmitted(true)
        }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          {onboardingType === "SELF_SERVICE" && step === 3 ? "Submit Vehicle" : (mode === "l1" && step === 5) || (mode === "l2" && step === 3) ? (mode === "l1" ? "Submit for L1 Approval" : "Submit for L2 Approval") : "Next"}
        </button>
      </div>
    </div>
  )
}

// ─── FO Cards View ────────────────�������──────────────────────────────────────
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
  const [perTransactionLimit, setPerTransactionLimit] = useState("2000")
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

      {/* Card Activation Modal */}
      {activationStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 relative">
            {/* Progress Indicator */}
            <div className="flex gap-1 mb-6">
              {["confirmation", "set-pin", "confirm-pin", "otp", "success"].map((step, idx) => (
                <div
                  key={step}
                  className={`h-1 flex-1 rounded-full ${["confirmation", "set-pin", "confirm-pin", "otp", "success"].indexOf(activationStep) >= idx ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

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
                <p className="text-sm text-muted-foreground mb-4">Enter the 6-digit OTP sent to your registered mobile. (Test: 123456)</p>
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

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 relative">
            {/* Reset PIN Modal */}
            {actionModal === "reset-pin" && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Reset Card PIN</h3>
                <p className="text-sm text-muted-foreground mb-4">Resetting your PIN will send an OTP to your registered mobile number. You will need the OTP to set a new PIN.</p>
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700 font-medium">Note: Your card will be temporarily disabled during the PIN reset process.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActionModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                  <button onClick={() => { setActionModal(null); }} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">Send OTP</button>
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
                <p className="text-sm text-muted-foreground mb-4">Set per transaction, daily and monthly spending limits for this card</p>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Per Transaction Limit (₹)</label>
                    <input type="number" value={perTransactionLimit} onChange={(e) => setPerTransactionLimit(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
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

// ─── FO Transactions View ───────────────────────────────────────────────────────
function FOTransactionsView() {
  const [activeTab, setActiveTab] = useState<"pos" | "load">("pos")
  const [search, setSearch] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTxn, setSelectedTxn] = useState<any>(null)

  const posTransactions = [
    { id: "42288", date: "Mar 23, 2026", time: "10:30 AM", card: "xxxxxxxxxxxx4521", vehicle: "MH04AB1234", amount: "₹850", station: "MGL Hind CNG Filling Station", merchantCode: "100069", status: "Successful", type: "Debit", openingBalance: "₹13,350", closingBalance: "₹12,500" },
    { id: "42201", date: "Mar 22, 2026", time: "08:15 AM", card: "xxxxxxxxxxxx4521", vehicle: "MH04AB1234", amount: "₹1,200", station: "MGL Kurla Station", merchantCode: "100045", status: "Successful", type: "Debit", openingBalance: "₹14,550", closingBalance: "₹13,350" },
    { id: "42156", date: "Mar 21, 2026", time: "06:45 PM", card: "xxxxxxxxxxxx4522", vehicle: "MH04CD5678", amount: "₹950", station: "MGL Andheri East", merchantCode: "100032", status: "Successful", type: "Debit", openingBalance: "₹9,150", closingBalance: "₹8,200" },
    { id: "42089", date: "Mar 20, 2026", time: "09:20 AM", card: "xxxxxxxxxxxx4521", vehicle: "MH04AB1234", amount: "₹780", station: "MGL Goregaon", merchantCode: "100078", status: "Failed", type: "Debit", openingBalance: "₹14,550", closingBalance: "₹14,550" },
    { id: "42034", date: "Mar 19, 2026", time: "07:10 AM", card: "xxxxxxxxxxxx4522", vehicle: "MH04CD5678", amount: "₹1,100", station: "MGL Thane", merchantCode: "100091", status: "Successful", type: "Debit", openingBalance: "₹10,250", closingBalance: "₹9,150" },
  ]

  const loadTransactions = [
    { id: "L1001", date: "Mar 22, 2026", time: "02:15 PM", source: "NEFT Credit", amount: "₹10,000", status: "Successful", type: "Credit", utr: "NEFT2026032200123", openingBalance: "₹4,550", closingBalance: "₹14,550" },
    { id: "L1002", date: "Mar 18, 2026", time: "11:00 AM", source: "UPI Credit", amount: "₹5,000", status: "Successful", type: "Credit", utr: "UPI2026031800456", openingBalance: "₹5,250", closingBalance: "₹10,250" },
    { id: "L1003", date: "Mar 15, 2026", time: "03:00 PM", source: "NEFT Credit", amount: "₹15,000", status: "Successful", type: "Credit", utr: "NEFT2026031500789", openingBalance: "₹0", closingBalance: "₹15,000" },
  ]

  const txns = activeTab === "pos" ? posTransactions : loadTransactions
  const filtered = txns.filter(t =>
    !search ||
    t.id.includes(search) ||
    (activeTab === "pos" ? (t as any).vehicle?.toLowerCase().includes(search.toLowerCase()) || (t as any).station?.toLowerCase().includes(search.toLowerCase()) : (t as any).source?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">View your fleet transaction history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Successful", value: "₹4.9L", count: "4 transactions", iconBg: "bg-green-100", iconColor: "text-green-600", icon: CheckCircle },
          { label: "Pending", value: "₹0.0L", count: "0 transactions", iconBg: "bg-amber-100", iconColor: "text-amber-600", icon: Clock },
          { label: "Failed", value: "₹0.8L", count: "1 transaction", iconBg: "bg-red-100", iconColor: "text-red-600", icon: XCircle },
          { label: "Total Loads", value: "₹30,000", count: "3 loads", iconBg: "bg-blue-100", iconColor: "text-blue-600", icon: Wallet },
        ].map((card, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            <p className="text-xs text-muted-foreground">{card.count}</p>
          </div>
        ))}
      </div>

      {/* POS / Load tabs */}
      <div className="flex gap-1 border-b border-border">
        {[{id: "pos", label: "POS"}, {id: "load", label: "Load"}].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={activeTab === "pos" ? "Search by TXN ID, vehicle or station..." : "Search by TXN ID or source..."}
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-card" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-muted-foreground">From Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
            <div><label className="text-xs font-medium text-muted-foreground">To Date</label><input type="date" className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card" /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Status</label>
              <select className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm bg-card">
                <option>All</option><option>Successful</option><option>Failed</option><option>Pending</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-3">
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground">Clear All</button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">Apply</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold">TXN ID</th>
                <th className="px-4 py-3 text-left font-semibold">Date & Time</th>
                {activeTab === "pos" ? <>
                  <th className="px-4 py-3 text-left font-semibold">Vehicle</th>
                  <th className="px-4 py-3 text-left font-semibold">Station</th>
                </> : <>
                  <th className="px-4 py-3 text-left font-semibold">Source</th>
                </>}
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((txn: any) => (
                <tr key={txn.id} onClick={() => setSelectedTxn(txn)} className="hover:bg-muted/30 cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{txn.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{txn.date}</p>
                    <p className="text-xs text-muted-foreground">{txn.time}</p>
                  </td>
                  {activeTab === "pos" ? <>
                    <td className="px-4 py-3 font-mono text-xs">{txn.vehicle}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{txn.station}</td>
                  </> : <>
                    <td className="px-4 py-3 text-xs">{txn.source}</td>
                  </>}
                  <td className="px-4 py-3 font-medium">{txn.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${txn.status === "Successful" ? "bg-green-100 text-green-700" : txn.status === "Failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setSelectedTxn(txn)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Tray */}
      {selectedTxn && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedTxn(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">Transaction Details</h2>
                <p className="text-xs text-muted-foreground font-mono">{selectedTxn.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${selectedTxn.status === "Successful" ? "bg-green-100 text-green-700" : selectedTxn.status === "Failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{selectedTxn.status}</span>
                <button onClick={() => setSelectedTxn(null)} className="p-2 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transaction Info</p>
                {[
                  ["TXN ID", selectedTxn.id],
                  ["Date", selectedTxn.date],
                  ["Time", selectedTxn.time],
                  ["Type", selectedTxn.type],
                  ["Amount", selectedTxn.amount],
                  ["Opening Balance", selectedTxn.openingBalance],
                  ["Closing Balance", selectedTxn.closingBalance],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
              {activeTab === "pos" && (
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Station Info</p>
                  {[
                    ["Station", selectedTxn.station],
                    ["Merchant Code", selectedTxn.merchantCode],
                    ["Vehicle", selectedTxn.vehicle],
                    ["Card", selectedTxn.card],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground font-mono text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "load" && (
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Load Info</p>
                  {[
                    ["Source", selectedTxn.source],
                    ["UTR / Reference", selectedTxn.utr],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground font-mono text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── FO Fund Management ────────────────────────────────────────────────────────
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

// ─── FO Notifications ───────────────────────────────���────────��────────────────
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

// ─── FO MOU View ───────────────────────────────────────────────────────────���
function FOMoUView() {
  const mou = {
    number: myFO.mouNumber || "MGL/MOU/2025/001",
    executedDate: myFO.mouExecutionDate || "15 Jan 2025",
    expiryDate: myFO.mouExpiryDate || "14 Jan 2026",
    status: "Active",
    vehiclesCommitted: 15,
    newVehicles: 10,
    retrofitVehicles: 5,
    vehiclesRegistered: myVehicles.length,
    vehiclesActive: myVehicles.filter(v => v.status === "CARD_ACTIVE").length,
  }

  const daysToExpiry = Math.ceil((new Date(myFO.mouExpiryDate || "2026-01-14").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">My MoU</h1>
        <p className="text-sm text-muted-foreground">Memorandum of Understanding with Mahanagar Gas Limited</p>
      </div>

      {/* Expiry warning */}
      {daysToExpiry <= 30 && daysToExpiry > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">MoU Expiring Soon</p>
            <p className="text-xs text-amber-700 mt-0.5">Your MoU expires in {daysToExpiry} days. Please contact your MIC officer for renewal.</p>
          </div>
        </div>
      )}

      {/* MOU Summary Card */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">MoU Number</p>
            <p className="text-lg font-bold font-mono text-foreground mt-0.5">{mou.number}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${mou.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{mou.status}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Executed Date</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{mou.executedDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expiry Date</p>
            <p className={`text-sm font-semibold mt-0.5 ${daysToExpiry <= 30 ? "text-amber-600" : "text-foreground"}`}>{mou.expiryDate}</p>
          </div>
        </div>
      </div>

      {/* Vehicle Commitment */}
      <div className="bg-card rounded-xl border border-border p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Vehicle Commitment</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Committed", value: mou.vehiclesCommitted, color: "text-foreground", bg: "bg-muted/30" },
            { label: "Registered", value: mou.vehiclesRegistered, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active", value: mou.vehiclesActive, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending", value: mou.vehiclesCommitted - mou.vehiclesRegistered, color: "text-amber-600", bg: "bg-amber-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-4`}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">New Vehicles</span>
            <span className="font-medium text-foreground">{mou.newVehicles}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Retrofitment</span>
            <span className="font-medium text-foreground">{mou.retrofitVehicles}</span>
          </div>
        </div>
        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Registration Progress</span>
            <span className="font-semibold">{Math.round((mou.vehiclesRegistered / mou.vehiclesCommitted) * 100)}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((mou.vehiclesRegistered / mou.vehiclesCommitted) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* MOU Document */}
      <div className="bg-card rounded-xl border border-border p-5">
        <p className="text-sm font-semibold text-foreground mb-3">MoU Document</p>
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-red-600">PDF</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">MoU Agreement — {mou.number}</p>
            <p className="text-xs text-muted-foreground">Signed copy · Executed {mou.executedDate}</p>
          </div>
          <button className="text-xs text-primary font-medium hover:underline shrink-0">View PDF</button>
        </div>
      </div>

      {/* Contact MIC */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Need to update your MoU?</p>
          <p className="text-xs text-muted-foreground mt-0.5">Contact your assigned MIC officer for any changes, renewals, or vehicle commitment updates.</p>
        </div>
      </div>
    </div>
  )
}
