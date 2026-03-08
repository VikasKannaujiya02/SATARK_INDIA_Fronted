"use client"

import { Shield, Bell, WifiOff, Globe, Menu, X } from "lucide-react"
import { useApp } from "./app-context"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { SettingsDrawer } from "./settings-drawer"
import toast from "react-hot-toast"

export function GlobalHeader() {
  const { language, setLanguage, isElderly, showNoInternet, t } = useApp()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const notifications = [
    { id: 1, message: "🛡️ Device security audit completed", time: "2 hours ago" },
    { id: 2, message: "✅ All family members are safe", time: "5 hours ago" },
    { id: 3, message: "⚠️ Suspicious SMS detected and blocked", time: "1 day ago" },
  ]

  const handleMarkAllRead = () => {
    toast.success(t("All notifications marked as read", "सभी सूचनाएं पढ़ी हुई चिह्नित की गई"))
    setNotifOpen(false)
  }

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

      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between px-4 h-12">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-600">
              <Shield className="w-4 h-4 text-white" fill="currentColor" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-[1.5px] border-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn("font-bold tracking-tight text-foreground dark:text-white", isElderly ? "text-base" : "text-sm")}>
                SATARK
              </span>
              <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest">
                INDIA
              </span>
            </div>
          </div>

          {/* Right: Menu + Language + Bell */}
          <div className="flex items-center gap-1.5 relative">
            {/* Settings / Profile Menu */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Settings"
            >
              <Menu className="w-4 h-4 text-foreground dark:text-white" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "hi" : "en")}
              className="flex items-center gap-1 h-8 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-slate-600 dark:text-slate-400" />
              <span className="text-[10px] font-bold font-mono text-foreground dark:text-white">
                {language === "en" ? "EN" : "HI"}
              </span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-foreground dark:text-white" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-[200]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-foreground dark:text-white">Alerts & Notifications</h3>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                          <p className="text-sm text-foreground dark:text-white font-medium">{notif.message}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                        No new notifications
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="w-full px-4 py-3 text-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-200 dark:border-slate-800 transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
