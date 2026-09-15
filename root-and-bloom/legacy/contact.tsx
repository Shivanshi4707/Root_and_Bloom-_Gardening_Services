import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & FAQ | Root & Bloom" },
      { name: "description", content: "Get in touch, book a callback, or find answers to common gardening service questions." },
      { property: "og:title", content: "Contact Root & Bloom" },
      { property: "og:description", content: "Talk to our garden concierge or find quick answers." },
    ],
  }),
  component: Contact,
});

const FAQ = [
  { q: "Which cities do you serve?", a: "We currently operate in Bengaluru, Mumbai, Pune, Hyderabad, Delhi NCR and 25+ other cities. Expanding fast — check availability at checkout." },
  { q: "How quickly can a gardener visit?", a: "Same-day for one-off bookings placed before 2 PM. Recurring plans start within 48 hours." },
  { q: "Is delivery really 90 minutes?", a: "Yes — for products in stock at your nearest micro-warehouse. Bulky items like large planters may take 24–48 hours." },
  { q: "Do you offer a plant warranty?", a: "All plants come with a 14-day replacement guarantee if cared for as per the included instructions." },
  { q: "Can I cancel a recurring maintenance plan?", a: "Anytime, no lock-in. We'll pro-rate the current cycle." },
];

function Contact() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Get in touch</span>
          <h1 className="mt-3 text-5xl md:text-6xl font-semibold">We're just a message away.</h1>
          <p className="mt-4 text-muted-foreground">Questions about services, bulk orders or partnerships — our concierge team responds in under an hour.</p>

          <div className="mt-8 space-y-4">
            <Info icon={Phone} label="Phone" value="+91 98765 43210" />
            <Info icon={Mail} label="Email" value="hello@rootandbloom.co" />
            <Info icon={MapPin} label="HQ" value="Indiranagar, Bengaluru 560038" />
            <Info icon={MessageCircle} label="Live chat" value="Mon–Sat, 8am–8pm" />
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("Thanks — we'll get back to you shortly!"); (e.target as HTMLFormElement).reset(); }}
          className="p-8 rounded-3xl bg-card border border-border shadow-card space-y-4"
        >
          <h2 className="text-2xl font-semibold">Send us a note</h2>
          <Field label="Name"><input required className="input" placeholder="Your name" /></Field>
          <Field label="Email"><input required type="email" className="input" placeholder="you@example.com" /></Field>
          <Field label="Phone"><input className="input" placeholder="+91…" /></Field>
          <Field label="How can we help?">
            <textarea required rows={4} className="input resize-none" placeholder="Tell us about your garden…" />
          </Field>
          <button className="w-full py-3 rounded-full gradient-hero text-primary-foreground font-semibold">Send message</button>
          <style>{`.input{width:100%;padding:.75rem 1rem;border-radius:.75rem;background:var(--secondary);border:1px solid transparent;font-size:.875rem;outline:none}.input:focus{border-color:var(--primary);background:var(--card)}`}</style>
        </form>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-4xl md:text-5xl font-semibold text-center">Frequently asked</h2>
        <div className="mt-10 space-y-3">
          {FAQ.map((f, i) => (
            <div key={i} className="rounded-2xl bg-card border border-border overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                <span className="font-semibold">{f.q}</span>
                <span className="text-primary text-2xl leading-none">{open === i ? "–" : "+"}</span>
              </button>
              {open === i && <div className="px-6 pb-5 text-sm text-muted-foreground">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

function Info({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl gradient-bloom grid place-items-center">
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
