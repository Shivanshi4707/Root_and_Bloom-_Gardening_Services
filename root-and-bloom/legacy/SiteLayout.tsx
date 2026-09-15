import { Link } from "@tanstack/react-router";
import { ShoppingCart, Sprout, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/visualizer", label: "Visualizer" },
  { to: "/assistant", label: "Plant AI" },
  { to: "/contact", label: "Contact" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full gradient-hero grid place-items-center shadow-card">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <div className="font-display text-lg font-semibold text-foreground">Root &amp; Bloom</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Garden co.</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm font-semibold text-primary" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-bold grid place-items-center">
                  {count}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-2 flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-sm text-foreground/80"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 border-t border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full gradient-hero grid place-items-center">
                <Sprout className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold">Root &amp; Bloom</span>
            </div>
            <p className="text-sm text-muted-foreground">
              End-to-end gardening — services, retail and smart plant care in one digital home.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Garden Maintenance</li>
              <li>Custom Landscaping</li>
              <li>Corporate Gardens</li>
              <li>Housing Societies</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Plants</li>
              <li>Tools</li>
              <li>Fertilizers</li>
              <li>Pots &amp; Ornaments</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>hello@rootandbloom.co</li>
              <li>+91 98765 43210</li>
              <li>Mon–Sat, 8am–8pm</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Root &amp; Bloom. Grown with care.
        </div>
      </footer>
    </div>
  );
}
