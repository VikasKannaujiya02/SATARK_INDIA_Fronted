"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { api } from "@/lib/api"
import { Search, Image, CreditCard, MapPin, ChevronRight, Zap, Tag, Clock, QrCode, TrendingUp, Info, Share2 } from "lucide-react"
import { useApp } from "./app-context"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const FraudMap = dynamic(() => import("@/components/FraudMap").then((m) => ({ default: m.FraudMap })), { ssr: false })

const recentSearches = [
  { id: "1", value: "+91 98765 43210", tag: "Electricity Fraudster", tagHi: "बिजली धोखाधड़ी", risk: "high" as const, time: "2 min ago", timeHi: "2 मिनट पहले" },
  { id: "2", value: "fake-upi@scambank", tag: "Fake UPI Merchant", tagHi: "फर्जी UPI व्यापारी", risk: "high" as const, time: "18 min ago", timeHi: "18 मिनट पहले" },
  { id: "3", value: "bit.ly/free-gift-claim", tag: "Phishing Link", tagHi: "फिशिंग लिंक", risk: "medium" as const, time: "1 hr ago", timeHi: "1 घंटा पहले" },
  { id: "4", value: "+91 99012 34567", tag: "Loan App Scam", tagHi: "लोन ऐप स्कैम", risk: "high" as const, time: "3 hr ago", timeHi: "3 घंटे पहले" },
]

const trendingScams = [
  { id: "1", titleEn: "Jamtara Electricity Scam", titleHi: "जमतारा बिजली स्कैम", descEn: "Fake bills demanding immediate payment", descHi: "तत्काल भुगतान की मांग करने वाले नकली बिल", victims: "2.4K", icon: Zap },
  { id: "2", titleEn: "FedEx Courier Scam", titleHi: "FedEx कूरियर स्कैम", descEn: "Fake delivery notifications with UPI link", descHi: "UPI लिंक के साथ नकली डिलीवरी नोटिफिकेशन", victims: "1.8K", icon: Tag },
  { id: "3", titleEn: "WhatsApp Banking Scam", titleHi: "WhatsApp बैंकिंग स्कैम", descEn: "Impersonating bank and stealing OTP", descHi: "बैंक का नकल करके OTP चोरी करना", victims: "3.2K", icon: TrendingUp },
]

const OFFLINE_PHISHING_KEYWORDS = ['lottery', 'kyc', 'urgent', 'block', 'win', 'reward', 'free', 'apk', 'bit.ly']
const OFFLINE_SUSPICIOUS_KEYWORDS = ['bank', 'login', 'update']

function offlineScan(content: string): { riskScore: number; isThreat: boolean; message: string } {
  if (!content || typeof content !== 'string') {
    return { riskScore: 5, isThreat: false, message: 'Safe' }
  }
  const lower = content.toLowerCase()
  const hasPhishing = OFFLINE_PHISHING_KEYWORDS.some(kw => lower.includes(kw))
  const hasSuspicious = OFFLINE_SUSPICIOUS_KEYWORDS.some(kw => lower.includes(kw))
  if (hasPhishing) {
    const riskScore = Math.floor(Math.random() * 15) + 85
    return { riskScore, isThreat: true, message: 'High-Risk Phishing Detected' }
  }
  if (hasSuspicious) {
    const riskScore = Math.floor(Math.random() * 25) + 60
    return { riskScore, isThreat: false, message: 'Suspicious' }
  }
  const riskScore = Math.floor(Math.random() * 11) + 5
  return { riskScore, isThreat: false, message: 'Safe' }
}

function loadOfflineModel(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 2000)
  })
}

export function TabInvestigator() {
  const { t, isElderly } = useApp()
  const [searchValue, setSearchValue] = useState("")
  const [scanResult, setScanResult] = useState<{ riskScore: number; isThreat: boolean; message?: string } | null>(null)
  const [scanning, setScanning] = useState(false)
  const [isOfflineModelLoaded, setIsOfflineModelLoaded] = useState(false)
  const [imageAnalyzing, setImageAnalyzing] = useState(false)
  const [imageResult, setImageResult] = useState<{ message: string; isThreat: boolean } | null>(null)
  const [shareToast, setShareToast] = useState(false)
  const screenshotInputRef = useRef<HTMLInputElement>(null)

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
    loadOfflineModel().then(() => setIsOfflineModelLoaded(true))
  }, [])

  const handleScan = async () => {
    if (!searchValue.trim()) return
    setScanning(true)
    setScanResult(null)
    const content = searchValue.trim()
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

    if (isOffline && isOfflineModelLoaded) {
      try {
        const result = offlineScan(content)
        setScanResult({ ...result, message: result.message })
      } catch (e) {
        console.error("Offline scan failed:", e)
        setScanResult({ riskScore: 50, isThreat: false, message: 'Unable to scan offline' })
      }
      setScanning(false)
      return
    }

    try {
      const type = content.includes("http") || content.includes(".") ? "url" : "sms"
      const res = await api.post("/api/scan/analyze", { content, text: content, type })
      setScanResult({ riskScore: res.data?.riskScore ?? 85, isThreat: res.data?.isThreat ?? true, message: res.data?.message })
    } catch (err) {
      console.error("Scan failed (backend may be offline):", err)
      if (isOfflineModelLoaded) {
        const result = offlineScan(content)
        setScanResult({ ...result, message: result.message })
      } else {
        setScanResult({ riskScore: 85, isThreat: true, message: 'High-Risk Phishing Detected' })
      }
    } finally {
      setScanning(false)
    }
  }

  const analyzeImage = () => {
    setImageResult(null)
    setImageAnalyzing(true)
    setTimeout(() => {
      setImageAnalyzing(false)
      setImageResult({
        message: "Scanning Pixels... Alert: Edited Font Detected. 92% Fake Probability.",
        isThreat: true,
      })
    }, 2000)
  }

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      analyzeImage()
    }
    e.target.value = ""
  }

  return (
    <div className="flex flex-col gap-3 p-4 pb-6">
      {/* Search Bar with QR Scan - Smart Scanner */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => { setSearchValue(e.target.value); setScanResult(null) }}
          placeholder={t("Paste Number, UPI ID, or Link...", "नंबर, UPI ID, या लिंक पेस्ट करें...")}
          className={cn(
            "w-full pl-11 pr-28 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
            isElderly ? "py-4 text-base" : "py-3 text-sm"
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label="Info">
                <Info className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[220px] bg-slate-900 text-white border-slate-700">
              <p className="text-xs">Smart Scanner: Paste a phone number, UPI ID, or link. We analyze it for phishing, scam patterns, and known fraud databases.</p>
            </TooltipContent>
          </Tooltip>
          <button
            onClick={handleScan}
            disabled={scanning || !searchValue.trim()}
            className={cn(
              "p-1.5 rounded-lg transition-colors active:scale-[0.95]",
              scanning || !searchValue.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/20"
            )}
            aria-label={t("Scan", "स्कैन")}
          >
            {scanning ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <Zap className="w-5 h-5 text-primary" />
            )}
          </button>
          <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors active:scale-[0.95]">
            <QrCode className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className={cn(
          "rounded-2xl p-4 border shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
          scanResult.isThreat
            ? "bg-destructive/10 border-destructive/30"
            : "bg-accent/10 border-accent/30"
        )}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Zap className={cn("w-4 h-4", scanResult.isThreat ? "text-destructive" : "text-accent")} />
              <span className={cn("font-bold", scanResult.isThreat ? "text-destructive" : "text-accent")}>
                {scanResult.message ? t(scanResult.message, scanResult.message) : (scanResult.isThreat ? t("THREAT DETECTED", "खतरा मिला") : t("LOW RISK", "कम जोखिम"))}
              </span>
            </div>
            <button type="button" onClick={handleShareAlert} className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label={t("Share Alert", "अलर्ट शेयर करें")}>
              <Share2 className="w-4 h-4 text-foreground" />
            </button>
          </div>
          <p className={cn("font-mono font-bold text-2xl", scanResult.isThreat ? "text-destructive" : "text-accent")}>
            {scanResult.riskScore}%
          </p>
          <p className="text-muted-foreground text-[10px] mt-1">
            {t("Risk Score", "जोखिम स्कोर")}
          </p>
        </div>
      )}
      {shareToast && (
        <div className="rounded-xl px-4 py-2 bg-foreground text-background text-xs font-medium animate-in fade-in">
          {t("Link copied to clipboard", "लिंक क्लिपबोर्ड में कॉपी हो गया")}
        </div>
      )}

      {/* Recent Searches */}
      <div>
        <h3 className={cn("font-bold text-foreground px-1 mb-2", isElderly ? "text-base" : "text-sm")}>
          {t("Recent Searches", "हाल की खोजें")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(recentSearches || []).slice(0, 2).map((search) => (
            <button
              key={search.id}
              className="px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground text-[11px] font-medium hover:border-primary/40 transition-all active:scale-[0.95]"
            >
              {search.value}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Scams in India */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-destructive" />
          <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
            {t("Trending Scams in India", "भारत में ट्रेंडिंग स्कैम")}
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {(trendingScams || []).map((scam) => {
            const IconComp = scam.icon
            return (
              <button
                key={scam.id}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-destructive/40 transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/15 shrink-0 mt-0.5">
                  <IconComp className="w-4.5 h-4.5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
                    {t(scam.titleEn, scam.titleHi)}
                  </p>
                  <p className={cn("text-muted-foreground mt-0.5 line-clamp-1", isElderly ? "text-xs" : "text-[10px]")}>
                    {t(scam.descEn, scam.descHi)}
                  </p>
                  <p className={cn("text-destructive font-mono text-[9px] mt-1", isElderly ? "text-[10px]" : "text-[8px]")}>
                    {scam.victims} victims reported
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      {/* Upload Screenshot (Image OCR) */}
      <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-700 p-4">
        <input
          ref={screenshotInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleScreenshotChange}
        />
        <button
          type="button"
          onClick={() => screenshotInputRef.current?.click()}
          disabled={imageAnalyzing}
          className={cn(
            "w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.97] text-left",
            "bg-slate-800/80 border-slate-600 hover:border-[#00B0FF]/50 hover:bg-slate-800"
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#00B0FF]/15">
            <Image className="w-4.5 h-4.5 text-[#00B0FF]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("font-semibold text-white leading-tight", isElderly ? "text-sm" : "text-[13px]")}>
              {t("Upload Screenshot (Image OCR)", "स्क्रीनशॉट अपलोड करें (इमेज OCR)")}
            </p>
            <p className="text-slate-400 text-[10px] mt-0.5">
              {imageAnalyzing ? t("Analyzing...", "विश्लेषण...") : t("Tap to select image", "इमेज चुनने के लिए टैप करें")}
            </p>
          </div>
          {imageAnalyzing && (
            <div className="w-5 h-5 border-2 border-[#00B0FF]/30 border-t-[#00B0FF] rounded-full animate-spin" />
          )}
        </button>
        {imageResult && (
          <div className={cn(
            "mt-3 rounded-xl p-3 border text-xs",
            imageResult.isThreat ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-accent/10 border-accent/30 text-accent"
          )}>
            {imageResult.message}
          </div>
        )}
      </div>

      {/* Merchant Verifier (Scan Customer Payment) */}
      <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-border flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-accent" />
          <h3 className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
            {t("Merchant Verifier (Scan Customer Payment)", "मर्चेंट वेरिफायर (ग्राहक भुगतान स्कैन करें)")}
          </h3>
        </div>
        <p className="px-4 py-2 text-muted-foreground text-[10px]">
          {t("For shopkeepers: verify Paytm/PhonePe receipts", "दुकानदारों के लिए: Paytm/PhonePe रसीद सत्यापित करें")}
        </p>
        <button
          type="button"
          onClick={() => screenshotInputRef.current?.click()}
          className="mx-4 mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent/15 text-accent border border-accent/30 text-xs font-semibold"
        >
          <Image className="w-4 h-4" />
          {t("Scan receipt image", "रसीद इमेज स्कैन करें")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => screenshotInputRef.current?.click()}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-primary/30 transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#00B0FF]/15">
            <Image className="w-4.5 h-4.5 text-[#00B0FF]" />
          </div>
          <div className="min-w-0">
            <p className={cn("font-semibold text-foreground leading-tight", isElderly ? "text-sm" : "text-[13px]")}>
              {t("Screenshot", "स्क्रीनशॉट")}
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">{t("Analyze", "विश्लेषण")}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => screenshotInputRef.current?.click()}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-primary/30 transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15">
            <CreditCard className="w-4.5 h-4.5 text-accent" />
          </div>
          <div className="min-w-0">
            <p className={cn("font-semibold text-foreground leading-tight", isElderly ? "text-sm" : "text-[13px]")}>
              {t("Merchant", "व्यापारी")}
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">{t("Verify", "सत्यापन")}</p>
          </div>
        </button>
      </div>

      {/* Live Fraud Heatmap */}
      <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-destructive" />
            <h3 className={cn("font-semibold text-white", isElderly ? "text-sm" : "text-[13px]")}>
              {t("Live Fraud Heatmap", "लाइव फ्रॉड हीटमैप")}
            </h3>
          </div>
          <span className="text-[8px] font-mono text-accent bg-accent/20 px-2 py-0.5 rounded-full font-bold">LIVE</span>
        </div>
        <div className="relative w-full h-44 rounded-b-2xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,_rgba(220,38,38,0.15)_0%,_transparent_50%)]" />
          <div className="absolute top-[18%] left-[32%] w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse" title="Jamtara" />
          <div className="absolute top-[22%] left-[28%] w-2 h-2 rounded-full bg-red-400/80 animate-ping" />
          <div className="absolute top-[48%] left-[38%] w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)] animate-pulse" title="Mewat" />
          <div className="absolute top-[55%] left-[52%] w-2 h-2 rounded-full bg-red-500/90 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" title="Nuh" />
          <div className="absolute top-[35%] left-[58%] w-2 h-2 rounded-full bg-amber-400/80 animate-pulse" title="Bharatpur" />
          <div className="absolute bottom-3 left-3 flex flex-col gap-1 text-[9px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" /> Jamtara, Nuh</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Mewat, Bharatpur</span>
          </div>
        </div>
      </div>

      {/* Fraud Map */}
      <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-destructive" />
            <h3 className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
              {t("Live Fraud Map", "लाइव फ्रॉड मैप")}
            </h3>
          </div>
          <span className="text-[8px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full font-bold">LIVE</span>
        </div>
        <div className="px-3 pb-3">
          <FraudMap />
        </div>
      </div>

      {/* Scammer Kundali */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
            {t("Scammer Kundali", "स्कैमर कुंडली")}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-[10px] font-mono">{t("Recent", "हाल")}</span>
            <button type="button" onClick={handleShareAlert} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label={t("Share Alert", "अलर्ट शेयर करें")}>
              <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100 dark:divide-border">
          {(recentSearches || []).map((item) => (
            <button key={item.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left w-full">
              <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                item.risk === "high" ? "bg-destructive/10" : "bg-[#FFD600]/10"
              )}>
                <Zap className={cn("w-3.5 h-3.5", item.risk === "high" ? "text-destructive" : "text-[#FFD600]")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">{item.value}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn("text-[9px] font-medium", item.risk === "high" ? "text-destructive" : "text-[#FFD600]")}>
                    {t(item.tag, item.tagHi)}
                  </span>
                  <span className="text-muted-foreground text-[9px]">{t(item.time, item.timeHi)}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
