"use client";
import { TrendingUp, TrendingDown, BarChart3, PieChart, LineChart } from "lucide-react";

export default function FOAnalytics() {
  const metrics = [
    { label: "Total Fleet Value", value: "₹45,50,000", change: "+12.5%", icon: TrendingUp, color: "text-green-600" },
    { label: "Avg. Fuel Cost/Vehicle", value: "₹2,450", change: "-8.2%", icon: TrendingDown, color: "text-red-600" },
    { label: "Fleet Utilization", value: "87%", change: "+5.3%", icon: TrendingUp, color: "text-green-600" },
    { label: "Avg. Mileage", value: "8.5 km/l", change: "+2.1%", icon: TrendingUp, color: "text-green-600" },
  ];

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-1">Monitor your fleet performance and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <p className="text-xl font-bold text-foreground">{metric.value}</p>
              <p className={`text-xs mt-1 ${metric.color}`}>{metric.change} vs last month</p>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholders */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <LineChart className="w-4 h-4" />
            Fuel Spending Trend
          </h3>
          <div className="h-48 bg-muted rounded flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Monthly fuel spending trend chart</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Vehicle-wise Distribution
          </h3>
          <div className="h-48 bg-muted rounded flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Fuel distribution across vehicles</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Top Performing Vehicles
        </h3>
        <div className="space-y-3">
          {[
            { vehicle: "MH01AB1234", score: 92, mileage: "9.2 km/l", trips: 145 },
            { vehicle: "MH02CD5678", score: 88, mileage: "8.8 km/l", trips: 128 },
            { vehicle: "MH03EF9012", score: 85, mileage: "8.4 km/l", trips: 112 },
          ].map((v, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{v.vehicle}</p>
                <div className="flex gap-4 text-xs text-muted-foreground mt-0.5">
                  <span>Mileage: {v.mileage}</span>
                  <span>Trips: {v.trips}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <p className="text-sm font-bold text-primary">{v.score}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
