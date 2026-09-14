export type Role = 'customer' | 'manager';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  zone: string;
  address: string;
};

export type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
};

export type Gardener = {
  id: string;
  name: string;
  specialization: string;
  zone: string;
  rating: number;
  availability: boolean;
};

export type Booking = {
  id: string;
  customerId: string;
  serviceId: string;
  gardenerId: string;
  date: string;
  zone: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  notes: string;
  total: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  emoji: string;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'Paid' | 'Processing' | 'Delivered';
  createdAt: string;
};

export type InventoryRecord = {
  productId: string;
  stock: number;
  reorderPoint: number;
  lastUpdated: string;
};

export type BusinessData = {
  users: User[];
  services: Service[];
  gardeners: Gardener[];
  bookings: Booking[];
  products: Product[];
  orders: Order[];
  inventory: InventoryRecord[];
};
