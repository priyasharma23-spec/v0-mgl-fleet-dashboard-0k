"use client"
import { useState } from "react"
import { User, Shield, Building2, MapPin, Calendar, Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

interface Props {
  user: { name: string; role: string; department?: string }
  roleLabel: string
  zone?: string
  region?: string
  passwordMode?: "set" | "change"
}

export default function UserProfileView({ user, roleLabel, zone, region, passwordMode = "change" }: Props) {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const handleChangePassword = () => {
    setError("")
    if (passwordMode === "change" && !currentPassword) { setError("Current password is required"); return }
    if (!newPassword || !confirmPassword) { setError("All fields are required"); return }
    if (newPassword.length < 6) { setError("New password must be at least 6 characters"); return }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return }
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setShowChangePassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }, 2000)
  }

  const fields = passwordMode === "set" ? [
    { label: "New Password", value: newPassword, setValue: setNewPassword, show: showNew, setShow: setShowNew },
    { label: "Confirm Password", value: confirmPassword, setValue: setConfirmPassword, show: showConfirm, setShow: setShowConfirm },
  ] : [
    { label: "Current Password", value: currentPassword, setValue: setCurrentPassword, show: showCurrent, setShow: setShowCurrent },
    { label: "New Password", value: newPassword, setValue: setNewPassword, show: showNew, setShow: setShowNew },
    { label: "Confirm Password", value: confirmPassword, setValue: setConfirmPassword, show: showConfirm, setShow: setShowConfirm },
  ]

  return (
    <div className="flex flex-col gap-5 p-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">Account details and information</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-primary">{user.name.charAt(0)}</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
            <Shield className="w-3 h-3" />{roleLabel}
          </span>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account Information</p>
        </div>
        <div className="divide-y divide-border">
          {[
            { icon: User, label: "Full Name", value: user.name },
            { icon: Shield, label: "Role", value: roleLabel },
            { icon: Building2, label: "Department", value: user.department || "MGL Operations" },
            ...(zone ? [{ icon: MapPin, label: "Zone", value: zone }] : []),
            ...(region ? [{ icon: MapPin, label: "Region", value: region }] : []),
            { icon: Calendar, label: "Member Since", value: "January 2025" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Icon className="w-4 h-4" />{label}</div>
              <span className="font-medium text-foreground text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Security</p>
          <button onClick={() => { setShowChangePassword(!showChangePassword); setError("") }}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
            <Lock className="w-3.5 h-3.5" />
            {showChangePassword ? "Cancel" : passwordMode === "set" ? "Set Password" : "Change Password"}
          </button>
        </div>
        {!showChangePassword ? (
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Lock className="w-4 h-4" />Password</div>
            <span className="font-medium text-foreground tracking-widest">••••••••</span>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {fields.map(({ label, value, setValue, show, setShow }) => (
              <div key={label}>
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <div className="relative mt-1">
                  <input type={show ? "text" : "password"} value={value}
                    onChange={e => setValue(e.target.value)} placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <button onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button onClick={handleChangePassword}
              className={"w-full py-2.5 rounded-xl text-sm font-medium transition-all " + (saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
              {saved ? <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" />Password Updated</span> : passwordMode === "set" ? "Set Password" : "Update Password"}
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground text-center">To update your profile details, contact your MGL administrator.</p>
    </div>
  )
}
