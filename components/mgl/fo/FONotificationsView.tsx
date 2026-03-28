"use client"

import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function FONotificationsView({ onViewChange }: { onViewChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-5 p-5 h-full">
      <div>
        <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">Stay updated with your vehicle and card activities</p>
      </div>

      {/* Notification List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {[
          {
            type: "success",
            icon: CheckCircle,
            title: "L1 Approval Complete",
            message: "Vehicle MH12AB1234 has been approved by the dealer.",
            time: "2 hours ago",
            bg: "bg-green-50 border-green-200",
          },
          {
            type: "alert",
            icon: AlertCircle,
            title: "Card Delivery Failed",
            message: "Card delivery for MH12CD5678 was unsuccessful. Retry scheduled.",
            time: "5 hours ago",
            bg: "bg-red-50 border-red-200",
          },
          {
            type: "info",
            icon: Info,
            title: "New Card Issued",
            message: "Physical card for MH47BY2770 has been dispatched.",
            time: "1 day ago",
            bg: "bg-blue-50 border-blue-200",
          },
        ].map((notification, i) => {
          const Icon = notification.icon
          return (
            <div key={i} className={`bg-card rounded-xl border ${notification.bg} p-4`}>
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
