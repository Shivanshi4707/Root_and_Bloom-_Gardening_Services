import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../shop/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BestsellersSection: React.FC = () => {
  const { products, setPage } = useApp();

  // Show top 4 bestsellers
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <section className="py-16 md:py-20 bg-[#F4F0E8]/50 border-t border-b border-[#EAE3D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2A5C43]" />
              <span>⚡ 35-Minute Fast Dispatch</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#142E20]">
              Botanical Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-[#50695B] mt-1">
              Hand-potted in nutrient-rich bio-soil, accompanied by care tags and 7-day plant health guarantee.
            </p>
          </div>

          <button
            onClick={() => setPage('shop')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1A3828] hover:text-[#2A5C43] transition-colors group self-start sm:self-auto"
          >
            <span>View All Store Essentials ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
