"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Smartphone, KeyRound } from "lucide-react";
import type { UserRole } from "@/lib/mgl-data";
import type { ActivationData, FOOnboardingType } from "@/app/page";
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter";

interface LoginPageProps {
  onLogin: (role: UserRole, name: string, department?: string, onboardingType?: FOOnboardingType) => void;
  activationData?: ActivationData | null;
  showRegistration?: boolean;
  onStartRegistration?: () => void;
}

type LoginMethod = "mobile" | "email";
type MobileOTPStep = "mobile" | "otp";

const mockUsers = [
  { mobile: "9999999999", email: "admin@mahanagargas.com", password: "admin123", name: "Arun Verma", role: "mgl-admin" as UserRole, department: "admin" },
  { mobile: "8888888888", email: "finance@mahanagargas.com", password: "fin123", name: "Priya Shah", role: "mgl-admin" as UserRole, department: "finance" },
  { mobile: "7777777777", email: "marketing@mahanagargas.com", password: "mkt123", name: "Rahul Mehta", role: "mgl-admin" as UserRole, department: "marketing" },
  { mobile: "6666666666", email: "mic@mahanagargas.com", password: "mic123", name: "Sneha Patil", role: "mic" as UserRole, department: "mic" },
  { mobile: "5555555555", email: "zic@mahanagargas.com", password: "zic123", name: "Vikas Joshi", role: "zic" as UserRole, department: "zic" },
  { mobile: "4444444444", email: "fo@mahanagargas.com", password: "fo123", name: "Suresh Kumar", role: "fleet-operator" as UserRole, department: "fo" },
];

export default function LoginPage({ onLogin, activationData, showRegistration, onStartRegistration }: LoginPageProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("mobile");
  const [mobileOtpStep, setMobileOtpStep] = useState<MobileOTPStep>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setError("Please enter a 10-digit mobile number");
      return;
    }
    setLoading(true);
    setError("");
    
    const user = mockUsers.find(u => u.mobile === mobile);
    if (!user) {
      setError("Mobile number not found in our system");
      setLoading(false);
      return;
    }
    
    await new Promise((r) => setTimeout(r, 1000));
    setMobileOtpStep("otp");
    setOtpTimer(30);
    setLoading(false);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
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

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }
    
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    
    const user = mockUsers.find(u => u.mobile === mobile);
    if (user) {
      onLogin(user.role, user.name, user.department);
    } else {
      setError("Verification failed. Please try again.");
    }
    setLoading(false);
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user.role, user.name, user.department);
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setMobileOtpStep("mobile");
    setMobile("");
    setOtp(["", "", "", "", "", ""]);
    setEmail("");
    setPassword("");
    setError("");
    setOtpTimer(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
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

          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Login</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose your preferred login method</p>
            </div>

            <div className="p-6">
              <div className="max-w-sm mx-auto">
                {/* Login Method Toggle */}
                <div className="flex items-center gap-2 p-1 bg-muted rounded-lg mb-6">
                  <button
                    onClick={() => { resetForm(); setLoginMethod("mobile"); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      loginMethod === "mobile" 
                        ? "bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    Mobile OTP
                  </button>
                  <button
                    onClick={() => { resetForm(); setLoginMethod("email"); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      loginMethod === "email" 
                        ? "bg-card text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <KeyRound className="w-4 h-4" />
                    Email & Password
                  </button>
                </div>

                {/* Mobile OTP Login */}
                {loginMethod === "mobile" && (
                  <div className="space-y-4">
                    {mobileOtpStep === "mobile" ? (
                      <>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Mobile Number</label>
                          <div className="flex gap-2 mt-1">
                            <span className="flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground">+91</span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={mobile}
                              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                              placeholder="Enter 10-digit mobile"
                              className={`flex-1 px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                                error ? "border-destructive" : "border-border"
                              }`}
                            />
                          </div>
                          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                        </div>
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
                      </>
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
                                ref={(el) => { otpRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                className={`w-10 h-12 text-center text-lg font-bold rounded-lg border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                                  error ? "border-destructive" : "border-border"
                                }`}
                              />
                            ))}
                          </div>
                          {error && <p className="text-xs text-destructive mt-1 text-center">{error}</p>}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Didn't receive OTP?"}
                          </span>
                          <button
                            onClick={handleSendOtp}
                            disabled={otpTimer > 0}
                            className="text-primary hover:underline disabled:opacity-50"
                          >
                            Resend
                          </button>
                        </div>
                        <button
                          onClick={handleVerifyOtp}
                          disabled={loading}
                          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
                        >
                          {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>Verify OTP <ArrowRight className="w-4 h-4" /></>
                          )}
                        </button>
                        <button
                          onClick={() => setMobileOtpStep("mobile")}
                          className="w-full text-sm text-muted-foreground hover:text-foreground"
                        >
                          Change Mobile Number
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Email & Password Login */}
                {loginMethod === "email" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="Enter your email"
                        className={`w-full mt-1 px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                          error ? "border-destructive" : "border-border"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Password</label>
                      <div className="relative mt-1">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          placeholder="Enter your password"
                          className={`w-full px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                            error ? "border-destructive" : "border-border"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <button
                      onClick={handleEmailLogin}
                      disabled={loading}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Login <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <PoweredByFooter />
    </div>
  );
}

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="flex-1 flex items-center justify-center p-4">
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
        </div>
      </div>
      <PoweredByFooter />
    </div>
  );
}
