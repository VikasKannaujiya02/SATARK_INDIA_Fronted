"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Shield, Mail, Lock, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@satark.com")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }
    
    setError("")
    setLoading(true)
    
    try {
      const res = await axios.post("https://satark-india-backend.onrender.com/api/auth/admin-login", {
        email: email.trim(),
        password: password
      })

      if (res.data?.token && res.data?.admin) {
        localStorage.setItem("satark_token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data.admin))
        localStorage.setItem("isAdmin", "true")
        router.push("/admin/dashboard")
      }
    } catch (err) {
      console.error(err)
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Admin login failed. Check credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdminLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-950 to-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background pattern - Red theme for admin */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        {/* Back to User Login */}
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to User Login
        </Link>

        {/* Admin Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative">
              <Shield className="w-14 h-14 text-red-400" fill="currentColor" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <span className="text-xs font-bold text-white">⚙</span>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-white tracking-tight">ADMIN</h1>
              <p className="text-xs text-red-300 font-semibold tracking-wider">CONTROL PANEL</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400/30 backdrop-blur-sm">
            <Lock className="w-3.5 h-3.5 text-red-300" />
            <span className="text-xs font-semibold text-red-200">Administrative Access</span>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Use your admin credentials to access the Satark India control panel
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide px-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="admin@satark.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700 focus:border-red-500 focus:bg-slate-800 outline-none transition-all text-white placeholder:text-slate-500 text-base font-medium shadow-lg shadow-black/20"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide px-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your admin password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-800/80 border-2 border-slate-700 focus:border-red-500 focus:bg-slate-800 outline-none transition-all text-white placeholder:text-slate-500 text-base font-medium shadow-lg shadow-black/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleAdminLogin}
            disabled={loading || !email || !password}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-2xl font-bold text-lg shadow-xl shadow-red-900/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Access Admin Panel</span>
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="pt-6 text-center border-t border-slate-700">
          <p className="text-xs text-slate-500">
            This is a restricted access area. 
            <span className="block mt-2 font-semibold text-red-400">All access attempts are logged and monitored.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
