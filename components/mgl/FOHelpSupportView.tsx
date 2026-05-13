"use client"

import { useState } from "react"
import { Phone, Mail, MessageCircle, FileText, ChevronRight, ExternalLink, Clock, MapPin } from "lucide-react"

const faqs = [
  { q: "How do I add a new vehicle to my fleet?", a: "Go to Vehicles > Add Vehicle and follow the step-by-step process. Upload your RC document and we will auto-fill vehicle details." },
  { q: "How long does card issuance take?", a: "For MIC-assisted onboarding, cards are typically issued within 3-5 business days after L2 approval. Self-service cards take 5-7 business days." },
  { q: "How do I check my wallet balance?", a: "Your wallet balance is displayed on the Dashboard. You can also go to Wallet section for detailed transaction history." },
  { q: "What if my vehicle document is rejected?", a: "You will receive a notification with the rejection reason. Go to Vehicles, find the rejected vehicle, and re-upload the correct documents." },
  { q: "How do I track my card delivery?", a: "Go to Card Delivery section to see real-time tracking of your card shipment with courier details and expected delivery date." },
  { q: "Can I transfer balance between vehicles?", a: "Yes, you can transfer balance between vehicles in your fleet through the Wallet section. Select 'Transfer' and choose source and destination vehicles." },
]

export default function FOHelpSupportView() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground mt-1">Get assistance with your fleet operations</p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="tel:18001234567" className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <Phone className="w-5 h-5 text-green-600" />
          </div>
          <p className="font-semibold text-foreground">Call Us</p>
          <p className="text-sm text-muted-foreground mt-1">1800-123-4567</p>
          <p className="text-xs text-muted-foreground">Toll Free, 24x7</p>
        </a>

        <a href="mailto:support@mglfleet.com" className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <p className="font-semibold text-foreground">Email Support</p>
          <p className="text-sm text-muted-foreground mt-1">support@mglfleet.com</p>
          <p className="text-xs text-muted-foreground">Response within 24 hrs</p>
        </a>

        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-semibold text-foreground">WhatsApp</p>
          <p className="text-sm text-muted-foreground mt-1">+91 98765 43210</p>
          <p className="text-xs text-muted-foreground">Quick responses</p>
        </a>
      </div>

      {/* FAQs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <p className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Frequently Asked Questions
          </p>
        </div>
        <div className="divide-y divide-border">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
              >
                <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expandedFaq === i ? "rotate-90" : ""}`} />
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-3 text-sm text-muted-foreground bg-muted/10">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MIC Contact */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="font-semibold text-foreground mb-3">Your MIC Contact</p>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
            RK
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">Rajesh Kumar</p>
            <p className="text-sm text-muted-foreground">MIC Officer - Mumbai Central</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a href="tel:+919876543210" className="text-xs text-primary flex items-center gap-1">
                <Phone className="w-3 h-3" /> +91 98765 43210
              </a>
              <a href="mailto:rajesh.k@mgl.com" className="text-xs text-primary flex items-center gap-1">
                <Mail className="w-3 h-3" /> rajesh.k@mgl.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Office Hours & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <p className="font-semibold text-foreground">Office Hours</p>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monday - Friday</span>
              <span className="text-foreground">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saturday</span>
              <span className="text-foreground">9:00 AM - 1:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sunday</span>
              <span className="text-foreground">Closed</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <p className="font-semibold text-foreground">Head Office</p>
          </div>
          <p className="text-sm text-muted-foreground">
            MGL House, G-33, Bandra Kurla Complex,<br />
            Bandra (E), Mumbai - 400051
          </p>
          <a
            href="https://maps.google.com/?q=MGL+House+BKC+Mumbai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary flex items-center gap-1 mt-2"
          >
            View on Maps <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Raise Ticket */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="font-semibold text-amber-900 mb-1">Need more help?</p>
        <p className="text-sm text-amber-700 mb-3">
          If you could not find the answer to your question, raise a support ticket and our team will get back to you within 24 hours.
        </p>
        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
          Raise Support Ticket
        </button>
      </div>
    </div>
  )
}
