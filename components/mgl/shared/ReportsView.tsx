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
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    { id: 1, name: "Transaction Ledger", dateRange: "01/04/2026 to 12/04/2026", requestedAt: "12 Apr 2026, 2:30 PM", status: "Ready", format: "CSV", createdAt: Date.now() - 3600000 },
    { id: 2, name: "Cashback Report", dateRange: "01/04/2026 to 12/04/2026", requestedAt: "12 Apr 2026, 1:15 PM", status: "Ready", format: "Excel", createdAt: Date.now() - 7200000 },
  ])
  const [generating, setGenerating] = useState<string | null>(null)

  const visibleTemplates = ALL_REPORT_TEMPLATES.filter(t => t.roles.includes(role))
  const selectedTemplate = visibleTemplates.find(t => t.id === selectedReportId) || visibleTemplates[0]

  const handleGenerate = (template: ReportTemplate) => {
    setGenerating(template.id)
    const newReport: GeneratedReport = {
      id: Date.now(),
      name: template.name,
      dateRange: `${new Date(dateFrom).toLocaleDateString("en-IN")} to ${new Date(dateTo).toLocaleDateString("en-IN")}`,
      requestedAt: new Date().toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }),
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

  const handleDownload = (report: GeneratedReport) => {
    const element = document.createElement("a")
    element.setAttribute("href", `data:text/plain,${encodeURIComponent(JSON.stringify(report))}`)
    element.setAttribute("download", `${report.name.toLowerCase().replace(/\s+/g, "-")}-${report.dateRange.replace(/\s+/g, "")}.${report.format === "CSV" ? "csv" : report.format === "PDF" ? "pdf" : "xlsx"}`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const getExpiryDate = (createdAt: number) =>
    new Date(createdAt + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">Generate custom reports or download recent ones</p>
      </div>

      {/* Quick Download Section */}
      {generatedReports.filter(r => r.status === "Ready").length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Quick Download</h2>
            <span className="text-xs text-muted-foreground">{generatedReports.filter(r => r.status === "Ready").length} ready</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {generatedReports.filter(r => r.status === "Ready").slice(0, 4).map(report => (
              <div key={report.id} className="flex items-start justify-between p-3 bg-muted/30 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground line-clamp-1">{report.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{report.dateRange}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ready at {report.requestedAt}</p>
                </div>
                <button onClick={() => handleDownload(report)}
                  className="shrink-0 ml-3 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate New Report Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Generate New Report</h2>
        
        {/* Combined Form Container */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-5">
          {/* Report Selection */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">Select Report Type</label>
            <div className="relative">
              <select value={selectedReportId || (visibleTemplates[0]?.id || "")} 
                onChange={e => setSelectedReportId(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 border border-border rounded-lg text-sm bg-card text-foreground font-medium cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
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
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4 block">Select Date Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">From</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">To</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border"></div>

          {/* Generate Button */}
          {selectedTemplate && (
            <button
              onClick={() => handleGenerate(selectedTemplate)}
              disabled={generating === selectedTemplate.id}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              {generating === selectedTemplate.id ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" /> Preparing Report...
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

      {/* Recent Reports */}
      {generatedReports.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Report History</h2>
            <span className="text-xs text-muted-foreground">{generatedReports.length} total</span>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Report", "Date Range", "Requested", "Format", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {generatedReports.map(report => (
                  <tr key={report.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm text-foreground">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{report.dateRange}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{report.requestedAt}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-[10px] font-semibold rounded">{report.format}</span>
                    </td>
                    <td className="px-4 py-3">
                      {report.status === "Ready" ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-xs font-semibold text-green-700">Ready</span>
                        </div>
                      ) : report.status === "Failed" ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-xs font-semibold text-red-600">Failed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                          <span className="text-xs font-semibold text-amber-600">Preparing</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {report.status === "Ready" ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDownload(report)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                          <span className="text-[10px] text-muted-foreground">Exp: {getExpiryDate(report.createdAt)}</span>
                        </div>
                      ) : report.status === "Preparing" ? (
                        <span className="text-xs text-muted-foreground">Processing...</span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">Retry</span>
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
