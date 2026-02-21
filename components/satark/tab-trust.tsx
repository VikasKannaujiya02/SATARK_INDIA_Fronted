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
  Star,
} from "lucide-react"
import { useApp } from "./app-context"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function TabTrust() {
  const { t, isElderly, isDark, toggleDark } = useApp()
  const [privacyScreen, setPrivacyScreen] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)
  const [rateClicked, setRateClicked] = useState(false)

  return (
    <div className="flex flex-col gap-5 p-4 pb-6">
      {/* Privacy Badge */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-card/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
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
          </div>
        </div>
      </div>

      {/* Rate Us Card */}
      <button
        onClick={() => setRateClicked(true)}
        className={cn(
          "flex items-center gap-4 p-5 rounded-2xl border transition-all active:scale-[0.97]",
          rateClicked
            ? "bg-primary/15 border-primary/40"
            : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-primary/10 dark:to-primary/5 border-amber-200 dark:border-primary/30 hover:border-amber-300 dark:hover:border-primary/50"
        )}
      >
        <div className={cn("flex items-center justify-center w-12 h-12 rounded-2xl shrink-0", rateClicked ? "bg-primary/20" : "bg-white dark:bg-card/50 shadow-md shadow-amber-200/50 dark:shadow-primary/10")}>
          <Star className={cn(rateClicked ? "text-primary" : "text-amber-500", isElderly ? "w-6 h-6" : "w-5 h-5")} fill="currentColor" />
        </div>
        <div className="flex-1 text-left">
          <p className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
            {rateClicked ? t("Thank you!", "धन्यवाद!") : t("Enjoying Satark India?", "सतर्क इंडिया पसंद आ रहा है?")}
          </p>
          <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-xs" : "text-[10px]")}>
            {rateClicked
              ? t("Your feedback helps us improve", "आपकी प्रतिक्रिया हमें बेहतर होने में मदद करती है")
              : t("Rate us 5 stars on Play Store", "Play Store पर हमें 5 स्टार दें")}
          </p>
        </div>
        <Star className={cn("w-5 h-5 shrink-0", rateClicked ? "text-primary" : "text-amber-400")} fill="currentColor" />
      </button>

      {/* Invite & Earn Gamification Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
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

        <button className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-primary/40 transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
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
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
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

        <div className="flex flex-col rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border overflow-hidden divide-y divide-slate-100 dark:divide-border shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {[
            { icon: FileText, titleEn: "Privacy Policy", titleHi: "गोपनीयता नीति" },
            { icon: ScrollText, titleEn: "Data Safety Form", titleHi: "डेटा सुरक्षा फॉर्म" },
            { icon: Scale, titleEn: "Terms of Service", titleHi: "सेवा की शर्तें" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.titleEn}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-secondary/50 transition-colors text-left active:scale-[0.97]"
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
      <button className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/15 transition-colors text-left active:scale-[0.97]">
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
