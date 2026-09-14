import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Sun,
  Droplets,
  Gauge,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  Leaf,
} from 'lucide-react';
import { handleImageError } from '../../utils/imageUtils';

export const ProductDetailModal: React.FC = () => {
  const { activeProductModal, setActiveProductModal, cart, addToCart, updateQuantity } = useApp();

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const cartItem = cart.find((item) => item.product.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full border border-[#DFD8CB] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-[#1A3828] p-2 rounded-full shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-[#F2ECE1] aspect-square border border-[#DFD8CB]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>

            {/* Core Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E5EFE7] text-[#1A3828]">
                  {product.category}
                </span>
                {product.isBestseller && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FCE8DB] text-[#D27D46]">
                    ⭐ Bestseller
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#142E20] leading-tight">
                {product.name}
              </h2>
              {product.botanicalName && (
                <p className="text-xs italic text-[#546C5F]">
                  Botanical: {product.botanicalName}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs font-semibold text-[#1A3828]">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#E79E67] text-[#E79E67]" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-[#7E9387]">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#142E20]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#7D9184] line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="text-xs font-bold text-[#2A5C43]">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#2A5C43] font-medium pt-1">
                <Truck className="w-4 h-4" />
                <span>Express 35-min delivery available</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-[#EAE4D7] pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A5C43] mb-2">
              Botanical Overview
            </h4>
            <p className="text-sm text-[#475E51] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Care Requirements Breakdown (if plant) */}
          {product.careDetails && (
            <div className="border-t border-[#EAE4D7] pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A5C43] mb-3">
                Care Requirements & Guidelines
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-[#DFD8CA]">
                  <div className="flex items-center gap-1.5 text-xs text-[#526B5C] font-semibold">
                    <Sun className="w-4 h-4 text-[#D27D46]" />
                    <span>Sunlight</span>
                  </div>
                  <p className="text-xs font-bold text-[#142E20] mt-1">
                    {product.careDetails.sunlight}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#DFD8CA]">
                  <div className="flex items-center gap-1.5 text-xs text-[#526B5C] font-semibold">
                    <Droplets className="w-4 h-4 text-[#4A90E2]" />
                    <span>Watering</span>
                  </div>
                  <p className="text-xs font-bold text-[#142E20] mt-1">
                    {product.careDetails.watering}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#DFD8CA]">
                  <div className="flex items-center gap-1.5 text-xs text-[#526B5C] font-semibold">
                    <Gauge className="w-4 h-4 text-[#2A5C43]" />
                    <span>Difficulty</span>
                  </div>
                  <p className="text-xs font-bold text-[#142E20] mt-1">
                    {product.careDetails.difficulty}
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#DFD8CA]">
                  <div className="flex items-center gap-1.5 text-xs text-[#526B5C] font-semibold">
                    <AlertTriangle className="w-4 h-4 text-[#E79E67]" />
                    <span>Pet Safety</span>
                  </div>
                  <p className="text-xs font-bold text-[#142E20] mt-1">
                    {product.careDetails.petFriendly ? 'Pet Friendly' : 'Keep Away'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="bg-[#EBF3ED] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#2A5C43] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 7-Day Health Replacement Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> Delivered in Organic Bio-Potting Soil
            </span>
          </div>

        </div>

        {/* Modal Footer Action */}
        <div className="bg-white p-4 sm:p-5 border-t border-[#DFD8CA] flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#627A6C]">Subtotal</span>
            <div className="font-serif text-xl font-bold text-[#142E20]">
              ₹{product.price * (qtyInCart || 1)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {qtyInCart > 0 ? (
              <div className="flex items-center bg-[#1A3828] text-white rounded-xl overflow-hidden">
                <button
                  onClick={() => updateQuantity(product.id, -1)}
                  className="px-3.5 py-2.5 hover:bg-[#12281D] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm min-w-[30px] text-center">
                  {qtyInCart} in Cart
                </span>
                <button
                  onClick={() => updateQuantity(product.id, 1)}
                  className="px-3.5 py-2.5 hover:bg-[#12281D] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="bg-[#1A3828] hover:bg-[#12291D] text-white px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md shadow-[#1A3828]/25 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
