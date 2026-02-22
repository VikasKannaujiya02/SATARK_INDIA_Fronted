"use client"

import { useState } from "react"
import { Shield, MessageSquare, Layout, MapPin, FileText, HelpCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const [smsPerm, setSmsPerm] = useState(true)
  const [overlayPerm, setOverlayPerm] = useState(true)
  const [locationPerm, setLocationPerm] = useState(true)
  const [showTerms, setShowTerms] = useState(false)

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

            {/* Terms & Privacy */}
            <button
              onClick={() => setShowTerms(true)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-white font-medium text-sm">Terms & Privacy</p>
                <p className="text-slate-500 text-xs">Legal information</p>
              </div>
            </button>

            {/* Help Center */}
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                <HelpCircle className="w-4 h-4 text-primary" />
                <h3 className="text-white font-semibold text-sm">Help Center</h3>
              </div>
              <div className="p-4 space-y-2 text-slate-400 text-xs">
                <p><strong className="text-slate-300">How does SOS work?</strong> Tap & hold to alert family.</p>
                <p><strong className="text-slate-300">How to report a scam?</strong> Use the Offense tab.</p>
                <p><strong className="text-slate-300">Contact Support:</strong> support@satarkindia.in</p>
              </div>
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

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-black/70" onClick={() => setShowTerms(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-white text-lg mb-3">Terms & Privacy</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Welcome to Satark India. Data is processed locally for anti-scam purposes. We do not sell your data. 
              By using this app, you agree to our privacy-first approach.
            </p>
            <button
              onClick={() => setShowTerms(false)}
              className="mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
