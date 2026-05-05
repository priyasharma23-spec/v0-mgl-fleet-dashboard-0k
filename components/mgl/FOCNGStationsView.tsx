"use client"
import { useState } from "react"
import { Search, MapPin, Copy, CheckCircle } from "lucide-react"
import { mockROStations } from "@/lib/mgl-data"

export default function FOCNGStationsView() {
  const [search, setSearch] = useState("")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const ownershipTypes = [
    { value: "all", label: "All" },
    { value: "MGL", label: "MGL" },
    { value: "MGL TEZ", label: "MGL TEZ" },
    { value: "OMC", label: "OMC" },
    { value: "Private", label: "Private" },
  ]

  const filtered = mockROStations.filter(ro => {
    const matchSearch = !search ||
      ro.name.toLowerCase().includes(search.toLowerCase()) ||
      ro.address.toLowerCase().includes(search.toLowerCase())
    const matchOwner = ownerFilter === "all" ||
      (ownerFilter === "OMC" ? ro.ownership.startsWith("OMC") : ro.ownership === ownerFilter)
    return matchSearch && matchOwner
  })

  const handleCopy = (ro: typeof mockROStations[0]) => {
    if (!ro.mapsLink) return
    navigator.clipboard.writeText(ro.mapsLink)
    setCopiedId(ro.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const ownershipBadge = (ownership: string) => {
    if (ownership === "MGL") return "bg-green-100 text-green-700"
    if (ownership === "MGL TEZ") return "bg-blue-100 text-blue-700"
    if (ownership.startsWith("OMC")) return "bg-amber-100 text-amber-700"
    return "bg-gray-100 text-gray-600"
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">CNG Stations</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} of {mockROStations.length} stations</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name or area..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ownershipTypes.map(o => (
            <button key={o.value} onClick={() => setOwnerFilter(o.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${ownerFilter === o.value ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50"}`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(ro => (
          <div key={ro.id} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm text-foreground">{ro.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ownershipBadge(ro.ownership)}`}>{ro.ownership}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{ro.address}</p>
              </div>
            </div>
            <button onClick={() => handleCopy(ro)} disabled={!ro.mapsLink} title="Copy Google Maps link"
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${!ro.mapsLink ? "opacity-30 cursor-not-allowed border-border text-muted-foreground" : copiedId === ro.id ? "bg-green-50 border-green-300 text-green-700" : "bg-card border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
              {copiedId === ro.id ? <><CheckCircle className="w-3.5 h-3.5" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy link</>}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No stations found</p>
          </div>
        )}
      </div>
    </div>
  )
}
