"use client"

import { useState } from "react"
import { Truck, CheckCircle, Users, AlertTriangle, Eye } from "lucide-react"
import { RightTray, TraySection, TrayRow } from "@/components/mgl/shared"
import { VehicleStatusBadge } from "@/components/mgl/shared"
import { FilterPanel, FilterField, FilterSelect, FilterActions } from "@/components/mgl/shared"
import { PageHeader } from "@/components/mgl/shared"

export default function AdminVehicles() {
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [foFilter, setFoFilter] = useState("all")
  const [fuelFilter, setFuelFilter] = useState("all")

  const vehicles = [
    { id: "MH12AB1234", fo: "ABC Logistics", foId: "FO-2026-0088", driver: "Ramesh Kumar", driverMobile: "+91 98765 43210", fuel: "CNG", card: "****4521", cardStatus: "Active", status: "Active", lastTxn: "Mar 23 2026", lastTxnAmt: "₹2,450", txnCount: 127, regDate: "Jan 15 2026", approval: "Approved" },
    { id: "MH12CD5678", fo: "Metro Freight", foId: "FO-2026-0091", driver: "Suresh Patil", driverMobile: "+91 98765 43211", fuel: "CNG", card: "****4522", cardStatus: "Active", status: "Active", lastTxn: "Mar 22 2026", lastTxnAmt: "₹3,100", txnCount: 94, regDate: "Feb 10 2026", approval: "Approved" },
    { id: "KA05XY5678", fo: "Metro Freight", foId: "FO-2026-0091", driver: "Vikram Singh", driverMobile: "+91 98765 43212", fuel: "CNG", card: "****3175", cardStatus: "Active", status: "Active", lastTxn: "Mar 23 2026", lastTxnAmt: "₹1,890", txnCount: 156, regDate: "Jan 22 2026", approval: "Approved" },
    { id: "DL08CD9012", fo: "Urban Transport", foId: "FO-2026-0150", driver: "Amit Sharma", driverMobile: "+91 98765 43213", fuel: "CNG", card: "****2891", cardStatus: "Inactive", status: "Approval Pending", lastTxn: "Mar 20 2026", lastTxnAmt: "₹1,200", txnCount: 45, regDate: "Mar 01 2026", approval: "Approved" },
    { id: "TN03EF3456", fo: "City Express", foId: "FO-2026-0201", driver: "Rajan Kumar", driverMobile: "+91 98765 43214", fuel: "CNG", card: "****1654", cardStatus: "Active", status: "Active", lastTxn: "Mar 23 2026", lastTxnAmt: "₹2,750", txnCount: 89, regDate: "Feb 28 2026", approval: "Approved" },
    { id: "MH47BY2770", fo: "ABC Logistics", foId: "FO-2026-0088", driver: "Deepak Nair", driverMobile: "+91 98765 43215", fuel: "CNG", card: "****1138", cardStatus: "Active", status: "Active", lastTxn: "Mar 23 2026", lastTxnAmt: "₹2,100", txnCount: 203, regDate: "Jan 05 2026", approval: "Approved" },
    { id: "MH47BY1688", fo: "ABC Logistics", foId: "FO-2026-0088", driver: "Pradeep Rao", driverMobile: "+91 98765 43216", fuel: "CNG", card: "****3175", cardStatus: "Blocked", status: "Under Review", lastTxn: "Mar 21 2026", lastTxnAmt: "₹1,650", txnCount: 112, regDate: "Jan 28 2026", approval: "Approved" },
    { id: "KA09ZZ0021", fo: "Quick Move", foId: "FO-2026-0315", driver: "Sunil Mehta", driverMobile: "+91 98765 43217", fuel: "CNG", card: "****9901", cardStatus: "Active", status: "Approval Pending", lastTxn: "Mar 18 2026", lastTxnAmt: "₹890", txnCount: 12, regDate: "Mar 15 2026", approval: "Pending Approval" },
  ]

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      Active: "bg-green-100 text-green-700",
      "Approval Pending": "bg-amber-100 text-amber-700",
      "Under Review": "bg-blue-100 text-blue-700",
      Rejected: "bg-red-100 text-red-700",
    }
    return map[status] || "bg-gray-100 text-gray-700"
  }

  const filteredVehicles = vehicles.filter(v => 
    (searchTerm === "" || v.id.toLowerCase().includes(searchTerm.toLowerCase()) || v.driver.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "all" || v.status === statusFilter) &&
    (foFilter === "all" || v.fo === foFilter) &&
    (fuelFilter === "all" || v.fuel === fuelFilter)
  )

  const summaryCards = [
    { label: "Total Vehicles", value: "3,200", icon: Truck, iconBg: "bg-gray-100", iconColor: "text-gray-600" },
    { label: "Active", value: "2,654", icon: CheckCircle, iconBg: "bg-green-100", iconColor: "text-green-600" },
    { label: "Drivers", value: "2,847", icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Pending Approval", value: "45", icon: AlertTriangle, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Vehicles"
        subtitle="View and manage all registered vehicles"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between">
                <div className={`${card.iconBg} rounded-lg p-2`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search & Filters */}
      <FilterPanel
        searchPlaceholder="Search by vehicle number, FO or driver..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilterCount={[statusFilter, foFilter, fuelFilter].filter(f => f !== "all").length}
      >
        <FilterField label="Status">
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[
            { label: "All", value: "all" },
            { label: "Active", value: "Active" },
            { label: "Approval Pending", value: "Approval Pending" },
            { label: "Under Review", value: "Under Review" },
            { label: "Rejected", value: "Rejected" },
          ]} />
        </FilterField>
        <FilterField label="Fuel Type">
          <FilterSelect value={fuelFilter} onChange={setFuelFilter} options={[
            { label: "All", value: "all" },
            { label: "CNG", value: "CNG" },
            { label: "Diesel", value: "Diesel" },
            { label: "Electric", value: "Electric" },
          ]} />
        </FilterField>
        <FilterActions onClear={() => { setStatusFilter("all"); setFuelFilter("all"); setSearchTerm("") }} onApply={() => {}} />
      </FilterPanel>

      {/* Vehicles Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left font-semibold">Vehicle No</th>
              <th className="px-4 py-3 text-left font-semibold">FO Name</th>
              <th className="px-4 py-3 text-left font-semibold">Driver</th>
              <th className="px-4 py-3 text-left font-semibold">Fuel Type</th>
              <th className="px-4 py-3 text-left font-semibold">Card Number</th>
              <th className="px-4 py-3 text-left font-semibold">Card Status</th>
              <th className="px-4 py-3 text-left font-semibold">Vehicle Status</th>
              <th className="px-4 py-3 text-left font-semibold">Last Transaction</th>
              <th className="px-4 py-3 text-center font-semibold sticky right-0 bg-muted/30">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredVehicles.map(v => (
              <tr key={v.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-mono font-medium">{v.id}</td>
                <td className="px-4 py-3">{v.fo}</td>
                <td className="px-4 py-3 text-sm">{v.driver}</td>
                <td className="px-4 py-3 text-sm">{v.fuel}</td>
                <td className="px-4 py-3 font-mono text-sm">{v.card}</td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge(v.cardStatus)}`}>{v.cardStatus}</span></td>
                <td className="px-4 py-3"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge(v.status)}`}>{v.status}</span></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{v.lastTxn}</td>
                <td className="px-4 py-3 text-center sticky right-0 bg-card"><button onClick={() => setSelectedEntity(v)} className="text-primary hover:underline text-xs font-medium"><Eye className="w-3.5 h-3.5 inline" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right Tray */}
      <RightTray
        open={!!selectedEntity}
        onClose={() => setSelectedEntity(null)}
        title={selectedEntity?.id ?? ""}
        subtitle={selectedEntity?.fo}
      >
        {selectedEntity && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <VehicleStatusBadge status={selectedEntity.status.toLowerCase().replace(" ", "-") as any} />
              <VehicleStatusBadge status={selectedEntity.cardStatus.toLowerCase() as any} />
            </div>
            <TraySection title="Vehicle Details">
              <TrayRow label="Vehicle Number" value={selectedEntity.id} mono />
              <TrayRow label="FO ID" value={selectedEntity.foId} mono />
              <TrayRow label="Fuel Type" value={selectedEntity.fuel} />
              <TrayRow label="Registration Date" value={selectedEntity.regDate} />
            </TraySection>
            <TraySection title="Driver">
              <TrayRow label="Driver Name" value={selectedEntity.driver || "—"} />
              <TrayRow label="Mobile" value={selectedEntity.driverMobile} />
            </TraySection>
            <TraySection title="Card Details">
              <TrayRow label="Card Number" value={selectedEntity.card} mono />
              <TrayRow label="Card Status" value={selectedEntity.cardStatus} />
              <TrayRow label="Wallet Balance" value="₹5,200" />
            </TraySection>
            <TraySection title="Transaction Summary">
              <TrayRow label="Last Transaction" value={selectedEntity.lastTxn} />
              <TrayRow label="Amount" value={selectedEntity.lastTxnAmt} />
              <TrayRow label="Total Transactions" value={selectedEntity.txnCount} />
            </TraySection>
            <TraySection title="Approval Status">
              <TrayRow label="Status" value={selectedEntity.approval} />
            </TraySection>
          </>
        )}
      </RightTray>
    </div>
  )
}
