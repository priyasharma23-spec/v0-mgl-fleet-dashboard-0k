"use client"

import { useState } from "react"
import MGLHeader from "@/components/mgl/MGLHeader"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter"
import ZICDashboard from "@/components/mgl/ZICDashboard"
import L2ApprovalQueue from "@/components/mgl/L2ApprovalQueue"
import { mockVehicles } from "@/lib/mgl-data"
import { VehicleStatusBadge } from "@/components/mgl/StatusBadge"

interface Props {
  user: { name: string; role: "zic" }
  onLogout: () => void
}

export default function ZICShell({ user, onLogout }: Props) {
  const [activeView, setActiveView] = useState("zic-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function renderView() {
    switch (activeView) {
      case "zic-dashboard": return <ZICDashboard onViewChange={setActiveView} />
      case "zic-l2-queue": return <L2ApprovalQueue onViewChange={setActiveView} />
      case "zic-vehicles": return <ZICVehiclesView />
      case "zic-cards": return <ZICCardsView />
      case "zic-reports": return <ZICReportsView />
      default: return <ZICDashboard onViewChange={setActiveView} />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <MGLSidebar
        role="zic"
        activeView={activeView}
        onViewChange={setActiveView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MGLHeader
          role="zic"
          userName={user.name}
          onLogout={onLogout}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
      <PoweredByFooter />
    </div>
  )
}

function ZICVehiclesView() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">All Vehicles</h1>
        <p className="text-sm text-muted-foreground">Zone-wide vehicle registration tracker</p>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Vehicle No.", "FO Name", "Model", "Category", "Status", "Submitted"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{v.vehicleNumber || v.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.foName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.model}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 bg-muted rounded-full">{v.category}</span>
                  </td>
                  <td className="px-4 py-3"><VehicleStatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{v.l2SubmittedAt || v.l1SubmittedAt || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ZICCardsView() {
  const cards = mockVehicles.filter((v) => v.cardNumber)
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Card Orders</h1>
        <p className="text-sm text-muted-foreground">Track physical card printing and dispatch</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        {[
          { label: "Cards Ordered", value: cards.length, color: "bg-blue-100 text-blue-700" },
          { label: "Dispatched", value: mockVehicles.filter((v) => v.status === "CARD_DISPATCHED").length, color: "bg-amber-100 text-amber-700" },
          { label: "Active", value: mockVehicles.filter((v) => v.status === "CARD_ACTIVE").length, color: "bg-green-100 text-green-700" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <span className={`text-2xl font-bold px-3 py-1 rounded-lg ${s.color}`}>{s.value}</span>
            <span className="text-sm font-medium text-foreground">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Card Number", "Vehicle", "FO Name", "Dispatch Date", "Tracking ID", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cards.map((v) => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm font-medium text-foreground">{v.cardNumber}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.vehicleNumber || v.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.foName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.cardDispatchDate || "—"}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{v.trackingId || "—"}</td>
                  <td className="px-4 py-3"><VehicleStatusBadge status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ZICReportsView() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">ZIC Reports</h1>
        <p className="text-sm text-muted-foreground">Zone-level approval and card dispatch analytics</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "L2 Approvals (Month)", value: "22" },
          { label: "L2 Rejections (Month)", value: "2" },
          { label: "Cards Dispatched (Month)", value: "18" },
          { label: "Avg. TAT (days)", value: "2.4" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-muted-foreground">Full analytics export available in enterprise version</p>
      </div>
    </div>
  )
}
