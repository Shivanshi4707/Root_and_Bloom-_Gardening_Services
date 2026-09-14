import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  CheckCircle2,
  Upload,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Building,
  Home,
  Shield,
  Layers,
} from 'lucide-react';

export const LandscapingPage: React.FC = () => {
  const { submitLandscapingQuote, setPage } = useApp();

  const [customerName, setCustomerName] = useState('Vikramaditya Singhania');
  const [phone, setPhone] = useState('+91 98200 44123');
  const [location, setLocation] = useState('Koramangala 3rd Block, Bengaluru');
  const [spaceType, setSpaceType] = useState<'Apartment Balcony' | 'Villa Backyard' | 'Rooftop Terrace' | 'Commercial Office Campus' | 'Cafe Patio'>('Villa Backyard');
  const [gardenAreaSqFt, setGardenAreaSqFt] = useState<number>(650);
  const [preferredStyle, setPreferredStyle] = useState<'Tropical Resort' | 'Japanese Zen & Rock Garden' | 'Modern Minimalist' | 'English Cottage Garden' | 'Vertical Living Wall Architecture'>('Tropical Resort');
  const [budgetRange, setBudgetRange] = useState<'Under ₹50,000' | '₹50,000 - ₹1,50,000' | '₹1,50,000 - ₹3,50,000' | 'Above ₹3,50,000'>('₹1,50,000 - ₹3,50,000');
  const [notes, setNotes] = useState('We want natural river stone walkways, low-maintenance drip irrigation, and outdoor spotlighting.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLandscapingQuote({
      customerName,
      phone,
      location,
      spaceType,
      gardenAreaSqFt: Number(gardenAreaSqFt),
      preferredStyle,
      budgetRange,
      notes,
    });
    setIsSubmitted(true);
  };

  const PROCESS_STEPS = [
    { step: '01', title: 'Site Consultation & Soil Test', desc: 'Our architectural horticulturist surveys sunlight exposure, wind vectors, tap pressure, and drainage.' },
    { step: '02', title: '3D Concept & Blueprinting', desc: 'Receive photorealistic 3D daytime and night renderings of your proposed botanical layout.' },
    { step: '03', title: 'Specimen & Material Selection', desc: 'Handpick mature plants, outdoor weather-sealed planters, teak decks, and granite water features.' },
    { step: '04', title: 'Turnkey Execution', desc: 'Our civil and horticultural crew builds the irrigation, soil bed, planting, and ambient lighting in 3-7 days.' },
    { step: '05', title: 'Ongoing Care & AMC', desc: 'Weekly pruning, seasonal flower rotations, and health check-ups keep your investment thriving year-round.' },
  ];

  const PORTFOLIO = [
    {
      title: 'The Sky Sanctuary • 28th Floor Penthouse',
      location: 'UB City, Bengaluru',
      area: '1,200 sq ft',
      image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=800&q=80',
      style: 'Tropical Modernist',
    },
    {
      title: 'Zen Courtyard & Koi Reflection Pool',
      location: 'Jubilee Hills, Hyderabad',
      area: '850 sq ft',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      style: 'Japanese Rock Garden',
    },
    {
      title: 'Biophilic Headquarters Terrace Lounge',
      location: 'Whitefield Tech Corridor, Bengaluru',
      area: '2,400 sq ft',
      image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=800&q=80',
      style: 'Commercial Living Walls',
    },
  ];

  return (
    <div className="py-8 md:py-14 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828]">
            <Compass className="w-3.5 h-3.5 text-[#2A5C43]" />
            <span>Root & Bloom Design Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#142E20] leading-[1.1]">
            Turnkey Landscaping & Architectural Living Spaces
          </h1>
          <p className="text-sm sm:text-base text-[#4E6657] leading-relaxed">
            From compact high-rise apartment balconies to multi-acre residential estates and luxury hotel courtyards. We design, build, and maintain living sanctuaries.
          </p>
        </div>

        {/* 5-Step Process Section */}
        <div className="space-y-8">
          <div className="border-b border-[#E3DCCF] pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2A5C43]">
              Methodology
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20] mt-1">
              How We Bring Your Garden to Life
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-2xl p-5 border border-[#DFD8CB] shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="font-serif text-3xl font-bold text-[#2A5C43]/40 block">
                    {step.step}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#142E20] mt-1">
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs text-[#597262] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Showcase Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E3DCCF] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2A5C43]">
                Selected Works
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20] mt-1">
                Completed Landscape Transformations
              </h2>
            </div>
            <span className="text-xs text-[#627A6C]">
              Over 280+ architectural landscape projects executed across India
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTFOLIO.map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-[#DFD8CB] shadow-sm group hover:shadow-xl transition-all"
              >
                <div className="relative h-64 overflow-hidden bg-[#F2ECE1]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    {p.style}
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] text-[#A7F3D0] block">{p.location} • {p.area}</span>
                    <h4 className="font-serif font-bold text-lg leading-tight mt-0.5">{p.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Landscaping Quote Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DFD8CB] shadow-md relative">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#2A5C43]">
                Free Architectural Consultation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#142E20]">
                Request a Custom Landscaping Quote
              </h2>
              <p className="text-xs sm:text-sm text-[#546E5E]">
                Tell us about your space. Our senior landscape architect will prepare an initial site survey estimate within 24 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-[#EBF3ED] rounded-2xl p-8 text-center space-y-3 border border-[#D0E2D5]">
                <div className="w-14 h-14 rounded-full bg-[#2A5C43] text-white flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#142E20]">
                  Quote Request Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-[#4E6857] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{customerName}</strong>. Our senior project lead has been notified. We will reach out via WhatsApp/Call at <strong>{phone}</strong> to confirm your site visit.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setPage('home')}
                    className="px-6 py-2.5 rounded-xl bg-[#1A3828] text-white text-xs font-bold"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#293E31] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs focus:ring-2 focus:ring-[#2A5C43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#293E31] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs focus:ring-2 focus:ring-[#2A5C43]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#293E31] mb-1">Space Type</label>
                    <select
                      value={spaceType}
                      onChange={(e) => setSpaceType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold focus:ring-2 focus:ring-[#2A5C43]"
                    >
                      <option value="Apartment Balcony">Apartment Balcony</option>
                      <option value="Villa Backyard">Villa Backyard</option>
                      <option value="Rooftop Terrace">Rooftop Terrace</option>
                      <option value="Commercial Office Campus">Commercial Office Campus</option>
                      <option value="Cafe Patio">Cafe Patio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#293E31] mb-1">Approx. Area (Sq Ft)</label>
                    <input
                      type="number"
                      required
                      value={gardenAreaSqFt}
                      onChange={(e) => setGardenAreaSqFt(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold focus:ring-2 focus:ring-[#2A5C43]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#293E31] mb-1">Preferred Botanical Style</label>
                    <select
                      value={preferredStyle}
                      onChange={(e) => setPreferredStyle(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold focus:ring-2 focus:ring-[#2A5C43]"
                    >
                      <option value="Tropical Resort">Tropical Resort & Palm Garden</option>
                      <option value="Japanese Zen & Rock Garden">Japanese Zen & Rock Garden</option>
                      <option value="Modern Minimalist">Modern Minimalist & Scandi</option>
                      <option value="English Cottage Garden">English Cottage Garden</option>
                      <option value="Vertical Living Wall Architecture">Vertical Living Wall Architecture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#293E31] mb-1">Target Budget Range</label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold focus:ring-2 focus:ring-[#2A5C43]"
                    >
                      <option value="Under ₹50,000">Under ₹50,000</option>
                      <option value="₹50,000 - ₹1,50,000">₹50,000 - ₹1,50,000</option>
                      <option value="₹1,50,000 - ₹3,50,000">₹1,50,000 - ₹3,50,000</option>
                      <option value="Above ₹3,50,000">Above ₹3,50,000 (Estate / Commercial)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#293E31] mb-1">Site Location & City</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs focus:ring-2 focus:ring-[#2A5C43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#293E31] mb-1">Design Vision & Special Features</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Automated drip line, ambient garden lighting, pet safety..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs focus:ring-2 focus:ring-[#2A5C43]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1A3828] hover:bg-[#11291D] text-white py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-[#1A3828]/25 transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>Generate Instant Estimate & Request Blueprint</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
