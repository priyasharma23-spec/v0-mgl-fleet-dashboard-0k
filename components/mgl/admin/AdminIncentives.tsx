"use client"

import { useState } from "react"
import { Pause, Edit3, X } from "lucide-react"

function CreateOfferModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Create New Offer</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Offer Name</label>
            <input type="text" placeholder="e.g., Summer Bonus 2026" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm">
                <option>Cashback %</option>
                <option>Flat Amount</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Value</label>
              <input type="text" placeholder="e.g., 5% or ₹500" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input type="date" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <input type="date" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Budget (MGL Funded)</label>
            <input type="text" placeholder="e.g., ₹10,00,000" className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-input text-sm" />
          </div>

          <div>
            <label className="text-sm font-medium">Eligible FOs</label>
            <select className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm">
              <option>All Active FOs</option>
              <option>Select Specific FOs</option>
              <option>FOs with 10+ vehicles</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted">
              Cancel
            </button>
            <button className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90">
              Create Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminIncentives({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<"active" | "draft" | "completed">("active")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const offers = [
    { id: "OFF001", name: "Winter Bonus 2025", type: "Cashback", value: "5%", status: "Live", startDate: "01 Dec 2025", endDate: "31 Jan 2026", redemptions: 1250, budget: "₹10L", spent: "₹4.2L" },
    { id: "OFF002", name: "New FO Welcome", type: "Flat", value: "₹500", status: "Live", startDate: "01 Jan 2025", endDate: "31 Mar 2025", redemptions: 45, budget: "₹2.5L", spent: "₹22,500" },
    { id: "OFF003", name: "Festival Special", type: "Cashback", value: "10%", status: "Completed", startDate: "15 Oct 2025", endDate: "15 Nov 2025", redemptions: 3200, budget: "₹15L", spent: "₹14.8L" },
  ]

  const filteredOffers = offers.filter(o => {
    if (activeTab === "active") return o.status === "Live"
    if (activeTab === "completed") return o.status === "Completed"
    return o.status === "Draft"
  })

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Incentives & Offers</h1>
          <p className="text-sm text-muted-foreground">Manage MGL-funded incentive campaigns</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          + Create Offer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {[
          { key: "active", label: "Active Offers" },
          { key: "draft", label: "Drafts" },
          { key: "completed", label: "Completed" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-card shadow-sm" : "hover:bg-card/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Offers List */}
      <div className="space-y-3">
        {filteredOffers.map((offer) => (
          <div key={offer.id} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{offer.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    offer.status === "Live" ? "bg-green-100 text-green-700" :
                    offer.status === "Draft" ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700"
                  }`}>{offer.status}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {offer.type} • {offer.value} • {offer.startDate} to {offer.endDate}
                </p>
              </div>
              <div className="flex gap-2">
                {offer.status === "Live" && (
                  <button className="p-2 border border-border rounded-lg hover:bg-muted">
                    <Pause className="w-4 h-4 text-amber-600" />
                  </button>
                )}
                <button className="p-2 border border-border rounded-lg hover:bg-muted">
                  <Edit3 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Redemptions</p>
                <p className="text-lg font-bold">{offer.redemptions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-lg font-bold">{offer.budget}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spent</p>
                <p className="text-lg font-bold text-green-600">{offer.spent}</p>
              </div>
            </div>

            <div className="mt-3 w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${(parseFloat(offer.spent.replace(/[₹L,]/g, "")) / parseFloat(offer.budget.replace(/[₹L,]/g, ""))) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Create Offer Modal */}
      {showCreateModal && (
        <CreateOfferModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}
