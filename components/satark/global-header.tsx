"use client"

import { Shield, Bell, WifiOff, Globe, Menu } from "lucide-react"
import { useApp } from "./app-context"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { SettingsDrawer } from "./settings-drawer"

export function GlobalHeader() {
  const { language, setLanguage, isElderly, showNoInternet, t } = useApp()
  const [notifCount] = useState(3)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      {/* No Internet Banner */}
      {showNoInternet && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white animate-in fade-in duration-200">
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span className={cn("font-semibold", isElderly ? "text-xs" : "text-[11px]")}>
            {t("No Internet: Satark India is operating in Offline TFLite Mode.", "इंटरनेट नहीं: सतर्क इंडिया ऑफलाइन TFLite मोड में चल रहा है।")}
          </span>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white dark:bg-card/80 backdrop-blur-2xl border-b border-slate-100 dark:border-border/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-4 h-12">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-primary">
              <Shield className="w-4 h-4 text-primary-foreground" fill="currentColor" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-[1.5px] border-card" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn("font-bold tracking-tight text-foreground", isElderly ? "text-base" : "text-sm")}>
                SATARK
              </span>
              <span className="text-[8px] font-mono font-bold text-muted-foreground tracking-widest">
                INDIA
              </span>
            </div>
          </div>

          {/* Right: Menu + Language + Bell */}
          <div className="flex items-center gap-1.5">
            {/* Settings / Profile Menu */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-secondary/80 hover:bg-secondary transition-colors"
              aria-label="Settings"
            >
              <Menu className="w-4 h-4 text-foreground" />
            </button>
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="flex items-center gap-1 h-8 px-2.5 rounded-xl bg-secondary/80 hover:bg-secondary transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-bold font-mono text-foreground">
                {language === "en" ? "EN" : "HI"}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-secondary/80 hover:bg-secondary transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-foreground" />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                  {notifCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
