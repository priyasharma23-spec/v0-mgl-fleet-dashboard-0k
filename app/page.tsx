"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import type { UserRole } from "@/lib/mgl-data"

// Dynamic imports to avoid hydration issues
const LoginPage = dynamic(() => import("@/components/mgl/LoginPage"), { ssr: false })
const MICShell = dynamic(() => import("@/components/mgl/MICShell"), { ssr: false })
const ZICShell = dynamic(() => import("@/components/mgl/ZICShell"), { ssr: false })
const FleetOperatorShell = dynamic(() => import("@/components/mgl/FleetOperatorShell"), { ssr: false })

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
