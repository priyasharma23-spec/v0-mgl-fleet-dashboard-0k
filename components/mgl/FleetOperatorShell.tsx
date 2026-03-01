"use client"

import { useState } from "react"
import { ChevronDown, MapPin, Phone, Mail, FileText, CreditCard, Eye, EyeOff, Plus, Trash2 } from "lucide-react"

interface Vehicle {
  id: string
  vehicleNumber: string
  oemId: string
  driverName: string
  cardNumber?: string
  trackingId?: string
  balance?: number
  status?: string
}

interface Props {
  user: any
  onLogout: () => void
  onboardingType?: string
  isNewRegistration?: boolean
}

export default function FleetOperatorShell({ user, onLogout, onboardingType = "SELF_SERVICE", isNewRegistration = false }: Props) {
  const [activeView, setActiveView] = useState("fo-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(onboardingType === "MIC_ASSISTED")
  const [selectedCardVehicle, setSelectedCardVehicle] = useState<string | null>(null)
  
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
  const [loadCardModal, setLoadCardModal] = useState(false)
  const [selectedLoadCardVehicle, setSelectedLoadCardVehicle] = useState<string | null>(null)
  const [loadCardMethod, setLoadCardMethod] = useState<"auto" | "manual">("auto")
  const [loadCardAmount, setLoadCardAmount] = useState("")

  // Mock data
  const myVehicles: Vehicle[] = [
    { id: "v1", vehicleNumber: "KA05AN0001", oemId: "OEM001", driverName: "Rajesh Kumar", cardNumber: "4532", balance: 5000, status: "active" },
    { id: "v2", vehicleNumber: "KA05AN0002", oemId: "OEM002", driverName: "Suresh Nair", cardNumber: "4533", balance: 3500, status: "active" },
    { id: "v3", vehicleNumber: "KA05AN0003", oemId: "OEM003", driverName: "Amit Singh", balance: 0, status: "inactive" },
  ]

  // Helper function to validate PIN
  const isInvalidPin = (pin: string): boolean => {
    if (!pin) return false
    const sequentialPatterns = ["1234", "4321", "0123", "9876"]
    if (sequentialPatterns.includes(pin)) return true
    return /^(\d)\1{3}$/.test(pin)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard View */}
      {activeView === "fo-dashboard" && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Fleet Dashboard</h2>
          <FOVehiclesList vehicles={myVehicles} onLoadCard={(vehicleId) => { setLoadCardModal(true); setSelectedLoadCardVehicle(vehicleId) }} />
        </div>
      )}

      {/* Card Activation Modal */}
      {activationStep && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 relative">
            <button onClick={() => setActivationStep(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg">✕</button>
            
            <h3 className="text-lg font-bold text-foreground mb-4">Activate Card</h3>

            {activationStep === "confirmation" && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">Confirm you received the physical card</p>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" checked={cardReceived} onChange={(e) => setCardReceived(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-sm text-foreground">I confirm I have received the card</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setActivationStep(null)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                  <button disabled={!cardReceived} onClick={() => { setActivationStep("set-pin"); setActivationPin("") }} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">Next</button>
                </div>
              </div>
            )}

            {activationStep === "set-pin" && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">Create a 4-digit PIN</p>
                <input type="password" placeholder="••••" value={activationPin} onChange={(e) => setActivationPin(e.target.value.slice(0, 4))} maxLength={4} className="w-full px-3 py-2 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3" />
                {activationPin && isInvalidPin(activationPin) && (<p className="text-xs text-red-600 mb-3">PIN cannot be sequential or repetitive</p>)}
                <div className="flex gap-2">
                  <button onClick={() => setActivationStep("confirmation")} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Back</button>
                  <button disabled={activationPin.length < 4 || isInvalidPin(activationPin)} onClick={() => setActivationStep("confirm-pin")} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">Next</button>
                </div>
              </div>
            )}

            {activationStep === "confirm-pin" && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">Reconfirm your PIN</p>
                <input type="password" placeholder="••••" value={activationPinConfirm} onChange={(e) => setActivationPinConfirm(e.target.value.slice(0, 4))} maxLength={4} className="w-full px-3 py-2 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3" />
                {activationPin !== activationPinConfirm && activationPinConfirm && (<p className="text-xs text-red-600 mb-3">PINs do not match</p>)}
                <div className="flex gap-2">
                  <button onClick={() => setActivationStep("set-pin")} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Back</button>
                  <button disabled={activationPin !== activationPinConfirm || activationPinConfirm.length < 4} onClick={() => setActivationStep("otp")} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">Next</button>
                </div>
              </div>
            )}

            {activationStep === "otp" && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">Enter 6-digit OTP sent to your phone</p>
                <input type="text" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.slice(0, 6).replace(/\D/g, ""))} maxLength={6} className="w-full px-3 py-2 border border-border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3" />
                {otpAttempts > 0 && <p className="text-xs text-red-600 mb-2">Invalid OTP. Attempts: {3 - otpAttempts}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setActivationStep("confirm-pin")} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Back</button>
                  <button disabled={otp.length < 6} onClick={() => { if (otp === "123456") { setActivationStep("success") } else { setOtpAttempts(otpAttempts + 1); if (otpAttempts >= 2) setActivationStep(null) } }} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">Verify</button>
                </div>
              </div>
            )}

            {activationStep === "success" && (
              <div className="text-center">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-lg font-bold text-green-600 mb-4">Card Activated!</h3>
                <button onClick={() => { setActivationStep(null); setActivationCardId(null) }} className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Load Card Modal */}
      {loadCardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 relative">
            <button onClick={() => setLoadCardModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-lg">✕</button>
            
            <h3 className="text-lg font-bold text-foreground mb-4">Load Card</h3>
            <p className="text-sm text-muted-foreground mb-4">Add funds to your card</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Select Vehicle</label>
                <select value={selectedLoadCardVehicle || ""} onChange={(e) => setSelectedLoadCardVehicle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">Choose a vehicle</option>
                  {myVehicles.map((v) => (<option key={v.id} value={v.id}>{v.vehicleNumber}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Load Method</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 flex-1">
                    <input type="radio" name="loadMethod" value="auto" checked={loadCardMethod === "auto"} onChange={(e) => setLoadCardMethod(e.target.value as "auto" | "manual")} className="w-4 h-4" />
                    <span className="text-sm">Auto Load</span>
                  </label>
                  <label className="flex items-center gap-2 flex-1">
                    <input type="radio" name="loadMethod" value="manual" checked={loadCardMethod === "manual"} onChange={(e) => setLoadCardMethod(e.target.value as "auto" | "manual")} className="w-4 h-4" />
                    <span className="text-sm">Manual Load</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Amount (₹)</label>
                <input type="number" value={loadCardAmount} onChange={(e) => setLoadCardAmount(e.target.value)} placeholder="Enter amount" className="w-full px-4 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <div className="flex gap-2">
                <button onClick={() => setLoadCardModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm font-semibold hover:bg-muted">Cancel</button>
                <button onClick={() => { if (selectedLoadCardVehicle && loadCardAmount) setLoadCardModal(false) }} disabled={!selectedLoadCardVehicle || !loadCardAmount} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">Load Card</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FOVehiclesList({ vehicles, onLoadCard }: { vehicles: Vehicle[]; onLoadCard: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {vehicles.map((v) => (
        <div key={v.id} className="p-4 border border-border rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-foreground">{v.vehicleNumber}</p>
              <p className="text-sm text-muted-foreground">{v.driverName}</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Active</span>
          </div>
          <div className="space-y-2 mb-3">
            <p className="text-sm"><span className="text-muted-foreground">Balance:</span> ₹{v.balance || 0}</p>
            {v.cardNumber && <p className="text-sm"><span className="text-muted-foreground">Card:</span> ••••{v.cardNumber}</p>}
          </div>
          <button onClick={() => onLoadCard(v.id)} className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90">Load Card</button>
        </div>
      ))}
    </div>
  )
}
