import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageView } from '../../types';
import {
  Wrench,
  Compass,
  ShoppingBag,
  Bot,
  Sparkles,
  CloudSun,
  ArrowRight,
  Building,
  Home,
  Coffee,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export const ServiceCardsSection: React.FC = () => {
  const { setPage, setIsBookingModalOpen } = useApp();
  const [selectedCustomerType, setSelectedCustomerType] = useState('Apartments');

  const CORE_SERVICES = [
    {
      id: 'maintenance',
      icon: '🌱',
      title: 'Garden Maintenance & Care',
      tagline: 'Keep your garden healthy, beautiful and thriving.',
      description: 'Scheduled visits by verified horticulturists for soil aeration, organic feeds, and pest checks.',
      cta: 'View all services →',
      action: () => setPage('services'),
      badge: 'Most Popular',
      bgClass: 'hover:border-[#2A5C43]',
    },
    {
      id: 'landscaping',
      icon: '🏡',
      title: 'Landscaping',
      tagline: "From ideas to execution, we'll transform your outdoor space.",
      description: 'Turnkey architectural landscaping for terraces, villa lawns, and rooftop lounges with 3D plans.',
      cta: 'Explore landscaping →',
      action: () => setPage('landscaping'),
      badge: 'Bespoke Design',
      bgClass: 'hover:border-[#C48B5A]',
    },
    {
      id: 'store',
      icon: '🛒',
      title: 'Garden Store',
      tagline: 'Plants, tools, fertilizers, pots and everything in between.',
      description: 'Quick-commerce garden essentials delivered to your door in 35 minutes via electric cargo.',
      cta: 'Shop 24+ items →',
      action: () => setPage('shop'),
      badge: '⚡ 35-Min Express',
      bgClass: 'hover:border-[#2A5C43]',
    },
    {
      id: 'plant-ai',
      icon: '🤖',
      title: 'Plant AI',
      tagline: 'Get instant answers for your plants and gardening questions.',
      description: 'Powered by botanical intelligence: diagnose yellow leaves, watering schedules & pest remedies.',
      cta: 'Chat with AI Doctor →',
      action: () => setPage('plant-ai'),
      badge: 'Free Assistant',
      bgClass: 'hover:border-[#8EA68B]',
    },
    {
      id: 'visualizer',
      icon: '📸',
      title: 'Garden Visualizer',
      tagline: 'Upload your garden and preview a new look before you book.',
      description: 'Preview tropical, minimal, zen, or vertical styles on your actual balcony with before/after render.',
      cta: 'Launch visualizer →',
      action: () => setPage('visualizer'),
      badge: 'Interactive Tool',
      bgClass: 'hover:border-[#2A5C43]',
    },
    {
      id: 'smart-garden',
      icon: '🌦️',
      title: 'Smart Garden',
      tagline: 'Get gardening recommendations based on weather and season.',
      description: 'Microclimate guidance tailored to Indian humidity, rainfall, and sunshine fluctuations.',
      cta: 'View weather tips →',
      action: () => {
        const el = document.getElementById('weather-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      badge: 'Seasonal Intel',
      bgClass: 'hover:border-[#2A5C43]',
    },
  ];

  const CUSTOMER_TYPES = [
    { label: 'Apartments', icon: '🏢', desc: 'Space-saving balcony vertical gardens & low-light indoor air purifiers.' },
    { label: 'Homes & Villas', icon: '🏡', desc: 'Lush lawn maintenance, perimeter hedging, fruit trees & natural stone features.' },
    { label: 'Offices & Tech Parks', icon: '💼', desc: 'Biophilic workspace installations, desk planters & indoor living air filtration walls.' },
    { label: 'Cafes & Bistros', icon: '☕', desc: 'Aesthetic photo-friendly outdoor greenery, hanging creepers & herb stations.' },
    { label: 'Hotels & Resorts', icon: '🏨', desc: 'Immersive tropical landscaping, courtyard water gardens & luxury entrance foliage.' },
    { label: 'Restaurants', icon: '🍽️', desc: 'Living boundary walls, ambient botanical dining dividers & fresh kitchen micro-greens.' },
    { label: 'Housing Societies', icon: '🏘️', desc: 'Enterprise AMC contracts, park turf restoration & seasonal flowerbed rotation.' },
    { label: 'Commercial Spaces', icon: '🏬', desc: 'Retail showroom greenery, atrium focal trees & sustainable irrigation architecture.' },
  ];

  const activeCustomer = CUSTOMER_TYPES.find((c) => c.label === selectedCustomerType) || CUSTOMER_TYPES[0];

  return (
    <section className="py-16 md:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#183926] mb-3">
            <span>🌿 Seamless Plant Ecosystem</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#132A1D]">
            Everything your garden needs
          </h2>
          <p className="text-sm sm:text-base text-[#4E6657] mt-3 leading-relaxed">
            From scheduled care and smart botanical AI to 35-minute doorstep supply delivery — designed for plant lovers and novices alike.
          </p>
        </div>

        {/* 6 Core Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {CORE_SERVICES.map((card) => (
            <div
              key={card.id}
              className={`bg-white rounded-3xl p-7 border border-[#DFD8CA] shadow-sm transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] flex flex-col justify-between ${card.bgClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5] flex items-center justify-center text-2xl shadow-2xs">
                    {card.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF8F5] text-[#2A5C43] border border-[#E2DDD0]">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-[#142E20] mb-2">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#2A5C43] mb-2">
                  "{card.tagline}"
                </p>
                <p className="text-xs sm:text-sm text-[#5C7265] leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-[#F2ECE1]">
                <button
                  onClick={card.action}
                  className="w-full text-left font-semibold text-xs sm:text-sm text-[#1A3828] hover:text-[#2A5C43] flex items-center justify-between group"
                >
                  <span>{card.cta}</span>
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] group-hover:bg-[#1A3828] group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Types Section */}
        <div className="mt-20 pt-14 border-t border-[#E8E1D4]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#2A5C43]">
              Versatile Living Architecture
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20] mt-1">
              Built for every space you inhabit
            </h3>
            <p className="text-xs sm:text-sm text-[#567060] mt-1">
              Select your space type to see how Root & Bloom personalizes care and greenery:
            </p>
          </div>

          {/* Interactive Customer Type Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-6">
            {CUSTOMER_TYPES.map((type) => (
              <button
                key={type.label}
                onClick={() => setSelectedCustomerType(type.label)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  selectedCustomerType === type.label
                    ? 'bg-[#1A3828] text-white shadow-md shadow-[#1A3828]/20 scale-102'
                    : 'bg-white text-[#30483A] border border-[#DFD7C9] hover:bg-[#F0EBE0]'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Active Space Type Showcase Banner */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-5 sm:p-6 border border-[#DFD8CB] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2EC] flex items-center justify-center text-2xl shrink-0">
                {activeCustomer.icon}
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#142E20]">
                  Tailored Greenery for {activeCustomer.label}
                </h4>
                <p className="text-xs text-[#526B5C] mt-0.5 leading-relaxed">
                  {activeCustomer.desc}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#1A3828] hover:bg-[#12281D] text-white text-xs font-semibold shadow-xs"
            >
              Get Custom Plan →
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
