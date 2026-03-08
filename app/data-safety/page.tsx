import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function DataSafetyPage() {
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
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Data <span className="text-emerald-500">Safety</span>
            </h1>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-slate-300">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">Overview</h2>
              <p>
                Satark India places data safety at the core of its mission. This document outlines how we collect,
                process, store and protect the information you entrust to us, and describes the safeguards we have
                implemented to mitigate risk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">Encryption &amp; Secure Storage</h2>
              <p>
                All sensitive data is encrypted both in transit and at rest using AES-256 and TLS 1.3. We employ
                hardware security modules (HSMs) for key management and rotate encryption keys regularly. Regular
                penetration testing and security audits are performed by third-party vendors.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">Access Controls</h2>
              <p>
                Access to production data is limited to a small set of authorized personnel and is governed by
                role-based access control (RBAC). Administrative actions are logged and reviewed periodically.
                API calls require authentication tokens and are rate-limited to prevent abuse.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">Incident Response</h2>
              <p>
                We maintain an incident response plan that includes detection, containment, eradication, and
                recovery procedures. In the event of a data breach, affected users will be notified within
                72 hours as per GDPR and DPDP Act guidelines.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500">Compliance &amp; Certifications</h2>
              <p>
                Satark India complies with international data protection laws, including GDPR and India’s DPDP Act
                2023. We adhere to ISO 27001 standards and are committed to ongoing compliance and improvement.
              </p>
            </section>

            <section className="space-y-3 border-t border-slate-800 pt-6">
              <p className="text-sm text-slate-500 italic">
                Last updated: March 2026. Data safety practices are reviewed quarterly.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
