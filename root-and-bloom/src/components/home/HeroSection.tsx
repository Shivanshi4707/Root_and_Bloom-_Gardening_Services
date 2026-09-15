import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShoppingBag, ShieldCheck, Sparkles, Star, Clock, Leaf } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setPage, setIsBookingModalOpen } = useApp();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
      {/* Subtle organic ambient glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-[#E8F0E9]/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EFE7] border border-[#CADBCF] text-xs font-semibold text-[#183926] shadow-xs">
              <span className="text-sm">🌿</span>
              <span>Gardening, reinvented</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#132A1D] leading-[1.08]">
              Your garden, <br />
              <span className="italic font-normal text-[#2A5C43] tracking-normal">
                delivered.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#475C50] max-w-xl leading-relaxed font-normal">
              Book expert gardeners, get bespoke landscape designs and order plants, tools & fertilizers — all in one place.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-[#1A3828] hover:bg-[#11291D] text-white px-7 py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#1A3828]/25 transition-all hover:translate-y-[-1px] active:scale-98"
              >
                <span>Book a service</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPage('shop')}
                className="bg-transparent hover:bg-[#EAE4D6]/70 text-[#1A3828] px-6 py-4 rounded-2xl font-semibold text-base border-2 border-[#1A3828] flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 text-[#2A5C43]" />
                <span>Shop garden essentials</span>
              </button>
            </div>

            {/* Micro proof tags */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#52695C]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#2A5C43]" />
                <span>35-min quick dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#2A5C43]" />
                <span>100% organic feeds & soil</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2A5C43]" />
                <span>Verified horticulturists</span>
              </div>
            </div>
          </div>

          {/* Right Botanical Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Rounded Botanical Frame */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#1A3828]/15 border-4 border-white bg-[#E9E4DA]">
                <img
                  src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1000&q=85"
                  alt="Lush biophilic urban indoor garden with Monstera and ceramic planters"
                  className="w-full h-[460px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-[#A7F3D0] block mb-1">
                    Bespoke Balcony Transformation
                  </span>
                  <p className="font-serif text-lg font-bold leading-tight">
                    "From bare concrete to lush private paradise."
                  </p>
                </div>
              </div>

              {/* Floating Pill 1: Customer Rating */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-[#DFD8CA] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EAF5EC] flex items-center justify-center text-[#2A5C43]">
                  <Star className="w-5 h-5 fill-[#E79E67] text-[#E79E67]" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-[#142E20]">4.95 / 5</span>
                    <span className="text-[10px] text-[#5C7265]">(12k+ reviews)</span>
                  </div>
                  <span className="text-[11px] text-[#5C7265]">India's top-rated garden care</span>
                </div>
              </div>

              {/* Floating Pill 2: Express Delivery */}
              <div className="absolute -bottom-4 -right-3 sm:-right-5 bg-[#1A3828] text-white px-4 py-3 rounded-2xl shadow-xl shadow-[#1A3828]/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#2A5C43] flex items-center justify-center text-base">
                  ⚡
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#A7F3D0] tracking-wide block">
                    Express Fulfillment
                  </span>
                  <span className="text-xs font-bold text-white">Delivered in 35 mins</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
