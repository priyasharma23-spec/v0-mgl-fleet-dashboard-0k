"use client";
import { useState } from "react";
import { Upload, CheckCircle, Copy, RefreshCw, AlertCircle, Send, ExternalLink } from "lucide-react";

interface MICRegisterFOProps {
  onViewChange: (view: string) => void;
}

export default function MICRegisterFO({ onViewChange }: MICRegisterFOProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [activationLink, setActivationLink] = useState("https://mglfleet.in/activate?token=MGL-7X9K2P-2025");
  const [copied, setCopied] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [form, setForm] = useState({
    name: "", contact: "", email: "", pan: "", gstn: "",
    registeredAddress: "", deliveryAddress: "",
    mouExecutionDate: "", mouTerm: "12",
    vehiclesPurchased: "", vehiclesRetrofitted: "",
    mouFile: null as File | null, appendixFile: null as File | null,
  });
  const [panValid, setPanValid] = useState<null | boolean>(null);
  const [panLoading, setPanLoading] = useState(false);
  const [gstnValid, setGstnValid] = useState<null | boolean>(null);
  const [gstnLoading, setGstnLoading] = useState(false);
  const [gstnData, setGstnData] = useState<{ tradeName: string; status: string } | null>(null);

  const validatePAN = async () => {
    if (form.pan.length !== 10) return;
    setPanLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPanValid(true);
    setPanLoading(false);
  };

  const validateGSTN = async () => {
    if (form.gstn.length < 15) return;
    setGstnLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    // Simulate GSTN validation - check if PAN portion matches
    const gstnPanPortion = form.gstn.substring(2, 12);
    if (form.pan && gstnPanPortion !== form.pan) {
      setGstnValid(false);
      setGstnData(null);
    } else {
      setGstnValid(true);
      setGstnData({ tradeName: form.name || "ABC Logistics Pvt. Ltd.", status: "Active" });
    }
    setGstnLoading(false);
  };

  const resendActivationLink = async () => {
    setLinkSent(false);
    await new Promise((r) => setTimeout(r, 800));
    setLinkSent(true);
    setTimeout(() => setLinkSent(false), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(activationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const InputField = ({ label, name, type = "text", placeholder, required = false }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
      <input
        type={type}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        value={(form as Record<string, string>)[name] || ""}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      />
    </div>
  );

  const FileField = ({ label, fieldName }: { label: string; fieldName: "mouFile" | "appendixFile" }) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <label className="mt-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors">
        <Upload className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {form[fieldName] ? (form[fieldName] as File).name : "Click to upload PDF (max 10MB)"}
        </span>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => setForm({ ...form, [fieldName]: e.target.files?.[0] || null })}
        />
      </label>
    </div>
  );

  const mouExpiry = form.mouExecutionDate && form.mouTerm
    ? (() => {
        const d = new Date(form.mouExecutionDate);
        d.setMonth(d.getMonth() + parseInt(form.mouTerm));
        return d.toLocaleDateString("en-IN");
      })()
    : "—";

  return (
    <div className="flex flex-col gap-5 p-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">Register Fleet Operator</h1>
        <p className="text-sm text-muted-foreground">MIC-Assisted Onboarding — Incentive-Eligible Registration</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-0">
        {["KYB Details", "MoU Setup", "Vehicle Plan", "Review & Send"].map((label, i) => {
          const s = i + 1;
          return (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step > s ? "bg-primary text-white" : step === s ? "bg-primary/20 text-primary ring-2 ring-primary/30" : "bg-muted text-muted-foreground"
                }`}>
                  {step > s ? "✓" : s}
                </div>
                <span className={`text-[10px] font-medium whitespace-nowrap ${step === s ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < 3 && <div className={`h-0.5 w-10 sm:w-16 mx-1 mb-4 shrink-0 ${step > s ? "bg-primary" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      {/* Form card */}
      <div className="bg-card rounded-xl border border-border p-5">
        {/* Step 1: KYB */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">KYB — Fleet Operator Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Transporter / Fleet Owner Name" name="name" required />
              <InputField label="Contact Number" name="contact" type="tel" required />
              <InputField label="Email Address" name="email" type="email" required />
              <div>
                <label className="text-xs font-medium text-muted-foreground">PAN Number <span className="text-destructive">*</span></label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="AABCA1234F"
                    value={form.pan}
                    onChange={(e) => { setForm({ ...form, pan: e.target.value.toUpperCase() }); setPanValid(null); }}
                    className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button onClick={validatePAN} disabled={panLoading || form.pan.length !== 10}
                    className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 disabled:opacity-40">
                    {panLoading ? <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin inline-block" /> : "Verify"}
                  </button>
                </div>
                {panValid === true && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> PAN Active — AABCA1234F</p>}
                {panValid === false && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> PAN not found or inactive</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">GSTN Number <span className="text-destructive">*</span></label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="27AABCA1234F1Z5"
                    value={form.gstn}
                    onChange={(e) => { setForm({ ...form, gstn: e.target.value.toUpperCase() }); setGstnValid(null); setGstnData(null); }}
                    className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button onClick={validateGSTN} disabled={gstnLoading || form.gstn.length < 15}
                    className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 disabled:opacity-40">
                    {gstnLoading ? <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin inline-block" /> : "Verify"}
                  </button>
                </div>
                {gstnValid === true && gstnData && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> GST Active — {gstnData.tradeName}
                  </p>
                )}
                {gstnValid === false && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> GSTN invalid or PAN mismatch
                  </p>
                )}
              </div>
              <InputField label="Registered Address" name="registeredAddress" required />
              <InputField label="Delivery Address (for card dispatch)" name="deliveryAddress" required />
            </div>
          </div>
        )}

        {/* Step 2: MoU */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">MoU Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">MoU Number (System Generated)</label>
                <input disabled value="MGL/MOU/2025/005" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground" />
              </div>
              <InputField label="MoU Execution Date" name="mouExecutionDate" type="date" required />
              <div>
                <label className="text-xs font-medium text-muted-foreground">Term of MoU (months)</label>
                <select value={form.mouTerm} onChange={(e) => setForm({ ...form, mouTerm: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">MoU Expiry Date (auto-calculated)</label>
                <input disabled value={mouExpiry} className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileField label="MoU Copy (PDF, max 10MB)" fieldName="mouFile" />
              <FileField label="Appendix 1 Copy (Retrofitment)" fieldName="appendixFile" />
            </div>
          </div>
        )}

        {/* Step 3: Vehicles */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Vehicle Plan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Number of Vehicles to be Purchased" name="vehiclesPurchased" type="number" />
              <InputField label="Number of Vehicles to be Retrofitted" name="vehiclesRetrofitted" type="number" />
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              Total vehicles planned: <strong>{(parseInt(form.vehiclesPurchased) || 0) + (parseInt(form.vehiclesRetrofitted) || 0)}</strong>
            </div>
          </div>
        )}

        {/* Step 4: Review & Send */}
        {step === 4 && !submitted && (
          <div className="space-y-4">
            <p className="font-semibold text-sm text-foreground border-b border-border pb-2">Review & Send Activation Link</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["FO Name", form.name || "ABC Logistics Pvt. Ltd."],
                ["Contact", form.contact || "9876543210"],
                ["Email", form.email || "admin@abclogistics.com"],
                ["PAN", form.pan || "AABCA1234F"],
                ["GSTN", form.gstn || "27AABCA1234F1Z5"],
                ["MoU Number", "MGL/MOU/2025/005"],
                ["MoU Expiry", mouExpiry || "15 Jan 2026"],
                ["Total Vehicles", String((parseInt(form.vehiclesPurchased) || 0) + (parseInt(form.vehiclesRetrofitted) || 0))],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">{k}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-blue-700">Activation Link (expires in 48 hours)</p>
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">PENDING_ACTIVATION</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={activationLink}
                  className="flex-1 text-xs bg-white border border-blue-200 rounded px-2 py-1.5 text-blue-700 font-mono"
                />
                <button onClick={copyLink} title="Copy Link" className="p-1.5 rounded bg-blue-100 hover:bg-blue-200 transition-colors text-blue-700">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copied && <p className="text-xs text-green-600">Copied to clipboard!</p>}
              <div className="flex items-center gap-2 pt-1 border-t border-blue-200">
                <button onClick={resendActivationLink} disabled={linkSent}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors">
                  <Send className="w-3 h-3" />
                  {linkSent ? "Email Sent!" : "Resend via Email"}
                </button>
                <button onClick={copyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-300 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Copy Link
                </button>
              </div>
              <p className="text-[10px] text-blue-600">Link will be sent to {form.email || "admin@abclogistics.com"} with CC to MIC</p>
            </div>
          </div>
        )}

        {/* Submitted state */}
        {submitted && (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Fleet Operator Registered!</p>
              <p className="text-sm text-muted-foreground mt-1">Activation link sent to {form.email || "admin@abclogistics.com"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">MoU Number: MGL/MOU/2025/005 · Status: PENDING_ACTIVATION</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setSubmitted(false); setStep(1); }}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">
                Register Another FO
              </button>
              <button onClick={() => onViewChange("mic-operators")}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                View All Operators
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {!submitted && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted"
            >
              Back
            </button>
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                Continue
              </button>
            ) : (
              <button onClick={() => setSubmitted(true)}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                Send Activation Link
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
