import Link from "next/link"
import { ArrowLeft, LifeBuoy, Mail, HelpCircle, ChevronDown } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I scan a phone number?",
      answer: "Navigate to the Search tab, paste the phone number into the search bar, and click the 'Scan' button. We'll analyze it against our threat databases and provide a risk score."
    },
    {
      question: "Is my personal data safe?",
      answer: "Yes. Satark India is built on a privacy-first architecture. We do not store your private SMS, screenshots, or call logs on any external servers. Analysis is performed securely."
    },
    {
      question: "How do I report a new scam?",
      answer: "Go to the 'Offense' tab, click 'Report Scammer', and fill in the details. You can choose to remain anonymous if you prefer. Your reports help protect other citizens."
    },
    {
      question: "What should I do if my data has leaked?",
      answer: "Use our 'Dark Web Check' tool in the Offense tab to see where your data might have leaked. We recommend changing passwords for all affected services and enabling 2FA immediately."
    }
  ]

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-8 pb-20">
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
              <LifeBuoy className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Help <span className="text-emerald-500">Center</span>
            </h1>
          </div>
          
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-emerald-500 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Support
              </h2>
              <p className="text-slate-300">
                Have a question or need technical assistance? Our support team is here to help.
              </p>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-emerald-500 font-mono text-sm">support@satarkindia.com</span>
                <Link 
                  href="mailto:support@satarkindia.com"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-colors"
                >
                  Email Us
                </Link>
              </div>
            </section>

            <section className="space-y-4 pt-4">
              <h2 className="text-xl font-semibold text-emerald-500 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </h2>
              
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-slate-800 px-4">
                      <AccordionTrigger className="text-left text-sm font-medium hover:text-emerald-500 transition-colors">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-400 text-xs leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            <section className="space-y-3 pt-6 border-t border-slate-800">
              <p className="text-sm text-slate-500 italic">
                Our support team typically responds within 24-48 hours. Thank you for using Satark India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
