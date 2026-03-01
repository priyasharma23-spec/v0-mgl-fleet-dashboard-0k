"use client";
import { useState } from "react";
import { Plus, MessageCircle, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";

export default function FOSupport() {
  const [tickets] = useState([
    { id: "TKT001", subject: "Card not received", desc: "I haven't received my fuel card yet", date: "2024-03-01", status: "Open", priority: "High" },
    { id: "TKT002", subject: "Transaction issue", desc: "Transaction failed but amount was deducted", date: "2024-02-28", status: "In Progress", priority: "High" },
    { id: "TKT003", subject: "Limit increase request", desc: "Need to increase daily fuel limit", date: "2024-02-25", status: "Resolved", priority: "Low" },
  ]);

  const faqs = [
    { q: "How do I request a fuel card?", a: "Go to My Cards section and click Request New Card. Fill in vehicle details and submit." },
    { q: "What are the transaction limits?", a: "Daily limit is ₹50,000 and monthly limit is ₹5,00,000. You can request limit increase anytime." },
    { q: "How long does card delivery take?", a: "Cards are typically delivered within 7-10 business days from approval." },
  ];

  return (
    <div className="p-6 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support & Communication</h1>
          <p className="text-muted-foreground mt-1">Get help and manage your support tickets</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Ticket
        </button>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <MessageCircle className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-sm font-medium text-foreground">Live Chat</p>
          <p className="text-xs text-muted-foreground mt-1">Available 9 AM - 6 PM (Mon-Fri)</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <AlertCircle className="w-6 h-6 text-amber-600 mb-2" />
          <p className="text-sm font-medium text-foreground">Email Support</p>
          <p className="text-xs text-muted-foreground mt-1">support@mgl.com</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <Clock className="w-6 h-6 text-green-600 mb-2" />
          <p className="text-sm font-medium text-foreground">Response Time</p>
          <p className="text-xs text-muted-foreground mt-1">Typically within 2 hours</p>
        </div>
      </div>

      {/* Support Tickets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Support Tickets</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="pl-10 pr-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{ticket.subject}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    ticket.priority === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{ticket.desc}</p>
                <p className="text-xs text-muted-foreground mt-1">{ticket.id} • {ticket.date}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded font-medium ${
                ticket.status === "Open" ? "bg-blue-100 text-blue-700" :
                ticket.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                "bg-green-100 text-green-700"
              }`}>
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details key={idx} className="border border-border rounded-lg p-4 group cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-foreground">
                {faq.q}
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-2">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
