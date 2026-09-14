import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory, Product } from '../../types';
import { ProductCard } from './ProductCard';
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  MapPin,
  ChevronDown,
  X,
  SlidersHorizontal,
  Tag,
} from 'lucide-react';

interface CategoryTab {
  id: ProductCategory;
  label: string;
  icon: string;
}

const CATEGORIES: CategoryTab[] = [
  { id: 'all', label: 'All Items', icon: '🌿' },
  { id: 'indoor', label: 'Indoor Plants', icon: '🪴' },
  { id: 'outdoor', label: 'Outdoor Plants', icon: '🌳' },
  { id: 'pots', label: 'Pots & Planters', icon: '🏺' },
  { id: 'tools', label: 'Gardening Tools', icon: '🧰' },
  { id: 'fertilizers', label: 'Fertilizers', icon: '🌾' },
  { id: 'soil', label: 'Soil & Compost', icon: '🌱' },
  { id: 'seeds', label: 'Seeds', icon: '🌰' },
  { id: 'decor', label: 'Garden Décor', icon: '🌸' },
  { id: 'seasonal', label: 'Seasonal Picks', icon: '🔥' },
];

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    location,
  } = useApp();

  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating'>('popularity');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-250' | '250-500' | 'above-500'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'seasonal') {
          if (!p.isSeasonal) return false;
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchBotanical = p.botanicalName?.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchBotanical && !matchCategory) {
          return false;
        }
      }

      // In stock filter
      if (inStockOnly && !p.inStock) {
        return false;
      }

      // Price filter
      if (priceFilter === 'under-250' && p.price >= 250) return false;
      if (priceFilter === '250-500' && (p.price < 250 || p.price > 500)) return false;
      if (priceFilter === 'above-500' && p.price <= 500) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popularity / bestsellers
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, priceFilter, sortBy]);

  return (
    <div className="py-8 md:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title & Quick Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#2A5C43]" />
                <span>35-Min Quick-Commerce Garden Hub</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#142E20]">
                Botanical Store & Nursery
              </h1>
              <p className="text-xs sm:text-sm text-[#546E5E] mt-1">
                Healthy plants, organic fertilizers, precision brass tools, and designer planters delivered in eco-packaging.
              </p>
            </div>

            {/* Quick Delivery Tag */}
            <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#DFD8CB] shadow-2xs flex items-center gap-3 shrink-0">
              <span className="text-xl">⚡</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2A5C43] tracking-wide block">
                  Lightning Delivery
                </span>
                <span className="text-xs font-semibold text-[#183926]">
                  Indiranagar, Bengaluru (35 mins)
                </span>
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#688273]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plants, pots, fertilizers, neem oil, pruning shears..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-[#D8D0BF] bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2A5C43] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#799082] hover:text-[#183926] p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Commerce Horizontal Category Strip */}
        <div className="relative">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#1A3828] text-white shadow-md shadow-[#1A3828]/20 scale-102'
                      : 'bg-white text-[#294333] border border-[#DDD6C8] hover:bg-[#F2ECE1]'
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters & Sorting Strip */}
        <div className="bg-white p-4 rounded-2xl border border-[#DFD8CB] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Filter Pill */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#647C6E] font-semibold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Price:
              </span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="bg-[#FAF8F5] border border-[#D5CDBE] rounded-xl px-2.5 py-1.5 font-medium text-[#20392A] focus:outline-hidden focus:border-[#2A5C43]"
              >
                <option value="all">All Prices</option>
                <option value="under-250">Under ₹250</option>
                <option value="250-500">₹250 - ₹500</option>
                <option value="above-500">Above ₹500</option>
              </select>
            </div>

            {/* In-Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded-md accent-[#2A5C43]"
              />
              <span className="font-semibold text-[#294132]">In Stock Only</span>
            </label>
          </div>

          {/* Right: Sort By & Results Count */}
          <div className="flex items-center gap-3">
            <span className="text-[#647C6E] font-medium hidden sm:inline">
              Showing <strong className="text-[#1A3828] font-bold">{filteredProducts.length}</strong> items
            </span>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#647C6E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF8F5] border border-[#D5CDBE] rounded-xl px-2.5 py-1.5 font-medium text-[#20392A] focus:outline-hidden focus:border-[#2A5C43]"
              >
                <option value="popularity">Bestsellers First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#DFD8CB] max-w-md mx-auto my-12 space-y-3">
            <div className="text-4xl">🪴</div>
            <h3 className="font-serif text-xl font-bold text-[#142E20]">No plants found</h3>
            <p className="text-xs text-[#5D7567] leading-relaxed">
              We couldn't find items matching "{searchQuery}". Try clearing filters or searching for popular items like "Monstera" or "Compost".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceFilter('all');
                setInStockOnly(false);
              }}
              className="mt-2 px-4 py-2 bg-[#1A3828] text-white rounded-xl text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
