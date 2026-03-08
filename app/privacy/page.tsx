import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <Lock className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Privacy <span className="text-emerald-500">Policy</span>
            </h1>
          </div>
          
          <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">1. Data Privacy Commitment</h2>
              <p>
                Satark India is designed with a privacy-first approach. We understand the sensitivity of 
                cybersecurity data and are committed to protecting user privacy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">2. Storage Policy</h2>
              <p>
                The app does not store personal device data, SMS, or private screenshots on external servers. 
                Any analysis performed (e.g., OCR, SMS scanning) is processed securely, and the data is 
                not permanently retained by Satark India.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">3. Analytics & Improvement</h2>
              <p>
                We may collect anonymous, aggregated data for the purpose of improving threat detection 
                and application performance. This data cannot be traced back to an individual user.
              </p>
            </section>

            <section className="space-y-3 border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-500 italic">
                Last updated: March 2026. Your privacy is our priority.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
