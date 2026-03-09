"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, Mail, ArrowRight, ChevronLeft } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Professional Admin check
    if (email === "admin@satark.com" && password === "satarkadmin") {
      toast.success("Identity Verified. Welcome back, Admin.")
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1000)
    } else {
      toast.error("Access Denied. Invalid Credentials.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-bold">Back to User Login</span>
          </Link>
          
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-primary" fill="currentColor" />
            <div className="text-left">
              <h1 className="text-3xl font-black tracking-tighter">SATARK</h1>
              <p className="text-xs text-primary font-bold tracking-[0.2em] uppercase">Security Portal</p>
            </div>
          </div>
          
          <div className="pt-4">
            <h2 className="text-xl font-bold">Administrator Access</h2>
            <p className="text-slate-500 text-sm mt-1">Authorized personnel only. Sessions are monitored.</p>
          </div>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="admin@satark.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:border-primary outline-none transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:border-primary outline-none transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-slate-950 font-black rounded-2xl hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-primary/10 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>INITIALIZE SECURE SESSION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-[10px] text-slate-600 font-mono">
            IP: 103.211.22.9 • SEC_LEVEL: 0 • ENCRYPTION: AES-256
          </p>
        </div>
      </div>
    </div>
  )
}
