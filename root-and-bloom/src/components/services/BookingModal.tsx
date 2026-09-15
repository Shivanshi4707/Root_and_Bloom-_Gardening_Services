import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ServiceItem } from '../../types';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
    services,
    createBooking,
    setPage,
    currentCustomer,
    openCustomerAuth,
  } = useApp();

  const safeServices = services && services.length > 0 ? services : [];
  const defaultService = selectedServiceForBooking || safeServices[0] || {
    id: 's1',
    name: 'Garden Maintenance Visit',
    startingPrice: 499,
    duration: '90 mins',
  };

  const [serviceId, setServiceId] = useState(defaultService.id);

  useEffect(() => {
    if (selectedServiceForBooking) {
      setServiceId(selectedServiceForBooking.id);
    }
  }, [selectedServiceForBooking]);

  const [gardenSize, setGardenSize] = useState<'Balcony' | 'Terrace' | 'Lawn' | 'Villa / Estate'>('Balcony');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('Morning (08:30 AM - 11:30 AM)');
  const [customerName, setCustomerName] = useState('Ananya Sharma');
  const [customerPhone, setCustomerPhone] = useState('+91 98451 22890');
  const [address, setAddress] = useState('Flat 402, RainTree Orchards, Indiranagar, Bengaluru');
  const [notes, setNotes] = useState('Please bring organic pest spray for bougainvillea.');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  useEffect(() => {
    if (currentCustomer) {
      if (currentCustomer.name) setCustomerName(currentCustomer.name);
      if (currentCustomer.phone) setCustomerPhone(currentCustomer.phone);
      if (currentCustomer.address) setAddress(currentCustomer.address);
    }
  }, [currentCustomer]);

  if (!isBookingModalOpen) return null;

  const currentService = safeServices.find((s) => s.id === serviceId) || defaultService;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = createBooking({
      serviceId: currentService.id,
      serviceName: currentService.name,
      customerName,
      customerPhone,
      customerEmail: currentCustomer?.email || '',
      address,
      propertyType: gardenSize === 'Balcony' ? 'Apartment Balcony' : gardenSize === 'Terrace' ? 'Terrace Garden' : gardenSize === 'Lawn' ? 'Independent Villa' : 'Independent Villa',
      gardenAreaSqFt: gardenSize === 'Balcony' ? 120 : gardenSize === 'Terrace' ? 450 : gardenSize === 'Lawn' ? 1200 : 2500,
      frequency: 'one-time',
      scheduledDate,
      scheduledTime,
      notes,
      estimatedPrice: currentService.startingPrice,
    });
    setBookingRef(newBooking.id);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setSelectedServiceForBooking(null);
    setIsSuccess(false);
  };

  const TIME_SLOTS = [
    'Morning (08:30 AM - 11:30 AM)',
    'Midday (11:30 AM - 02:30 PM)',
    'Afternoon (02:30 PM - 05:30 PM)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full border border-[#DFD8CB] shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-5 bg-white border-b border-[#E3DDD1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1A3828] text-white flex items-center justify-center">
              🌿
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#132B1D]">
                {isSuccess ? 'Booking Scheduled!' : 'Book Garden Specialist'}
              </h3>
              <span className="text-[11px] text-[#607769]">
                Background-verified horticulturists & organic garden tools
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
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E5EFE7] text-[#2A5C43] flex items-center justify-center mx-auto text-3xl font-bold">
                ✓
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#142E20]">
                Visit Confirmed!
              </h4>
              <p className="text-xs sm:text-sm text-[#4A6454] max-w-md mx-auto leading-relaxed">
                We've assigned Senior Horticulturist <strong>Ramesh Kumar</strong> for your {currentService.name}.
              </p>

              <div className="bg-white p-4 rounded-2xl border border-[#DFD8CB] text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#647C6E]">Booking Reference:</span>
                  <strong className="text-[#132A1D]">{bookingRef}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#647C6E]">Service:</span>
                  <strong className="text-[#132A1D]">{currentService.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#647C6E]">Scheduled Time:</span>
                  <strong className="text-[#2A5C43]">{scheduledDate} ({scheduledTime})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#647C6E]">Fee:</span>
                  <strong className="text-[#132A1D] font-serif text-sm">₹{currentService.startingPrice} (Pay post service)</strong>
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
                  View in My Garden Bookings
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-3 rounded-xl border border-[#DFD8CB] text-xs font-semibold text-[#183926]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Service Dropdown */}
              <div>
                <label className="block text-xs font-bold text-[#2A4434] uppercase tracking-wider mb-1">
                  Selected Service Package
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs font-semibold text-[#183926] focus:ring-2 focus:ring-[#2A5C43]"
                >
                  {safeServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} • ₹{s.startingPrice} ({s.duration})
                    </option>
                  ))}
                </select>
              </div>

              {/* Garden Space Size */}
              <div>
                <label className="block text-xs font-bold text-[#2A4434] uppercase tracking-wider mb-1">
                  Garden Space Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Balcony', 'Terrace', 'Lawn', 'Villa / Estate'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setGardenSize(size)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        gardenSize === size
                          ? 'bg-[#1A3828] text-white border-[#1A3828] font-bold shadow-2xs'
                          : 'bg-white text-[#294233] border-[#DFD8CB] hover:bg-[#F2ECE1]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#293E31] mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs font-medium text-[#183926] focus:ring-2 focus:ring-[#2A5C43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293E31] mb-1">
                    Time Slot
                  </label>
                  <select
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs font-medium text-[#183926] focus:ring-2 focus:ring-[#2A5C43]"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Recognition Banner */}
              {currentCustomer ? (
                <div className="bg-[#FAF8F5] border border-[#DFD8CA] rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1A3828] text-[#8FE388] flex items-center justify-center font-bold text-xs">
                      {currentCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-[#183926] block">
                        Booking as {currentCustomer.name}
                      </span>
                      <span className="text-[10px] text-[#637C6E]">
                        {currentCustomer.email} • Address pre-populated
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCustomerAuth('profile')}
                    className="text-[11px] text-[#2A5C43] hover:underline font-semibold"
                  >
                    Edit Account
                  </button>
                </div>
              ) : (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Have a Root & Bloom account? Sign in to track past visits & autofill details.</span>
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

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#293E31] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#183926] focus:ring-2 focus:ring-[#2A5C43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293E31] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#183926] focus:ring-2 focus:ring-[#2A5C43]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-[#293E31] mb-1">
                  Service Address (Home or Office)
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#183926] focus:ring-2 focus:ring-[#2A5C43]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#293E31] mb-1">
                  Special Notes or Plant Concerns
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Mealybugs on hibiscus, need soil loosening for roses..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#183926] focus:ring-2 focus:ring-[#2A5C43]"
                />
              </div>

              {/* Guarantees note */}
              <div className="p-3 bg-[#EBF3ED] rounded-xl border border-[#CFE3D5] text-[11px] text-[#2A5C43] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero advance deposit. Pay digitally or by cash only after work is done.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1A3828] hover:bg-[#11291D] text-white py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-[#1A3828]/25 transition-all active:scale-98"
                >
                  Confirm Booking (₹{currentService.startingPrice})
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
