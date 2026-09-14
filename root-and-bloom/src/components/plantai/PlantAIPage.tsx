import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ShoppingBag,
  ArrowRight,
  RefreshCcw,
  Leaf,
  Plus,
} from 'lucide-react';

interface AIResponse {
  question: string;
  cause: string;
  immediateFix: string;
  longTermCare: string;
  answer?: string;
  recommendedProduct?: {
    name: string;
    reason: string;
    price: number;
    productId?: string;
  };
  timestamp: string;
}

const SAMPLE_QUESTIONS = [
  'Why are my peace lily leaves turning yellow?',
  'How often should I water a snake plant in Indian summers?',
  'Best plants for a dark apartment bedroom?',
  'Natural remedy for white bugs (mealybugs) on hibiscus',
  'Why is my Monstera not developing holes/fenestrations?',
  'Safe organic fertilizer for indoor kitchen herbs',
];

export const PlantAIPage: React.FC = () => {
  const { products, addToCart, setIsBookingModalOpen } = useApp();
  const [questionInput, setQuestionInput] = useState('');
  const [plantNameInput, setPlantNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<AIResponse[]>([
    {
      question: 'Why are my peace lily leaves turning yellow?',
      cause: 'Most commonly caused by overwatering or chlorine/fluoride build-up in municipal tap water. When roots sit in soggy soil without oxygen, they cannot absorb nutrients, leading to chlorosis (yellowing).',
      immediateFix: 'Immediately inspect soil moisture with your finger. If moist, hold off watering until the top 2 inches dry completely. Snip completely yellowed leaves at the base using sterilized shears.',
      longTermCare: 'Water only when the leaves display a gentle slight droop. Use filtered or aerated room-temperature water. Maintain bright, indirect ambient light.',
      recommendedProduct: {
        name: 'Root & Bloom Organic Vermicompost',
        reason: 'Restores beneficial micro-organisms to aerate compacted root zones.',
        price: 180,
        productId: 'prod-11',
      },
      timestamp: 'Just now',
    },
  ]);

  const handleAskQuestion = async (queryText?: string) => {
    const q = queryText || questionInput;
    if (!q.trim()) return;

    setIsLoading(true);
    if (!queryText) setQuestionInput('');

    try {
      const res = await fetch('/api/plant-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, plantName: plantNameInput }),
      });

      if (res.ok) {
        const data = await res.json();
        const newResponse: AIResponse = {
          question: q,
          cause: data.cause || 'Environmental stress or watering imbalance.',
          immediateFix: data.immediateFix || 'Adjust light exposure and calibrate watering cadence.',
          longTermCare: data.longTermCare || 'Fertilize monthly with organic seaweed solution.',
          answer: data.answer,
          recommendedProduct: data.recommendedProduct || {
            name: 'Pure Cold-Pressed Organic Neem Oil Spray (500ml)',
            reason: 'Natural prophylactic repellent for fungal spores and sap insects.',
            price: 249,
            productId: 'prod-13',
          },
          timestamp: 'Just now',
        };
        setHistory((prev) => [newResponse, ...prev]);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      // Fallback local response
      const fallback: AIResponse = {
        question: q,
        cause: 'Seasonal transpiration stress or watering schedule inconsistency.',
        immediateFix: 'Check root drainage holes for blockage. Move plant to a spot with gentle morning light.',
        longTermCare: 'Aerate soil surface once every 14 days and apply balanced organic compost.',
        recommendedProduct: {
          name: 'Pure Cold-Pressed Organic Neem Oil Spray (500ml)',
          reason: 'Protects foliage and stimulates root vitality.',
          price: 249,
          productId: 'prod-13',
        },
        timestamp: 'Just now',
      };
      setHistory((prev) => [fallback, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 md:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828]">
            <Sparkles className="w-3.5 h-3.5 text-[#2A5C43]" />
            <span>Dr. Flora • AI Plant Clinic</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#142E20]">
            Instant Botanical Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#546E5E] leading-relaxed">
            Get precision diagnostics, root-cause analysis, and step-by-step restoration remedies for your plants, powered by botanical science.
          </p>
        </div>

        {/* Question Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD8CB] shadow-sm space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion();
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A4434] mb-1">
                  Describe the issue or ask a question
                </label>
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="e.g. My peace lily leaves are drooping and turning yellow..."
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#D5CDBC] bg-[#FAF8F5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2A5C43]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A4434] mb-1">
                  Plant Name (Optional)
                </label>
                <input
                  type="text"
                  value={plantNameInput}
                  onChange={(e) => setPlantNameInput(e.target.value)}
                  placeholder="e.g. Fiddle Leaf Fig"
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#D5CDBC] bg-[#FAF8F5] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2A5C43]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-[#698072]">
                Tip: Mention if the plant is indoors or outdoors for higher diagnostic accuracy.
              </span>

              <button
                type="submit"
                disabled={isLoading || !questionInput.trim()}
                className="w-full sm:w-auto bg-[#1A3828] hover:bg-[#11281D] disabled:opacity-50 text-white px-7 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#1A3828]/20 transition-all active:scale-95"
              >
                {isLoading ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin text-[#8FE388]" />
                    <span>Diagnosing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#8FE388]" />
                    <span>Ask Dr. Flora</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Prompt Chips */}
          <div className="pt-3 border-t border-[#F2ECE1]">
            <span className="text-[11px] font-bold text-[#566E60] block mb-2">
              Frequently Asked Diagnostic Inquiries:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setQuestionInput(q);
                    handleAskQuestion(q);
                  }}
                  className="text-xs px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#1A3828] hover:text-white border border-[#DFD8CB] text-[#243E2E] transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnosis Results Thread */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#142E20]">
              Botanical Consultation & Prescriptions
            </h3>
            <span className="text-xs text-[#607769]">
              {history.length} {history.length === 1 ? 'diagnosis' : 'diagnoses'}
            </span>
          </div>

          {history.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD8CB] shadow-sm space-y-6 animate-in fade-in"
            >
              {/* Question Header */}
              <div className="flex items-start gap-3 pb-4 border-b border-[#F2ECE1]">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] text-[#2A5C43] flex items-center justify-center text-xl shrink-0">
                  🌿
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#2A5C43] tracking-wide block">
                    Patient Inquiry
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#142E20]">
                    "{item.question}"
                  </h4>
                </div>
              </div>

              {/* 3 Structured Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Column 1: Probable Cause */}
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E1D4] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A0522D]">
                    <AlertTriangle className="w-4 h-4 text-[#D27D46]" />
                    <span>Probable Cause</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#465E50] leading-relaxed">
                    {item.cause}
                  </p>
                </div>

                {/* Column 2: Immediate Fix */}
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E1D4] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
                    <CheckCircle2 className="w-4 h-4 text-[#2A5C43]" />
                    <span>Immediate Fix</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#465E50] leading-relaxed">
                    {item.immediateFix}
                  </p>
                </div>

                {/* Column 3: Long Term Care */}
                <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E1D4] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#355B45]">
                    <Calendar className="w-4 h-4 text-[#355B45]" />
                    <span>Long-Term Care</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#465E50] leading-relaxed">
                    {item.longTermCare}
                  </p>
                </div>
              </div>

              {/* Recommended Product or Action Bar */}
              {item.recommendedProduct && (
                <div className="bg-[#F4F9F5] rounded-2xl p-4 sm:p-5 border border-[#CFE3D5] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#CFE3D5] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      🧪
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#2A5C43] tracking-wide block">
                        Prescribed Botanical Remedy
                      </span>
                      <h5 className="font-bold text-sm text-[#142E20]">
                        {item.recommendedProduct.name} • ₹{item.recommendedProduct.price}
                      </h5>
                      <p className="text-xs text-[#526D5D] mt-0.5">
                        {item.recommendedProduct.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const matched = products.find((p) => p.name.includes(item.recommendedProduct!.name.split(' ')[0]));
                        if (matched) addToCart(matched, 1);
                        else if (products.length > 0) addToCart(products[0], 1);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#1A3828] hover:bg-[#12281D] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Remedy to Cart</span>
                    </button>
                  </div>
                </div>
              )}

              {/* House Call Specialist Suggestion */}
              <div className="text-right">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="text-xs font-semibold text-[#2A5C43] hover:underline inline-flex items-center gap-1"
                >
                  <span>Need an in-person plant doctor visit? Book a clinic call →</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
