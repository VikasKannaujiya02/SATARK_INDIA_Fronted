"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, LogOut, Power, Users, AlertCircle, Clock, FileText, Terminal, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"

interface UserStats {
  totalUsers: number
  activeToday: number
  newThisWeek: number
  verifiedKyc: number
}

interface Report {
  id: string
  type: string
  user: string
  severity: "low" | "medium" | "high"
  timestamp: string
  status: "pending" | "reviewed" | "resolved"
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [killSwitchActive, setKillSwitchActive] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 1234,
    activeToday: 456,
    newThisWeek: 89,
    verifiedKyc: 892
  })
  
  const [reports, setReports] = useState<Report[]>([
    { id: "1", type: "Phishing Alert", user: "User #567", severity: "high", timestamp: "2 hours ago", status: "pending" },
    { id: "2", type: "Suspicious Login", user: "User #234", severity: "medium", timestamp: "5 hours ago", status: "reviewed" },
    { id: "3", type: "Account Lockout", user: "User #890", severity: "low", timestamp: "1 day ago", status: "resolved" },
    { id: "4", type: "Payment Fraud", user: "User #123", severity: "high", timestamp: "1 day ago", status: "pending" },
    { id: "5", type: "Device Compromised", user: "User #456", severity: "medium", timestamp: "2 days ago", status: "reviewed" }
  ])

  const [logs, setLogs] = useState<string[]>([
    "[2025-03-08 10:45:23] User #567 attempted phishing simulation - Alert sent",
    "[2025-03-08 10:30:15] System health check: All services operational",
    "[2025-03-08 10:15:42] Database backup completed successfully",
    "[2025-03-08 09:58:07] Admin dashboard accessed from IP 192.168.1.100",
    "[2025-03-08 09:45:33] New user registration: User #1234",
    "[2025-03-08 09:30:22] Security scan completed - No threats detected",
    "[2025-03-08 09:15:11] API rate limit alert on endpoint /api/scan-query",
    "[2025-03-08 08:45:04] Scheduled task: Daily threat intelligence update completed"
  ])

  useEffect(() => {
    const token = localStorage.getItem("satark_token")
    const isAdmin = localStorage.getItem("isAdmin")
    if (!token || !isAdmin) {
      router.replace("/admin/login")
      return
    }
    setIsAuthorized(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("satark_token")
    localStorage.removeItem("user")
    localStorage.removeItem("isAdmin")
    router.push("/login")
  }

  const handleKillSwitch = () => {
    setKillSwitchActive(!killSwitchActive)
  }

  if (!isAuthorized) {
    return <div className="min-h-screen bg-slate-950" />
  }

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "pending": return "bg-blue-500/10 text-blue-400"
      case "reviewed": return "bg-amber-500/10 text-amber-400"
      case "resolved": return "bg-green-500/10 text-green-400"
      default: return "bg-slate-500/10 text-slate-400"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-400" fill="currentColor" />
            <div>
              <h1 className="text-2xl font-black tracking-tight">SATARK ADMIN</h1>
              <p className="text-xs text-slate-400">Control Panel v1.0</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Kill Switch Section */}
        <div className="bg-gradient-to-r from-red-950 to-slate-900 border-2 border-red-500/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Power className="w-6 h-6 text-red-400" />
                System Kill Switch
              </h2>
              <p className="text-slate-400 text-sm">
                {killSwitchActive ? "⚠️ SYSTEM DISABLED" : "System operational - All services running"}
              </p>
            </div>
            <button
              onClick={handleKillSwitch}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                killSwitchActive
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/50"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {killSwitchActive ? "ENABLED" : "ENABLE KILL SWITCH"}
            </button>
          </div>
          {killSwitchActive && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm font-semibold">
                ⏱️ Kill switch is ACTIVE. The application is offline. Reset when ready.
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm font-semibold">Total Users</p>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-black">{userStats.totalUsers}</p>
            <p className="text-xs text-slate-500">Registered accounts</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm font-semibold">Active Today</p>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-black">{userStats.activeToday}</p>
            <p className="text-xs text-slate-500">Online in the last 24h</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm font-semibold">New This Week</p>
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-black">{userStats.newThisWeek}</p>
            <p className="text-xs text-slate-500">New registrations</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm font-semibold">KYC Verified</p>
              <AlertCircle className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-black">{userStats.verifiedKyc}</p>
            <p className="text-xs text-slate-500">Identity verified</p>
          </div>
        </div>

        {/* Reports Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-400" />
              Recent Security Reports
            </h2>
            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
              View All
            </button>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">Report Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">Severity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => (
                    <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{report.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{report.user}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(report.severity)}`}>
                          {report.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {report.timestamp}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Logs Section */}
        <div className="space-y-4">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-2 text-xl font-bold hover:text-blue-400 transition-colors"
          >
            <Terminal className="w-6 h-6 text-cyan-400" />
            View Server Logs
            <span className={`ml-auto text-sm transition-transform ${showLogs ? "rotate-180" : ""}`}>▼</span>
          </button>

          {showLogs && (
            <div className="bg-black/50 border border-slate-800 rounded-xl p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="text-cyan-400/80 hover:text-cyan-400 transition-colors">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
