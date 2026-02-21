"use client"

import { useState } from "react"
import { Search, Image, CreditCard, MapPin, ChevronRight, Zap, Tag, Clock, QrCode, TrendingUp } from "lucide-react"
import { useApp } from "./app-context"
import { cn } from "@/lib/utils"

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

export function TabInvestigator() {
  const { t, isElderly } = useApp()
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="flex flex-col gap-3 p-4 pb-6">
      {/* Search Bar with QR Scan */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t("Paste Number, UPI ID, or Link...", "नंबर, UPI ID, या लिंक पेस्ट करें...")}
          className={cn(
            "w-full pl-11 pr-12 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
            isElderly ? "py-4 text-base" : "py-3 text-sm"
          )}
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-secondary rounded-lg transition-colors active:scale-[0.95]">
          <QrCode className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Recent Searches */}
      <div>
        <h3 className={cn("font-bold text-foreground px-1 mb-2", isElderly ? "text-base" : "text-sm")}>
          {t("Recent Searches", "हाल की खोजें")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {recentSearches.slice(0, 2).map((search) => (
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
          {trendingScams.map((scam) => {
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
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-primary/30 transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left">
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
        <button className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-primary/30 transition-all active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-left">
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
          <div className="w-full h-40 rounded-xl bg-secondary/50 border border-border relative overflow-hidden">
            <svg viewBox="0 0 300 320" className="absolute inset-0 w-full h-full text-muted-foreground/20" fill="none">
              <path d="M150,20 L180,35 L200,30 L220,50 L230,40 L250,55 L260,80 L250,100 L260,120 L240,140 L250,160 L240,180 L250,200 L230,220 L210,250 L190,280 L170,300 L150,290 L140,270 L120,260 L100,240 L80,230 L70,200 L60,180 L50,160 L55,140 L60,120 L70,100 L80,80 L100,60 L120,40 L140,25 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div className="absolute top-[25%] left-[35%] w-3 h-3 rounded-full bg-destructive/60 animate-pulse" />
            <div className="absolute top-[25%] left-[35%] w-6 h-6 rounded-full bg-destructive/15 animate-ping" />
            <div className="absolute top-[55%] left-[25%] w-2.5 h-2.5 rounded-full bg-destructive/50 animate-pulse" />
            <div className="absolute top-[65%] left-[45%] w-2.5 h-2.5 rounded-full bg-[#FFD600]/60 animate-pulse" />
            <div className="absolute top-[40%] left-[60%] w-2 h-2 rounded-full bg-[#FFD600]/50 animate-pulse" />
            <div className="absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-[7px] font-mono text-muted-foreground">
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" /> High</span>
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FFD600] inline-block" /> Med</span>
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00B0FF] inline-block" /> Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scammer Kundali */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className={cn("font-semibold text-foreground", isElderly ? "text-sm" : "text-[13px]")}>
            {t("Scammer Kundali", "स्कैमर कुंडली")}
          </h3>
          <span className="text-muted-foreground text-[10px] font-mono">{t("Recent", "हाल")}</span>
        </div>
        <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden divide-y divide-slate-100 dark:divide-border">
          {recentSearches.map((item) => (
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
