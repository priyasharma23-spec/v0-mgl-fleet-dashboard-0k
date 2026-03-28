"use client"
// Fleet Operator Shell - Restored from v54

import { useState } from "react"
import {
  Truck, CreditCard, MapPin, Bell, LayoutDashboard, UserPlus, Upload,
  CheckCircle, Clock, XCircle, AlertCircle, Package, Eye, EyeOff,
  ChevronRight, ArrowRight, Shield, Smartphone, Star, RefreshCw
} from "lucide-react"
import Image from "next/image"
import MGLHeader from "@/components/mgl/MGLHeader"
import { PoweredByFooter } from "@/components/mgl/PoweredByFooter"
import MGLSidebar from "@/components/mgl/MGLSidebar"
import FOWalletView from "@/components/mgl/FOWalletView"
import CardDetailsView from "@/components/mgl/CardDetailsView"
import FOSignupFlow from "@/components/mgl/fo/FOSignupFlow"
import FODashboard from "@/components/mgl/fo/FODashboard"
import FOVehiclesList from "@/components/mgl/fo/FOVehiclesList"
import FOAddVehicle from "@/components/mgl/fo/FOAddVehicle"
import FOCardsView from "@/components/mgl/fo/FOCardsView"
import FOFundManagement from "@/components/mgl/fo/FOFundManagement"
import FODeliveryTracking from "@/components/mgl/fo/FODeliveryTracking"
import FONotificationsView from "@/components/mgl/fo/FONotificationsView"
import {
  mockVehicles, mockFleetOperators,
  oems, dealers, retrofitters,
  getDealersByOEM, getCategoriesByOEM, getModelsByOEMAndCategory,
  calculateVehicleAge,
  type VehicleCategory
} from "@/lib/mgl-data"
import { VehicleStatusBadge, WorkflowStepper } from "@/components/mgl/StatusBadge"
import type { VehicleStatus } from "@/lib/mgl-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

type FOOnboardingType = "MIC_ASSISTED" | "SELF_SERVICE"

interface Props {
  user: { name: string; role: "fleet-operator" }
  onLogout: () => void
  onboardingType?: FOOnboardingType
  isNewRegistration?: boolean
}

// The FO data for this logged-in user
const myFO = mockFleetOperators[0]
const myVehicles = mockVehicles.filter((v) => v.foId === "FO001")

export default function FleetOperatorShell({ user, onLogout, onboardingType = "SELF_SERVICE", isNewRegistration = false }: Props) {
  const [activeView, setActiveView] = useState("fo-dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(onboardingType === "MIC_ASSISTED")
  const [selectedCardVehicle, setSelectedCardVehicle] = useState<string | null>(null)
  const [actionModal, setActionModal] = useState<"reset-pin" | "lock" | "block" | "limits" | "replacement" | null>(null)

  // Determine if this is a new FO that needs to complete registration
  // Self-service flow: needs full KYB registration
  // MIC-assisted flow: already registered, can directly add vehicles
  const isSelfServiceNewFO = onboardingType === "SELF_SERVICE" && isNewRegistration

  // New FO signup state (only for self-service registration)
  const [signupDone, setSignupDone] = useState(!isSelfServiceNewFO)

  // For self-service new registration, show signup flow
  if (isSelfServiceNewFO && !signupDone) {
    return <FOSignupFlow onComplete={() => setSignupDone(true)} onLogin={onLogout} />
  }

  // Welcome modal for MIC-assisted FO (activated via link)
  const WelcomeModal = () => showWelcomeModal ? (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Account Activated!</h2>
            <p className="text-sm text-muted-foreground mt-1">Welcome to MGL Fleet Platform, {user.name}</p>
          </div>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-green-800">Your account has been set up by MIC</p>
          <p className="text-xs text-green-700">Your KYB details and MoU documents have already been verified. You can now:</p>
          <ul className="text-xs text-green-700 list-disc list-inside space-y-1 mt-2">
            <li>Add vehicles to your fleet</li>
            <li>Upload vehicle documents for card issuance</li>
            <li>Track card delivery status</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowWelcomeModal(false)}
            className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            Explore Dashboard
          </button>
          <button
            onClick={() => { setShowWelcomeModal(false); setActiveView("fo-add-vehicle"); }}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>
    </div>
  ) : null

  function renderView() {
    switch (activeView) {
      case "fo-dashboard": return <FODashboard onViewChange={setActiveView} />
      case "fo-wallet": return <FOWalletView />
      case "fo-cards": return selectedCardVehicle ? (
        <CardDetailsView
          vehicle={myVehicles.find(v => v.id === selectedCardVehicle)!}
          onBack={() => setSelectedCardVehicle(null)}
          onActionModal={setActionModal}
        />
      ) : (
        <FOCardsView onViewChange={setActiveView} onManageCard={(vehicleId) => setSelectedCardVehicle(vehicleId)} />
      )
      case "fo-vehicles": return <FOVehiclesList onViewChange={setActiveView} />
      case "fo-add-vehicle": return <FOAddVehicle onViewChange={setActiveView} />
      case "fo-funds": return <FOFundManagement />
      case "fo-delivery": return <FODeliveryTracking />
      case "fo-notifications": return <FONotificationsView />
      default: return <FODashboard onViewChange={setActiveView} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        <WelcomeModal />
        <MGLSidebar
          role="fleet-operator"
          activeView={activeView}
          onViewChange={setActiveView}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <MGLHeader
            role="fleet-operator"
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
