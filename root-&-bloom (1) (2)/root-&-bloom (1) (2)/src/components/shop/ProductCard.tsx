import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, Plus, Minus, Check, Sun, Droplets, Heart } from 'lucide-react';
import { handleImageError } from '../../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity, setActiveProductModal } = useApp();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-3xl border border-[#E0D9CC] shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Image Container */}
      <div
        onClick={() => setActiveProductModal(product)}
        className="relative bg-[#F4F0E8] h-48 sm:h-52 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Discount Badge */}
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-[#1A3828] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Stock / Seasonal indicator */}
        {product.isSeasonal && (
          <span className="absolute top-3 right-3 bg-[#D27D46] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            🔥 Seasonal Pick
          </span>
        )}

        {/* Quick View Tag on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur-xs text-[#1A3828] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md">
            Quick Care Guide
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Botanical subtitle or subcategory */}
          <div className="flex items-center justify-between text-[11px] text-[#698072] mb-1">
            <span className="truncate max-w-[140px] font-medium">
              {product.botanicalName || product.subCategory || 'Garden Essential'}
            </span>
            <div className="flex items-center gap-1 text-[#1A3828] font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#E79E67] text-[#E79E67]" />
              <span>{product.rating}</span>
              <span className="text-[#889B8F] font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setActiveProductModal(product)}
            className="font-serif text-base sm:text-lg font-bold text-[#142E20] group-hover:text-[#2A5C43] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#5D7366] mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Care details pill (if plant) */}
          {product.careDetails && (
            <div className="flex items-center gap-2 mt-2 text-[10px] font-medium text-[#486052]">
              <span className="inline-flex items-center gap-1 bg-[#F2ECE1] px-2 py-0.5 rounded-md">
                <Sun className="w-3 h-3 text-[#D27D46]" />
                {product.careDetails.sunlight}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F2ECE1] px-2 py-0.5 rounded-md">
                <Droplets className="w-3 h-3 text-[#4A90E2]" />
                {product.careDetails.watering}
              </span>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Section */}
        <div className="pt-4 mt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg sm:text-xl font-bold text-[#122A1C]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#8BA093] line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#71897B] block">Inclusive of all taxes</span>
          </div>

          {/* Quick-Commerce Button / Quantity Selector */}
          <div>
            {qtyInCart === 0 ? (
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className="bg-[#1A3828] hover:bg-[#12291D] disabled:bg-[#D5CDBC] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center bg-[#1A3828] text-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="px-2.5 py-1.5 hover:bg-[#10241A] transition-colors text-xs font-bold"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold min-w-[20px] text-center">
                  {qtyInCart}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="px-2.5 py-1.5 hover:bg-[#10241A] transition-colors text-xs font-bold"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
