"use client";
import { Users, Search } from "lucide-react";
import { useState } from "react";
import { mockFleetOperators } from "@/lib/mgl-data";
import { FOStatusBadge } from "@/components/mgl/StatusBadge";

export default function MICOperatorsList({ onViewChange }: { onViewChange: (view: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = mockFleetOperators.filter((fo) =>
    fo.name.toLowerCase().includes(search.toLowerCase()) ||
    fo.pan.toLowerCase().includes(search.toLowerCase()) ||
    fo.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Fleet Operators</h1>
          <p className="text-sm text-muted-foreground">{mockFleetOperators.length} registered operators</p>
        </div>
        <button onClick={() => onViewChange("mic-register-fo")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
          + Register FO
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by name, PAN, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">FO Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">PAN</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicles</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((fo) => (
                <tr key={fo.id} className="hover:bg-muted/30 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {fo.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{fo.name}</p>
                        <p className="text-xs text-muted-foreground">{fo.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{fo.pan}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{fo.contactNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${fo.onboardingType === "MIC_ASSISTED" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                      {fo.onboardingType === "MIC_ASSISTED" ? "MIC-Assisted" : "Self-Service"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-foreground">{fo.totalVehicles}</span>
                    <span className="text-xs text-muted-foreground ml-1">({fo.activeCards} active)</span>
                  </td>
                  <td className="px-4 py-3">
                    <FOStatusBadge status={fo.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">{fo.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
