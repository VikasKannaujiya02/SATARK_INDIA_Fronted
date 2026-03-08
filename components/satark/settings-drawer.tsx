"use client"

import { useState, useEffect } from "react"
import { Shield, MessageSquare, Layout, MapPin, FileText, HelpCircle, Info, X, Settings, ShieldCheck, Lock, LifeBuoy, Moon, Sun, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useApp } from "./app-context"

interface SettingsDrawerProps {
  open: boolean
  onClose: () => void
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { isDark, toggleDark, t } = useApp()
  const [smsPerm, setSmsPerm] = useState(true)
  const [overlayPerm, setOverlayPerm] = useState(true)
  const [locationPerm, setLocationPerm] = useState(true)
  const [showHelpFaq, setShowHelpFaq] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-sm z-[160] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl",
          "animate-in slide-in-from-right duration-300"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-bold text-foreground dark:text-white text-lg">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Theme Toggle */}
            <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {isDark ? (
                    <Moon className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <p className="text-foreground dark:text-white font-semibold text-sm">Theme Mode</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      {isDark ? "Dark mode enabled" : "Light mode enabled"}
                    </p>
                  </div>
                </div>
                <Switch checked={isDark} onCheckedChange={toggleDark} />
              </div>
            </div>

            {/* Permissions Manager */}
            <div>
              <h3 className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold text-sm mb-3">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {t("Permissions Manager", "????????? ???????")}
              </h3>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-200 dark:divide-slate-700">
                {[
                  { icon: MessageSquare, label: t("SMS Access", "SMS ??????"), desc: t("Block phishing messages", "?????? ????? ????? ????"), state: smsPerm, set: setSmsPerm },
                  { icon: Layout, label: t("Overlay", "?????"), desc: t("Show scam warnings", "????? ??????? ??????"), state: overlayPerm, set: setOverlayPerm },
                  { icon: MapPin, label: t("Location", "?????"), desc: t("SOS & emergency alerts", "SOS ?? ????????? ?????????"), state: locationPerm, set: setLocationPerm },
                ].map(({ icon: Icon, label, desc, state, set }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <div className="flex-1">
                      <p className="text-foreground dark:text-white font-medium text-sm">{label}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{desc}</p>
                    </div>
                    <Switch checked={state} onCheckedChange={set} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h3 className="text-slate-600 dark:text-slate-300 font-semibold text-sm px-1">
                {t("App", "??")}
              </h3>
              <Link
                href="/settings"
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-foreground dark:text-white font-medium text-sm">{t("Account Settings", "???? ????????")}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{t("Profile & Security", "????????? ?? ???????")}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <button
                onClick={() => setShowHelpFaq(!showHelpFaq)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-foreground dark:text-white font-medium text-sm">{t("Help & Support", "?????? ?? ??????")}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{t("FAQs & Documentation", "FAQs ?? ?????????")}</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showHelpFaq ? "rotate-90" : ""}`} />
              </button>

              {/* FAQ Section */}
              {showHelpFaq && (
                <div className="mt-2 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-foreground dark:text-white mb-1">
                      {t("How do I enable SOS?", "??? SOS ???? ????? ?????")}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t("Press and hold the SOS button on the Shield tab for 3 seconds. Your emergency contacts will be notified immediately.", "????? ??? ?? SOS ??? ?? 3 ????? ?? ??? ???? ????? ???? ????????? ?????? ????? ????? ??? ???????")}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground dark:text-white mb-1">
                      {t("What is KYC verification?", "KYC ??????? ???? ???")}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t("KYC (Know Your Customer) helps us verify your identity and provide better security. Complete it in Account Settings.", "KYC (?? ??? ??????) ???? ???? ????? ???????? ???? ??? ??? ???? ??? ???? ???????? ??? ??? ???? ?????")}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground dark:text-white mb-1">
                      {t("How does the threat scanner work?", "???? ?????? ???? ??? ???? ???")}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t("The scanner analyzes SMS, calls, and internet activity to detect phishing attempts, scams, and malware. Results appear in real-time.", "?????? ?????? ????????, ????? ?? ??????? ?? ???? ???? ?? ??? SMS, ??? ?? ??????? ??????? ?? ???????? ???? ???")}
                    </p>
                  </div>
                </div>
              )}

              <Link
                href="/terms"
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-foreground dark:text-white font-medium text-sm">{t("Terms & Conditions", "?????? ?? ??????")}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{t("Legal information", "?????? ???????")}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/privacy"
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-foreground dark:text-white font-medium text-sm">{t("Privacy Policy", "???????? ????")}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{t("Data protection policy", "???? ??????? ????")}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link href="/data-safety" className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-foreground dark:text-white font-medium text-sm">{t("Data Safety", "???? ???????")}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{t("How we handle your data", "?? ???? ???? ???? ??????? ???")}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* App Info */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <Info className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-foreground dark:text-white font-medium text-sm">{t("App Info", "?? ???????")}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{t("Version 1.0.0 | Built by Team SATARK INDIA", "??????? 1.0.0 | ??? SATARK INDIA ?????? ???????")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
