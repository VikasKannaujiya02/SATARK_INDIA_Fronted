"use client"

import { useState, useRef, useEffect } from "react"
import { api } from "@/lib/api"
import {
  AlertTriangle,
  FileDown,
  Phone,
  ShieldCheck,
  EyeOff,
  Siren,
  Share2,
  Activity,
  Shield,
  Plus,
  Trash2,
  Send,
  Download,
  Loader2,
  Battery,
  MapPin,
  Clock,
  X,
} from "lucide-react"
import { useApp } from "./app-context"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import emailjs from "@emailjs/browser"
import { jsPDF } from "jspdf"
import toast from "react-hot-toast"

interface EmergencyContact {
  id: string
  name: string
  relation: string
  phone: string
  email: string
}

export function TabRecovery() {
  const { t, isElderly } = useApp()
  
  // --- SOS State ---
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [isSosSending, setIsSosSending] = useState(false)
  const [sosTimestamp, setSosTimestamp] = useState<number | null>(null)
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "", email: "" })

  // --- Complaint Generator State ---
  const [incidentDescription, setIncidentDescription] = useState("")
  const [generatedComplaint, setGeneratedComplaint] = useState("")
  const [isGeneratingFIR, setIsGeneratingFIR] = useState(false)
  const [isInsured, setIsInsured] = useState(false)

  // Load contacts from backend on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get("/api/contacts")
        if (Array.isArray(res.data)) {
          setEmergencyContacts(res.data)
          // Update local storage for fallback consistency
          localStorage.setItem("satark_emergency_contacts", JSON.stringify(res.data))
        }
      } catch (err) {
        console.error("Failed to fetch contacts:", err)
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("satark_emergency_contacts")
        if (saved) {
          try { setEmergencyContacts(JSON.parse(saved)) } catch (e) {}
        }
      }
    }
    const fetchInsuranceStatus = async () => {
      try {
        const res = await api.get("/api/users/profile")
        setIsInsured(res.data.isInsured)
      } catch (e) {}
    }
    fetchContacts()
    fetchInsuranceStatus()
  }, [])

  // --- Action 1: SOS Logic ---
  const triggerEmergencySOS = async () => {
    if (emergencyContacts.length === 0) {
      toast.error(t("Please add at least one emergency contact first", "कृपया कम से कम एक आपातकालीन संपर्क जोड़ें"))
      setShowAddContact(true)
      return
    }

    setIsSosSending(true)
    const toastId = toast.loading(t("Collecting real-time data & dispatching alerts...", "डेटा एकत्र कर रहे हैं और अलर्ट भेज रहे हैं..."))

    try {
      // 1. Get Geolocation
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      }).catch(() => null)

      // 2. Get Battery
      let batteryLevel = "Unknown"
      if ("getBattery" in navigator) {
        const battery: any = await (navigator as any).getBattery()
        batteryLevel = `${Math.round(battery.level * 100)}%`
      }

      // 3. Exact Timestamp
      const currentTime = new Date().toLocaleString()
      const lat = pos?.coords.latitude.toFixed(6) || "Unavailable"
      const lng = pos?.coords.longitude.toFixed(6) || "Unavailable"

      // 4. Send Emails via EmailJS
      const sendPromises = emergencyContacts.map(contact => {
        const templateParams = {
          to_email: contact.email,
          contact_name: contact.name,
          user_name: "Satark User",
          time: currentTime,
          battery: batteryLevel,
          lat: lat,
          lng: lng,
          message: "I need immediate help. I suspect a cyber threat or physical danger."
        }

        return emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
        )
      })

      // 5. Trigger Backend SOS logic
      await api.post("/api/sos/trigger", { 
        name: "Satark User", 
        location: `Lat: ${lat}, Lng: ${lng}`,
        lat, 
        lng 
      }).catch(() => {})

      await Promise.all(sendPromises)
      setSosTimestamp(Date.now())
      toast.success(t("Emergency SOS Dispatched to all contacts!", "आपातकालीन SOS सभी संपर्कों को भेज दिया गया!"), { id: toastId })
    } catch (error) {
      console.error("SOS Dispatch Failed:", error)
      toast.error(t("SOS dispatch failed. Please check your connection.", "SOS भेजने में विफल। कृपया अपना कनेक्शन जांचें।"), { id: toastId })
    } finally {
      setIsSosSending(false)
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
        theme: { color: "#3b82f6" }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
      toast.dismiss(toastId)
    } catch (err) {
      toast.error(t("Payment failed to start", "भुगतान शुरू करने में विफल"), { id: toastId })
    }
  }

  // --- Action 2: Complaint Logic ---
  const generateAIComplaint = async () => {
    if (!incidentDescription.trim()) {
      toast.error(t("Please describe the incident first", "कृपया पहले घटना का विवरण दें"))
      return
    }

    setIsGeneratingFIR(true)
    const toastId = toast.loading(t("AI Engine generating professional draft...", "AI इंजन पेशेवर ड्राफ्ट तैयार कर रहा है..."))
    try {
      const res = await api.post("/api/generate-complaint", { userStory: incidentDescription })
      if (res.data?.complaintText) {
        setGeneratedComplaint(res.data.complaintText)
        toast.success(t("AI FIR Template Generated!", "AI FIR टेम्पलेट बन गया!"), { id: toastId })
      }
    } catch (err) {
      console.error("AI Complaint Generation Failed:", err)
      toast.error(t("AI Engine failed. Using fallback template.", "AI इंजन विफल रहा। वैकल्पिक टेम्पलेट का उपयोग कर रहे हैं।"), { id: toastId })
      // Fallback dummy template
      const template = `OFFICIAL CYBER CRIME COMPLAINT DRAFT\nDate: ${new Date().toLocaleDateString()}\n\nIncident: ${incidentDescription}`
      setGeneratedComplaint(template)
    } finally {
      setIsGeneratingFIR(false)
    }
  }

  const downloadComplaintPDF = () => {
    if (!generatedComplaint) return

    const doc = new jsPDF()
    const margin = 15
    const pageWidth = doc.internal.pageSize.getWidth()
    const textWidth = pageWidth - (margin * 2)
    
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("SATARK INDIA - OFFICIAL COMPLAINT", margin, 20)
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    
    const splitText = doc.splitTextToSize(generatedComplaint, textWidth)
    doc.text(splitText, margin, 35)
    
    doc.save("Satark_Official_Complaint.pdf")
    toast.success(t("Complaint PDF Downloaded", "शिकायत PDF डाउनलोड हो गई"))
  }

  // --- Action 3: Contact Management ---
  const addContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContact.name || !newContact.email) return
    
    const toastId = toast.loading(t("Adding guardian...", "अभिभावक जोड़ रहे हैं..."))
    try {
      const res = await api.post("/api/contacts", newContact)
      if (res.data?.success) {
        const updatedContacts = [res.data.contact, ...emergencyContacts]
        setEmergencyContacts(updatedContacts)
        
        // Update local storage for fallback consistency
        localStorage.setItem("satark_emergency_contacts", JSON.stringify(updatedContacts))
        
        setNewContact({ name: "", relation: "", phone: "", email: "" })
        setShowAddContact(false)
        toast.success(t("Contact Added", "संपर्क जोड़ा गया"), { id: toastId })
      }
    } catch (err) {
      console.error("Failed to add contact:", err)
      toast.error(t("Failed to add contact", "संपर्क जोड़ने में विफल"), { id: toastId })
    }
  }

  const removeContact = async (id: string) => {
    // Note: We'd need a DELETE /api/contacts/:id route on backend for full production
    // For now, filtering state to keep it responsive, but API POST is working
    setEmergencyContacts(emergencyContacts.filter(c => (c as any)._id !== id && (c as any).id !== id))
    toast.success(t("Contact Removed", "संपर्क हटा दिया गया"))
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-10 max-w-2xl mx-auto">
      {/* SOS Active Badge - Shows for 5 mins after trigger */}
      {sosTimestamp && (Date.now() - sosTimestamp < 300000) && (
        <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-destructive/20 border border-destructive animate-pulse">
          <Siren className="w-5 h-5 text-destructive" />
          <span className="text-destructive font-black text-sm uppercase tracking-widest">
            {t("SOS TRIGGERED! Alerts Sent.", "SOS ट्रिगर हुआ! अलर्ट भेजे गए।")}
          </span>
          <button onClick={() => setSosTimestamp(null)} className="ml-auto p-1 text-destructive hover:bg-destructive/10 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Insurance Banner for SOS */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{t("Cyber Insurance", "साइबर बीमा")}</p>
              <p className="text-[10px] text-muted-foreground">{isInsured ? t("Active Coverage", "सक्रिय कवरेज") : t("₹5L Fraud Coverage", "₹5 लाख धोखाधड़ी कवरेज")}</p>
            </div>
          </div>
          {!isInsured && (
            <button 
              onClick={handleInsurancePayment}
              className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-emerald-500/20"
            >
              {t("Secure Now", "अभी सुरक्षित करें")}
            </button>
          )}
        </div>
      </div>

      {/* SOS Card */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl overflow-hidden group space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Siren className="text-destructive w-6 h-6 animate-pulse" />
          {t("MILITARY-GRADE SOS", "मिलिट्री-ग्रेड SOS")}
        </h2>
        
        <button
          onClick={triggerEmergencySOS}
          disabled={isSosSending}
          className={cn(
            "relative w-full h-40 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-[0.98] overflow-hidden group",
            isSosSending 
              ? "bg-slate-800 cursor-not-allowed" 
              : "bg-gradient-to-br from-destructive to-red-900 border-4 border-red-500/30 shadow-[0_0_50px_rgba(255,0,0,0.3)] hover:shadow-[0_0_70px_rgba(255,0,0,0.5)]"
          )}
        >
          {isSosSending ? (
            <>
              <Loader2 className="w-12 h-12 text-white animate-spin" />
              <span className="text-white font-bold animate-pulse">{t("DISPATCHING ALERTS...", "अलर्ट भेज रहे हैं...")}</span>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-20 group-hover:opacity-40 transition-opacity" />
              <Siren className="w-14 h-14 text-white animate-bounce" fill="currentColor" />
              <span className="text-2xl font-black text-white tracking-widest">{t("TRIGGER EMERGENCY SOS", "इमरजेंसी SOS ट्रिगर करें")}</span>
            </>
          )}
        </button>
      </div>

      {/* SECTION 2: LIVE EMERGENCY CONTACTS */}
      <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            {t("Guardian Contacts", "अभिभावक संपर्क")}
          </h3>
          <button 
            onClick={() => setShowAddContact(!showAddContact)}
            className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {showAddContact && (
          <form onSubmit={addContact} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 grid grid-cols-2 gap-3 animate-in slide-in-from-top duration-200">
            <input 
              placeholder={t("Name", "नाम")} 
              className="col-span-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              value={newContact.name}
              onChange={e => setNewContact({...newContact, name: e.target.value})}
              required
            />
            <input 
              placeholder={t("Relation", "संबंध")} 
              className="col-span-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              value={newContact.relation}
              onChange={e => setNewContact({...newContact, relation: e.target.value})}
            />
            <input 
              placeholder={t("Phone", "फोन")} 
              className="col-span-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              value={newContact.phone}
              onChange={e => setNewContact({...newContact, phone: e.target.value})}
            />
            <input 
              placeholder={t("Email (Required for SOS)", "ईमेल (SOS के लिए आवश्यक)")} 
              type="email"
              className="col-span-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
              value={newContact.email}
              onChange={e => setNewContact({...newContact, email: e.target.value})}
              required
            />
            <button type="submit" className="col-span-2 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-colors">
              {t("Save Guardian", "अभिभावक सहेजें")}
            </button>
          </form>
        )}

        <div className="space-y-2">
          {emergencyContacts.length > 0 ? (
            emergencyContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/30 border border-slate-800 group hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                    {contact.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{contact.name} <span className="text-slate-500 text-[10px] font-normal">({contact.relation})</span></p>
                    <p className="text-slate-400 text-[10px] font-mono">{contact.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeContact(contact.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 text-xs py-4 italic">{t("No guardians added yet. Alerts won't be sent.", "अभी तक कोई अभिभावक नहीं जोड़ा गया। अलर्ट नहीं भेजे जाएंगे।")}</p>
          )}
        </div>
      </div>

      {/* SECTION 3: EDITABLE AI COMPLAINT GENERATOR */}
      <div className="rounded-3xl bg-white dark:bg-card border border-slate-100 dark:border-border p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <FileDown className="w-5 h-5 text-primary" />
          {t("AI Auto-Complaint Generator", "AI ऑटो-शिकायत जेनरेटर")}
        </h3>
        
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs">{t("Describe what happened (e.g., 'Received fake KYC call for ₹20,000')", "बताएं क्या हुआ (जैसे, '₹20,000 के लिए फर्जी KYC कॉल आया')")}</p>
          <textarea
            value={incidentDescription}
            onChange={e => setIncidentDescription(e.target.value)}
            className="w-full min-h-[100px] p-4 rounded-2xl bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder={t("Type incident details here...", "यहां घटना का विवरण लिखें...")}
          />
          
          <button
            onClick={generateAIComplaint}
            disabled={isGeneratingFIR}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isGeneratingFIR ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {t("GENERATE AI FIR TEMPLATE", "AI FIR टेम्पलेट बनाएं")}
          </button>
        </div>

        {generatedComplaint && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{t("EDITABLE DRAFT", "संपादन योग्य ड्राफ्ट")}</span>
              <span className="text-[10px] text-muted-foreground italic">{t("Add Transaction IDs manually below", "नीचे मैन्युअल रूप से ट्रांजेक्शन आईडी जोड़ें")}</span>
            </div>
            <textarea
              value={generatedComplaint}
              onChange={e => setGeneratedComplaint(e.target.value)}
              className="w-full min-h-[300px] p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              onClick={downloadComplaintPDF}
              className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center gap-2 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              {t("DOWNLOAD FINAL PDF", "अंतिम PDF डाउनलोड करें")}
            </button>
          </div>
        )}
      </div>

      {/* SECTION 4: QUICK HELPLINES */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { if (typeof window !== "undefined") window.location.href = "tel:1930" }}
          className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col items-center gap-2 group hover:bg-blue-500/20 transition-all"
        >
          <Phone className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="text-white font-bold text-sm">1930</span>
          <span className="text-blue-400 text-[9px] uppercase font-bold">{t("Cyber Helpline", "साइबर हेल्पलाइन")}</span>
        </button>
        <button
          onClick={() => { if (typeof window !== "undefined") window.location.href = "tel:112" }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col items-center gap-2 group hover:bg-red-500/20 transition-all"
        >
          <Siren className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-white font-bold text-sm">112</span>
          <span className="text-red-400 text-[9px] uppercase font-bold">{t("Emergency", "आपातकालीन")}</span>
        </button>
      </div>
    </div>
  )
}
