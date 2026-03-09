"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import {
  Shield, Phone, MessageSquare, Zap, Timer, AlertTriangle,
  Cpu, Smartphone, CheckCircle, X, Lock, Fingerprint, ChevronRight, Info,
  ShieldCheck, Plus, Database,
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

  const runDeviceAudit = useCallback(async () => {
    setIsAuditing(true)
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

  const addFamilyMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFamily.name || !newFamily.model) return
    const member = { ...newFamily, id: Date.now().toString() }
    const updated = [...familyDevices, member]
    setFamilyDevices(updated)
    localStorage.setItem("satark_family_devices", JSON.stringify(updated))
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
      name: "User", 
      target: name,
      message: "Device security check requested.",
      timestamp: new Date().toISOString()
    })

    setTimeout(() => {
      toast.success(t(`Ping sent to ${name}. Waiting for acknowledgment.`, `${name} को पिंग भेजा गया। पावती की प्रतीक्षा है।`), { id: toastId })
    }, 1000)
  }

  // --- UI States ---
  const [shieldPulse, setShieldPulse] = useState(true)
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
  const [upiBreaker, setUpiBreaker] = useState(false)
  const [freezeTimer, setFreezeTimer] = useState(0)

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

  // Scam overlay countdown
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

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length > 1) return
    setOtpValues(prev => { const n = [...prev]; n[index] = value; return n })
  }, [])

  const isUpiFreezeActive = upiBreaker && freezeTimer > 0

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 p-4 pb-6 relative">
        {/* Low Battery Banner */}
        {isAiPaused && (
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200">
            <span className={cn("font-medium", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Low Battery: On-Device AI paused to save power.", "कम बैटरी: पावर बचाने के लिए ऑन-डिवाइस AI रुका।")}
            </span>
          </div>
        )}

        {/* UPI Freeze Overlay */}
        {isUpiFreezeActive && (
          <div className="fixed inset-0 z-[180] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <Lock className="w-12 h-12 text-accent" />
              <p className="text-white font-bold text-lg">{t("UPI CIRCUIT BREAKER ACTIVE", "UPI सर्किट ब्रेकर सक्रिय")}</p>
              <p className="text-white/80 text-sm">{t("All payments frozen for your safety", "आपकी सुरक्षा के लिए सभी भुगतान फ्रीज")}</p>
              <p className="text-accent font-mono font-bold text-2xl tabular-nums">{freezeTimer}s {t("remaining", "शेष")}</p>
            </div>
          </div>
        )}

        {/* Instant Device Audit Button */}
        <button 
          onClick={runDeviceAudit}
          disabled={isAuditing}
          className="relative flex items-center gap-3 p-5 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 hover:border-primary/60 transition-all active:scale-[0.97] shadow-lg shadow-primary/10 overflow-hidden group disabled:opacity-70"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 group-hover:from-primary/20 transition-all" />
          <div className="relative flex items-center gap-4 flex-1">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 shrink-0 shadow-lg shadow-primary/10">
              {isAuditing ? (
                <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Zap className={cn("text-primary", isElderly ? "w-7 h-7" : "w-6 h-6")} fill="currentColor" />
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

        {/* Audit Results */}
        {auditData && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-white text-sm">{t("Device Health Report", "डिवाइस हेल्थ रिपोर्ट")}</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{auditData.lastScan}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700 text-left">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t("OS", "ओएस")}</p>
                <p className="text-sm font-bold text-white truncate">{auditData.os}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700 text-left">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Connection", "कनेक्शन")}</p>
                <p className="text-sm font-bold text-white uppercase">{auditData.connection}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700 text-left">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t("CPU", "सीपीयू")}</p>
                <p className="text-sm font-bold text-white">{auditData.cores} Cores</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700 text-left">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Battery", "बैटरी")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{auditData.battery}%</p>
                  {auditData.isCharging && <Zap className="w-3 h-3 text-accent fill-accent" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shield Status Card */}
        <div className="relative flex flex-col items-center gap-3 py-6 rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className={cn("absolute inset-0 transition-opacity duration-1000", shieldPulse ? "opacity-15" : "opacity-5")}
            style={{ background: "radial-gradient(circle at 50% 30%, #00E676 0%, transparent 70%)" }} />
          <div className="relative">
            <div className={cn("absolute -inset-4 rounded-full transition-all duration-1000", shieldPulse ? "opacity-30 scale-100" : "opacity-0 scale-90")}
              style={{ background: "radial-gradient(circle, #00E676 0%, transparent 70%)" }} />
            <Shield className={cn("relative text-accent", isElderly ? "w-16 h-16" : "w-14 h-14")} fill="currentColor" />
          </div>
          <p className={cn("relative font-bold text-accent", isElderly ? "text-base" : "text-sm")}>
            {t("All Systems Active", "सभी सिस्टम सक्रिय")}
          </p>
          <div className="relative flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground text-[10px] font-mono">{t("Edge AI: On-Device", "एज AI: ऑन-डिवाइस")}</span>
          </div>
        </div>

        {/* Offline Bank Freeze Utility */}
        <div className="rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-foreground text-sm">{t("Offline Bank Freeze", "ऑफलाइन बैंक फ्रीज")}</h3>
            </div>
            <span className="text-[8px] font-mono font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase">Native Action</span>
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
        </div>

        {/* Live Protection Toggles - APP EXCLUSIVE */}
        <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100 dark:divide-border">
          {/* Call Monitor */}
          <div className="flex items-center gap-3 px-4 py-3 opacity-60">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
              <Phone className="text-muted-foreground w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-[13px]")}>{t("Live Call Monitor", "लाइव कॉल मॉनिटर")}</p>
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[7px] font-black uppercase">App Exclusive</span>
              </div>
              <p className="text-muted-foreground text-[10px]">{t("Requires Background Service", "बैकग्राउंड सर्विस आवश्यक")}</p>
            </div>
            <Switch checked={false} disabled />
          </div>

          {/* SMS Firewall */}
          <div className="flex items-center gap-3 px-4 py-3 opacity-60">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
              <MessageSquare className="text-muted-foreground w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-[13px]")}>{t("SMS Firewall", "SMS फ़ायरवॉल")}</p>
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[7px] font-black uppercase">App Exclusive</span>
              </div>
              <p className="text-muted-foreground text-[10px]">{t("Coming in Android Update", "एंड्रॉइड अपडेट में")}</p>
            </div>
            <Switch checked={false} disabled />
          </div>

          {/* UPI Circuit Breaker */}
          <div className="flex items-center gap-3 px-4 py-3 opacity-60">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-[13px]")}>{t("UPI Circuit Breaker", "UPI सर्किट ब्रेकर")}</p>
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[7px] font-black uppercase">App Exclusive</span>
              </div>
              <p className="text-muted-foreground text-[10px]">{t("Auto-freeze payments", "भुगतान ऑटो-फ्रीज")}</p>
            </div>
            <Switch checked={false} disabled />
          </div>
        </div>

        {/* Family Guardian Network */}
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
                    <div className="text-left">
                      <p className="text-foreground font-bold text-xs">{device.name} <span className="text-muted-foreground text-[10px] font-normal">({device.relation})</span></p>
                      <p className="text-muted-foreground text-[10px]">{device.model}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => sendSecurityPing(device.name)}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    {t("PING", "प���ंग")}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground text-[10px] py-4 italic">{t("No family devices added.", "कोई फैमिली डिवाइस नहीं जोड़ी गई।")}</p>
            )}
          </div>
        </div>

        {/* Delta DB Toast */}
        {showDbToast && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-accent/10 border border-accent/20">
            <Database className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className={cn("text-accent font-medium flex-1 text-left", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Delta DB Syncing (Offline SQLite Ready)", "डेल्टा DB सिंक हो रहा है (ऑफलाइन SQLite तैयार)")}
            </span>
            <button onClick={() => setShowDbToast(false)} className="text-accent/50 hover:text-accent">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* === OVERLAYS === */}
        {showOtp && (
          <div className="fixed inset-0 z-[200] flex flex-col bg-background">
            <div className="flex items-center justify-between px-4 py-3">
              <button onClick={() => setShowOtp(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              <span className="text-[10px] font-mono text-muted-foreground">VERIFY IDENTITY</span>
              <div className="w-5" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 -mt-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <Fingerprint className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{t("Enter OTP", "OTP दर्ज करें")}</h2>
                <p className="text-muted-foreground text-sm mt-1">{t("Sent to your registered number", "आपके पंजीकृत नंबर पर भेजा गया")}</p>
              </div>
              <div className="flex gap-2.5">
                {otpValues.map((val, i) => (
                  <input key={i} type="text" maxLength={1} value={val} onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-13 rounded-xl bg-card border-2 border-border text-center text-lg font-bold text-foreground focus:border-primary focus:outline-none" />
                ))}
              </div>
              <button onClick={() => setShowOtp(false)} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm">
                {t("Verify & Continue", "सत्यापित करें और जारी रखें")}
              </button>
            </div>
          </div>
        )}

        {showScamOverlay && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-destructive">
            <div className="flex flex-col items-center gap-4 px-8 text-center">
              <AlertTriangle className="w-20 h-20 text-white animate-pulse" />
              <h1 className="text-2xl font-bold text-white uppercase tracking-tight">{t("Scam Detected!", "स्कैम मिला!")}</h1>
              <p className="text-white/80 text-sm leading-relaxed">{t("Do not pick up this call. Your UPI has been frozen for safety.", "यह कॉल न उठाएं। आपकी सुरक्षा के लिए UPI फ्रीज कर दिया गया है।")}</p>
              <div className="text-5xl font-bold font-mono text-white tabular-nums mt-4">00:{scamFreezeTimer.toString().padStart(2, "0")}</div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
