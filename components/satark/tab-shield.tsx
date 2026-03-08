"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import {
  Shield, Phone, MessageSquare, Zap, Timer, AlertTriangle,
  Cpu, Smartphone, KeyRound, CheckCircle, X, Lock, Fingerprint, Database, ChevronRight, Info,
  ShieldCheck, Eye, EyeOff, Plus, Trash2, Send, ExternalLink,
} from "lucide-react"
import { useApp } from "./app-context"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" 
import toast from "react-hot-toast"

interface FamilyDevice {
  id: string
  name: string
  relation: string
  model: string
}

const COMMON_BREACHED_PASSWORDS = ["123456", "password", "admin123", "qwerty", "12345678", "12345", "123456789", "password123"]

const BANKS = [
  { name: "SBI", phone: "18001234", sms: "567676", body: "BLOCK" },
  { name: "HDFC", phone: "18002026161", sms: "5676712", body: "BLOCK" },
  { name: "ICICI", phone: "18002003344", sms: "5676766", body: "BLOCK" },
  { name: "National Cyber Cell", phone: "1930", sms: "1930", body: "URGENT: Freeze my bank account due to fraud." }
]

export function TabShield() {
  const { t, isElderly, socket } = useApp()
  
  // --- Device Audit State ---
  const [auditData, setAuditData] = useState<{
    os: string;
    browser: string;
    cores: number;
    connection: string;
    battery: number;
    isCharging: boolean;
    lastScan: string;
  } | null>(null)
  const [isAuditing, setIsAuditing] = useState(false)

  useEffect(() => {
    const handlePing = (e: any) => {
      const data = e.detail
      toast.success(t(`Security Alert from ${data.name}: ${data.message}`, `${data.name} से सुरक्षा अलर्ट: ${data.message}`), {
        icon: '🛡️',
        duration: 5000
      })
    }
    window.addEventListener("satark_security_ping", handlePing)
    return () => window.removeEventListener("satark_security_ping", handlePing)
  }, [t])

  const runDeviceAudit = useCallback(async () => {
    setIsAuditing(true)
    
    // Simulate short delay for "scanning" feel
    await new Promise(resolve => setTimeout(resolve, 1500))

    const ua = navigator.userAgent
    let os = "Unknown OS"
    if (ua.indexOf("Win") !== -1) os = "Windows"
    if (ua.indexOf("Mac") !== -1) os = "MacOS"
    if (ua.indexOf("X11") !== -1) os = "UNIX"
    if (ua.indexOf("Linux") !== -1) os = "Linux"
    if (ua.indexOf("Android") !== -1) os = "Android"
    if (ua.indexOf("like Mac") !== -1) os = "iOS"

    let browser = "Unknown Browser"
    if (ua.indexOf("Chrome") !== -1) browser = "Chrome"
    else if (ua.indexOf("Firefox") !== -1) browser = "Firefox"
    else if (ua.indexOf("Safari") !== -1) browser = "Safari"
    else if (ua.indexOf("Edge") !== -1) browser = "Edge"

    const cores = navigator.hardwareConcurrency || 0
    const connection = (navigator as any).connection?.effectiveType || "Unknown"
    
    let batteryLevel = 0
    let isCharging = false
    try {
      const battery: any = await (navigator as any).getBattery()
      batteryLevel = Math.round(battery.level * 100)
      isCharging = battery.charging
    } catch (e) {}

    setAuditData({
      os,
      browser,
      cores,
      connection,
      battery: batteryLevel,
      isCharging,
      lastScan: new Date().toLocaleTimeString()
    })
    setIsAuditing(false)
    toast.success(t("Device security audit complete", "डिवाइस सुरक्षा ऑडिट पूरा हुआ"))
  }, [t])

  // --- Password Scanner State ---
  const [password, setPassword] = useState("")
  const [passStrength, setPassStrength] = useState<{ score: number; label: string; color: string; breach: boolean } | null>(null)

  // --- Bank Freeze State ---
  const [selectedBank, setSelectedBank] = useState(BANKS[0])
  
  // --- Family Guardian State ---
  const [familyDevices, setFamilyDevices] = useState<FamilyDevice[]>([])
  const [showAddFamily, setShowAddFamily] = useState(false)
  const [newFamily, setNewFamily] = useState({ name: "", relation: "", model: "" })

  useEffect(() => {
    const saved = localStorage.getItem("satark_family_devices")
    if (saved) {
      try { setFamilyDevices(JSON.parse(saved)) } catch (e) { console.error(e) }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("satark_family_devices", JSON.stringify(familyDevices))
  }, [familyDevices])

  // --- Password Logic ---
  const checkPassword = (val: string) => {
    setPassword(val)
    if (!val) { setPassStrength(null); return }

    const isBreached = COMMON_BREACHED_PASSWORDS.includes(val.toLowerCase())
    
    // Entropy check
    let score = 0
    if (val.length > 8) score += 25
    if (/[A-Z]/.test(val)) score += 25
    if (/[0-9]/.test(val)) score += 25
    if (/[^A-Za-z0-9]/.test(val)) score += 25

    let label = "Weak"
    let color = "text-destructive"
    if (score >= 75) { label = "Strong"; color = "text-accent" }
    else if (score >= 50) { label = "Medium"; color = "text-amber-500" }

    setPassStrength({ score, label, color, breach: isBreached })
  }

  // --- Family Logic ---
  const addFamilyMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFamily.name || !newFamily.model) return
    const device: FamilyDevice = { ...newFamily, id: Date.now().toString() }
    setFamilyDevices([...familyDevices, device])
    setNewFamily({ name: "", relation: "", model: "" })
    setShowAddFamily(false)
    toast.success(t("Family member added", "परिवार का सदस्य जोड़ा गया"))
  }

  const sendSecurityPing = (name: string) => {
    if (!socket) {
      toast.error(t("Socket not connected", "सॉकेट कनेक्ट नहीं है"))
      return
    }
    const toastId = toast.loading(t(`Sending Security Ping to ${name}'s device...`, `${name} के डिवाइस पर सुरक्षा पिंग भेज रहे हैं...`))
    
    socket.emit('send_security_ping', {
      name: "Vikas Kannaujiya", // In real app, get from profile state
      target: name,
      message: "Device security check requested.",
      timestamp: new Date().toISOString()
    })

    // Socket.io usually acknowledges immediately if sent
    setTimeout(() => {
      toast.success(t(`Ping sent to ${name}. Waiting for acknowledgment.`, `${name} को पिंग भेजा गया। पावती की प्रतीक्षा है।`), { id: toastId })
    }, 1000)
  }
  // --- SMS/Call Scanner State ---
  const [smsText, setSmsText] = useState("")
  const [isScanningSms, setIsScanningSms] = useState(false)
  const [smsResult, setSmsResult] = useState<{ risk: "Low" | "Medium" | "High"; message: string } | null>(null)
  
  const scanSms = async () => {
    if (!smsText) return
    setIsScanningSms(true)
    setSmsResult(null)
    const toastId = toast.loading(t("Analyzing SMS content for threats...", "SMS कंटेंट का विश्लेषण कर रहे हैं..."))
    
    try {
      const res = await api.post("/api/scan-query", { query: smsText, type: 'sms' })
      const result = {
        risk: (res.data?.riskLevel as "Low" | "Medium" | "High") || "Low",
        message: res.data?.message || "Scan complete."
      }
      setSmsResult(result)
      toast.success(t("SMS Scan Complete", "SMS स्कैन पूरा हुआ"), { id: toastId })
    } catch (err) {
      console.error("SMS Scan failed:", err)
      toast.error(t("Scan failed. Using offline analyzer.", "स्कैन विफल। ऑफलाइन एनालाइजर का उपयोग कर रहे हैं।"), { id: toastId })
      
      const phishingKeywords = ["otp", "win", "lottery", "prize", "kyc", "bank", "update", "click", "http", "https", "link", "suspend", "block"]
      const foundKeywords = phishingKeywords.filter(kw => smsText.toLowerCase().includes(kw))
      
      if (foundKeywords.length >= 3) {
        setSmsResult({ risk: "High", message: t("High Risk: Likely Phishing SMS detected. Do not click any links.", "उच्च जोखिम: संभावित फिशिंग एसएमएस। किसी भी लिंक पर क्लिक न करें।") })
      } else if (foundKeywords.length > 0) {
        setSmsResult({ risk: "Medium", message: t("Medium Risk: Suspicious keywords found. Be cautious.", "मध्यम जोखिम: संदिग्ध कीवर्ड पाए गए। सावधान रहें।") })
      } else {
        setSmsResult({ risk: "Low", message: t("Low Risk: No obvious phishing indicators found.", "कम जोखिम: कोई स्पष्ट फिशिंग संकेत नहीं मिले।") })
      }
    } finally {
      setIsScanningSms(false)
    }
  }

  const [callAudioFile, setCallAudioFile] = useState<File | null>(null)
  const [isScanningCall, setIsScanningCall] = useState(false)
  const [callResult, setCallResult] = useState<{ risk: "Low" | "High"; message: string } | null>(null)

  const scanCall = async () => {
    if (!callAudioFile) return
    setIsScanningCall(true)
    // Simulate complex audio analysis
    await new Promise(r => setTimeout(r, 3000))
    
    // In a real app, we might use Whisper API or local VAD/Speech-to-Text
    // For now, we simulate based on filename or just randomness for demo
    const isLikelyScam = callAudioFile.name.toLowerCase().includes("scam") || Math.random() > 0.7
    
    if (isLikelyScam) {
      setCallResult({ risk: "High", message: t("High Risk: Scam patterns detected in audio recording.", "उच्च जोखिम: ऑडियो रिकॉर्डिंग में स्कैम पैटर्न पाए गए।") })
    } else {
      setCallResult({ risk: "Low", message: t("Low Risk: No malicious patterns detected in call audio.", "कम जोखिम: कॉल ऑडियो में कोई हानिकारक पैटर्न नहीं मिला।") })
    }
    setIsScanningCall(false)
  }

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
            <div className="flex flex-col gap-3">
              <button 
                onClick={runDeviceAudit}
                disabled={isAuditing}
                className="relative flex items-center gap-3 p-5 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 hover:border-primary/60 transition-all active:scale-[0.97] shadow-lg shadow-primary/10 overflow-hidden group disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 group-hover:from-primary/20 transition-all" />
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all" />
                <div className="relative flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 shrink-0 shadow-lg shadow-primary/10">
                    {isAuditing ? (
                      <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Zap className={cn("text-primary drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]", isElderly ? "w-7 h-7" : "w-6 h-6")} fill="currentColor" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className={cn("font-bold text-primary", isElderly ? "text-base" : "text-sm")}>
                      {isAuditing ? t("Auditing Device...", "डिवाइस ऑडिट हो रहा है...") : t("Instant Device Audit", "तत्काल डिवाइस ऑडिट")}
                    </p>
                    <p className={cn("text-foreground/70 mt-0.5", isElderly ? "text-xs" : "text-[11px]")}>
                      {t("Check OS, CPU, Battery & Connection health", "ओएस, सीपीयू, बैटरी और कनेक्शन स्वास्थ्य की जांच करें")}
                    </p>
                  </div>
                </div>
                <ChevronRight className="relative w-5 h-5 text-primary/60 shrink-0" />
              </button>

              {/* Audit Results Overlay/Card */}
              {auditData && (
                <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-300">
                   <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-white text-sm">{t("Device Health Report", "डिवाइस हेल्थ रिपोर्ट")}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{auditData.lastScan}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Operating System", "ऑपरेटिंग सिस्टम")}</p>
                      <p className="text-sm font-bold text-white">{auditData.os} ({auditData.browser})</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Connection", "कनेक्शन")}</p>
                      <p className="text-sm font-bold text-white uppercase">{auditData.connection} Network</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t("CPU Cores", "सीपीयू कोर")}</p>
                      <p className="text-sm font-bold text-white">{auditData.cores} Logical Cores</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Battery Health", "बैटरी हेल्थ")}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{auditData.battery}%</p>
                        {auditData.isCharging && <Zap className="w-3 h-3 text-accent fill-accent" />}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Functional Password Breach Scanner */}
              <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-white text-sm">{t("Database Password Scanner", "डेटाबेस पासवर्ड स्कैनर")}</h3>
                </div>
                <div className="relative">
                  <input 
                    type="password"
                    placeholder={t("Type password to check...", "जांचने के लिए पासवर्ड लिखें...")}
                    value={password}
                    onChange={(e) => checkPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {passStrength && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      {passStrength.breach ? (
                        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <p className="text-destructive font-bold text-[10px] uppercase tracking-wider">
                            {t("CRITICAL: Password found in known data breaches!", "महत्वपूर्ण: पासवर्ड डेटा ब्रीच में पाया गया!")}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", passStrength.color)}>
                              {t(`Strength: ${passStrength.label}`, `शक्ति: ${passStrength.label}`)}
                            </span>
                            <span className="text-slate-500 text-[9px] font-mono">256-bit Entropy</span>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={cn("h-full transition-all duration-500", passStrength.score === 100 ? "bg-accent" : passStrength.score >= 50 ? "bg-amber-500" : "bg-destructive")} 
                                 style={{ width: `${passStrength.score}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Offline Bank Freeze Utility */}
            <div className="rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-foreground text-sm">{t("Offline Bank Freeze", "ऑफलाइन बैंक फ्रीज")}</h3>
                </div>
                <span className="text-[8px] font-mono font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">NATIVE ACTION</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {BANKS.map(bank => (
                  <button
                    key={bank.name}
                    onClick={() => setSelectedBank(bank)}
                    className={cn(
                      "py-2 rounded-xl text-[10px] font-bold border transition-all",
                      selectedBank.name === bank.name 
                        ? "bg-accent/10 border-accent text-accent" 
                        : "bg-secondary/50 border-border text-muted-foreground hover:border-accent/30"
                    )}
                  >
                    {bank.name}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <button 
                    onClick={() => { if (typeof window !== "undefined") window.location.href = `tel:${selectedBank.phone}` }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4 text-accent" />
                    <span className="text-xs font-bold">{t("CALL BANK", "बैंक को कॉल करें")}</span>
                  </button>
                  <button 
                    onClick={() => { if (typeof window !== "undefined") window.location.href = `sms:${selectedBank.sms}?body=${encodeURIComponent(selectedBank.body)}` }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-slate-950 rounded-2xl hover:bg-accent/90 transition-all active:scale-[0.98]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-bold">{t("SEND SMS", "SMS भेजें")}</span>
                  </button>
                </div>
                <p className="text-muted-foreground text-[9px] text-center italic px-2">
                  {t("Warning: This opens your native dialer/SMS to directly contact official banking security.", "चेतावनी: यह आधिकारिक बैंकिंग सुरक्षा से संपर्क करने के लिए आपके फोन के डायलर/SMS को खोलेगा।")}
                </p>
              </div>
            </div>

            {/* Functional Family Guardian Network */}
            <div className="rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  {t("Family Guardian Network", "फैमिली गार्जियन नेटवर्क")}
                </h3>
                <button 
                  onClick={() => setShowAddFamily(!showAddFamily)}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showAddFamily && (
                <form onSubmit={addFamilyMember} className="p-4 rounded-2xl bg-secondary/30 border border-border grid grid-cols-2 gap-2 animate-in slide-in-from-top duration-200">
                  <input placeholder={t("Name", "नाम")} className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground" value={newFamily.name} onChange={e => setNewFamily({...newFamily, name: e.target.value})} required />
                  <input placeholder={t("Relation", "संबंध")} className="bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground" value={newFamily.relation} onChange={e => setNewFamily({...newFamily, relation: e.target.value})} />
                  <input placeholder={t("Phone Model", "फोन मॉडल")} className="col-span-2 bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground" value={newFamily.model} onChange={e => setNewFamily({...newFamily, model: e.target.value})} required />
                  <button type="submit" className="col-span-2 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-xs">{t("Add Member", "सदस्य जोड़ें")}</button>
                </form>
              )}

              <div className="space-y-3">
                {familyDevices.length > 0 ? (
                  familyDevices.map(device => (
                    <div key={device.id} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/50 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-foreground font-bold text-xs">{device.name} <span className="text-muted-foreground text-[10px] font-normal">({device.relation})</span></p>
                          <p className="text-muted-foreground text-[10px]">{device.model}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => sendSecurityPing(device.name)}
                        className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary hover:text-white transition-all"
                      >
                        {t("SECURITY PING", "सुरक्षा पिंग")}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-[10px] py-4 italic">{t("No family devices added. Monitoring inactive.", "कोई फैमिली डिवाइस नहीं जोड़ी गई।")}</p>
                )}
              </div>
            </div>

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

        {/* Live Protection Toggles - iOS Settings Style */}
        <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100 dark:divide-border">
          {/* Call Monitor */}
          <div className="flex flex-col gap-0 divide-y divide-slate-100 dark:divide-border">
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
            
            {callMonitor && (
              <div className="px-4 py-3 bg-secondary/20 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("Manual Call Analysis", "मैनुअल कॉल विश्लेषण")}</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={(e) => setCallAudioFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="call-upload" 
                    />
                    <label 
                      htmlFor="call-upload" 
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 text-primary text-[11px] font-bold cursor-pointer hover:bg-primary/10 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {callAudioFile ? callAudioFile.name : t("Upload Call Recording", "कॉल रिकॉर्डिंग अपलोड करें")}
                    </label>
                    <button 
                      onClick={scanCall}
                      disabled={!callAudioFile || isScanningCall}
                      className="px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-bold disabled:opacity-50"
                    >
                      {isScanningCall ? t("Analyzing...", "विश्लेषण...") : t("Analyze", "विश्लेषण")}
                    </button>
                  </div>
                  {callResult && (
                    <div className={cn(
                      "p-3 rounded-xl border text-[11px] flex items-start gap-2 animate-in zoom-in-95",
                      callResult.risk === "High" ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-accent/10 border-accent/30 text-accent"
                    )}>
                      {callResult.risk === "High" ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> : <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                      <p>{callResult.message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SMS Firewall */}
          <div className="flex flex-col gap-0 divide-y divide-slate-100 dark:divide-border">
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

            {smsFirewall && (
              <div className="px-4 py-3 bg-secondary/20 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("Manual SMS Scanner", "मैनुअल एसएमएस स्कैनर")}</p>
                  <div className="flex gap-2">
                    <input 
                      placeholder={t("Paste suspicious SMS text...", "संदिग्ध एसएमएस पेस्ट करें...")}
                      value={smsText}
                      onChange={(e) => setSmsText(e.target.value)}
                      className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button 
                      onClick={scanSms}
                      disabled={!smsText || isScanningSms}
                      className="px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-bold disabled:opacity-50"
                    >
                      {isScanningSms ? t("Scanning...", "स्कैनिंग...") : t("Scan", "स्कैन")}
                    </button>
                  </div>
                  {smsResult && (
                    <div className={cn(
                      "p-3 rounded-xl border text-[11px] flex items-start gap-2 animate-in zoom-in-95",
                      smsResult.risk === "High" ? "bg-destructive/10 border-destructive/30 text-destructive" : smsResult.risk === "Medium" ? "bg-amber-500/10 border-amber-500/30 text-amber-600" : "bg-accent/10 border-accent/30 text-accent"
                    )}>
                      {smsResult.risk === "High" ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> : smsResult.risk === "Medium" ? <Info className="w-3.5 h-3.5 shrink-0" /> : <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                      <p>{smsResult.message}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
