import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import maintenanceImg from "@/assets/maintenance.jpg";
import landscapeImg from "@/assets/landscape.jpg";
import { CheckCircle2, Sprout, Building2, Home as HomeIcon, TreePine } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Garden Maintenance & Landscaping | Root & Bloom" },
      { name: "description", content: "Recurring maintenance, custom landscaping and corporate garden services from certified professionals." },
      { property: "og:title", content: "Root & Bloom Services" },
      { property: "og:description", content: "Book garden maintenance and landscaping in minutes." },
    ],
  }),
  component: Services,
});

const services = [
  { icon: Sprout, title: "Recurring Maintenance", price: "from ₹899/visit", desc: "Weekly or fortnightly upkeep: mowing, weeding, watering, pest checks.", perks: ["Fixed team assigned", "Photo-report after each visit", "Cancel anytime"] },
  { icon: HomeIcon, title: "One-time Deep Clean", price: "from ₹2,499", desc: "Complete overhaul for neglected gardens: pruning, replanting, feeding.", perks: ["Same-week booking", "Includes basic materials", "6-week aftercare"] },
  { icon: TreePine, title: "Custom Landscaping", price: "on quote", desc: "Full-service design and execution for lawns, terraces and courtyards.", perks: ["3D visualization", "Sourcing & installation", "Warranty on planting"] },
  { icon: Building2, title: "Corporate & Societies", price: "AMC plans", desc: "Cafes, hotels, offices and housing societies — dedicated crews on retainer.", perks: ["GST invoicing", "Compliance & safety", "Monthly reporting"] },
];

function Services() {
  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-10">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Services</span>
        <h1 className="mt-3 text-5xl md:text-6xl font-semibold max-w-3xl">Certified gardeners, on tap.</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Book a one-off visit or set up a recurring plan. Every crew is background-verified, insured and rated by real customers.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.title} className="rounded-3xl p-8 bg-card border border-border shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div className="w-12 h-12 rounded-xl gradient-hero grid place-items-center">
                <s.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-primary">{s.price}</span>
            </div>
            <h3 className="mt-5 text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-muted-foreground">{s.desc}</p>
            <ul className="mt-5 space-y-2">
              {s.perks.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> {p}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full py-3 rounded-full gradient-hero text-primary-foreground font-medium hover:opacity-95 transition">
              Request booking
            </button>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <img src={landscapeImg} alt="Landscaped garden" width={1200} height={900} loading="lazy" className="rounded-3xl shadow-soft object-cover w-full h-full" />
        <div>
          <h2 className="text-4xl font-semibold">From bare lawn to breathtaking.</h2>
          <p className="mt-4 text-muted-foreground">
            Our senior landscape designers translate your brief into planted reality — with 3D previews, curated plant palettes and quality-controlled installation.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Stat n="1,200+" l="Gardens built" />
            <Stat n="4.9/5" l="Avg rating" />
            <Stat n="30+" l="Cities served" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-4xl font-semibold">Reliable maintenance, honest reporting.</h2>
          <p className="mt-4 text-muted-foreground">
            Every visit ends with a photo report and a crisp checklist — you always know what was done, and what your garden needs next.
          </p>
        </div>
        <img src={maintenanceImg} alt="Gardener trimming hedges" width={1200} height={900} loading="lazy" className="order-1 md:order-2 rounded-3xl shadow-soft object-cover w-full h-full" />
      </section>
    </SiteLayout>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-3xl font-display font-semibold text-primary">{n}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
    </div>
  );
}
