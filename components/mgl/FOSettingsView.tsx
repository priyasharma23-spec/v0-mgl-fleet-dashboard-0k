"use client"
import React, { useState } from "react"

const expiryOptions = [
  { label: "2h", value: 2 },
  { label: "24h", value: 24 },
  { label: "72h", value: 72 },
  { label: "7 days", value: 168 },
  { label: "No expiry", value: null },
]

const triggerOptions = [
  { id: "on_vehicle_change",
    label: "On vehicle change",
    desc: "New code when vehicle changes" },
  { id: "monthly",
    label: "Monthly",
    desc: "Auto-regenerates on 1st of month" },
  { id: "manual",
    label: "Manual only",
    desc: "FO manually regenerates" },
]

type AuthMode = 
  "vehicle_linked" | "shift_based" | "trip_linked"

type PolicyConfig = {
  codeType: "single_use" | "multi_use"
  expiryHours: number | null
  maxUsesPerCode: number | null
  repairingTrigger: string
}

const defaultPolicy = (): PolicyConfig => ({
  codeType: "single_use",
  expiryHours: 24,
  maxUsesPerCode: 1,
  repairingTrigger: "on_vehicle_change",
})

export default function FOSettingsView() {
  const [activeSection, setActiveSection] = 
    useState<"pairing_policy" | "notifications" 
      | "security">("pairing_policy")

  const [activeAuthMode, setActiveAuthMode] = 
    useState<AuthMode>("vehicle_linked")

  const [policies, setPolicies] = useState<
    Record<AuthMode, PolicyConfig>
  >({
    vehicle_linked: defaultPolicy(),
    shift_based: { ...defaultPolicy(), 
      expiryHours: 72 },
    trip_linked: { ...defaultPolicy(), 
      expiryHours: 2, codeType: "single_use" },
  })

  const [savedModes, setSavedModes] = useState<
    AuthMode[]
  >([])

  const policy = policies[activeAuthMode]

  const setPolicy = (
    updates: Partial<PolicyConfig>
  ) => {
    setPolicies(prev => ({
      ...prev,
      [activeAuthMode]: { 
        ...prev[activeAuthMode], 
        ...updates 
      }
    }))
  }

  const getRisk = (p: PolicyConfig) => {
    if (p.maxUsesPerCode === 1 && 
      p.expiryHours && p.expiryHours <= 24)
      return { label: "High security",
        color: "bg-green-50 text-green-700 border-green-200" }
    if (p.maxUsesPerCode === null && 
      p.expiryHours === null)
      return { label: "Open access",
        color: "bg-red-50 text-red-700 border-red-200" }
    return { label: "Balanced",
      color: "bg-amber-50 text-amber-700 border-amber-200" }
  }

  const authModes = [
    {
      id: "vehicle_linked" as AuthMode,
      label: "Vehicle-linked",
      desc: "Driver can fuel at any time",
      icon: (
        <svg width="16" height="16"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M19 17h2c1.1 0 2-.9 2-2v-4l-3-5H4L1 11v4c0 1.1.9 2 2 2h2"/>
          <circle cx="7" cy="17" r="2"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      )
    },
    {
      id: "shift_based" as AuthMode,
      label: "Shift-based",
      desc: "Driver fuels within shift windows",
      icon: (
        <svg width="16" height="16"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      )
    },
    {
      id: "trip_linked" as AuthMode,
      label: "Trip-linked",
      desc: "Driver fuels for a single trip",
      icon: (
        <svg width="16" height="16"
          viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="10" r="3"/>
          <path d="M12 2a8 8 0 00-8 8c0 5.4 7 12 8 12s8-6.6 8-12a8 8 0 00-8-8z"/>
        </svg>
      )
    },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold 
          text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage fleet-level defaults and 
          configuration
        </p>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-muted/40 
        rounded-xl p-1 mb-6 border border-border">
        {[
          { id: "pairing_policy", 
            label: "Pairing Policy" },
          { id: "notifications", 
            label: "Notifications" },
          { id: "security", 
            label: "Security" },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => 
              setActiveSection(s.id as any)}
            className={`flex-1 py-2 px-3 
              rounded-lg text-sm font-medium 
              transition-all
              ${activeSection === s.id
                ? "bg-background shadow-sm text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* PAIRING POLICY SECTION */}
      {activeSection === "pairing_policy" && (
        <div className="space-y-6">

          {/* Intro */}
          <div className="bg-blue-50 border 
            border-blue-200 rounded-xl p-4">
            <p className="text-sm font-medium 
              text-blue-800 mb-1">
              Fleet-level pairing policy defaults
            </p>
            <p className="text-xs text-blue-700">
              These settings apply to all drivers 
              in your fleet by auth mode. Individual 
              driver overrides take precedence 
              when set.
            </p>
          </div>

          {/* Auth mode selector */}
          <div className="grid grid-cols-3 gap-3">
            {authModes.map(mode => {
              const modePolicy = policies[mode.id]
              const modeRisk = getRisk(modePolicy)
              const isSaved = savedModes.includes(
                mode.id)
              return (
                <button
                  key={mode.id}
                  onClick={() => 
                    setActiveAuthMode(mode.id)}
                  className={`p-4 rounded-xl border 
                    text-left transition-all relative
                    ${activeAuthMode === mode.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"}`}>
                  <div className={`w-8 h-8 rounded-lg 
                    flex items-center justify-center mb-2
                    ${activeAuthMode === mode.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"}`}>
                    {mode.icon}
                  </div>
                  <p className="text-sm font-semibold">
                    {mode.label}
                  </p>
                  <p className="text-[10px] 
                    text-muted-foreground mt-0.5">
                    {mode.desc}
                  </p>
                  <div className={`mt-2 text-[10px] 
                    font-medium px-2 py-0.5 
                    rounded-full inline-block
                    border ${modeRisk.color}`}>
                    {modeRisk.label}
                  </div>
                  {isSaved && (
                    <div className="absolute 
                      top-2 right-2 w-4 h-4 
                      rounded-full bg-green-500 
                      flex items-center justify-center">
                      <svg width="8" height="8"
                        viewBox="0 0 24 24"
                        fill="none" stroke="white"
                        strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Policy editor */}
          <div className="bg-card border 
            border-border rounded-xl overflow-hidden">

            {/* Editor header */}
            <div className="px-5 py-4 border-b 
              border-border flex items-center 
              justify-between">
              <div>
                <p className="font-semibold text-sm">
                  {authModes.find(
                    m => m.id === activeAuthMode)
                    ?.label} Policy
                </p>
                <p className="text-xs 
                  text-muted-foreground mt-0.5">
                  Default for all{" "}
                  {activeAuthMode.replace("_"," ")}{" "}
                  assignments
                </p>
              </div>
              <div className={`text-xs font-medium 
                px-2.5 py-1 rounded-full border
                ${getRisk(policy).color}`}>
                {getRisk(policy).label}
              </div>
            </div>

            <div className="p-5 space-y-5">

              {/* Code type */}
              <div>
                <p className="text-xs font-semibold 
                  text-muted-foreground uppercase 
                  tracking-wide mb-2">
                  Code Type
                </p>
                <div className="flex gap-2">
                  {[
                    { id: "single_use",
                      label: "Single use",
                      desc: "One fueling per code" },
                    { id: "multi_use",
                      label: "Multi use",
                      desc: "Reusable until expiry" },
                  ].map(opt => (
                    <button key={opt.id}
                      onClick={() => setPolicy({
                        codeType: opt.id as any,
                        maxUsesPerCode: 
                          opt.id === "single_use" 
                          ? 1 
                          : policy.maxUsesPerCode
                      })}
                      className={`flex-1 p-3 
                        rounded-xl border text-left 
                        transition-all
                        ${policy.codeType === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"}`}>
                      <p className="text-sm 
                        font-medium">{opt.label}</p>
                      <p className="text-xs 
                        text-muted-foreground mt-0.5">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expiry */}
              <div>
                <p className="text-xs font-semibold 
                  text-muted-foreground uppercase 
                  tracking-wide mb-2">
                  Code Expiry
                </p>
                <div className="flex flex-wrap gap-2">
                  {expiryOptions.map(opt => (
                    <button key={String(opt.value)}
                      onClick={() => setPolicy({
                        expiryHours: opt.value
                      })}
                      className={`px-4 py-2 
                        rounded-lg text-sm 
                        font-medium border 
                        transition-all
                        ${policy.expiryHours === 
                          opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary/50"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max uses */}
              <div>
                <p className="text-xs font-semibold 
                  text-muted-foreground uppercase 
                  tracking-wide mb-2">
                  Max Uses Per Code
                </p>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 5, 10, null].map(n => (
                    <button key={String(n)}
                      disabled={policy.codeType === 
                        "single_use" && n !== 1}
                      onClick={() => setPolicy({
                        maxUsesPerCode: n
                      })}
                      className={`px-4 py-2 
                        rounded-lg text-sm 
                        font-medium border 
                        transition-all
                        ${policy.maxUsesPerCode === n
                          ? "bg-primary text-primary-foreground border-primary"
                          : policy.codeType === 
                            "single_use" && n !== 1
                          ? "opacity-30 cursor-not-allowed border-border"
                          : "bg-background border-border hover:border-primary/50"}`}>
                      {n === null ? "Unlimited" : n}
                    </button>
                  ))}
                </div>
                {policy.codeType === "single_use" && (
                  <p className="text-xs 
                    text-muted-foreground mt-1.5">
                    Single use codes are always 
                    limited to 1 use
                  </p>
                )}
              </div>

              {/* Re-pairing trigger */}
              <div>
                <p className="text-xs font-semibold 
                  text-muted-foreground uppercase 
                  tracking-wide mb-2">
                  Re-pairing Trigger
                </p>
                <div className="space-y-2">
                  {triggerOptions.map(opt => (
                    <button key={opt.id}
                      onClick={() => setPolicy({
                        repairingTrigger: opt.id
                      })}
                      className={`w-full p-3 
                        rounded-xl border text-left 
                        transition-all flex 
                        items-center gap-3
                        ${policy.repairingTrigger 
                          === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"}`}>
                      <div className="flex-1">
                        <p className="text-sm 
                          font-medium">
                          {opt.label}
                        </p>
                        <p className="text-xs 
                          text-muted-foreground mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                      {policy.repairingTrigger === 
                        opt.id && (
                        <div className="w-5 h-5 
                          rounded-full bg-primary 
                          flex items-center 
                          justify-center flex-shrink-0">
                          <svg width="10" height="10"
                            viewBox="0 0 24 24"
                            fill="none" stroke="white"
                            strokeWidth="3">
                            <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Save footer */}
            <div className="px-5 py-4 border-t 
              border-border bg-muted/20 
              flex items-center justify-between">
              <p className="text-xs 
                text-muted-foreground">
                Applies to all new{" "}
                {activeAuthMode.replace("_"," ")}{" "}
                assignments
              </p>
              <button
                onClick={() => {
                  setSavedModes(prev => 
                    prev.includes(activeAuthMode)
                      ? prev
                      : [...prev, activeAuthMode])
                  const toast = document.getElementById(
                    "settings-toast")
                  if (toast) {
                    toast.classList.remove("opacity-0",
                      "translate-y-2")
                    toast.classList.add("opacity-100",
                      "translate-y-0")
                    setTimeout(() => {
                      toast.classList.add("opacity-0",
                        "translate-y-2")
                      toast.classList.remove(
                        "opacity-100", "translate-y-0")
                    }, 2500)
                  }
                }}
                className="px-5 py-2 bg-primary 
                  text-primary-foreground rounded-lg 
                  text-sm font-medium 
                  hover:bg-primary/90 transition-all">
                Save Policy
              </button>
            </div>
          </div>

          {/* Summary table */}
          <div className="bg-card border 
            border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b 
              border-border">
              <p className="text-sm font-semibold">
                Policy Summary
              </p>
            </div>
            <div className="divide-y divide-border">
              {authModes.map(mode => {
                const p = policies[mode.id]
                const r = getRisk(p)
                return (
                  <div key={mode.id}
                    className="px-5 py-3 flex 
                    items-center gap-4">
                    <div className="w-6 h-6 
                      rounded-md bg-muted 
                      flex items-center 
                      justify-center text-muted-foreground flex-shrink-0">
                      {mode.icon}
                    </div>
                    <p className="text-sm 
                      font-medium flex-1">
                      {mode.label}
                    </p>
                    <div className="flex items-center 
                      gap-3 text-xs 
                      text-muted-foreground">
                      <span>
                        {p.codeType === "single_use"
                          ? "Single use"
                          : "Multi use"}
                      </span>
                      <span>·</span>
                      <span>
                        {p.expiryHours === null
                          ? "No expiry"
                          : p.expiryHours < 24
                          ? `${p.expiryHours}h`
                          : p.expiryHours === 24
                          ? "24h"
                          : p.expiryHours === 72
                          ? "72h"
                          : "7 days"}
                      </span>
                      <span>·</span>
                      <span className={`px-2 py-0.5 
                        rounded-full border font-medium
                        ${r.color}`}>
                        {r.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* NOTIFICATIONS SECTION */}
      {activeSection === "notifications" && (
        <div className="bg-card border border-border 
          rounded-xl p-6 text-center">
          <svg width="40" height="40" 
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            className="mx-auto text-muted-foreground mb-3">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <p className="text-sm font-medium">
            Notification settings
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Coming soon
          </p>
        </div>
      )}

      {/* SECURITY SECTION */}
      {activeSection === "security" && (
        <div className="bg-card border border-border 
          rounded-xl p-6 text-center">
          <svg width="40" height="40"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            className="mx-auto text-muted-foreground mb-3">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p className="text-sm font-medium">
            Security settings
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Coming soon
          </p>
        </div>
      )}

      {/* Toast */}
      <div id="settings-toast"
        className="fixed bottom-6 left-1/2 
          -translate-x-1/2 bg-green-600 
          text-white text-sm font-medium 
          px-5 py-2.5 rounded-full shadow-lg
          opacity-0 translate-y-2 
          transition-all duration-300 
          pointer-events-none z-50">
        ✓ Policy saved successfully
      </div>

    </div>
  )
}
