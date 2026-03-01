"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Shield, Truck, Users, Smartphone, KeyRound, LinkIcon, UserPlus, CheckCircle, Building2 } from "lucide-react";
import type { UserRole } from "@/lib/mgl-data";
import type { ActivationData, FOOnboardingType } from "@/app/page";

interface LoginPageProps {
  onLogin: (role: UserRole, name: string, onboardingType?: FOOnboardingType) => void;
  activationData?: ActivationData | null;
  showRegistration?: boolean;
  onStartRegistration?: () => void;
}

type LoginMethod = "email" | "mobile";
type FOFlow = "login" | "activation" | "register";

const roles = [
  {
    role: "mgl-admin" as UserRole,
    label: "MGL Admin",
    short: "Admin",
    description: "System oversight, settlements, incentive management, and MIS reporting",
    icon: Building2,
    color: "border-purple-200 hover:border-purple-400 hover:bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badgeBg: "bg-purple-600",
    user: "Arun Verma",
  },
  {
    role: "mic" as UserRole,
    label: "Marketing In-Charge",
    short: "MIC",
    description: "Manage FO registrations, upload MoUs, and handle L1 approvals",
    icon: Users,
    color: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-600",
    user: "Rajesh Sharma",
  },
  {
    role: "zic" as UserRole,
    label: "Zone In-Charge",
    short: "ZIC",
    description: "Review L2 documents, approve card orders, and manage zone operations",
    icon: Shield,
    color: "border-amber-200 hover:border-amber-400 hover:bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-600",
    user: "Priya Mehta",
  },
  {
    role: "fleet-operator" as UserRole,
    label: "Fleet Operator",
    short: "FO",
    description: "Register vehicles, upload documents, and manage fuel cards",
    icon: Truck,
    color: "border-green-200 hover:border-green-400 hover:bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badgeBg: "bg-[#2EAD4B]",
    user: "ABC Logistics Admin",
  },
];

export default function LoginPage({ onLogin, activationData, showRegistration, onStartRegistration }: LoginPageProps) {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("mobile");
  const [foFlow, setFoFlow] = useState<FOFlow>(activationData ? "activation" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState(activationData?.registeredMobile || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-select fleet operator if activation link detected
  useEffect(() => {
    if (activationData) {
      setSelected("fleet-operator");
      setFoFlow("activation");
      setMobile("");
    }
  }, [activationData]);

  // Switch to registration flow if requested
  useEffect(() => {
    if (showRegistration) {
      setSelected("fleet-operator");
      setFoFlow("register");
    }
  }, [showRegistration]);

  // OTP Timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) return;
    setLoading(true);
    setOtpError("");
    setMobileError("");
    
    // For activation flow, verify mobile matches registered mobile
    if (foFlow === "activation" && activationData) {
      await new Promise((r) => setTimeout(r, 800));
      if (mobile !== activationData.registeredMobile) {
        setMobileError("Mobile number does not match the registered number. Please use the mobile provided during registration.");
        setLoading(false);
        return;
      }
    }
    
    await new Promise((r) => setTimeout(r, 1000));
    setOtpSent(true);
    setOtpTimer(30);
    setLoading(false);
    // Focus first OTP input
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");
    // Auto-focus next input
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

  const handleLogin = async () => {
    if (!selected) return;
    setLoading(true);
    
    if (loginMethod === "mobile") {
      const enteredOtp = otp.join("");
      if (enteredOtp.length !== 6) {
        setOtpError("Please enter complete 6-digit OTP");
        setLoading(false);
        return;
      }
      // Simulate OTP verification (accept any 6-digit OTP for demo)
      await new Promise((r) => setTimeout(r, 800));
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    
    // Determine onboarding type for fleet operator
    if (selected === "fleet-operator") {
      if (foFlow === "activation") {
        // MIC-assisted flow - FO already registered by MIC
        onLogin(selected, activationData?.foName || "ABC Logistics", "MIC_ASSISTED");
      } else if (foFlow === "register") {
        // Self-service flow - new registration
        onLogin(selected, "New Operator", "SELF_SERVICE");
      } else {
        // Regular login
        const roleData = roles.find((r) => r.role === selected)!;
        onLogin(selected, roleData.user, "MIC_ASSISTED");
      }
    } else {
      const roleData = roles.find((r) => r.role === selected)!;
      onLogin(selected, roleData.user);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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

        {/* Role Selection */}
        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Select Your Role</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose your portal to continue</p>
          </div>
          <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selected === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setSelected(r.role)}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all duration-150 ${r.color} ${isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border bg-background"}`}
                >
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </span>
                  )}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${isSelected ? "bg-primary" : r.iconBg}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? "text-white" : r.iconColor}`} />
                  </div>
                  <p className={`font-semibold text-xs ${isSelected ? "text-primary" : "text-foreground"}`}>{r.label}</p>
                  <span className={`inline-block mt-1.5 text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${r.badgeBg}`}>{r.short}</span>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          {selected && (
            <div className="px-6 pb-6 border-t border-border pt-5">
              <div className="max-w-sm mx-auto space-y-4">
                
                {/* FO Flow Selection - Only for Fleet Operator */}
                {selected === "fleet-operator" && !activationData && (
                  <div className="flex items-center gap-2 p-1 bg-muted rounded-lg mb-2">
                    <button
                      onClick={() => { setFoFlow("login"); resetOtpState(); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                        foFlow === "login" 
                          ? "bg-card text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Sign In
                    </button>
                    <button
                      onClick={() => { setFoFlow("register"); resetOtpState(); onStartRegistration?.(); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-md text-xs font-medium transition-all ${
                        foFlow === "register" 
                          ? "bg-card text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      New Registration
                    </button>
                  </div>
                )}

                {/* Activation Link Banner */}
                {selected === "fleet-operator" && activationData && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-800">Activation Link Detected</p>
                        <p className="text-xs text-green-600">Your account was created by {activationData.micName}</p>
                      </div>
                    </div>
                    <div className="text-xs text-green-700 space-y-1 pl-10">
                      <p><span className="font-medium">Company:</span> {activationData.foName}</p>
                      <p><span className="font-medium">Registered Mobile:</span> +91 {activationData.registeredMobile.slice(0, 2)}****{activationData.registeredMobile.slice(-2)}</p>
                    </div>
                    <p className="text-[11px] text-green-600 pl-10">Enter your registered mobile number to verify and activate your account.</p>
                  </div>
                )}

                {/* Self-Registration Banner */}
                {selected === "fleet-operator" && foFlow === "register" && !activationData && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <UserPlus className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-blue-700">Self-Service Registration</p>
                        <p className="text-[11px] text-blue-600 mt-0.5">Create your Fleet Operator account. After verification, you'll complete the KYB registration process.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Login Method Toggle - Only for MIC/ZIC, FO always uses Mobile+OTP */}
                {selected !== "fleet-operator" && (
                  <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                    <button
                      onClick={() => { setLoginMethod("mobile"); resetOtpState(); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        loginMethod === "mobile" 
                          ? "bg-card text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      Mobile + OTP
                    </button>
                    <button
                      onClick={() => { setLoginMethod("email"); resetOtpState(); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        loginMethod === "email" 
                          ? "bg-card text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <KeyRound className="w-4 h-4" />
                      Email + Password
                    </button>
                  </div>
                )}

                {/* Mobile + OTP Login - Always for FO, conditional for MIC/ZIC */}
                {(selected === "fleet-operator" || loginMethod === "mobile") && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        {activationData ? "Registered Mobile Number" : "Mobile Number"}
                      </label>
                      <div className="flex gap-2 mt-1">
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
                          placeholder={activationData ? "Enter your registered mobile" : "Enter 10-digit mobile"}
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
                          <>{activationData ? "Verify & Send OTP" : "Send OTP"} <ArrowRight className="w-4 h-4" /></>
                        )}
                      </button>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-muted-foreground">Enter OTP</label>
                            <span className="text-xs text-muted-foreground">
                              Sent to +91 {mobile}
                            </span>
                          </div>
                          <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                            {otp.map((digit, i) => (
                              <input
                                key={i}
                                ref={(el) => { otpRefs.current[i] = el; }}
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
                          {otpError && <p className="text-xs text-destructive mt-1 text-center">{otpError}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Didn't receive OTP?"}
                          </span>
                          <button
                            onClick={handleSendOtp}
                            disabled={otpTimer > 0 || loading}
                            className="text-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline"
                          >
                            Resend OTP
                          </button>
                        </div>

                        <button
                          onClick={handleLogin}
                          disabled={loading || otp.join("").length !== 6}
                          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
                        >
                          {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              {activationData ? "Activate Account" : foFlow === "register" ? "Create Account" : "Verify & Sign In"} 
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Email + Password Login - Only for MIC/ZIC (FO always uses Mobile+OTP) */}
                {loginMethod === "email" && selected !== "fleet-operator" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Email / Username</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Sign In <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                )}

                {/* Registration / Activation hints */}
                {selected !== "fleet-operator" && (
                  <p className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
                    New Fleet Operator?{" "}
                    <button
                      onClick={() => { setSelected("fleet-operator"); setFoFlow("register"); onStartRegistration?.(); }}
                      className="text-primary font-medium hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                )}
                {selected === "fleet-operator" && foFlow === "register" && (
                  <p className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
                    Already have an account?{" "}
                    <button
                      onClick={() => setFoFlow("login")}
                      className="text-primary font-medium hover:underline"
                    >
                      Sign in here
                    </button>
                    {" | "}
                    <span className="text-muted-foreground">Have an activation link? </span>
                    <button
                      onClick={() => alert("Please use the activation link sent to your email by MIC.")}
                      className="text-primary font-medium hover:underline"
                    >
                      Use activation link
                    </button>
                  </p>
                )}
                {selected === "fleet-operator" && activationData && (
                  <p className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
                    <CheckCircle className="w-3 h-3 inline mr-1 text-green-600" />
                    After activation, you can directly add vehicles to your fleet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 Mahanagar Gas Limited. All rights reserved. | Platform v2.1
        </p>
      </div>
    </div>
  );
}
