"use client";
import { Users, Search, X, Copy, CheckCircle, AlertTriangle, Mail, Smartphone, CreditCard, Wallet, MapPin } from "lucide-react";
import { useState } from "react";
import { mockFleetOperators, mockVehicles } from "@/lib/mgl-data";
import { FOStatusBadge } from "@/components/mgl/StatusBadge";

export default function MICOperatorsList({ onViewChange }: { onViewChange: (view: string) => void }) {
  const [search, setSearch] = useState("");
  const [selectedFO, setSelectedFO] = useState<typeof mockFleetOperators[0] | null>(null)
  const [copied, setCopied] = useState(false)
  const filtered = mockFleetOperators.filter((fo) =>
    fo.name.toLowerCase().includes(search.toLowerCase()) ||
    fo.pan.toLowerCase().includes(search.toLowerCase()) ||
    fo.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Fleet Operators</h1>
          <p className="text-sm text-muted-foreground">{mockFleetOperators.length} registered operators</p>
        </div>
        <button onClick={() => onViewChange("mic-register-fo")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          + Register FO
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by name, PAN, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">FO Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">PAN</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicles</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((fo) => (
                <tr key={fo.id} onClick={() => setSelectedFO(fo)} className="hover:bg-muted/30 cursor-pointer transition-colors border-b border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {fo.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{fo.name}</p>
                        <p className="text-xs text-muted-foreground">{fo.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{fo.pan}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{fo.contactNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${fo.onboardingType === "MIC_ASSISTED" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                      {fo.onboardingType === "MIC_ASSISTED" ? "MIC-Assisted" : "Self-Service"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-foreground">{fo.totalVehicles}</span>
                    <span className="text-xs text-muted-foreground ml-1">({fo.activeCards} active)</span>
                  </td>
                  <td className="px-4 py-3">
                    <FOStatusBadge status={fo.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">{fo.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedFO && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedFO(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">{selectedFO.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedFO.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <FOStatusBadge status={selectedFO.status} />
                <button onClick={() => setSelectedFO(null)} className="p-2 hover:bg-muted rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto">

              {/* Activation Link — PENDING_ACTIVATION only */}
              {selectedFO.status === "PENDING_ACTIVATION" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-sm font-semibold text-amber-900">Account Not Activated</p>
                  </div>
                  <p className="text-xs text-amber-700">Share the activation link with this Fleet Operator.</p>
                  <div className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg p-2">
                    <p className="text-xs font-mono text-foreground flex-1 truncate">
                      https://mgl-fleet.app/activate?fo={selectedFO.id}
                    </p>
                    <button onClick={() => { navigator.clipboard.writeText(`https://mgl-fleet.app/activate?fo=${selectedFO.id}&token=ACT${selectedFO.id}2026`); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
                      {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-amber-300 text-amber-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                    <button className="flex-1 py-2 border border-amber-300 text-amber-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" /> SMS
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Details */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contact Details</p>
                {[
                  ["Mobile", selectedFO.contactNumber],
                  ["Email", selectedFO.email],
                  ["PAN", selectedFO.pan],
                  ["GSTN", selectedFO.gstn || "—"],
                  ["Onboarding", selectedFO.onboardingType === "MIC_ASSISTED" ? "MIC Assisted" : "Self-Service"],
                  ["MIC ID", selectedFO.micId],
                  ["Created", selectedFO.createdAt],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between text-sm gap-4">
                    <span className="text-muted-foreground shrink-0">{label}</span>
                    <span className="font-medium text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</p>
                <div className="text-sm space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Registered Address</p>
                    <p className="font-medium text-foreground mt-0.5">{selectedFO.registeredAddress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Address</p>
                    <p className="font-medium text-foreground mt-0.5">{selectedFO.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Wallet Summary */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fleet Summary</p>
                {[
                  ["Total Vehicles", selectedFO.totalVehicles],
                  ["Active Cards", selectedFO.activeCards],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>

              {/* MOU Details */}
              {(selectedFO as any).mouNumber && (
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">MOU Details</p>
                  {[
                    ["MOU Number", (selectedFO as any).mouNumber],
                    ["Executed", (selectedFO as any).mouExecutionDate],
                    ["Expiry", (selectedFO as any).mouExpiryDate],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{value || "—"}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Vehicles */}
              {(() => {
                const foVehicles = mockVehicles.filter(v => v.foId === selectedFO.id)
                return foVehicles.length > 0 ? (
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicles ({foVehicles.length})</p>
                    {foVehicles.map(v => (
                      <div key={v.id} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium font-mono text-xs">{v.vehicleNumber || v.id}</p>
                          <p className="text-xs text-muted-foreground">{v.oem} · {v.category}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${v.status === "CARD_ACTIVE" ? "bg-green-100 text-green-700" : v.status === "L1_REJECTED" || v.status === "L2_REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                          {v.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null
              })()}

            </div>
          </div>
        </>
      )}
    </div>
  );
}
