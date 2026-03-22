"use client"

export default function AdminConfig() {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">System Configuration</h1>
        <p className="text-sm text-muted-foreground">View system parameters and governance settings</p>
      </div>

      {/* System Parameters (Read Only) */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">System Parameters</h2>
          <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">Read Only</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium text-sm">Settlement Cut-off Time</p>
              <p className="text-xs text-muted-foreground">Daily cut-off for T+1 processing</p>
            </div>
            <span className="font-mono text-sm">6:00 PM IST</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium text-sm">Minimum Load Amount</p>
              <p className="text-xs text-muted-foreground">Via Payment Gateway</p>
            </div>
            <span className="font-mono text-sm">₹1,000</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="font-medium text-sm">Max Card Wallet Limit</p>
              <p className="text-xs text-muted-foreground">Per vehicle card</p>
            </div>
            <span className="font-mono text-sm">₹50,000</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-sm">Incentive Pool Threshold</p>
              <p className="text-xs text-muted-foreground">Low balance alert</p>
            </div>
            <span className="font-mono text-sm">₹2,00,000</span>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Audit Logs</h2>
          <button className="text-sm text-primary font-medium hover:underline">View All</button>
        </div>
        <div className="space-y-2">
          {[
            { action: "Offer Created", user: "Arun Verma", time: "2 hrs ago", details: "Winter Bonus 2025" },
            { action: "Report Generated", user: "Arun Verma", time: "5 hrs ago", details: "Settlement Reconciliation" },
            { action: "Config Updated", user: "Super Admin", time: "1 day ago", details: "Incentive pool threshold" },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium text-sm">{log.action}</p>
                <p className="text-xs text-muted-foreground">{log.details} • by {log.user}</p>
              </div>
              <span className="text-xs text-muted-foreground">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          {[
            { label: "Settlement Alerts", desc: "Failed or delayed settlements", enabled: true },
            { label: "Low Balance Alerts", desc: "Incentive pool below threshold", enabled: true },
            { label: "New FO Registration", desc: "When new FOs are onboarded", enabled: false },
            { label: "Daily Summary", desc: "End of day operations summary", enabled: true },
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <button className={`w-12 h-6 rounded-full transition-colors ${pref.enabled ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${pref.enabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
