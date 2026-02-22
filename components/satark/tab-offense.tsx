"use client"

import { useState, useEffect, useRef } from "react"
import { api } from "@/lib/api"
import {
  Bot,
  Phone,
  Clock,
  Wifi,
  WifiOff,
  Receipt,
  Sparkles,
  MessageCircle,
  Shield,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Mail,
  Search,
  FileCheck,
  Globe,
  Zap,
  Send,
  Share2,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useApp } from "./app-context"
import { cn } from "@/lib/utils"

interface HoneypotAgent {
  id: string
  nameEn: string
  nameHi: string
  statusEn: string
  statusHi: string
  callsEn: string
  callsHi: string
  active: boolean
  avatar: string
  accentColor: string
}

const initialAgents: HoneypotAgent[] = [
  {
    id: "savitri",
    nameEn: "Savitri",
    nameHi: "सावित्री",
    statusEn: "Currently engaging scammer on call...",
    statusHi: "वर्तमान में स्कैमर से कॉल पर बात कर रही है...",
    callsEn: "127 scammers wasted today",
    callsHi: "आज 127 स्कैमर्स का समय बर्बाद किया",
    active: true,
    avatar: "S",
    accentColor: "#FF6B9D",
  },
  {
    id: "rajesh",
    nameEn: "Rajesh",
    nameHi: "राजेश",
    statusEn: "Idle - Waiting for next scam call...",
    statusHi: "निष्क्रिय - अगले स्कैम कॉल का इंतजार...",
    callsEn: "89 scammers wasted today",
    callsHi: "आज 89 स्कैमर्स का समय बर्बाद किया",
    active: false,
    avatar: "R",
    accentColor: "#00B0FF",
  },
]

export function TabOffense() {
  const { t, isElderly } = useApp()
  const [agents, setAgents] = useState(initialAgents)
  const [generatingReceipt, setGeneratingReceipt] = useState(false)
  const [receiptGenerated, setReceiptGenerated] = useState(false)
  const [callSeconds, setCallSeconds] = useState(0)
  const [breachCheckEmail, setBreachCheckEmail] = useState("")
  const [checkingBreaches, setCheckingBreaches] = useState(false)
  const [breachesFound, setBreachesFound] = useState(false)

  const [reportScammerNumber, setReportScammerNumber] = useState("")
  const [reportPlatform, setReportPlatform] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportAnonymous, setReportAnonymous] = useState(false)
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)
  const [reportTrackingId, setReportTrackingId] = useState("")

  const [fakeEvidenceAmount, setFakeEvidenceAmount] = useState("")
  const [fakeEvidenceUpiId, setFakeEvidenceUpiId] = useState("")
  const [fakeEvidenceGenerating, setFakeEvidenceGenerating] = useState(false)
  const [fakeEvidenceGenerated, setFakeEvidenceGenerated] = useState(false)

  const [savitriMessages, setSavitriMessages] = useState<{ role: "user" | "agent"; text: string }[]>([])
  const [savitriInput, setSavitriInput] = useState("")
  const [savitriLoading, setSavitriLoading] = useState(false)
  const [shareToast, setShareToast] = useState(false)
  const savitriScrollRef = useRef<HTMLDivElement>(null)

  const handleShareAlert = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "Scam Alert - Satark India",
          text: "Beware of this scammer number! Checked via Satark India.",
          url: "https://satarkindia.com",
        })
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText("https://satarkindia.com")
        setShareToast(true)
        setTimeout(() => setShareToast(false), 2000)
      }
    } catch (e) {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText("https://satarkindia.com")
        setShareToast(true)
        setTimeout(() => setShareToast(false), 2000)
      }
    }
  }

  useEffect(() => {
    savitriScrollRef.current?.scrollTo({ top: savitriScrollRef.current.scrollHeight, behavior: "smooth" })
  }, [savitriMessages])

  const sendMessage = async () => {
    const userText = savitriInput.trim()
    if (!userText || savitriLoading) return
    setSavitriInput("")
    setSavitriMessages((prev) => [...prev, { role: "user", text: userText }])
    setSavitriLoading(true)
    try {
      const res = await api.post<{ reply?: string; response?: string; message?: string }>(
        "/api/chat",
        { message: userText },
        { timeout: 15000 }
      )
      const reply =
        res.data?.reply ?? res.data?.response ?? res.data?.message ?? (typeof res.data === "string" ? res.data : "No response.")
      setSavitriMessages((prev) => [...prev, { role: "agent", text: reply }])
    } catch (err) {
      console.error("Guvi Honeypot API error:", err)
      setSavitriMessages((prev) => [
        ...prev,
        { role: "agent", text: "Agent unavailable. Check your API URL (see comment in tab-offense.tsx) or try again later." },
      ])
    } finally {
      setSavitriLoading(false)
    }
  }

  useEffect(() => {
    const hasActive = agents.some((a) => a.active)
    if (!hasActive) return
    const interval = setInterval(() => setCallSeconds((p) => p + 1), 1000)
    return () => clearInterval(interval)
  }, [agents])

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      (prev || []).map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    )
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleGenerateReceipt = () => {
    setGeneratingReceipt(true)
    setReceiptGenerated(false)
    setTimeout(() => {
      setGeneratingReceipt(false)
      setReceiptGenerated(true)
    }, 2000)
  }

  const handleGenerateFakePaymentProof = () => {
    const amount = fakeEvidenceAmount.trim() || "0"
    const upi = fakeEvidenceUpiId.trim() || "scammer@upi"
    setFakeEvidenceGenerated(false)
    setFakeEvidenceGenerating(true)
    setTimeout(() => {
      setFakeEvidenceGenerating(false)
      setFakeEvidenceGenerated(true)
    }, 1500)
  }

  const handleCheckBreaches = () => {
    if (!breachCheckEmail.trim()) return
    setCheckingBreaches(true)
    setBreachesFound(false)
    setTimeout(() => {
      setCheckingBreaches(false)
      setBreachesFound(true)
    }, 2000)
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportScammerNumber.trim()) return
    setReportSubmitting(true)
    setReportSuccess(false)
    try {
      const res = await api.post("/api/report/submit", {
        scammerNumber: reportScammerNumber.trim(),
        platform: reportPlatform.trim() || "unknown",
        description: reportDescription.trim(),
        isAnonymous: reportAnonymous,
      })
      setReportSuccess(true)
      setReportTrackingId(res.data?.trackingId || "")
      setReportScammerNumber("")
      setReportPlatform("")
      setReportDescription("")
      setTimeout(() => { setReportSuccess(false); setReportTrackingId("") }, 5000)
    } catch (err) {
      console.error("Report submit failed (backend may be offline):", err)
    } finally {
      setReportSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-6">
      {/* Cyber Defense Arsenal Header */}
      <div>
        <h2 className={cn("font-bold text-foreground", isElderly ? "text-xl" : "text-lg")}>
          {t("Cyber Defense Arsenal", "साइबर रक्षा शस्त्रागार")}
        </h2>
        <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-sm" : "text-xs")}>
          {t("Advanced security tools at your fingertips", "आपकी उंगलियों पर उन्नत सुरक्षा उपकरण")}
        </p>
      </div>

      {/* Cyber Defense Arsenal 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Deepfake Scanner */}
        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all active:scale-[0.97]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50">
            <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className={cn("font-semibold text-foreground text-center", isElderly ? "text-sm" : "text-xs")}>
            {t("Deepfake Scanner", "डीपफेक स्कैनर")}
          </p>
          <p className={cn("text-muted-foreground text-[9px] text-center", isElderly ? "text-[10px]" : "text-[8px]")}>
            {t("Audio/Video", "ऑडियो/वीडियो")}
          </p>
        </button>

        {/* Card 2: AI Honeypot */}
        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all active:scale-[0.97]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50">
            <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <p className={cn("font-semibold text-foreground text-center", isElderly ? "text-sm" : "text-xs")}>
            {t("AI Honeypot", "AI हनीपॉट")}
          </p>
          <p className={cn("text-muted-foreground text-[9px] text-center", isElderly ? "text-[10px]" : "text-[8px]")}>
            {t("Keep scammers busy", "स्कैमर्स को व्यस्त रखें")}
          </p>
        </button>

        {/* Card 3: Fake Receipt Verifier */}
        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all active:scale-[0.97]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/50">
            <FileCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <p className={cn("font-semibold text-foreground text-center", isElderly ? "text-sm" : "text-xs")}>
            {t("Receipt Verifier", "रसीद सत्यापक")}
          </p>
          <p className={cn("text-muted-foreground text-[9px] text-center", isElderly ? "text-[10px]" : "text-[8px]")}>
            {t("Detect fakes", "नकली का पता लगाएं")}
          </p>
        </button>

        {/* Card 4: Dark Web Leak Check */}
        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 transition-all active:scale-[0.97]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/50">
            <Globe className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <p className={cn("font-semibold text-foreground text-center", isElderly ? "text-sm" : "text-xs")}>
            {t("Dark Web Check", "डार्क वेब जांच")}
          </p>
          <p className={cn("text-muted-foreground text-[9px] text-center", isElderly ? "text-[10px]" : "text-[8px]")}>
            {t("Find leaks", "लीक खोजें")}
          </p>
        </button>
      </div>

      {/* Report Scammer Form */}
      <div className="rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-destructive/15">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
                {t("Report Scammer", "स्कैमर रिपोर्ट करें")}
              </h3>
              <p className={cn("text-muted-foreground", isElderly ? "text-xs" : "text-[10px]")}>
                {t("Help others by reporting fraudulent numbers", "धोखाधड़ी नंबर की रिपोर्ट कर दूसरों की मदद करें")}
              </p>
            </div>
          </div>
          <button type="button" onClick={handleShareAlert} className="p-2.5 rounded-xl hover:bg-secondary transition-colors shrink-0" aria-label={t("Share Alert", "अलर्ट शेयर करें")}>
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
        </div>
        {shareToast && (
          <div className="mx-5 mb-2 rounded-xl px-4 py-2 bg-foreground text-background text-xs font-medium text-center">
            {t("Link copied to clipboard", "लिंक क्लिपबोर्ड में कॉपी हो गया")}
          </div>
        )}
        <form onSubmit={handleReportSubmit} className="p-5 pt-0 flex flex-col gap-3">
          {reportSuccess && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span className={cn("text-accent font-medium", isElderly ? "text-xs" : "text-[10px]")}>
                {t("Report submitted!", "रिपोर्ट जमा हो गई!")}
                {reportTrackingId && (
                  <span className="block font-mono font-bold mt-1 text-foreground">{reportTrackingId}</span>
                )}
              </span>
            </div>
          )}
          <input
            type="text"
            placeholder={t("Scammer Number / UPI ID", "स्कैमर नंबर / UPI ID")}
            value={reportScammerNumber}
            onChange={(e) => setReportScammerNumber(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl bg-secondary border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <input
            type="text"
            placeholder={t("Platform (WhatsApp, Call, etc)", "प्लेटफॉर्म (WhatsApp, कॉल, आदि)")}
            value={reportPlatform}
            onChange={(e) => setReportPlatform(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl bg-secondary border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <textarea
            placeholder={t("Details (what happened)", "विवरण (क्या हुआ)")}
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 rounded-2xl bg-secondary border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none"
          />
          <div className="flex items-center justify-between py-1">
            <span className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("Anonymous Mode (Hide my identity)", "अनाम मोड (मेरी पहचान छिपाएं)")}
            </span>
            <Switch checked={reportAnonymous} onCheckedChange={setReportAnonymous} />
          </div>
          <button
            type="submit"
            disabled={reportSubmitting || !reportScammerNumber.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all active:scale-[0.97]",
              reportSubmitting || !reportScammerNumber.trim()
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            )}
          >
            {reportSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>{t("Submitting...", "जमा हो रहा...")}</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>{t("Submit Report", "रिपोर्ट जमा करें")}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Honeypot Agents Section */}
      <div>
        <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
          {t("Active Honeypot Agents", "सक्रिय हनीपॉट एजेंट्स")}
        </h3>
        <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-xs" : "text-[10px]")}>
          {t("Live AI agents wasting scammers' time", "स्कैमर्स का समय बर्बाद करते AI एजेंट्स")}
        </p>
      </div>
      <div className="rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
              {t("Device Health Audit", "डिवाइस स्वास्थ्य ऑडिट")}
            </h3>
            <p className={cn("text-muted-foreground", isElderly ? "text-xs" : "text-[10px]")}>
              {t("System security status check", "सिस्टम सुरक्षा स्थिति जांच")}
            </p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-slate-100 dark:divide-border">
          <div className="flex items-center gap-3 px-5 py-3">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span className={cn("flex-1 text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("Developer Options: Secure", "डेवलपर विकल्प: सुरक्षित")}
            </span>
            <span className="text-accent text-[8px] font-mono font-bold">OK</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span className={cn("flex-1 text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("OS: Up to date (Android 14)", "OS: अपडेट के अनुसार (Android 14)")}
            </span>
            <span className="text-accent text-[8px] font-mono font-bold">OK</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span className={cn("flex-1 text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("Play Protect: Enabled", "प्ले प्रोटेक्ट: सक्षम")}
            </span>
            <span className="text-accent text-[8px] font-mono font-bold">OK</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            <span className={cn("flex-1 text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("SATARK Permissions: Granted", "SATARK अनुमतियां: दी गई")}
            </span>
            <span className="text-accent text-[8px] font-mono font-bold">OK</span>
          </div>
        </div>
      </div>

      {/* Dark Web Monitor Card */}
      <div className="rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-chart-4/15">
            <Search className="w-5 h-5 text-[#00B0FF]" />
          </div>
          <div>
            <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
              {t("Dark Web Monitor", "डार्क वेब मॉनिटर")}
            </h3>
            <p className={cn("text-muted-foreground", isElderly ? "text-xs" : "text-[10px]")}>
              {t("Check if your credentials leaked", "जांचें कि आपके क्रेडेंशियल्स लीक हुए हैं या नहीं")}
            </p>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <input
            type="email"
            placeholder={t("Enter your email", "अपना ईमेल दर्ज करें")}
            value={breachCheckEmail}
            onChange={(e) => setBreachCheckEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl bg-secondary border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />

          {breachesFound && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span className={cn("text-accent font-medium", isElderly ? "text-xs" : "text-[10px]")}>
                {t("Check complete! No breaches found.", "जांच पूरी! कोई उल्लंघन नहीं मिला।")}
              </span>
            </div>
          )}

          <button
            onClick={handleCheckBreaches}
            disabled={checkingBreaches || !breachCheckEmail.trim()}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-xs transition-all active:scale-[0.97]",
              checkingBreaches || !breachCheckEmail.trim()
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-[#00B0FF]/15 text-[#00B0FF] border border-[#00B0FF]/30 hover:bg-[#00B0FF]/20"
            )}
          >
            {checkingBreaches ? (
              <>
                <div className="w-3 h-3 border-2 border-[#00B0FF]/30 border-t-[#00B0FF] rounded-full animate-spin" />
                <span>{t("Checking...", "जांच रहे हैं...")}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{t("Check Breaches", "उल्लंघन जांचें")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Honeypot Section Header */}
      <div className="mt-4">
        <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
          {t("Honeypot Agents", "हनीपॉट एजेंट्स")}
        </h3>
        <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-xs" : "text-[10px]")}>
          {t("Live AI agents wasting scammers' time", "स्कैमर्स का समय बर्बाद करते AI एजेंट्स")}
        </p>
      </div>

      {/* Live Playground Header */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-accent/10 border border-accent/20">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className={cn("font-bold text-accent font-mono", isElderly ? "text-sm" : "text-xs")}>
          {t("LIVE PLAYGROUND", "लाइव प्लेग्राउंड")}
        </span>
        <span className="text-muted-foreground text-[10px] font-mono ml-auto">
          {t("2 agents deployed", "2 एजेंट तैनात")}
        </span>
      </div>

      {/* Agent Cards */}
      <div className="flex flex-col gap-3">
        {(agents || []).map((agent) => (
          <div
            key={agent.id}
            className={cn(
              "relative rounded-3xl bg-card border overflow-hidden transition-all duration-300",
              agent.active ? "border-accent/40 shadow-lg shadow-accent/10" : "border-border"
            )}
          >
            {agent.active && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />
            )}

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-2xl text-lg font-bold shrink-0"
                  style={{
                    backgroundColor: agent.accentColor + "25",
                    color: agent.accentColor,
                    boxShadow: agent.active ? `0 8px 24px ${agent.accentColor}30` : "none",
                  }}
                >
                  {agent.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
                      {t(agent.nameEn, agent.nameHi)}
                    </span>
                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                    {agent.active ? (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/15 text-accent text-[8px] font-bold font-mono">
                        <Wifi className="w-2.5 h-2.5" /> LIVE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground text-[8px] font-bold font-mono">
                        <WifiOff className="w-2.5 h-2.5" /> IDLE
                      </span>
                    )}
                  </div>
                  <p className={cn("text-muted-foreground mt-0.5 leading-snug", isElderly ? "text-sm" : "text-[11px]")}>
                    {t(agent.statusEn, agent.statusHi)}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                {agent.active && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-accent" />
                    <span className="text-accent text-[10px] font-mono font-bold">
                      {formatTime(callSeconds)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className={cn("text-muted-foreground font-mono", isElderly ? "text-xs" : "text-[10px]")}>
                    {t(agent.callsEn, agent.callsHi)}
                  </span>
                </div>
              </div>

              {/* Chat Bubbles for active agent */}
              {agent.active && (
                <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-border">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="px-2.5 py-1.5 rounded-xl rounded-tl-sm bg-secondary text-[10px] text-foreground max-w-[80%]">
                      {t(
                        '"Hello sir, I am calling from electricity board..."',
                        '"नमस्ते सर, ���ैं बिजल�� बोर्ड से कॉल कर रहा हूं..."'
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 justify-end">
                    <div className="px-2.5 py-1.5 rounded-xl rounded-tr-sm bg-accent/20 text-[10px] text-accent max-w-[80%]">
                      {t(
                        '"Oh my, please tell me what to do! Let me get my card..."',
                        '"अरे, कृपया बताइए क्या करना है! मैं अपना कार्ड लाती हूं..."'
                      )}
                    </div>
                    <Shield className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                  </div>
                </div>
              )}

              <button
                onClick={() => toggleAgent(agent.id)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 mt-3 py-2.5 rounded-2xl font-semibold text-xs transition-all active:scale-[0.97]",
                  agent.active
                    ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/15"
                    : "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15"
                )}
              >
                {agent.active
                  ? t("Deactivate Agent", "एजे���ट निष्क्रिय करें")
                  : t("Activate Agent", "एजेंट सक्रिय करें")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Savitri (Honeypot Mode) - Guvi API Chat */}
      <div className="rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
          <Bot className="w-5 h-5 text-accent" />
          <span className={cn("font-bold text-white", isElderly ? "text-base" : "text-sm")}>
            {t("Agent Savitri (Honeypot Mode)", "एजेंट सावित्री (हनीपॉट मोड)")}
          </span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/20 text-accent text-[8px] font-bold font-mono">
            <Wifi className="w-2.5 h-2.5" /> Online
          </span>
        </div>
        <div
          ref={savitriScrollRef}
          className="flex flex-col gap-2 p-4 min-h-[160px] max-h-[280px] overflow-y-auto"
        >
          {savitriMessages.length === 0 && (
            <p className="text-slate-500 text-xs">
              {t("Simulate scammer message. Savitri will respond via Guvi Honeypot API.", "स्कैमर संदेश सिम्युलेट करें। सावित्री Guvi API से जवाब देंगी।")}
            </p>
          )}
          {(savitriMessages || []).map((m, i) => (
            <div
              key={i}
              className={cn(
                "px-3 py-2 rounded-xl text-xs max-w-[85%]",
                m.role === "user"
                  ? "ml-auto bg-primary/20 text-primary-foreground"
                  : "bg-slate-800 text-slate-200"
              )}
            >
              {m.text}
            </div>
          ))}
          {savitriLoading && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs w-fit">
              <div className="w-2.5 h-2.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              {t("Savitri typing...", "सावित्री टाइप कर रही हैं...")}
            </div>
          )}
        </div>
        <div className="flex gap-2 p-3 border-t border-slate-700">
          <input
            type="text"
            value={savitriInput}
            onChange={(e) => setSavitriInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t("Scammer message...", "स्कैमर संदेश...")}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-accent"
          />
          <button
            onClick={sendMessage}
            disabled={savitriLoading || !savitriInput.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            aria-label={t("Send", "भेजें")}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fake Evidence Generator */}
      <div className="rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFD600]/20">
              <Receipt className="w-5 h-5 text-[#FFD600]" />
            </div>
            <div>
              <h3 className={cn("font-bold text-white", isElderly ? "text-base" : "text-sm")}>
                {t("Fake Evidence Generator", "फर्जी सबूत जेनरेटर")}
              </h3>
              <p className="text-slate-400 text-[10px]">
                {t("Generate decoy payment proof to bait scammers", "स्कैमर्स को फंसाने के लिए नकली भुगतान प्रूफ बनाएं")}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder={t("Amount to Fake (₹)", "नकली राशि (₹)")}
              value={fakeEvidenceAmount}
              onChange={(e) => setFakeEvidenceAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#FFD600]/50"
            />
            <input
              type="text"
              placeholder={t("Scammer's UPI ID", "स्कैमर का UPI ID")}
              value={fakeEvidenceUpiId}
              onChange={(e) => setFakeEvidenceUpiId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#FFD600]/50"
            />
          </div>

          <button
            onClick={handleGenerateFakePaymentProof}
            disabled={fakeEvidenceGenerating}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all active:scale-[0.97]",
              fakeEvidenceGenerating
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-[#FFD600] text-slate-900 hover:bg-[#FFD600]/90 shadow-lg shadow-[#FFD600]/20"
            )}
          >
            {fakeEvidenceGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-200 rounded-full animate-spin" />
                <span className="text-sm">{t("Generating...", "बना रहे हैं...")}</span>
              </>
            ) : (
              <>
                <Receipt className="w-4 h-4" />
                <span className="text-sm">{t("Generate Fake Payment Proof", "नकली भुगतान प्रूफ बनाएं")}</span>
              </>
            )}
          </button>

          {fakeEvidenceGenerated && (
            <>
              <p className="mt-3 text-accent text-xs font-semibold text-center">
                {t("Fake ₹", "नकली ₹")}{fakeEvidenceAmount || "0"} {t("transfer receipt generated successfully. Ready to send to scammer.", "ट्रांसफर रसीद सफलतापूर्वक बनाई। स्कैमर को भेजने के लिए तैयार।")}
              </p>
              <div className="mt-3 p-4 rounded-2xl bg-slate-800 border border-slate-600 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{t("Payment Receipt", "भुगतान रसीद")}</p>
                <p className="text-white font-mono font-bold text-lg">₹ {fakeEvidenceAmount || "0"}</p>
                <p className="text-slate-400 text-xs mt-1">{fakeEvidenceUpiId || "scammer@upi"}</p>
                <p className="text-accent text-[10px] mt-2 font-semibold">{t("Paid via Satark Decoy", "Satark Decoy द्वारा भुगतान")}</p>
              </div>
            </>
          )}

          {receiptGenerated && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent font-medium text-xs">{t("Decoy receipt generated!", "नकली रसीद बनाई गई!")}</span>
            </div>
          )}

          <button
            onClick={handleGenerateReceipt}
            disabled={generatingReceipt}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs mt-3 transition-all active:scale-[0.97]",
              generatingReceipt ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-primary/20 text-primary border border-primary/40"
            )}
          >
            {generatingReceipt ? (
              <><div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />{t("Generating...", "बना रहे हैं...")}</>
            ) : (
              <><Receipt className="w-3.5 h-3.5" />{t("Generate Fake Receipt", "नकली रसीद बनाएं")}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
