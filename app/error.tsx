"use client"

import { useEffect } from "react"
import { Shield, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Satark Error Boundary:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800">
          <Shield className="w-8 h-8 text-blue-500" fill="currentColor" />
        </div>
        <h1 className="text-xl font-bold text-slate-100">
          Satark India System Recovery
        </h1>
        <p className="text-slate-400 text-sm">
          Team Satark India is securing your session. Something went wrong, but we&apos;ve got you covered.
        </p>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-sm transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Reload Dashboard
        </button>
      </div>
    </div>
  )
}
