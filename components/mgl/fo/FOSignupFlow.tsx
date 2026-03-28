"use client"

import { useState } from "react"
import {
  CheckCircle, Eye, EyeOff, Smartphone
} from "lucide-react"
import Image from "next/image"

export default function FOSignupFlow({ onComplete, onLogin }: { onComplete: () => void; onLogin: () => void }) {
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
