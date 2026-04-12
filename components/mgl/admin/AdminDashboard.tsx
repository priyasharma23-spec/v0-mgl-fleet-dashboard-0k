"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Users, CreditCard, Wallet, Gift, AlertTriangle, ArrowRight, Activity, CheckCircle, RefreshCw } from "lucide-react"

export default function AdminDashboard({ onViewChange }: { onViewChange: (v: string) => void }) {
  const kpis = [
    { label: "Active Fleet Operators", value: "127", change: "+8", trend: "up", icon: Users, color: "blue" },
    { label: "Total Active Cards", value: "2,847", change: "+156", trend: "up", icon: CreditCard, color: "green" },
    { label: "Parent Wallet Balance", value: "₹4.2Cr", change: "+12%", trend: "up", icon: Wallet, color: "purple" },
    { label: "Incentive Pool Used", value: "₹18.5L", change: "42%", trend: "neutral", icon: Gift, color: "amber" },
  ]

  const recentActivity = [
    { type: "settlement", desc: "T+1 Settlement completed for 156 transactions", time: "2 mins ago", status: "success" },
    { type: "offer", desc: "Winter Bonus offer launched - 5% cashback", time: "1 hr ago", status: "info" },
    { type: "alert", desc: "Low incentive fund alert - ₹2L remaining", time: "3 hrs ago", status: "warning" },
    { type: "settlement", desc: "Settlement batch #4521 processed - ₹12.4L", time: "5 hrs ago", status: "success" },
    { type: "escalation", desc: "FO ABC Logistics - KYC document expiring", time: "1 day ago", status: "warning" },
  ]

  const settlementStatus = {
    pending: 23,
    processing: 8,
    completed: 156,
    failed: 2,
    totalAmount: "₹45.8L"
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">System overview and operations monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Last updated: 2 mins ago</span>
          <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                kpi.color === "blue" ? "bg-blue-100" :
                kpi.color === "green" ? "bg-green-100" :
                kpi.color === "purple" ? "bg-purple-100" : "bg-amber-100"
              }`}>
                <kpi.icon className={`w-5 h-5 ${
                  kpi.color === "blue" ? "text-blue-600" :
                  kpi.color === "green" ? "text-green-600" :
                  kpi.color === "purple" ? "text-purple-600" : "text-amber-600"
                }`} />
              </div>
              {kpi.trend !== "neutral" && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {kpi.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </div>
              )}
              {kpi.trend === "neutral" && (
                <span className="text-xs font-medium text-amber-600">{kpi.change} used</span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Settlement Overview */}
        <div className="lg:col-span-1 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Settlement Status</h2>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-foreground">{settlementStatus.totalAmount}</p>
            <p className="text-xs text-muted-foreground">Total Settlement Value</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <span className="text-sm font-medium">{settlementStatus.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Processing</span>
              </div>
              <span className="text-sm font-medium">{settlementStatus.processing}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <span className="text-sm font-medium">{settlementStatus.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Failed</span>
              </div>
              <span className="text-sm font-medium">{settlementStatus.failed}</span>
            </div>
          </div>

          <button 
            onClick={() => onViewChange("admin-transactions")}
            className="w-full mt-4 py-2 text-sm text-primary font-medium border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
          >
            View All Transactions <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Activity</h2>
            <button className="text-xs text-primary font-medium hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  item.status === "success" ? "bg-green-100" :
                  item.status === "warning" ? "bg-amber-100" : "bg-blue-100"
                }`}>
                  {item.status === "success" ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                   item.status === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-600" /> :
                   <Activity className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.desc}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800">System Alerts</h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-700">
              <li>• Incentive fund balance below threshold (₹2L remaining) - <button className="underline font-medium">Top up now</button></li>
              <li>• 3 settlements delayed beyond T+1 SLA - <button className="underline font-medium">Review</button></li>
              <li>• 5 FO KYC documents expiring this week - <button className="underline font-medium">View list</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
