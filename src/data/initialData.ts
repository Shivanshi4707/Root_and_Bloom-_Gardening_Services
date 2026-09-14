import type { BusinessData } from '../types/business';

export const STORAGE_KEY = 'root-bloom-cia3-data';

export const initialData: BusinessData = {
  users: [
    { id: 'u1', name: 'Aarav Mehta', email: 'aarav@example.com', role: 'customer', zone: 'Koramangala', address: '12, 4th Block' },
    { id: 'u2', name: 'Nisha Rao', email: 'nisha@example.com', role: 'customer', zone: 'Whitefield', address: '77, Brigade Street' },
    { id: 'm1', name: 'Manager Priya', email: 'manager@rootandbloom.co', role: 'manager', zone: 'Bengaluru', address: 'HQ' },
  ],
  services: [
    { id: 's1', name: 'Lawn Maintenance', category: 'Outdoor Care', price: 899, duration: 120 },
    { id: 's2', name: 'Landscape Design', category: 'Design', price: 2199, duration: 180 },
    { id: 's3', name: 'Pest Control', category: 'Plant Health', price: 1299, duration: 90 },
    { id: 's4', name: 'Seasonal Pruning', category: 'Maintenance', price: 1099, duration: 100 },
  ],
  gardeners: [
    { id: 'g1', name: 'Ravi Kumar', specialization: 'Lawn Maintenance', zone: 'Koramangala', rating: 4.9, availability: true },
    { id: 'g2', name: 'Meera Iyer', specialization: 'Landscape Design', zone: 'Whitefield', rating: 4.8, availability: true },
    { id: 'g3', name: 'Sandeep Das', specialization: 'Pest Control', zone: 'Indiranagar', rating: 4.7, availability: true },
    { id: 'g4', name: 'Harini Nair', specialization: 'Seasonal Pruning', zone: 'Koramangala', rating: 4.6, availability: true },
    { id: 'g5', name: 'Karthik Roy', specialization: 'Landscape Design', zone: 'Koramangala', rating: 4.5, availability: true },
  ],
  bookings: [
    { id: 'BK-1001', customerId: 'u1', serviceId: 's1', gardenerId: 'g1', date: '2026-09-05', zone: 'Koramangala', status: 'Confirmed', notes: 'Front lawn trimming', total: 899 },
    { id: 'BK-1002', customerId: 'u2', serviceId: 's2', gardenerId: 'g2', date: '2026-09-07', zone: 'Whitefield', status: 'Pending', notes: 'Terrace redesign', total: 2199 },
  ],
  products: [
    { id: 'p1', name: 'Snake Plant', category: 'Plants', price: 449, stock: 12, reorderPoint: 5, emoji: '🌿' },
    { id: 'p2', name: 'Organic Compost', category: 'Soil & Fertilizer', price: 299, stock: 18, reorderPoint: 8, emoji: '🌾' },
    { id: 'p3', name: 'Pruning Shears', category: 'Tools', price: 399, stock: 7, reorderPoint: 5, emoji: '✂️' },
    { id: 'p4', name: 'Ceramic Planter', category: 'Pots', price: 799, stock: 4, reorderPoint: 6, emoji: '🏺' },
    { id: 'p5', name: 'Solar Garden Lights', category: 'Decor', price: 899, stock: 10, reorderPoint: 6, emoji: '✨' },
  ],
  orders: [
    { id: 'OR-2001', customerId: 'u1', items: [{ productId: 'p1', quantity: 2, unitPrice: 449 }], total: 898, status: 'Delivered', createdAt: '2026-08-15' },
    { id: 'OR-2002', customerId: 'u2', items: [{ productId: 'p2', quantity: 1, unitPrice: 299 }], total: 299, status: 'Processing', createdAt: '2026-08-20' },
  ],
  inventory: [
    { productId: 'p1', stock: 12, reorderPoint: 5, lastUpdated: '2026-08-24' },
    { productId: 'p2', stock: 18, reorderPoint: 8, lastUpdated: '2026-08-24' },
    { productId: 'p3', stock: 7, reorderPoint: 5, lastUpdated: '2026-08-24' },
    { productId: 'p4', stock: 4, reorderPoint: 6, lastUpdated: '2026-08-24' },
    { productId: 'p5', stock: 10, reorderPoint: 6, lastUpdated: '2026-08-24' },
  ],
};
