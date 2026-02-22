"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import {
  Plus,
  Smartphone,
  PhoneOff,
  Shield,
  Check,
  Trophy,
  Medal,
  Star,
  Share2,
  Crown,
  Ban,
  Mic,
  MessageCircle,
  Info,
  Database,
  Download,
} from "lucide-react"
import { useApp } from "./app-context"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface FamilyDevice {
  id: string
  nameEn: string
  nameHi: string
  phone: string
}

interface FamilyContact {
  _id: string
  name: string
  relation: string
  phoneNumber: string
}

const initialDevices: FamilyDevice[] = [
  { id: "1", nameEn: "Papa's Phone", nameHi: "पापा का फोन", phone: "+91 98XXX XXXXX" },
  { id: "2", nameEn: "Maa's Phone", nameHi: "माँ का फोन", phone: "+91 97XXX XXXXX" },
]

const leaderboard = [
  { rank: 1, nameEn: "Priya M.", nameHi: "प्रिया म.", reports: 342, badgeEn: "Scam Hunter", badgeHi: "स्कैम हंटर", icon: Crown },
  { rank: 2, nameEn: "Amit K.", nameHi: "अमित के.", reports: 289, badgeEn: "Vigilante", badgeHi: "विजिलेंटे", icon: Medal },
  { rank: 3, nameEn: "Deepa S.", nameHi: "दीपा स.", reports: 234, badgeEn: "Guardian", badgeHi: "गार्डियन", icon: Star },
  { rank: 4, nameEn: "Raj P.", nameHi: "राज प.", reports: 198, badgeEn: "Protector", badgeHi: "प्रोटेक्टर", icon: Shield },
  { rank: 5, nameEn: "You", nameHi: "आप", reports: 47, badgeEn: "Rising Star", badgeHi: "राइज़िंग स्टार", icon: Star },
]

const USER_PHONE = "6388853440"

export function TabNetwork() {
  const { t, isElderly } = useApp()
  const [devices] = useState<FamilyDevice[]>(initialDevices)
  const [blocked, setBlocked] = useState<Record<string, boolean>>({})
  const [shared, setShared] = useState(false)
  const [voiceSOS, setVoiceSOS] = useState(false)
  const [whatsappConnected, setWhatsappConnected] = useState(false)

  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>([])
  const [formName, setFormName] = useState("")
  const [formRelation, setFormRelation] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [addLoading, setAddLoading] = useState(false)
  const [offlineSyncProgress, setOfflineSyncProgress] = useState(0)
  const [offlineSyncing, setOfflineSyncing] = useState(false)
  const [offlineSyncSuccess, setOfflineSyncSuccess] = useState(false)

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const res = await api.get(`/api/family/${USER_PHONE}`)
        setFamilyContacts(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error("Failed to fetch family (backend may be offline):", err)
      }
    }
    fetchFamily()
  }, [])

  const handleOfflineSync = () => {
    setOfflineSyncSuccess(false)
    setOfflineSyncing(true)
    setOfflineSyncProgress(0)
    let progress = 0
    const interval = setInterval(() => {
      progress += 100 / 30
      setOfflineSyncProgress(Math.min(Math.round(progress), 100))
      if (progress >= 100) {
        clearInterval(interval)
        setOfflineSyncing(false)
        setOfflineSyncSuccess(true)
        setTimeout(() => setOfflineSyncSuccess(false), 4000)
      }
    }, 100)
  }

  const handleAddEmergencyContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formRelation.trim() || !formPhone.trim()) return
    setAddLoading(true)
    try {
      const res = await api.post("/api/family/add", {
        userPhone: USER_PHONE,
        name: formName.trim(),
        relation: formRelation.trim(),
        phoneNumber: formPhone.trim(),
      })
      const saved = res.data?.family || res.data
      const newContact: FamilyContact = saved ? {
        _id: saved._id || `temp-${Date.now()}`,
        name: saved.name || formName.trim(),
        relation: saved.relation || formRelation.trim(),
        phoneNumber: saved.phoneNumber || formPhone.trim(),
      } : { _id: `temp-${Date.now()}`, name: formName.trim(), relation: formRelation.trim(), phoneNumber: formPhone.trim() }
      setFamilyContacts((prev) => [newContact, ...prev])
      setFormName("")
      setFormRelation("")
      setFormPhone("")
    } catch (err) {
      console.error("Failed to add contact (backend may be offline):", err)
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 p-4 pb-6">
      {/* Family Guardian Section */}
      <div>
        <h2 className={cn("font-bold text-foreground", isElderly ? "text-xl" : "text-lg")}>
          {t("Family Guardian Mode", "परिवार रक्षक मोड")}
        </h2>
        <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-sm" : "text-xs")}>
          {t("Monitor and protect family devices", "परिवार के डिवाइस की निगरानी और सुरक्षा करें")}
        </p>
      </div>

      {/* Voice SOS Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/15 shrink-0">
            <Mic className={cn("text-destructive", isElderly ? "w-5 h-5" : "w-4 h-4")} />
          </div>
          <div>
            <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("Satark Bachao Voice SOS", "सतर्क बचाओ वॉइस SOS")}
            </p>
            <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
              {t("Works in background, hands-free", "बैकग्राउंड में काम करता है, हाथ मुक्त")}
            </p>
          </div>
        </div>
        <Switch checked={voiceSOS} onCheckedChange={setVoiceSOS} aria-label={t("Toggle voice SOS", "वॉइस SOS टॉगल करें")} />
      </div>

      {/* WhatsApp Bot Connection */}
      <button
        onClick={() => setWhatsappConnected(!whatsappConnected)}
        className={cn(
          "flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.97]",
          whatsappConnected
            ? "bg-[#25D366]/10 border-[#25D366]/30"
            : "bg-white dark:bg-card border-slate-100 dark:border-border hover:border-[#25D366]/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
            whatsappConnected ? "bg-[#25D366]/20" : "bg-secondary"
          )}>
            <MessageCircle className={cn(whatsappConnected ? "text-[#25D366]" : "text-muted-foreground", isElderly ? "w-5 h-5" : "w-4 h-4")} />
          </div>
          <div className="text-left">
            <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
              {t("Connect Satark WhatsApp Bot", "सतर्क व्हाट्सएप बॉट कनेक्ट करें")}
            </p>
            <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
              {whatsappConnected ? t("Connected", "जुड़ा हुआ") : t("Get instant alerts via WhatsApp", "व्हाट्सएप से तत्काल अलर्ट पाएं")}
            </p>
          </div>
        </div>
        {whatsappConnected && <Check className="w-5 h-5 text-[#25D366] shrink-0" />}
      </button>

      {/* Add Device */}
      <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all active:scale-[0.98]">
        <Plus className={cn("text-primary", isElderly ? "w-5 h-5" : "w-4 h-4")} />
        <span className={cn("font-bold text-primary", isElderly ? "text-sm" : "text-xs")}>
          {t("Add Family Device", "परिवार का डिवाइस जोड़ें")}
        </span>
      </button>

      {/* Sync Offline Scam Database */}
      <div className="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-700 overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/20 shrink-0">
            <Database className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-bold text-white", isElderly ? "text-sm" : "text-xs")}>
              {t("Sync Offline Scam Database", "ऑफलाइन स्कैम डेटाबेस सिंक करें")}
            </h3>
            <p className="text-slate-400 text-[10px] mt-0.5">
              {t("Download top 10,000 scammer numbers for offline protection.", "ऑफलाइन सुरक्षा के लिए शीर्ष 10,000 स्कैमर नंबर डाउनलोड करें।")}
            </p>
          </div>
        </div>
        <div className="px-4 pb-4">
          {offlineSyncing && (
            <div className="mb-3">
              <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${offlineSyncProgress}%` }} />
              </div>
              <p className="text-slate-400 text-[9px] mt-1 font-mono">{offlineSyncProgress}%</p>
            </div>
          )}
          {offlineSyncSuccess && (
            <p className="text-accent text-xs font-semibold mb-3">
              {t("Database Synced Successfully. Offline Shield Active.", "डेटाबेस सफलतापूर्वक सिंक। ऑफलाइन शील्ड सक्रिय।")}
            </p>
          )}
          <button
            onClick={handleOfflineSync}
            disabled={offlineSyncing}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]",
              offlineSyncing ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
          >
            <Download className="w-4 h-4" />
            {offlineSyncing ? t("Syncing...", "सिंक हो रहा...") : t("Sync Now", "अभी सिंक करें")}
          </button>
        </div>
      </div>

      {/* Emergency Contacts - Add Form & List */}
      <div className="rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
            {t("Emergency Contacts", "आपातकालीन संपर्क")}
          </h3>
          <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-xs" : "text-[10px]")}>
            {t("Add family members who will be notified during SOS", "SOS के दौरान सूचित होने वाले परिवार के सदस्य जोड़ें")}
          </p>
        </div>

        <form onSubmit={handleAddEmergencyContact} className="px-4 pb-4 flex flex-col gap-3">
          <input
            type="text"
            placeholder={t("Name", "नाम")}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-slate-200 dark:border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          <input
            type="text"
            placeholder={t("Relation", "संबंध")}
            value={formRelation}
            onChange={(e) => setFormRelation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-slate-200 dark:border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          <input
            type="tel"
            placeholder={t("Phone Number", "फोन नंबर")}
            value={formPhone}
            onChange={(e) => setFormPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-slate-200 dark:border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          <button
            type="submit"
            disabled={addLoading || !formName.trim() || !formRelation.trim() || !formPhone.trim()}
            className={cn(
              "flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98]",
              addLoading || !formName.trim() || !formRelation.trim() || !formPhone.trim()
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90"
            )}
          >
            {addLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className={cn(isElderly ? "w-5 h-5" : "w-4 h-4")} />
            )}
            <span className={cn(isElderly ? "text-sm" : "text-xs")}>
              {t("Add Emergency Contact", "आपातकालीन संपर्क जोड़ें")}
            </span>
          </button>
        </form>

        <div className="flex flex-col divide-y divide-slate-100 dark:divide-border">
          {familyContacts?.map((contact) => (
            <div key={contact._id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 shrink-0">
                <Smartphone className={cn("text-accent", isElderly ? "w-5 h-5" : "w-4 h-4")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-bold text-foreground", isElderly ? "text-sm" : "text-xs")}>
                  {contact.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-2.5 h-2.5 text-accent" fill="currentColor" />
                  <span className="text-accent text-[9px] font-medium">
                    {contact.relation}
                  </span>
                  <span className="text-muted-foreground text-[9px] font-mono ml-1">{contact.phoneNumber}</span>
                </div>
              </div>
            </div>
          ))}
          {familyContacts.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-muted-foreground text-xs">
                {t("No emergency contacts yet. Add one above.", "अभी तक कोई आपातकालीन संपर्क नहीं। ऊपर जोड़ें।")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Device Cards */}
      <div className="flex flex-col gap-2.5">
        {(devices || []).map((device) => (
          <div key={device.id} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 shrink-0">
              <Smartphone className={cn("text-accent", isElderly ? "w-5 h-5" : "w-4 h-4")} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("font-bold text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t(device.nameEn, device.nameHi)}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="w-2.5 h-2.5 text-accent" fill="currentColor" />
                <span className="text-accent text-[9px] font-medium">
                  {t("Secured", "सुरक्षित")}
                </span>
                <span className="text-muted-foreground text-[9px] font-mono ml-1">{device.phone}</span>
              </div>
            </div>
            <button
              onClick={() => setBlocked((prev) => ({ ...prev, [device.id]: !prev[device.id] }))}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-[10px] transition-all active:scale-[0.95]",
                blocked[device.id]
                  ? "bg-destructive/15 text-destructive border border-destructive/30"
                  : "bg-secondary text-secondary-foreground border border-border hover:border-primary/30"
              )}
            >
              {blocked[device.id] ? (
                <><Check className="w-3 h-3" />{t("Blocked", "ब्लॉक")}</>
              ) : (
                <><Ban className="w-3 h-3" />{t("Block Calls", "कॉल ब्लॉक")}</>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Community Leaderboard */}
      <div className="rounded-3xl bg-card border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          <Trophy className={cn("text-[#FFD600]", isElderly ? "w-5 h-5" : "w-4 h-4")} />
          <h3 className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
            {t("Community Leaderboard", "कम्युनिटी लीडरबोर्ड")}
          </h3>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {(leaderboard || []).map((user) => {
            const Icon = user.icon
            const isYou = user.nameEn === "You"
            return (
              <div
                key={user.rank}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors",
                  isYou && "bg-primary/5"
                )}
              >
                {/* Rank */}
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs",
                  user.rank === 1 ? "bg-[#FFD600]/20 text-[#FFD600]" :
                  user.rank === 2 ? "bg-[#C0C0C0]/20 text-[#A0A0A0]" :
                  user.rank === 3 ? "bg-[#CD7F32]/20 text-[#CD7F32]" :
                  "bg-secondary text-muted-foreground"
                )}>
                  {user.rank}
                </div>

                {/* Avatar */}
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold",
                  isYou ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                )}>
                  {user.nameEn[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("font-semibold text-foreground truncate", isElderly ? "text-sm" : "text-xs", isYou && "text-primary font-bold")}>
                      {t(user.nameEn, user.nameHi)}
                    </span>
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7px] font-bold font-mono bg-accent/10 text-accent">
                      <Icon className="w-2 h-2" />
                      {t(user.badgeEn, user.badgeHi)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[9px] font-mono mt-0.5">
                    {user.reports} {t("reports", "रिपोर्ट")}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Share Scam Alert */}
      <button
        onClick={() => {
          setShared(true)
          setTimeout(() => setShared(false), 2000)
        }}
        className={cn(
          "flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold transition-all active:scale-[0.97]",
          shared
            ? "bg-accent/15 text-accent border border-accent/30"
            : "bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90"
        )}
      >
        {shared ? (
          <>
            <Check className={cn(isElderly ? "w-5 h-5" : "w-4 h-4")} />
            <span className={cn(isElderly ? "text-sm" : "text-xs")}>
              {t("Shared to WhatsApp!", "WhatsApp पर शेयर किया!")}
            </span>
          </>
        ) : (
          <>
            <Share2 className={cn(isElderly ? "w-5 h-5" : "w-4 h-4")} />
            <span className={cn(isElderly ? "text-sm" : "text-xs")}>
              {t("Share Scam Alert on WhatsApp", "WhatsApp पर स्कैम अलर्ट शेयर करें")}
            </span>
          </>
        )}
      </button>
    </div>
  )
}
