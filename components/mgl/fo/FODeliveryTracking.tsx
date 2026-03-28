"use client"

import { MapPin, Calendar, Truck } from "lucide-react"

export default function FODeliveryTracking({ onViewChange }: { onViewChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Track Card Delivery</h1>
        <p className="text-sm text-muted-foreground">Monitor the status of your card deliveries</p>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <input type="text" placeholder="Search by tracking ID or vehicle..." className="flex-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <select className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option>All Status</option>
          <option>In Transit</option>
          <option>Delivered</option>
          <option>Failed</option>
        </select>
      </div>

      {/* Deliveries List */}
      <div className="space-y-3">
        {[
          { vehicle: "MH12AB1234", card: "****4521", status: "Delivered", date: "Mar 21, 2026" },
          { vehicle: "MH12CD5678", card: "****4522", status: "In Transit", date: "Mar 25, 2026" },
        ].map((delivery, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{delivery.vehicle}</p>
                  <p className="text-xs text-muted-foreground">Card: {delivery.card}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                delivery.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : delivery.status === "In Transit"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {delivery.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{delivery.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
