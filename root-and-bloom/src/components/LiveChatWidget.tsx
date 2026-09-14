import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sendChatMessage, ChatHistoryItem } from '../services/geminiService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  source?: 'gemini' | 'knowledge-base';
}

export const LiveChatWidget: React.FC = () => {
  const { setPage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: "Namaste! Welcome to Root & Bloom Support 🌿 I'm Flora, your horticultural assistant. How can I help with your plants or garden today?",
      time: 'Just now',
    },
  ]);

  const QUICK_OPTIONS = [
    { label: '📦 Order Support', query: 'Where is my order and how fast is delivery?' },
    { label: '🌿 Service Booking', query: 'How do I book a gardener for this weekend?' },
    { label: '🪴 Plant Care Advice', query: 'My money plant leaves are turning yellow. What should I do?' },
    { label: '💳 Payment Help', query: 'What payment options do you support?' },
    { label: '☀️ Balcony Garden', query: 'What plants are best for a sunny balcony?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now',
    };

    const currentHistory: ChatHistoryItem[] = [...messages, userMsg].map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const result = await sendChatMessage(text, currentHistory);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.reply,
        time: 'Just now',
        source: result.source,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "I am here to assist with your garden! Feel free to ask about plants, watering tips, routine maintenance visits, or fast 35-minute delivery.",
        time: 'Just now',
        source: 'knowledge-base',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <>
      {/* Floating Action Leaf Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-5 z-40 bg-[#1A3828] hover:bg-[#11291D] text-white p-3.5 rounded-full shadow-2xl shadow-[#1A3828]/40 border border-[#2F593F] flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 group"
          aria-label="Open Root & Bloom Live Support"
        >
          <div className="relative">
            <span className="text-xl">🌿</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#8FE388] rounded-full border-2 border-[#1A3828] animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline-block">
            Support Chat
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-[#FAF8F5] rounded-3xl border border-[#DCD5C5] shadow-2xl overflow-hidden flex flex-col max-h-[560px] animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#1A3828] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2A5C43] flex items-center justify-center text-lg">
                🌱
              </div>
              <div>
                <h4 className="font-serif font-bold text-base leading-tight">Root & Bloom Support</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#8FE388] animate-pulse" />
                  <span className="text-[11px] text-[#A7F3D0]">Horticulturists Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#9DB5A6] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Options Chips */}
          <div className="bg-[#F0ECE1] px-3 py-2 border-b border-[#E3DCCF] flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSend(opt.query)}
                className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#DDD5C5] text-[#243D2D] hover:bg-[#1A3828] hover:text-white transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#FAF8F5] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#2A5C43] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    🌱
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1A3828] text-white rounded-tr-xs'
                      : 'bg-white text-[#203629] border border-[#DFD8CA] rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className={`text-[9px] ${m.sender === 'user' ? 'text-[#8FE388]' : 'text-[#7D9485]'}`}>
                      {m.time}
                    </span>
                    {m.sender === 'bot' && m.source && (
                      <span className="text-[8px] font-semibold text-[#8B9F92]">
                        {m.source === 'gemini' ? '✨ Powered by Gemini' : '🌿 Botanical KB'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start items-center text-xs text-[#526D5E]">
                <div className="w-6 h-6 rounded-full bg-[#2A5C43] text-white flex items-center justify-center shrink-0 text-[10px]">
                  🌱
                </div>
                <div className="bg-white p-3 rounded-2xl border border-[#DFD8CA] rounded-tl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2A5C43] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#2A5C43] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#2A5C43] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-[#556F61] ml-1">Flora is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#E3DCCF] bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about plants, orders, bookings..."
              className="flex-1 bg-[#F5F2EB] text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#2A5C43] focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-[#1A3828] disabled:opacity-40 text-white p-2.5 rounded-xl hover:bg-[#12281D] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
