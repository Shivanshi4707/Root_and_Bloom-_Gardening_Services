export type PageView =
  | 'home'
  | 'services'
  | 'shop'
  | 'visualizer'
  | 'plant-ai'
  | 'my-garden'
  | 'orders'
  | 'bookings'
  | 'landscaping'
  | 'faq'
  | 'contact';

export type UserRole = 'customer' | 'manager';

export type CustomerAuthMode = 'signin' | 'signup' | 'forgot' | 'reset' | 'profile';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  membershipTier?: string;
  avatar?: string;
  loyaltyPoints?: number;
  bloomPoints?: number;
  ordersCount?: number;
  bookingsCount?: number;
}

export interface ManagerUser {
  id: string;
  name: string;
  email: string;
  hub: string;
  role: string;
  loginTime: string;
  staffBadgeId: string;
  token?: string;
}

export interface CustomerManagedRecord extends CustomerUser {
  totalSpent?: number;
  activeOrders?: number;
  activeBookings?: number;
  lastActive?: string;
  totalOrders?: number;
  totalBookings?: number;
  accountStatus?: 'Active' | 'VIP' | 'New' | string;
  managerNotes?: string;
}

export type ProductCategory =
  | 'all'
  | 'plants'
  | 'indoor'
  | 'outdoor'
  | 'seeds'
  | 'pots'
  | 'tools'
  | 'fertilizers'
  | 'pest-control'
  | 'watering'
  | 'decor'
  | 'soil'
  | 'seasonal';

export interface Product {
  id: string;
  name: string;
  botanicalName?: string;
  category: ProductCategory;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  shortDescription: string;
  inStock: boolean;
  stockCount: number;
  reorderLevel: number;
  isBestseller?: boolean;
  isSeasonal?: boolean;
  careDetails?: {
    sunlight: 'Low' | 'Bright Indirect' | 'Full Sun' | 'Partial Shade';
    watering: 'Every 2-3 days' | 'Weekly' | 'Bi-weekly' | 'When dry';
    difficulty: 'Easy' | 'Moderate' | 'Advanced';
    petFriendly: boolean;
    size: 'Small (4-6")' | 'Medium (8-10")' | 'Large (12"+)';
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  startingPrice: number;
  priceUnit: string;
  duration: string;
  rating: number;
  reviewCount: number;
  image: string;
  features: string[];
  popular?: boolean;
  frequency?: string;
  howItWorks?: string[];
  slug?: string;
}

export type BookingFrequency = 'one-time' | 'weekly' | 'bi-weekly' | 'monthly';

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  propertyType: 'Apartment Balcony' | 'Independent Villa' | 'Terrace Garden' | 'Office / Commercial' | 'Cafe / Hotel' | 'Housing Society';
  gardenAreaSqFt: number;
  frequency: BookingFrequency;
  scheduledDate: string;
  scheduledTime: string;
  estimatedPrice: number;
  assignedStaff: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

export interface OrderItemSummary {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItemSummary[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'Cash on Delivery';
  status: 'Order Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  estimatedDeliveryTime: string;
  trackingNumber: string;
  createdAt: string;
}

export interface LandscapingLead {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  location: string;
  propertyType: string;
  gardenAreaSqFt: number;
  budgetRange: string;
  preferredStyle: string;
  requirements: string;
  photoUrl?: string;
  status: 'Quotation Sent' | 'Under Review' | 'Site Visit Booked' | 'Approved';
  estimatedCost: number;
  createdAt: string;
}

export interface MaintenanceReminder {
  id: string;
  plantName: string;
  taskType: 'Watering' | 'Fertilizing' | 'Pruning' | 'Repotting' | 'Pest Inspection' | 'Service Visit' | 'Fertilizer' | 'Pest Spray' | string;
  frequencyDays?: number;
  nextDueDate?: string;
  dueDate?: string;
  timeOfDay?: string;
  dueTime?: string;
  isCompleted: boolean;
  notes?: string;
}

export interface UserPlant {
  id: string;
  name: string;
  species: string;
  adoptedDate?: string;
  acquiredDate?: string;
  wateringFrequencyDays?: number;
  lastWateredDate: string;
  location: string;
  healthStatus: 'Thriving' | 'Needs Water' | 'Check Foliage' | 'Healthy' | 'Needs Attention' | string;
  image: string;
  nextAction?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface SavedDesign {
  id: string;
  title: string;
  style: string;
  spaceType: string;
  beforeImage?: string;
  afterImage?: string;
  image?: string;
  keyPlants?: string[];
  itemsCount?: number;
  estimatedCost?: number;
  savedAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  status?: 'Pending Review' | 'Consultation Scheduled' | 'Approved' | 'In Execution' | string;
  designerNotes?: string;
}
