"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Shield, 
  Users, 
  FileText, 
  Terminal, 
  Power, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  ChevronRight,
  LogOut,
  RefreshCcw,
  Clock,
  Database
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports" | "logs">("overview")
  const [killSwitch, setKillSwitch] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const stats = [
    { label: "Total Users", value: "12,842", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Live Reports", value: "458", change: "+5%", icon: FileText, color: "text-emerald-500" },
    { label: "Threats Blocked", value: "8,291", change: "+28%", icon: Shield, color: "text-purple-500" },
    { label: "System Health", value: "99.9%", change: "Stable", icon: Activity, color: "text-amber-500" },
  ]

  const recentReports = [
    { id: "REP-9281", type: "UPI Fraud", status: "Investigating", user: "User_8821", time: "2m ago" },
    { id: "REP-9280", type: "Phishing Link", status: "Blocked", user: "User_4412", time: "15m ago" },
    { id: "REP-9279", type: "Fake KYC", status: "Resolved", user: "User_1092", time: "1h ago" },
    { id: "REP-9278", type: "Vishing", status: "Pending", user: "User_7721", time: "3h ago" },
  ]

  const mockLogs = [
    "[10:42:01] INFO: Production cluster scaled to 4 nodes",
    "[10:41:45] WARN: High latency detected in US-EAST-1",
    "[10:40:12] AUTH: Failed admin login attempt from 192.168.1.1",
    "[10:38:55] SEC: SQL Injection attempt blocked for USR_921",
    "[10:35:22] SYS: Database backup completed successfully",
  ]

  const handleKillSwitch = () => {
    const newState = !killSwitch
    setKillSwitch(newState)
    toast(newState ? "🔴 SYSTEM KILL SWITCH ACTIVATED" : "🟢 SYSTEM RESTORED", {
      icon: newState ? "🚨" : "✅",
      style: {
        borderRadius: '10px',
        background: newState ? '#ef4444' : '#10b981',
        color: '#fff',
        fontWeight: 'bold'
      }
    })
  }

  const handleLogout = () => {
    toast.success("Admin logged out")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 flex flex-col p-6 space-y-8">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" fill="currentColor" />
          <div>
            <h1 className="text-xl font-black tracking-tighter">SATARK</h1>
            <p className="text-[10px] text-primary font-bold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "users", label: "User Stats", icon: Users },
            { id: "reports", label: "Incident Reports", icon: FileText },
            { id: "logs", label: "Server Logs", icon: Terminal },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                activeTab === item.id 
                  ? "bg-primary text-slate-950 shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500">LIVE</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold capitalize">{activeTab}</h2>
            <span className="text-slate-600">/</span>
            <span className="text-sm text-slate-400">Dashboard Metrics</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-300 tracking-wide">Production Cluster</span>
              </button>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="flex items-center gap-3 px-2">
              <div className="text-right">
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] text-slate-500">admin@satark.com</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center font-bold text-slate-950">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-950/30">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between">
                      <div className={cn("p-3 rounded-2xl bg-slate-800/50", stat.color)}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg", 
                        stat.change.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-400"
                      )}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-black mt-1 tracking-tight">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-8">
                {/* Reports Table */}
                <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                    <h3 className="font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Recent Reports
                    </h3>
                    <button className="text-xs font-bold text-primary hover:underline">View All</button>
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-800/10 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Report ID</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {recentReports.map((report) => (
                          <tr key={report.id} className="hover:bg-slate-800/20 transition-colors">
                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-300">{report.id}</td>
                            <td className="px-6 py-4 text-xs font-bold">{report.type}</td>
                            <td className="px-6 py-4">
                              <span className={cn("px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter",
                                report.status === "Investigating" ? "bg-blue-500/10 text-blue-500" :
                                report.status === "Blocked" ? "bg-red-500/10 text-red-500" :
                                report.status === "Resolved" ? "bg-emerald-500/10 text-emerald-500" :
                                "bg-slate-800 text-slate-400"
                              )}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400">{report.user}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{report.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* System Controls */}
                <div className="space-y-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
                    <h3 className="font-bold flex items-center gap-2">
                      <Power className="w-5 h-5 text-red-500" />
                      Critical Controls
                    </h3>
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-red-400">System Kill Switch</p>
                          <p className="text-[10px] text-red-400/60">Immediately puts app into Maintenance</p>
                        </div>
                        <button 
                          onClick={handleKillSwitch}
                          className={cn(
                            "w-12 h-6 rounded-full relative transition-all duration-300",
                            killSwitch ? "bg-red-500" : "bg-slate-800"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                            killSwitch ? "right-1" : "left-1"
                          )} />
                        </button>
                      </div>
                      <p className="text-[9px] text-red-400/50 italic leading-relaxed">
                        Warning: Activating the kill switch will terminate all active user sessions and display a global maintenance screen.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Flush Redis Cache
                      </button>
                      <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
                        <Database className="w-3.5 h-3.5" />
                        Run DB Optimization
                      </button>
                    </div>
                  </div>

                  {/* Mock Logs Widget */}
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-slate-500">
                      <Terminal className="w-4 h-4" />
                      Live Logs
                    </h3>
                    <div className="bg-black/50 rounded-2xl p-4 font-mono text-[10px] space-y-2 max-h-40 overflow-y-auto border border-slate-800">
                      {mockLogs.map((log, i) => (
                        <p key={i} className={cn(
                          log.includes("WARN") ? "text-amber-400" :
                          log.includes("SEC") ? "text-red-400" :
                          log.includes("AUTH") ? "text-primary" :
                          "text-slate-400"
                        )}>
                          {log}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "overview" && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
              <Database className="w-16 h-16 text-slate-700" />
              <div className="text-center">
                <p className="text-xl font-bold">Module Under Maintenance</p>
                <p className="text-sm text-slate-500">Advanced metrics for {activeTab} will be available in the next build.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
