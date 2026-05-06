"use client"
import { User, Shield, Building2, MapPin, Calendar } from "lucide-react"

interface Props {
  user: {
    name: string
    role: string
    department?: string
  }
  roleLabel: string
  zone?: string
  region?: string
}

export default function UserProfileView({ 
  user, roleLabel, zone, region 
}: Props) {
  return (
    <div className="flex flex-col gap-5 p-5 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Account details and information
        </p>
      </div>

      {/* Avatar + name */}
      <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-primary">
            {user.name.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
            <Shield className="w-3 h-3" />
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Account Information
          </p>
        </div>
        <div className="divide-y divide-border">
          {[
            { icon: User, label: "Full Name", value: user.name },
            { icon: Shield, label: "Role", value: roleLabel },
            { icon: Building2, label: "Department", value: user.department || "MGL Operations" },
            ...(zone ? [{ icon: MapPin, label: "Zone", value: zone }] : []),
            ...(region ? [{ icon: MapPin, label: "Region", value: region }] : []),
            { icon: Calendar, label: "Member Since", value: "January 2025" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-4 h-4" />
                {label}
              </div>
              <span className="font-medium text-foreground text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Read only notice */}
      <p className="text-xs text-muted-foreground text-center">
        To update your profile details, contact your MGL administrator.
      </p>
    </div>
  )
}
