"use client"

import { Shield, Bell, WifiOff, Globe } from "lucide-react"
import { useApp } from "./app-context"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function GlobalHeader() {
  const { language, setLanguage, isElderly, showNoInternet, t } = useApp()
  const [notifCount] = useState(3)

  return (
    <>
      {/* No Internet Banner */}
      {showNoInternet && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground">
          <WifiOff className="w-3.5 h-3.5" />
          <span className={cn("font-semibold", isElderly ? "text-xs" : "text-[11px]")}>
            {t("No internet connection. Running offline mode.", "इंटरनेट कनेक्शन नहीं है। ऑफलाइन मोड चालू है।")}
          </span>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-2xl border-b border-border/50">
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

          {/* Right: Language + Bell */}
          <div className="flex items-center gap-1.5">
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
    </>
  )
}
