"use client"

import { useState } from "react"
import {
  ShieldCheck,
  KeyRound,
  Moon,
  Sun,
  Database,
  FileText,
  Scale,
  ScrollText,
  Trash2,
  ChevronRight,
  CheckCircle,
  Wifi,
  HardDrive,
  Eye,
  Gift,
  Users,
  ArrowRight,
} from "lucide-react"
import { useApp } from "./app-context"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function TabTrust() {
  const { t, isElderly, isDark, toggleDark } = useApp()
  const [privacyScreen, setPrivacyScreen] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)

  return (
    <div className="flex flex-col gap-5 p-4 pb-6">
      {/* Privacy Badge */}
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-accent/10" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
        <div className="relative flex items-center gap-4 p-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 shadow-lg shadow-accent/10 shrink-0">
            <ShieldCheck className={cn("text-accent", isElderly ? "w-7 h-7" : "w-6 h-6")} />
          </div>
          <div>
            <p className={cn("font-bold text-accent", isElderly ? "text-base" : "text-sm")}>
              {t("No-Data Upload Policy", "नो-डेटा अपलोड पॉलिसी")}
            </p>
            <p className={cn("text-foreground mt-0.5", isElderly ? "text-sm" : "text-xs")}>
              {t(
                "100% On-Device Privacy. Your data never leaves your phone.",
                "100% ऑन-डिवाइस प्राइवेसी। आपका डेटा कभी फोन नहीं छोड़ता।"
              )}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <CheckCircle className="w-3 h-3 text-accent" />
              <span className="text-accent text-[9px] font-mono font-bold">
                {t("VERIFIED ZERO-KNOWLEDGE", "सत्यापित ज़ीरो-नॉलेज")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="flex flex-col gap-1.5">
        <h3 className={cn("font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1", isElderly ? "text-xs" : "text-[10px]")}>
          {t("SETTINGS", "सेटिंग्स")}
        </h3>

        <div className="flex flex-col rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
          {/* OTP Login */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <KeyRound className={cn("text-muted-foreground shrink-0", isElderly ? "w-4.5 h-4.5" : "w-4 h-4")} />
            <div className="flex-1">
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t("OTP Login", "OTP लॉगिन")}
              </p>
              <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
                {t("Phone: +91 98765 43210", "फोन: +91 98765 43210")}
              </p>
            </div>
            <span className="text-accent text-[9px] font-mono font-bold bg-accent/10 px-2 py-0.5 rounded-md">
              {t("VERIFIED", "सत्यापित")}
            </span>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            {isDark ? (
              <Moon className={cn("text-muted-foreground shrink-0", isElderly ? "w-4.5 h-4.5" : "w-4 h-4")} />
            ) : (
              <Sun className={cn("text-muted-foreground shrink-0", isElderly ? "w-4.5 h-4.5" : "w-4 h-4")} />
            )}
            <div className="flex-1">
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t("Dark Mode UI", "डार्क मोड UI")}
              </p>
              <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
                {isDark ? t("Currently dark theme", "वर्तमान में डार्क थीम") : t("Currently light theme", "वर्तमान में लाइट थीम")}
              </p>
            </div>
            <Switch checked={isDark} onCheckedChange={toggleDark} aria-label={t("Toggle dark mode", "डार्क मोड टॉगल करें")} />
          </div>

          {/* Offline DB Sync */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Database className={cn("text-muted-foreground shrink-0", isElderly ? "w-4.5 h-4.5" : "w-4 h-4")} />
            <div className="flex-1">
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t("Offline Database Sync", "ऑफलाइन डेटाबेस सिंक")}
              </p>
              <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
                {t("Last synced: 2 min ago (Delta: 10KB)", "अंतिम सिंक: 2 मिनट पहले (डेल्टा: 10KB)")}
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10">
              <Wifi className="w-2.5 h-2.5 text-accent" />
              <span className="text-accent text-[8px] font-mono font-bold">{t("SYNCED", "सिंक्ड")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invite & Earn Gamification Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/30 via-primary/20 to-transparent border border-primary/30 p-5">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/30 shrink-0 shadow-lg shadow-primary/10">
            <Gift className={cn("text-primary", isElderly ? "w-7 h-7" : "w-6 h-6")} />
          </div>
          <div className="flex-1">
            <p className={cn("font-bold text-primary", isElderly ? "text-base" : "text-sm")}>
              {t("Invite & Earn", "आमंत्रित करें और कमाएं")}
            </p>
            <p className={cn("text-foreground/80 mt-1", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Invite family, get 1 month Cyber Insurance FREE", "परिवार को आमंत्रित करें, 1 महीने का साइबर बीमा मुफ्त पाएं")}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary/60 shrink-0" />
        </div>
      </div>

      {/* Storage & Cache Section */}
      <div className="flex flex-col gap-1.5">
        <h3 className={cn("font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1", isElderly ? "text-xs" : "text-[10px]")}>
          {t("STORAGE", "स्टोरेज")}
        </h3>

        <button className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary shrink-0">
              <HardDrive className={cn("text-muted-foreground", isElderly ? "w-5 h-5" : "w-4 h-4")} />
            </div>
            <div className="text-left">
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t("Storage & Cache", "स्टोरेज और कैश")}
              </p>
              <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
                {t("Cached data using 14MB", "उपयोग किए गए कैश डेटा 14MB")}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCacheCleared(true)
              setTimeout(() => setCacheCleared(false), 2000)
            }}
            className={cn(
              "text-accent text-[9px] font-mono font-bold px-2 py-1 rounded-md transition-colors",
              cacheCleared && "text-accent/50"
            )}
          >
            {cacheCleared ? t("CLEARED", "साफ") : t("Clear Cache", "कैश साफ करें")}
          </button>
        </button>
      </div>

      {/* Privacy Screen Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary shrink-0">
            <Eye className={cn("text-muted-foreground", isElderly ? "w-5 h-5" : "w-4 h-4")} />
          </div>
          <div>
            <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("Privacy Screen", "गोपनीयता स्क्रीन")}
            </p>
            <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
              {t("Blur app in recent tasks", "हाल के कार्यों में ऐप को धुंधला करें")}
            </p>
          </div>
        </div>
        <Switch checked={privacyScreen} onCheckedChange={setPrivacyScreen} aria-label={t("Toggle privacy screen", "गोपनीयता स्क्रीन टॉगल करें")} />
      </div>

      {/* Legal Section */}
      <div className="flex flex-col gap-1.5">
        <h3 className={cn("font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1", isElderly ? "text-xs" : "text-[10px]")}>
          {t("LEGAL", "कानूनी")}
        </h3>

        <div className="flex flex-col rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border">
          {[
            { icon: FileText, titleEn: "Privacy Policy", titleHi: "गोपनीयता नीति" },
            { icon: ScrollText, titleEn: "Data Safety Form", titleHi: "डेटा सुरक्षा फॉर्म" },
            { icon: Scale, titleEn: "Terms of Service", titleHi: "सेवा की शर्तें" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.titleEn}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors text-left"
              >
                <Icon className={cn("text-muted-foreground shrink-0", isElderly ? "w-4.5 h-4.5" : "w-4 h-4")} />
                <span className={cn("flex-1 font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                  {t(item.titleEn, item.titleHi)}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Danger: Delete Account */}
      <button className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/15 transition-colors text-left active:scale-[0.98]">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/15 shrink-0">
          <Trash2 className={cn("text-destructive", isElderly ? "w-5 h-5" : "w-4 h-4")} />
        </div>
        <div>
          <p className={cn("font-bold text-destructive", isElderly ? "text-sm" : "text-xs")}>
            {t("Delete Account", "अकाउंट हटाएं")}
          </p>
          <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
            {t("Permanently delete all data", "सभी डेटा स्थायी रूप से हटाएं")}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-destructive/50 ml-auto" />
      </button>

      {/* Version Footer */}
      <div className="flex items-center justify-center py-4 text-center">
        <p className="text-muted-foreground text-[9px] font-mono">
          {t("v1.0.4 (Build 420) • Made in India 🇮🇳", "v1.0.4 (बिल्ड 420) • भारत में बनाया गया 🇮🇳")}
        </p>
      </div>
    </div>
  )
}
