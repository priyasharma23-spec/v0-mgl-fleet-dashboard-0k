"use client";
import { useState } from "react";
import { Lock, Smartphone, Eye, EyeOff, Trash2, Shield, AlertCircle, CheckCircle, LogOut, Plus } from "lucide-react";

export default function FOSecurityAccess() {
  const [showPassword, setShowPassword] = useState(false);
  const [devices, setDevices] = useState([
    { id: 1, name: "Chrome on MacBook", lastActive: "2 minutes ago", ip: "203.0.113.45", active: true },
    { id: 2, name: "Safari on iPhone", lastActive: "1 hour ago", ip: "192.0.2.50", active: false },
    { id: 3, name: "Chrome on Desktop", lastActive: "2 days ago", ip: "198.51.100.10", active: false }
  ]);

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security & Access</h1>
        <p className="text-muted-foreground mt-1">Manage your security settings and access permissions</p>
      </div>

      {/* Password & Authentication */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Password & Authentication
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Current Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Two-Factor Authentication
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">SMS Verification Enabled</p>
                <p className="text-xs text-green-700">Protects your account with SMS verification code</p>
              </div>
            </div>
            <button className="text-xs px-3 py-1 border border-green-300 text-green-700 rounded hover:bg-green-100 transition-colors">
              Disable
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Authenticator App</p>
              <p className="text-xs text-muted-foreground">Use Google Authenticator or similar apps</p>
            </div>
            <button className="text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
              Setup
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions & Devices */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          Active Sessions & Devices
        </h2>
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{device.name}</p>
                  {device.active && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded">
                      Current Session
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{device.lastActive} • {device.ip}</p>
              </div>
              {!device.active && (
                <button
                  onClick={() => setDevices(devices.filter(d => d.id !== device.id))}
                  className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Access Permissions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">User Access Permissions</h2>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add User
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: "Rajesh Kumar", email: "rajesh@abclogistics.com", role: "Admin", status: "Active" },
            { name: "Priya Sharma", email: "priya@abclogistics.com", role: "Accountant", status: "Active" },
            { name: "Amit Patel", email: "amit@abclogistics.com", role: "Operator", status: "Inactive" }
          ].map((user, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{user.role}</span>
                  <span className={`text-xs px-2 py-1 rounded ml-2 ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {user.status}
                  </span>
                </div>
                <button className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys & Integrations */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">API Keys & Integrations</h2>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Generate Key
          </button>
        </div>
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <div className="flex gap-2 items-start">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">No API keys generated yet. Generate one to enable third-party integrations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
