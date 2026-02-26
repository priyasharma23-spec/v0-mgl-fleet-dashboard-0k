"use client";
import { Users, Truck, CreditCard, CheckSquare, TrendingUp, AlertCircle, Clock, XCircle } from "lucide-react";
import StatCard from "@/components/mgl/StatCard";
import { mockFleetOperators, mockVehicles, monthlyOnboardingData, cardStatusData, approvalTrendData } from "@/lib/mgl-data";
import { FOStatusBadge, VehicleStatusBadge } from "@/components/mgl/StatusBadge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";

interface MICDashboardProps {
  onViewChange: (view: string) => void;
}

export default function MICDashboard({ onViewChange }: MICDashboardProps) {
  const totalFOs = mockFleetOperators.length;
  const activeFOs = mockFleetOperators.filter((f) => f.status === "ACTIVE").length;
  const pendingFOs = mockFleetOperators.filter((f) => f.status === "PENDING_ACTIVATION").length;
  const l1Pending = mockVehicles.filter((v) => v.status === "L1_SUBMITTED").length;
  const l1Rejected = mockVehicles.filter((v) => v.status === "L1_REJECTED").length;
  const totalVehicles = mockVehicles.length;
  const activeCards = mockVehicles.filter((v) => v.status === "CARD_ACTIVE").length;
  const recentFOs = mockFleetOperators.slice(0, 4);
  const pendingVehicles = mockVehicles.filter((v) => v.status === "L1_SUBMITTED");

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">MIC Dashboard</h1>
          <p className="text-sm text-muted-foreground">Marketing In-Charge — Mumbai Zone</p>
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
          title="Total FOs"
          value={totalFOs}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend={12}
          trendLabel="vs last month"
          onClick={() => onViewChange("mic-operators")}
        />
        <StatCard
          title="Active FOs"
          value={activeFOs}
          icon={TrendingUp}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          subtitle={`${pendingFOs} pending activation`}
          onClick={() => onViewChange("mic-operators")}
        />
        <StatCard
          title="L1 Pending"
          value={l1Pending}
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          subtitle={`${l1Rejected} recently rejected`}
          onClick={() => onViewChange("mic-l1-queue")}
        />
        <StatCard
          title="Active Cards"
          value={activeCards}
          icon={CreditCard}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          trend={8}
          trendLabel="vs last month"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Onboarding trend */}
        <div className="bg-card rounded-xl border border-border p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-sm text-foreground">Onboarding Trend</p>
              <p className="text-xs text-muted-foreground">Fleet Operators & Vehicles (last 6 months)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyOnboardingData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)" }}
              />
              <Bar dataKey="operators" fill="#1565C0" radius={[4, 4, 0, 0]} name="FOs" />
              <Bar dataKey="vehicles" fill="#2EAD4B" radius={[4, 4, 0, 0]} name="Vehicles" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card status pie */}
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="font-semibold text-sm text-foreground mb-1">Card Status Distribution</p>
          <p className="text-xs text-muted-foreground mb-4">All vehicles</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={cardStatusData} cx="50%" cy="45%" outerRadius={65} dataKey="value" nameKey="name">
                {cardStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending L1 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm text-foreground">Pending L1 Approvals</p>
            <button
              onClick={() => onViewChange("mic-l1-queue")}
              className="text-xs text-primary font-medium hover:underline"
            >
              View all
            </button>
          </div>
          {pendingVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckSquare className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingVehicles.map((v) => (
                <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors border border-border/50"
                  onClick={() => onViewChange("mic-l1-queue")}>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{v.vehicleNumber || v.id}</p>
                    <p className="text-xs text-muted-foreground">{v.foName} · {v.model}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <VehicleStatusBadge status={v.status} />
                    <p className="text-[10px] text-muted-foreground mt-1">{v.l1SubmittedAt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent FOs */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm text-foreground">Recent Fleet Operators</p>
            <button
              onClick={() => onViewChange("mic-operators")}
              className="text-xs text-primary font-medium hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentFOs.map((fo) => (
              <div key={fo.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/60 cursor-pointer transition-colors border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                  {fo.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fo.name}</p>
                  <p className="text-xs text-muted-foreground">{fo.totalVehicles} vehicles · {fo.onboardingType === "MIC_ASSISTED" ? "MIC-Assisted" : "Self-Service"}</p>
                </div>
                <FOStatusBadge status={fo.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
