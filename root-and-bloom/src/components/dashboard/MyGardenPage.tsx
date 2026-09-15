import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flower2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplets,
  Plus,
  Trash2,
  Package,
  Wrench,
  Sparkles,
  Bookmark,
  Sun,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { MaintenanceReminder, UserPlant } from '../../types';
import { User, LogOut } from 'lucide-react';

export const MyGardenPage: React.FC = () => {
  const {
    reminders,
    addReminder,
    toggleReminder,
    deleteReminder,
    userPlants,
    addUserPlant,
    waterPlant,
    orders,
    bookings,
    savedDesigns,
    setPage,
    setIsBookingModalOpen,
    currentCustomer,
    openCustomerAuth,
    customerLogout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reminders' | 'plants' | 'orders' | 'bookings' | 'designs'>('reminders');
  
  // Add Reminder Modal/Form state
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [newPlantName, setNewPlantName] = useState('Peace Lily');
  const [newTaskType, setNewTaskType] = useState<MaintenanceReminder['taskType']>('Watering');
  const [newDueDate, setNewDueDate] = useState('Tomorrow');
  const [newDueTime, setNewDueTime] = useState('08:00 AM');
  const [newNotes, setNewNotes] = useState('Drench until water drains from base.');

  // Add Plant Modal state
  const [isAddPlantOpen, setIsAddPlantOpen] = useState(false);
  const [plantNickName, setPlantNickName] = useState('Monstera Deliciosa');
  const [plantSpecies, setPlantSpecies] = useState('Monstera deliciosa');
  const [plantLocation, setPlantLocation] = useState('Living Room Window');
  const [plantHealth, setPlantHealth] = useState<'Thriving' | 'Healthy' | 'Needs Attention'>('Thriving');
  const [plantImage, setPlantImage] = useState('https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80');

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    addReminder({
      plantName: newPlantName,
      taskType: newTaskType,
      dueDate: newDueDate,
      dueTime: newDueTime,
      notes: newNotes,
    });
    setIsAddReminderOpen(false);
  };

  const handleCreatePlant = (e: React.FormEvent) => {
    e.preventDefault();
    addUserPlant({
      name: plantNickName,
      species: plantSpecies,
      location: plantLocation,
      healthStatus: plantHealth,
      lastWateredDate: new Date().toISOString().split('T')[0],
      acquiredDate: 'Recent',
      image: plantImage,
      nextAction: 'Hydration check in 3 days',
    });
    setIsAddPlantOpen(false);
  };

  const pendingReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  return (
    <div className="py-8 md:py-12 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EFE7] text-[#1A3828] mb-2">
              <Flower2 className="w-3.5 h-3.5 text-[#2A5C43]" />
              <span>Personal Botanical Sanctuary</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142E20]">
              My Garden Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#556F60] mt-1">
              Track watering rhythms, log plant health, review 35-min orders, and manage horticulturist visits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddReminderOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#DFD8CB] hover:border-[#2A5C43] text-xs font-semibold text-[#183926] flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4 text-[#2A5C43]" />
              <span>New Care Reminder</span>
            </button>

            <button
              onClick={() => setIsAddPlantOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#1A3828] hover:bg-[#12281D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-[#8FE388]" />
              <span>Add Plant</span>
            </button>
          </div>
        </div>

        {/* Customer Account Strip */}
        {currentCustomer ? (
          <div className="bg-white rounded-2xl border border-[#DFD8CB] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#1A3828] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {currentCustomer.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-lg text-[#163323]">{currentCustomer.name}</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5EFE7] text-[#1A3828] border border-[#C5DDCB]">
                    {currentCustomer.membershipTier} Member
                  </span>
                </div>
                <p className="text-xs text-[#5D7667] mt-0.5">
                  {currentCustomer.email} • {currentCustomer.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#FAF8F5] border border-[#DFD8CB] px-3.5 py-2 rounded-xl text-center">
                <span className="block text-[10px] uppercase font-bold text-[#567262] tracking-wider">Bloom Points</span>
                <span className="font-serif font-bold text-base text-[#1A3828]">{currentCustomer.bloomPoints}</span>
              </div>

              <button
                id="garden-edit-profile-btn"
                onClick={() => openCustomerAuth('profile')}
                className="px-3.5 py-2 rounded-xl border border-[#DFD8CB] hover:bg-[#FAF8F5] text-xs font-semibold text-[#183926] transition-colors"
              >
                Edit Account
              </button>

              <button
                id="garden-customer-logout-btn"
                onClick={customerLogout}
                className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs transition-colors"
                title="Log Out of Customer Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-[#1A3828] to-[#2B523B] rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8FE388]" />
                <h3 className="font-serif font-bold text-lg text-white">Sync Your Garden Sanctuary</h3>
              </div>
              <p className="text-xs text-[#C2DBC9] mt-1 max-w-xl">
                Sign in or register to securely sync plant care reminders, express delivery orders, and horticulturist visits across your phones and laptops.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openCustomerAuth('signin')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openCustomerAuth('signup')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#8FE388] hover:bg-[#A7F3D0] text-[#0F281B] shadow-sm transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation Strip */}
        <div className="border-b border-[#E3DCCF] flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'reminders', label: 'Care Schedule', count: pendingReminders.length, icon: Calendar },
            { id: 'plants', label: 'My Plants', count: userPlants.length, icon: Flower2 },
            { id: 'orders', label: 'Orders & Tracking', count: orders.length, icon: Package },
            { id: 'bookings', label: 'Service Visits', count: bookings.length, icon: Wrench },
            { id: 'designs', label: 'Saved Designs', count: savedDesigns.length, icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-2 border-b-2 font-semibold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all ${
                  isActive
                    ? 'border-[#1A3828] text-[#1A3828]'
                    : 'border-transparent text-[#657E70] hover:text-[#1A3828]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#1A3828] text-white' : 'bg-[#EAE4D6] text-[#486353]'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Reminders & Schedule */}
        {activeTab === 'reminders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#142E20]">
                  Scheduled Maintenance Tasks
                </h3>
                <p className="text-xs text-[#5E7869]">
                  Never let a plant dehydrate or miss a seasonal bio-fertilizer dose.
                </p>
              </div>
            </div>

            {/* Pending Reminders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingReminders.map((rem) => (
                <div
                  key={rem.id}
                  className="bg-white p-5 rounded-2xl border border-[#DFD8CB] shadow-2xs flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className="mt-0.5 w-6 h-6 rounded-lg border-2 border-[#8EA68B] hover:bg-[#EAF2EC] flex items-center justify-center text-[#2A5C43] transition-colors"
                      title="Mark task completed"
                    >
                      {rem.isCompleted && <CheckCircle2 className="w-4 h-4 fill-[#2A5C43] text-white" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                          rem.taskType === 'Watering' ? 'bg-[#E6F0FA] text-[#2C6CB0]' :
                          rem.taskType === 'Fertilizer' ? 'bg-[#EBF7EE] text-[#256B3A]' :
                          rem.taskType === 'Pest Spray' ? 'bg-[#FCEDE8] text-[#B04C2C]' :
                          'bg-[#F5EFE6] text-[#785E3B]'
                        }`}>
                          {rem.taskType}
                        </span>
                        <span className="text-xs text-[#6B8577] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rem.nextDueDate || rem.dueDate || 'Upcoming'} ({rem.timeOfDay || rem.dueTime || 'Anytime'})
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-[#142E20] mt-1.5">
                        {rem.plantName}
                      </h4>
                      {rem.notes && (
                        <p className="text-xs text-[#577061] mt-0.5">
                          {rem.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1.5 text-[#9CB1A3] hover:text-[#B8402D] rounded-lg"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Completed Tasks Toggle */}
            {completedReminders.length > 0 && (
              <div className="pt-4 border-t border-[#EAE4D7] space-y-3">
                <span className="text-xs font-bold uppercase text-[#698475]">
                  Completed Tasks ({completedReminders.length})
                </span>
                <div className="space-y-2 opacity-60">
                  {completedReminders.map((rem) => (
                    <div
                      key={rem.id}
                      className="bg-[#FAF8F5] p-3 rounded-xl border border-[#DFD8CB] flex items-center justify-between text-xs line-through text-[#698475]"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2A5C43]" />
                        <span>{rem.taskType}: {rem.plantName}</span>
                      </div>
                      <button
                        onClick={() => toggleReminder(rem.id)}
                        className="text-xs underline hover:text-[#142E20] not-italic"
                      >
                        Re-open
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Plant Collection */}
        {activeTab === 'plants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#142E20]">
                  Monitored Houseplants & Specimen Trees
                </h3>
                <p className="text-xs text-[#5E7869]">
                  Click 💧 Hydrate to log watering and reset your care cycle.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="bg-white rounded-3xl border border-[#DFD8CB] shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-[#F2ECE1]">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#1A3828]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {plant.location}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/95 text-[#2A5C43] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {plant.healthStatus}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#142E20]">
                        {plant.name}
                      </h4>
                      <p className="text-xs italic text-[#637C6E]">{plant.species}</p>

                      <div className="mt-3 pt-3 border-t border-[#F2ECE1] space-y-1.5 text-xs text-[#50695B]">
                        <div className="flex justify-between">
                          <span>Last Hydrated:</span>
                          <strong className="text-[#1A3828]">{plant.lastWateredDate}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Action:</span>
                          <strong className="text-[#2A5C43]">{plant.nextAction}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-[#F2ECE1] flex items-center gap-2">
                      <button
                        onClick={() => waterPlant(plant.id)}
                        className="flex-1 bg-[#E8F3FA] hover:bg-[#D4E8F5] text-[#2C6CB0] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        <span>Hydrate Today</span>
                      </button>
                      <button
                        onClick={() => setPage('plant-ai')}
                        className="p-2 rounded-xl bg-[#FAF8F5] border border-[#DFD8CB] text-xs text-[#2A5C43] hover:bg-[#EAE4D6]"
                        title="Diagnose with Plant AI"
                      >
                        AI Check
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Orders & Tracking */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#142E20]">
                Quick-Commerce Orders & Live Delivery
              </h3>
              <p className="text-xs text-[#5E7869]">
                Dispatched via zero-emission electric cargo vehicles.
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-[#DFD8CB] shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE1]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#142E20]">{order.id}</span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5EFE7] text-[#1A3828]">
                          {order.status}
                        </span>
                      </div>
                      <span className="text-xs text-[#637C6E]">
                        Tracking: <strong className="text-[#2A5C43]">{order.trackingNumber}</strong> • {order.estimatedDeliveryTime}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-lg text-[#142E20]">₹{order.total}</span>
                      <span className="text-xs text-[#698375] block">{order.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover bg-white"
                        />
                        <div className="min-w-0">
                          <h6 className="font-semibold text-xs text-[#132A1D] truncate">{item.productName}</h6>
                          <span className="text-[11px] text-[#637C6E]">Qty: {item.quantity} • ₹{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address Pill */}
                  <div className="text-xs text-[#526B5C] bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE3D6] flex items-center justify-between">
                    <span>Delivering to: <strong>{order.address}</strong></span>
                    <span className="text-[#2A5C43] font-semibold">Recipient: {order.customerName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Service Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#142E20]">
                  Horticulturist Appointments & Clinic Visits
                </h3>
                <p className="text-xs text-[#5E7869]">
                  Verified specialists equipped with organic feeds and testing kits.
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-4 py-2 bg-[#1A3828] text-white rounded-xl text-xs font-semibold"
              >
                + Book New Visit
              </button>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-6 border border-[#DFD8CB] shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#142E20]">{booking.serviceName}</span>
                        <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#E5EFE7] text-[#1A3828]">
                          {booking.status}
                        </span>
                      </div>
                      <span className="text-xs text-[#637C6E]">
                        Reference: {booking.id} • {booking.propertyType} Plan
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-serif font-bold text-lg text-[#142E20]">₹{booking.estimatedPrice}</span>
                      <span className="text-[11px] text-[#2A5C43] block font-medium">Pay after service</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D6] text-xs space-y-1 text-[#4F6859]">
                    <div className="flex justify-between">
                      <span>Scheduled Slot:</span>
                      <strong className="text-[#132A1D]">{booking.scheduledDate} ({booking.scheduledTime})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Assigned Specialist:</span>
                      <strong className="text-[#2A5C43]">{booking.assignedStaff || 'Assigning nearest specialist'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Site Location:</span>
                      <span className="truncate max-w-sm text-right">{booking.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Saved Designs */}
        {activeTab === 'designs' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#142E20]">
                Saved Visualizer Blueprints
              </h3>
              <p className="text-xs text-[#5E7869]">
                Concepts generated in the AI Garden Visualizer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(savedDesigns || []).map((design) => (
                <div
                  key={design.id}
                  className="bg-white rounded-3xl border border-[#DFD8CB] shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-48 bg-[#F2ECE1] relative">
                    <img
                      src={design.image || design.afterImage || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#1A3828]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {design.style}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#142E20]">{design.title}</h4>
                      <p className="text-xs text-[#5B7365] mt-1">
                        {design.spaceType}
                        {design.itemsCount ? ` • ${design.itemsCount} curated items` : design.keyPlants ? ` • ${design.keyPlants.length} plants` : ''}
                      </p>
                      {design.keyPlants && design.keyPlants.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {design.keyPlants.slice(0, 3).map((plant, pIdx) => (
                            <span key={pIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#2A5C43] border border-[#E0D8CB]">
                              {plant}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="pt-3 mt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#142E20]">
                        {design.estimatedCost ? `Est. ₹${design.estimatedCost.toLocaleString('en-IN')}` : 'Custom Estimate'}
                      </span>
                      <button
                        onClick={() => setPage('visualizer')}
                        className="text-xs font-semibold text-[#2A5C43] hover:underline"
                      >
                        Open Studio →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Reminder Modal */}
        {isAddReminderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FAF8F5] rounded-3xl p-6 max-w-md w-full border border-[#DED7C8] shadow-2xl relative">
              <h3 className="font-serif text-xl font-bold text-[#142E20] mb-3">Add Botanical Care Reminder</h3>
              <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#293E31] mb-1">Plant Name</label>
                  <input
                    type="text"
                    required
                    value={newPlantName}
                    onChange={(e) => setNewPlantName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#293E31] mb-1">Task Category</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white font-semibold"
                  >
                    <option value="Watering">💧 Watering</option>
                    <option value="Fertilizer">🌾 Organic Fertilizer</option>
                    <option value="Pest Spray">🐛 Neem Pest Prevention</option>
                    <option value="Repotting">🪴 Soil Aeration & Repotting</option>
                    <option value="Pruning">✂️ Pruning & Deadheading</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#293E31] mb-1">Due Day</label>
                    <input
                      type="text"
                      required
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      placeholder="e.g. Tomorrow or Wednesday"
                      className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#293E31] mb-1">Time</label>
                    <input
                      type="text"
                      required
                      value={newDueTime}
                      onChange={(e) => setNewDueTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-[#293E31] mb-1">Care Notes</label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddReminderOpen(false)}
                    className="px-4 py-2 text-[#567061]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1A3828] text-white font-bold rounded-xl"
                  >
                    Set Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Plant Modal */}
        {isAddPlantOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-[#FAF8F5] rounded-3xl p-6 max-w-md w-full border border-[#DED7C8] shadow-2xl relative">
              <h3 className="font-serif text-xl font-bold text-[#142E20] mb-3">Add Plant to Sanctuary</h3>
              <form onSubmit={handleCreatePlant} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#293E31] mb-1">Plant Nickname / Variety</label>
                  <input
                    type="text"
                    required
                    value={plantNickName}
                    onChange={(e) => setPlantNickName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#293E31] mb-1">Botanical Species</label>
                  <input
                    type="text"
                    value={plantSpecies}
                    onChange={(e) => setPlantSpecies(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#293E31] mb-1">Location in Home</label>
                  <input
                    type="text"
                    required
                    value={plantLocation}
                    onChange={(e) => setPlantLocation(e.target.value)}
                    placeholder="e.g. East Balcony or Dining Credenza"
                    className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#293E31] mb-1">Current Health Status</label>
                  <select
                    value={plantHealth}
                    onChange={(e) => setPlantHealth(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#D5CDBC] bg-white font-semibold"
                  >
                    <option value="Thriving">🌿 Thriving & Flourishing</option>
                    <option value="Healthy">🌱 Healthy & Stable</option>
                    <option value="Needs Attention">⚠️ Needs Attention / Soil Aeration</option>
                  </select>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPlantOpen(false)}
                    className="px-4 py-2 text-[#567061]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1A3828] text-white font-bold rounded-xl"
                  >
                    Save Plant
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
