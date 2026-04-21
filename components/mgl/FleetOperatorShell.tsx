"use client"
// Fleet Operator Shell - Restored from v54

import { useState } from "react"
import {
  Truck, CreditCard, MapPin, Bell, LayoutDashboard, UserPlus, Upload,
  CheckCircle, Clock, XCircle, AlertCircle, Package, Eye, EyeOff,
  ChevronRight, ArrowRight, Shield, Smartphone, Star, RefreshCw, Info, Search, X, History, Gift, Bus,
  Download, Filter, Wallet, Edit, User, KeyRound
} from "lucide-react"
import Image from "next/image"
import MGLHeader from "@/components/mgl/MGLHeader"
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import FOWalletView from "@/components/mgl/FOWalletView"
import FOVehicleDetailTray from "@/components/mgl/FOVehicleDetailTray"
import CardDetailsView from "@/components/mgl/CardDetailsView"
import FODriversView from "@/components/mgl/FODriversView"
import FOSettingsView from "@/components/mgl/FOSettingsView"
import CashbackDetails from "@/components/mgl/shared/CashbackDetails"
import TransactionDetailTray, { TransactionRecord } from "@/components/mgl/shared/TransactionDetailTray"
import ReportsView from "@/components/mgl/shared/ReportsView"
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
  const [actionModal, setActionModal] = useState<"block" | "reset-pin" | "lock-unlock" | "limits" | "replacement" | null>(null)

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
      case "fo-drivers": return <FODriversView onboardingType={onboardingType} />
      case "fo-settings": return <FOSettingsView />
      case "fo-funds": return <FOFundManagement />
      case "fo-delivery": return <FODeliveryTracking />
      case "fo-notifications": return <FONotificationsView />
      case "fo-mou": return <FOMoUView />
      case "fo-reports": return <ReportsView role="fo" title="My Reports" />
      case "fo-profile": return <FOProfileView onboardingType={onboardingType} />
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

// ─── FO Signup Flow ────────────────────────────────────────��������────�����───────────
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
                {otpSent === false ? (
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
                        placeholder="dot dot dot"
                        className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm tracking-[0.5em] text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Demo: enter any 6 digits.
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
            { label: "RC Uploaded", status: "done" },
            { label: "Vehicle Verified", status: "done" },
            { label: "MIC Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },
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
                      v.status === "DRAFT" ? "bg-gray-100 text-gray-600" :
                      v.status === "L1_SUBMITTED" ? "bg-amber-100 text-amber-700" :
                      v.status === "L1_APPROVED" ? "bg-blue-100 text-blue-700" :
                      v.status === "L1_REJECTED" ? "bg-red-100 text-red-700" :
                      v.status === "CARD_PRINTED" ? "bg-purple-100 text-purple-700" :
                      v.status === "CARD_DISPATCHED" ? "bg-indigo-100 text-indigo-700" :
                      v.status === "CARD_ACTIVE" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {v.status === "DRAFT" ? "Submitted" :
                       v.status === "L1_SUBMITTED" ? "Under MIC Review" :
                       v.status === "L1_APPROVED" ? "Card Being Issued" :
                       v.status === "L1_REJECTED" ? "Action Required" :
                       v.status === "CARD_PRINTED" ? "Card Printing" :
                       v.status === "CARD_DISPATCHED" ? "Card Dispatched" :
                       v.status === "CARD_ACTIVE" ? "Active" :
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

              {/* SELF_SERVICE: Submitted/Under Review banner */}
              {v.onboardingType === "SELF_SERVICE" && 
                v.status === "DRAFT" && (
                <div className="border-l-4 border-amber-500 
                  bg-amber-50 px-3 py-2 rounded-r-lg 
                  flex items-center gap-2 mb-3">
                  <svg width="16" height="16" 
                    viewBox="0 0 24 24" fill="none"
                    stroke="#d97706" strokeWidth="2"
                    strokeLinecap="round" 
                    className="shrink-0">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <div>
                    <p className="text-xs font-semibold 
                      text-amber-900">
                      Submitted for MIC Review
                    </p>
                    <p className="text-[11px] text-amber-700">
                      Your vehicle details are being verified. 
                      We will notify you once reviewed.
                    </p>
                  </div>
                </div>
              )}

              {/* SELF_SERVICE: Rejected banner */}
              {v.onboardingType === "SELF_SERVICE" && 
                v.status === "L1_REJECTED" && (
                <div className="border-l-4 border-red-500 
                  bg-red-50 px-3 py-2 rounded-r-lg 
                  flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16"
                      viewBox="0 0 24 24" fill="none"
                      stroke="#dc2626" strokeWidth="2"
                      strokeLinecap="round"
                      className="shrink-0">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M15 9l-6 6M9 9l6 6"/>
                    </svg>
                    <div>
                      <p className="text-xs font-semibold 
                        text-red-900">
                        Action Required
                      </p>
                      <p className="text-[11px] text-red-700">
                        Your submission was rejected. 
                        Please re-submit with correct documents.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => openVehicle(v)}
                    className="text-xs font-medium text-red-700 
                      border border-red-300 px-2 py-1 
                      rounded-lg hover:bg-red-100 
                      shrink-0 ml-2">
                    Fix
                  </button>
                </div>
              )}

              {/* L1 Approved banner */}
              {v.status === "L1_APPROVED" && (
                <div className="border-l-4 border-blue-600 bg-blue-50 px-3 py-2 rounded-r-lg flex items-center justify-between mb-3">
                  {v.onboardingType === "SELF_SERVICE" ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-blue-900">MIC Approved</p>
                        <p className="text-[11px] text-blue-700">Your card is being issued and will be dispatched shortly</p>
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

              {(v.status === "L1_REJECTED" || v.status === "L2_REJECTED") && v.onboardingType !== "SELF_SERVICE" && (
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
        <FOVehicleDetailTray
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onboardingType={onboardingType}
          l1Files={l1Files}
          l2Files={l2Files}
          l2Dates={l2Dates}
          l1Submitted={l1Submitted}
          l2Submitted={l2Submitted}
          onL1FileChange={(label, file) => setL1Files(prev => ({ ...prev, [label]: file }))}
          onL2FileChange={(label, file) => setL2Files(prev => ({ ...prev, [label]: file }))}
          onL2DateChange={(label, value) => setL2Dates(prev => ({ ...prev, [label]: value }))}
          onL1Submit={() => setL1Submitted(true)}
          onL2Submit={() => setL2Submitted(true)}
          onL2Resubmit={() => setL2Submitted(false)}
        />
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

  const [rcOcrLoading, setRcOcrLoading] = useState(false)
  const [rcOcrDone, setRcOcrDone] = useState(false)
  const [vahaaanLoading, setVahaaanLoading] = useState(false)
  const [vahaaanData, setVahaaanData] = useState<any>(null)
  const [vahaaanVerified, setVahaaanVerified] = useState(false)

  const fo = onboardingType === "SELF_SERVICE" ? myFO_SS : myFO

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
  const selfServiceSteps = [
    "RC Upload",
    "Vehicle Verification",
    "Driver Details",
    "Review & Submit",
    "Card Issuance"
  ]
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

        {/* SELF_SERVICE: Step 1 - RC Upload */}
        {onboardingType === "SELF_SERVICE" && step === 1 && (
          <div className="space-y-4">

            {/* Upload instruction */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565C0" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Upload your RC Book</p>
                <p className="text-xs text-blue-700 mt-0.5">We will automatically read your vehicle number and details from the RC document.</p>
              </div>
            </div>

            {/* RC Upload */}
            <FileField label="RC Book (front page)" fieldName="rcBook" required />

            {/* Simulate OCR */}
            {form.rcBook && !rcOcrDone && (
              <button
                onClick={() => {
                  setRcOcrLoading(true)
                  setTimeout(() => {
                    setForm(f => ({
                      ...f,
                      vehicleNumber: "MH04GH9012"
                    }))
                    setRcOcrLoading(false)
                    setRcOcrDone(true)
                  }, 2000)
                }}
                disabled={rcOcrLoading}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                {rcOcrLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25"/>
                      <path d="M21 12a9 9 0 00-9-9"/>
                    </svg>
                    Reading RC...
                  </>
                ) : "Read RC with OCR"}
              </button>
            )}

            {/* OCR Result */}
            {rcOcrDone && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <p className="text-sm font-semibold text-green-800">RC read successfully</p>
                </div>
                <div className="flex justify-between items-center bg-white border border-green-200 rounded-lg px-4 py-3">
                  <span className="text-xs text-muted-foreground">Vehicle Number</span>
                  <span className="font-mono font-bold text-foreground tracking-widest">{form.vehicleNumber}</span>
                </div>
                <p className="text-xs text-green-700">
                  Not matching? 
                  <button 
                    onClick={() => {
                      setRcOcrDone(false)
                      setForm(f => ({...f, vehicleNumber: ""}))
                    }}
                    className="underline ml-1">
                    Re-upload
                  </button>
                </p>
              </div>
            )}

            {/* Manual entry fallback */}
            {!rcOcrDone && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Having trouble? 
                  <button
                    onClick={() => {
                      setRcOcrDone(true)
                    }}
                    className="text-primary underline ml-1 text-xs">
                    Enter vehicle number manually
                  </button>
                </p>
              </div>
            )}

          </div>
        )}

        {/* SELF_SERVICE: Step 2 - Vehicle Verification */}
        {onboardingType === "SELF_SERVICE" && step === 2 && (
          <div className="space-y-4">

            {/* RC number display */}
            <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl px-4 py-3">
              <span className="text-xs text-muted-foreground">Vehicle Number</span>
              <span className="font-mono font-bold tracking-widest text-foreground">{form.vehicleNumber || "MH04GH9012"}</span>
            </div>

            {/* Fetch from Vahaan */}
            {!vahaaanData && (
              <button
                onClick={() => {
                  setVahaaanLoading(true)
                  setTimeout(() => {
                    setVahaaanData({
                      owner_name: "Rajesh Kumar",
                      registration_date: "2022-03-15",
                      expiry_date: "2037-03-14",
                      rto: "MH-04, Mumbai Central",
                      status: "ACTIVE",
                      blacklist_status: "false",
                      vehicle_data: {
                        maker: "Tata Motors",
                        model: "Tata LPT 1918",
                        category: "HCV",
                        fuel_type: "CNG",
                        body_type: "GOODS",
                        chassis_number: "MAT445203NEB12345",
                        engine_number: "275IDTCR4CNL12345",
                        color: "WHITE",
                        gross_weight: "19000",
                        seating_capacity: "2",
                        manufactured_date: "2022-02",
                      },
                      insurance_data: {
                        company: "National Insurance Co. Ltd",
                        policy_number: "420100/31/2024/12345",
                        expiry_date: "2025-03-14",
                      },
                      pucc_data: {
                        pucc_number: "PUCC123456",
                        expiry_date: "2025-09-15",
                      }
                    })
                    setVahaaanLoading(false)
                  }, 2500)
                }}
                disabled={vahaaanLoading}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                {vahaaanLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25"/>
                      <path d="M21 12a9 9 0 00-9-9"/>
                    </svg>
                    Fetching from Vahaan...
                  </>
                ) : "Fetch Vehicle Details"}
              </button>
            )}

            {/* Vahaan data display */}
            {vahaaanData && (
              <div className="space-y-3">

                {/* Status banner */}
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${vahaaanData.status === "ACTIVE" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    {vahaaanData.status === "ACTIVE" ? <path d="M20 6L9 17l-5-5"/> : <path d="M18 6L6 18M6 6l12 12"/>}
                  </svg>
                  RC Status: {vahaaanData.status}
                  {vahaaanData.blacklist_status === "false" && " · Not blacklisted"}
                </div>

                {/* Owner details */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Owner Details</p>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["Owner", vahaaanData.owner_name],
                      ["RTO", vahaaanData.rto],
                      ["Registration Date", vahaaanData.registration_date],
                      ["Expiry Date", vahaaanData.expiry_date],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center px-4 py-2.5 text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vehicle details */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["Make & Model", vahaaanData.vehicle_data.maker + " " + vahaaanData.vehicle_data.model],
                      ["Category", vahaaanData.vehicle_data.category],
                      ["Fuel Type", vahaaanData.vehicle_data.fuel_type],
                      ["Body Type", vahaaanData.vehicle_data.body_type],
                      ["Chassis No.", vahaaanData.vehicle_data.chassis_number],
                      ["Engine No.", vahaaanData.vehicle_data.engine_number],
                      ["Colour", vahaaanData.vehicle_data.color],
                      ["GVW", vahaaanData.vehicle_data.gross_weight + " kg"],
                      ["Mfg. Date", vahaaanData.vehicle_data.manufactured_date],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center px-4 py-2.5 text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-right max-w-[55%]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insurance */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Insurance</p>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      ["Company", vahaaanData.insurance_data.company],
                      ["Policy No.", vahaaanData.insurance_data.policy_number],
                      ["Expiry", vahaaanData.insurance_data.expiry_date],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-center px-4 py-2.5 text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm button */}
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="vahaan-confirm"
                    checked={vahaaanVerified}
                    onChange={e => setVahaaanVerified(e.target.checked)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <label htmlFor="vahaan-confirm" className="text-sm text-green-800 cursor-pointer">
                    I confirm the above vehicle details are correct
                  </label>
                </div>

                {/* Re-fetch option */}
                <button
                  onClick={() => {
                    setVahaaanData(null)
                    setVahaaanVerified(false)
                  }}
                  className="text-xs text-muted-foreground underline w-full text-center">
                  Details incorrect? Re-fetch
                </button>

              </div>
            )}

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

        {/* SELF_SERVICE: Step 3 - Driver Details */}
        {onboardingType === "SELF_SERVICE" && step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Driver details are optional and can be updated later.</p>
            <Field label="Driver Name" name="driverName" />
            <Field label="Driver Contact" name="driverContact" type="tel" />
            <Field label="Driver License Number" name="driverLicense" />
            <FileField label="Driver License Copy" fieldName="driverLicenseFile" />
          </div>
        )}

        {/* SELF_SERVICE: Step 5 - Card Issuance */}
        {onboardingType === "SELF_SERVICE" && step === 5 && (
          <div className="space-y-4">

            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg text-foreground">Card will be issued</h3>
              <p className="text-sm text-muted-foreground mt-1">Your fuel card is being processed</p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Card Details</p>
              </div>
              <div className="divide-y divide-border">
                {[
                  ["Vehicle", form.vehicleNumber],
                  ["Card Type", "MGL Fleet CNG Card"],
                  ["Issuance", "Within 3-5 business days"],
                  ["Delivery", "Courier to registered address"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Card Delivery Address</label>
              <textarea
                value={form.deliveryAddress}
                onChange={e => setForm({
                  ...form,
                  deliveryAddress: e.target.value
                })}
                rows={3}
                placeholder="Enter delivery address for the card"
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700">
                Your vehicle will be reviewed by MIC before the card is dispatched. You will be notified via SMS once the card is shipped.
              </p>
            </div>

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

        {/* SELF_SERVICE: Step 4 - Card Issuance */}
        {onboardingType === "SELF_SERVICE" && step === 4 && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3 className="font-bold text-base text-foreground">Ready to issue your fuel card</h3>
              <p className="text-sm text-muted-foreground mt-1">Review and confirm to proceed</p>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Card Summary</p>
              </div>
              {[
                ["Vehicle", form.vehicleNumber || "MH04GH9012"],
                ["Card Type", "MGL Fleet CNG Card"],
                ["Category", vahaaanData?.vehicle_data?.category || "HCV"],
                ["Fuel Type", vahaaanData?.vehicle_data?.fuel_type || "CNG"],
                ["Issuance", "Within 3–5 business days"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center px-4 py-2.5 text-sm border-b border-border last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-muted/30 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Delivery Address</p>
              </div>
              <div className="px-4 py-3 text-sm text-foreground">
                {myFO_SS?.registeredAddress || "As per FO registered address on file"}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700">
                Your vehicle will be reviewed by MIC before the card is dispatched. You will be notified via SMS once the card is shipped.
              </p>
            </div>
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
                <div><p className="text-xs text-muted-foreground">Vehicle Number</p><p className="font-medium">{form.vehicleNumber || "-"}</p></div>
                <div><p className="text-xs text-muted-foreground">Registration Date</p><p className="font-medium">{form.registrationDate || "-"}</p></div>
                {vehicleType === "new_purchase" && <div><p className="text-xs text-muted-foreground">Delivery Date</p><p className="font-medium">{form.deliveryDate || "-"}</p></div>}
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
          const maxStep = onboardingType === "SELF_SERVICE" ? 5 : mode === "l1" ? 5 : 3
          step < maxStep ? setStep(step + 1) : setSubmitted(true)
        }} 
        disabled={
          (onboardingType === "SELF_SERVICE" && step === 1 && !rcOcrDone) ||
          (onboardingType === "SELF_SERVICE" && step === 2 && !vahaaanVerified)
        }
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed">
          {onboardingType === "SELF_SERVICE" && step === 5 ? "Submit Vehicle" : (onboardingType === "SELF_SERVICE" && step === 4 ? "Review & Continue" : (mode === "l1" && step === 5) || (mode === "l2" && step === 3) ? (mode === "l1" ? "Submit for L1 Approval" : "Submit for L2 Approval") : "Next")}
        </button>
      </div>
    </div>
  )
}

// ─── FO Cards View ────────────────�������───────────────��──────────────────────
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

  // Replacement Card Journey States
  const [showReplacementModal, setShowReplacementModal] = useState(false)
  const [replacementStep, setReplacementStep] = useState(1)
  const [selectedReason, setSelectedReason] = useState<{id: string, label: string, fee: number} | null>(null)
  const [replacementOtp, setReplacementOtp] = useState("")

  const replacementReasons = [
    { id: "lost", label: "Card Lost", fee: 150 },
    { id: "stolen", label: "Card Stolen", fee: 150 },
    { id: "damaged", label: "Card Damaged / Not Working", fee: 100 },
    { id: "expired", label: "Card Expired", fee: 0 },
  ]

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
                  <p className="text-muted-foreground mt-2">Card: •••��{myVehicles.find(v => v.id === activationCardId)?.cardNumber?.slice(-4)}</p>
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
                  placeholder="���•�����"
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
                <div className="flex items-center gap-3 mb-6">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${replacementStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{step}</div>
                      {step < 4 && <div className={`flex-1 h-1 mx-2 ${replacementStep > step ? "bg-primary" : "bg-muted"}`} />}
                    </div>
                  ))}
                </div>

                {/* Step 1: Select Reason */}
                {replacementStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Why are you replacing this card?</h3>
                      <p className="text-sm text-muted-foreground">Select the reason for replacement</p>
                    </div>
                    <div className="space-y-2">
                      {replacementReasons.map((reason) => (
                        <button key={reason.id}
                          onClick={() => { setSelectedReason(reason); setReplacementStep(2) }}
                          className="w-full p-4 border-2 border-border rounded-lg text-left hover:border-primary hover:bg-primary/5 transition-all group">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground group-hover:text-primary">{reason.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{reason.fee === 0 ? "No charges" : `₹${reason.fee} replacement fee`}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Confirm Amount */}
                {replacementStep === 2 && selectedReason && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Confirm Replacement Details</h3>
                      <p className="text-sm text-muted-foreground">Review the charges and confirm</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-amber-900">Replacement Card Charges</p>
                      <p className="text-xs text-amber-700 mt-1">The following amount will be debited from your Parent Wallet.</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                      {[
                        ["Reason", selectedReason.label],
                        ["Card Number", "MGL****4521"],
                        ["Replacement Fee", selectedReason.fee === 0 ? "Free" : `₹${selectedReason.fee}`],
                        ["Deducted From", "Parent Wallet"],
                        ["Current Wallet Balance", "₹12,500"],
                        ["Balance After Deduction", selectedReason.fee === 0 ? "₹12,500" : `₹${12500 - selectedReason.fee}`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className={`font-medium ${label === "Replacement Fee" && selectedReason.fee > 0 ? "text-red-600" : "text-foreground"}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">A new card will be dispatched to your registered delivery address within 5-7 working days.</p>
                    <div className="flex gap-2">
                      <button onClick={() => { setReplacementStep(1); setSelectedReason(null) }} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Back</button>
                      <button onClick={() => { setReplacementStep(3); setReplacementOtp("") }} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">Proceed</button>
                    </div>
                  </div>
                )}

                {/* Step 3: OTP Verification */}
                {replacementStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">Verify Your Mobile Number</h3>
                      <p className="text-sm text-muted-foreground">Complete OTP verification</p>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                      <Smartphone className="w-8 h-8 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium">OTP Verification</p>
                        <p className="text-xs text-muted-foreground">Enter the 6-digit OTP sent to {myFO.contactNumber}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Enter OTP</label>
                      <input type="text" maxLength={6} placeholder="• • • • • •"
                        value={replacementOtp}
                        onChange={e => setReplacementOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm tracking-[0.5em] text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <p className="text-xs text-muted-foreground mt-1 text-center">Demo: enter any 6 digits</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setReplacementStep(2)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Back</button>
                      <button onClick={() => { replacementOtp.length === 6 && setReplacementStep(4) }} disabled={replacementOtp.length !== 6} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">Verify OTP</button>
                    </div>
                  </div>
                )}

                {/* Step 4: Success */}
                {replacementStep === 4 && (
                  <div className="text-center py-6">
                    <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-lg text-foreground">Replacement Card Ordered</h3>
                    <p className="text-sm text-muted-foreground mt-2">Your replacement card has been ordered. {selectedReason?.fee! > 0 ? `₹${selectedReason?.fee} has been debited from your Parent Wallet.` : "No charges applied."}</p>
                    <p className="text-xs text-muted-foreground mt-1">Estimated delivery: 5-7 working days</p>
                    <p className="text-xs font-mono text-muted-foreground mt-2">Ref: RPL{Date.now().toString().slice(-6)}</p>
                    <button onClick={() => { setActionModal(null); setReplacementStep(1); setSelectedReason(null); setReplacementOtp("") }} className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">Close</button>
                  </div>
                )}
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
                <div className="text-5xl mb-4">��</div>
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
  const [activeTab, setActiveTab] = useState<"pos" | "load" | "allocation" | "incentive" | "debits">("pos")
  const [search, setSearch] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null)

  const posTransactions = [
    { id: "42288", date: "Mar 23, 2026", time: "10:30 AM", card: "xxxxxxxxxxxx4521", vehicle: "MH04AB1234", amount: "₹850", station: "MGL Hind CNG Filling Station", merchantCode: "100069", status: "Successful", type: "Debit", openingBalance: "₹13,350", closingBalance: "₹12,500", paymentMethod: "Card", stationType: "COCO", cardWalletDebit: "680", incentiveWalletDebit: "170", cashbackEligible: true, cashbackPercent: 2.5, cashbackAmount: "₹21.25", cashbackStatus: "Credited", channel: "pos" as const },
    { id: "42201", date: "Mar 22, 2026", time: "08:15 AM", card: "xxxxxxxxxxxx4521", vehicle: "MH04AB1234", amount: "₹1,200", station: "MGL Kurla Station", merchantCode: "100045", status: "Successful", type: "Debit", openingBalance: "₹14,550", closingBalance: "₹13,350", paymentMethod: "Scan & Pay", stationType: "DODO", cardWalletDebit: "960", incentiveWalletDebit: "240", cashbackEligible: true, cashbackPercent: 2.5, cashbackAmount: "₹30.00", cashbackStatus: "Pending", channel: "pos" as const },
    { id: "42156", date: "Mar 21, 2026", time: "06:45 PM", card: "xxxxxxxxxxxx4522", vehicle: "MH04CD5678", amount: "₹950", station: "MGL Andheri East", merchantCode: "100032", status: "Successful", type: "Debit", openingBalance: "₹9,150", closingBalance: "₹8,200", paymentMethod: "Card", stationType: "MGL Tej", cardWalletDebit: "760", incentiveWalletDebit: "190", cashbackEligible: false, cashbackReason: "Station not eligible for cashback", channel: "pos" as const },
    { id: "42089", date: "Mar 20, 2026", time: "09:20 AM", card: "xxxxxxxxxxxx4521", vehicle: "MH04AB1234", amount: "₹780", station: "MGL Goregaon", merchantCode: "100078", status: "Failed", type: "Debit", openingBalance: "₹14,550", closingBalance: "₹14,550", paymentMethod: "Card", stationType: "COCO", cardWalletDebit: "780", incentiveWalletDebit: "0", cashbackEligible: false, cashbackReason: "Transaction failed — no cashback", channel: "pos" as const },
    { id: "42034", date: "Mar 19, 2026", time: "07:10 AM", card: "xxxxxxxxxxxx4522", vehicle: "MH04CD5678", amount: "₹1,100", station: "MGL Thane", merchantCode: "100091", status: "Successful", type: "Debit", openingBalance: "₹10,250", closingBalance: "₹9,150", paymentMethod: "Scan & Pay", stationType: "DODO", cardWalletDebit: "880", incentiveWalletDebit: "220", cashbackEligible: true, cashbackPercent: 2.5, cashbackAmount: "₹27.50", cashbackStatus: "Credited", channel: "pos" as const },
  ]

  const loadTransactions = [
    { id: "L1001", date: "Mar 22, 2026", time: "02:15 PM", source: "NEFT Credit", amount: "₹10,000", status: "Successful", type: "Credit", utr: "NEFT2026032200123", openingBalance: "₹4,550", closingBalance: "₹14,550", channel: "load" as const },
    { id: "L1002", date: "Mar 18, 2026", time: "11:00 AM", source: "UPI Credit", amount: "₹5,000", status: "Successful", type: "Credit", utr: "UPI2026031800456", openingBalance: "₹5,250", closingBalance: "₹10,250", channel: "load" as const },
    { id: "L1003", date: "Mar 15, 2026", time: "03:00 PM", source: "NEFT Credit", amount: "₹15,000", status: "Successful", type: "Credit", utr: "NEFT2026031500789", openingBalance: "₹0", closingBalance: "₹15,000", channel: "load" as const },
  ]

  const allocationTransactions = [
    { id: "ALO001", date: "Mar 23, 2026", time: "09:00 AM", vehicle: "MH04AB1234", card: "xxxxxxxxxxxx4521", allocatedAmount: "₹5,000", availableBalance: "₹12,500", allocatedBy: "System Auto", status: "Active", channel: "allocation" as const, amount: "₹5,000", type: "Credit" as const },
    { id: "ALO002", date: "Mar 20, 2026", time: "08:30 AM", vehicle: "MH04CD5678", card: "xxxxxxxxxxxx4522", allocatedAmount: "₹3,000", availableBalance: "₹8,200", allocatedBy: "FO Manual", status: "Active", channel: "allocation" as const, amount: "₹3,000", type: "Credit" as const },
    { id: "ALO003", date: "Mar 18, 2026", time: "10:00 AM", vehicle: "MH04EF9012", card: "xxxxxxxxxxxx4523", allocatedAmount: "₹4,500", availableBalance: "₹4,500", allocatedBy: "System Auto", status: "Inactive", channel: "allocation" as const, amount: "₹4,500", type: "Credit" as const },
  ]

  const incentiveTransactions = [
    { id: "INC001", date: "Mar 21, 2026", time: "11:00 AM", source: "Incentive Wallet", creditType: "Incentive", vehicle: "MH04AB1234", grossAmount: "₹15,000", tds: "₹1,500", netAmount: "₹13,500", status: "Paid", channel: "incentive" as const, amount: "₹13,500", type: "Credit" as const },
    { id: "INC002", date: "Mar 15, 2026", time: "02:00 PM", source: "Incentive Wallet", creditType: "Incentive", vehicle: "MH04CD5678", grossAmount: "₹15,000", tds: "₹1,500", netAmount: "₹13,500", status: "Pending", channel: "incentive" as const, amount: "₹13,500", type: "Credit" as const },
    { id: "INC003", date: "Mar 10, 2026", time: "03:30 PM", source: "Incentive Wallet", creditType: "Cashback", vehicle: "MH04AB1234", grossAmount: "₹850", tds: "₹0", netAmount: "₹850", status: "Paid", channel: "incentive" as const, amount: "₹850", type: "Credit" as const },
    { id: "INC004", date: "Feb 23, 2026", time: "10:00 AM", source: "Incentive Wallet", creditType: "Cashback", vehicle: "MH04CD5678", grossAmount: "₹430", tds: "₹0", netAmount: "₹430", status: "Paid", channel: "incentive" as const, amount: "₹430", type: "Credit" as const },
  ]

  const debitTransactions = [
    { id: "DEB001", date: "Mar 22, 2026", time: "01:00 PM", debitType: "Card Replacement Fee", amount: "₹150", debitedFrom: "Parent Wallet", openingBalance: "₹12,650", closingBalance: "₹12,500", reference: "RPL123456", status: "Successful", channel: "debits" as const, type: "Debit" as const },
    { id: "DEB002", date: "Mar 10, 2026", time: "11:30 AM", debitType: "Annual Maintenance Charge", amount: "₹500", debitedFrom: "Parent Wallet", openingBalance: "₹13,000", closingBalance: "₹12,500", reference: "AMC202603", status: "Successful", channel: "debits" as const, type: "Debit" as const },
    { id: "DEB003", date: "Feb 28, 2026", time: "09:15 AM", debitType: "SMS Alert Charges", amount: "₹50", debitedFrom: "Parent Wallet", openingBalance: "₹13,050", closingBalance: "₹13,000", reference: "SMS202602", status: "Successful", channel: "debits" as const, type: "Debit" as const },
  ]

  const activeData = activeTab === "pos" ? posTransactions :
    activeTab === "load" ? loadTransactions :
    activeTab === "allocation" ? allocationTransactions :
    activeTab === "incentive" ? incentiveTransactions :
    debitTransactions

  const filtered = activeData.filter(t =>
    !search ||
    (t as any).id?.includes(search) ||
    (activeTab === "pos" ? ((t as any).vehicle?.toLowerCase().includes(search.toLowerCase()) || (t as any).station?.toLowerCase().includes(search.toLowerCase())) : 
     activeTab === "load" ? (t as any).source?.toLowerCase().includes(search.toLowerCase()) :
     activeTab === "allocation" ? ((t as any).vehicle?.toLowerCase().includes(search.toLowerCase()) || (t as any).card?.toLowerCase().includes(search.toLowerCase())) :
     activeTab === "incentive" ? ((t as any).vehicle?.toLowerCase().includes(search.toLowerCase()) || (t as any).incentiveType?.toLowerCase().includes(search.toLowerCase())) :
     (t as any).debitType?.toLowerCase().includes(search.toLowerCase()))
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
          { label: "Successful", value: "₹5.0L", count: "7 transactions", iconBg: "bg-green-100", iconColor: "text-green-600", icon: CheckCircle },
          { label: "Pending", value: "₹13.5L", count: "1 transaction", iconBg: "bg-amber-100", iconColor: "text-amber-600", icon: Clock },
          { label: "Failed", value: "₹0.8L", count: "1 transaction", iconBg: "bg-red-100", iconColor: "text-red-600", icon: XCircle },
          { label: "Total Cashback", value: "₹78.75", count: "3 transactions", iconBg: "bg-green-100", iconColor: "text-green-700", icon: Gift },
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

      {/* POS / Load / Allocation / Incentive / Debits tabs */}
      <div className="flex gap-1 border-b border-border">
        {[
          {id: "pos", label: "POS"},
          {id: "load", label: "Load"},
          {id: "allocation", label: "Allocation"},
          {id: "incentive", label: "Incentive"},
          {id: "debits", label: "Debits"},
        ].map(tab => (
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
            placeholder={activeTab === "pos" ? "Search by TXN ID, vehicle or station..." : activeTab === "load" ? "Search by TXN ID or source..." : activeTab === "allocation" ? "Search by ID, vehicle or card..." : activeTab === "incentive" ? "Search by ID or type..." : "Search by ID or debit type..."}
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
          {/* Incentive Tab – Separate Table */}
          {activeTab === "incentive" ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">TXN ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Credit Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {incentiveTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{txn.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{txn.date}</p>
                      <p className="text-xs text-muted-foreground">{txn.time}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{txn.source}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${txn.creditType === "Incentive" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {txn.creditType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-green-700">{txn.netAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${txn.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setSelectedTxn(txn as any)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            /* Other Tabs – Main Table */
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {activeTab === "pos" && (
                    <>
                      <th className="px-4 py-3 text-left font-semibold">TXN ID</th>
                      <th className="px-4 py-3 text-left font-semibold">Date & Time</th>
                      <th className="px-4 py-3 text-left font-semibold">Vehicle</th>
                      <th className="px-4 py-3 text-left font-semibold">Station</th>
                      <th className="px-4 py-3 text-left font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-center font-semibold">Action</th>
                    </>
                  )}
                  {activeTab === "load" && (
                    <>
                      <th className="px-4 py-3 text-left font-semibold">TXN ID</th>
                      <th className="px-4 py-3 text-left font-semibold">Date & Time</th>
                      <th className="px-4 py-3 text-left font-semibold">Source</th>
                      <th className="px-4 py-3 text-left font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-center font-semibold">Action</th>
                    </>
                  )}
                  {activeTab === "allocation" && (
                    <>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Alloc ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Vehicle</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Card</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Allocated</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Balance</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">By</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Status</th>
                      <th className="px-4 py-3 text-center font-semibold text-xs uppercase">Action</th>
                    </>
                  )}
                  {activeTab === "debits" && (
                    <>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Debit ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Debited From</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Opening Bal</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Closing Bal</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Reference</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase">Status</th>
                      <th className="px-4 py-3 text-center font-semibold text-xs uppercase">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* POS Transactions */}
                {activeTab === "pos" && filtered.map((txn: any) => (
                  <tr key={txn.id} onClick={() => setSelectedTxn(txn)} className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{txn.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{txn.date}</p>
                      <p className="text-xs text-muted-foreground">{txn.time}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{txn.vehicle}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{txn.station}</td>
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

                {/* Load Transactions */}
                {activeTab === "load" && filtered.map((txn: any) => (
                  <tr key={txn.id} onClick={() => setSelectedTxn(txn)} className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{txn.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{txn.date}</p>
                      <p className="text-xs text-muted-foreground">{txn.time}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">{txn.source}</td>
                    <td className="px-4 py-3 font-medium">{txn.amount}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{txn.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setSelectedTxn(txn)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Allocation Transactions */}
                {activeTab === "allocation" && filtered.map((txn: any) => (
                  <tr key={txn.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{txn.id}</td>
                    <td className="px-4 py-3 text-xs">{txn.date}</td>
                    <td className="px-4 py-3 font-mono text-xs">{txn.vehicle}</td>
                    <td className="px-4 py-3 font-mono text-xs">{txn.card}</td>
                    <td className="px-4 py-3 font-medium text-green-700">{txn.allocatedAmount}</td>
                    <td className="px-4 py-3 text-xs">{txn.availableBalance}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{txn.allocatedBy}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${txn.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{txn.status}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedTxn(txn as any)}
                        className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Debit Transactions */}
                {activeTab === "debits" && filtered.map((txn: any) => (
                  <tr key={txn.id} onClick={() => setSelectedTxn(txn)} className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{txn.id}</td>
                    <td className="px-4 py-3 text-xs">{txn.date}</td>
                    <td className="px-4 py-3 text-xs">{txn.debitType}</td>
                    <td className="px-4 py-3 font-bold text-red-600">{txn.amount}</td>
                    <td className="px-4 py-3 text-xs">{txn.debitedFrom}</td>
                    <td className="px-4 py-3 text-xs">{txn.openingBalance}</td>
                    <td className="px-4 py-3 text-xs">{txn.closingBalance}</td>
                    <td className="px-4 py-3 font-mono text-xs">{txn.reference}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{txn.status}</span>
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
          )}
        </div>
      </div>

      {/* Detail Tray */}
      {selectedTxn && (
        <TransactionDetailTray
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
          role="fo"
        />
      )}
    </div>
  )
}

// ─── FO Fund Management ────────���───────────────────────────────────────────────
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold mb-1">T+1 Pending</p>
              <p className="text-2xl font-bold text-amber-600">₹10,000</p>
            </div>
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          </div>
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
                    <p className="font-semibold text-foreground">��{item.amount.toLocaleString()}</p>
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

// ─── FO Delivery Tracking ─────────────�����─────────�����───���────────��────────���──────
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

// ─── FO MOU View ───────────��───────────────────────────────────────────────���
function FOMoUView() {
  const [selectedMouIndex, setSelectedMouIndex] = useState(0)

  // Multiple MOUs for the FO
  const mous = [
    {
      number: myFO.mouNumber || "MGL/MOU/2025/001",
      executedDate: myFO.mouExecutionDate || "15 Jan 2025",
      expiryDate: myFO.mouExpiryDate || "14 Jan 2026",
      status: "Active",
      incentiveProgramId: "IDINC-2026-001",
      incentiveProgramName: "MGL Retrofit Incentive 2026",
      vehiclesCommitted: 15,
      newVehicles: 10,
      retrofitVehicles: 5,
    },
    {
      number: "MGL/MOU/2025/002",
      executedDate: "20 Feb 2025",
      expiryDate: "19 Feb 2026",
      status: "Active",
      incentiveProgramId: "IDINC-2026-002",
      incentiveProgramName: "MGL New Purchase Incentive 2026",
      vehiclesCommitted: 20,
      newVehicles: 12,
      retrofitVehicles: 8,
    },
    {
      number: "MGL/MOU/2024/001",
      executedDate: "10 Jan 2024",
      expiryDate: "09 Jan 2025",
      status: "Expired",
      incentiveProgramId: "IDINC-2025-001",
      incentiveProgramName: "MGL Retrofit Incentive 2025",
      vehiclesCommitted: 10,
      newVehicles: 8,
      retrofitVehicles: 2,
    },
  ]

  const mou = mous[selectedMouIndex]
  
  // Calculate vehicle stats for the selected MOU
  const vehiclesRegistered = myVehicles.length
  const vehiclesActive = myVehicles.filter(v => v.status === "CARD_ACTIVE").length
  
  // Enrich the MOU with calculated vehicle data
  const enrichedMou = {
    ...mou,
    vehiclesRegistered,
    vehiclesActive,
    daysToExpiry: Math.ceil((new Date(mou.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">My MoUs</h1>
        <p className="text-sm text-muted-foreground">Manage your Memorandum of Understanding with Mahanagar Gas Limited</p>
      </div>

      {/* MOU Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {mous.map((m, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedMouIndex(idx)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
              selectedMouIndex === idx
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span className="font-mono">{m.number}</span>
          </button>
        ))}
      </div>

      {/* Expiry warning */}
      {enrichedMou.daysToExpiry <= 30 && enrichedMou.daysToExpiry > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">MoU Expiring Soon</p>
            <p className="text-xs text-amber-700 mt-0.5">Your MoU expires in {enrichedMou.daysToExpiry} days. Please contact your MIC officer for renewal.</p>
          </div>
        </div>
      )}

      {/* MOU Summary Card */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">MoU Number</p>
            <p className="text-lg font-bold font-mono text-foreground mt-0.5">{enrichedMou.number}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${enrichedMou.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{enrichedMou.status}</span>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
          <div>
            <p className="text-xs text-muted-foreground">Executed Date</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{enrichedMou.executedDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expiry Date</p>
            <p className={`text-sm font-semibold mt-0.5 ${enrichedMou.daysToExpiry <= 30 ? "text-amber-600" : "text-foreground"}`}>{enrichedMou.expiryDate}</p>
          </div>
        </div>

        {/* Incentive Program Info */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Incentive Program ID</p>
            <p className="text-sm font-semibold text-foreground mt-0.5 font-mono">{enrichedMou.incentiveProgramId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Program Name</p>
            <p className="text-sm font-semibold text-foreground mt-0.5">{enrichedMou.incentiveProgramName}</p>
          </div>
        </div>
      </div>

      {/* Vehicle Commitment */}
      <div className="bg-card rounded-xl border border-border p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Vehicle Commitment</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Committed", value: enrichedMou.vehiclesCommitted, color: "text-foreground", bg: "bg-muted/30" },
            { label: "Registered", value: enrichedMou.vehiclesRegistered, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active", value: enrichedMou.vehiclesActive, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending", value: enrichedMou.vehiclesCommitted - enrichedMou.vehiclesRegistered, color: "text-amber-600", bg: "bg-amber-50" },
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
            <span className="font-medium text-foreground">{enrichedMou.newVehicles}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Retrofitment</span>
            <span className="font-medium text-foreground">{enrichedMou.retrofitVehicles}</span>
          </div>
        </div>
        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Registration Progress</span>
            <span className="font-semibold">{Math.round((enrichedMou.vehiclesRegistered / enrichedMou.vehiclesCommitted) * 100)}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round((enrichedMou.vehiclesRegistered / enrichedMou.vehiclesCommitted) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Incentives Earned */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <p className="text-sm font-semibold text-foreground">Incentives Earned</p>
        <p className="text-xs text-muted-foreground">Based on your MOU commitment and current slab rates, here&apos;s what you can earn by completing vehicle registrations.</p>

        {/* Summary row */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Earned", value: "₹42,750", color: "text-green-700", bg: "bg-green-50" },
            { label: "Potential to Earn", value: "₹2,94,400", color: "text-primary", bg: "bg-primary/5" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
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
                <p className="text-sm font-medium text-foreground">MoU Agreement — {enrichedMou.number}</p>
                <p className="text-xs text-muted-foreground">Signed copy · Executed {enrichedMou.executedDate}</p>
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

function FOProfileView({ onboardingType = "MIC_ASSISTED" }: { onboardingType?: string }) {
  const fo = onboardingType === "SELF_SERVICE" ? myFO_SS : myFO
  const [requestSent, setRequestSent] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  return (
    <div className="flex flex-col gap-5 p-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground">Your company and account details</p>
        </div>
        {!requestSent ? (
          <button onClick={() => setRequestSent(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            <Edit className="w-4 h-4" /> Request Change
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Request Sent</span>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary">{fo.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">{fo.name}</p>
            <p className="text-sm text-muted-foreground">{fo.id} · {fo.onboardingType === "MIC_ASSISTED" ? "MIC Assisted" : "Self-Service"}</p>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground border-b border-border pb-2">Company Details</p>
        {[
          ["Company Name", fo.name, false],
          ["Registered Address", fo.registeredAddress, false],
          ["Delivery Address", fo.deliveryAddress, false],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground shrink-0 w-36">{label}</span>
            <span className="font-medium text-foreground text-right">{value}</span>
          </div>
        ))}
        {/* PAN — verified */}
        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="text-muted-foreground shrink-0 w-36">PAN Number</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{fo.pan}</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-semibold">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          </div>
        </div>
        {/* GSTN — verified or not provided */}
        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="text-muted-foreground shrink-0 w-36">GSTN Number</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{fo.gstn || "Not provided"}</span>
            {fo.gstn && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-semibold">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
        </div>
        {/* TDS */}
        <div className="flex items-start justify-between gap-4 text-sm">
          <span className="text-muted-foreground shrink-0 w-36">Applicable TDS</span>
          <span className="font-medium text-foreground">{fo.gstn ? "2%" : "10%"} <span className="text-xs text-muted-foreground">({fo.gstn ? "GST registered" : "Non-GST"})</span></span>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground border-b border-border pb-2">Contact Details</p>
        {[
          ["Mobile Number", fo.contactNumber],
          ["Email Address", fo.email],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground shrink-0 w-36">{label}</span>
            <span className="font-medium text-foreground text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Login Details */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground border-b border-border pb-2">Login Details</p>
        {[
          ["Name", fo.name],
          ["Role", "Fleet Operator"],
          ["Email", fo.email],
          ["Mobile", fo.contactNumber],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground shrink-0 w-36">{label}</span>
            <span className="font-medium text-foreground text-right">{value}</span>
          </div>
        ))}
        {/* Change password */}
        <div className="pt-2 border-t border-border">
          <button onClick={() => { setShowPasswordModal(true); setPasswordSuccess(false); setPasswordError(""); setPasswordForm({ current: "", newPass: "", confirm: "" }) }}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
            <KeyRound className="w-4 h-4" /> Change Password
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground border-b border-border pb-2">Account Info</p>
        {[
          ["Account Status", fo.status],
          ["Member Since", fo.createdAt],
          ["Total Vehicles", fo.totalVehicles],
          ["Active Cards", fo.activeCards],
        ].map(([label, value]) => (
          <div key={String(label)} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-muted-foreground shrink-0 w-36">{label}</span>
            <span className="font-medium text-foreground text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Request change note */}
      <div className="bg-muted/30 border border-border rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">To update your company details, contact details, or bank account, click "Request Change" and your MIC officer will assist you.</p>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowPasswordModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h3 className="font-semibold text-foreground">Change Password</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Enter your current password and choose a new one</p>
                </div>
                <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {passwordSuccess ? (
                <div className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground">Password Updated</h4>
                  <p className="text-sm text-muted-foreground mt-1">Your password has been changed successfully.</p>
                  <button onClick={() => setShowPasswordModal(false)}
                    className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                    Done
                  </button>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Current Password <span className="text-destructive">*</span></label>
                    <div className="relative mt-1">
                      <input type={showCurrent ? "text" : "password"} placeholder="Enter current password"
                        value={passwordForm.current}
                        onChange={e => { setPasswordForm(f => ({ ...f, current: e.target.value })); setPasswordError("") }}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-input text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">New Password <span className="text-destructive">*</span></label>
                    <div className="relative mt-1">
                      <input type={showNew ? "text" : "password"} placeholder="Enter new password (min 8 characters)"
                        value={passwordForm.newPass}
                        onChange={e => { setPasswordForm(f => ({ ...f, newPass: e.target.value })); setPasswordError("") }}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-input text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {passwordForm.newPass && (
                      <div className="mt-1.5 flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${
                            passwordForm.newPass.length >= 8 && i < 2 ? "bg-amber-400" :
                            passwordForm.newPass.length >= 10 && /[A-Z]/.test(passwordForm.newPass) && i < 3 ? "bg-green-400" :
                            passwordForm.newPass.length >= 12 && /[!@#$%]/.test(passwordForm.newPass) && i < 4 ? "bg-green-600" :
                            "bg-muted"
                          }`} />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1">
                          {passwordForm.newPass.length < 8 ? "Too short" :
                           passwordForm.newPass.length < 10 ? "Weak" :
                           passwordForm.newPass.length < 12 ? "Good" : "Strong"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Confirm New Password <span className="text-destructive">*</span></label>
                    <div className="relative mt-1">
                      <input type={showConfirm ? "text" : "password"} placeholder="Re-enter new password"
                        value={passwordForm.confirm}
                        onChange={e => { setPasswordForm(f => ({ ...f, confirm: e.target.value })); setPasswordError("") }}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-input text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.confirm && passwordForm.newPass !== passwordForm.confirm && (
                      <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <p className="text-xs text-red-700">{passwordError}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowPasswordModal(false)}
                      className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!passwordForm.current) { setPasswordError("Please enter your current password"); return }
                        if (passwordForm.newPass.length < 8) { setPasswordError("New password must be at least 8 characters"); return }
                        if (passwordForm.newPass !== passwordForm.confirm) { setPasswordError("Passwords do not match"); return }
                        setPasswordSuccess(true)
                      }}
                      className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                      Update Password
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
