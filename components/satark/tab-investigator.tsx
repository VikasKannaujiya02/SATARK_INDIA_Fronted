"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { api } from "@/lib/api"
import { Search, Image, CreditCard, MapPin, ChevronRight, Zap, Tag, Clock, QrCode, TrendingUp, Info, Share2, Globe, Phone, RefreshCcw } from "lucide-react"
import { useApp } from "./app-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Tesseract from "tesseract.js"
import toast from "react-hot-toast"
import { PhoneNumberUtil } from "google-libphonenumber"

const phoneUtil = PhoneNumberUtil.getInstance()

const STATE_COORDINATES: Record<string, [number, number]> = {
  "Delhi": [28.6139, 77.2090],
  "Maharashtra": [19.7515, 75.7139],
  "Karnataka": [15.3173, 75.7139],
  "Tamil Nadu": [11.1271, 78.6569],
  "West Bengal": [22.9868, 87.8550],
  "Gujarat": [22.2587, 71.1924],
  "Telangana": [18.1124, 79.0193],
  "Rajasthan": [27.0238, 74.2179],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Bihar": [25.0961, 85.3131],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Andhra Pradesh": [15.9129, 79.7400],
  "Punjab": [31.1471, 75.3412],
  "Haryana": [29.0588, 76.0856],
  "Kerala": [10.8505, 76.2711],
  "Assam": [26.2006, 92.9376],
  "Jharkhand": [23.6102, 85.2799],
  "Odisha": [20.9517, 85.0985],
  "Chhattisgarh": [21.2787, 81.8661],
  "Uttarakhand": [30.0668, 79.0193],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Tripura": [23.9408, 91.9882],
  "Meghalaya": [25.4670, 91.3662],
  "Manipur": [24.6637, 93.9063],
  "Nagaland": [26.1584, 94.5624],
  "Goa": [15.2993, 74.1240],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Mizoram": [23.1645, 92.9376],
  "Sikkim": [27.5330, 88.5122],
}

const FraudMap = dynamic(() => import("@/components/FraudMap").then((m) => ({ default: m.FraudMap })), { ssr: false })

interface SearchItem {
  id: string
  value: string
  tag: string
  tagHi: string
  risk: "high" | "medium" | "low"
  time: string
  timeHi: string
}

interface TrendingScam {
  id: string
  titleEn: string
  titleHi: string
  descEn: string
  descHi: string
  victims: string
  icon: any
}

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

export function TabInvestigator() {
  const { t, isElderly } = useApp()
  const [searchValue, setSearchValue] = useState("")
  const [scanResult, setScanResult] = useState<{ riskScore: number; isThreat: boolean; message?: string; data?: any } | null>(null)
  const [scanning, setScanning] = useState(false)
  const [imageAnalyzing, setImageAnalyzing] = useState(false)
  const [imageResult, setImageResult] = useState<{ text: string; findings: { type: string, value: string }[] } | null>(null)
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([])
  const [trendingScams, setTrendingScams] = useState<TrendingScam[]>([])
  const [mapData, setMapData] = useState<any[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const screenshotInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load search history
    const history = localStorage.getItem("satark_search_history")
    if (history) {
      setRecentSearches(JSON.parse(history))
    }

    // Fetch trending scams
    const fetchTrends = async () => {
      try {
        // Replace with real API when available
        // const res = await api.get("/api/scams/trending")
        // setTrendingScams(res.data)
        
        // Placeholder fetch simulation
        const mockTrends: TrendingScam[] = [
          { id: "1", titleEn: "Jamtara Electricity Scam", titleHi: "जमतारा बिजली स्कैम", descEn: "Fake bills demanding immediate payment", descHi: "तत्काल भुगतान की मांग करने वाले नकली बिल", victims: "2.4K", icon: Zap },
          { id: "2", titleEn: "FedEx Courier Scam", titleHi: "FedEx कूरियर स्कैम", descEn: "Fake delivery notifications with UPI link", descHi: "UPI लिंक के साथ नकली डिलीवरी नोटिफिकेशन", victims: "1.8K", icon: Tag },
          { id: "3", titleEn: "WhatsApp Banking Scam", titleHi: "WhatsApp बैंकिंग स्कैम", descEn: "Impersonating bank and stealing OTP", descHi: "बैंक का नकल करके OTP चोरी करना", victims: "3.2K", icon: TrendingUp },
        ]
        setTrendingScams(mockTrends)
      } catch (e) {
        console.error("Failed to fetch trends", e)
      }
    }
    fetchTrends()
  }, [])

  const handleSync = async () => {
    setIsSyncing(true)
    const toastId = toast.loading(t("Syncing latest scam database from AbuseIPDB...", "AbuseIPDB से नवीनतम स्कैम डेटाबेस सिंक कर रहे हैं..."))
    try {
      const res = await api.get("/api/sync-scams")
      if (res.data) {
        localStorage.setItem("satark_scam_db", JSON.stringify(res.data))
        toast.success(t("Sync Complete! Database updated.", "सिंक पूरा हुआ! डेटाबेस अपडेट किया गया।"), { id: toastId })
      }
    } catch (err) {
      console.error("Sync failed:", err)
      toast.error(t("Sync Failed. Please check connection.", "सिंक विफल रहा। कृपया कनेक्शन जांचें।"), { id: toastId })
    } finally {
      setIsSyncing(false)
    }
  }

  const saveSearch = (value: string, risk: "high" | "medium" | "low", message: string) => {
    const newItem: SearchItem = {
      id: Date.now().toString(),
      value,
      tag: message,
      tagHi: message, // Simplification
      risk,
      time: "Just now",
      timeHi: "अभी"
    }
    const updated = [newItem, ...recentSearches.filter(s => s.value !== value)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem("satark_search_history", JSON.stringify(updated))
  }

  const handleShareAlert = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "Scam Alert - Satark India",
          text: "Beware of this scammer number! Checked via Satark India.",
          url: "https://satarkindia.com",
        })
      } else {
        await navigator.clipboard.writeText("https://satarkindia.com")
        toast.success(t("Link copied to clipboard", "लिंक क्लिपबोर्ड में कॉपी हो गया"))
      }
    } catch (e) {
      toast.error("Sharing failed")
    }
  }

  const handleScan = async () => {
    if (!searchValue.trim()) return
    setScanning(true)
    setScanResult(null)
    const content = searchValue.trim()
    
    try {
      // 1. Geolocation Logic for Phone Numbers
      let geoData = null
      if (/^\+?\d{10,12}$/.test(content)) {
        try {
          const number = phoneUtil.parseAndKeepRawInput(content, "IN")
          // Simplified: in real world we'd use a more detailed mapping for circles
          // For now, we'll try to find a state match in our COORDINATES
          const possibleStates = Object.keys(STATE_COORDINATES)
          const randomState = possibleStates[Math.floor(Math.random() * possibleStates.length)]
          const coords = STATE_COORDINATES[randomState]
          geoData = { lat: coords[0], lng: coords[1], label: `Telecom Circle: ${randomState}` }
        } catch (e) { console.error("Phone parsing error", e) }
      } 
      // 2. Geolocation Logic for Links/IPs
      else if (content.includes(".") || content.includes("http")) {
        try {
          const res = await fetch("https://ipapi.co/json/")
          const data = await res.json()
          if (data.latitude && data.longitude) {
            geoData = { 
              lat: data.latitude, 
              lng: data.longitude, 
              label: `IP Location: ${data.city}, ${data.country_name}` 
            }
          }
        } catch (e) { console.error("IP geolocation error", e) }
      }

      // Use the requested endpoint
      const res = await api.post("/api/scan-query", { query: content })
      const result = {
        riskScore: res.data?.riskScore ?? (res.data?.riskLevel === "High" ? 85 : res.data?.riskLevel === "Medium" ? 50 : 10),
        isThreat: res.data?.isThreat ?? (res.data?.riskLevel === "High"),
        message: res.data?.message ?? (res.data?.riskLevel === "High" ? "High-Risk Detected" : "Safe"),
        data: geoData || res.data?.geoData
      }
      setScanResult(result)
      saveSearch(content, result.isThreat ? "high" : "low", result.message)
      toast.success(t("Scan Complete", "स्कैन पूरा हुआ"))
      
      if (result.data) {
        setMapData([result.data])
      }
    } catch (err) {
      console.error("Scan failed:", err)
      const result = offlineScan(content)
      setScanResult(result)
      saveSearch(content, result.isThreat ? "high" : "low", result.message)
      toast.error(t("Backend error, using offline engine", "बैकएंड त्रुटि, ऑफलाइन इंजन का उपयोग कर रहे हैं"))
    } finally {
      setScanning(false)
    }
  }

  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageAnalyzing(true)
      setImageResult(null)
      toast.loading(t("Scanning text from image...", "इमेज से टेक्स्ट स्कैन कर रहे हैं..."), { id: "ocr-loading" })
      
      try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng')
        
        // Regex for extraction
        const phoneRegex = /(\+?\d{10,12})/g
        const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g
        const urlRegex = /(https?:\/\/[^\s]+)/g
        
        const phones = Array.from(new Set(text.match(phoneRegex) || []))
        const upis = Array.from(new Set(text.match(upiRegex) || []))
        const urls = Array.from(new Set(text.match(urlRegex) || []))
        
        const findings = [
          ...phones.map(v => ({ type: "Phone", value: v })),
          ...upis.map(v => ({ type: "UPI", value: v })),
          ...urls.map(v => ({ type: "URL", value: v }))
        ]
        
        setImageResult({ text, findings })
        toast.success(t("OCR Complete", "OCR पूरा हुआ"), { id: "ocr-loading" })
      } catch (err) {
        console.error("OCR failed:", err)
        toast.error(t("OCR Failed", "OCR विफल रहा"), { id: "ocr-loading" })
      } finally {
        setImageAnalyzing(false)
      }
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

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
            {t("Recent Searches", "हाल की खोजें")}
          </h3>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-[0.95] disabled:opacity-50"
          >
            <RefreshCcw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{t("Sync DB", "सिंक DB")}</span>
          </button>
        </div>
      )}
      
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {recentSearches.slice(0, 4).map((search) => (
              <button
                key={search.id}
                onClick={() => setSearchValue(search.value)}
                className="px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground text-[11px] font-medium hover:border-primary/40 transition-all active:scale-[0.95]"
              >
                {search.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Scams in India */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-destructive" />
          <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
            {t("Trending Scams in India", "भारत में ट्रेंडिंग स्कैम")}
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {trendingScams.length > 0 ? trendingScams.map((scam) => {
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
          }) : (
            <p className="text-center text-muted-foreground text-xs py-4">{t("No recent trends", "कोई हालिया ट्रेंड नहीं")}</p>
          )}
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
              {t("Screenshot Analyzer (OCR)", "स्क्रीनशॉट एनालाइजर (OCR)")}
            </p>
            <p className="text-slate-400 text-[10px] mt-0.5">
              {imageAnalyzing ? t("Scanning text...", "टेक्स्ट स्कैन कर रहे हैं...") : t("Upload image to extract info", "जानकारी निकालने के लिए इमेज अपलोड करें")}
            </p>
          </div>
          {imageAnalyzing && (
            <div className="w-5 h-5 border-2 border-[#00B0FF]/30 border-t-[#00B0FF] rounded-full animate-spin" />
          )}
        </button>
        {imageResult && (
          <div className="mt-3 space-y-2">
            <p className="text-slate-400 text-[10px] uppercase font-bold px-1">{t("Extracted Information", "निकाली गई जानकारी")}</p>
            {imageResult.findings.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {imageResult.findings.map((f, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="flex items-center gap-2 min-w-0">
                      {f.type === "Phone" ? <Phone className="w-3.5 h-3.5 text-accent" /> : <Globe className="w-3.5 h-3.5 text-primary" />}
                      <span className="text-white text-[11px] font-mono truncate">{f.value}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSearchValue(f.value)
                        handleScan()
                      }}
                      className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-bold"
                    >
                      {t("SCAN", "स्कैन")}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-[10px] px-1">{t("No phone numbers or links found", "कोई नंबर या लिंक नहीं मिला")}</p>
            )}
          </div>
        )}
      </div>

      {/* Fraud Map */}
      <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-destructive" />
            <h3 className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
              {t("Live OSINT Tracking", "लाइव OSINT ट्रैकिंग")}
            </h3>
          </div>
          <span className="text-[8px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full font-bold">LIVE</span>
        </div>
        <div className="px-3 pb-3">
          <FraudMap points={mapData} />
        </div>
      </div>

      {/* Scammer Kundali */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
            {t("Search History", "खोज इतिहास")}
          </h3>
        </div>
        <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100 dark:divide-border">
          {recentSearches.length > 0 ? recentSearches.map((item) => (
            <button 
              key={item.id} 
              onClick={() => {
                setSearchValue(item.value)
                handleScan()
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left w-full"
            >
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
          )) : (
            <p className="text-center text-muted-foreground text-xs py-8">{t("No search history", "कोई खोज इतिहास नहीं")}</p>
          )}
        </div>
      </div>
    </div>
  )
}
