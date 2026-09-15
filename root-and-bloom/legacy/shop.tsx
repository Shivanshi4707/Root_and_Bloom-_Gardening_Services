import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PRODUCTS, useCart, type Product } from "@/lib/cart";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Plants, Tools & Fertilizers | Root & Bloom" },
      { name: "description", content: "Order plants, garden tools, organic fertilizers and pots. Delivered in 90 minutes." },
      { property: "og:title", content: "Root & Bloom Shop" },
      { property: "og:description", content: "Everything for your garden, delivered fast." },
    ],
  }),
  component: Shop,
});

const CATS = ["All", "Plants", "Soil & Fertilizer", "Pots & Planters", "Tools", "Ornaments"];

function Shop() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      PRODUCTS.filter(
        (p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [cat, q],
  );

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Marketplace</span>
        <h1 className="mt-3 text-5xl md:text-6xl font-semibold">Shop the garden.</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">Everyday essentials to rare finds — sourced from trusted growers and delivered in 90 minutes.</p>

        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search plants, tools…"
              className="w-full pl-10 pr-4 py-3 rounded-full bg-card border border-border focus:outline-none focus:border-primary text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  cat === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground/70 hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-20 text-muted-foreground">No products match your search.</p>
        )}
      </section>
    </SiteLayout>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-soft transition">
      <div className="aspect-square bg-gradient-to-br from-secondary to-cream grid place-items-center text-7xl">
        <span className="group-hover:scale-110 transition-transform">{p.emoji}</span>
      </div>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</div>
        <h3 className="mt-1 font-semibold text-base leading-tight">{p.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">₹{p.price}</span>
          <button
            onClick={() => { add(p); toast.success(`${p.name} added to cart`); }}
            className="w-9 h-9 rounded-full gradient-hero grid place-items-center text-primary-foreground hover:opacity-90 transition"
            aria-label="Add to cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
