"use client"

export interface CashbackData {
  cashbackEligible: boolean
  cashbackPercent?: number
  cashbackAmount?: string
  cashbackStatus?: "Credited" | "Pending" | "Failed"
  cashbackReason?: string
}

export default function CashbackDetails({ data }: { data: CashbackData }) {
  if (!data) return null

  return (
    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cashback</p>
      {data.cashbackEligible ? (
        <>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cashback Rate</span>
            <span className="font-medium text-green-700">{data.cashbackPercent}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cashback Amount</span>
            <span className="font-bold text-green-700">+{data.cashbackAmount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              data.cashbackStatus === "Credited" ? "bg-green-100 text-green-700" :
              data.cashbackStatus === "Failed" ? "bg-red-100 text-red-700" :
              "bg-amber-100 text-amber-700"
            }`}>
              {data.cashbackStatus}
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[9px] font-bold text-gray-500">—</span>
          </div>
          <p className="text-xs text-muted-foreground">{data.cashbackReason || "Not eligible for cashback"}</p>
        </div>
      )}
    </div>
  )
}
