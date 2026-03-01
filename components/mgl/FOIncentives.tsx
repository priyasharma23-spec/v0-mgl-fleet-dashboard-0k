"use client";
import { useState } from "react";
import { Gift, Zap, Award, TrendingUp, Copy, CheckCircle } from "lucide-react";

export default function FOIncentives() {
  const [copied, setCopied] = useState<string | null>(null);

  const incentives = [
    { id: 1, name: "Weekly Fuel Bonus", desc: "Earn ₹500 every week on fuel purchases", amount: "₹500/week", status: "Active", badge: "Popular" },
    { id: 2, name: "Safety Reward", desc: "Get ₹1000 for zero violations per month", amount: "₹1000/month", status: "Active", badge: null },
    { id: 3, name: "Loyalty Cashback", desc: "5% cashback on all fuel purchases", amount: "5%", status: "Active", badge: null },
    { id: 4, name: "Referral Bonus", desc: "Earn ₹2000 for each driver referred", amount: "₹2000", status: "Upcoming", badge: null },
  ];

  const loyalty = [
    { name: "Points Balance", value: "12,450 pts", change: "+250 this month" },
    { name: "Tier Level", value: "Gold", change: "400 pts to Platinum" },
    { name: "Rewards Earned", value: "₹25,000", change: "Lifetime rewards" },
  ];

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Incentives & Loyalty</h1>
        <p className="text-muted-foreground mt-1">Earn rewards and maximize your benefits</p>
      </div>

      {/* Loyalty Stats */}
      <div className="grid grid-cols-3 gap-4">
        {loyalty.map((item, idx) => (
          <div key={idx} className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground">{item.name}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{item.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.change}</p>
          </div>
        ))}
      </div>

      {/* Active Incentives */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Incentives</h2>
        <div className="grid grid-cols-2 gap-4">
          {incentives.map((inc) => (
            <div key={inc.id} className={`border rounded-lg p-4 ${inc.status === "Active" ? "border-border" : "border-muted bg-muted/30"}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-foreground">{inc.name}</h3>
                </div>
                {inc.badge && (
                  <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded">
                    {inc.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{inc.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{inc.amount}</span>
                <span className={`text-xs px-2 py-1 rounded ${inc.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {inc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Program */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Referral Program
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Invite other fleet operators and earn ₹2000 per referral</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Your Referral Link</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded text-xs font-mono text-blue-700">
              https://mgl.com/ref/ABC12345
            </code>
            <button
              onClick={() => {
                setCopied("ref");
                setTimeout(() => setCopied(null), 2000);
              }}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              {copied === "ref" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied === "ref" ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <p className="font-medium mb-1">You've earned: ₹4,000 from 2 referrals</p>
          <p className="text-xs">Referrals: Rajesh Kumar (₹2000), Priya Logistics (₹2000)</p>
        </div>
      </div>
    </div>
  );
}
