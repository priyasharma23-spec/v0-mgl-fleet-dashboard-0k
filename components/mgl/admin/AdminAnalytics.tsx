"use client"

import { BarChart3, PieChart, Activity, TrendingUp, ArrowRight } from "lucide-react"

export default function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Usage trends, performance insights, and predictive analytics</p>
      </div>

      {/* Recently Added */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* New Fleet Operators */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">New Fleet Operators (Last 7 days)</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <p className="text-sm font-medium text-foreground">Swift Logistics</p>
                <p className="text-xs text-muted-foreground">Pune • Mar 20 • 8 vehicles</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <p className="text-sm font-medium text-foreground">Express Fleet Co.</p>
                <p className="text-xs text-muted-foreground">Chennai • Mar 19 • 5 vehicles</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <p className="text-sm font-medium text-foreground">Urban Movers Ltd.</p>
                <p className="text-xs text-muted-foreground">Delhi • Mar 18 • 12 vehicles</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Vehicles Registered */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">New Vehicles Registered (Last 7 days)</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <p className="font-mono text-sm font-medium text-foreground">MH12AB1234</p>
                <p className="text-xs text-muted-foreground">ABC Logistics • Card Active • Mar 21</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <p className="font-mono text-sm font-medium text-foreground">KA05XY5678</p>
                <p className="text-xs text-muted-foreground">Metro Freight • Card Pending • Mar 21</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <p className="font-mono text-sm font-medium text-foreground">DL08CD9012</p>
                <p className="text-xs text-muted-foreground">Urban Transport • Card Active • Mar 20</p>
              </div>
              <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
                <p className="font-mono text-sm font-medium text-foreground">TN03EF3456</p>
                <p className="text-xs text-muted-foreground">City Express • Card Active • Mar 20</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing FOs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Top Performing FOs</h2>
          <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-semibold text-foreground">FO Name</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Region</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Transactions</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Volume</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Cards Active</th>
            </tr></thead>
            <tbody>
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3">ABC Logistics</td><td className="px-4 py-3 text-muted-foreground">Mumbai</td><td className="px-4 py-3 text-center">2,847</td><td className="px-4 py-3 text-center">₹45.8L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">12</span></td></tr>
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3">Metro Freight</td><td className="px-4 py-3 text-muted-foreground">Pune</td><td className="px-4 py-3 text-center">2,156</td><td className="px-4 py-3 text-center">₹32.4L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">18</span></td></tr>
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3">City Express</td><td className="px-4 py-3 text-muted-foreground">Thane</td><td className="px-4 py-3 text-center">1,945</td><td className="px-4 py-3 text-center">₹28.6L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">22</span></td></tr>
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3">Sunrise Transport</td><td className="px-4 py-3 text-muted-foreground">Navi Mumbai</td><td className="px-4 py-3 text-center">1,534</td><td className="px-4 py-3 text-center">₹22.8L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">8</span></td></tr>
              <tr className="hover:bg-muted/30"><td className="px-4 py-3">Quick Move</td><td className="px-4 py-3 text-muted-foreground">Nashik</td><td className="px-4 py-3 text-center">1,203</td><td className="px-4 py-3 text-center">₹18.5L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">3</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">FO Growth Trend</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Monthly FO registrations chart</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Wallet Utilization</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <PieChart className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Card vs Incentive wallet usage</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Settlement Heatmap</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Settlement delays by time of day</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Incentive Redemption Rate</h3>
          <div className="h-48 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Offer performance over time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground">89%</p>
            <p className="text-xs text-muted-foreground mt-1">Card Activation Rate</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground">₹45K</p>
            <p className="text-xs text-muted-foreground mt-1">Avg Monthly Load/FO</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground">98.5%</p>
            <p className="text-xs text-muted-foreground mt-1">Settlement Success Rate</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-3xl font-bold text-foreground">4.2x</p>
            <p className="text-xs text-muted-foreground mt-1">Incentive ROI</p>
          </div>
        </div>
      </div>
    </div>
  )
}
