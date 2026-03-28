"use client"

import { useState } from "react"
import { CreditCard, Lock, AlertCircle } from "lucide-react"

export default function FOCardsView({ onViewChange }: { onViewChange: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState<"vehicles" | "cards">("vehicles")

  return (
    <div className="flex flex-col gap-5 p-5 h-full">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Cards</h1>
        <p className="text-sm text-muted-foreground">Manage your fleet fuel cards and vehicle wallets</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "vehicles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Vehicle Card Wallets
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "cards"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          My Physical Cards
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        {activeTab === "vehicles" && (
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium text-foreground">No cards found</p>
            <p className="text-xs text-muted-foreground mt-1">Cards appear here after L2 approval</p>
          </div>
        )}

        {activeTab === "cards" && (
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <Lock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium text-foreground">Card Management</p>
            <p className="text-xs text-muted-foreground mt-1">Manage your active cards here</p>
          </div>
        )}
      </div>
    </div>
  )
}
