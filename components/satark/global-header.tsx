"use client"

import { Shield, Bell, WifiOff, Globe, Menu, X, Zap, Database, Search } from "lucide-react"
import { useApp } from "./app-context"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { SettingsDrawer } from "./settings-drawer"
import toast from "react-hot-toast"

export function GlobalHeader() {
  const { t, isElderly } = useApp()
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: "New Security Patch", time: "2m ago", icon: Shield, color: "text-blue-500" },
    { id: 2, title: "UPI Attempt Blocked", time: "1h ago", icon: Zap, color: "text-amber-500" },
    { id: 3, title: "DB Sync Complete", time: "3h ago", icon: Database, color: "text-emerald-500" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto relative">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary" fill="currentColor" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-background animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-foreground leading-none">SATARK</h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-primary uppercase">India</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-secondary/50 border border-border hover:bg-secondary transition-all active:scale-[0.95]"
            >
              <Bell className="w-4 h-4 text-foreground" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-destructive rounded-full border border-background" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Alerts</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-[10px] font-bold text-primary">Mark all read</button>
                </div>
                <div className="py-2 divide-y divide-border max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 flex items-start gap-3 hover:bg-secondary/30 transition-colors">
                      <div className={cn("p-2 rounded-lg bg-secondary", n.color)}>
                        <n.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{n.title}</p>
                        <p className="text-[10px] text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border text-center">
                  <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors">View All Notifications</button>
                </div>
              </div>
            )}
          </div>

          <button className="p-2 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all active:scale-[0.95]">
            <Search className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </header>
  )
}
