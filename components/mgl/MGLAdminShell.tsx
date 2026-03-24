"use client"

import { useState } from "react"
import MGLHeader from "@/components/mgl/MGLHeader"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter"
import AdminDashboard from "@/components/mgl/admin/AdminDashboard"
import AdminFODirectory from "@/components/mgl/admin/AdminFODirectory"
import AdminCardsWallets from "@/components/mgl/admin/AdminCardsWallets"
import AdminIncentives from "@/components/mgl/admin/AdminIncentives"
import AdminTransactions from "@/components/mgl/admin/AdminTransactions"
import AdminSettlements from "@/components/mgl/admin/AdminSettlements"
import AdminReports from "@/components/mgl/admin/AdminReports"
import AdminAnalytics from "@/components/mgl/admin/AdminAnalytics"
import AdminConfig from "@/components/mgl/admin/AdminConfig"
import AdminUserManagement from "@/components/mgl/admin/AdminUserManagement"
import AdminFundManagement from "@/components/mgl/admin/AdminFundManagement"
import AdminApprovals from "@/components/mgl/admin/AdminApprovals"

interface Props {
  user: { name: string; role: "mgl-admin"; department?: string }
  onLogout: () => void
}

export default function MGLAdminShell({ user, onLogout }: Props) {
  const [activeView, setActiveView] = useState("admin-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function renderView() {
    switch (activeView) {
      case "admin-dashboard": return <AdminDashboard onViewChange={setActiveView} />
      case "admin-fo-directory": return <AdminFODirectory onViewChange={setActiveView} />
      case "admin-users": return <AdminUserManagement />
      case "admin-cards": return <AdminCardsWallets onViewChange={setActiveView} />
      case "admin-incentives": return <AdminIncentives onViewChange={setActiveView} />
      case "admin-transactions": return <AdminTransactions onViewChange={setActiveView} />
      case "admin-settlements": return <AdminSettlements onViewChange={setActiveView} />
      case "admin-approvals": return <AdminApprovals onViewChange={setActiveView} />
      case "admin-funds": return <AdminFundManagement />
      case "admin-reports": return <AdminReports />
      case "admin-analytics": return <AdminAnalytics />
      case "admin-config": return <AdminConfig />
      default: return <AdminDashboard onViewChange={setActiveView} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        <MGLSidebar
          role="mgl-admin"
          activeView={activeView}
          onViewChange={setActiveView}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          department={user.department}
        />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <MGLHeader
            role="mgl-admin"
            userName={user.name}
            onLogout={onLogout}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
          <main className="flex-1 overflow-y-auto">
            {renderView()}
          </main>
        </div>
      </div>
      <PoweredByFooter />
    </div>
  )
}
