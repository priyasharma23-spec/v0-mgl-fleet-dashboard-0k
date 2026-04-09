"use client"
import { X } from "lucide-react"
import CashbackDetails from "./CashbackDetails"

export interface TransactionRecord {
  id: string
  date: string
  time?: string
  type?: "Debit" | "Credit" | "debit" | "credit"
  channel: "pos" | "load" | "allocation" | "incentive" | "debits"
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
  // Allocation fields
  allocatedAmount?: string
  availableBalance?: string
  allocatedBy?: string
  // Incentive fields
  creditType?: "Incentive" | "Cashback"
  grossAmount?: string
  tds?: string
  netAmount?: string
  creditedTo?: string
  incentiveType?: string
  // Debit fields
  debitType?: string
  debitedFrom?: string
  reference?: string
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
            <h2 className="font-semibold text-foreground">
              {txn.channel === "pos" ? "POS Transaction" :
               txn.channel === "load" ? "Load Details" :
               txn.channel === "allocation" ? "Allocation Details" :
               txn.channel === "incentive" ? "Incentive Details" :
               txn.channel === "debits" ? "Debit Details" :
               "Transaction Details"}
            </h2>
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

          {/* Amount hero */}
          <div className={`rounded-xl p-4 text-center ${txn.type === "Credit" || txn.type === "credit" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {txn.channel === "pos" ? "Amount Paid" :
               txn.channel === "load" ? "Amount Loaded" :
               txn.channel === "allocation" ? "Amount Allocated" :
               txn.channel === "incentive" ? "Net Incentive" :
               txn.channel === "debits" ? "Amount Debited" :
               "Amount"}
            </p>
            <p className={`text-3xl font-bold ${txn.type === "Credit" || txn.type === "credit" ? "text-green-700" : "text-red-600"}`}>
              {txn.type === "Credit" || txn.type === "credit" ? "+" : "-"}{formatAmount(txn.amount)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{txn.date}{txn.time ? ` · ${txn.time}` : ""}</p>
          </div>

          {/* Transaction Info */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transaction Info</p>
            {[
              ["TXN ID", txn.id],
              ["Type", typeof txn.type === "string" ? txn.type.charAt(0).toUpperCase() + txn.type.slice(1) : "—"],
              ["Channel", txn.channel === "pos" ? "POS" : "Load"],
              txn.paymentMethod ? ["Payment Method", txn.paymentMethod] : null,
              txn.vehicle ? ["Vehicle", txn.vehicle] : null,
              txn.card ? ["Card", txn.card] : null,
              txn.product ? ["Product", txn.product.toUpperCase()] : null,
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
                txn.driver ? ["Driver", txn.driver] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground font-mono text-xs">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Load Info */}
          {txn.channel === "load" && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Load Info</p>
              {[
                txn.source ? ["Source", txn.source] : null,
                txn.utr ? ["UTR / Reference", txn.utr] : null,
                txn.openingBalance !== undefined ? ["Opening Balance", formatAmount(txn.openingBalance)] : null,
                txn.closingBalance !== undefined ? ["Closing Balance", formatAmount(txn.closingBalance)] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Allocation Info */}
          {txn.channel === "allocation" && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Allocation Info</p>
              {[
                txn.vehicle ? ["Vehicle", txn.vehicle] : null,
                txn.card ? ["Card", txn.card] : null,
                txn.allocatedAmount ? ["Allocated Amount", txn.allocatedAmount] : null,
                txn.availableBalance ? ["Available Balance", txn.availableBalance] : null,
                txn.allocatedBy ? ["Allocated By", txn.allocatedBy] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Incentive Info */}
          {txn.channel === "incentive" && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Incentive Info</p>
              {[
                txn.creditType ? ["Credit Type", txn.creditType] : null,
                txn.vehicle ? ["Vehicle", txn.vehicle] : null,
                txn.incentiveType ? ["Program", txn.incentiveType] : null,
                txn.grossAmount ? ["Gross Amount", txn.grossAmount] : null,
                txn.tds ? ["TDS Deducted", txn.tds] : null,
                txn.netAmount ? ["Net Amount", txn.netAmount] : null,
                txn.creditedTo ? ["Credited To", txn.creditedTo] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`font-medium ${label === "TDS Deducted" ? "text-red-600" : label === "Net Amount" ? "text-green-700 font-bold" : "text-foreground"}`}>{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Debit Info */}
          {txn.channel === "debits" && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Debit Info</p>
              {[
                txn.debitType ? ["Debit Type", txn.debitType] : null,
                txn.debitedFrom ? ["Debited From", txn.debitedFrom] : null,
                txn.reference ? ["Reference", txn.reference] : null,
                txn.openingBalance !== undefined ? ["Opening Balance", formatAmount(txn.openingBalance)] : null,
                txn.closingBalance !== undefined ? ["Closing Balance", formatAmount(txn.closingBalance)] : null,
              ].filter(Boolean).map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Wallet Debit — POS only */}
          {txn.channel === "pos" && (txn.cardWalletDebit !== undefined || txn.incentiveWalletDebit !== undefined) && (
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Wallet Debit</p>

              {/* Opening Balance */}
              {txn.openingBalance !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Opening Balance</span>
                  <span className="font-medium text-foreground">{formatAmount(txn.openingBalance)}</span>
                </div>
              )}

              {/* Debit breakdown */}
              <div className="space-y-1.5 py-2 border-y border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Card Wallet</span>
                  <span className="font-medium text-red-600">-₹{Number(txn.cardWalletDebit || 0).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Incentive Wallet</span>
                  <span className="font-medium text-red-600">-₹{Number(txn.incentiveWalletDebit || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Total debited — prominent */}
              {totalDebit > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total Debited</span>
                  <span className="text-xl font-bold text-red-600">-₹{totalDebit.toLocaleString("en-IN")}</span>
                </div>
              )}

              {/* Closing Balance */}
              {txn.closingBalance !== undefined && (
                <div className="flex items-center justify-between text-sm pt-1 border-t border-border">
                  <span className="text-muted-foreground">Closing Balance</span>
                  <span className="font-medium text-foreground">{formatAmount(txn.closingBalance)}</span>
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
