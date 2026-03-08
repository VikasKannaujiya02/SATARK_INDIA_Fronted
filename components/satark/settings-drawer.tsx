"use client"

import { useState } from "react"
import { Shield, MessageSquare, Layout, MapPin, FileText, HelpCircle, Info, X, Settings, ShieldCheck, Lock, LifeBuoy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const [smsPerm, setSmsPerm] = useState(true)
  const [overlayPerm, setOverlayPerm] = useState(true)
  const [locationPerm, setLocationPerm] = useState(true)

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[150] bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-sm z-[160] bg-slate-900 dark:bg-slate-950 border-l border-slate-800 shadow-2xl",
          "animate-in slide-in-from-right duration-300"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
            <h2 className="font-bold text-white text-lg">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Permissions Manager */}
            <div>
              <h3 className="flex items-center gap-2 text-slate-300 font-semibold text-sm mb-3">
                <Shield className="w-4 h-4 text-primary" />
                Permissions Manager
              </h3>
              <div className="rounded-2xl bg-slate-800/50 border border-slate-700 overflow-hidden divide-y divide-slate-700">
                {[
                  { icon: MessageSquare, label: "SMS Access", desc: "Block phishing messages", state: smsPerm, set: setSmsPerm },
                  { icon: Layout, label: "Overlay", desc: "Show scam warnings", state: overlayPerm, set: setOverlayPerm },
                  { icon: MapPin, label: "Location", desc: "SOS & emergency alerts", state: locationPerm, set: setLocationPerm },
                ].map(({ icon: Icon, label, desc, state, set }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{label}</p>
                      <p className="text-slate-500 text-xs">{desc}</p>
                    </div>
                    <Switch checked={state} onCheckedChange={set} />
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-2">
              <Link
                href="/settings"
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">Account Settings</p>
                  <p className="text-slate-500 text-xs">Profile & Security</p>
                </div>
              </Link>

              <Link
                href="/terms"
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors text-left"
              >
                <ShieldCheck className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">Terms & Conditions</p>
                  <p className="text-slate-500 text-xs">Legal information</p>
                </div>
              </Link>

              <Link
                href="/privacy"
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors text-left"
              >
                <Lock className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">Privacy Policy</p>
                  <p className="text-slate-500 text-xs">Data protection policy</p>
                </div>
              </Link>

              <Link
                href="/help"
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors text-left"
              >
                <LifeBuoy className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">Help Center</p>
                  <p className="text-slate-500 text-xs">Support & Documentation</p>
                </div>
              </Link>
            </div>

            {/* App Info */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
              <Info className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-white font-medium text-sm">App Info</p>
                <p className="text-slate-500 text-xs">Version 1.0.0 | Built by Team SATARK INDIA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
