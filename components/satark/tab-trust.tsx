"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import {
  ShieldCheck,
  KeyRound,
  Moon,
  Sun,
  Database,
  FileText,
  Scale,
  ScrollText,
  Trash2,
  ChevronRight,
  CheckCircle,
  Wifi,
  HardDrive,
  Eye,
  Gift,
  Users,
  ArrowRight,
  Star,
  MapPin,
  AlertTriangle,
  Power,
  Globe,
  Lock,
  User,
  Shield,
  Activity,
  Zap,
  Terminal,
  Save,
  Camera,
  LogOut,
  RefreshCcw,
} from "lucide-react"
import { useApp } from "./app-context"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import Link from "next/link"

const USER_PHONE_KEY = "satark_user_phone"
const USER_NAME_KEY = "satark_user_name"
const USER_AVATAR_KEY = "satark_user_avatar"

export function TabTrust() {
  const { t, isElderly, isDark, toggleDark, language, setLanguage } = useApp()
  const [privacyScreen, setPrivacyScreen] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)
  const [rateClicked, setRateClicked] = useState(false)
  const [trustScore, setTrustScore] = useState(100)
  const [reportsFiled, setReportsFiled] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [isKycVerified, setIsKycVerified] = useState(false)
  const [isInsured, setIsInsured] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isMaintenance, setIsMaintenance] = useState(false)

  // Profile State
  const [userName, setUserName] = useState("Vikas Kannaujiya")
  const [userPhone, setUserPhone] = useState("6388853440")
  const [userAvatar, setUserAvatar] = useState("")
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // System State
  const [appVersion, setAppVersion] = useState("1.0.0")
  const [storageUsed, setStorageUsed] = useState("0MB")

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [adminTab, setAdminTab] = useState<"health" | "threats" | "controls">("health")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [strictRateLimit, setStrictRateLimit] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile")
        if (res.data) {
          setUserName(res.data.name || "User")
          setUserPhone(res.data.phoneNumber || "")
          setUserAvatar(res.data.avatar || "")
          setTrustScore(res.data.trustScore ?? 100)
          setCurrentStreak(res.data.currentStreak ?? 0)
          setReportsFiled(res.data.reportsFiled ?? 0)
          setIsKycVerified(res.data.isKycVerified ?? false)
          setIsInsured(res.data.isInsured ?? false)
          
          if (res.data.settings) {
            setLanguage(res.data.settings.language || 'en')
            setNotificationsEnabled(res.data.settings.notifications ?? true)
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        // Only use localStorage if the initial API call fails
        const savedName = localStorage.getItem(USER_NAME_KEY)
        const savedPhone = localStorage.getItem(USER_PHONE_KEY)
        const savedAvatar = localStorage.getItem(USER_AVATAR_KEY)
        if (savedName) setUserName(savedName)
        if (savedPhone) setUserPhone(savedPhone)
        if (savedAvatar) setUserAvatar(savedAvatar)
      }
    }

    const fetchSystemInfo = async () => {
      try {
        const res = await api.get("/api/system/status")
        setAppVersion(res.data.version)
        setIsMaintenance(res.data.killSwitch)
      } catch (e) {}
      
      try {
        const res = await api.get("/api/user/storage-usage")
        setStorageUsed(res.data.size)
      } catch (e) {
        const reports = localStorage.getItem("satark_reports")
        const size = reports ? (reports.length / 1024).toFixed(1) : "0"
        setStorageUsed(`${size}KB`)
      }
    }

    fetchProfile()
    fetchSystemInfo()

    const doDailyCheckin = async () => {
      try {
        const res = await api.post("/api/trust/daily-checkin", { phone: userPhone })
        setTrustScore(res.data?.trustScore ?? 100)
        setCurrentStreak(res.data?.currentStreak ?? 0)
        if (res.data?.reportsFiled !== undefined) setReportsFiled(res.data.reportsFiled)
      } catch (err) {
        console.error("Daily check-in failed:", err)
      }
    }
    if (userPhone) doDailyCheckin()
  }, [userPhone, setLanguage])

  const handleSaveProfile = async () => {
    const toastId = toast.loading(t("Updating profile...", "प्रोफ़ाइल अपडेट कर रहे हैं..."))
    try {
      await api.put("/api/users/profile", { name: userName })
      
      // Update local storage too for fallback consistency
      localStorage.setItem(USER_NAME_KEY, userName)
      
      setIsEditingProfile(false)
      toast.success(t("Profile updated successfully", "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई"), { id: toastId })
    } catch (err) {
      console.error("Profile update failed:", err)
      toast.error(t("Failed to update profile", "प्रोफ़ाइल अपडेट करने में विफल"), { id: toastId })
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('avatar', file)

      const toastId = toast.loading(t("Uploading photo...", "फोटो अपलोड कर रहे हैं..."))
      try {
        const res = await api.post("/api/user/upload-avatar", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const newAvatar = res.data.avatar
        setUserAvatar(newAvatar)
        
        // Update local storage for fallback consistency
        localStorage.setItem(USER_AVATAR_KEY, newAvatar)
        
        toast.success(t("Photo updated", "फोटो अपडेट किया गया"), { id: toastId })
      } catch (err) {
        toast.error(t("Upload failed", "अपलोड विफल"), { id: toastId })
      }
    }
  }

  const handleInsurancePayment = async () => {
    const toastId = toast.loading(t("Initiating secure checkout...", "सुरक्षित चेकआउट शुरू कर रहे हैं..."))
    try {
      const { data: order } = await api.post("/api/insurance/pay")
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Satark India Insurance",
        description: "1 Year Cyber Fraud Coverage",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await api.post("/api/insurance/verify", response)
            if (verifyRes.data.success) {
              setIsInsured(true)
              toast.success(t("Insurance activated successfully!", "बीमा सफलतापूर्वक सक्रिय हो गया!"))
            }
          } catch (e) {
            toast.error(t("Verification failed", "सत्यापन विफल"))
          }
        },
        prefill: {
          name: userName,
          contact: userPhone
        },
        theme: {
          color: "#3b82f6"
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
      toast.dismiss(toastId)
    } catch (err) {
      toast.error(t("Payment failed to start", "भुगतान शुरू करने में विफल"), { id: toastId })
    }
  }

  const handleLanguageChange = async (lang: "en" | "hi") => {
    setLanguage(lang)
    try {
      await api.put("/api/user/settings", { language: lang })
      toast.success(t(`Language changed to ${lang === 'en' ? 'English' : 'Hindi'}`, `भाषा ${lang === 'hi' ? 'हिंदी' : 'अंग्रेजी'} में बदल दी गई`))
    } catch (e) {}
  }

  const handleToggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val)
    try {
      await api.put("/api/user/settings", { notifications: val })
      toast.success(val ? t("Notifications Enabled", "सूचनाएं सक्षम") : t("Notifications Disabled", "सूचनाएं अक्षम"))
    } catch (e) {}
  }

  const handleCheckUpdate = async () => {
    const toastId = toast.loading(t("Checking for updates...", "अपडेट की जांच हो रही है..."))
    try {
      const res = await api.get("/api/system/status")
      if (res.data.version !== appVersion) {
        toast.success(t(`New update available: ${res.data.version}`, `नया अपडेट उपलब्ध: ${res.data.version}`), { id: toastId })
      } else {
        toast.success(t("You are on the latest version", "आप नवीनतम संस्करण पर हैं"), { id: toastId })
      }
    } catch (e) {
      toast.error(t("Update check failed", "अपडेट जांच विफल"), { id: toastId })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("satark_token")
    localStorage.removeItem(USER_PHONE_KEY)
    window.location.href = "/login"
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === "satarkadmin") {
      setIsAdminLoggedIn(true)
      toast.success(t("Admin Login Successful", "एडमिन लॉगिन सफल"))
    } else {
      toast.error(t("Invalid Password", "गलत पासवर्ड"))
    }
    setAdminPassword("")
  }

  if (isMaintenance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">{t("Maintenance Mode", "रखरखाव मोड")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("Satark India is under scheduled maintenance. We'll be back shortly.", "सतर्क इंडिया निर्धारित रखरखाव के अधीन है। हम जल्द ही वापस आएंगे।")}
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20"
        >
          {t("Try Again", "पुनः प्रयास करें")}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-4 pb-6">
      {/* USER PROFILE CARD - TOP */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 text-white font-bold text-lg overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userName.split(" ").map(n => n[0]).join("")
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-secondary border border-border cursor-pointer hover:bg-secondary/80 transition-colors">
              <Camera className="w-3 h-3 text-foreground" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <div className="flex-1">
            {isEditingProfile ? (
              <div className="space-y-2">
                <input 
                  value={userName} 
                  onChange={e => setUserName(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input 
                  value={userPhone} 
                  onChange={e => setUserPhone(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button onClick={handleSaveProfile} className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-wider">
                  <Save className="w-3 h-3" /> {t("Save Changes", "परिवर्तन सहेजें")}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className={cn("font-bold text-foreground", isElderly ? "text-lg" : "text-base")}>
                    {userName}
                  </p>
                  <button onClick={() => setIsEditingProfile(true)} className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </button>
                </div>
                <p className={cn("text-muted-foreground mt-1", isElderly ? "text-sm" : "text-xs")}>
                  {userPhone}
                </p>
              </>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full border transition-colors",
                isKycVerified ? "bg-accent/20 border-accent/30" : "bg-amber-500/10 border-amber-500/20"
              )}>
                <CheckCircle className={cn("w-3.5 h-3.5", isKycVerified ? "text-accent" : "text-amber-500")} fill="currentColor" />
                <span className={cn("font-semibold", isKycVerified ? "text-accent" : "text-amber-500", isElderly ? "text-xs" : "text-[10px]")}>
                  {isKycVerified ? t("KYC Verified ✅", "KYC सत्यापित ✅") : t("KYC Pending ⏳", "KYC लंबित ⏳")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className={cn("font-mono font-bold text-primary", isElderly ? "text-xs" : "text-[10px]")}>
                  Trust {trustScore}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Profile Completion Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={cn("font-medium text-foreground text-[10px]", isElderly ? "text-xs" : "text-[9px]")}>
              {t("Profile Completion", "प्रोफ़ाइल पूर्णता")}
            </span>
            <span className={cn("font-bold text-primary text-[10px]", isElderly ? "text-xs" : "text-[9px]")}>
              85%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-[85%] bg-gradient-to-r from-primary to-primary/80 rounded-full" />
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex flex-col gap-1.5">
        <h3 className={cn("font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1", isElderly ? "text-xs" : "text-[10px]")}>
          {t("PREFERENCES", "प्राथमिकताएं")}
        </h3>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary shrink-0">
              <Globe className={cn("text-muted-foreground", isElderly ? "w-5 h-5" : "w-4 h-4")} />
            </div>
            <div>
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t("App Language", "ऐप की भाषा")}
              </p>
              <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
                {language === "en" ? "English" : "हिंदी (Hindi)"}
              </p>
            </div>
          </div>
          <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl border border-border">
            <button 
              onClick={() => handleLanguageChange("en")}
              className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all", language === "en" ? "bg-white dark:bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              EN
            </button>
            <button 
              onClick={() => handleLanguageChange("hi")}
              className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all", language === "hi" ? "bg-white dark:bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>
      {/* Privacy Badge */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-card/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="absolute inset-0 bg-accent/10" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
        <div className="relative flex items-center gap-4 p-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 shadow-lg shadow-accent/10 shrink-0">
            <ShieldCheck className={cn("text-accent", isElderly ? "w-7 h-7" : "w-6 h-6")} />
          </div>
          <div>
            <p className={cn("font-bold text-accent", isElderly ? "text-base" : "text-sm")}>
              {t("No-Data Upload Policy", "नो-डेटा अपलोड पॉलिसी")}
            </p>
            <p className={cn("text-foreground mt-0.5", isElderly ? "text-sm" : "text-xs")}>
              {t(
                "100% On-Device Privacy. Your data never leaves your phone.",
                "100% ऑन-डिवाइस प्राइवेसी। आपका डेटा कभी फोन नहीं छोड़ता।"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Rate Us Card */}
      <button
        onClick={() => {
          setRateClicked(true)
          if (typeof window !== "undefined") {
            window.open("https://play.google.com/store/apps/details?id=com.satark.india", "_blank")
          }
        }}
        className={cn(
          "flex items-center gap-4 p-5 rounded-2xl border transition-all active:scale-[0.97]",
          rateClicked
            ? "bg-primary/15 border-primary/40"
            : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-primary/10 dark:to-primary/5 border-amber-200 dark:border-primary/30 hover:border-amber-300 dark:hover:border-primary/50"
        )}
      >
        <div className={cn("flex items-center justify-center w-12 h-12 rounded-2xl shrink-0", rateClicked ? "bg-primary/20" : "bg-white dark:bg-card/50 shadow-md shadow-amber-200/50 dark:shadow-primary/10")}>
          <Star className={cn(rateClicked ? "text-primary" : "text-amber-500", isElderly ? "w-6 h-6" : "w-5 h-5")} fill="currentColor" />
        </div>
        <div className="flex-1 text-left">
          <p className={cn("font-bold text-foreground", isElderly ? "text-base" : "text-sm")}>
            {rateClicked ? t("Thank you!", "धन्यवाद!") : t("Enjoying Satark India?", "सतर्क इंडिया पसंद आ रहा है?")}
          </p>
          <p className={cn("text-muted-foreground mt-0.5", isElderly ? "text-xs" : "text-[10px]")}>
            {rateClicked
              ? t("Your feedback helps us improve", "आपकी प्रतिक्रिया हमें बेहतर होने में मदद करती है")
              : t("Rate us 5 stars on Play Store", "Play Store पर हमें 5 स्टार दें")}
          </p>
        </div>
        <Star className={cn("w-5 h-5 shrink-0", rateClicked ? "text-primary" : "text-amber-400")} fill="currentColor" />
      </button>

      {/* Invite & Earn Gamification Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/30 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/30 shrink-0 shadow-lg shadow-primary/10">
            <Gift className={cn("text-primary", isElderly ? "w-7 h-7" : "w-6 h-6")} />
          </div>
          <div className="flex-1">
            <p className={cn("font-bold text-primary", isElderly ? "text-base" : "text-sm")}>
              {t("Invite & Earn", "आमंत्रित करें और कमाएं")}
            </p>
            <p className={cn("text-foreground/80 mt-1", isElderly ? "text-xs" : "text-[11px]")}>
              {t("Invite family, get 1 month Cyber Insurance FREE", "परिवार को आमंत्रित करें, 1 महीने का साइबर बीमा मुफ्त पाएं")}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary/60 shrink-0" />
        </div>
      </div>

      {/* Storage & Cache Section */}
      <div className="flex flex-col gap-1.5">
        <h3 className={cn("font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1", isElderly ? "text-xs" : "text-[10px]")}>
          {t("STORAGE", "स्टोरेज")}
        </h3>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border hover:border-primary/40 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary shrink-0">
              <HardDrive className={cn("text-muted-foreground", isElderly ? "w-5 h-5" : "w-4 h-4")} />
            </div>
            <div className="text-left">
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t("Storage & Cache", "स्टोरेज और कैश")}
              </p>
              <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
                {t(`Cached data using ${storageUsed}`, `उपयोग किए गए कैश डेटा ${storageUsed}`)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCacheCleared(true)
              localStorage.removeItem("satark_reports")
              setStorageUsed("0KB")
              setTimeout(() => setCacheCleared(false), 2000)
              toast.success(t("Cache Cleared", "कैश साफ हो गया"))
            }}
            className={cn(
              "text-accent text-[9px] font-mono font-bold px-2 py-1 rounded-md transition-colors active:scale-[0.95]",
              cacheCleared && "text-accent/50"
            )}
          >
            {cacheCleared ? t("CLEARED", "साफ") : t("Clear Cache", "कैश साफ करें")}
          </button>
        </div>
      </div>

      {/* Privacy Screen Toggle */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary shrink-0">
              <Activity className={cn("text-muted-foreground", isElderly ? "w-5 h-5" : "w-4 h-4")} />
            </div>
            <div>
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t("Push Notifications", "पुश सूचनाएं")}
              </p>
              <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
                {notificationsEnabled ? t("Enabled", "सक्षम") : t("Disabled", "अक्षम")}
              </p>
            </div>
          </div>
          <Switch checked={notificationsEnabled} onCheckedChange={handleToggleNotifications} />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary shrink-0">
              <Eye className={cn("text-muted-foreground", isElderly ? "w-5 h-5" : "w-4 h-4")} />
            </div>
            <div>
              <p className={cn("font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                {t("Privacy Screen", "गोपनीयता स्क्रीन")}
              </p>
              <p className={cn("text-muted-foreground", isElderly ? "text-[11px]" : "text-[9px]")}>
                {t("Blur app in recent tasks", "हाल के कार्यों में ऐप को धुंधला करें")}
              </p>
            </div>
          </div>
          <Switch checked={privacyScreen} onCheckedChange={setPrivacyScreen} aria-label={t("Toggle privacy screen", "गोपनीयता स्क्रीन टॉगल करें")} />
        </div>
      </div>

      {/* Legal Section */}
      <div className="flex flex-col gap-1.5">
        <h3 className={cn("font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1", isElderly ? "text-xs" : "text-[10px]")}>
          {t("LEGAL", "कानूनी")}
        </h3>

        <div className="flex flex-col rounded-2xl bg-white dark:bg-card border border-slate-100 dark:border-border overflow-hidden divide-y divide-slate-100 dark:divide-border shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {[
            { icon: FileText, titleEn: "Privacy Policy", titleHi: "गोपनीयता नीति", href: "/privacy" },
            { icon: ScrollText, titleEn: "Data Safety Form", titleHi: "डेटा सुरक्षा फॉर्म", href: "/privacy" },
            { icon: Scale, titleEn: "Terms of Service", titleHi: "सेवा की शर्तें", href: "/terms" },
            { icon: RefreshCcw, titleEn: "Check for Updates", titleHi: "अपडेट की जांच करें", onClick: handleCheckUpdate },
          ].map((item) => {
            const Icon = item.icon
            const content = (
              <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-secondary/50 transition-colors text-left active:scale-[0.97] w-full">
                <Icon className={cn("text-muted-foreground shrink-0", isElderly ? "w-4.5 h-4.5" : "w-4 h-4")} />
                <span className={cn("flex-1 font-medium text-foreground", isElderly ? "text-sm" : "text-xs")}>
                  {t(item.titleEn, item.titleHi)}
                  {item.titleEn === "Check for Updates" && (
                    <span className="ml-2 text-[10px] text-muted-foreground font-mono">v{appVersion}</span>
                  )}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
              </div>
            )
            return item.href ? (
              <Link key={item.titleEn} href={item.href}>
                {content}
              </Link>
            ) : (
              <button key={item.titleEn} onClick={item.onClick} className="w-full">
                {content}
              </button>
            )
          })}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-destructive/10 transition-colors text-left active:scale-[0.97] w-full"
          >
            <LogOut className={cn("text-destructive shrink-0", isElderly ? "w-4.5 h-4.5" : "w-4 h-4")} />
            <span className={cn("flex-1 font-bold text-destructive", isElderly ? "text-sm" : "text-xs")}>
              {t("Logout", "लॉग आउट")}
            </span>
          </button>
        </div>
      </div>

      {/* 👑 ADMIN DASHBOARD SECTION */}
      <div className="flex flex-col gap-1.5">
        <h3 className={cn("font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1", isElderly ? "text-xs" : "text-[10px]")}>
          {t("ADMINISTRATION", "प्रशासन")}
        </h3>

        {!isAdminLoggedIn ? (
          <form onSubmit={handleAdminLogin} className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Admin Access</p>
                <p className="text-slate-500 text-[10px]">Restricted to Satark Officials</p>
              </div>
            </div>
            <div className="space-y-3">
              <input 
                type="password"
                placeholder="Enter Admin Password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button type="submit" className="w-full py-3 bg-primary text-slate-950 font-bold rounded-xl hover:bg-primary/90 transition-all">
                Login to Dashboard
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Admin Header */}
            <div className="bg-slate-800/50 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white font-bold text-xs uppercase tracking-widest">Admin Dashboard</span>
              </div>
              <button onClick={() => setIsAdminLoggedIn(false)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Admin Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-800/30">
              {[
                { id: "health", icon: Activity, label: "Health" },
                { id: "threats", icon: Zap, label: "Threats" },
                { id: "controls", icon: Shield, label: "Controls" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase transition-all",
                    adminTab === tab.id ? "text-primary border-b-2 border-primary bg-primary/5" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Admin Content */}
            <div className="p-5">
              {adminTab === "health" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                      <p className="text-slate-500 text-[9px] font-mono mb-1">System Uptime</p>
                      <p className="text-white font-bold text-lg">99.98%</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                      <p className="text-slate-500 text-[9px] font-mono mb-1">API Latency</p>
                      <p className="text-emerald-500 font-bold text-lg">42ms</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RefreshCcw className="w-4 h-4 text-primary animate-spin-slow" />
                      <span className="text-white text-xs">Auto-scaling Active</span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-mono">NODE_IN_04</span>
                  </div>
                </div>
              )}

              {adminTab === "threats" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                    <p className="text-slate-500 text-[9px] font-mono mb-3">Live Threat Intel (Masked)</p>
                    <div className="space-y-3">
                      {[
                        { id: "USR_***92A", score: "92%", status: "Flagged" },
                        { id: "USR_***44B", score: "14%", status: "Safe" },
                        { id: "USR_***71C", score: "88%", status: "Flagged" }
                      ].map(row => (
                        <div key={row.id} className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-white/70">{row.id}</span>
                          <span className="text-primary font-bold">{row.score}</span>
                          <span className={cn(row.status === "Flagged" ? "text-destructive" : "text-emerald-500")}>{row.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-primary font-bold text-xs uppercase">Total Scams Reported</span>
                    <span className="text-white font-black text-xl">1,245</span>
                  </div>
                </div>
              )}

              {adminTab === "controls" && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Power className="w-4 h-4 text-slate-400" />
                      <span className="text-white text-xs">Maintenance Mode</span>
                    </div>
                    <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span className="text-white text-xs">Strict Rate Limiting</span>
                    </div>
                    <Switch checked={strictRateLimit} onCheckedChange={setStrictRateLimit} />
                  </div>
                  <p className="text-[9px] text-slate-600 italic px-2">Changes are applied globally to all production clusters immediately.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
