import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  description: string;
};

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Snake Plant", price: 449, category: "Plants", emoji: "🪴", description: "Air-purifying, low maintenance indoor plant." },
  { id: "p2", name: "Monstera Deliciosa", price: 899, category: "Plants", emoji: "🌿", description: "Iconic tropical plant with split leaves." },
  { id: "p3", name: "Peace Lily", price: 549, category: "Plants", emoji: "🌱", description: "Elegant flowering plant, thrives in shade." },
  { id: "p4", name: "Rose Bush", price: 699, category: "Plants", emoji: "🌹", description: "Fragrant hybrid tea rose, ready to bloom." },
  { id: "p5", name: "Organic Compost 5kg", price: 299, category: "Soil & Fertilizer", emoji: "🌾", description: "Nutrient-rich compost for healthy growth." },
  { id: "p6", name: "Neem Pesticide 500ml", price: 249, category: "Soil & Fertilizer", emoji: "🧪", description: "Natural organic pest control spray." },
  { id: "p7", name: "Terracotta Pot Set (3)", price: 599, category: "Pots & Planters", emoji: "🏺", description: "Handmade breathable clay pots." },
  { id: "p8", name: "Ceramic Planter", price: 799, category: "Pots & Planters", emoji: "🪻", description: "Modern glazed ceramic planter." },
  { id: "p9", name: "Pruning Shears", price: 399, category: "Tools", emoji: "✂️", description: "Sharp stainless steel garden shears." },
  { id: "p10", name: "Garden Trowel Set", price: 499, category: "Tools", emoji: "🧑‍🌾", description: "Ergonomic 3-piece hand tool set." },
  { id: "p11", name: "Watering Can 5L", price: 349, category: "Tools", emoji: "💧", description: "Durable can with fine-mist rose head." },
  { id: "p12", name: "Solar Garden Lights", price: 899, category: "Ornaments", emoji: "✨", description: "Set of 6 warm-glow pathway lights." },
];

export type CartItem = { product: Product; qty: number };

type CartCtx = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rb_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("rb_cart", JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (p: Product) =>
    setItems((cur) => {
      const ex = cur.find((i) => i.product.id === p.id);
      if (ex) return cur.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...cur, { product: p, qty: 1 }];
    });
  const remove = (id: string) => setItems((cur) => cur.filter((i) => i.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((cur) => (qty <= 0 ? cur.filter((i) => i.product.id !== id) : cur.map((i) => (i.product.id === id ? { ...i, qty } : i))));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, setQty, clear, total, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
