import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Upload, Sparkles, Image as ImageIcon, Download } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/visualizer")({
  head: () => ({
    meta: [
      { title: "Garden Visualizer — See your dream garden | Root & Bloom" },
      { name: "description", content: "Upload a photo of your garden and preview an AI-generated landscape design instantly." },
      { property: "og:title", content: "Garden Visualizer | Root & Bloom" },
      { property: "og:description", content: "Photo-to-design landscape preview." },
    ],
  }),
  component: Visualizer,
});

const STYLES = ["Tropical oasis", "Zen minimal", "English cottage", "Modern desert"];

function Visualizer() {
  const [img, setImg] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [style, setStyle] = useState(STYLES[0]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(f: File) {
    if (f.size > 8 * 1024 * 1024) {
      toast.error("Please upload an image under 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(f);
  }

  async function visualize() {
    if (!img) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: img, style }),
      });
      if (res.status === 429) throw new Error("Too many requests — please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please top up to continue.");
      if (!res.ok) throw new Error("Could not generate your design. Please try another photo.");
      const data = (await res.json()) as { image: string };
      setResult(data.image);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const shown = result ?? img;

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">Garden Visualizer</span>
        <h1 className="mt-3 text-5xl md:text-6xl font-semibold">See it before you plant it.</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          Upload a photo of your existing garden or empty plot. Pick a style. Our AI redesigns your space so you can book it with one tap.
        </p>

        <div className="mt-10 grid lg:grid-cols-[1fr,340px] gap-8">
          <div>
            <div
              onClick={() => !busy && inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) pick(f); }}
              className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-border bg-card hover:border-primary transition cursor-pointer grid place-items-center"
            >
              {shown ? (
                <>
                  <img src={shown} alt={result ? `${style} garden design preview` : "Your garden"} className={`w-full h-full object-cover transition ${busy ? "blur-sm scale-105" : ""}`} />
                  {result && !busy && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/90 text-xs font-semibold text-primary flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {style} design
                    </div>
                  )}
                  {busy && (
                    <div className="absolute inset-0 grid place-items-center bg-background/60">
                      <div className="text-primary font-medium animate-pulse">Designing your garden…</div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-14 h-14 mx-auto rounded-2xl gradient-hero grid place-items-center">
                    <Upload className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="mt-4 font-semibold">Drop a photo or click to upload</p>
                  <p className="mt-1 text-sm text-muted-foreground">JPG or PNG. Best results with well-lit shots.</p>
                </div>
              )}
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
            </div>

            {result && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={() => setResult(null)} className="px-4 py-2 rounded-full bg-secondary text-sm font-medium">Show original</button>
                <a href={result} download={`root-and-bloom-${style.toLowerCase().replace(/\s+/g, "-")}.png`} className="px-4 py-2 rounded-full bg-secondary text-sm font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download design
                </a>
              </div>
            )}
          </div>

          <aside className="p-6 rounded-3xl bg-card border border-border h-fit space-y-5">
            <div>
              <label className="text-sm font-semibold">Style</label>
              <div className="mt-2 space-y-2">
                {STYLES.map((s) => (
                  <label key={s} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 cursor-pointer">
                    <input type="radio" name="style" checked={style === s} onChange={() => setStyle(s)} className="accent-[oklch(0.45_0.13_150)]" />
                    <span className="text-sm">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              disabled={!img || busy}
              onClick={visualize}
              className="w-full py-3 rounded-full gradient-hero text-primary-foreground font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {busy ? "Visualizing…" : result ? "Regenerate" : "Visualize"}
            </button>
            {result && (
              <div className="p-4 rounded-xl bg-secondary/60 text-sm">
                <div className="font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Design ready</div>
                <p className="mt-1 text-muted-foreground">Estimated project cost: ₹28,000 – ₹42,000.</p>
                <button className="mt-3 w-full py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">Book a consultation</button>
              </div>
            )}
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
