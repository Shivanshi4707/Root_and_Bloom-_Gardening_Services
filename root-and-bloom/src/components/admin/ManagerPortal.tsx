import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Package,
  Wrench,
  Compass,
  AlertTriangle,
  TrendingUp,
  Clock,
  User,
  Phone,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Users,
  LogOut,
  Mail,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Sliders,
  FileText,
  Download,
  Check,
  Edit3,
  Eye,
  Store,
  ExternalLink,
  Settings,
  BarChart2,
  Layers,
  Leaf,
  DollarSign,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Order,
  ServiceBooking,
  LandscapingLead,
  CustomerManagedRecord,
  SavedDesign,
} from '../../types';
import { handleImageError } from '../../utils/imageUtils';

type ManagerTab =
  | 'overview'
  | 'customers'
  | 'orders'
  | 'services'
  | 'visualizer'
  | 'reports'
  | 'settings';

export const ManagerPortal: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    bookings,
    updateBookingStatus,
    landscapingLeads,
    updateLeadStatus,
    products,
    restockProduct,
    savedDesigns,
    updateSavedDesign,
    setUserRole,
    currentManager,
    managerLogout,
    registeredCustomers,
    fetchRegisteredCustomers,
    updateCustomerRecord,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ManagerTab>('overview');

  // Filter & Search states
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTierFilter, setCustomerTierFilter] = useState('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [ordersSubTab, setOrdersSubTab] = useState<'store' | 'landscaping'>('store');
  const [leadFilter, setLeadFilter] = useState('all');

  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('all');

  const [visualizerSearch, setVisualizerSearch] = useState('');
  const [visualizerStatusFilter, setVisualizerStatusFilter] = useState('all');

  // Modal states for managing customer & reviewing visualizer design
  const [editingCustomer, setEditingCustomer] = useState<CustomerManagedRecord | null>(null);
  const [customerEditForm, setCustomerEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    membershipTier: 'Standard',
    accountStatus: 'Active',
    bloomPoints: 0,
    managerNotes: '',
  });

  const [selectedDesignForReview, setSelectedDesignForReview] = useState<SavedDesign | null>(null);
  const [designReviewNotes, setDesignReviewNotes] = useState('');
  const [designReviewStatus, setDesignReviewStatus] = useState<string>('Pending Review');

  // Hub Settings state
  const [activeHub, setActiveHub] = useState('Indiranagar Central Hub #01');
  const [expressDeliveryActive, setExpressDeliveryActive] = useState(true);
  const [routeOptimizationActive, setRouteOptimizationActive] = useState(true);
  const [ecoPackagingEnforced, setEcoPackagingEnforced] = useState(true);

  // Sync customer records on mount
  useEffect(() => {
    fetchRegisteredCustomers();
  }, []);

  // 1. Business Metrics calculations
  const totalRevenue = useMemo(() => {
    const ordersRev = (orders || []).reduce((sum, o) => sum + (o?.total || 0), 0);
    const bookingsRev = (bookings || []).reduce((sum, b) => sum + (b?.estimatedPrice || 0), 0);
    const leadsRev = (landscapingLeads || [])
      .filter((l) => l?.status === 'Approved' || l?.status === 'Site Visit Booked')
      .reduce((sum, l) => sum + (l?.estimatedCost || 0), 0);
    return ordersRev + bookingsRev + leadsRev;
  }, [orders, bookings, landscapingLeads]);

  const totalOrdersAndRequestsCount = useMemo(() => {
    return (
      (orders?.length || 0) +
      (bookings?.length || 0) +
      (landscapingLeads?.length || 0) +
      (savedDesigns?.length || 0)
    );
  }, [orders, bookings, landscapingLeads, savedDesigns]);

  const pendingRequestsCount = useMemo(() => {
    const pendingOrders = (orders || []).filter(
      (o) => o.status === 'Order Placed' || o.status === 'Preparing' || o.status === 'Out for Delivery'
    ).length;
    const pendingBookings = (bookings || []).filter(
      (b) => b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'In Progress'
    ).length;
    const pendingLeads = (landscapingLeads || []).filter(
      (l) => l.status === 'Quotation Sent' || l.status === 'Under Review' || l.status === 'Site Visit Booked'
    ).length;
    const pendingDesigns = (savedDesigns || []).filter(
      (d) => !d.status || d.status === 'Pending Review' || d.status === 'Consultation Scheduled'
    ).length;
    return pendingOrders + pendingBookings + pendingLeads + pendingDesigns;
  }, [orders, bookings, landscapingLeads, savedDesigns]);

  const completedRequestsCount = useMemo(() => {
    const compOrders = (orders || []).filter((o) => o.status === 'Delivered').length;
    const compBookings = (bookings || []).filter((b) => b.status === 'Completed').length;
    const compLeads = (landscapingLeads || []).filter((l) => l.status === 'Approved').length;
    const compDesigns = (savedDesigns || []).filter((d) => d.status === 'Approved' || d.status === 'In Execution').length;
    return compOrders + compBookings + compLeads + compDesigns;
  }, [orders, bookings, landscapingLeads, savedDesigns]);

  const lowStockCount = useMemo(() => {
    return (products || []).filter((p) => p.stockCount < 10).length;
  }, [products]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return (registeredCustomers || []).filter((cust) => {
      const q = customerSearch.toLowerCase();
      const matchesSearch =
        !q ||
        cust.name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        (cust.phone && cust.phone.includes(q)) ||
        (cust.address && cust.address.toLowerCase().includes(q));

      const matchesTier =
        customerTierFilter === 'all' ||
        (cust.membershipTier || 'Standard').toLowerCase() === customerTierFilter.toLowerCase();

      const matchesStatus =
        customerStatusFilter === 'all' ||
        (cust.accountStatus || 'Active').toLowerCase() === customerStatusFilter.toLowerCase();

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [registeredCustomers, customerSearch, customerTierFilter, customerStatusFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return (orders || []).filter((ord) => {
      const q = orderSearch.toLowerCase();
      const matchesSearch =
        !q ||
        ord.id.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        (ord.customerPhone && ord.customerPhone.includes(q)) ||
        (ord.address && ord.address.toLowerCase().includes(q));

      const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return (bookings || []).filter((book) => {
      const q = serviceSearch.toLowerCase();
      const matchesSearch =
        !q ||
        book.id.toLowerCase().includes(q) ||
        book.customerName.toLowerCase().includes(q) ||
        book.serviceName.toLowerCase().includes(q) ||
        (book.customerPhone && book.customerPhone.includes(q)) ||
        (book.address && book.address.toLowerCase().includes(q));

      const matchesStatus = serviceStatusFilter === 'all' || book.status === serviceStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, serviceSearch, serviceStatusFilter]);

  // Filtered AI Visualizer Requests
  const filteredDesigns = useMemo(() => {
    return (savedDesigns || []).filter((des) => {
      const q = visualizerSearch.toLowerCase();
      const matchesSearch =
        !q ||
        des.title.toLowerCase().includes(q) ||
        des.style.toLowerCase().includes(q) ||
        des.spaceType.toLowerCase().includes(q) ||
        (des.customerName && des.customerName.toLowerCase().includes(q)) ||
        (des.customerEmail && des.customerEmail.toLowerCase().includes(q));

      const status = des.status || 'Pending Review';
      const matchesStatus =
        visualizerStatusFilter === 'all' ||
        status.toLowerCase() === visualizerStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [savedDesigns, visualizerSearch, visualizerStatusFilter]);

  // Handlers for Customer Management
  const handleOpenEditCustomer = (cust: CustomerManagedRecord) => {
    setEditingCustomer(cust);
    setCustomerEditForm({
      name: cust.name || '',
      phone: cust.phone || '',
      address: cust.address || '',
      membershipTier: cust.membershipTier || 'Standard',
      accountStatus: cust.accountStatus || 'Active',
      bloomPoints: cust.bloomPoints ?? cust.loyaltyPoints ?? 250,
      managerNotes: cust.managerNotes || '',
    });
  };

  const handleSaveCustomerEdits = () => {
    if (!editingCustomer) return;
    updateCustomerRecord(editingCustomer.id, {
      name: customerEditForm.name,
      phone: customerEditForm.phone,
      address: customerEditForm.address,
      membershipTier: customerEditForm.membershipTier as any,
      accountStatus: customerEditForm.accountStatus as any,
      bloomPoints: Number(customerEditForm.bloomPoints),
      loyaltyPoints: Number(customerEditForm.bloomPoints),
      managerNotes: customerEditForm.managerNotes,
    });
    setEditingCustomer(null);
  };

  // Handlers for Visualizer Design Review
  const handleOpenDesignReview = (design: SavedDesign) => {
    setSelectedDesignForReview(design);
    setDesignReviewNotes(design.designerNotes || '');
    setDesignReviewStatus(design.status || 'Pending Review');
  };

  const handleSaveDesignReview = () => {
    if (!selectedDesignForReview) return;
    updateSavedDesign(selectedDesignForReview.id, {
      status: designReviewStatus,
      designerNotes: designReviewNotes,
    });
    setSelectedDesignForReview(null);
  };

  // Handle Logout
  const handleLogout = () => {
    managerLogout();
    setUserRole('customer');
    if (typeof window !== 'undefined' && window.location.hash) {
      window.location.hash = '';
    }
  };

  // Export Operations Summary
  const handleExportSummary = () => {
    const summaryData = {
      exportedAt: new Date().toISOString(),
      hub: activeHub,
      manager: currentManager?.name || 'Store Operations Lead',
      metrics: {
        totalRevenue,
        totalCustomers: registeredCustomers.length,
        totalOrdersAndRequests: totalOrdersAndRequestsCount,
        pendingRequests: pendingRequestsCount,
        completedRequests: completedRequestsCount,
        lowStockItems: lowStockCount,
      },
      ordersCount: orders.length,
      bookingsCount: bookings.length,
      landscapingLeadsCount: landscapingLeads.length,
      visualizerRequestsCount: savedDesigns.length,
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `root_and_bloom_operations_summary_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Report Exported 📊', 'Operational summary downloaded successfully.');
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-[#142E20] font-sans pb-16">
      {/* TOP NOTIFICATION & HUB HEADER */}
      <div className="bg-[#142E20] text-white border-b border-[#254231] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2A5C43] flex items-center justify-center text-white shadow-inner">
                <ShieldCheck className="w-5 h-5 text-[#8FE388]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-base tracking-wide text-white">
                    Root & Bloom
                  </span>
                  <span className="bg-[#8FE388]/20 text-[#8FE388] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#8FE388]/40 tracking-wider uppercase">
                    Manager Terminal
                  </span>
                </div>
                <p className="text-[11px] text-[#A5C1B1]">
                  Dark-Store Quick-Commerce & Horticulturist Operations
                </p>
              </div>
            </div>

            {/* Manager Details, Hub Selector & Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs">
              <div className="hidden sm:flex items-center gap-2 bg-[#1A3828] px-3 py-1.5 rounded-xl border border-[#2B4B38]">
                <MapPin className="w-3.5 h-3.5 text-[#8FE388]" />
                <span className="text-[#CBE2D4] font-medium">{activeHub}</span>
              </div>

              <div className="flex items-center gap-2 bg-[#1A3828] px-3 py-1.5 rounded-xl border border-[#2B4B38]">
                <User className="w-3.5 h-3.5 text-[#8FE388]" />
                <span className="font-bold text-white">
                  {currentManager?.name || 'Operations Lead'}
                </span>
                <span className="text-[10px] bg-[#2A5C43] text-[#A5E3BE] px-1.5 py-0.5 rounded font-mono">
                  {currentManager?.staffBadgeId || 'RB-MGR-8802'}
                </span>
              </div>

              <button
                id="manager-view-storefront-btn"
                onClick={() => setUserRole('customer')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#224734] hover:bg-[#2C5740] text-white text-xs font-semibold transition-colors border border-[#356149]"
                title="View customer storefront"
              >
                <Store className="w-3.5 h-3.5 text-[#8FE388]" />
                <span className="hidden md:inline">Customer Storefront</span>
              </button>

              <button
                id="manager-top-logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6B241E] hover:bg-[#852C25] text-white text-xs font-bold transition-colors shadow-xs"
                title="Secure logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* MANAGER NAVIGATION MENU TABS */}
          <div className="flex items-center gap-1 overflow-x-auto pt-2 pb-3 border-t border-[#254231] scrollbar-none text-xs">
            {[
              { id: 'overview', label: 'Dashboard (Overview)', icon: BarChart2 },
              {
                id: 'customers',
                label: 'Customers',
                icon: Users,
                badge: registeredCustomers.length,
              },
              {
                id: 'orders',
                label: 'Orders / Requests',
                icon: Package,
                badge: orders.length,
              },
              {
                id: 'services',
                label: 'Services',
                icon: Wrench,
                badge: bookings.length,
              },
              {
                id: 'visualizer',
                label: 'AI Visualizer Requests',
                icon: Sparkles,
                badge: savedDesigns.length,
              },
              { id: 'reports', label: 'Reports / Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`manager-nav-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as ManagerTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all text-xs ${
                    isActive
                      ? 'bg-[#8FE388] text-[#142E20] shadow-sm scale-102'
                      : 'text-[#CBE2D4] hover:bg-[#1E3B2B] hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#142E20]' : 'text-[#8FE388]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-[#142E20] text-[#8FE388]'
                          : 'bg-[#2A5C43] text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* ======================================================== */}
        {/* TAB 1: DASHBOARD (OVERVIEW)                              */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Welcome Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD8CB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
                    Operations Overview
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-xs font-mono text-[#5D7768]">
                    {new Date().toLocaleDateString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142E20] mt-1">
                  Welcome back, {currentManager?.name || 'Operations Lead'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5D7768] mt-1">
                  Live hub management: Track customer accounts, dispatch plant quick-commerce orders, and coordinate expert horticulturists.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="overview-export-report-btn"
                  onClick={handleExportSummary}
                  className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5CDBC] hover:bg-[#EAE4D6] text-xs font-bold text-[#142E20] flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#2A5C43]" />
                  <span>Export Report</span>
                </button>
                <button
                  id="overview-quick-orders-btn"
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2.5 rounded-xl bg-[#1A3828] hover:bg-[#12281D] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Package className="w-3.5 h-3.5 text-[#8FE388]" />
                  <span>Manage Orders</span>
                </button>
              </div>
            </div>

            {/* 5 Primary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Metric 1: Total Customers */}
              <div
                onClick={() => setActiveTab('customers')}
                className="bg-white p-5 rounded-2xl border border-[#DFD8CB] shadow-xs cursor-pointer hover:border-[#1A3828]/50 transition-all group"
              >
                <div className="flex items-center justify-between text-[#5D7768] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
                  <div className="w-8 h-8 rounded-xl bg-[#E8F2EC] group-hover:bg-[#1A3828] text-[#1A3828] group-hover:text-white flex items-center justify-center transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#142E20]">
                  {registeredCustomers.length}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#2A5C43] font-semibold mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Verified Account Directory</span>
                </div>
              </div>

              {/* Metric 2: Total Orders / Requests */}
              <div
                onClick={() => setActiveTab('orders')}
                className="bg-white p-5 rounded-2xl border border-[#DFD8CB] shadow-xs cursor-pointer hover:border-[#1A3828]/50 transition-all group"
              >
                <div className="flex items-center justify-between text-[#5D7768] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Requests</span>
                  <div className="w-8 h-8 rounded-xl bg-[#E8F2EC] group-hover:bg-[#1A3828] text-[#1A3828] group-hover:text-white flex items-center justify-center transition-colors">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#142E20]">
                  {totalOrdersAndRequestsCount}
                </div>
                <p className="text-[11px] text-[#5D7768] mt-1">
                  {orders.length} store + {bookings.length} services + {savedDesigns.length} visualizers
                </p>
              </div>

              {/* Metric 3: Pending Orders / Requests */}
              <div
                onClick={() => setActiveTab('orders')}
                className="bg-white p-5 rounded-2xl border border-[#DFD8CB] shadow-xs cursor-pointer hover:border-[#D97706]/60 transition-all group"
              >
                <div className="flex items-center justify-between text-[#5D7768] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
                  <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] group-hover:bg-[#D97706] text-[#D97706] group-hover:text-white flex items-center justify-center transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#B45309]">
                  {pendingRequestsCount}
                </div>
                <p className="text-[11px] text-[#854D0E] font-medium mt-1">
                  Needs fulfillment / dispatch
                </p>
              </div>

              {/* Metric 4: Completed Orders / Requests */}
              <div
                onClick={() => setActiveTab('orders')}
                className="bg-white p-5 rounded-2xl border border-[#DFD8CB] shadow-xs cursor-pointer hover:border-[#1A3828]/50 transition-all group"
              >
                <div className="flex items-center justify-between text-[#5D7768] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                  <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] group-hover:bg-[#16A34A] text-[#16A34A] group-hover:text-white flex items-center justify-center transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#15803D]">
                  {completedRequestsCount}
                </div>
                <p className="text-[11px] text-[#166534] font-medium mt-1">
                  Successfully fulfilled
                </p>
              </div>

              {/* Metric 5: Revenue / Sales */}
              <div className="bg-white p-5 rounded-2xl border border-[#DFD8CB] shadow-xs">
                <div className="flex items-center justify-between text-[#5D7768] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Revenue / Sales</span>
                  <div className="w-8 h-8 rounded-xl bg-[#E8F2EC] text-[#1A3828] flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-[#2A5C43]" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold text-[#142E20]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-[#2A5C43] font-semibold mt-1">
                  Cart sales + consultations
                </p>
              </div>
            </div>

            {/* Quick Navigation Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('orders')}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DFD8CB] hover:bg-white hover:border-[#1A3828] transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1A3828] text-[#8FE388] flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#142E20]">Quick-Commerce Orders</h4>
                  <p className="text-[11px] text-[#5D7768]">
                    {orders.filter((o) => o.status !== 'Delivered').length} active shipments
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('customers')}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DFD8CB] hover:bg-white hover:border-[#1A3828] transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2A5C43] text-white flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#142E20]">Customer Accounts CRM</h4>
                  <p className="text-[11px] text-[#5D7768]">
                    {registeredCustomers.length} registered profiles
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('services')}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DFD8CB] hover:bg-white hover:border-[#1A3828] transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D27D46] text-white flex items-center justify-center shrink-0">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#142E20]">Horticulturist Schedule</h4>
                  <p className="text-[11px] text-[#5D7768]">
                    {bookings.filter((b) => b.status !== 'Completed').length} appointments pending
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('visualizer')}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DFD8CB] hover:bg-white hover:border-[#1A3828] transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6B4E71] text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#142E20]">AI Visualizer Designs</h4>
                  <p className="text-[11px] text-[#5D7768]">
                    {savedDesigns.length} customer proposals
                  </p>
                </div>
              </div>
            </div>

            {/* Real-time Activity Feed & Recent Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1 & 2: Recent Orders & Bookings Feed */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#DFD8CB] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#142E20]">
                      Live Request Stream
                    </h3>
                    <p className="text-xs text-[#5D7768]">
                      Real-time submissions from customer storefront and quick-commerce checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#2A5C43] hover:underline flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E8F2EC] text-[#1A3828] flex items-center justify-center font-bold text-xs shrink-0">
                          📦
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#142E20]">
                              {ord.customerName}
                            </span>
                            <span className="text-[10px] font-mono text-[#5D7768]">
                              #{ord.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#5D7768]">
                            {ord.items.length} items • ₹{ord.total} • {ord.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === 'Delivered'
                              ? 'bg-[#E5EFE7] text-[#1A3828]'
                              : ord.status === 'Out for Delivery'
                              ? 'bg-[#E0E7FF] text-[#3730A3]'
                              : 'bg-[#FEF3C7] text-[#92400E]'
                          }`}
                        >
                          {ord.status}
                        </span>

                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className="text-[11px] font-semibold px-2 py-1 rounded-lg border border-[#D5CDBC] bg-white"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Dark-Store Inventory & Operational Health */}
              <div className="bg-white rounded-3xl p-6 border border-[#DFD8CB] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#142E20]">
                    Hub Inventory Alerts
                  </h3>
                  <span className="text-[11px] bg-[#FEE2E2] text-[#991B1B] font-bold px-2 py-0.5 rounded-full">
                    {lowStockCount} Low Stock
                  </span>
                </div>

                <div className="space-y-3">
                  {products
                    .filter((p) => p.stockCount < 15)
                    .slice(0, 5)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl border border-[#DFD8CB] bg-[#FAF8F5] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.image}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover shrink-0"
                            onError={handleImageError}
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-[#142E20] truncate">
                              {p.name}
                            </h5>
                            <span className="text-[10px] text-[#B91C1C] font-semibold">
                              Only {p.stockCount} units left
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => restockProduct(p.id, 20)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#D5CDBC] hover:bg-[#1A3828] hover:text-white font-bold text-[10px] text-[#142E20] transition-colors shrink-0"
                        >
                          +20 Stock
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CUSTOMERS MANAGEMENT & CRM                        */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFD8CB] shadow-sm space-y-6 animate-in fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#142E20] flex items-center gap-2">
                  <span>Registered Customer Accounts</span>
                  <span className="text-xs bg-[#E5EFE7] text-[#1A3828] px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {registeredCustomers.length} Total Accounts
                  </span>
                </h3>
                <p className="text-xs text-[#5D7768]">
                  Search, filter, view purchase histories, and manage membership tiers & loyalty privileges.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#7A9384] absolute left-3 top-2.5" />
                  <input
                    id="manager-customer-search-input"
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search by name, email, phone..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>

                <select
                  value={customerTierFilter}
                  onChange={(e) => setCustomerTierFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold text-[#142E20]"
                >
                  <option value="all">All Tiers</option>
                  <option value="Standard">Standard</option>
                  <option value="Bloom Club">Bloom Club</option>
                  <option value="Botanical VIP">Botanical VIP</option>
                </select>
              </div>
            </div>

            {/* Customer List */}
            <div className="space-y-4">
              {filteredCustomers.length === 0 ? (
                <div className="p-12 text-center bg-[#FAF8F5] rounded-2xl border border-[#DFD8CB] text-xs text-[#627A6C] space-y-2">
                  <Users className="w-8 h-8 text-[#A0B5A8] mx-auto" />
                  <p>No customer accounts match your search query "{customerSearch}".</p>
                </div>
              ) : (
                filteredCustomers.map((cust) => {
                  const isExpanded = expandedCustomerId === cust.id;
                  const customerOrders = orders.filter(
                    (o) =>
                      o.customerName?.toLowerCase() === cust.name.toLowerCase() ||
                      o.customerPhone === cust.phone
                  );
                  const customerBookings = bookings.filter(
                    (b) =>
                      b.customerName?.toLowerCase() === cust.name.toLowerCase() ||
                      b.customerPhone === cust.phone
                  );
                  const customerDesigns = savedDesigns.filter(
                    (d) =>
                      (d.customerEmail && d.customerEmail.toLowerCase() === cust.email.toLowerCase()) ||
                      (d.customerName && d.customerName.toLowerCase() === cust.name.toLowerCase())
                  );

                  return (
                    <div
                      key={cust.id}
                      className="rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] overflow-hidden hover:border-[#1A3828]/40 transition-all"
                    >
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-[#1A3828] text-white flex items-center justify-center font-bold text-lg shrink-0">
                            {cust.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#142E20]">{cust.name}</h4>
                              <span className="bg-[#E5EFE7] text-[#1A3828] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {cust.membershipTier || 'Bloom Club Member'}
                              </span>
                              <span className="text-[10px] font-mono text-[#5D7768] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#DFD8CB]">
                                #{cust.id}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5D7768] mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-[#7B9284]" />
                                <span>{cust.email}</span>
                              </span>
                              {cust.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-[#7B9284]" />
                                  <span>{cust.phone}</span>
                                </span>
                              )}
                              {cust.address && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#7B9284]" />
                                  <span className="truncate max-w-[200px]">{cust.address}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:self-center">
                          <div className="text-right hidden sm:block text-xs mr-2">
                            <span className="font-bold text-[#142E20] block">
                              {customerOrders.length} Orders • {customerBookings.length} Bookings
                            </span>
                            <span className="text-[11px] text-[#2A5C43] font-semibold">
                              ✨ {cust.bloomPoints ?? cust.loyaltyPoints ?? 250} Bloom Points
                            </span>
                          </div>

                          <button
                            id={`manage-customer-btn-${cust.id}`}
                            onClick={() => handleOpenEditCustomer(cust)}
                            className="px-3 py-1.5 rounded-xl bg-[#1A3828] text-white hover:bg-[#12281D] text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <Edit3 className="w-3 h-3 text-[#8FE388]" />
                            <span>Manage Record</span>
                          </button>

                          <button
                            id={`toggle-customer-history-${cust.id}`}
                            onClick={() => setExpandedCustomerId(isExpanded ? null : cust.id)}
                            className="px-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-white hover:bg-[#F2ECE1] text-xs font-semibold text-[#142E20] flex items-center gap-1 transition-colors"
                          >
                            <span>{isExpanded ? 'Hide' : 'Activity'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Activity Details */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 border-t border-[#DFD8CB] bg-white space-y-4 animate-in slide-in-from-top-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D7]">
                              <span className="text-[10px] uppercase font-bold text-[#627A6C] block mb-1">
                                Delivery Address & Coordinates
                              </span>
                              <p className="font-medium text-[#142E20] flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#D27D46] shrink-0 mt-0.5" />
                                <span>{cust.address || 'Address not registered yet'}</span>
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D7]">
                              <span className="text-[10px] uppercase font-bold text-[#627A6C] block mb-1">
                                Account Timeline
                              </span>
                              <p className="text-[#142E20]">
                                Joined: <span className="font-semibold">{cust.joinedDate || 'August 2026'}</span>
                              </p>
                              <p className="text-[#5D7768] text-[11px] mt-0.5">
                                Last Active: {cust.lastActive || 'Today'}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE4D7]">
                              <span className="text-[10px] uppercase font-bold text-[#627A6C] block mb-1">
                                Manager Internal Notes
                              </span>
                              <p className="text-[#142E20] italic">
                                {cust.managerNotes || 'No notes added yet for this customer record.'}
                              </p>
                            </div>
                          </div>

                          {/* Purchase and Booking history */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs font-bold text-[#142E20] uppercase tracking-wider block mb-2">
                                Store Orders ({customerOrders.length})
                              </span>
                              {customerOrders.length > 0 ? (
                                <div className="space-y-2">
                                  {customerOrders.map((ord) => (
                                    <div
                                      key={ord.id}
                                      className="p-2.5 rounded-xl border border-[#DFD8CB] bg-[#FAF8F5] flex items-center justify-between text-xs"
                                    >
                                      <div>
                                        <span className="font-mono font-bold text-[#1A3828]">
                                          #{ord.id}
                                        </span>
                                        <span className="text-[#5D7768] ml-2">
                                          ({ord.items.length} items • ₹{ord.total})
                                        </span>
                                      </div>
                                      <span className="bg-[#E5EFE7] text-[#1A3828] font-bold text-[10px] px-2 py-0.5 rounded-full">
                                        {ord.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-[#7B9284] italic">
                                  No store purchases recorded yet.
                                </p>
                              )}
                            </div>

                            <div>
                              <span className="text-xs font-bold text-[#142E20] uppercase tracking-wider block mb-2">
                                Service Bookings ({customerBookings.length})
                              </span>
                              {customerBookings.length > 0 ? (
                                <div className="space-y-2">
                                  {customerBookings.map((book) => (
                                    <div
                                      key={book.id}
                                      className="p-2.5 rounded-xl border border-[#DFD8CB] bg-[#FAF8F5] flex items-center justify-between text-xs"
                                    >
                                      <div>
                                        <span className="font-bold text-[#1A3828]">
                                          {book.serviceName}
                                        </span>
                                        <span className="text-[#5D7768] ml-2 font-mono">
                                          {book.scheduledDate}
                                        </span>
                                      </div>
                                      <span className="bg-[#E5EFE7] text-[#1A3828] font-bold text-[10px] px-2 py-0.5 rounded-full">
                                        {book.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-[#7B9284] italic">
                                  No service bookings recorded yet.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ORDERS / REQUESTS MANAGEMENT                      */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFD8CB] shadow-sm space-y-6 animate-in fade-in">
            {/* Header & Subtabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#142E20]">
                  Orders & Project Requests
                </h3>
                <p className="text-xs text-[#5D7768]">
                  Track live orders, dispatch dark-store cargo, and update delivery milestones.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrdersSubTab('store')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    ordersSubTab === 'store'
                      ? 'bg-[#1A3828] text-white'
                      : 'bg-[#FAF8F5] border border-[#D5CDBC] text-[#142E20]'
                  }`}
                >
                  Quick-Commerce ({orders.length})
                </button>
                <button
                  onClick={() => setOrdersSubTab('landscaping')}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    ordersSubTab === 'landscaping'
                      ? 'bg-[#1A3828] text-white'
                      : 'bg-[#FAF8F5] border border-[#D5CDBC] text-[#142E20]'
                  }`}
                >
                  Landscaping Quotes ({landscapingLeads.length})
                </button>
              </div>
            </div>

            {/* Quick-Commerce Store Orders Sub-Tab */}
            {ordersSubTab === 'store' && (
              <div className="space-y-4">
                {/* Search and Filters */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#7A9384] absolute left-3 top-2.5" />
                    <input
                      id="manager-order-search"
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search Order ID, customer, address..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs text-[#142E20]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#5D7768]">Status Filter:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold text-[#142E20]"
                    >
                      <option value="all">All Statuses ({orders.length})</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Orders Cards */}
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#DFD8CB] text-xs text-[#627A6C]">
                      No orders match the selected filter.
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 sm:p-5 rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] hover:border-[#1A3828]/40 transition-colors space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE4D7] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold bg-[#E8F2EC] text-[#1A3828] px-2.5 py-1 rounded-lg">
                              #{order.id}
                            </span>
                            <span className="text-xs text-[#5D7768]">
                              {order.createdAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                order.status === 'Delivered'
                                  ? 'bg-[#E5EFE7] text-[#1A3828]'
                                  : order.status === 'Out for Delivery'
                                  ? 'bg-[#E0E7FF] text-[#3730A3]'
                                  : 'bg-[#FEF3C7] text-[#92400E]'
                              }`}
                            >
                              {order.status}
                            </span>

                            <select
                              id={`update-order-status-${order.id}`}
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className="text-xs font-bold px-2.5 py-1 rounded-lg border border-[#D5CDBC] bg-white text-[#142E20]"
                            >
                              <option value="Order Placed">Set: Order Placed</option>
                              <option value="Preparing">Set: Preparing</option>
                              <option value="Out for Delivery">Set: Out for Delivery</option>
                              <option value="Delivered">Set: Delivered</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="font-bold text-[#3E5647] block mb-1">
                              Customer & Delivery Coordinates
                            </span>
                            <p className="font-semibold text-[#142E20]">{order.customerName}</p>
                            <p className="text-[#5D7768]">{order.customerPhone}</p>
                            <p className="text-[#5D7768] flex items-start gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#D27D46] shrink-0 mt-0.5" />
                              <span>{order.address}</span>
                            </p>
                          </div>

                          <div>
                            <span className="font-bold text-[#3E5647] block mb-1">
                              Botanical Order Items
                            </span>
                            <div className="space-y-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[#5D7768]">
                                  <span className="truncate max-w-[160px] font-medium text-[#142E20]">
                                    {item.quantity}x {item.productName}
                                  </span>
                                  <span>₹{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="font-bold text-[#3E5647] block mb-1">
                              Total & Payment
                            </span>
                            <div className="font-serif font-bold text-base text-[#142E20]">
                              ₹{order.total}
                            </div>
                            <p className="text-[#5D7768] font-mono text-[11px]">
                              Paid via: {order.paymentMethod}
                            </p>
                            <p className="text-[10px] text-[#2A5C43] font-semibold mt-1">
                              🌱 100% Plastic-Free Honeycomb Packaging
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Custom Landscaping Sub-Tab */}
            {ordersSubTab === 'landscaping' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#5D7768]">
                    Showing custom landscaping estimates requested by customers.
                  </span>
                  <select
                    value={leadFilter}
                    onChange={(e) => setLeadFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold"
                  >
                    <option value="all">All Leads ({landscapingLeads.length})</option>
                    <option value="Quotation Sent">Quotation Sent</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Site Visit Booked">Site Visit Booked</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {landscapingLeads
                    .filter((l) => leadFilter === 'all' || l.status === leadFilter)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 sm:p-5 rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE4D7] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#142E20]">
                              {lead.propertyType} Makeover
                            </span>
                            <span className="font-mono text-xs bg-[#E5EFE7] text-[#1A3828] px-2 py-0.5 rounded font-semibold">
                              #{lead.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E5EFE7] text-[#1A3828]">
                              {lead.status}
                            </span>
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                              className="text-xs font-bold px-2 py-1 rounded-lg border border-[#D5CDBC] bg-white"
                            >
                              <option value="Quotation Sent">Set: Quotation Sent</option>
                              <option value="Under Review">Set: Under Review</option>
                              <option value="Site Visit Booked">Set: Site Visit Booked</option>
                              <option value="Approved">Set: Approved</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="font-bold text-[#3E5647] block mb-1">Customer Info</span>
                            <p className="font-semibold text-[#142E20]">{lead.customerName}</p>
                            <p className="text-[#5D7768]">{lead.customerPhone}</p>
                            <p className="text-[#5D7768]">{lead.location}</p>
                          </div>

                          <div>
                            <span className="font-bold text-[#3E5647] block mb-1">Scope & Budget</span>
                            <p className="font-semibold text-[#142E20]">
                              Area: {lead.gardenAreaSqFt} sq ft
                            </p>
                            <p className="text-[#5D7768]">Budget: {lead.budgetRange}</p>
                            <p className="font-serif font-bold text-[#142E20] mt-1">
                              Est: ₹{lead.estimatedCost}
                            </p>
                          </div>

                          <div>
                            <span className="font-bold text-[#3E5647] block mb-1">Requirements</span>
                            <p className="text-[#5D7768] italic">"{lead.requirements}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SERVICES & HORTICULTURIST DISPATCH               */}
        {/* ======================================================== */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFD8CB] shadow-sm space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#142E20]">
                  Horticulturist Appointments & Care Dispatches
                </h3>
                <p className="text-xs text-[#5D7768]">
                  Assign specialists, adjust appointment schedules, and update on-site consultation status.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#7A9384] absolute left-3 top-2.5" />
                  <input
                    id="manager-service-search"
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search client, service, address..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs text-[#142E20]"
                  />
                </div>

                <select
                  value={serviceStatusFilter}
                  onChange={(e) => setServiceStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold text-[#142E20]"
                >
                  <option value="all">All Appointments ({bookings.length})</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#DFD8CB] text-xs text-[#627A6C]">
                  No service appointments match the current filter.
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 sm:p-5 rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] hover:border-[#1A3828]/40 transition-colors space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAE4D7] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#142E20]">
                          {booking.serviceName}
                        </span>
                        <span className="font-mono text-xs bg-[#E5EFE7] text-[#1A3828] px-2 py-0.5 rounded font-semibold">
                          #{booking.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            booking.status === 'Completed'
                              ? 'bg-[#E5EFE7] text-[#1A3828]'
                              : booking.status === 'Confirmed'
                              ? 'bg-[#DBEAFE] text-[#1E40AF]'
                              : 'bg-[#FEF3C7] text-[#92400E]'
                          }`}
                        >
                          {booking.status}
                        </span>

                        <select
                          id={`update-booking-status-${booking.id}`}
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value as any)}
                          className="text-xs font-bold px-2.5 py-1 rounded-lg border border-[#D5CDBC] bg-white text-[#142E20]"
                        >
                          <option value="Pending">Set: Pending</option>
                          <option value="Confirmed">Set: Confirmed</option>
                          <option value="In Progress">Set: In Progress</option>
                          <option value="Completed">Set: Completed</option>
                          <option value="Cancelled">Set: Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-[#3E5647] block mb-1">Client Details</span>
                        <p className="font-semibold text-[#142E20]">{booking.customerName}</p>
                        <p className="text-[#5D7768]">{booking.customerPhone}</p>
                        <p className="text-[#5D7768] flex items-start gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#D27D46] shrink-0 mt-0.5" />
                          <span>{booking.address}</span>
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-[#3E5647] block mb-1">
                          Schedule & Property Scope
                        </span>
                        <p className="font-semibold text-[#142E20]">
                          📅 {booking.scheduledDate} at {booking.scheduledTime}
                        </p>
                        <p className="text-[#5D7768]">
                          {booking.propertyType} • {booking.gardenAreaSqFt} sq ft
                        </p>
                        <p className="text-[#5D7768] capitalize">
                          Frequency: {booking.frequency}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-[#3E5647] block mb-1">
                          Assigned Horticulturist
                        </span>
                        <p className="font-semibold text-[#1A3828]">
                          🧑‍🌾 {booking.assignedStaff || 'Dr. Rajesh Kumar (Senior Horticulturist)'}
                        </p>
                        <p className="font-serif font-bold text-sm text-[#142E20] mt-1">
                          Fee: ₹{booking.estimatedPrice}
                        </p>
                        {booking.notes && (
                          <p className="text-[11px] text-[#5D7768] italic mt-1">
                            Note: "{booking.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: AI VISUALIZER REQUESTS                            */}
        {/* ======================================================== */}
        {activeTab === 'visualizer' && (
          <div className="bg-white rounded-3xl p-6 border border-[#DFD8CB] shadow-sm space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#142E20] flex items-center gap-2">
                  <span>Customer AI Visualizer Proposals</span>
                  <span className="text-xs bg-[#E8F2EC] text-[#1A3828] px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {savedDesigns.length} Designs
                  </span>
                </h3>
                <p className="text-xs text-[#5D7768]">
                  Review garden transformations designed by customers, inspect plant selections, and schedule on-site consultations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#7A9384] absolute left-3 top-2.5" />
                  <input
                    id="manager-visualizer-search"
                    type="text"
                    value={visualizerSearch}
                    onChange={(e) => setVisualizerSearch(e.target.value)}
                    placeholder="Search title, style, customer..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs text-[#142E20]"
                  />
                </div>

                <select
                  value={visualizerStatusFilter}
                  onChange={(e) => setVisualizerStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] text-xs font-semibold text-[#142E20]"
                >
                  <option value="all">All Review Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Consultation Scheduled">Consultation Scheduled</option>
                  <option value="Approved">Approved</option>
                  <option value="In Execution">In Execution</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDesigns.length === 0 ? (
                <div className="col-span-2 p-12 text-center bg-[#FAF8F5] rounded-2xl border border-[#DFD8CB] text-xs text-[#627A6C] space-y-2">
                  <Sparkles className="w-8 h-8 text-[#A0B5A8] mx-auto" />
                  <p>No customer garden proposals match your search or filter.</p>
                </div>
              ) : (
                filteredDesigns.map((design) => {
                  const status = design.status || 'Pending Review';
                  const displayImage = design.afterImage || design.image || design.beforeImage;

                  return (
                    <div
                      key={design.id}
                      className="p-5 rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] flex flex-col justify-between space-y-4 hover:border-[#1A3828]/40 transition-all"
                    >
                      <div>
                        {/* Header with Title & Status */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#2A5C43] tracking-wider block">
                              {design.spaceType}
                            </span>
                            <h4 className="font-bold text-sm text-[#142E20]">
                              {design.title}
                            </h4>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              status === 'Approved'
                                ? 'bg-[#DCFCE7] text-[#15803D]'
                                : status === 'Consultation Scheduled'
                                ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                                : 'bg-[#FEF3C7] text-[#B45309]'
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Visualizer Image Preview */}
                        <div className="relative h-44 rounded-xl overflow-hidden bg-[#E2DBD0] border border-[#DFD8CB] mb-3">
                          <img
                            src={displayImage}
                            alt={design.title}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                          <div className="absolute bottom-2 left-2 bg-[#142E20]/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#8FE388]" />
                            <span>{design.style}</span>
                          </div>
                        </div>

                        {/* Customer & Scope Details */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-[#5D7768]">
                            <span>Customer:</span>
                            <span className="font-semibold text-[#142E20]">
                              {design.customerName || 'Customer Client'}
                            </span>
                          </div>

                          {design.customerEmail && (
                            <div className="flex items-center justify-between text-[#5D7768]">
                              <span>Email:</span>
                              <span className="text-[#142E20] font-mono text-[11px]">
                                {design.customerEmail}
                              </span>
                            </div>
                          )}

                          {design.estimatedCost && (
                            <div className="flex items-center justify-between text-[#5D7768]">
                              <span>Estimated Recipe Budget:</span>
                              <span className="font-serif font-bold text-[#142E20]">
                                ₹{design.estimatedCost}
                              </span>
                            </div>
                          )}

                          {design.keyPlants && design.keyPlants.length > 0 && (
                            <div className="pt-2">
                              <span className="text-[10px] font-bold text-[#455E4F] uppercase tracking-wider block mb-1">
                                Key Botanical Species:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {design.keyPlants.slice(0, 4).map((plant, pIdx) => (
                                  <span
                                    key={pIdx}
                                    className="bg-white border border-[#DFD8CB] text-[10px] px-2 py-0.5 rounded-md text-[#2A5C43] font-medium"
                                  >
                                    {plant}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {design.designerNotes && (
                            <div className="pt-2 p-2.5 rounded-xl bg-white border border-[#DFD8CB] text-[11px] text-[#5D7768] italic">
                              Horticulturist Note: "{design.designerNotes}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-[#DFD8CB] flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#7A9384]">
                          Saved: {design.savedAt}
                        </span>

                        <button
                          id={`review-design-btn-${design.id}`}
                          onClick={() => handleOpenDesignReview(design)}
                          className="px-3 py-1.5 rounded-xl bg-[#1A3828] text-white hover:bg-[#12281D] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#8FE388]" />
                          <span>Review & Assign</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: REPORTS / ANALYTICS                               */}
        {/* ======================================================== */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD8CB] shadow-sm space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#142E20]">
                  Business Intelligence & Performance Reports
                </h3>
                <p className="text-xs sm:text-sm text-[#5D7768]">
                  Operational breakdown across quick-commerce sales, recurring maintenance AMCs, and regional hub SLA performance.
                </p>
              </div>

              <button
                id="reports-download-export-btn"
                onClick={handleExportSummary}
                className="px-4 py-2 rounded-xl bg-[#1A3828] hover:bg-[#12281D] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm self-start sm:self-center"
              >
                <Download className="w-3.5 h-3.5 text-[#8FE388]" />
                <span>Download Executive Summary</span>
              </button>
            </div>

            {/* Revenue Streams Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DFD8CB] space-y-2">
                <span className="text-xs font-bold text-[#5D7768] uppercase tracking-wider block">
                  Quick-Commerce Plant Orders
                </span>
                <div className="font-serif text-2xl font-bold text-[#142E20]">
                  ₹{orders.reduce((s, o) => s + o.total, 0).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-[#2A5C43] font-semibold">
                  {orders.length} shipments processed • Avg ticket ₹{Math.round(totalRevenue / Math.max(orders.length, 1))}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DFD8CB] space-y-2">
                <span className="text-xs font-bold text-[#5D7768] uppercase tracking-wider block">
                  Service Maintenance AMCs
                </span>
                <div className="font-serif text-2xl font-bold text-[#142E20]">
                  ₹{bookings.reduce((s, b) => s + b.estimatedPrice, 0).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-[#2A5C43] font-semibold">
                  {bookings.length} on-site consultations & recurring visits
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#DFD8CB] space-y-2">
                <span className="text-xs font-bold text-[#5D7768] uppercase tracking-wider block">
                  Landscaping & Turnkey
                </span>
                <div className="font-serif text-2xl font-bold text-[#142E20]">
                  ₹{landscapingLeads.reduce((s, l) => s + l.estimatedCost, 0).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-[#2A5C43] font-semibold">
                  {landscapingLeads.length} custom villa & terrace estimates
                </p>
              </div>
            </div>

            {/* SLA & Efficiency Indicators */}
            <div className="p-6 rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] space-y-4">
              <h4 className="font-serif font-bold text-base text-[#142E20]">
                Regional Hub SLA Benchmarks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-4 rounded-xl border border-[#E0D8CA]">
                  <span className="text-[#5D7768] block mb-1">35-Min Delivery SLA</span>
                  <div className="font-serif font-bold text-lg text-[#142E20]">98.2% On-Time</div>
                  <span className="text-[10px] text-[#16A34A] font-semibold">⚡ Exceeding Metro Target</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E0D8CA]">
                  <span className="text-[#5D7768] block mb-1">Horticulturist CSAT</span>
                  <div className="font-serif font-bold text-lg text-[#142E20]">4.94 / 5.0 ⭐</div>
                  <span className="text-[10px] text-[#16A34A] font-semibold">Based on 1,420 reviews</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E0D8CA]">
                  <span className="text-[#5D7768] block mb-1">Zero Plant Shock Rate</span>
                  <div className="font-serif font-bold text-lg text-[#142E20]">99.7% Pristine</div>
                  <span className="text-[10px] text-[#2A5C43] font-semibold">Eco-Honeycomb casing</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E0D8CA]">
                  <span className="text-[#5D7768] block mb-1">Customer Repeat Rate</span>
                  <div className="font-serif font-bold text-lg text-[#142E20]">68.4%</div>
                  <span className="text-[10px] text-[#2A5C43] font-semibold">Bloom Club retention</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: SETTINGS & OPERATIONS CONFIGURATION               */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DFD8CB] shadow-sm space-y-6 animate-in fade-in">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#142E20]">
                Manager Terminal Settings & Hub Switchboard
              </h3>
              <p className="text-xs sm:text-sm text-[#5D7768]">
                Configure fulfillment rules, dark-store hub parameters, and security credentials.
              </p>
            </div>

            {/* Profile Info Card */}
            <div className="p-5 rounded-2xl border border-[#DFD8CB] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1A3828] text-white flex items-center justify-center font-bold text-lg">
                  {currentManager?.name?.charAt(0) || 'M'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#142E20]">
                    {currentManager?.name || 'Operations Lead'}
                  </h4>
                  <p className="text-xs text-[#5D7768]">{currentManager?.email || 'manager@rootandbloom.in'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-[#E5EFE7] text-[#1A3828] font-mono px-2 py-0.5 rounded font-bold">
                      Badge: {currentManager?.staffBadgeId || 'RB-MGR-8802'}
                    </span>
                    <span className="text-[10px] bg-[#DBEAFE] text-[#1E40AF] px-2 py-0.5 rounded font-semibold">
                      Role: Operations Manager
                    </span>
                  </div>
                </div>
              </div>

              <button
                id="settings-logout-btn"
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-[#6B241E] hover:bg-[#852C25] text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>

            {/* Hub Selector */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
                Active Fulfillment Hub Terminal
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  'Indiranagar Central Hub #01',
                  'Koramangala South Hub #02',
                  'Whitefield Tech Hub #03',
                ].map((hub) => (
                  <button
                    key={hub}
                    onClick={() => {
                      setActiveHub(hub);
                      showToast('Hub Switched 📍', `Terminal now monitoring ${hub}.`);
                    }}
                    className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                      activeHub === hub
                        ? 'bg-[#1A3828] text-white border-[#1A3828] shadow-sm'
                        : 'bg-[#FAF8F5] text-[#142E20] border-[#DFD8CB] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <span className="block">{hub}</span>
                    <span className={`text-[10px] block mt-0.5 ${activeHub === hub ? 'text-[#8FE388]' : 'text-[#5D7768]'}`}>
                      {activeHub === hub ? '🟢 Active & Dispatched' : 'Ready to switch'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Operational Toggles */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C43]">
                Fulfillment Rules
              </span>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border border-[#DFD8CB] bg-[#FAF8F5] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#142E20]">
                      35-Minute Quick-Commerce Cargo Dispatch
                    </h5>
                    <p className="text-[11px] text-[#5D7768]">
                      Automatically route orders to nearest eco-cargo electric delivery fleet.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={expressDeliveryActive}
                    onChange={(e) => setExpressDeliveryActive(e.target.checked)}
                    className="w-4 h-4 text-[#1A3828] rounded focus:ring-[#1A3828]"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-[#DFD8CB] bg-[#FAF8F5] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#142E20]">
                      Automated Horticulturist Route Optimization
                    </h5>
                    <p className="text-[11px] text-[#5D7768]">
                      Cluster apartment balcony maintenance appointments by pin code.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={routeOptimizationActive}
                    onChange={(e) => setRouteOptimizationActive(e.target.checked)}
                    className="w-4 h-4 text-[#1A3828] rounded focus:ring-[#1A3828]"
                  />
                </div>

                <div className="p-3.5 rounded-xl border border-[#DFD8CB] bg-[#FAF8F5] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-[#142E20]">
                      Plastic-Free Honeycomb Packaging Mandate
                    </h5>
                    <p className="text-[11px] text-[#5D7768]">
                      Enforce zero single-use plastic across live plant carton shipments.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={ecoPackagingEnforced}
                    onChange={(e) => setEcoPackagingEnforced(e.target.checked)}
                    className="w-4 h-4 text-[#1A3828] rounded focus:ring-[#1A3828]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: EDIT CUSTOMER RECORD MODAL                      */}
      {/* ======================================================== */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#DFD8CB] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE4D7] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2A5C43] tracking-wider">
                  Customer Management CRM
                </span>
                <h3 className="font-serif text-xl font-bold text-[#142E20]">
                  Edit Account Record
                </h3>
              </div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-[#7A9384] hover:text-[#142E20] p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#142E20] block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  value={customerEditForm.name}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#142E20] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={customerEditForm.phone}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#142E20] block mb-1">Bloom Loyalty Points</label>
                  <input
                    type="number"
                    value={customerEditForm.bloomPoints}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, bloomPoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#142E20] block mb-1">Primary Delivery Address</label>
                <input
                  type="text"
                  value={customerEditForm.address}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#142E20] block mb-1">Membership Tier</label>
                  <select
                    value={customerEditForm.membershipTier}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, membershipTier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] font-semibold"
                  >
                    <option value="Standard">Standard Member</option>
                    <option value="Bloom Club">Bloom Club</option>
                    <option value="Botanical VIP">Botanical VIP</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#142E20] block mb-1">Account Status</label>
                  <select
                    value={customerEditForm.accountStatus}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, accountStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="VIP Priority">VIP Priority</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#142E20] block mb-1">Internal Manager Notes</label>
                <textarea
                  rows={2}
                  value={customerEditForm.managerNotes}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, managerNotes: e.target.value })}
                  placeholder="e.g. Prefers morning delivery; requested consultation on balcony drainage."
                  className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 rounded-xl border border-[#D5CDBC] text-xs font-semibold text-[#142E20]"
              >
                Cancel
              </button>
              <button
                id="save-customer-edit-btn"
                onClick={handleSaveCustomerEdits}
                className="px-5 py-2 rounded-xl bg-[#1A3828] text-white font-bold text-xs hover:bg-[#12281D] transition-colors"
              >
                Save Record Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: REVIEW VISUALIZER DESIGN MODAL                  */}
      {/* ======================================================== */}
      {selectedDesignForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#DFD8CB] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE4D7] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2A5C43] tracking-wider">
                  AI Garden Visualizer Proposal
                </span>
                <h3 className="font-serif text-xl font-bold text-[#142E20]">
                  {selectedDesignForReview.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDesignForReview(null)}
                className="text-[#7A9384] hover:text-[#142E20] p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Before & After Visuals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedDesignForReview.beforeImage && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#5D7768] uppercase">Before</span>
                  <img
                    src={selectedDesignForReview.beforeImage}
                    alt="Before"
                    className="w-full h-36 rounded-xl object-cover border border-[#DFD8CB]"
                    onError={handleImageError}
                  />
                </div>
              )}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#2A5C43] uppercase">Proposed Design</span>
                <img
                  src={
                    selectedDesignForReview.afterImage ||
                    selectedDesignForReview.image ||
                    selectedDesignForReview.beforeImage
                  }
                  alt="After"
                  className="w-full h-36 rounded-xl object-cover border border-[#DFD8CB]"
                  onError={handleImageError}
                />
              </div>
            </div>

            {/* Status and Notes */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#142E20] block mb-1">Review Milestone Status</label>
                  <select
                    value={designReviewStatus}
                    onChange={(e) => setDesignReviewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5] font-semibold"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Consultation Scheduled">Consultation Scheduled</option>
                    <option value="Approved">Approved</option>
                    <option value="In Execution">In Execution</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#142E20] block mb-1">Customer Details</label>
                  <p className="font-semibold text-[#142E20]">
                    {selectedDesignForReview.customerName || 'Guest User'}
                  </p>
                  <p className="text-[#5D7768] text-[11px]">
                    {selectedDesignForReview.customerEmail || 'guest@rootandbloom.in'}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#142E20] block mb-1">
                  Horticulturist Feasibility Notes & Recommendations
                </label>
                <textarea
                  rows={3}
                  value={designReviewNotes}
                  onChange={(e) => setDesignReviewNotes(e.target.value)}
                  placeholder="Enter horticultural assessment (e.g. verified balcony load capacity and morning sunlight levels; recommended 3 terracotta pots)."
                  className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedDesignForReview(null)}
                className="px-4 py-2 rounded-xl border border-[#D5CDBC] text-xs font-semibold text-[#142E20]"
              >
                Close
              </button>
              <button
                id="save-design-review-btn"
                onClick={handleSaveDesignReview}
                className="px-5 py-2 rounded-xl bg-[#1A3828] text-white font-bold text-xs hover:bg-[#12281D] transition-colors"
              >
                Save Review & Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerPortal;
