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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FO Registration Trend (MoM) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">FO Registration Trend (MoM)</h3>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+22%</span>
          </div>
          <div className="space-y-2">
            {[{month: "Oct", value: 8}, {month: "Nov", value: 12}, {month: "Dec", value: 9}, {month: "Jan", value: 15}, {month: "Feb", value: 18}, {month: "Mar", value: 22}].map((item) => (
              <div key={item.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                  <span className="text-xs font-medium text-foreground">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded h-2">
                  <div className="bg-green-500 h-2 rounded" style={{width: `${(item.value/22)*100}%`}} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Registration Trend (MoM) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Vehicle Registration Trend (MoM)</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">+18%</span>
          </div>
          <div className="space-y-2">
            {[{month: "Oct", value: 45}, {month: "Nov", value: 62}, {month: "Dec", value: 58}, {month: "Jan", value: 78}, {month: "Feb", value: 95}, {month: "Mar", value: 112}].map((item) => (
              <div key={item.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                  <span className="text-xs font-medium text-foreground">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded h-2">
                  <div className="bg-blue-500 h-2 rounded" style={{width: `${(item.value/112)*100}%`}} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Self vs Assisted FO Onboarding */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Self vs Assisted FO Onboarding</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Self Onboarded</span>
                <span className="text-sm font-medium text-foreground">85 FOs (67%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{width: "67%"}} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Assisted by MIC</span>
                <span className="text-sm font-medium text-foreground">42 FOs (33%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{width: "33%"}} />
              </div>
            </div>
          </div>
        </div>

        {/* Top MICs by New FO Registration */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Top MICs by New FO Registration</h3>
          <div className="space-y-3">
            {[{name: "Sneha Patil", count: 12}, {name: "Raj Kumar", count: 9}, {name: "Priya Joshi", count: 7}, {name: "Amit Shah", count: 5}].map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm font-medium text-foreground">{item.count}</span>
                </div>
                <div className="w-full bg-muted rounded h-2">
                  <div className="bg-purple-500 h-2 rounded" style={{width: `${(item.count/12)*100}%`}} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Dealerships by Volume */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold mb-4">Top 5 Dealerships by Volume</h3>
          <div className="space-y-2">
            {[{name: "ABC Motors", volume: "₹45.8L", txns: 156}, {name: "XYZ Auto", volume: "₹32.4L", txns: 112}, {name: "Prime Motors", volume: "₹28.6L", txns: 98}, {name: "Elite Autos", volume: "₹22.1L", txns: 76}, {name: "Metro Garage", volume: "₹18.5L", txns: 64}].map((item) => (
              <div key={item.name} className="p-2 bg-muted/30 rounded">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-sm text-foreground">{item.volume}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.txns} transactions</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Trend (MoM) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Transaction Trend (MoM)</h3>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">+15%</span>
          </div>
          <div className="space-y-2">
            {[{month: "Oct", value: 1240}, {month: "Nov", value: 1580}, {month: "Dec", value: 1320}, {month: "Jan", value: 1890}, {month: "Feb", value: 2150}, {month: "Mar", value: 2480}].map((item) => (
              <div key={item.month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                  <span className="text-xs font-medium text-foreground">{item.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded h-2">
                  <div className="bg-purple-500 h-2 rounded" style={{width: `${(item.value/2480)*100}%`}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Trend by Time of Day - Full Width */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Transaction Trend by Time of Day</h3>
        <div className="space-y-3">
          {[{period: "6AM-9AM", percentage: 15}, {period: "9AM-12PM", percentage: 28}, {period: "12PM-3PM", percentage: 22}, {period: "3PM-6PM", percentage: 25}, {period: "6PM-9PM", percentage: 10}].map((item) => (
            <div key={item.period}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-foreground">{item.period}</span>
                <span className="text-sm font-medium text-foreground">{item.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded h-2">
                <div className="bg-amber-500 h-2 rounded" style={{width: `${item.percentage}%`}} />
              </div>
            </div>
          ))}
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

      {/* Business Health */}
      <div>
        <h2 className="font-semibold text-foreground mb-3">Business Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Card Activation Rate</p>
              <p className="text-lg font-bold text-green-600">89%</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: "89%"}} />
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Settlement Success Rate</p>
              <p className="text-lg font-bold text-green-600">98.5%</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: "98.5%"}} />
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Incentive Utilization</p>
              <p className="text-lg font-bold text-amber-600">42%</p>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{width: "42%"}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
