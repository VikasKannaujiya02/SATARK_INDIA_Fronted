"use client"

import { useState } from "react"
import {
  AlertTriangle,
  FileDown,
  Phone,
  ShieldCheck,
  EyeOff,
  Siren,
} from "lucide-react"
import { useApp } from "./app-context"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const emergencyActions = [
  {
    icon: FileDown,
    titleEn: "Auto-Complaint Generator",
    titleHi: "ऑटो-शिकायत जेनरेटर",
    descEn: "Download pre-filled PDF for cybercrime.gov.in",
    descHi: "cybercrime.gov.in के लिए भरा हुआ PDF डाउनलोड करें",
    color: "bg-chart-4/15",
    iconColor: "text-[#00B0FF]",
  },
  {
    icon: Phone,
    titleEn: "Offline USSD Helper",
    titleHi: "ऑफलाइन USSD हेल्पर",
    descEn: "Dial *99# to freeze bank account instantly",
    descHi: "*99# डायल करें बैंक खाता तुरंत फ्रीज करने के लिए",
    color: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    icon: ShieldCheck,
    titleEn: "Claim Cyber Insurance",
    titleHi: "साइबर बीमा क्लेम करें",
    descEn: "Get covered up to Rs.10,000 for just Rs.10/mo",
    descHi: "सिर्फ Rs.10/माह में Rs.10,000 तक का कवर पाएं",
    color: "bg-chart-5/15",
    iconColor: "text-[#FFD600]",
  },
]

export function TabRecovery() {
  const { t, isElderly } = useApp()
  const [anonymous, setAnonymous] = useState(false)
  const [panicPressed, setPanicPressed] = useState(false)
  const [panicCountdown, setPanicCountdown] = useState<number | null>(null)

  const handlePanic = () => {
    if (panicPressed) return
    setPanicPressed(true)
    setPanicCountdown(5)
    const interval = setInterval(() => {
      setPanicCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-6">
      {/* Emergency Recovery Header */}
      <div className="relative rounded-3xl bg-destructive/10 border border-destructive/30 p-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-destructive/50" />
        <div className="flex items-center gap-3 mb-2">
          <Siren className={cn("text-destructive", isElderly ? "w-6 h-6" : "w-5 h-5")} />
          <h2 className={cn("font-bold text-foreground", isElderly ? "text-xl" : "text-lg")}>
            {t("Emergency Recovery", "आपातकालीन रिकवरी")}
          </h2>
        </div>
        <p className={cn("text-muted-foreground", isElderly ? "text-sm" : "text-xs")}>
          {t(
            "Immediate actions if you have been scammed. Every second matters.",
            "अगर आपके साथ ठगी हुई है तो तत्काल कार्रवाई। हर सेकंड मायने रखता है।"
          )}
        </p>
      </div>

      {/* Massive Panic Button */}
      <button
        onClick={handlePanic}
        className={cn(
          "relative w-full flex flex-col items-center justify-center gap-2 py-8 rounded-3xl font-bold transition-all duration-300 overflow-hidden",
          panicPressed
            ? "bg-destructive/80 shadow-2xl shadow-destructive/40 scale-[0.98]"
            : "bg-destructive hover:bg-destructive/90 shadow-xl shadow-destructive/30 active:scale-[0.97]"
        )}
      >
        {panicPressed && (
          <div className="absolute inset-0 bg-destructive animate-pulse" />
        )}
        <AlertTriangle className={cn("relative text-destructive-foreground", isElderly ? "w-10 h-10" : "w-8 h-8")} />
        <span className={cn("relative text-destructive-foreground", isElderly ? "text-lg" : "text-base")}>
          {panicPressed
            ? panicCountdown && panicCountdown > 0
              ? t(`ACTIVATING IN ${panicCountdown}...`, `${panicCountdown} में सक्रिय हो रहा है...`)
              : t("RECOVERY MODE ACTIVE", "रिकवरी मोड सक्रिय")
            : t("I GOT SCAMMED", "मुझे ठगा गया")}
        </span>
        {!panicPressed && (
          <span className="relative text-destructive-foreground/70 text-[10px] font-mono">
            {t("Tap to start emergency recovery", "आपातकालीन रिकवरी शुरू करने के लिए टैप करें")}
          </span>
        )}
      </button>

      {/* Recovery Actions Grid */}
      <div className="flex flex-col gap-2.5">
        <h3 className={cn("font-bold text-foreground px-1", isElderly ? "text-base" : "text-sm")}>
          {t("Recovery Actions", "रिकवरी कार्रवाई")}
        </h3>
        {emergencyActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.titleEn}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all active:scale-[0.98] text-left"
            >
              <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl shrink-0", action.color)}>
                <Icon className={cn(action.iconColor, isElderly ? "w-5 h-5" : "w-4.5 h-4.5")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-bold text-foreground", isElderly ? "text-sm" : "text-xs")}>
                  {t(action.titleEn, action.titleHi)}
                </p>
                <p className={cn("text-muted-foreground mt-0.5 leading-snug", isElderly ? "text-xs" : "text-[10px]")}>
                  {t(action.descEn, action.descHi)}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Anonymous Reporting Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15">
            <EyeOff className={cn("text-primary", isElderly ? "w-5 h-5" : "w-4 h-4")} />
          </div>
          <div>
            <span className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("Anonymous Reporting", "गुमनाम रिपोर्टिंग")}
            </span>
            <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
              {t("Your identity stays hidden", "आपकी पहचान छिपी रहेगी")}
            </p>
          </div>
        </div>
        <Switch
          checked={anonymous}
          onCheckedChange={setAnonymous}
          aria-label={t("Toggle anonymous reporting", "गुमनाम रिपोर्टिंग टॉगल करें")}
        />
      </div>
    </div>
  )
}
