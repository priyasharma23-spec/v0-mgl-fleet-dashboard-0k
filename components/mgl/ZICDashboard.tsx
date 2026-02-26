"use client";
import { Shield, Truck, CreditCard, CheckSquare, TrendingUp, Clock, AlertCircle } from "lucide-react";
import StatCard from "@/components/mgl/StatCard";
import { mockVehicles, mockFleetOperators, approvalTrendData, cardStatusData } from "@/lib/mgl-data";
import { VehicleStatusBadge } from "@/components/mgl/StatusBadge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

interface ZICDashboardProps {
  onViewChange: (view: string) => void;
}

export default function ZICDashboard({ onViewChange }: ZICDashboardProps) {
  const l2Pending = mockVehicles.filter((v) => v.status === "L2_SUBMITTED");
  const l2Approved = mockVehicles.filter((v) => v.status === "L2_APPROVED").length;
  const l2Rejected = mockVehicles.filter((v) => v.status === "L2_REJECTED").length;
  const cardsDispatched = mockVehicles.filter((v) => v.status === "CARD_DISPATCHED" || v.status === "CARD_ACTIVE" || v.status === "CARD_PRINTED").length;

  const incentiveVehicles = mockVehicles.filter((v) => v.onboardingType === "MIC_ASSISTED");

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">ZIC Dashboard</h1>
          <p className="text-sm text-muted-foreground">Zone In-Charge — Mumbai West Zone</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Today</span>
          <span className="text-xs font-semibold text-foreground">
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="L2 Pending"
          value={l2Pending.length}
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          subtitle="Awaiting your review"
          onClick={() => onViewChange("zic-l2-queue")}
        />
        <StatCard
          title="L2 Approved"
          value={l2Approved}
          icon={CheckSquare}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend={15}
          trendLabel="this month"
        />
        <StatCard
          title="Cards Dispatched"
          value={cardsDispatched}
          icon={CreditCard}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          subtitle={`${mockVehicles.filter((v) => v.status === "CARD_ACTIVE").length} active`}
        />
        <StatCard
          title="Incentive Vehicles"
          value={incentiveVehicles.length}
          icon={TrendingUp}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          subtitle="MIC-assisted FOs"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 lg:col-span-2">
          <p className="font-semibold text-sm text-foreground mb-1">L2 Approval Trend</p>
          <p className="text-xs text-muted-foreground mb-4">Monthly approvals vs rejections</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={approvalTrendData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)" }} />
              <Bar dataKey="approved" fill="#2EAD4B" radius={[4, 4, 0, 0]} name="Approved" />
              <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <p className="font-semibold text-sm text-foreground mb-1">Card Pipeline</p>
          <p className="text-xs text-muted-foreground mb-4">Current status breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={cardStatusData} cx="50%" cy="45%" outerRadius={65} dataKey="value" nameKey="name">
                {cardStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* L2 Pending Queue */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-sm text-foreground">L2 Pending Queue</p>
          <button onClick={() => onViewChange("zic-l2-queue")} className="text-xs text-primary font-medium hover:underline">
            View all
          </button>
        </div>
        {l2Pending.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-muted-foreground">
            <CheckSquare className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No pending L2 approvals</p>
          </div>
        ) : (
          <div className="space-y-2">
            {l2Pending.map((v) => (
              <div key={v.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onViewChange("zic-l2-queue")}>
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{v.vehicleNumber || v.id}</p>
                  <p className="text-xs text-muted-foreground">{v.foName} · {v.model} · {v.category}</p>
                  <p className="text-xs text-muted-foreground">L2 Submitted: {v.l2SubmittedAt}</p>
                </div>
                <div className="text-right shrink-0">
                  <VehicleStatusBadge status={v.status} />
                  <p className="text-xs text-muted-foreground mt-1">{v.onboardingType === "MIC_ASSISTED" ? "New Purchase" : "Self-Service"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
