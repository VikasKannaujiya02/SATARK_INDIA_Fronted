"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Satark Global Error:", error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white m-0 font-sans">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800">
            <span className="text-3xl">🛡️</span>
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
            Reload Dashboard
          </button>
        </div>
      </body>
    </html>
  )
}
