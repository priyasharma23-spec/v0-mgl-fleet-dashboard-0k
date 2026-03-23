"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import type { UserRole } from "@/lib/mgl-data"

// Dynamic imports to avoid hydration issues
const LoginPage = dynamic(() => import("@/components/mgl/LoginPage"), { ssr: false })
const MICShell = dynamic(() => import("@/components/mgl/MICShell"), { ssr: false })
const ZICShell = dynamic(() => import("@/components/mgl/ZICShell"), { ssr: false })
const FleetOperatorShell = dynamic(() => import("@/components/mgl/FleetOperatorShell"), { ssr: false })
const MGLAdminShell = dynamic(() => import("@/components/mgl/MGLAdminShell"), { ssr: false })

// FO Onboarding type: MIC_ASSISTED (via activation link) or SELF_SERVICE (new registration)
export type FOOnboardingType = "MIC_ASSISTED" | "SELF_SERVICE"

// Activation token data (simulated from URL params)
export interface ActivationData {
  token: string
  foName: string
  registeredMobile: string
  email: string
  micName: string
}

export default function Page() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(null)
  const [foOnboardingType, setFoOnboardingType] = useState<FOOnboardingType | null>(null)
  const [activationData, setActivationData] = useState<ActivationData | null>(null)
  const [showRegistration, setShowRegistration] = useState(false)

  // Check for activation token in URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const token = params.get("token")
      
      if (token) {
        // Simulate fetching activation data from token
        // In production, this would be an API call
        setActivationData({
          token,
          foName: "ABC Logistics Pvt. Ltd.",
          registeredMobile: "9876543210",
          email: "admin@abclogistics.com",
          micName: "Rajesh Sharma (MIC)"
        })
      }
    }
  }, [])

  function handleLogin(selectedRole: UserRole, name: string, onboardingType?: FOOnboardingType) {
    setRole(selectedRole)
    setUser({ name, role: selectedRole })
    if (selectedRole === "fleet-operator" && onboardingType) {
      setFoOnboardingType(onboardingType)
    }
  }

  function handleLogout() {
    setRole(null)
    setUser(null)
    setFoOnboardingType(null)
    setActivationData(null)
    setShowRegistration(false)
    // Clear URL params
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", window.location.pathname)
    }
  }

  function handleStartRegistration() {
    setShowRegistration(true)
    setFoOnboardingType("SELF_SERVICE")
    setRole("fleet-operator")
    setUser({ name: "New User", role: "fleet-operator" })
  }

  if (!role || !user) {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        activationData={activationData}
        showRegistration={showRegistration}
        onStartRegistration={handleStartRegistration}
      />
    )
  }
  
  if (role === "mgl-admin") return <MGLAdminShell user={{ name: user.name, role: "mgl-admin" }} onLogout={handleLogout} />
  if (role === "mic") return <MICShell user={{ name: user.name, role: "mic" }} onLogout={handleLogout} />
  if (role === "zic") return <ZICShell user={{ name: user.name, role: "zic" }} onLogout={handleLogout} />
  
  return (
    <FleetOperatorShell 
      user={{ name: user.name, role: "fleet-operator" }} 
      onLogout={handleLogout}
      onboardingType={foOnboardingType || "SELF_SERVICE"}
      isNewRegistration={showRegistration && foOnboardingType === "SELF_SERVICE"}
    />
  )
}

