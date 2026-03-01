"use client"

import { useState } from "react"
import MGLHeader from "@/components/mgl/MGLHeader"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter"
import MICDashboard from "@/components/mgl/MICDashboard"
import MICRegisterFO from "@/components/mgl/MICRegisterFO"
import L1ApprovalQueue from "@/components/mgl/L1ApprovalQueue"
import MICOperatorsList from "@/components/mgl/MICOperatorsList"

interface Props {
  user: { name: string; role: "mic" }
  onLogout: () => void
}

export default function MICShell({ user, onLogout }: Props) {
  const [activeView, setActiveView] = useState("mic-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function renderView() {
    switch (activeView) {
      case "mic-dashboard": return <MICDashboard onViewChange={setActiveView} />
      case "mic-register-fo": return <MICRegisterFO onViewChange={setActiveView} />
      case "mic-l1-queue": return <L1ApprovalQueue onViewChange={setActiveView} />
      case "mic-operators": return <MICOperatorsList onViewChange={setActiveView} />
      case "mic-mou": return <MICMoUView />
      case "mic-reports": return <MICReportsView onViewChange={setActiveView} />
      default: return <MICDashboard onViewChange={setActiveView} />
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <MGLSidebar
        role="mic"
        activeView={activeView}
        onViewChange={setActiveView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <MGLHeader
          role="mic"
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

function MICMoUView() {
  const mous = [
    { number: "MGL/MOU/2025/001", fo: "ABC Logistics Pvt. Ltd.", executed: "15 Jan 2025", expiry: "14 Jan 2026", vehicles: 15, status: "Active" },
    { number: "MGL/MOU/2025/003", fo: "Metro Freight Solutions", executed: "01 Mar 2025", expiry: "28 Feb 2026", vehicles: 20, status: "Active" },
    { number: "MGL/MOU/2024/012", fo: "Sunrise Transport Co.", executed: "10 Dec 2024", expiry: "09 Dec 2025", vehicles: 8, status: "Expiring Soon" },
  ]
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">MoU Management</h1>
          <p className="text-sm text-muted-foreground">Track and manage Fleet Operator agreements</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          + New MoU
        </button>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["MoU Number", "Fleet Operator", "Executed", "Expiry", "Vehicles", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mous.map((m) => (
                <tr key={m.number} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{m.number}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{m.fo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.executed}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.expiry}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{m.vehicles}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary font-medium hover:underline">View PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MICReportsView({ onViewChange }: { onViewChange: (v: string) => void }) {
  const stats = [
    { label: "Total FOs Onboarded", value: "4", change: "+12%", positive: true },
    { label: "Vehicles Registered", value: "6", change: "+8%", positive: true },
    { label: "Cards Activated", value: "2", change: "+5%", positive: true },
    { label: "Pending L1 Reviews", value: "1", change: "-3%", positive: false },
  ]
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">MIC performance and zone activity summary</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
            <p className={`text-xs mt-1 font-medium ${s.positive ? "text-green-600" : "text-red-500"}`}>{s.change} vs last month</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl border border-border p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-center text-muted-foreground">
          <p className="text-sm font-medium">Detailed reports available in full version</p>
          <p className="text-xs mt-1">Export to Excel / PDF coming soon</p>
        </div>
      </div>
    </div>
  )
}
