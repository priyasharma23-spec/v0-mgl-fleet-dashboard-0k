"use client";
import { useState, useMemo } from "react";
import { Download, Search, Filter, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";

export default function FOTransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [transactions] = useState([
    { id: 1, type: "credit", desc: "Fund Loading", amount: 50000, date: "2024-03-01", time: "10:30", status: "Success", reference: "TXN001" },
    { id: 2, type: "debit", desc: "Fuel Purchase - Vehicle MH01AB1234", amount: 2500, date: "2024-03-01", time: "09:15", status: "Success", reference: "TXN002" },
    { id: 3, type: "debit", desc: "Fuel Purchase - Vehicle MH02CD5678", amount: 1800, date: "2024-02-29", time: "15:45", status: "Success", reference: "TXN003" },
    { id: 4, type: "credit", desc: "Incentive Credited - Weekly Bonus", amount: 5000, date: "2024-02-28", time: "08:00", status: "Success", reference: "TXN004" },
    { id: 5, type: "debit", desc: "Fuel Purchase - Vehicle MH03EF9012", amount: 3200, date: "2024-02-27", time: "14:20", status: "Success", reference: "TXN005" },
  ]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.reference.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === "all" || t.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterType, transactions]);

  const stats = useMemo(() => {
    const totalCredit = transactions.filter(t => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = transactions.filter(t => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);
    return { totalCredit, totalDebit, net: totalCredit - totalDebit };
  }, [transactions]);

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
        <p className="text-muted-foreground mt-1">View all your transactions and settlement details</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Credits</p>
              <p className="text-2xl font-bold text-green-600 mt-1">₹{stats.totalCredit.toLocaleString()}</p>
            </div>
            <ArrowDownLeft className="w-8 h-8 text-green-600/20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Debits</p>
              <p className="text-2xl font-bold text-red-600 mt-1">₹{stats.totalDebit.toLocaleString()}</p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-red-600/20" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Net Balance</p>
              <p className={`text-2xl font-bold mt-1 ${stats.net > 0 ? "text-green-600" : "text-red-600"}`}>₹{stats.net.toLocaleString()}</p>
            </div>
            <TrendingUp className={`w-8 h-8 ${stats.net > 0 ? "text-green-600/20" : "text-red-600/20"}`} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="all">All Types</option>
          <option value="credit">Credits Only</option>
          <option value="debit">Debits Only</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        {filtered.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${txn.type === "credit" ? "bg-green-100" : "bg-red-100"}`}>
                {txn.type === "credit" ? (
                  <ArrowDownLeft className={`w-5 h-5 ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`} />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{txn.desc}</p>
                <p className="text-xs text-muted-foreground">{txn.date} at {txn.time} • {txn.reference}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                {txn.type === "credit" ? "+" : "-"}₹{txn.amount.toLocaleString()}
              </p>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">{txn.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
