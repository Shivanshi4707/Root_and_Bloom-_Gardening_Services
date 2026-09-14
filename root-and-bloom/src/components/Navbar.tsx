import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageView } from '../types';
import {
  ShoppingBag,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Sparkles,
  Bot,
  Wrench,
  Flower2,
  Calendar,
  LayoutDashboard,
  ShieldCheck,
  User,
} from 'lucide-react';
import { CustomerAuthModal } from './auth/CustomerAuthModal';
import { ManagerAuthModal } from './admin/ManagerAuthModal';

export const Navbar: React.FC = () => {
  const {
    page,
    setPage,
    userRole,
    setUserRole,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    location,
    setLocation,
    reminders,
    orders,
    currentCustomer,
    openCustomerAuth,
    customerLogout,
    isCustomerAuthModalOpen,
    setIsCustomerAuthModalOpen,
    currentManager,
    isManagerAuthModalOpen,
    setIsManagerAuthModalOpen,
    requestManagerAccess,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);

  const pendingReminders = reminders.filter((r) => !r.isCompleted).length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'Delivered').length;

  const navLinks: { id: PageView; label: string; icon?: any }[] = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'shop', label: 'Shop' },
    { id: 'visualizer', label: 'Visualizer' },
    { id: 'plant-ai', label: 'Plant AI' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (view: PageView) => {
    setPage(view);
    setMobileMenuOpen(false);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempLocation.trim()) {
      setLocation(tempLocation);
      setLocationModalOpen(false);
    }
  };

  const CITIES = [
    'Indiranagar, Bengaluru - 560038',
    'Koramangala, Bengaluru - 560034',
    'Bandra West, Mumbai - 400050',
    'Juhu, Mumbai - 400049',
    'Greater Kailash, New Delhi - 110048',
    'Jubilee Hills, Hyderabad - 500033',
    'Koregaon Park, Pune - 411001',
  ];

  return (
    <>
      {/* Top micro-bar: Location & Mode Switcher */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
        <div className="bg-[#1A3828] text-[#E5EFE7] px-4 py-1.5 text-xs font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2C523C] text-[#A7F3D0]">
                ⚡ 35-Min Delivery
              </span>
              <button
                onClick={() => setLocationModalOpen(true)}
                className="hover:underline flex items-center gap-1 text-[#E5EFE7] truncate transition-colors text-left"
              >
                <MapPin className="w-3 h-3 text-[#8FE388] shrink-0" />
                <span className="truncate">Delivering to: <strong className="font-semibold text-white">{location}</strong></span>
                <ChevronDown className="w-3 h-3 shrink-0 opacity-80" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Customer Account Trigger */}
              {currentCustomer ? (
                <button
                  id="nav-customer-account-btn"
                  onClick={() => openCustomerAuth('profile')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183926] hover:bg-[#255038] text-white text-[11px] font-medium border border-[#2B4E3A] transition-all cursor-pointer"
                  title="Customer Account & Preferences"
                >
                  <User className="w-3 h-3 text-[#8FE388]" />
                  <span className="font-semibold">{currentCustomer.name}</span>
                  <span className="hidden sm:inline text-[9px] bg-[#A7F3D0]/20 text-[#A7F3D0] px-1.5 py-0.2 rounded-full">
                    Member
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    id="nav-customer-signin-btn"
                    onClick={() => openCustomerAuth('signin')}
                    className="px-2.5 py-1 text-[11px] font-medium text-white/90 hover:text-white hover:underline transition-colors"
                  >
                    Customer Sign In
                  </button>
                  <span className="text-white/30 text-[10px]">•</span>
                  <button
                    id="nav-customer-signup-btn"
                    onClick={() => openCustomerAuth('signup')}
                    className="px-2.5 py-1 text-[11px] font-bold bg-[#A7F3D0] text-[#1A3828] hover:bg-[#8FE388] rounded-full transition-colors shadow-2xs"
                  >
                    Register
                  </button>
                </div>
              )}

              <span className="text-white/20 hidden sm:inline">|</span>

              {/* Staff Operations Access */}
              <button
                id="nav-staff-login-btn"
                onClick={requestManagerAccess}
                className="hidden sm:flex items-center gap-1 text-[11px] text-[#A7F3D0]/80 hover:text-[#A7F3D0] transition-colors"
                title="Staff Operations & Dark-Store Hub Terminal"
              >
                <ShieldCheck className="w-3 h-3 text-[#D27D46]" />
                <span>{currentManager ? `Ops (${currentManager.name.split(' ')[0]})` : 'Staff Hub'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#1A3828] text-white flex items-center justify-center shadow-md shadow-[#1A3828]/15 group-hover:scale-105 transition-transform">
                <span className="text-xl">🌱</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#163323] leading-none">
                    ROOT & BLOOM
                  </span>
                </div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#5A7363] mt-0.5">
                  Garden Co. • Est. 2026
                </span>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = page === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-[#1A3828] font-semibold bg-[#EAE5D9]/70'
                        : 'text-[#44574D] hover:text-[#1A3828] hover:bg-[#F2ECE1]/60'
                    }`}
                  >
                    {link.label}
                    {link.id === 'visualizer' && (
                      <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#D1E6D3] text-[#1A3828]">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {/* My Garden / Dashboard Button */}
              <button
                onClick={() => handleNavClick('my-garden')}
                className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  page === 'my-garden'
                    ? 'bg-[#1A3828] text-white border-[#1A3828] shadow-sm'
                    : 'bg-white/80 text-[#2B4737] border-[#DFD8CA] hover:border-[#B5C7B8] hover:bg-white'
                }`}
                title="My Garden & Plant Reminders"
              >
                <Flower2 className="w-3.5 h-3.5 text-[#2A5C43]" />
                <span>My Garden</span>
                {(pendingReminders > 0 || activeOrdersCount > 0) && (
                  <span className="w-2 h-2 rounded-full bg-[#D27D46] animate-pulse" />
                )}
              </button>

              {/* Cart Button (Quick-Commerce Style) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-[#1A3828] hover:bg-[#12291D] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 shadow-md shadow-[#1A3828]/20 transition-all hover:shadow-lg active:scale-98"
                aria-label="View shopping cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-[#A7F3D0]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#D27D46] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-[#A7F3D0] uppercase font-medium">Cart</span>
                  <span className="text-xs font-bold text-white">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <span className="sm:hidden text-xs font-bold">
                  {cartCount > 0 ? `₹${cartSubtotal}` : 'Cart'}
                </span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-[#2A4434] hover:bg-[#EAE5D9] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF8F5] border-b border-[#E3DCCF] px-4 pt-2 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-colors ${
                    page === link.id
                      ? 'bg-[#1A3828] text-white font-semibold'
                      : 'text-[#2D4435] hover:bg-[#EAE4D6]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.id === 'visualizer' && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#8FE388] text-[#0F261B]">
                      AI Studio
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-3 border-t border-[#E8E1D4] mt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick('my-garden')}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-[#DFD8CA] text-[#1A3828] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Flower2 className="w-4 h-4 text-[#2A5C43]" />
                    My Garden & Reminders
                  </span>
                  {pendingReminders > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#D27D46] text-white">
                      {pendingReminders} Due
                    </span>
                  )}
                </button>

                {currentCustomer ? (
                  <button
                    id="mobile-customer-account-btn"
                    onClick={() => {
                      openCustomerAuth('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#EAE5D9]/80 text-[#1A3828] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#2A5C43]" />
                      <span>{currentCustomer.name} (Account)</span>
                    </span>
                    <span className="text-[10px] text-[#2A5C43] font-bold uppercase">Manage</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="mobile-customer-signin-btn"
                      onClick={() => {
                        openCustomerAuth('signin');
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-white border border-[#DFD8CA] text-[#1A3828] text-center"
                    >
                      Customer Sign In
                    </button>
                    <button
                      id="mobile-customer-signup-btn"
                      onClick={() => {
                        openCustomerAuth('signup');
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-[#1A3828] text-white text-center"
                    >
                      Join Club
                    </button>
                  </div>
                )}

                {/* Staff Portal Link */}
                <button
                  id="mobile-staff-portal-btn"
                  onClick={() => {
                    requestManagerAccess();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-xl text-xs font-medium text-[#5A7363] hover:text-[#1A3828] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D27D46]" />
                    <span>Staff Operations Hub</span>
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-sm font-semibold">
                    Restricted
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Customer Account & Authentication Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthModalOpen}
        onClose={() => setIsCustomerAuthModalOpen(false)}
      />

      {/* Staff Operations Terminal Login Modal */}
      <ManagerAuthModal
        isOpen={isManagerAuthModalOpen}
        onClose={() => setIsManagerAuthModalOpen(false)}
      />

      {/* Location Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 max-w-md w-full border border-[#DED7C8] shadow-2xl relative">
            <button
              onClick={() => setLocationModalOpen(false)}
              className="absolute top-5 right-5 text-[#63796D] hover:text-[#1A3828] p-1.5 rounded-full hover:bg-[#EAE4D6]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#2A5C43] mb-2">
              <MapPin className="w-5 h-5" />
              <span className="text-xs uppercase font-bold tracking-wider">Quick Commerce Hub</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A3828]">Choose Delivery Location</h3>
            <p className="text-xs text-[#5C7265] mt-1 leading-relaxed">
              We provide express 35-min green vehicle delivery in major metro zones across India.
            </p>

            <form onSubmit={handleLocationSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#293E31] mb-1">
                  Enter Area, City or Pincode
                </label>
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru - 560038"
                  className="w-full px-4 py-3 rounded-xl border border-[#D5CDBC] bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2A5C43]"
                  autoFocus
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#546C5F] mb-2">Popular Express Hubs:</p>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTempLocation(c)}
                      className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all ${
                        tempLocation === c
                          ? 'bg-[#1A3828] text-white border-[#1A3828]'
                          : 'bg-white text-[#294233] border-[#DFD8CB] hover:border-[#8EA68B]'
                      }`}
                    >
                      {c.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#445C4F] hover:bg-[#EAE4D6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1A3828] hover:bg-[#12281D] text-white shadow-md shadow-[#1A3828]/20"
                >
                  Confirm Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Navigation Bar for quick-thumb reach */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E3DCCF] px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
            page === 'home' ? 'text-[#1A3828]' : 'text-[#62776A]'
          }`}
        >
          <span className="text-base">🌱</span>
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNavClick('shop')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
            page === 'shop' ? 'text-[#1A3828]' : 'text-[#62776A]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => handleNavClick('services')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
            page === 'services' ? 'text-[#1A3828]' : 'text-[#62776A]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Services</span>
        </button>

        <button
          onClick={() => handleNavClick('visualizer')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
            page === 'visualizer' ? 'text-[#1A3828]' : 'text-[#62776A]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#2A5C43]" />
          <span>Visualizer</span>
        </button>

        <button
          onClick={() => handleNavClick('plant-ai')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl transition-colors ${
            page === 'plant-ai' ? 'text-[#1A3828]' : 'text-[#62776A]'
          }`}
        >
          <Bot className="w-4 h-4 text-[#D27D46]" />
          <span>Plant AI</span>
        </button>

        <button
          onClick={() => handleNavClick('my-garden')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-2.5 rounded-xl relative transition-colors ${
            page === 'my-garden' ? 'text-[#1A3828]' : 'text-[#62776A]'
          }`}
        >
          <Flower2 className="w-4 h-4 text-[#2A5C43]" />
          <span>Garden</span>
          {pendingReminders > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-[#D27D46]" />
          )}
        </button>
      </div>
    </>
  );
};
