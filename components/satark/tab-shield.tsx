"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import {
  Shield, Phone, MessageSquare, Zap, Timer, AlertTriangle,
  Cpu, Smartphone, KeyRound, CheckCircle, X, Lock, Fingerprint, Database, ChevronRight, Info,
} from "lucide-react"
import { useApp } from "./app-context"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
// YEH LINE MISSING THI! Iske aane se crash theek ho jayega.
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" 

export function TabShield() {
  const { t, isElderly } = useApp()
  const [callMonitor, setCallMonitor] = useState(true)
  const [smsFirewall, setSmsFirewall] = useState(true)
  const [upiBreaker, setUpiBreaker] = useState(false)
  const [freezeTimer, setFreezeTimer] = useState(0)
  const [shieldPulse, setShieldPulse] = useState(true)
  const [pullRefresh, setPullRefresh] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showSkeleton, setShowSkeleton] = useState(false)

  // Overlays
  const [showSplash, setShowSplash] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const [otpTimer, setOtpTimer] = useState(30)
  const [showPermissions, setShowPermissions] = useState(false)
  const [showScamOverlay, setShowScamOverlay] = useState(false)
  const [scamFreezeTimer, setScamFreezeTimer] = useState(30)
  const [showDbToast, setShowDbToast] = useState(true)
  const [showForceUpdate, setShowForceUpdate] = useState(false)
  const [isAiPaused, setIsAiPaused] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.getBattery) return
    let cancelled = false
    let removeListener: (() => void) | undefined
    navigator.getBattery().then((battery) => {
      const update = () => {
        if (!cancelled) setIsAiPaused(battery.level < 0.15)
      }
      update()
      battery.addEventListener("levelchange", update)
      removeListener = () => battery.removeEventListener("levelchange", update)
    }).catch(() => {})
    return () => {
      cancelled = true
      removeListener?.()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setShieldPulse((p) => !p), 2000)
    return () => clearInterval(interval)
  }, [])

  // UPI breaker countdown
  useEffect(() => {
    if (!upiBreaker) { setFreezeTimer(0); return }
    setFreezeTimer(30)
    const interval = setInterval(() => {
      setFreezeTimer((p) => { if (p <= 1) { setUpiBreaker(false); return 0 } return p - 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [upiBreaker])

  // OTP resend countdown
  useEffect(() => {
    if (!showOtp || otpTimer <= 0) return
    const interval = setInterval(() => setOtpTimer((p) => Math.max(0, p - 1)), 1000)
    return () => clearInterval(interval)
  }, [showOtp, otpTimer])

  // Scam overlay 30s un-closeable freeze
  useEffect(() => {
    if (!showScamOverlay) return
    setScamFreezeTimer(30)
    const interval = setInterval(() => {
      setScamFreezeTimer((p) => {
        if (p <= 1) return 0
        return p - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [showScamOverlay])

  // Capacitor hardware bridge: when native (ScamMonitorReceiver) fires this event, show Red Overlay
  useEffect(() => {
    const handler = () => setShowScamOverlay(true)
    if (typeof window !== "undefined") {
      window.addEventListener("scamSmsReceived", handler)
      return () => window.removeEventListener("scamSmsReceived", handler)
    }
  }, [])

  // Voice AI: speak warning when Red Overlay triggers
  useEffect(() => {
    if (!showScamOverlay || typeof window === "undefined" || !window.speechSynthesis) return
    const msg = new SpeechSynthesisUtterance("Warning! Scam detected by Satark India. Do not share OTP.")
    msg.rate = 0.9
    msg.lang = "en-IN"
    window.speechSynthesis.speak(msg)
    return () => window.speechSynthesis.cancel()
  }, [showScamOverlay])

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length > 1) return
    setOtpValues(prev => { const n = [...prev]; n[index] = value; return n })
  }, [])

  const startSplashFlow = () => {
    setShowSplash(true)
    setTimeout(() => { setShowSplash(false); setShowOtp(true); setOtpTimer(30) }, 2500)
  }

  const handlePullRefresh = () => {
    setPullRefresh(true)
    setShowSkeleton(true)
    setTimeout(() => {
      setShowSkeleton(false)
      setToastMessage(t("Data refreshed successfully", "डेटा सफलतापूर्वक रीफ्रेश हुआ"))
      setTimeout(() => setToastMessage(""), 2500)
    }, 2000)
    setTimeout(() => setPullRefresh(false), 1000)
  }

  const handleSimulateScam = async () => {
    setShowScamOverlay(true)
    try {
      const res = await api.post("/api/sos/trigger", {
        name: "Vikas Kannaujiya",
        phone: "6388853440",
        location: "Unknown",
      })
      if (res.data?.whatsappUrl && typeof window !== "undefined") {
        window.open(res.data.whatsappUrl, "_blank")
      }
    } catch (err) {
      console.error("SOS API call failed (backend may be offline):", err)
    }
  }

  const isUpiFreezeActive = upiBreaker && freezeTimer > 0

  return (
    <TooltipProvider> {/* Added Provider here to wrap the component */}
      <div className="flex flex-col gap-3 p-4 pb-6 relative">
        {/* Low Battery: On-Device AI paused banner */}
        {isAiPaused && (
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200">
            <span className={cn("font-medium", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Low Battery: On-Device AI paused to save power. Basic shield active.", "कम बैटरी: पावर बचाने के लिए ऑन-डिवाइस AI रुका। बेसिक शील्ड सक्रिय।")}
            </span>
          </div>
        )}
        {/* True UPI Circuit Breaker Lock - blocks all interaction when freeze active */}
        {isUpiFreezeActive && (
          <div
            className="fixed inset-0 z-[180] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-sm"
            style={{ pointerEvents: 'auto' }}
            aria-label={t("UPI Freeze Active - Payment lockdown", "UPI फ्रीज सक्रिय")}
          >
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <Lock className="w-12 h-12 text-accent" />
              <p className="text-white font-bold text-lg">
                {t("UPI CIRCUIT BREAKER ACTIVE", "UPI सर्किट ब्रेकर सक्रिय")}
              </p>
              <p className="text-white/80 text-sm">
                {t("All payments frozen for your safety", "आपकी सुरक्षा के लिए सभी भुगतान फ्रीज")}
              </p>
              <p className="text-accent font-mono font-bold text-2xl tabular-nums">
                {freezeTimer}s {t("remaining", "शेष")}
              </p>
            </div>
          </div>
        )}
        {/* Pull-to-Refresh Indicator */}
        <div className={cn(
          "flex items-center justify-center h-8 text-accent transition-all duration-300 opacity-0",
          pullRefresh && "opacity-100"
        )}>
          <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>

        {/* Skeleton Loading Placeholder */}
        {showSkeleton && (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-2xl bg-white dark:bg-card/50 border border-slate-100 dark:border-border/30">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 animate-pulse w-3/4" />
                  <div className="h-2 rounded bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!showSkeleton && (
          <>
            {/* === QUICK SCAN PRIMARY WIDGET === */}
            <button className="relative flex items-center gap-3 p-5 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 hover:border-primary/60 transition-all active:scale-[0.97] shadow-lg shadow-primary/10 overflow-hidden group">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 group-hover:from-primary/20 transition-all" />
              <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all" />
              
              {/* Content */}
              <div className="relative flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 shrink-0 shadow-lg shadow-primary/10">
                  <Zap className={cn("text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]", isElderly ? "w-7 h-7" : "w-6 h-6")} fill="currentColor" />
                </div>
                <div className="text-left">
                  <p className={cn("font-bold text-primary", isElderly ? "text-base" : "text-sm")}>
                    {t("Instant Quick Scan", "तत्काल त्वरित स्कैन")}
                  </p>
                  <p className={cn("text-foreground/70 mt-0.5", isElderly ? "text-xs" : "text-[11px]")}>
                    {t("Tap to scan for threats in 5 seconds", "5 सेकंड में खतरों के लिए स्कैन करने के लिए टैप करें")}
                  </p>
                </div>
              </div>
              <ChevronRight className="relative w-5 h-5 text-primary/60 shrink-0" />
            </button>

            {/* Delta DB Toast */}
        {showDbToast && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-accent/10 border border-accent/20">
            <Database className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className={cn("text-accent font-medium flex-1", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Delta DB Syncing (Offline SQLite Ready)", "डेल्टा DB सिंक हो रहा है (ऑफलाइन SQLite तैयार)")}
            </span>
            <button onClick={() => setShowDbToast(false)} className="text-accent/50 hover:text-accent" aria-label="Dismiss">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Shield Status Card */}
        <div className="relative flex flex-col items-center gap-2 py-6 rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className={cn("absolute inset-0 transition-opacity duration-1000", shieldPulse ? "opacity-15" : "opacity-5")}
            style={{ background: "radial-gradient(circle at 50% 30%, #00E676 0%, transparent 70%)" }} />
          <div className="relative">
            <div className={cn("absolute -inset-4 rounded-full transition-all duration-1000", shieldPulse ? "opacity-30 scale-100" : "opacity-0 scale-90")}
              style={{ background: "radial-gradient(circle, #00E676 0%, transparent 70%)" }} />
            <Shield className={cn("relative text-accent drop-shadow-[0_0_15px_rgba(0,230,118,0.4)]", isElderly ? "w-16 h-16" : "w-14 h-14")} fill="currentColor" />
          </div>
          <p className={cn("relative font-bold text-accent", isElderly ? "text-base" : "text-sm")}>
            {t("All Systems Active", "सभी सिस्टम सक्रिय")}
          </p>
          <div className="relative flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground text-[10px] font-mono">
              {t("Edge AI: TFLite On-Device", "एज AI: TFLite ऑन-डिवाइस")}
            </span>
          </div>
        </div>

        {/* Demo Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={startSplashFlow}
            className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-secondary border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-secondary/70 transition-all active:scale-[0.97]">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className={cn("font-semibold text-foreground", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Splash + OTP", "स्प्लैश + OTP")}
            </span>
          </button>
          <button onClick={() => setShowPermissions(true)}
            className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-secondary border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-secondary/70 transition-all active:scale-[0.97]">
            <Lock className="w-4 h-4 text-primary" />
            <span className={cn("font-semibold text-foreground", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Permissions", "अनुमतियां")}
            </span>
          </button>
          <button onClick={handlePullRefresh}
            className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-secondary border border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-secondary/70 transition-all active:scale-[0.97]">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className={cn("font-semibold text-foreground", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Refresh", "रीफ्रेश")}
            </span>
          </button>
          <button onClick={handleSimulateScam}
            className="flex items-center gap-2 p-3 rounded-2xl bg-destructive/10 border border-destructive/20 hover:bg-destructive/15 transition-all active:scale-[0.97]">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className={cn("font-bold text-destructive", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Simulate Scam", "स्कैम सिम्युलेट")}
            </span>
          </button>
        </div>

        {/* Live Protection Toggles - iOS Settings Style */}
        <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100 dark:divide-border">
          {/* Call Monitor */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg", callMonitor ? "bg-accent/15" : "bg-secondary")}>
              <Phone className={cn(callMonitor ? "text-accent" : "text-muted-foreground", "w-4 h-4")} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
                {t("Live Call Monitor", "लाइव कॉल मॉनिटर")}
              </p>
              <p className="text-muted-foreground text-[10px]">
                {callMonitor ? t("Scanning incoming calls", "इनकमिंग कॉल स्कैन") : t("Disabled", "अक्षम")}
              </p>
            </div>
            <Switch checked={callMonitor} onCheckedChange={setCallMonitor} />
          </div>

          {/* SMS Firewall */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg", smsFirewall ? "bg-accent/15" : "bg-secondary")}>
              <MessageSquare className={cn(smsFirewall ? "text-accent" : "text-muted-foreground", "w-4 h-4")} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
                {t("SMS Firewall", "SMS फ़ायरवॉल")}
              </p>
              <p className="text-muted-foreground text-[10px]">
                {smsFirewall ? t("Blocking phishing SMS", "फिशिंग SMS ब्लॉक") : t("Disabled", "अक्षम")}
              </p>
            </div>
            <Switch checked={smsFirewall} onCheckedChange={setSmsFirewall} />
          </div>

          {/* UPI Circuit Breaker */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg", upiBreaker ? "bg-accent/20" : "bg-secondary")}>
              {upiBreaker ? <Timer className="w-4 h-4 text-accent" /> : <Zap className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
                  {t("UPI Circuit Breaker", "UPI सर्किट ब्रेकर")}
                </p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="p-0.5 rounded-full hover:bg-secondary transition-colors" aria-label="Info">
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px] bg-slate-900 text-white border-slate-700">
                    <p className="text-xs">Instantly freezes all UPI apps for 30 seconds when a scam is detected. Protects you from making payments under pressure.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              {upiBreaker ? (
                <p className="text-accent text-[10px] font-mono font-bold">
                  {t(`FREEZE: ${freezeTimer}s remaining`, `फ्रीज: ${freezeTimer}s शेष`)}
                </p>
              ) : (
                <p className="text-muted-foreground text-[10px]">{t("30-second freeze timer", "30 सेकंड फ्रीज टाइमर")}</p>
              )}
            </div>
            <Switch checked={upiBreaker} onCheckedChange={setUpiBreaker} />
          </div>
        </div>

        {/* === OVERLAYS === */}

        {/* Splash Screen */}
        {showSplash && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A1628] animate-in fade-in duration-300">
            <div className="flex flex-col items-center gap-4 animate-in zoom-in-90 duration-500">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-accent/20 animate-ping" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-accent/20 backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-accent drop-shadow-[0_0_20px_rgba(0,230,118,0.5)]" fill="currentColor" />
                </div>
              </div>
              <div className="text-center mt-2">
                <h1 className="text-2xl font-bold text-[#E8EEF4] tracking-tight">SATARK</h1>
                <p className="text-[10px] font-mono text-[#8899AA] tracking-[0.3em] mt-0.5">INDIA</p>
              </div>
              <p className="text-[#8899AA] text-xs mt-4">{t("Securing your digital life...", "आपकी डिजिटल जिंदगी सुरक्षित कर रहे हैं...")}</p>
              <div className="w-8 h-1 rounded-full bg-accent/30 mt-2 overflow-hidden">
                <div className="h-full bg-accent rounded-full animate-pulse w-full" />
              </div>
            </div>
          </div>
        )}

        {/* OTP Screen */}
        {showOtp && (
          <div className="fixed inset-0 z-[200] flex flex-col bg-background animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-4 py-3">
              <button onClick={() => setShowOtp(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-mono text-muted-foreground">{t("VERIFY IDENTITY", "पहचान सत्यापित रें")}</span>
              <div className="w-5" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 -mt-16">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Fingerprint className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">{t("Enter OTP", "OTP दर्ज करें")}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {t("Sent to +91 98765 XXXXX", "+91 98765 XXXXX पर भेजा गया")}
                </p>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex gap-2.5">
                {(otpValues || []).map((val, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-13 rounded-xl bg-card border-2 border-border text-center text-lg font-bold text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="text-center">
                {otpTimer > 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {t(`Resend in ${otpTimer}s`, `${otpTimer}s में पुनः भेजें`)}
                  </p>
                ) : (
                  <button onClick={() => setOtpTimer(30)} className="text-primary font-semibold text-sm">
                    {t("Resend OTP", "OTP पुनः भेजें")}
                  </button>
                )}
              </div>

              <button onClick={() => setShowOtp(false)}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm mt-2 active:scale-[0.98] transition-transform">
                {t("Verify & Continue", "सत्यापित करें और जारी रखें")}
              </button>
            </div>
          </div>
        )}

        {/* Permissions Modal */}
        {showPermissions && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowPermissions(false)}>
            <div className="w-full max-w-md rounded-t-3xl bg-card border-t border-border pb-8 animate-in slide-in-from-bottom duration-300"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center pt-3 pb-4">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              <div className="px-6 pb-4">
                <h3 className="text-lg font-bold text-foreground">{t("Required Permissions", "आवश्यक अनुमतियां")}</h3>
                <p className="text-muted-foreground text-xs mt-1">
                  {t("SATARK needs these to protect you in real-time. Play Store compliant.", "SATARK को रियल-टाइम सुरक्षा के लिए इनकी जरूरत है।")}
                </p>
              </div>
              <div className="flex flex-col divide-y divide-border mx-4 rounded-2xl border border-border overflow-hidden">
                {[
                  { icon: Phone, name: t("Phone & Call Log", "फोन और कॉल लॉग"), desc: t("Detect scam calls in real-time", "रियल-टाइम स्कैम कॉल डिटेक्ट") },
                  { icon: MessageSquare, name: t("SMS Access", "SMS एक्सेस"), desc: t("Block phishing messages", "फिशिंग मैसेज ब्लॉक") },
                  { icon: Shield, name: t("Accessibility Service", "एक्सेसिबिलिटी सर्विस"), desc: t("Overlay protection during UPI", "UPI ट्रांजैक्शन में ओवरले सुरक्षा") },
                  { icon: Lock, name: t("Draw Over Apps", "ऐप्स पर ड्रा"), desc: t("Show scam warnings instantly", "तुरंत स्कैम चेतावनी दिखाएं") },
                ].map((perm) => {
                  const Icon = perm.icon
                  return (
                    <div key={perm.name} className="flex items-center gap-3 px-4 py-3">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-foreground">{perm.name}</p>
                        <p className="text-[10px] text-muted-foreground">{perm.desc}</p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    </div>
                  )
                })}
              </div>
              <div className="px-6 mt-5">
                <button onClick={() => setShowPermissions(false)}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm active:scale-[0.98] transition-transform">
                  {t("Allow All Permissions", "सभी अनुमतियां दें")}
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}

        {/* Force Update Modal */}
        {showForceUpdate && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="mx-6 w-full max-w-sm rounded-3xl bg-card border border-border p-6 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{t("Update Required", "अपडेट आवश्यक")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("A critical security patch is available. Please update to continue.", "एक महत्वपूर्ण सुरक्षा पैच उपलब्ध है। जारी रखने के लिए अपडेट करें।")}
                </p>
                <div className="flex flex-col gap-2 w-full mt-2">
                  <button onClick={() => setShowForceUpdate(false)}
                    className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm active:scale-[0.98] transition-transform">
                    {t("Update Now", "अभी अपडेट करें")}
                  </button>
                  <button onClick={() => setShowForceUpdate(false)}
                    className="w-full py-3 rounded-2xl text-muted-foreground font-medium text-sm">
                    {t("Remind Later", "बाद में याद दिलाएं")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-40 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-foreground-foreground shadow-lg z-50 animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* RED SCREEN SCAM OVERLAY + UPI Circuit Breaker */}
        {showScamOverlay && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#B71C1C] animate-in fade-in duration-150">
            <div className="flex flex-col items-center gap-4 px-8 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-[#FFFFFF20] flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {t("SCAM CALL DETECTED!", "स्कैम कॉल डिटेक्ट!")}
              </h1>
              <p className="text-white/80 text-sm leading-relaxed">
                {t(
                  "DO NOT pick up this call. A known scammer is trying to reach you. Your UPI transactions have been frozen for your safety.",
                  "यह कॉल उठाएं नहीं। एक ज्ञात स्कैमर आपसे संपर्क करने की कोशिश कर रहा है। आपकी UPI लेनदेन सुरक्षा के लिए फ्रीज कर दी गई हैं।"
                )}
              </p>

              {/* UPI Freeze Timer */}
              <div className="w-full mt-2 rounded-2xl bg-[#FFFFFF15] border border-[#FFFFFF30] p-5">
                <p className="text-white/70 text-[10px] font-mono tracking-widest mb-2">
                  {t("UPI CIRCUIT BREAKER", "UPI सर्किट ब्रेकर")}
                </p>
                <div className="text-5xl font-bold font-mono text-white tabular-nums">
                  00:{scamFreezeTimer.toString().padStart(2, "0")}
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-[#FFFFFF20] overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(scamFreezeTimer / 30) * 100}%` }} />
                </div>
                <p className="text-white/60 text-[10px] mt-2">
                  {scamFreezeTimer > 0
                    ? t("All UPI apps are temporarily frozen", "सभी UPI ऐप्स अस्ायी रूप से फ्रोजन हैं")
                    : t("UPI apps unlocked", "UPI ऐप्स अनलॉक")}
                </p>
              </div>

              {scamFreezeTimer === 0 ? (
                <button onClick={() => setShowScamOverlay(false)}
                  className="w-full py-4 rounded-2xl bg-white text-[#B71C1C] font-bold text-sm mt-2 active:scale-[0.98] transition-transform">
                  {t("I Understand, Dismiss", "मैं समझ गया, बंद करें")}
                </button>
              ) : (
                <p className="text-white/50 text-[11px] font-mono mt-2">
                  {t("Cannot dismiss during active freeze", "सक्रिय फ्रीज के दौरान बंद नहीं किया जा सकता")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
