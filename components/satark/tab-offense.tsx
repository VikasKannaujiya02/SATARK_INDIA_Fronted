"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
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

  useEffect(() => {
    const hasActive = agents.some((a) => a.active)
    if (!hasActive) return
    const interval = setInterval(() => setCallSeconds((p) => p + 1), 1000)
    return () => clearInterval(interval)
  }, [agents])

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
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

  return (
    <div className="flex flex-col gap-4 p-4 pb-6">
      <div>
        <h2 className={cn("font-bold text-foreground", isElderly ? "text-xl" : "text-lg")}>
          {t("Honeypot Agents", "हनीपॉट एजेंट्स")}
        </h2>
        <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-sm" : "text-xs")}>
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
        {agents.map((agent) => (
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
                        '"नमस्ते सर, मैं बिजली बोर्ड से कॉल कर रहा हूं..."'
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
                  ? t("Deactivate Agent", "एजेंट निष्क्रिय करें")
                  : t("Activate Agent", "एजेंट सक्रिय करें")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fake Evidence Generator */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-chart-5/15">
              <Receipt className="w-5 h-5 text-[#FFD600]" />
            </div>
            <div>
              <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
                {t("Fake Evidence Generator", "फर्जी सबूत जेनरेटर")}
              </h3>
              <p className={cn("text-muted-foreground", isElderly ? "text-xs" : "text-[10px]")}>
                {t("Generate decoy receipts to bait scammers", "स्कैमर्स को फंसाने के लिए नकली रसीद बनाएं")}
              </p>
            </div>
          </div>

          {receiptGenerated && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className={cn("text-accent font-medium", isElderly ? "text-sm" : "text-xs")}>
                {t("Decoy receipt generated!", "नकली रसीद बनाई गई!")}
              </span>
            </div>
          )}

          <button
            onClick={handleGenerateReceipt}
            disabled={generatingReceipt}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all active:scale-[0.97]",
              generatingReceipt
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
            )}
          >
            {generatingReceipt ? (
              <>
                <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                <span className={cn(isElderly ? "text-sm" : "text-xs")}>
                  {t("Generating...", "बना रहे हैं...")}
                </span>
              </>
            ) : (
              <>
                <Receipt className={cn(isElderly ? "w-5 h-5" : "w-4 h-4")} />
                <span className={cn(isElderly ? "text-sm" : "text-xs")}>
                  {t("Generate Fake Receipt", "नकली रसीद बनाएं")}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
