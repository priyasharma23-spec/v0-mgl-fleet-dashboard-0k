"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import type { UserRole } from "@/lib/mgl-data"

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading MGL Fleet Platform...</p>
      </div>
    </div>
  )
}

// Dynamically import to avoid hydration issues with recharts
const LoginPage = dynamic(() => import("@/components/mgl/LoginPage"), { 
  ssr: false,
  loading: () => <LoadingScreen />
})
const MICShell = dynamic(() => import("@/components/mgl/MICShell"), { 
  ssr: false,
  loading: () => <LoadingScreen />
})
const ZICShell = dynamic(() => import("@/components/mgl/ZICShell"), { 
  ssr: false,
  loading: () => <LoadingScreen />
})
const FleetOperatorShell = dynamic(() => import("@/components/mgl/FleetOperatorShell"), { 
  ssr: false,
  loading: () => <LoadingScreen />
})

export default function Page() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(null)

  function handleLogin(selectedRole: UserRole, name: string) {
    setRole(selectedRole)
    setUser({ name, role: selectedRole })
  }

  function handleLogout() {
    setRole(null)
    setUser(null)
  }

  if (!role || !user) return <LoginPage onLogin={handleLogin} />
  if (role === "mic") return <MICShell user={{ name: user.name, role: "mic" }} onLogout={handleLogout} />
  if (role === "zic") return <ZICShell user={{ name: user.name, role: "zic" }} onLogout={handleLogout} />
  return <FleetOperatorShell user={{ name: user.name, role: "fleet-operator" }} onLogout={handleLogout} />
}
