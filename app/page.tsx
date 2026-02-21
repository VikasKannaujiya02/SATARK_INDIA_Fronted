"use client"

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

function AppContent() {
  const { isDark, activeTab, isElderly } = useApp()

  return (
    <div
      className={cn(
        isDark ? "dark" : "",
        "min-h-dvh bg-background transition-colors duration-300"
      )}
    >
      <div
        className={cn(
          "flex flex-col min-h-dvh max-w-md mx-auto",
          isElderly ? "text-lg" : "text-base"
        )}
      >
        <GlobalHeader />

        <main className="flex-1 overflow-y-auto">
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
