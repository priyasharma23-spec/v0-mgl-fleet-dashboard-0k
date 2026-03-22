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
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Recently Added</h2>
          <span className="text-xs text-muted-foreground">Last 7 days</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Fleet Operators <span className="text-primary ml-1">3 new</span></p>
            <div className="divide-y divide-border">
              <div className="px-3 py-2 hover:bg-muted/30 transition-colors">
                <p className="text-sm font-medium text-foreground">Swift Logistics</p>
                <p className="text-xs text-muted-foreground">Pune • Mar 20 • 8 vehicles</p>
              </div>
              <div className="px-3 py-2 hover:bg-muted/30 transition-colors">
                <p className="text-sm font-medium text-foreground">Express Fleet Co.</p>
                <p className="text-xs text-muted-foreground">Chennai • Mar 19 • 5 vehicles</p>
              </div>
              <div className="px-3 py-2 hover:bg-muted/30 transition-colors">
                <p className="text-sm font-medium text-foreground">Urban Movers Ltd.</p>
                <p className="text-xs text-muted-foreground">Delhi • Mar 18 • 12 vehicles</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Vehicles <span className="text-primary ml-1">4 new</span></p>
            <div className="divide-y divide-border">
              <div className="px-3 py-2 hover:bg-muted/30 transition-colors">
                <p className="font-mono text-sm font-medium text-foreground">MH12AB1234</p>
                <p className="text-xs text-muted-foreground">ABC Logistics • Card Active • Mar 21</p>
              </div>
              <div className="px-3 py-2 hover:bg-muted/30 transition-colors">
                <p className="font-mono text-sm font-medium text-foreground">KA05XY5678</p>
                <p className="text-xs text-muted-foreground">Metro Freight • Card Pending • Mar 21</p>
              </div>
              <div className="px-3 py-2 hover:bg-muted/30 transition-colors">
                <p className="font-mono text-sm font-medium text-foreground">DL08CD9012</p>
                <p className="text-xs text-muted-foreground">Urban Transport • Card Active • Mar 20</p>
              </div>
              <div className="px-3 py-2 hover:bg-muted/30 transition-colors">
                <p className="font-mono text-sm font-medium text-foreground">TN03EF3456</p>
                <p className="text-xs text-muted-foreground">City Express • Card Active • Mar 20</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing FOs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-foreground">Top Performing FOs</h2>
          <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">5 Fleet Operators • 9,685 transactions • ₹147.9L volume</p>
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
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3"><span className="mr-2">🥇</span>ABC Logistics</td><td className="px-4 py-3 text-muted-foreground">Mumbai</td><td className="px-4 py-3 text-center">2,847</td><td className="px-4 py-3 text-center">₹45.8L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">12</span></td></tr>
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3"><span className="mr-2">🥈</span>Metro Freight</td><td className="px-4 py-3 text-muted-foreground">Pune</td><td className="px-4 py-3 text-center">2,156</td><td className="px-4 py-3 text-center">₹32.4L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">18</span></td></tr>
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3"><span className="mr-2">🥉</span>City Express</td><td className="px-4 py-3 text-muted-foreground">Thane</td><td className="px-4 py-3 text-center">1,945</td><td className="px-4 py-3 text-center">₹28.6L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">22</span></td></tr>
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3">Sunrise Transport</td><td className="px-4 py-3 text-muted-foreground">Navi Mumbai</td><td className="px-4 py-3 text-center">1,534</td><td className="px-4 py-3 text-center">₹22.8L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">8</span></td></tr>
              <tr className="border-b border-border hover:bg-muted/30"><td className="px-4 py-3">Quick Move</td><td className="px-4 py-3 text-muted-foreground">Nashik</td><td className="px-4 py-3 text-center">1,203</td><td className="px-4 py-3 text-center">₹18.5L</td><td className="px-4 py-3 text-center"><span className="text-green-600 font-medium">3</span></td></tr>
              <tr className="border-t-2 border-border bg-muted/30"><td className="px-4 py-3 font-bold text-foreground">Total</td><td className="px-4 py-3 font-bold text-foreground">—</td><td className="px-4 py-3 text-center font-bold text-foreground">9,685</td><td className="px-4 py-3 text-center font-bold text-foreground">₹147.9L</td><td className="px-4 py-3 text-center font-bold text-foreground">63</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* FO Registration Trend (MoM) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">FO Registration Trend</h3>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+22% MoM</span>
          </div>
          {(() => {
            const data = [{label:'Oct',value:8},{label:'Nov',value:12},{label:'Dec',value:9},{label:'Jan',value:15},{label:'Feb',value:18},{label:'Mar',value:22}]
            const max = Math.max(...data.map(d => d.value))
            return (
              <div className="flex items-end justify-between gap-1 mt-4" style={{height: '120px'}}>
                {data.map(d => (
                  <div key={d.label} className="flex flex-col items-center justify-end flex-1 h-full gap-1">
                    <span className="text-xs font-bold text-foreground">{d.value}</span>
                    <div className="w-full bg-green-500 rounded-t" style={{height: `${Math.round((d.value/max)*80)}px`}} />
                    <span className="text-xs text-muted-foreground">{d.label}</span>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>

        {/* Vehicle Registration Trend (MoM) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Vehicle Registration Trend</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">+18% MoM</span>
          </div>
          {(() => {
            const data = [{label:'Oct',value:45},{label:'Nov',value:62},{label:'Dec',value:58},{label:'Jan',value:78},{label:'Feb',value:95},{label:'Mar',value:112}]
            const max = Math.max(...data.map(d => d.value))
            return (
              <div className="flex items-end justify-between gap-1 mt-4" style={{height: '120px'}}>
                {data.map(d => (
                  <div key={d.label} className="flex flex-col items-center justify-end flex-1 h-full gap-1">
                    <span className="text-xs font-bold text-foreground">{d.value}</span>
                    <div className="w-full bg-blue-500 rounded-t" style={{height: `${Math.round((d.value/max)*80)}px`}} />
                    <span className="text-xs text-muted-foreground">{d.label}</span>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>

        {/* Self vs Assisted FO Onboarding */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-6">Self vs Assisted FO Onboarding</h3>
          <div>
            <div className="flex h-12 rounded-full overflow-hidden mb-4 border border-border">
              <div className="flex-1 bg-green-500 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">67%</span>
              </div>
              <div className="flex-1 bg-blue-500 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">33%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">85 Self</span>
              <span className="text-sm font-semibold text-foreground">42 Assisted</span>
            </div>
          </div>
        </div>

        {/* Top MICs by New FO Registration */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Top MICs by New FO Registration</h3>
          <div className="space-y-3">
            {[{rank: 1, name: "Sneha Patil", count: 12}, {rank: 2, name: "Raj Kumar", count: 9}, {rank: 3, name: "Priya Joshi", count: 7}, {rank: 4, name: "Amit Shah", count: 5}].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  item.rank === 1 ? "bg-yellow-500" : item.rank === 2 ? "bg-gray-400" : item.rank === 3 ? "bg-orange-600" : "bg-gray-300"
                }`}>
                  {item.rank}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-sm font-bold text-foreground">{item.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: `${(item.count/12)*100}%`}} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Dealerships by Volume */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">Top 5 Dealerships by Volume</h3>
          <div className="space-y-3">
            {[{rank: 1, name: "ABC Motors", volume: "₹45.8L", txns: 156}, {rank: 2, name: "XYZ Auto", volume: "₹32.4L", txns: 112}, {rank: 3, name: "Prime Motors", volume: "₹28.6L", txns: 98}, {rank: 4, name: "Elite Autos", volume: "₹22.1L", txns: 76}, {rank: 5, name: "Metro Garage", volume: "₹18.5L", txns: 64}].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  item.rank === 1 ? "bg-yellow-500" : item.rank === 2 ? "bg-gray-400" : item.rank === 3 ? "bg-orange-600" : "bg-gray-300"
                }`}>
                  {item.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                    <span className="text-sm font-bold text-foreground ml-2">{item.volume}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.txns} transactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Trend (MoM) */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Transaction Trend</h3>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">+15% MoM</span>
          </div>
          {(() => {
            const data = [{label:'Oct',value:1240},{label:'Nov',value:1580},{label:'Dec',value:1320},{label:'Jan',value:1890},{label:'Feb',value:2150},{label:'Mar',value:2480}]
            const max = Math.max(...data.map(d => d.value))
            return (
              <div className="flex items-end justify-between gap-1 mt-4" style={{height: '120px'}}>
                {data.map(d => (
                  <div key={d.label} className="flex flex-col items-center justify-end flex-1 h-full gap-1">
                    <span className="text-xs font-bold text-foreground">{(d.value/1000).toFixed(1)}K</span>
                    <div className="w-full bg-purple-500 rounded-t" style={{height: `${Math.round((d.value/max)*80)}px`}} />
                    <span className="text-xs text-muted-foreground">{d.label}</span>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Transaction Trend by Time of Day - Full Width */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Transaction Trend by Time of Day</h2>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Peak: 9AM-12PM</span>
        </div>
        {(() => {
          const slots = [
            { label: '6AM-9AM', pct: 15, peak: false },
            { label: '9AM-12PM', pct: 28, peak: true },
            { label: '12PM-3PM', pct: 22, peak: false },
            { label: '3PM-6PM', pct: 25, peak: false },
            { label: '6PM-9PM', pct: 10, peak: false },
          ]
          return (
            <div style={{height: '140px'}} className="flex items-end gap-3">
              {slots.map(s => (
                <div key={s.label} className="flex flex-col items-center justify-end flex-1 h-full gap-1">
                  <span className="text-xs font-bold">{s.pct}%</span>
                  <div
                    className={`w-full rounded-t-sm ${s.peak ? 'bg-amber-500' : 'bg-amber-200'}`}
                    style={{height: `${Math.round((s.pct/28)*110)}px`}}
                  />
                  <span className="text-xs text-muted-foreground text-center">{s.label}</span>
                </div>
              ))}
            </div>
          )
        })()}
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
