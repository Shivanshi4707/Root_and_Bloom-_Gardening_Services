import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ServiceCardsSection } from './components/home/ServiceCardsSection';
import { BestsellersSection } from './components/home/BestsellersSection';
import { WeatherWidget } from './components/WeatherWidget';
import { ShopPage } from './components/shop/ShopPage';
import { ServicesPage } from './components/services/ServicesPage';
import { GardenVisualizerPage } from './components/visualizer/GardenVisualizerPage';
import { PlantAIPage } from './components/plantai/PlantAIPage';
import { LandscapingPage } from './components/landscaping/LandscapingPage';
import { MyGardenPage } from './components/dashboard/MyGardenPage';
import { ManagerPortal } from './components/admin/ManagerPortal';
import { FAQPage } from './components/faq/FAQPage';
import { ContactPage } from './components/contact/ContactPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { BookingModal } from './components/services/BookingModal';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { ToastContainer } from './components/ToastContainer';
import { ManagerAuthModal } from './components/admin/ManagerAuthModal';

const MainContent: React.FC = () => {
  const { page, userRole } = useApp();

  // If Manager Role is active, show the manager portal
  if (userRole === 'manager') {
    return <ManagerPortal />;
  }

  // Customer Views
  switch (page) {
    case 'services':
      return <ServicesPage />;
    case 'shop':
      return <ShopPage />;
    case 'visualizer':
      return <GardenVisualizerPage />;
    case 'plant-ai':
      return <PlantAIPage />;
    case 'my-garden':
      return <MyGardenPage />;
    case 'landscaping':
      return <LandscapingPage />;
    case 'faq':
      return <FAQPage />;
    case 'contact':
      return <ContactPage />;
    case 'home':
    default:
      return (
        <main>
          <HeroSection />
          <ServiceCardsSection />
          <BestsellersSection />
          <div id="weather-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <WeatherWidget />
          </div>
        </main>
      );
  }
};

const AppShell: React.FC = () => {
  const {
    userRole,
    setUserRole,
    currentManager,
    isManagerAuthModalOpen,
    setIsManagerAuthModalOpen,
  } = useApp();

  // Listen to URL hash or query parameters (e.g. #manager, #admin, ?role=manager)
  React.useEffect(() => {
    const handleUrlRole = () => {
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (
        hash === '#manager' ||
        hash === '#admin' ||
        hash === '#portal' ||
        params.get('role') === 'manager' ||
        params.get('view') === 'manager'
      ) {
        setUserRole('manager');
      }
    };
    handleUrlRole();
    window.addEventListener('hashchange', handleUrlRole);
    return () => window.removeEventListener('hashchange', handleUrlRole);
  }, [setUserRole]);

  // Route Protection: If Manager Role is active but not authenticated, enforce login
  if (userRole === 'manager') {
    if (!currentManager) {
      return (
        <div className="min-h-screen bg-[#F4F0E6] text-[#142E20] font-sans antialiased flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl border border-[#DFD8CA] shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1A3828] text-[#8FE388] flex items-center justify-center mx-auto text-2xl shadow-sm">
              🔒
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#142E20]">Staff Operations Terminal</h2>
            <p className="text-xs text-[#5C7265] leading-relaxed">
              This terminal is strictly for verified store managers, dark-store fulfillment leads, and horticulturist dispatchers.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                id="unauth-manager-signin-btn"
                onClick={() => setIsManagerAuthModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#1A3828] text-white font-bold text-xs hover:bg-[#12281D] transition-colors shadow-sm"
              >
                Sign In as Manager
              </button>
              <button
                id="unauth-manager-back-btn"
                onClick={() => setUserRole('customer')}
                className="w-full py-2.5 rounded-xl border border-[#DFD8CA] text-xs font-semibold text-[#3C5346] hover:bg-[#FAF8F5] transition-colors"
              >
                Return to Customer Storefront
              </button>
            </div>
          </div>
          <ManagerAuthModal
            isOpen={isManagerAuthModalOpen}
            onClose={() => setIsManagerAuthModalOpen(false)}
          />
          <ToastContainer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F4F0E6] text-[#142E20] font-sans antialiased">
        <ManagerPortal />
        <ToastContainer />
      </div>
    );
  }

  // Customer Views
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#142E20] font-sans antialiased selection:bg-[#2A5C43] selection:text-white">
      <Navbar />
      <div className="flex-1">
        <MainContent />
      </div>
      <Footer />

      {/* Customer Modals & Utilities */}
      <CartDrawer />
      <CheckoutModal />
      <BookingModal />
      <ProductDetailModal />
      <LiveChatWidget />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
