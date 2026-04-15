"use client"
import { useState, useEffect } from "react"
import { TraySection } from "./shared/RightTray"

interface Props {
  selectedDriver: any
  localBindings: any[]
  myVehicles: any[]
  mockVehicles: any[]
}

export default function FODriverPolicyTab({
  selectedDriver,
  localBindings,
  myVehicles,
  mockVehicles,
}: Props) {

  const [activePolicyMode, setActivePolicyMode] =
    useState<
      "vehicle_linked"|"shift_based"|
      "trip_linked"|"pairing_code"
    >("vehicle_linked")

  const [draft, setDraft] = useState({
    codeType: "single_use" as string,
    expiryHours: 24 as number | null,
    maxUsesPerCode: 1 as number | null,
    repairingTrigger: "on_vehicle_change",
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const p = selectedDriver?.pairingPolicy
    setDraft({
      codeType: p?.codeType ?? "single_use",
      expiryHours: p?.expiryHours ?? 24,
      maxUsesPerCode: p?.maxUsesPerCode ?? 1,
      repairingTrigger: p?.repairingTrigger ??
        "on_vehicle_change",
    })
    setActivePolicyMode("vehicle_linked")
  }, [selectedDriver?.id])

  const expiryOpts = [
    { label: "2h", value: 2 },
    { label: "24h", value: 24 },
    { label: "72h", value: 72 },
    { label: "7 days", value: 168 },
    { label: "No expiry", value: null as null },
  ]

  const triggerOpts = [
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

  const risk =
    draft.maxUsesPerCode === 1 &&
    draft.expiryHours &&
    draft.expiryHours <= 24
      ? { label: "High security",
          color: "bg-green-50 text-green-700 border-green-200" }
      : draft.maxUsesPerCode === null &&
        draft.expiryHours === null
      ? { label: "Open access",
          color: "bg-red-50 text-red-700 border-red-200" }
      : { label: "Balanced",
          color: "bg-amber-50 text-amber-700 border-amber-200" }

  const driverBindings = localBindings.filter(b =>
    b.driverId === selectedDriver?.id &&
    ["active","ACTIVE","PENDING_ACCEPTANCE",
     "pending_acceptance"].includes(b.state)
  )

  return (
    <div className="space-y-4 mt-4">

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { id:"vehicle_linked", label:"Vehicle-linked" },
          { id:"shift_based", label:"Shift-based" },
          { id:"trip_linked", label:"Trip-linked" },
          { id:"pairing_code", label:"Code override" },
        ].map(mode => (
          <button key={mode.id}
            onClick={() => {
              setActivePolicyMode(mode.id as any)
              setDraft({ codeType:"single_use",
                expiryHours:24, maxUsesPerCode:1,
                repairingTrigger:"on_vehicle_change" })
            }}
            className={`px-3 py-2.5 rounded-xl
              border text-xs font-medium transition-all
              ${activePolicyMode === mode.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"}`}>
            {mode.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="px-3 py-2 rounded-xl border
        text-xs bg-blue-50 border-blue-200 text-blue-700">
        {activePolicyMode === "vehicle_linked" &&
          "Default policy for vehicle-linked assignments."}
        {activePolicyMode === "shift_based" &&
          "Default policy for shift-based assignments."}
        {activePolicyMode === "trip_linked" &&
          "Default policy for trip-linked assignments."}
        {activePolicyMode === "pairing_code" &&
          "Override policy for a specific pairing code."}
      </div>

      {/* Pairing code selector */}
      {activePolicyMode === "pairing_code" && (
        <TraySection title="Active Bindings">
          {driverBindings.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              No active bindings. Assign a vehicle first.
            </p>
          ) : (
            <div className="space-y-2 pt-1">
              {driverBindings.map((b: any) => {
                const v = myVehicles.find(
                  (v: any) => v.id === b.vehicleId) ||
                  mockVehicles.find(
                    (v: any) => v.id === b.vehicleId)
                return (
                  <div key={b.id}
                    className="flex items-center
                    justify-between p-3 rounded-xl
                    border border-border bg-card">
                    <div>
                      <p className="font-mono font-bold
                        text-sm tracking-widest">
                        {b.pairingCode ?? "—"}
                      </p>
                      <p className="text-xs
                        text-muted-foreground mt-0.5">
                        {(v as any)?.vehicleNumber ??
                          b.vehicleId}
                      </p>
                    </div>
                    <span className={`text-xs px-2
                      py-0.5 rounded-full font-medium
                      ${b.pairingCodeState === "used"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"}`}>
                      {b.pairingCodeState ?? "pending"}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </TraySection>
      )}

      {/* Risk badge */}
      <div className={`flex items-center
        justify-between px-3 py-2.5 rounded-xl
        border text-xs ${risk.color}`}>
        <span className="font-semibold">
          {risk.label}
        </span>
        <span>
          {activePolicyMode === "pairing_code"
            ? "Code override" : "Auth mode default"}
        </span>
      </div>

      {/* Code type */}
      <TraySection title="Code Type">
        <div className="flex gap-2 pt-1">
          {[
            { id:"single_use", label:"Single use",
              desc:"One fueling per code" },
            { id:"multi_use", label:"Multi use",
              desc:"Reusable until expiry" },
          ].map(opt => (
            <button key={opt.id}
              onClick={() => setDraft(p => ({
                ...p, codeType: opt.id,
                maxUsesPerCode: opt.id === "single_use"
                  ? 1 : p.maxUsesPerCode
              }))}
              className={`flex-1 p-3 rounded-xl
                border text-left transition-all
                ${draft.codeType === opt.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"}`}>
              <p className="text-xs font-semibold">
                {opt.label}
              </p>
              <p className="text-[10px]
                text-muted-foreground mt-0.5">
                {opt.desc}
              </p>
            </button>
          ))}
        </div>
      </TraySection>

      {/* Expiry */}
      <TraySection title="Code Expiry">
        <div className="flex flex-wrap gap-2 pt-1">
          {expiryOpts.map(opt => (
            <button key={String(opt.value)}
              onClick={() => setDraft(p => ({
                ...p, expiryHours: opt.value
              }))}
              className={`px-3 py-1.5 rounded-lg
                text-xs font-medium border transition-all
                ${draft.expiryHours === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary/50"}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </TraySection>

      {/* Max uses */}
      <TraySection title="Max Uses Per Code">
        <div className="flex flex-wrap gap-2 pt-1">
          {[1, 3, 5, 10, null].map(n => (
            <button key={String(n)}
              disabled={draft.codeType ===
                "single_use" && n !== 1}
              onClick={() => setDraft(p => ({
                ...p, maxUsesPerCode: n
              }))}
              className={`px-3 py-1.5 rounded-lg
                text-xs font-medium border transition-all
                ${draft.maxUsesPerCode === n
                  ? "bg-primary text-primary-foreground border-primary"
                  : draft.codeType === "single_use"
                    && n !== 1
                  ? "opacity-30 cursor-not-allowed border-border"
                  : "bg-background border-border hover:border-primary/50"}`}>
              {n === null ? "Unlimited" : n}
            </button>
          ))}
        </div>
      </TraySection>

      {/* Trigger */}
      <TraySection title="Re-pairing Trigger">
        <div className="space-y-2 pt-1">
          {triggerOpts.map(opt => (
            <button key={opt.id}
              onClick={() => setDraft(p => ({
                ...p, repairingTrigger: opt.id
              }))}
              className={`w-full p-3 rounded-xl
                border text-left transition-all
                flex items-center gap-3
                ${draft.repairingTrigger === opt.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"}`}>
              <div className="flex-1">
                <p className="text-xs font-medium">
                  {opt.label}
                </p>
                <p className="text-[10px]
                  text-muted-foreground mt-0.5">
                  {opt.desc}
                </p>
              </div>
              {draft.repairingTrigger === opt.id && (
                <div className="w-4 h-4 rounded-full
                  bg-primary flex items-center
                  justify-center">
                  <svg width="8" height="8"
                    viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </TraySection>

      {/* Save */}
      <button
        onClick={() => {
          if (selectedDriver) {
            selectedDriver.pairingPolicy = {
              ...selectedDriver.pairingPolicy,
              ...draft,
            }
          }
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        }}
        className={`w-full py-2.5 rounded-xl
          text-sm font-medium transition-all
          ${saved
            ? "bg-green-600 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
        {saved ? "Saved ✓" : "Save Policy"}
      </button>

      <p className="text-xs text-muted-foreground
        text-center">
        {activePolicyMode === "pairing_code"
          ? "Overrides fleet policy for this pairing code only"
          : "Applies to all vehicles using this auth mode"}
      </p>

    </div>
  )
}
