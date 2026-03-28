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
export default function FONotificationsView() {
  const notifs = [
    { title: "Document Rejected — Action Required", message: "Vehicle MH04EF9012 L1 documents rejected. Reason: Booking receipt is unclear. Please resubmit.", type: "error", time: "2 hrs ago", read: false },
    { title: "Card Dispatched", message: "Your CNG card MGL****7832 has been dispatched. Tracking ID: BLUEDART987654", type: "success", time: "1 day ago", read: true },
    { title: "Vehicle L1 Approved", message: "Vehicle MH04AB1234 has been approved by your MIC officer. Awaiting delivery documents.", type: "success", time: "3 days ago", read: true },
    { title: "MoU Execution Confirmation", message: "Your MoU MGL/MOU/2025/001 has been executed. Onboarding is now active.", type: "info", time: "5 days ago", read: true },
  ]
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">{notifs.filter((n) => !n.read).length} unread</p>
      </div>
      <div className="space-y-2">
        {notifs.map((n, i) => (
          <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${!n.read ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`}>
            <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.type === "success" ? "bg-green-500" : n.type === "error" ? "bg-red-500" : "bg-blue-500"}`} />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
