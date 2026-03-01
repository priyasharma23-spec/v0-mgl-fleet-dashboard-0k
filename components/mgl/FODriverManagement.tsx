"use client";
import { useState, useMemo } from "react";
import { Users, Plus, Search, Edit2, Trash2, Eye, Phone, Mail, Badge, TrendingUp } from "lucide-react";

export default function FODriverManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [drivers, setDrivers] = useState([
    { id: 1, name: "Rajesh Kumar", licenseNo: "DL-2019-1234567", phone: "+91 9876543210", email: "rajesh@email.com", vehicles: 5, status: "Active", joiningDate: "2022-03-15" },
    { id: 2, name: "Priya Sharma", licenseNo: "MH-2021-7654321", phone: "+91 9123456789", email: "priya@email.com", vehicles: 3, status: "Active", joiningDate: "2023-06-20" },
    { id: 3, name: "Amit Patel", licenseNo: "GJ-2020-5555555", phone: "+91 8765432109", email: "amit@email.com", vehicles: 2, status: "Inactive", joiningDate: "2021-11-10" },
    { id: 4, name: "Neha Singh", licenseNo: "HR-2022-9999999", phone: "+91 7654321098", email: "neha@email.com", vehicles: 4, status: "Active", joiningDate: "2023-01-05" }
  ]);

  const filtered = useMemo(() => {
    return drivers.filter(d => 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.licenseNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, drivers]);

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Driver Management</h1>
          <p className="text-muted-foreground mt-1">Manage your fleet drivers and their assignments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Driver
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Total Drivers</p>
          <p className="text-2xl font-bold text-foreground mt-1">{drivers.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Active Drivers</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{drivers.filter(d => d.status === "Active").length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Assigned Vehicles</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{drivers.reduce((sum, d) => sum + d.vehicles, 0)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Avg. Rating</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">4.8★</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by driver name or license number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Drivers Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Driver Name</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">License No.</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Contact</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Vehicles</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((driver) => (
              <tr key={driver.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{driver.name}</p>
                  <p className="text-xs text-muted-foreground">Joined {new Date(driver.joiningDate).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{driver.licenseNo}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <a href={`tel:${driver.phone}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {driver.phone}
                    </a>
                    <a href={`mailto:${driver.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {driver.email}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-blue-600 font-semibold">
                    <TrendingUp className="w-4 h-4" /> {driver.vehicles}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded font-medium ${driver.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {driver.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
