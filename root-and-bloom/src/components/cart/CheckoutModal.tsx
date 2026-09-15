import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sparkles,
  User,
} from 'lucide-react';
import { Order } from '../../types';
import { UPIPaymentModal } from './UPIPaymentModal';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    placeOrder,
    setPage,
    currentCustomer,
    openCustomerAuth,
  } = useApp();

  const [customerName, setCustomerName] = useState('Ananya Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98451 22890');
  const [address, setAddress] = useState('Flat 402, RainTree Orchards, 12th Main, Indiranagar, Bengaluru - 560038');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('UPI');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [showUpiModal, setShowUpiModal] = useState(false);

  useEffect(() => {
    if (currentCustomer) {
      if (currentCustomer.name) setCustomerName(currentCustomer.name);
      if (currentCustomer.phone) setCustomerPhone(currentCustomer.phone);
      if (currentCustomer.address) setAddress(currentCustomer.address);
    }
  }, [currentCustomer]);

  if (!isCheckoutModalOpen) return null;

  const deliveryFee = cartSubtotal >= 499 ? 0 : 49;
  const discount = cartSubtotal > 1000 ? Math.round(cartSubtotal * 0.1) : 0;
  const total = cartSubtotal + deliveryFee - discount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) return;

    if (paymentMethod === 'UPI') {
      setShowUpiModal(true);
      return;
    }

    const order = placeOrder({
      customerName,
      customerPhone,
      address,
      paymentMethod,
    });
    setPlacedOrder(order);
  };

  const handleUpiSuccess = (details: { txnId: string; upiId: string; appName: string }) => {
    setShowUpiModal(false);
    const order = placeOrder({
      customerName,
      customerPhone,
      address,
      paymentMethod: 'UPI',
    });
    setPlacedOrder(order);
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setPlacedOrder(null);
    setShowUpiModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#DFD8CB] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#E3DDD1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#132B1D]">
                {placedOrder ? 'Order Confirmed!' : 'Express Checkout'}
              </h3>
              <span className="text-[11px] text-[#607769]">
                {placedOrder ? 'Dispatched via Zero-Emission Cargo' : '35-minute delivery to your doorstep'}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-[#637C6E] hover:text-[#132B1D] rounded-xl hover:bg-[#F2ECE1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {placedOrder ? (
            /* Order Success View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E5EFE7] text-[#2A5C43] flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#142E20]">
                Thank you, {placedOrder.customerName}!
              </h4>
              <p className="text-xs sm:text-sm text-[#4A6454] max-w-sm mx-auto leading-relaxed">
                Your garden supplies have been packed with botanical care. Our delivery partner is heading to your address.
              </p>

              <div className="bg-white p-4 rounded-2xl border border-[#DFD8CB] text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#647C6E]">Order ID:</span>
                  <strong className="text-[#132A1D]">{placedOrder.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#647C6E]">Tracking Number:</span>
                  <strong className="text-[#2A5C43]">{placedOrder.trackingNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#647C6E]">Estimated Delivery:</span>
                  <strong className="text-[#132A1D]">{placedOrder.estimatedDeliveryTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#647C6E]">Total Paid:</span>
                  <strong className="text-[#132A1D] font-serif text-sm">₹{placedOrder.total} ({placedOrder.paymentMethod})</strong>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    handleClose();
                    setPage('my-garden');
                  }}
                  className="flex-1 bg-[#1A3828] text-white py-3 rounded-xl text-xs font-bold shadow-sm"
                >
                  Track in My Garden Dashboard
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-3 rounded-xl border border-[#DFD8CB] text-xs font-semibold text-[#183926]"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order Summary Strip */}
              <div className="bg-[#EBF3ED] p-3 rounded-xl border border-[#D7E6DB] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#2A5C43] font-bold block">
                    {cart.length} distinct item(s) in bag
                  </span>
                  <span className="text-[11px] text-[#4F6959]">
                    Eco-packaged in biodegradable Kraft containers
                  </span>
                </div>
                <span className="font-serif font-bold text-base text-[#142E20]">
                  ₹{total}
                </span>
              </div>

              {/* Customer Account Recognition / Quick Login Banner */}
              {currentCustomer ? (
                <div className="bg-[#FAF8F5] border border-[#DFD8CA] rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1A3828] text-[#8FE388] flex items-center justify-center font-bold text-xs">
                      {currentCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-[#183926] block">
                        Logged in as {currentCustomer.name}
                      </span>
                      <span className="text-[10px] text-[#637C6E]">
                        {currentCustomer.email} • Delivery details auto-filled
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCustomerAuth('profile')}
                    className="text-[11px] text-[#2A5C43] hover:underline font-semibold"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Have a Root & Bloom account? Sign in for instant autofill & rewards.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCustomerAuth('signin')}
                    className="shrink-0 ml-2 px-2.5 py-1 bg-amber-900 text-white rounded-lg text-[11px] font-semibold hover:bg-amber-950 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Delivery Address Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
                  Delivery Address & Recipient
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-[#293E31] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#2A5C43]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#293E31] mb-1">Phone (for Delivery OTP)</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#2A5C43]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#293E31] mb-1">Delivery Window</label>
                    <div className="px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold text-[#183926] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2A5C43]" />
                      <span>35 Mins (Express)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293E31] mb-1">Street Address, Apt / Floor</label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#2A5C43]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-[#EAE3D6]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
                  Select Payment Option
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI (GPay/PhonePe)', icon: '⚡' },
                    { id: 'Card', label: 'Card / NetBanking', icon: '💳' },
                    { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        paymentMethod === m.id
                          ? 'bg-[#1A3828] text-white border-[#1A3828] font-bold shadow-xs'
                          : 'bg-white text-[#2B4535] border-[#DFD8CB] hover:bg-[#F2ECE1] font-medium'
                      }`}
                    >
                      <span className="block text-base mb-0.5">{m.icon}</span>
                      <span className="text-[11px] block leading-tight">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#1A3828] hover:bg-[#11291D] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#1A3828]/25 transition-all active:scale-98"
                >
                  <span>
                    {paymentMethod === 'UPI' ? 'Continue to UPI Payment' : 'Place Order'} • ₹{total}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-[#698273]">
                  <ShieldCheck className="w-3 h-3 text-[#2A5C43]" />
                  <span>256-bit Encrypted Checkout • 7-Day Plant Guarantee</span>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>

      {/* Realistic Interactive UPI Payment Modal */}
      {showUpiModal && (
        <UPIPaymentModal
          amount={total}
          customerName={customerName}
          onSuccess={handleUpiSuccess}
          onCancel={() => setShowUpiModal(false)}
        />
      )}
    </div>
  );
};
