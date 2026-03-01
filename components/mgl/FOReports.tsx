"use client";
import { useState } from "react";
import { Download, FileSpreadsheet, Calendar, Filter } from "lucide-react";

export default function FOReports() {
  const [reportType, setReportType] = useState("summary");

  const reports = [
    { name: "Monthly Summary Report", type: "summary", date: "2024-03-01", size: "2.5 MB" },
    { name: "Transaction Details - February 2024", type: "transactions", date: "2024-02-29", size: "1.8 MB" },
    { name: "Vehicle-wise Fuel Consumption", type: "vehicle", date: "2024-02-15", size: "3.2 MB" },
    { name: "Driver Performance Report", type: "driver", date: "2024-02-15", size: "1.2 MB" },
  ];

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Generate and download detailed reports</p>
      </div>

      {/* Report Generator */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Generate New Report</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="summary">Monthly Summary</option>
              <option value="transactions">Transaction Details</option>
              <option value="vehicle">Vehicle Performance</option>
              <option value="driver">Driver Analytics</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Month</label>
            <input
              type="month"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              defaultValue="2024-03"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Reports</h2>
        <div className="space-y-2">
          {reports.map((report, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
