import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import heroImg from "@/assets/hero-garden.jpg";
import landscapeImg from "@/assets/landscape.jpg";
import maintenanceImg from "@/assets/maintenance.jpg";
import { ArrowRight, Truck, Sparkles, Leaf, Sun, Cloud, Bot, Bell, ShoppingBag, Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Root & Bloom — One-stop Garden Care & Marketplace" },
      { name: "description", content: "Book gardeners, design your landscape and shop plants, tools and fertilizers — delivered in 90 minutes." },
      { property: "og:title", content: "Root & Bloom — One-stop Garden Care" },
      { property: "og:description", content: "Gardening services and marketplace, delivered to your doorstep." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" className="w-full h-full object-cover" width={1600} height={1200} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-28 md:pt-32 md:pb-40 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Gardening, reinvented
            </span>
            <h1 className="mt-4 text-5xl md:text-7xl font-semibold text-foreground leading-[1.05]">
              Your garden,<br />
              <span className="italic text-primary">delivered.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Book expert gardeners, get bespoke landscape designs and order plants, tools &amp;
              fertilizers — all in one app. Fresh, fast, from Root &amp; Bloom.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-hero text-primary-foreground font-medium shadow-soft hover:opacity-95 transition">
                Book a service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border text-foreground font-medium hover:border-primary transition">
                Shop garden essentials
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> 90-min delivery</div>
              <div className="flex items-center gap-2"><Leaf className="w-4 h-4 text-primary" /> Vetted gardeners</div>
              <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> AI plant care</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold">Everything, one platform</h2>
            <p className="mt-3 text-muted-foreground max-w-xl">Blink-fast bookings and delivery for gardens of every scale.</p>
          </div>
          <Link to="/services" className="hidden md:inline-flex items-center gap-1 text-primary font-medium">See all <ArrowRight className="w-4 h-4" /></Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard img={maintenanceImg} tag="Recurring & on-demand" title="Garden Maintenance" desc="Weekly, monthly or one-off visits by certified gardeners for homes, cafes and societies." icon={Wrench} to="/services" />
          <FeatureCard img={landscapeImg} tag="Design to execution" title="Custom Landscaping" desc="Consult, 3D-visualize and install your dream garden with our senior designers." icon={Leaf} to="/visualizer" />
          <FeatureCard img={heroImg} tag="90-minute delivery" title="Retail Marketplace" desc="Plants, tools, organic fertilizers and ornaments — sourced local, delivered fast." icon={ShoppingBag} to="/shop" />
        </div>
      </section>

      {/* SMART FEATURES */}
      <section className="bg-secondary/40 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-primary font-semibold">Smart features</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-semibold">Grown with intelligence</h2>
            <p className="mt-4 text-muted-foreground">A digital ecosystem that helps your garden thrive — season after season.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SmartTile icon={Bot} title="AI Plant Care Assistant" desc="Ask anything — from yellow leaves to pruning schedules." to="/assistant" />
            <SmartTile icon={Cloud} title="Weather Recommendations" desc="Tailored tips based on today's forecast in your city." />
            <SmartTile icon={Sun} title="Personalized Suggestions" desc="Products picked from your purchase history." />
            <SmartTile icon={Bell} title="Care Reminders" desc="Watering, feeding &amp; pruning nudges — never miss." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-16 shadow-soft">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-semibold text-primary-foreground">See it before you plant it.</h2>
            <p className="mt-4 text-primary-foreground/85 text-lg">
              Upload a photo of your garden. Our Visualizer proposes a landscape design in seconds.
            </p>
            <Link to="/visualizer" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-foreground font-medium hover:bg-cream transition">
              Try the Visualizer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function FeatureCard({ img, tag, title, desc, icon: Icon, to }: any) {
  return (
    <Link to={to} className="group block rounded-3xl overflow-hidden bg-card shadow-card hover:shadow-soft transition">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={img} alt={title} width={1200} height={900} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
          <Icon className="w-3.5 h-3.5" /> {tag}
        </div>
        <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-primary font-medium text-sm">Explore <ArrowRight className="w-4 h-4" /></span>
      </div>
    </Link>
  );
}

function SmartTile({ icon: Icon, title, desc, to }: any) {
  const body = (
    <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-card transition">
      <div className="w-11 h-11 rounded-xl gradient-bloom grid place-items-center mb-4">
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : <div>{body}</div>;
}
