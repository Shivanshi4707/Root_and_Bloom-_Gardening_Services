import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { handleImageError } from '../../utils/imageUtils';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartCount,
    setIsCheckoutModalOpen,
    products,
    addToCart,
  } = useApp();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 499;
  const isFreeDelivery = cartSubtotal >= freeDeliveryThreshold;
  const amountNeeded = freeDeliveryThreshold - cartSubtotal;
  const deliveryFee = isFreeDelivery || cartSubtotal === 0 ? 0 : 49;
  const discount = cartSubtotal > 1000 ? Math.round(cartSubtotal * 0.1) : 0;
  const grandTotal = cartSubtotal + deliveryFee - discount;

  // Recommended quick add item (e.g. Organic Vermicompost)
  const quickAddItem = products.find((p) => p.id === 'prod-12' || p.id === 'prod-13');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between border-l border-[#DFD8CB] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#E3DDD1] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1A3828] text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#8FE388]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#132B1D]">Your Botanical Bag</h3>
                <span className="text-[11px] text-[#607769] font-medium">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} ready for express dispatch
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#637C6E] hover:text-[#132B1D] rounded-xl hover:bg-[#F2ECE1] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Goal Bar */}
          <div className="bg-[#EAF2EC] px-5 py-2.5 border-b border-[#D7E6DB] text-xs">
            {isFreeDelivery ? (
              <div className="flex items-center gap-1.5 text-[#18462B] font-semibold">
                <span>🎉</span>
                <span>You unlocked <strong>FREE 35-Min Delivery!</strong></span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-[#18462B]">
                  <span>Add ₹{amountNeeded} more for FREE delivery</span>
                  <span>₹{cartSubtotal}/₹{freeDeliveryThreshold}</span>
                </div>
                <div className="w-full h-1.5 bg-[#D0E2D5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2A5C43] transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="text-4xl">🪴</div>
                <h4 className="font-serif text-lg font-bold text-[#142E20]">Your bag is empty</h4>
                <p className="text-xs text-[#5C7466] max-w-xs mx-auto">
                  Bring home air-purifying indoor plants, ceramic pots, or organic compost in 35 minutes!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 bg-[#1A3828] text-white text-xs font-semibold rounded-xl"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#DFD8CB] flex items-center gap-3 shadow-2xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F5F1E9] shrink-0"
                    onError={handleImageError}
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs text-[#132A1D] truncate">
                      {item.product.name}
                    </h5>
                    <span className="text-[11px] text-[#698072] block">
                      ₹{item.product.price} each
                    </span>
                    <div className="font-serif font-bold text-sm text-[#132A1D] mt-0.5">
                      ₹{item.product.price * item.quantity}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center bg-[#FAF8F5] border border-[#DCD5C5] rounded-xl overflow-hidden shrink-0">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1.5 hover:bg-[#EBE5D8] text-[#132A1D]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold text-[#132A1D]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1.5 hover:bg-[#EBE5D8] text-[#132A1D]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 text-[#91A598] hover:text-[#C84A32] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            {/* Recommended Quick Add Strip */}
            {cart.length > 0 && quickAddItem && !cart.some((c) => c.product.id === quickAddItem.id) && (
              <div className="bg-[#FAF4E8] rounded-2xl p-3 border border-[#E8DFC9] flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">🌿</span>
                  <div className="truncate">
                    <span className="text-[10px] uppercase font-bold text-[#D27D46] block">
                      Pair with soil feed
                    </span>
                    <p className="text-xs font-bold text-[#142E20] truncate">
                      {quickAddItem.name} (₹{quickAddItem.price})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(quickAddItem, 1)}
                  className="px-3 py-1.5 bg-[#1A3828] text-white text-xs font-bold rounded-lg shrink-0 shadow-2xs hover:bg-[#12281D]"
                >
                  + Add
                </button>
              </div>
            )}
          </div>

          {/* Footer Billing Breakdown */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#DFD8CB] space-y-3">
              <div className="space-y-1.5 text-xs text-[#506758]">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-[#183926]">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Delivery Fee
                  </span>
                  <span className={deliveryFee === 0 ? 'text-[#2A5C43] font-bold' : 'text-[#183926]'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2A5C43] font-semibold">
                    <span>Garden Club Offer (10%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#EAE4D6] text-sm font-bold text-[#132A1D]">
                  <span>To Pay</span>
                  <span className="font-serif text-lg text-[#132A1D]">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutModalOpen(true);
                }}
                className="w-full bg-[#1A3828] hover:bg-[#11281D] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1A3828]/20 active:scale-98 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
