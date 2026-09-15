import React from 'react';
import { useApp } from '../context/AppContext';
import { Leaf, Shield, Truck, Sparkles, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPage, requestManagerAccess, openCustomerAuth, currentCustomer } = useApp();

  return (
    <>
      <footer className="bg-[#12281D] text-[#E8F0EA] pt-16 pb-24 md:pb-16 border-t border-[#1F3D2E] mt-24">
        {/* Brand Trust Badges Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#234533]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C3E2D] flex items-center justify-center text-[#8FE388]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">35-Min Express</h4>
                <p className="text-xs text-[#9BB3A3]">Zero-emission electric delivery</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C3E2D] flex items-center justify-center text-[#8FE388]">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Organic</h4>
                <p className="text-xs text-[#9BB3A3]">Zero toxic pesticides or chemicals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C3E2D] flex items-center justify-center text-[#8FE388]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Plant Health Guarantee</h4>
                <p className="text-xs text-[#9BB3A3]">7-day stress-free replacement</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C3E2D] flex items-center justify-center text-[#8FE388]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Expert Horticulturists</h4>
                <p className="text-xs text-[#9BB3A3]">Verified & background-checked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2A5C43] text-white flex items-center justify-center">
                  <span>🌱</span>
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  ROOT & BLOOM
                </span>
              </div>
              <p className="text-sm text-[#A8BEB0] max-w-sm leading-relaxed">
                Making garden care simple, smart and beautiful. India's first hybrid gardening services, custom landscaping, and quick-commerce platform.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8FE388]">
                  "Your garden, delivered."
                </span>
                <p className="text-xs text-[#8BA393] mt-0.5">
                  Everything your garden needs, from care to cultivation.
                </p>
              </div>
            </div>

            {/* Col 2: Company */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#8FE388] mb-4">
                Company
              </h5>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => setPage('home')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('services')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('shop')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    Shop Essentials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('visualizer')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    Garden Visualizer
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('contact')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Support */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#8FE388] mb-4">
                Customer Support
              </h5>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => openCustomerAuth(currentCustomer ? 'profile' : 'signin')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    {currentCustomer ? 'My Account & Preferences' : 'Customer Sign In / Register'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('faq')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('plant-ai')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    Plant AI Assistant
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('my-garden')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    My Garden Tracker
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('contact')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('contact')}
                    className="text-[#B5C9BC] hover:text-white transition-colors"
                  >
                    Returns & Cancellation
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Services */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#8FE388] mb-4">
                Services
              </h5>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button
                    onClick={() => setPage('services')}
                    className="text-[#B5C9BC] hover:text-white transition-colors text-left"
                  >
                    Garden Maintenance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('services')}
                    className="text-[#B5C9BC] hover:text-white transition-colors text-left"
                  >
                    Lawn Care & Mowing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('services')}
                    className="text-[#B5C9BC] hover:text-white transition-colors text-left"
                  >
                    Plant Doctor Clinic
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('services')}
                    className="text-[#B5C9BC] hover:text-white transition-colors text-left"
                  >
                    Balcony & Terrace Makeover
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('landscaping')}
                    className="text-[#B5C9BC] hover:text-white transition-colors text-left"
                  >
                    Custom Landscaping
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPage('services')}
                    className="text-[#B5C9BC] hover:text-white transition-colors text-left"
                  >
                    Society Green AMC
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Social Links & Staff Portal Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1C3E2C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8BA393]">
          <p>© 2026 Root & Bloom Garden Co. All rights reserved. Handcrafted with botanical care.</p>
          
          <div className="flex items-center gap-5">
            {/* Real, functional social media links opening in new tab */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Instagram</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Facebook</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            <span className="text-[#2D503C]">•</span>

            {/* Staff Operations Portal Access */}
            <button
              id="footer-staff-login-btn"
              onClick={requestManagerAccess}
              className="text-[#8FE388] hover:text-white hover:underline transition-colors flex items-center gap-1 font-medium"
              title="Staff Login & Dark-Store Hub Access"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Portal Login</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
