"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Users, CreditCard, Wallet, Gift, AlertTriangle, ArrowRight, Activity, CheckCircle, RefreshCw, Zap, Percent, Eye, FileText, Plus, BarChart3, Receipt, Building2, ArrowRightLeft } from "lucide-react"

export default function AdminDashboard({ onViewChange }: { onViewChange: (v: string) => void }) {
  const kpis = [
    { label: "Active Fleet Operators", value: "127", change: "+8", trend: "up", icon: Users, color: "blue" },
    { label: "Total Active Cards", value: "2,847", change: "+156", trend: "up", icon: CreditCard, color: "green" },
    { label: "Parent Wallet Balance", value: "₹4.2Cr", change: "+12%", trend: "up", icon: Wallet, color: "purple" },
    { label: "Incentive Pool Used", value: "₹18.5L", change: "42%", trend: "neutral", icon: Gift, color: "amber" },
    { label: "Incentive Paid Today", value: "₹2.4L", change: "", trend: "neutral", icon: Gift, color: "green" },
    { label: "Cashback Paid Today", value: "₹85,000", change: "", trend: "neutral", icon: Percent, color: "blue" },
    { label: "Unused Card Balance", value: "₹1.2Cr", change: "", trend: "neutral", icon: CreditCard, color: "purple" },
    { label: "Today's Settlement", value: "₹45.8L", change: "156 txns • 12 dealerships", trend: "neutral", icon: ArrowRightLeft, color: "green" },
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
            <Wallet className="w-4 h-4 text-green-600 shrink-0" />
            <div>
              <p className="text-xs text-green-700 font-medium">Available Balance</p>
              <p className="text-sm font-bold text-green-900">₹4.2Cr</p>
            </div>
            <button className="p-1 hover:bg-green-100 rounded-lg transition-colors ml-1">
              <RefreshCw className="w-3.5 h-3.5 text-green-600" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
            <span className="text-xs text-muted-foreground">2 mins ago</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {kpis.map((kpi, i) => {
          if (kpi.label === "Today's Settlement") {
            return (
              <div key={i} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Today</span>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">₹45.8L</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Today's Settlement</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-green-600 font-medium">156 txns</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-blue-600 font-medium">12 dealerships</span>
                  </div>
                </div>
              </div>
            );
          }
          return (
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
                  <span className="text-xs font-medium text-amber-600">{kpi.change}</span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Zap className="w-5 h-5 text-blue-600" /></div>
          <span className="text-xs font-medium text-foreground">Process Settlement</span>
        </button>
        <button className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><Gift className="w-5 h-5 text-green-600" /></div>
          <span className="text-xs font-medium text-foreground">Create Offer</span>
        </button>
        <button className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><Plus className="w-5 h-5 text-purple-600" /></div>
          <span className="text-xs font-medium text-foreground">Add FO</span>
        </button>
        <button className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"><FileText className="w-5 h-5 text-amber-600" /></div>
          <span className="text-xs font-medium text-foreground">Generate Report</span>
        </button>
      </div>

      {/* Pending Actions + Business Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending Actions */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Pending Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
              <div><p className="text-sm font-medium text-orange-900">KYC Expiring Soon</p><p className="text-xs text-orange-700 mt-1">5 FOs need attention</p></div>
              <div className="flex items-center gap-2"><span className="px-2.5 py-1 rounded-full bg-orange-600 text-white text-xs font-bold">5</span><button className="text-orange-600 hover:text-orange-700"><Eye className="w-4 h-4" /></button></div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
              <div><p className="text-sm font-medium text-red-900">Settlements Overdue</p><p className="text-xs text-red-700 mt-1">Beyond T+1 SLA</p></div>
              <div className="flex items-center gap-2"><span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold">3</span><button className="text-red-600 hover:text-red-700"><Eye className="w-4 h-4" /></button></div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
              <div><p className="text-sm font-medium text-amber-900">Low Incentive Pool</p><p className="text-xs text-amber-700 mt-1">Below 50% threshold</p></div>
              <div className="flex items-center gap-2"><span className="px-2.5 py-1 rounded-full bg-amber-600 text-white text-xs font-bold">1</span><button className="text-amber-600 hover:text-amber-700"><Eye className="w-4 h-4" /></button></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border p-5">
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
