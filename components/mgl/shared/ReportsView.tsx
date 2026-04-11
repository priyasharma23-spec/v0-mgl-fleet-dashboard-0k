"use client"
import { useState } from "react"
import { Download, FileText, Clock, CheckCircle, AlertCircle, ChevronDown } from "lucide-react"

export type ReportRole = "admin" | "finance" | "mic" | "zic" | "fo"

interface ReportTemplate {
  id: string
  name: string
  desc: string
  format: "Excel" | "PDF" | "CSV"
  roles: ReportRole[]
}

const ALL_REPORT_TEMPLATES: ReportTemplate[] = [
  { id: "fo-balance", name: "FO Balance Summary", desc: "Parent wallet and card balances by FO", format: "Excel", roles: ["admin", "finance"] },
  { id: "settlement", name: "Settlement Reconciliation", desc: "Daily T+1 settlement report", format: "Excel", roles: ["admin", "finance"] },
  { id: "incentive", name: "Incentive Program Report", desc: "Offer performance and redemptions", format: "PDF", roles: ["admin", "finance", "mic"] },
  { id: "card-issuance", name: "Card Issuance Report", desc: "New cards issued by region and FO", format: "Excel", roles: ["admin", "mic", "zic"] },
  { id: "txn-ledger", name: "Transaction Ledger", desc: "Complete transaction history", format: "CSV", roles: ["admin", "finance", "fo"] },
  { id: "vehicle-status", name: "Vehicle Status Report", desc: "All vehicles and approval status", format: "Excel", roles: ["admin", "mic", "zic", "fo"] },
  { id: "cashback", name: "Cashback Report", desc: "Cashback earned and credited per vehicle", format: "Excel", roles: ["admin", "finance", "fo"] },
  { id: "incentive-fo", name: "My Incentive Statement", desc: "Incentive credits and TDS details", format: "PDF", roles: ["fo"] },
  { id: "mou-compliance", name: "MOU Compliance Report", desc: "Vehicle commitment vs actual", format: "Excel", roles: ["admin", "mic"] },
  { id: "kyc-status", name: "KYC Status Report", desc: "FO KYC verification status", format: "Excel", roles: ["admin", "mic"] },
]

interface GeneratedReport {
  id: number
  name: string
  dateRange: string
  requestedAt: string
  status: "Preparing" | "Ready" | "Failed"
  format: string
  createdAt: number
}

interface Props {
  role?: ReportRole
  foId?: string
  title?: string
}

export default function ReportsView({ role = "admin", foId, title = "MIS & Reports" }: Props) {
  const [dateFrom, setDateFrom] = useState(new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0])
  const [selectedReportId, setSelectedReportId] = useState<string>("")
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [generating, setGenerating] = useState<string | null>(null)

  const visibleTemplates = ALL_REPORT_TEMPLATES.filter(t => t.roles.includes(role))
  const selectedTemplate = visibleTemplates.find(t => t.id === selectedReportId) || visibleTemplates[0]

  const handleGenerate = (template: ReportTemplate) => {
    setGenerating(template.id)
    const newReport: GeneratedReport = {
      id: Date.now(),
      name: template.name,
      dateRange: `${dateFrom} to ${dateTo}`,
      requestedAt: new Date().toLocaleString(),
      status: "Preparing",
      format: template.format,
      createdAt: Date.now(),
    }
    setGeneratedReports(prev => [newReport, ...prev])
    setTimeout(() => {
      setGeneratedReports(prev =>
        prev.map(r => r.id === newReport.id ? { ...r, status: "Ready" } : r)
      )
      setGenerating(null)
    }, 2000)
  }

  const getExpiryDate = (createdAt: number) =>
    new Date(createdAt + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">Generate and download reports</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Report Selection */}
        <div className="bg-card rounded-xl border border-border p-5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">Select Report</label>
          <div className="relative">
            <select value={selectedReportId || (visibleTemplates[0]?.id || "")} 
              onChange={e => setSelectedReportId(e.target.value)}
              className="w-full appearance-none px-4 py-3 pr-10 border border-border rounded-lg text-sm bg-card text-foreground font-medium cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30">
              {visibleTemplates.map(template => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          {selectedTemplate && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">{selectedTemplate.desc}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded">{selectedTemplate.format}</span>
              </div>
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="bg-card rounded-xl border border-border p-5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 block">Date Range</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">From</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">To</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          {selectedTemplate && (
            <button
              onClick={() => handleGenerate(selectedTemplate)}
              disabled={generating === selectedTemplate.id}
              className="w-full mt-4 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {generating === selectedTemplate.id ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Generate Report
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Generated Reports */}
      {generatedReports.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Generated Reports</p>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Report Name", "Date Range", "Requested", "Format", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {generatedReports.map(report => (
                  <tr key={report.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-sm">{report.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{report.dateRange}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{report.requestedAt}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] font-medium rounded">{report.format}</span>
                    </td>
                    <td className="px-4 py-3">
                      {report.status === "Ready" ? (
                        <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Ready
                        </span>
                      ) : report.status === "Failed" ? (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Clock className="w-3.5 h-3.5" /> Preparing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {report.status === "Ready" ? (
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                          <span className="text-xs text-muted-foreground">Expires {getExpiryDate(report.createdAt)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
