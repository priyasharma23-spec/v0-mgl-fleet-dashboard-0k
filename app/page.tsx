"use client"

import { useState } from "react"
import LoginPage from "@/components/mgl/LoginPage"
import MICShell from "@/components/mgl/MICShell"
import ZICShell from "@/components/mgl/ZICShell"
import FleetOperatorShell from "@/components/mgl/FleetOperatorShell"

export type Role = "mic" | "zic" | "fleet"

export default function Page() {
  const [role, setRole] = useState<Role | null>(null)
  const [user, setUser] = useState<{ name: string; role: Role } | null>(null)

  function handleLogin(selectedRole: Role, name: string) {
    setRole(selectedRole)
    setUser({ name, role: selectedRole })
  }

  function handleLogout() {
    setRole(null)
    setUser(null)
  }

  if (!role || !user) return <LoginPage onLogin={handleLogin} />
  if (role === "mic") return <MICShell user={user} onLogout={handleLogout} />
  if (role === "zic") return <ZICShell user={user} onLogout={handleLogout} />
  return <FleetOperatorShell user={user} onLogout={handleLogout} />
}
