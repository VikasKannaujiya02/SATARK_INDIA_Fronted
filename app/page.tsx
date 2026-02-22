"use client"

import { useState, useLayoutEffect, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { AppProvider, useApp } from "@/components/satark/app-context"
import { GlobalHeader } from "@/components/satark/global-header"
import { BottomNav } from "@/components/satark/bottom-nav"
import { TabShield } from "@/components/satark/tab-shield"
import { TabInvestigator } from "@/components/satark/tab-investigator"
import { TabOffense } from "@/components/satark/tab-offense"
import { TabNetwork } from "@/components/satark/tab-network"
import { TabRecovery } from "@/components/satark/tab-recovery"
import { TabTrust } from "@/components/satark/tab-trust"
import { cn } from "@/lib/utils"
import { initNotifications } from "@/lib/notifications"
import { Lock } from "lucide-react"

function AppContent() {
  const { isDark, activeTab, isElderly } = useApp()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [biometricLocked, setBiometricLocked] = useState(false)

  useLayoutEffect(() => {
    const token = localStorage.getItem("satark_token")
    if (!token) {
      localStorage.removeItem("user")
      router.replace("/login")
      return
    }
    setIsAuthorized(true)
  }, [router])

  useEffect(() => {
    if (!isAuthorized || typeof window === "undefined") return
    initNotifications()
  }, [isAuthorized])

  useEffect(() => {
    if (!isAuthorized || biometricLocked) return
    const Cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
    if (!Cap?.isNativePlatform?.()) return
    let cancelled = false
    import("@aparajita/capacitor-biometric-auth")
      .then(({ BiometricAuth }) => BiometricAuth.checkBiometry())
      .then(({ isAvailable }) => {
        if (cancelled || !isAvailable) return
        return import("@aparajita/capacitor-biometric-auth").then(({ BiometricAuth }) =>
          BiometricAuth.authenticate({
            reason: "Unlock Satark India",
            cancelTitle: "Cancel",
            allowDeviceCredential: true,
          })
        )
      })
      .then(() => { if (!cancelled) setBiometricLocked(false) })
      .catch(() => { if (!cancelled) setBiometricLocked(true) })
    return () => { cancelled = true }
  }, [isAuthorized])

  const handleBiometricRetry = () => {
    const Cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
    if (!Cap?.isNativePlatform?.()) return
    import("@aparajita/capacitor-biometric-auth")
      .then(({ BiometricAuth }) =>
        BiometricAuth.authenticate({
          reason: "Unlock Satark India",
          cancelTitle: "Cancel",
          allowDeviceCredential: true,
        })
      )
      .then(() => setBiometricLocked(false))
      .catch(() => setBiometricLocked(true))
  }

  if (!isAuthorized) {
    return <div className="min-h-screen bg-slate-950" />
  }

  if (biometricLocked) {
    return (
      <div className="min-h-dvh bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Authentication Required</h1>
          <p className="text-slate-400 text-sm">Unlock Satark India with your device biometrics.</p>
          <button
            onClick={handleBiometricRetry}
            className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(isDark ? "dark" : "", "min-h-dvh bg-background transition-colors duration-300")}>
      <div className={cn("flex flex-col min-h-dvh max-w-md mx-auto h-screen overflow-hidden bg-slate-50 dark:bg-background shadow-2xl relative", isElderly ? "text-lg" : "text-base")}>
        <GlobalHeader />
        
        <main className="flex-1 overflow-y-auto pb-32 scrollbar-hide">
          {activeTab === "shield" && <TabShield />}
          {activeTab === "investigator" && <TabInvestigator />}
          {activeTab === "offense" && <TabOffense />}
          {activeTab === "network" && <TabNetwork />}
          {activeTab === "recovery" && <TabRecovery />}
          {activeTab === "trust" && <TabTrust />}
        </main>

        <BottomNav />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}