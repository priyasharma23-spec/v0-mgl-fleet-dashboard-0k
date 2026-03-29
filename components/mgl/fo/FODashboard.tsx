"use client"

import { useState } from "react"
import Image from "next/image"
import { Truck, CreditCard, Clock, AlertCircle, ChevronRight, MapPin, Bell } from "lucide-react"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts"
import { VehicleStatusBadge, WorkflowStepper } from "@/components/mgl/shared"
import { myVehicles, myFO } from "@/data/mock"

interface FODashboardProps {
  onViewChange: (view: string) => void
}

export default function FODashboard({ onViewChange }: FODashboardProps) {
  const totalVehicles = myVehicles.length
  const activeCards = myVehicles.filter((v) => v.status === "CARD_ACTIVE").length
  const pendingDocs = myVehicles.filter((v) => ["DRAFT", "L1_REJECTED", "L2_REJECTED"].includes(v.status)).length
  const inProgress = myVehicles.filter((v) => ["L1_SUBMITTED", "L1_APPROVED", "L2_SUBMITTED", "L2_APPROVED", "CARD_PRINTED", "CARD_DISPATCHED"].includes(v.status)).length

  const activityData = [
    { month: "Oct", submitted: 3, approved: 2 },
    { month: "Nov", submitted: 2, approved: 2 },
    { month: "Dec", submitted: 4, approved: 3 },
    { month: "Jan", submitted: 5, approved: 4 },
    { month: "Feb", submitted: 3, approved: 3 },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Welcome banner */}
      <div className="bg-[#1a2e1a] rounded-xl p-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[#F5A800] text-xs font-semibold tracking-wider uppercase mb-1">Welcome back</p>
          <h1 className="text-white text-xl font-bold">{myFO.name}</h1>
          <p className="text-gray-400 text-sm mt-1">MoU: {myFO.mouNumber} · Active until {myFO.mouExpiryDate}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-green-900/60 text-green-300 rounded-full border border-green-700">
              ACTIVE
            </span>
            <span className="text-xs text-gray-400">FO ID: {myFO.id}</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center shrink-0">
          <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-agxPFremWBWY82BTBrfdO5RnOzVori.png"
            alt="MGL" width={56} height={56} className="object-contain" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Vehicles", value: totalVehicles, icon: Truck, action: () => onViewChange("fo-vehicles") },
          { label: "Active Cards", value: activeCards, icon: CreditCard, action: () => onViewChange("fo-cards") },
          { label: "In Progress", value: inProgress, icon: Clock, action: () => onViewChange("fo-vehicles") },
          { label: "Action Needed", value: pendingDocs, icon: AlertCircle, action: () => onViewChange("fo-vehicles") },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} onClick={s.action}
              className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity chart */}
        <div className="bg-card rounded-xl border border-border p-4 lg:col-span-2">
          <p className="font-semibold text-sm text-foreground mb-1">Vehicle Activity</p>
          <p className="text-xs text-muted-foreground mb-4">Submitted vs approved (last 5 months)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData} barGap={4} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Bar dataKey="submitted" fill="#1565C0" radius={[4, 4, 0, 0]} name="Submitted" />
              <Bar dataKey="approved" fill="#2EAD4B" radius={[4, 4, 0, 0]} name="Approved" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="font-semibold text-sm text-foreground mb-3">Quick Actions</p>
          <div className="space-y-2">
            {[
              { label: "Register New Vehicle", icon: Truck, view: "fo-add-vehicle" },
              { label: "Track Card Delivery", icon: MapPin, view: "fo-delivery" },
              { label: "View My Cards", icon: CreditCard, view: "fo-cards" },
            ].map((a) => {
              const Icon = a.icon
              return (
                <button key={a.view} onClick={() => onViewChange(a.view)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors text-foreground">
                  <Icon className="w-4 h-4 shrink-0" />
                  {a.label}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* My vehicles summary */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-sm text-foreground">My Vehicles</p>
          <button onClick={() => onViewChange("fo-vehicles")} className="text-xs text-primary font-medium hover:underline">View all</button>
        </div>
        <div className="space-y-2">
          {myVehicles.slice(0, 3).map((v) => {
            const steps: { label: string; status: "done" | "active" | "pending" }[] = [
              { label: "Registered", status: "done" },
              { label: "L1 Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },
              { label: "L2 Review", status: v.l2ApprovedAt ? "done" : v.l2SubmittedAt ? "active" : "pending" },
              { label: "Card", status: v.cardActivatedAt ? "done" : v.cardNumber ? "active" : "pending" },
            ]
            return (
              <div key={v.id} className="p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => onViewChange("fo-vehicles")}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{v.vehicleNumber || v.id}</p>
                      <p className="text-xs text-muted-foreground">{v.model} · {v.category}</p>
                    </div>
                  </div>
                  <VehicleStatusBadge status={v.status} />
                </div>
                <div className="mt-2 overflow-x-auto">
                  <WorkflowStepper steps={steps} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
