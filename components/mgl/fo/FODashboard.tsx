"use client"

import { useState } from "react"
import { KPICard } from "@/components/mgl/shared"
import { Truck, CreditCard, Wallet, Gift, ArrowRight, CheckCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react"

interface FODashboardProps {
  onViewChange: (view: string) => void
}

export default function FODashboard({ onViewChange }: FODashboardProps) {
  const recentTransactions = [
    { vehicle: "MH12AB1234", station: "CNG Station, Thane", amount: "₹1,200", time: "2:45 PM", status: "Success" },
    { vehicle: "MH12CD5678", station: "Shell Station, Mumbai", amount: "₹1,890", time: "1:30 PM", status: "Success" },
    { vehicle: "KA05XY5678", station: "CNG Station, Bangalore", amount: "₹950", time: "12:15 PM", status: "Success" },
    { vehicle: "MH47BY2770", station: "Fuel Station, Pune", amount: "₹2,150", time: "11:00 AM", status: "Success" },
    { vehicle: "TN03EF3456", station: "CNG Station, Chennai", amount: "₹1,450", time: "9:30 AM", status: "Success" },
  ]

  const alerts = [
    { type: "warning", title: "KYC Expiring", message: "2 vehicles have KYC expiring within 30 days", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { type: "error", title: "Card Blocked", message: "1 card has been blocked due to suspicious activity", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { type: "info", title: "Low Wallet Balance", message: "Parent wallet balance is below ₹5,000 threshold", icon: AlertTriangle, color: "text-blue-600", bg: "bg-blue-50" },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Vehicles"
          value="15"
          icon={Truck}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          subtitle="Active fleet"
        />
        <KPICard
          label="Active Cards"
          value="12"
          icon={CreditCard}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          subtitle="Operational"
        />
        <KPICard
          label="Parent Wallet"
          value="₹2.4L"
          icon={Wallet}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          subtitle="Available balance"
        />
        <KPICard
          label="Incentive Balance"
          value="₹8,400"
          icon={Gift}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          subtitle="Unused incentives"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => onViewChange("fo-funds")}
          className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="text-left">
            <p className="font-semibold text-foreground">Load Wallet</p>
            <p className="text-xs text-muted-foreground">Add funds to parent wallet</p>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-600" />
        </button>
        <button
          onClick={() => onViewChange("fo-add-vehicle")}
          className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="text-left">
            <p className="font-semibold text-foreground">Add Vehicle</p>
            <p className="text-xs text-muted-foreground">Register new vehicle</p>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={() => onViewChange("fo-cards")}
          className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="text-left">
            <p className="font-semibold text-foreground">View Cards</p>
            <p className="text-xs text-muted-foreground">Manage your cards</p>
          </div>
          <ArrowRight className="w-5 h-5 text-green-600" />
        </button>
      </div>

      {/* Settlement Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Today's Settlement</h3>
            <p className="text-sm text-muted-foreground">Settlement status</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">Settled</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Amount Settled</p>
            <p className="text-2xl font-bold text-foreground">₹45,000</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Next Settlement</p>
            <p className="text-lg font-semibold text-foreground">Tomorrow</p>
            <p className="text-xs text-muted-foreground">₹28,000 estimated</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground">Last 5 CNG transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Station</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3 font-mono text-sm font-medium text-foreground">{txn.vehicle}</td>
                  <td className="px-6 py-3 text-sm text-foreground">{txn.station}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-foreground">{txn.amount}</td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{txn.time}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Active Alerts</h3>
        {alerts.map((alert, i) => (
          <div key={i} className={`${alert.bg} border border-current border-opacity-20 rounded-xl p-4 flex items-start gap-3`}>
            <alert.icon className={`w-5 h-5 ${alert.color} mt-0.5 shrink-0`} />
            <div>
              <p className={`font-medium text-sm ${alert.color}`}>{alert.title}</p>
              <p className="text-sm text-foreground mt-0.5">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
