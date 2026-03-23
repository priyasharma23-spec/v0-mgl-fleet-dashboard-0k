"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Smartphone, KeyRound, Eye, EyeOff } from "lucide-react";
import type { UserRole } from "@/lib/mgl-data";
import type { ActivationData, FOOnboardingType } from "@/app/page";
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter";

interface LoginPageProps {
  onLogin: (role: UserRole, name: string, onboardingType?: FOOnboardingType) => void;
  activationData?: ActivationData | null;
  showRegistration?: boolean;
  onStartRegistration?: () => void;
}

type LoginMethod = "mobile" | "email";

const mockUsers = [
  { mobile: "9999999999", email: "admin@mahanagargas.com", password: "admin123", name: "Arun Verma", role: "mgl-admin" as UserRole },
  { mobile: "8888888888", email: "finance@mahanagargas.com", password: "fin123", name: "Priya Shah", role: "mgl-admin" as UserRole },
  { mobile: "7777777777", email: "marketing@mahanagargas.com", password: "mkt123", name: "Rahul Mehta", role: "mgl-admin" as UserRole },
  { mobile: "6666666666", email: "mic@mahanagargas.com", password: "mic123", name: "Sneha Patil", role: "mic" as UserRole },
  { mobile: "5555555555", email: "zic@mahanagargas.com", password: "zic123", name: "Vikas Joshi", role: "zic" as UserRole },
  { mobile: "4444444444", email: "fo@mahanagargas.com", password: "fo123", name: "Suresh Kumar", role: "fleet-operator" as UserRole },
];

export default function LoginPage({ onLogin, activationData, showRegistration, onStartRegistration }: LoginPageProps) {
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

  const handleMobileLogin = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter complete 6-digit OTP");
      return;
    }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    
    const user = mockUsers.find(u => u.mobile === mobile);
    if (user) {
      onLogin(user.role, user.name);
    } else {
      setOtpError("Invalid OTP or mobile number");
    }
    setLoading(false);
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setEmailError("Please enter email and password");
      return;
    }
    
    setLoading(true);
    setEmailError("");
    await new Promise((r) => setTimeout(r, 800));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user.role, user.name);
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

          {/* Login Card */}
          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Sign In</h2>
              <p className="text-sm text-muted-foreground mt-1">Access your portal with your credentials</p>
            </div>

            <div className="p-6">
              {/* Login Method Toggle */}
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg mb-6">
                <button
                  onClick={() => { setLoginMethod("mobile"); resetOtpState(); setEmailError(""); }}
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
                  onClick={() => { setLoginMethod("email"); resetOtpState(); setMobileError(""); }}
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
                        onClick={handleMobileLogin}
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

              {/* Email & Password Tab */}
              {loginMethod === "email" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
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
                        onChange={(e) => { setPassword(e.target.value); setEmailError(""); }}
                        placeholder="Enter your password"
                        className={`w-full px-3 py-2.5 rounded-lg border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
                          emailError ? "border-destructive" : "border-border"
                        }`}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {emailError && <p className="text-xs text-destructive text-center">{emailError}</p>}

                  <button
                    onClick={handleEmailLogin}
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

          {/* Demo Credentials Note */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Demo Mode:</span> Use mobile 9999999999 or email admin@mahanagargas.com / password admin123
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <PoweredByFooter />
    </div>
  );
}
