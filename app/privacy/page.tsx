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
              <h2 className="text-xl font-semibold text-emerald-500">2. Data Collection &amp; End-to-End Encryption</h2>
              <p>
                Satark India collects only the minimum data necessary to provide our services. We may access
                device information, SMS text (for phishing analysis), call metadata, and user-provided inputs
                such as phone numbers, email addresses or images. All transmission between your device and
                our servers is encrypted using industry-standard TLS. In addition, sensitive payloads are
                secured with end-to-end encryption so that only the intended recipient (you) can decrypt them.
                No third party, including Satark India engineers, has access to raw decrypted user content.
              </p>
              <p>
                User credentials, tokens, and personal identifiers are hashed or tokenized before storage. We
                do not sell or lease your personal information. Any analytics data is anonymized and cannot be
                traced back to an individual.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">3. User Obligations in SOS Usage</h2>
              <p>
                By activating the SOS feature, you affirm that you are in genuine distress and require immediate
                assistance. Misuse of the SOS button for testing, pranks, or non-emergencies is expressly prohibited
                and may result in temporary suspension of your account. Users are responsible for maintaining
                accurate emergency contact information and ensuring that recipients consent to receive notifications.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">4. Limitation of Liability</h2>
              <p>
                Satark India and its affiliates, officers, directors, employees, agents and licensors shall not be
                liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your
                access to or use of or inability to access or use the service; (ii) any conduct or content of any
                third party on the service; or (iii) unauthorized access, use or alteration of your transmissions or
                content. The total liability of Satark India for any claim arising out of or relating to these
                Terms or the service will not exceed the greater of INR 1,000 or the amount you paid us in the past
                twelve months.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">5. GDPR &amp; DPDP Act 2023 Compliance</h2>
              <p>
                If you are a resident of the European Economic Area (EEA), Switzerland, or the United Kingdom,
                you have certain rights under the General Data Protection Regulation (GDPR) including the right
                to access, rectify, erase, restrict processing, object to processing and data portability. To
                exercise these rights, please contact privacy@satarkindia.com.
              </p>
              <p>
                For Indian users, our policies conform to the Digital Personal Data Protection Act, 2023 (DPDP).
                We process personal data only upon lawful basis such as consent, contractual necessity, or
                compliance with legal obligation. You may withdraw consent at any time, and we will delete your
                data upon request unless retention is required by law.
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
