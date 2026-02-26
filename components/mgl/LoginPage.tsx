"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Shield, Truck, Users } from "lucide-react";
import type { UserRole } from "@/lib/mgl-data";

interface LoginPageProps {
  onLogin: (role: UserRole, name: string) => void;
}

const roles = [
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

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!selected) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const roleData = roles.find((r) => r.role === selected)!;
    onLogin(selected, roleData.user);
    setLoading(false);
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
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selected === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setSelected(r.role)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-150 ${r.color} ${isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border bg-background"}`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </span>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isSelected ? "bg-primary" : r.iconBg}`}>
                    <Icon className={`w-5 h-5 ${isSelected ? "text-white" : r.iconColor}`} />
                  </div>
                  <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>{r.label}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{r.description}</p>
                  <span className={`inline-block mt-2 text-[10px] font-bold text-white px-2 py-0.5 rounded ${r.badgeBg}`}>{r.short}</span>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          {selected && (
            <div className="px-6 pb-6 border-t border-border pt-5">
              <div className="max-w-sm mx-auto space-y-3">
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
                <p className="text-center text-xs text-muted-foreground">
                  New Fleet Operator?{" "}
                  <button
                    onClick={() => onLogin("fleet-operator", "New Operator")}
                    className="text-primary font-medium hover:underline"
                  >
                    Register here
                  </button>
                </p>
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
