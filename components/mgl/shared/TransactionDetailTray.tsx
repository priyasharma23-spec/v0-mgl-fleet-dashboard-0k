"use client"
import { X } from "lucide-react"
import CashbackDetails from "./CashbackDetails"

export interface TransactionRecord {
  id: string
  date: string
  time?: string
  type?: "Debit" | "Credit" | "debit" | "credit"
  channel: "pos" | "load"
  amount: string | number
  status: "Successful" | "Failed" | "Pending"
  paymentMethod?: string
  station?: string
  stationType?: "COCO" | "DODO" | "MGL Tej"
  merchantCode?: string
  vehicle?: string
  card?: string
  driver?: string
  product?: string
  source?: string
  utr?: string
  openingBalance?: string | number
  closingBalance?: string | number
  cardWalletDebit?: string | number
  incentiveWalletDebit?: string | number
  cashbackEligible?: boolean
  cashbackPercent?: number
  cashbackAmount?: string | number
  cashbackStatus?: "Credited" | "Pending" | "Failed"
  cashbackReason?: string
  reversedBy?: string
  reversalOf?: string
}

interface Props {
  transaction: TransactionRecord
  onClose: () => void
  role?: "admin" | "fo" | "finance" | "mic" | "zic"
}

function formatAmount(val?: string | number) {
  if (!val && val !== 0) return "—"
  if (typeof val === "number") return `₹${val.toLocaleString("en-IN")}`
  return val.startsWith("₹") ? val : `₹${val}`
}

export default function TransactionDetailTray({ transaction: txn, onClose, role = "fo" }: Props) {
  const totalDebit = Number(txn.cardWalletDebit || 0) + Number(txn.incentiveWalletDebit || 0)

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-96 bg-card border-l border-border shadow-xl z-50 overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Transaction Details</h2>
            <p className="text-xs text-muted-foreground font-mono">{txn.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              txn.status === "Successful" ? "bg-green-100 text-green-700" :
              txn.status === "Failed" ? "bg-red-100 text-red-700" :
              "bg-amber-100 text-amber-700"
            }`}>{txn.status}</span>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">

          {/* Transaction Info */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transaction Info</p>
            {[
              ["TXN ID", txn.id],
              ["Date", txn.date],
              txn.time ? ["Time", txn.time] : null,
              ["Type", typeof txn.type === "string" ? txn.type.charAt(0).toUpperCase() + txn.type.slice(1) : "—"],
              ["Channel", txn.channel === "pos" ? "POS" : "Load"],
              txn.paymentMethod ? ["Payment Method", txn.paymentMethod] : null,
              txn.product ? ["Product", txn.product.toUpperCase()] : null,
              ["Amount", formatAmount(txn.amount)],
              txn.openingBalance !== undefined ? ["Opening Balance", formatAmount(txn.openingBalance)] : null,
              txn.closingBalance !== undefined ? ["Closing Balance", formatAmount(txn.closingBalance)] : null,
            ].filter(Boolean).map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>

          {/* Station Info — POS only */}
          {txn.channel === "pos" && (txn.station || txn.merchantCode || txn.vehicle) && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Station Info</p>
              {[
                txn.station ? ["Station", txn.station] : null,
                txn.stationType ? ["Station Type", txn.stationType] : null,
                txn.merchantCode ? ["Merchant Code", txn.merchantCode] : null,
                txn.vehicle ? ["Vehicle", txn.vehicle] : null,
                txn.card ? ["Card", txn.card] : null,
                txn.driver ? ["Driver", txn.driver] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Load Info — Load only */}
          {txn.channel === "load" && (txn.source || txn.utr) && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Load Info</p>
              {[
                txn.source ? ["Source", txn.source] : null,
                txn.utr ? ["UTR / Reference", txn.utr] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Wallet Debit — POS only */}
          {txn.channel === "pos" && (txn.cardWalletDebit !== undefined || txn.incentiveWalletDebit !== undefined) && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wallet Debit</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Card Wallet</span>
                <span className="font-medium text-red-600">-₹{Number(txn.cardWalletDebit || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Incentive Wallet</span>
                <span className="font-medium text-red-600">-₹{Number(txn.incentiveWalletDebit || 0).toLocaleString("en-IN")}</span>
              </div>
              {totalDebit > 0 && (
                <div className="pt-2 border-t border-border flex items-center justify-between text-sm font-semibold">
                  <span className="text-foreground">Total Debited</span>
                  <span className="text-red-600">-₹{totalDebit.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>
          )}

          {/* Cashback — POS only */}
          {txn.channel === "pos" && (
            <CashbackDetails data={{
              cashbackEligible: txn.cashbackEligible ?? false,
              cashbackPercent: txn.cashbackPercent,
              cashbackAmount: txn.cashbackAmount?.toString(),
              cashbackStatus: txn.cashbackStatus,
              cashbackReason: txn.cashbackReason,
            }} />
          )}

          {/* Reversal info — admin only */}
          {(txn.reversedBy || txn.reversalOf) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Reversal Info</p>
              {txn.reversedBy && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reversed By</span>
                  <span className="font-medium text-foreground font-mono text-xs">{txn.reversedBy}</span>
                </div>
              )}
              {txn.reversalOf && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reversal Of</span>
                  <span className="font-medium text-foreground font-mono text-xs">{txn.reversalOf}</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
