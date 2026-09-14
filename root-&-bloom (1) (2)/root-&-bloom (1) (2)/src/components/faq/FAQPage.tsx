import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../data/mockData';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CategorizedFAQ {
  question: string;
  answer: string;
  category: string;
}

const EXTENDED_FAQS: CategorizedFAQ[] = [
  {
    category: 'Delivery & Orders',
    question: 'How does 35-minute quick delivery work for live plants?',
    answer: 'We dispatch from micro-nurseries located across Bengaluru, Mumbai, Delhi-NCR, Hyderabad, and Pune. Potted plants travel in custom shock-absorbing ventilated honeycomb caddies on electric two-wheelers, arriving fresh and fully hydrated.',
  },
  {
    category: 'Delivery & Orders',
    question: 'Do you deliver live plants and garden supplies?',
    answer: FAQ_ITEMS[1]?.answer || 'Yes! Our quick-commerce store delivers fresh potted plants, organic fertilizers, pots, and tools directly to your doorstep with zero shock guarantee.',
  },
  {
    category: 'Services & Visits',
    question: 'How do I book garden maintenance?',
    answer: FAQ_ITEMS[0]?.answer || 'Booking takes under 60 seconds. Choose your service, pick date and time slot, and confirm. Our certified horticulturists arrive equipped with organic feeds and tools.',
  },
  {
    category: 'Services & Visits',
    question: 'Can I schedule recurring maintenance or AMC?',
    answer: FAQ_ITEMS[3]?.answer || 'Yes! We offer Weekly, Bi-weekly, and Monthly recurring plans with dedicated horticulturist assignment, automated soil testing, and seasonal flower rotations.',
  },
  {
    category: 'Landscaping & Design',
    question: 'How long does custom landscaping take?',
    answer: FAQ_ITEMS[2]?.answer || 'Balcony and terrace makeovers are completed in 1 to 3 days. Villa backyards take 1 to 3 weeks including hardscaping, teak decking, and automated drip irrigation.',
  },
  {
    category: 'Visualizer & AI',
    question: 'How does the Garden Visualizer work?',
    answer: FAQ_ITEMS[4]?.answer || 'Our Garden Visualizer allows you to choose your space, toggle botanical styles (Zen, Tropical, Minimalist), and view interactive before/after transformations with immediate estimates.',
  },
  {
    category: 'Apartments & Spaces',
    question: 'Do you provide services for apartments and compact balconies?',
    answer: FAQ_ITEMS[5]?.answer || 'Yes! Over 65% of our clients live in apartments. We specialize in vertical living walls, railing planters, and micro-drip systems optimized for urban high-rises.',
  },
  {
    category: 'Commercial',
    question: 'Do you maintain commercial gardens for cafes, hotels & offices?',
    answer: FAQ_ITEMS[6]?.answer || 'Yes, we provide enterprise Green AMCs for tech parks, boutique hotels, cafes, and residential communities with uniformed gardeners and horticulturist audits.',
  },
  {
    category: 'Payments & Rescheduling',
    question: 'What payment methods are accepted and can I reschedule?',
    answer: 'We accept UPI, Cards, Net Banking, and Pay after Service Completion. You can reschedule any booking with zero cancellation penalty up to 4 hours before your slot.',
  },
];

export const FAQPage: React.FC = () => {
  const { setPage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['All', 'Delivery & Orders', 'Services & Visits', 'Landscaping & Design', 'Visualizer & AI', 'Apartments & Spaces'];

  const filteredFaqs = selectedCategory === 'All'
    ? EXTENDED_FAQS
    : EXTENDED_FAQS.filter((item) => item.category === selectedCategory);

  return (
    <div className="py-8 md:py-14 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828]">
            <HelpCircle className="w-3.5 h-3.5 text-[#2A5C43]" />
            <span>Root & Bloom Knowledge Base</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142E20]">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#546E5E]">
            Clear answers regarding 35-min delivery, horticulturist house calls, organic soil feeds, and return policies.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1A3828] text-white shadow-xs'
                  : 'bg-white text-[#2B4333] border border-[#DFD8CB] hover:bg-[#F2ECE1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#DFD8CB] shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#2A5C43] border border-[#E8E1D4]">
                      {faq.category}
                    </span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#142E20]">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#617D6E] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#1A3828]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#4E6757] leading-relaxed border-t border-[#F5EFE6]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Banner */}
        <div className="bg-[#EBF3ED] rounded-3xl p-6 sm:p-8 text-center border border-[#CFE3D5] space-y-3">
          <h4 className="font-serif text-xl font-bold text-[#142E20]">Still have a question?</h4>
          <p className="text-xs text-[#526B5C] max-w-md mx-auto">
            Our botanical concierge and senior horticulturists are available via chat or phone call 7 days a week.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setPage('contact')}
              className="px-5 py-2.5 rounded-xl bg-[#1A3828] text-white text-xs font-semibold shadow-xs"
            >
              Contact Support
            </button>
            <button
              onClick={() => setPage('plant-ai')}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#CFE3D5] text-[#1A3828] text-xs font-semibold"
            >
              Ask Plant AI
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
