"use client"

import { Shield, Search, Swords, Users, ShieldAlert, Settings } from "lucide-react"
import { useApp } from "./app-context"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "shield" as const, icon: Shield, label: "Shield" },
  { id: "investigator" as const, icon: Search, label: "Search" },
  { id: "offense" as const, icon: Swords, label: "Offense" },
  { id: "network" as const, icon: Users, label: "Network" },
  { id: "recovery" as const, icon: ShieldAlert, label: "SOS" },
  { id: "trust" as const, icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useApp()

  return (
    <nav
      className="sticky bottom-0 z-50 bg-card/90 backdrop-blur-2xl border-t border-border/50"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 flex-1 transition-colors duration-150",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-2xl transition-all duration-200",
                isActive && "bg-primary/15"
              )}>
                <Icon className="w-[18px] h-[18px]" fill={isActive ? "currentColor" : "none"} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              <span className={cn("text-[9px] font-semibold", isActive && "font-bold")}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
