import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Plant Care Assistant | Root & Bloom" },
      { name: "description", content: "Ask our AI gardener anything — watering, pruning, pests, plant selection." },
      { property: "og:title", content: "AI Plant Care Assistant" },
      { property: "og:description", content: "Instant gardening tips from Root & Bloom's plant AI." },
    ],
  }),
  component: Assistant,
});

const STARTERS = [
  "How often should I water my monstera?",
  "Why are my plant's leaves yellow?",
  "Best plants for low sunlight?",
  "How to prune a rose bush?",
];

const WELCOME = "Hi 🌱 I'm Bloom, your plant care assistant. Ask me anything about your garden — watering, pests, pruning or plant picks.";

function Assistant() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || isLoading) return;
    setInput("");
    void sendMessage({ text: q });
  }

  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <span className="text-xs uppercase tracking-widest text-primary font-semibold">AI Assistant</span>
        <h1 className="mt-3 text-5xl md:text-6xl font-semibold">Meet Bloom.</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">Your always-on plant expert. Ask about care, seasons, pests or product picks.</p>

        <div className="mt-10 rounded-3xl bg-card border border-border shadow-card overflow-hidden flex flex-col h-[560px]">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-bloom grid place-items-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold">Bloom</div>
              <div className="text-xs text-muted-foreground">
                {isLoading ? "typing…" : "Online · powered by AI"}
              </div>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-secondary text-foreground rounded-bl-sm">
                  {WELCOME}
                </div>
              </div>
            )}
            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              if (!text && m.role === "assistant" && isLoading) {
                return (
                  <div key={m.id} className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl text-sm bg-secondary text-foreground rounded-bl-sm">
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.3s]" />
                      </span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === "user" ? "gradient-hero text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                    {text}
                  </div>
                </div>
              );
            })}
            {status === "submitted" && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl text-sm bg-secondary text-foreground rounded-bl-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.3s]" />
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs text-destructive text-center">
                Something went wrong. Please try again.
              </div>
            )}
          </div>
          {messages.length === 0 && (
            <div className="px-6 pb-3 flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-full bg-secondary text-xs hover:bg-primary hover:text-primary-foreground transition">{s}</button>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-4 border-t border-border flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your plants…"
              className="flex-1 px-4 py-3 rounded-full bg-secondary/60 border border-transparent focus:border-primary focus:outline-none text-sm"
              autoFocus
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="w-12 h-12 rounded-full gradient-hero text-primary-foreground grid place-items-center hover:opacity-90 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
