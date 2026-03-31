"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Smartphone, KeyRound, Eye, EyeOff, Truck, Building2, ArrowLeft, KeyRound as KeyIcon, UserPlus } from "lucide-react";
import type { UserRole } from "@/lib/mgl-data";
import type { ActivationData, FOOnboardingType } from "@/app/page";
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter";

interface LoginPageProps {
  onLogin: (role: UserRole, name: string, onboardingType?: FOOnboardingType, department?: string) => void;
  activationData?: ActivationData | null;
  showRegistration?: boolean;
  onStartRegistration?: () => void;
}

type LoginMethod = "mobile" | "email";
type Portal = "" | "fo" | "mgl";

const mockUsers = [
  { mobile: "9999999999", email: "admin@mgl.com", password: "admin123", name: "Arun Verma", role: "mgl-admin" as UserRole, department: "admin" },
  { mobile: "8888888888", email: "finance@mgl.com", password: "fin123", name: "Priya Shah", role: "mgl-admin" as UserRole, department: "finance" },
  { mobile: "7777777777", email: "marketing@mgl.com", password: "mkt123", name: "Rahul Mehta", role: "mgl-admin" as UserRole, department: "marketing" },
  { mobile: "6666666666", email: "mic@mgl.com", password: "mic123", name: "Sneha Patil", role: "mic" as UserRole, department: "mic" },
  { mobile: "5555555555", email: "zic@mgl.com", password: "zic123", name: "Vikas Joshi", role: "zic" as UserRole, department: "zic" },
  { mobile: "3333333333", email: "fo@abc-logistics.com", password: "fo123", name: "Rajesh Gupta", role: "fleet-operator" as UserRole, department: "fleet-operator", onboardingType: "MIC_ASSISTED" },
  { mobile: "4444444444", email: "priya@priyatransport.com", password: "fo123", name: "Priya Sharma", role: "fleet-operator" as UserRole, department: "fleet-operator", onboardingType: "SELF_SERVICE" },
];

export default function LoginPage({ onLogin, activationData, showRegistration, onStartRegistration }: LoginPageProps) {
  const [portal, setPortal] = useState<Portal>("");
  const [foFlow, setFoFlow] = useState<"signin" | "register">("signin");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [acceptTnC, setAcceptTnC] = useState(false);
  const [mglMobile, setMglMobile] = useState("");
  const [mglOtp, setMglOtp] = useState(["", "", "", "", "", ""]);
  const [mglOtpSent, setMglOtpSent] = useState(false);
  const [mglOtpError, setMglOtpError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setMobileError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    setOtpError("");
    setMobileError("");
    
    await new Promise((r) => setTimeout(r, 800));
    setOtpSent(true);
    setOtpTimer(30);
    setLoading(false);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    if (pastedData.length === 6) {
      otpRefs.current[5]?.focus();
    }
  };

  const handleFOLogin = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter complete 6-digit OTP");
      return;
    }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    
    const user = mockUsers.find(u => u.mobile === mobile);
    if (user) {
      onLogin(user.role, user.name, (user as any).onboardingType || "MIC_ASSISTED", user.department);
    } else {
      onLogin("fleet-operator", "Suresh Kumar", "MIC_ASSISTED");
    }
    setLoading(false);
  };

  const handleMGLMobileLogin = async () => {
    const enteredOtp = mglOtp.join("");
    if (enteredOtp.length !== 6) {
      setMglOtpError("Please enter complete 6-digit OTP");
      return;
    }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    
    const user = mockUsers.find(u => u.mobile === mglMobile);
    if (user) {
      onLogin(user.role, user.name, undefined, user.department);
    } else {
      setMglOtpError("Invalid OTP or mobile number");
    }
    setLoading(false);
  };

  const handleMGLEmailLogin = async () => {
    if (!email || !password) {
      setEmailError("Please enter email and password");
      return;
    }
    
    setLoading(true);
    setEmailError("");
    await new Promise((r) => setTimeout(r, 800));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user.role, user.name, undefined, user.department);
    } else {
      setEmailError("Invalid credentials");
    }
    setLoading(false);
  };

  const resetOtpState = () => {
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpTimer(0);
    setOtpError("");
    setMobileError("");
  };

  const handleBackToPortals = () => {
    setPortal("");
    setFoFlow("signin");
    setLoginMethod("mobile");
    resetOtpState();
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setEmailError("");
    setMglMobile("");
    setMglOtp(["", "", "", "", "", ""]);
    setMglOtpSent(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg bg-white flex items-center justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-agxPFremWBWY82BTBrfdO5RnOzVori.png"
                  alt="Mahanagar Gas Limited"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Mahanagar Gas Limited</h1>
            <p className="text-muted-foreground mt-1">Fleet Operator Onboarding Platform</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="w-8 h-0.5 bg-primary/30 rounded" />
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">MGL Fleet Platform</span>
              <span className="w-8 h-0.5 bg-primary/30 rounded" />
            </div>
          </div>

          {/* Portal Selection */}
          {!portal && (
            <div className="space-y-4">
              <div
                onClick={() => setPortal("fo")}
                className="cursor-pointer border-2 border-border rounded-xl p-6 hover:border-green-400 hover:bg-green-50 transition-all shadow-sm hover:shadow-md"
              >
                <Truck className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-bold text-lg text-foreground">Fleet Operator</h3>
                <p className="text-sm text-muted-foreground mt-1">Sign in or register your fleet</p>
              </div>

              <div
                onClick={() => setPortal("mgl")}
                className="cursor-pointer border-2 border-border rounded-xl p-6 hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm hover:shadow-md"
              >
                <Building2 className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-bold text-lg text-foreground">MGL Staff</h3>
                <p className="text-sm text-muted-foreground mt-1">Admin, Finance, Marketing & Operations</p>
              </div>
            </div>
          )}

          {/* Fleet Operator Portal */}
          {portal === "fo" && (
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Fleet Operator Portal</h2>
                  <p className="text-sm text-muted-foreground mt-1">Sign in or register</p>
                </div>
                <button
                  onClick={handleBackToPortals}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-6">
                {/* Tab Switcher */}
                <div className="flex items-center gap-2 p-1 bg-muted rounded-full mb-6 inline-flex">
                  <button
                    onClick={() => {
                      setFoFlow("signin");
                      resetOtpState();
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      foFlow === "signin" 
                        ? "bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <KeyIcon className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setFoFlow("register");
                      resetOtpState();
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      foFlow === "register" 
                        ? "bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    New Registration
                  </button>
                </div>

                {/* Sign In Tab */}
                {foFlow === "signin" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Mobile Number</label>
                      <div className="flex gap-2 mt-2">
                        <span className="flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value.replace(/\D/g, ""));
                            setMobileError("");
                            if (otpSent) resetOtpState();
                          }}
                          placeholder="Enter 10-digit mobile"
                          className={`flex-1 px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                            mobileError ? "border-destructive" : "border-border"
                          }`}
                        />
                      </div>
                      {mobileError && <p className="text-xs text-destructive mt-1">{mobileError}</p>}
                    </div>

                    {!otpSent ? (
                      <button
                        onClick={handleSendOtp}
                        disabled={loading || mobile.length !== 10}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Send OTP <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-muted-foreground">Enter OTP</label>
                            <span className="text-xs text-muted-foreground">Sent to +91 {mobile}</span>
                          </div>
                          <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                            {otp.map((digit, i) => (
                              <input
                                key={i}
                                ref={(el) => {
                                  otpRefs.current[i] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                className={`w-10 h-12 text-center text-lg font-bold rounded-lg border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                                  otpError ? "border-destructive" : "border-border"
                                }`}
                              />
                            ))}
                          </div>
                          {otpError && <p className="text-xs text-destructive mt-2 text-center">{otpError}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Didn't receive OTP?"}
                          </span>
                          <button
                            onClick={handleSendOtp}
                            disabled={otpTimer > 0}
                            className="text-primary hover:underline font-medium disabled:opacity-50"
                          >
                            Resend
                          </button>
                        </div>

                        <button
                          onClick={handleFOLogin}
                          disabled={loading || otp.join("").length !== 6}
                          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                        >
                          {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                          ) : (
                            "Verify & Sign In"
                          )}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* New Registration Tab */}
                {foFlow === "register" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Self-Service Registration</span> — Create your Fleet Operator account. After verification, you'll complete the KYB registration process.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Mobile Number</label>
                      <div className="flex gap-2 mt-2">
                        <span className="flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => {
                            setMobile(e.target.value.replace(/\D/g, ""));
                            setMobileError("");
                            if (otpSent) resetOtpState();
                          }}
                          placeholder="Enter 10-digit mobile"
                          className={`flex-1 px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                            mobileError ? "border-destructive" : "border-border"
                          }`}
                        />
                      </div>
                      {mobileError && <p className="text-xs text-destructive mt-1">{mobileError}</p>}
                    </div>

                    {!otpSent ? (
                      <button
                        onClick={handleSendOtp}
                        disabled={loading || mobile.length !== 10}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Send OTP <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-muted-foreground">Enter OTP</label>
                            <span className="text-xs text-muted-foreground">Sent to +91 {mobile}</span>
                          </div>
                          <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                            {otp.map((digit, i) => (
                              <input
                                key={i}
                                ref={(el) => {
                                  otpRefs.current[i] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                className={`w-10 h-12 text-center text-lg font-bold rounded-lg border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                                  otpError ? "border-destructive" : "border-border"
                                }`}
                              />
                            ))}
                          </div>
                          {otpError && <p className="text-xs text-destructive mt-2 text-center">{otpError}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Didn't receive OTP?"}
                          </span>
                          <button
                            onClick={handleSendOtp}
                            disabled={otpTimer > 0}
                            className="text-primary hover:underline font-medium disabled:opacity-50"
                          >
                            Resend
                          </button>
                        </div>

                        <div className="flex items-start gap-2">
                          <input type="checkbox" id="tnc" checked={acceptTnC} onChange={e => setAcceptTnC(e.target.checked)} className="mt-0.5 accent-primary" />
                          <label htmlFor="tnc" className="text-xs text-muted-foreground">
                            I agree to the <span className="text-primary font-medium cursor-pointer">Terms & Conditions</span> and <span className="text-primary font-medium cursor-pointer">Privacy Policy</span> of Mahanagar Gas Limited
                          </label>
                        </div>

                        <button
                          onClick={() => onStartRegistration?.()}
                          disabled={loading || otp.join("").length !== 6 || !acceptTnC}
                          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                        >
                          {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                          ) : (
                            "Create Account"
                          )}
                        </button>
                      </>
                    )}

                    <div className="pt-4 border-t border-border space-y-2 text-xs text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-muted-foreground">Already have an account?</span>
                        <button onClick={() => setFoFlow("signin")} className="text-primary hover:underline font-medium">Sign in here</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MGL Staff Portal */}
          {portal === "mgl" && (
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">MGL Staff Portal</h2>
                  <p className="text-sm text-muted-foreground mt-1">Access your operations portal</p>
                </div>
                <button
                  onClick={handleBackToPortals}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-6">
                {/* Login Method Toggle */}
                <div className="flex items-center gap-2 p-1 bg-muted rounded-lg mb-6">
                  <button
                    onClick={() => {
                      setLoginMethod("mobile");
                      resetOtpState();
                      setEmailError("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      loginMethod === "mobile" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    Mobile + OTP
                  </button>
                  <button
                    onClick={() => {
                      setLoginMethod("email");
                      resetOtpState();
                      setMobileError("");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      loginMethod === "email" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    Email & Password
                  </button>
                </div>

                {/* Mobile + OTP Tab */}
                {loginMethod === "mobile" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Mobile Number</label>
                      <div className="flex gap-2 mt-2">
                        <span className="flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mglMobile}
                          onChange={(e) => {
                            setMglMobile(e.target.value.replace(/\D/g, ""));
                            setMobileError("");
                            if (mglOtpSent) {
                              setMglOtpSent(false);
                              setMglOtp(["", "", "", "", "", ""]);
                              setMglOtpError("");
                            }
                          }}
                          placeholder="Enter 10-digit mobile"
                          className={`flex-1 px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                            mobileError ? "border-destructive" : "border-border"
                          }`}
                        />
                      </div>
                      {mobileError && <p className="text-xs text-destructive mt-1">{mobileError}</p>}
                    </div>

                    {!mglOtpSent ? (
                      <button
                        onClick={() => {
                          if (mglMobile.length !== 10) {
                            setMobileError("Please enter a valid 10-digit mobile number");
                            return;
                          }
                          setLoading(true);
                          setMglOtpError("");
                          setMobileError("");
                          setTimeout(async () => {
                            await new Promise((r) => setTimeout(r, 800));
                            setMglOtpSent(true);
                            setOtpTimer(30);
                            setLoading(false);
                          }, 0);
                        }}
                        disabled={loading || mglMobile.length !== 10}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
                      >
                        {loading ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Send OTP <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-muted-foreground">Enter OTP</label>
                            <span className="text-xs text-muted-foreground">Sent to +91 {mglMobile}</span>
                          </div>
                          <div className="flex gap-2 justify-center" onPaste={(e) => {
                            e.preventDefault();
                            const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                            const newOtp = [...mglOtp];
                            for (let i = 0; i < pastedData.length; i++) {
                              newOtp[i] = pastedData[i];
                            }
                            setMglOtp(newOtp);
                            if (pastedData.length === 6) {
                              otpRefs.current[5]?.focus();
                            }
                          }}>
                            {mglOtp.map((digit, i) => (
                              <input
                                key={i}
                                ref={(el) => {
                                  otpRefs.current[i] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                  if (!/^\d*$/.test(e.target.value)) return;
                                  const newOtp = [...mglOtp];
                                  newOtp[i] = e.target.value.slice(-1);
                                  setMglOtp(newOtp);
                                  setMglOtpError("");
                                  if (e.target.value && i < 5) {
                                    otpRefs.current[i + 1]?.focus();
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Backspace" && !mglOtp[i] && i > 0) {
                                    otpRefs.current[i - 1]?.focus();
                                  }
                                }}
                                className={`w-10 h-12 text-center text-lg font-bold rounded-lg border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                                  mglOtpError ? "border-destructive" : "border-border"
                                }`}
                              />
                            ))}
                          </div>
                          {mglOtpError && <p className="text-xs text-destructive mt-2 text-center">{mglOtpError}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Didn't receive OTP?"}
                          </span>
                          <button
                            onClick={() => {
                              setLoading(true);
                              setMglOtpError("");
                              setMobileError("");
                              setTimeout(async () => {
                                await new Promise((r) => setTimeout(r, 800));
                                setMglOtpSent(true);
                                setOtpTimer(30);
                                setLoading(false);
                              }, 0);
                            }}
                            disabled={otpTimer > 0}
                            className="text-primary hover:underline font-medium disabled:opacity-50"
                          >
                            Resend
                          </button>
                        </div>

                        <button
                          onClick={handleMGLMobileLogin}
                          disabled={loading || mglOtp.join("").length !== 6}
                          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                        >
                          {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                          ) : (
                            "Verify & Sign In"
                          )}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Email & Password Tab */}
                {loginMethod === "email" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        placeholder="Enter your email"
                        className={`w-full mt-2 px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                          emailError ? "border-destructive" : "border-border"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Password</label>
                      <div className="relative mt-2">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setEmailError("");
                          }}
                          placeholder="Enter your password"
                          className={`w-full px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                            emailError ? "border-destructive" : "border-border"
                          }`}
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {emailError && <p className="text-xs text-destructive text-center">{emailError}</p>}

                    <button
                      onClick={handleMGLEmailLogin}
                      disabled={loading || !email || !password}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      ) : (
                        "Sign In"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Demo Credentials Note */}
          {portal === "mgl" && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-xs text-blue-700">
                <span className="font-medium">Demo:</span> Mobile 9999999999 or email admin@mgl.com / password admin123
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <PoweredByFooter />
    </div>
  );
}
