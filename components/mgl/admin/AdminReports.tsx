"use client"

import { useState } from "react"
import { Download, FileText } from "lucide-react"

export default function AdminReports() {
  const [reportType, setReportType] = useState("Transaction Report")
  const [foFilter, setFoFilter] = useState("All FOs")
  const [dateFrom, setDateFrom] = useState(new Date(Date.now() - 86400000).toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])
  const [generatedReports, setGeneratedReports] = useState<any[]>([])

  const reportTemplates = [
    { name: "FO Balance Summary", desc: "Parent wallet and card balances by FO", format: "Excel" },
    { name: "Settlement Reconciliation", desc: "Daily T+1 settlement report", format: "Excel" },
    { name: "Incentive Program Report", desc: "Offer performance and redemptions", format: "PDF" },
    { name: "Card Issuance Report", desc: "New cards issued by region and FO", format: "Excel" },
    { name: "Transaction Ledger", desc: "Complete transaction history", format: "CSV" },
  ]

  const handleGenerateReport = () => {
    const newReport = {
      id: Date.now(),
      reportType,
      fo: foFilter,
      dateRange: `${dateFrom} to ${dateTo}`,
      requestedAt: new Date().toLocaleString(),
      status: "Preparing",
      createdAt: Date.now(),
    }
    setGeneratedReports(prev => [...prev, newReport])

    setTimeout(() => {
      setGeneratedReports(prev =>
        prev.map(report =>
          report.id === newReport.id ? { ...report, status: "Ready" } : report
        )
      )
    }, 300000)
  }

  const getExpiryDate = (createdAt: number) => {
    const date = new Date(createdAt + 7 * 24 * 60 * 60 * 1000)
    return date.toLocaleDateString()
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">MIS & Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and download compliance and business reports</p>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTemplates.map((report, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{report.name}</h3>
                  <p className="text-xs text-muted-foreground">{report.desc}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{report.format}</span>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90">
                <Download className="w-3 h-3" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Report Builder */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold mb-4">Custom Report Builder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            >
              <option>Transaction Report</option>
              <option>Settlement Report</option>
              <option>Incentive Report</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Fleet Operator</label>
            <select
              value={foFilter}
              onChange={(e) => setFoFilter(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            >
              <option>All FOs</option>
              <option>ABC Logistics</option>
              <option>Metro Freight</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Generated Reports */}
      {generatedReports.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold mb-4">Generated Reports</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Report Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">FO</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Date Range</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Requested At</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Expires</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {generatedReports.map((report) => {
                    const requestDate = new Date(report.requestedAt)
                    const formattedDateRange = (() => {
                      const [from, to] = report.dateRange.split(' to ')
                      const fromDate = new Date(from)
                      const toDate = new Date(to)
                      return `${fromDate.getDate()} ${fromDate.toLocaleDateString('en-US', { month: 'short' })} ${fromDate.getFullYear()} → ${toDate.getDate()} ${toDate.toLocaleDateString('en-US', { month: 'short' })} ${toDate.getFullYear()}`
                    })()
                    const formattedRequestedAt = `${String(requestDate.getDate()).padStart(2, '0')}/${String(requestDate.getMonth() + 1).padStart(2, '0')}/${requestDate.getFullYear()} ${String(requestDate.getHours()).padStart(2, '0')}:${String(requestDate.getMinutes()).padStart(2, '0')}`
                    const expiryDate = new Date(report.createdAt + 7 * 24 * 60 * 60 * 1000)
                    const formattedExpiry = `${expiryDate.getDate()} ${expiryDate.toLocaleDateString('en-US', { month: 'short' })} ${expiryDate.getFullYear()}`

                    return (
                      <tr key={report.id} className="hover:bg-muted/50 h-12">
                        <td className="px-4 py-3 whitespace-nowrap">{report.reportType}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{report.fo}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formattedDateRange}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formattedRequestedAt}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                            report.status === "Preparing"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-green-50 text-green-700 border border-green-200"
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap">{formattedExpiry}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {report.status === "Ready" ? (
                            <button className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium">
                              <Download className="w-4 h-4" /> Download
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
