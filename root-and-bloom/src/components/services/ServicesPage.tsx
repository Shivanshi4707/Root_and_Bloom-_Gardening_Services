import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import {
  Wrench,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Compass,
  Star,
  Leaf,
  Users,
  Calendar,
  Layers,
  Info,
  ArrowLeft,
  ChevronRight,
  PhoneCall,
  Check,
} from 'lucide-react';
import { handleImageError } from '../../utils/imageUtils';

const SERVICE_CATEGORIES = [
  'All Services',
  'Garden Maintenance',
  'Lawn Care',
  'Plant Care',
  'Pruning',
  'Plant Installation',
  'Terrace Gardens',
  'Balcony Gardens',
  'Office Gardens',
  'Society Maintenance',
  'Commercial Landscaping',
];

export const ServicesPage: React.FC = () => {
  const { services, setIsBookingModalOpen, setSelectedServiceForBooking, setPage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Services');
  const [activeDetailService, setActiveDetailService] = useState<ServiceItem | null>(null);

  const handleBookService = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
    setIsBookingModalOpen(true);
  };

  const safeServices = services || [];

  // Filtered services
  const displayedServices = selectedCategory === 'All Services'
    ? safeServices
    : safeServices.filter(
        (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <div className="py-8 md:py-14 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Header Section */}
        {activeDetailService ? (
          /* Service Detail View Header */
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#637C6E]">
              <button
                onClick={() => setActiveDetailService(null)}
                className="hover:text-[#1A3828] font-medium flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Services</span>
              </button>
              <ChevronRight className="w-3 h-3 text-[#B0A798]" />
              <span className="text-[#1A3828] font-semibold">{activeDetailService.name}</span>
            </div>
          </div>
        ) : (
          /* All Services Overview Header */
          <div className="space-y-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#2A5C43]" />
                <span>Professional Botanical Services</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#142E20] leading-tight">
                Expert Garden Care & Maintenance
              </h1>
              <p className="text-sm sm:text-base text-[#4E6657] mt-3 leading-relaxed">
                Whether you have a compact sunlit apartment balcony or an expansive commercial estate, our certified horticulturists bring soil science, organic feeds, and meticulous pruning right to your gate.
              </p>
            </div>

            {/* Custom Landscaping Highlight Banner */}
            <div className="bg-gradient-to-r from-[#1A3828] to-[#254F38] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2B523A] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#8FE388]/20 text-[#8FE388]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Architectural Studio</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                  Looking for Bespoke 3D Landscaping?
                </h2>
                <p className="text-xs sm:text-sm text-[#C8DCD0] leading-relaxed">
                  From bare concrete terraces to lush natural stone water-gardens. Request a site survey and get a custom 3D design blueprint and transparent estimate.
                </p>
              </div>
              <button
                onClick={() => setPage('landscaping')}
                className="shrink-0 bg-[#8FE388] hover:bg-[#78CC72] text-[#0E2619] font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Explore Landscaping & Quotes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Horizontal Pills */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#476050] block mb-3">
                Filter by Service Category:
              </span>
              <div className="flex flex-wrap gap-2">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#1A3828] text-white shadow-sm'
                          : 'bg-white border border-[#DFD8CB] text-[#344D3E] hover:border-[#1A3828] hover:bg-[#F2ECE1]/50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: Dedicated Detailed Service Category Page */}
        {activeDetailService ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Detail Card */}
            <div className="bg-white rounded-3xl border border-[#DFD8CB] overflow-hidden shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Image Col */}
                <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[420px] bg-[#F2ECE1]">
                  <img
                    src={activeDetailService.image}
                    alt={activeDetailService.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                  <div className="absolute top-4 left-4 bg-[#1A3828]/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {activeDetailService.category}
                  </div>
                </div>

                {/* Info Col */}
                <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-[#D27D46] font-bold">
                        <Star className="w-4 h-4 fill-[#D27D46]" />
                        <span>{activeDetailService.rating}</span>
                        <span className="text-[#6C8475] font-normal">
                          ({activeDetailService.reviewCount} verified reviews)
                        </span>
                      </div>
                      <span className="text-[#B6C9BD]">•</span>
                      <span className="flex items-center gap-1 text-[#2A5C43] font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {activeDetailService.duration}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#142E20]">
                      {activeDetailService.name}
                    </h2>

                    <p className="text-sm text-[#4E6657] leading-relaxed">
                      {activeDetailService.description}
                    </p>

                    {/* Frequency Card */}
                    {activeDetailService.frequency && (
                      <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#DFD8CB] flex items-center gap-3 text-xs">
                        <Calendar className="w-4 h-4 text-[#2A5C43] shrink-0" />
                        <div>
                          <span className="font-bold text-[#142E20] block">Recommended Frequency:</span>
                          <span className="text-[#566E5F]">{activeDetailService.frequency}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price and CTA Block */}
                  <div className="pt-6 mt-6 border-t border-[#F2ECE1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#698273] block">
                        Starting Price ({activeDetailService.priceUnit || 'Transparent Rate'})
                      </span>
                      <div className="font-serif text-3xl font-bold text-[#142E20]">
                        ₹{activeDetailService.startingPrice}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveDetailService(null)}
                        className="px-4 py-3 rounded-2xl border border-[#DFD8CB] hover:bg-[#F2ECE1] text-xs font-semibold text-[#183926] transition-colors"
                      >
                        Back to List
                      </button>

                      <button
                        onClick={() => handleBookService(activeDetailService)}
                        className="bg-[#1A3828] hover:bg-[#12281D] text-white px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-[#1A3828]/25 flex items-center gap-2 active:scale-95 transition-all"
                      >
                        <span>Book this service</span>
                        <ArrowRight className="w-4 h-4 text-[#8FE388]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What is Included & How Booking Works 2-Col Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {/* What is Included */}
              <div className="bg-white p-7 rounded-3xl border border-[#DFD8CB] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] flex items-center justify-center text-[#2A5C43]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#142E20]">What is Included</h3>
                </div>
                
                <div className="space-y-3">
                  {(activeDetailService.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#2D4838]">
                      <div className="w-4 h-4 rounded-full bg-[#E5EFE7] flex items-center justify-center text-[#2A5C43] shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How Booking Works */}
              <div className="bg-white p-7 rounded-3xl border border-[#DFD8CB] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] flex items-center justify-center text-[#2A5C43]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#142E20]">How Booking Works</h3>
                </div>

                <div className="space-y-4">
                  {(activeDetailService.howItWorks || [
                    'Choose your preferred date, time slot, and garden size.',
                    'Certified horticulturist arrives with sanitized tools & organic nutrients.',
                    'Full maintenance performed followed by a digital health card.',
                  ]).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                      <span className="w-6 h-6 rounded-full bg-[#1A3828] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-[#3A5344] leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleBookService(activeDetailService)}
                    className="w-full py-3 rounded-xl bg-[#FAF8F5] border border-[#1A3828] text-[#1A3828] hover:bg-[#1A3828] hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Book Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: Services Grid Overview */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayedServices.map((service) => {
              const featuresList = service.features || [];
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl border border-[#DFD8CB] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Image Frame */}
                  <div
                    onClick={() => setActiveDetailService(service)}
                    className="relative h-52 overflow-hidden bg-[#F2ECE1] cursor-pointer"
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <span className="absolute top-3 left-3 bg-[#1A3828]/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {service.category}
                    </span>

                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 font-medium text-[#A7F3D0]">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration}
                      </span>
                      <div className="flex items-center gap-1 text-white font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#E79E67] text-[#E79E67]" />
                        <span>{service.rating}</span>
                        <span className="text-white/80 font-normal">({service.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => setActiveDetailService(service)}
                        className="font-serif text-xl font-bold text-[#142E20] group-hover:text-[#2A5C43] transition-colors cursor-pointer"
                      >
                        {service.name}
                      </h3>
                      <p className="text-xs text-[#526B5C] mt-2 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>

                      {/* Included Items / Features Checklist */}
                      {featuresList.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#F2ECE1] space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#637C6E] block">
                            What's Included:
                          </span>
                          {featuresList.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-[#2A4434]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#2A5C43] shrink-0 mt-0.5" />
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                          {featuresList.length > 3 && (
                            <button
                              onClick={() => setActiveDetailService(service)}
                              className="text-[11px] font-semibold text-[#2A5C43] hover:underline block pt-1"
                            >
                              +{featuresList.length - 3} more included features →
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Pricing & CTA */}
                    <div className="pt-6 mt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#698273] block uppercase tracking-wide">
                          {service.priceUnit || 'Transparent Rate'}
                        </span>
                        <span className="font-serif text-2xl font-bold text-[#142E20]">
                          ₹{service.startingPrice}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveDetailService(service)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-[#1A3828] hover:bg-[#F2ECE1] border border-[#DFD8CB] transition-colors"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => handleBookService(service)}
                          className="bg-[#1A3828] hover:bg-[#11291D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <span>Book</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Why Root & Bloom Services */}
        <div className="bg-white rounded-3xl p-8 border border-[#DFD8CB] mt-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase font-bold tracking-widest text-[#2A5C43]">
              The Root & Bloom Promise
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20] mt-1">
              Why 12,000+ plant lovers trust our teams
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D4] text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2EC] flex items-center justify-center mx-auto text-2xl">
                👨‍🌾
              </div>
              <h4 className="font-serif font-bold text-base text-[#142E20]">Certified Horticulturists</h4>
              <p className="text-xs text-[#526B5C] leading-relaxed">
                Trained in soil chemistry, bio-fertilizer dosing, and micro-pest management. No untrained casual labor.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D4] text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2EC] flex items-center justify-center mx-auto text-2xl">
                🍃
              </div>
              <h4 className="font-serif font-bold text-base text-[#142E20]">100% Organic Products</h4>
              <p className="text-xs text-[#526B5C] leading-relaxed">
                Safe for kids and pets. We exclusively use neem extracts, seaweed tonics, and microbe-rich compost.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D4] text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2EC] flex items-center justify-center mx-auto text-2xl">
                🛡️
              </div>
              <h4 className="font-serif font-bold text-base text-[#142E20]">Free Follow-Up Guarantee</h4>
              <p className="text-xs text-[#526B5C] leading-relaxed">
                If your plant doesn't show visible improvement within 14 days of a clinic visit, we re-visit for free.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
