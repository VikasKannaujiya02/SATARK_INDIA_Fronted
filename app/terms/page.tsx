import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"

export default function TermsPage() {
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
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Terms & <span className="text-emerald-500">Conditions</span>
            </h1>
          </div>
          
          <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">1. Usage Disclaimer</h2>
              <p>
                Satark India is provided as a tool for cybersecurity awareness, education, and Open Source Intelligence (OSINT) purposes only. 
                Users are responsible for their own actions and must comply with all local laws and regulations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">2. Ethical Use</h2>
              <p>
                This application is designed to help citizens protect themselves from digital fraud. Any misuse of the tools 
                for illegal activities, harassment, or unauthorized data gathering is strictly prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">3. Data Accuracy</h2>
              <p>
                While we strive for accuracy in our scan results and threat intelligence, Satark India does not guarantee 
                100% accuracy. Threat levels are based on available patterns and community reports.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">4. Limitation of Liability</h2>
              <p>
                Satark India and its affiliates shall not be liable for any direct or indirect damages arising from the use of
                the service. The maximum aggregate liability arising out of or related to these terms shall not exceed INR 1,000
                or the amount paid by you in the preceding twelve months, whichever is greater.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">5. User Obligations</h2>
              <p>
                You agree not to reverse-engineer, decompile, or misuse the service. You further agree to maintain the
                confidentiality of your authentication tokens and to notify us immediately if your account is compromised.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">6. GDPR &amp; DPDP Act 2023 Compliance</h2>
              <p>
                By using Satark India, you consent to the processing of personal data in accordance with applicable
                privacy laws, including the GDPR for EU residents and the Digital Personal Data Protection Act, 2023 for
                Indian residents. You may request access, correction, or deletion of your personal data by contacting
                privacy@satarkindia.com.
              </p>
            </section>

            <section className="space-y-3 border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-500 italic">
                Last updated: March 2026. By using Satark India, you agree to these terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
