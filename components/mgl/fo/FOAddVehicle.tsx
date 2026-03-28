"use client"

import { useState } from "react"
import { Upload, CheckCircle, Truck, RefreshCw } from "lucide-react"

interface FormData {
  vehicleNumber: string
  oemId: string
  dealerId: string
  retrofitterId: string
  category: string
  model: string
  customModel: string
  bookingDate: string
  registrationDate: string
  driverName: string
  driverContact: string
  driverLicense: string
  deliveryAddress: string
  bookingReceipt: File | null
  deliveryChallan: File | null
  rcBook: File | null
  cngCert: File | null
  eFitment: File | null
  rtoEndorsement: File | null
  typeApproval: File | null
  taxInvoice: File | null
  driverLicenseFile: File | null
}

export function FOAddVehicle({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [vehicleType, setVehicleType] = useState<"new_purchase" | "retrofit">("new_purchase")
  const [form, setForm] = useState<FormData>({
    vehicleNumber: "",
    oemId: "",
    dealerId: "",
    retrofitterId: "",
    category: "",
    model: "",
    customModel: "",
    bookingDate: "",
    registrationDate: "",
    driverName: "",
    driverContact: "",
    driverLicense: "",
    deliveryAddress: "",
    bookingReceipt: null,
    deliveryChallan: null,
    rcBook: null,
    cngCert: null,
    eFitment: null,
    rtoEndorsement: null,
    typeApproval: null,
    taxInvoice: null,
    driverLicenseFile: null,
  })

  return (
    <div className="flex flex-col gap-5 p-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">Register New Vehicle</h1>
        <p className="text-sm text-muted-foreground">Add a CNG vehicle to your fleet for card issuance</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center gap-0">
        {["Vehicle Type", "Vehicle Details", "Driver & Address", "Documents", "Review"].map((label, i) => {
          const s = i + 1
          return (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step > s ? "bg-primary text-white" : step === s ? "bg-primary/20 text-primary ring-2 ring-primary/30" : "bg-muted text-muted-foreground"}`}>
                  {step > s ? "✓" : s}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-medium whitespace-nowrap hidden sm:block ${step === s ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < 4 && <div className={`h-0.5 flex-1 mx-0.5 sm:mx-1 mb-4 shrink-0 ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          )
        })}
      </div>

      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Select Vehicle Onboarding Type</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "new_purchase" as const, label: "New CNG Vehicle", desc: "Factory-fitted CNG from OEM dealer", bg: "bg-blue-50 border-blue-200" },
                { id: "retrofit" as const, label: "Retrofitted Vehicle", desc: "Existing vehicle converted to CNG", bg: "bg-amber-50 border-amber-200" },
              ].map((t) => (
                <button key={t.id} onClick={() => setVehicleType(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${vehicleType === t.id ? "border-primary ring-2 ring-primary/20 " + t.bg : "border-border hover:border-muted-foreground/30"}`}>
                  <Truck className={`w-6 h-6 mb-2 ${vehicleType === t.id ? "text-primary" : "text-muted-foreground"}`} />
                  <p className={`font-semibold text-sm ${vehicleType === t.id ? "text-primary" : "text-foreground"}`}>{t.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">{vehicleType === "new_purchase" ? "New Vehicle Details" : "Retrofitted Vehicle Details"}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Vehicle Number" className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="text" placeholder="Category" className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="text" placeholder="Model" className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="date" className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Driver Details & Card Delivery Address</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Driver Name" className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="tel" placeholder="Driver Contact" className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea rows={2} placeholder="Card Delivery Address" className="sm:col-span-2 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Upload Documents</p>
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/60">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Upload PDF / JPG (max 10MB)</span>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
            </label>
          </div>
        )}

        {step === 5 && !submitted && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Review & Submit</p>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary">
              By submitting, you confirm all uploaded documents are authentic.
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
              <p className="text-sm text-muted-foreground mt-1">Your officer will review the documents.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setSubmitted(false); setStep(1); }} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">
                Add Another Vehicle
              </button>
              <button onClick={() => onViewChange("fo-vehicles")} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                View My Vehicles
              </button>
            </div>
          </div>
        )}

        {!submitted && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted">
              Back
            </button>
            {step < 5 ? (
              <button onClick={() => setStep(step + 1)} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
                Continue
              </button>
            ) : (
              <button onClick={() => setSubmitted(true)} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90">
                Submit for Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
