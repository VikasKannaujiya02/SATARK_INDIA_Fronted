"use client"

import { useState, useRef, useEffect } from "react"
import { api } from "@/lib/api"
import {
  AlertTriangle,
  FileDown,
  Phone,
  ShieldCheck,
  EyeOff,
  Siren,
  Share2,
  Activity,
  Shield,
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
  const [storyShared, setStoryShared] = useState(false)
  const [holdingPanic, setHoldingPanic] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [reportGenerating, setReportGenerating] = useState(false)
  const [cybercellDraft, setCybercellDraft] = useState("")
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [microInsuranceSecure, setMicroInsuranceSecure] = useState(false)
  const [microInsuranceToasting, setMicroInsuranceToasting] = useState(false)
  const panicIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => {
    if (panicIntervalRef.current) clearInterval(panicIntervalRef.current)
  }, [])

  const handleGenerateReport = async () => {
    setReportGenerating(true)
    setReportGenerated(false)
    setCybercellDraft("")
    setShowDraftModal(false)
    try {
      const res = await api.post("/api/recovery/generate-draft", {
        name: "Vikas Kannaujiya",
        phone: "6388853440",
        scamDetails: "UPI fraud - received call claiming to be from bank, shared OTP, amount debited from account",
        lostAmount: "25,000",
      })
      const draft = res.data?.draft || ""
      setCybercellDraft(draft)
      setReportGenerated(true)
      setShowDraftModal(true)
      setTimeout(() => setReportGenerated(false), 5000)
    } catch (err) {
      console.error("Generate draft failed (backend may be offline):", err)
      setCybercellDraft("Draft generation unavailable. Please try again when online.")
      setShowDraftModal(true)
    } finally {
      setReportGenerating(false)
    }
  }

  const handlePanic = () => {
    if (panicPressed) return
    if (panicIntervalRef.current) clearInterval(panicIntervalRef.current)
    setPanicPressed(true)
    setPanicCountdown(5)
    panicIntervalRef.current = setInterval(() => {
      setPanicCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (panicIntervalRef.current) {
            clearInterval(panicIntervalRef.current)
            panicIntervalRef.current = null
          }
          setPanicPressed(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-6">
      {/* EMERGENCY PANIC BUTTON - Massive, Pulsing, Red */}
      <button
        onMouseDown={() => {
          setHoldingPanic(true)
          handlePanic()
        }}
        onMouseUp={() => setHoldingPanic(false)}
        onTouchStart={() => {
          setHoldingPanic(true)
          handlePanic()
        }}
        onTouchEnd={() => setHoldingPanic(false)}
        className="relative w-full h-32 rounded-3xl bg-gradient-to-b from-destructive to-destructive/80 border-2 border-destructive/50 shadow-[0_0_40px_rgba(255,23,68,0.4)] hover:shadow-[0_0_60px_rgba(255,23,68,0.6)] transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-2 overflow-hidden group"
      >
        {/* Pulsing background */}
        <div className={cn("absolute inset-0 bg-destructive/20 rounded-3xl", holdingPanic && "animate-pulse")} />
        
        {/* Content */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Siren className="w-8 h-8 text-white animate-bounce" fill="white" />
            <span className="text-white font-black text-2xl">SOS</span>
            <Siren className="w-8 h-8 text-white animate-bounce" fill="white" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-white font-bold text-sm">
            {panicCountdown ? `${panicCountdown}s...` : t("TAP & HOLD", "TAP & HOLD")}
          </p>
        </div>
      </button>

      {/* Trusted Contacts */}
      <div>
        <h3 className={cn("font-bold text-foreground px-1 mb-2", isElderly ? "text-base" : "text-sm")}>
          {t("Trusted Contacts", "विश्वस्त संपर्क")}
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { name: "Mom", phone: "+91 98765 43210", emoji: "👩" },
            { name: "Dad", phone: "+91 98765 43211", emoji: "👨" },
          ].map((contact, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-primary/40 transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer"
              onClick={() => {
                // Initiate phone call
                const tel = `tel:${contact.phone}`;
                window.location.href = tel;
              }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 text-lg">
                {contact.emoji}
              </div>
              <div className="flex-1 text-left">
                <p className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-xs")}>
                  {contact.name}
                </p>
                <p className={cn("text-muted-foreground text-[10px]", isElderly ? "text-[11px]" : "text-[9px]")}>
                  {contact.phone}
                </p>
              </div>
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/15 hover:bg-accent/25 transition-colors active:scale-[0.95]"
                role="presentation"
              >
                <Phone className="w-4.5 h-4.5 text-accent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* One-Tap Police 112 Button */}
      <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30 hover:bg-destructive/15 transition-all active:scale-[0.97]">
        <Phone className="w-5 h-5 text-destructive" />
        <span className={cn("font-bold text-destructive", isElderly ? "text-base" : "text-sm")}>
          {t("ONE-TAP POLICE (112)", "ONE-TAP पुलिस (112)")}
        </span>
      </button>

      {/* Offline Bank Freeze (USSD) */}
      <button
        onClick={() => { if (typeof window !== "undefined") window.location.href = "tel:*99#" }}
        className="w-full flex flex-col items-center gap-1 py-4 rounded-2xl bg-red-600/20 border-2 border-red-500/50 hover:bg-red-600/30 transition-all active:scale-[0.97]"
      >
        <Phone className="w-5 h-5 text-red-500" />
        <span className={cn("font-bold text-red-500", isElderly ? "text-base" : "text-sm")}>
          {t("Offline Bank Freeze (USSD)", "ऑफलाइन बैंक फ्रीज (USSD)")}
        </span>
        <span className="text-red-400/90 text-[10px]">
          {t("Dial *99# to block your bank account without internet.", "*99# डायल करें बिना इंटरनेट के बैंक खाता ब्लॉक करने के लिए।")}
        </span>
      </button>

      {/* Recovery Actions Grid */}
      <div className="flex flex-col gap-2.5">
        <h3 className={cn("font-bold text-foreground px-1", isElderly ? "text-base" : "text-sm")}>
          {t("Recovery Actions", "रिकवरी कार्रवाई")}
        </h3>
        {(emergencyActions || []).map((action) => {
          const Icon = action.icon
          const isReportAction = action.titleEn === "Auto-Complaint Generator"
          return (
            <button
              key={action.titleEn}
              onClick={isReportAction ? handleGenerateReport : undefined}
              disabled={isReportAction && reportGenerating}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-primary/40 transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left"
            >
              <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl shrink-0", action.color)}>
                <Icon className={cn(action.iconColor, isElderly ? "w-5 h-5" : "w-4.5 h-4.5")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-bold text-foreground", isElderly ? "text-sm" : "text-xs")}>
                  {t(action.titleEn, action.titleHi)}
                </p>
                <p className={cn("text-muted-foreground mt-0.5 leading-snug", isElderly ? "text-xs" : "text-[10px]")}>
                  {isReportAction && reportGenerated
                    ? t("Report generated! Download ready.", "रिपोर्ट बनाई! डाउनलोड तैयार।")
                    : t(action.descEn, action.descHi)}
                </p>
                {isReportAction && reportGenerating && (
                  <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin mt-1" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Cyber Insurance (Micro) - Premium Card */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-slate-900 to-slate-950 border border-primary/30 overflow-hidden shadow-lg">
        <div className="p-5 flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 shrink-0">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
              {t("Cyber Insurance (Micro)", "साइबर बीमा (माइक्रो)")}
            </h3>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              {t("Cover up to ₹10,000 for just ₹10/month.", "सिर्फ ₹10/माह में ₹10,000 तक का कवर।")}
            </p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={() => {
              setMicroInsuranceToasting(true)
              setMicroInsuranceSecure(true)
              setTimeout(() => {
                setMicroInsuranceToasting(false)
                setTimeout(() => setMicroInsuranceSecure(false), 500)
              }, 2500)
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            {t("Secure Now", "अभी सुरक्षित करें")}
          </button>
        </div>
      </div>
      {microInsuranceToasting && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-3 rounded-2xl bg-accent text-accent-foreground shadow-lg z-50 animate-in fade-in duration-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-semibold">{t("Insurance activated! You're covered.", "बीमा सक्रिय! आप कवर हैं।")}</span>
        </div>
      )}

      {/* Share Scam Survival Story - Flex Card */}
      <button
        onClick={() => {
          setStoryShared(true)
          setTimeout(() => setStoryShared(false), 2000)
        }}
        className={cn(
          "flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98]",
          storyShared
            ? "bg-accent/15 border-accent/30"
            : "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50"
        )}
      >
        <div className={cn("flex items-center justify-center w-12 h-12 rounded-2xl shrink-0", storyShared ? "bg-accent/20" : "bg-primary/20")}>
          <Share2 className={cn(storyShared ? "text-accent" : "text-primary", isElderly ? "w-6 h-6" : "w-5 h-5")} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
            {storyShared 
              ? t("Story Shared!", "कहानी साझा की गई!")
              : t("Share Your Scam Survival Story", "अपनी स्कैम से बचाव की कहानी साझा करें")
            }
          </p>
          <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-[11px]" : "text-[10px]")}>
            {t("On Instagram & WhatsApp to warn others", "इंस्टाग्राम और व्हाट्सएप पर दूसरों को चेतावनी देने के लिए")}
          </p>
        </div>
      </button>

      {/* Cybercell Draft Modal / Textarea */}
      {showDraftModal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowDraftModal(false)}>
          <div className="w-full max-w-md rounded-t-3xl bg-card border-t border-border pb-8 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <div className="px-4 pb-2">
              <h3 className="font-bold text-foreground text-sm">
                {t("Cybercell Complaint Draft", "साइबरसेल शिकायत ड्राफ्ट")}
              </h3>
              <p className="text-muted-foreground text-[10px] mt-0.5">
                {t("Copy and submit at cybercrime.gov.in", "cybercrime.gov.in पर कॉपी करके जमा करें")}
              </p>
            </div>
            <textarea
              readOnly
              value={cybercellDraft}
              className="flex-1 min-h-[200px] mx-4 px-4 py-3 rounded-2xl bg-secondary/50 dark:bg-secondary/30 border border-slate-200 dark:border-border text-foreground text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <div className="px-4 pt-3">
              <button onClick={() => setShowDraftModal(false)}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm active:scale-[0.98] transition-transform">
                {t("Close", "बंद करें")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anonymous Reporting Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
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
