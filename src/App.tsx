import { useEffect, useMemo, useState } from 'react';
import { AppShell } from './components/AppShell';
import { CustomerDashboard } from './modules/customer/CustomerDashboard';
import { ManagerDashboard } from './modules/manager/ManagerDashboard';
import { findBestGardener, loadData } from './utils/business';
import type { Booking, BusinessData, OrderItem, Product, Role } from './types/business';

export default function App() {
  const [data, setData] = useState<BusinessData>(() => loadData());
  const [selectedRole, setSelectedRole] = useState<Role>('customer');
  const [selectedUserId, setSelectedUserId] = useState('u1');
  const [serviceId, setServiceId] = useState('s1');
  const [selectedBookingDate, setSelectedBookingDate] = useState('2026-09-10');
  const [selectedZone, setSelectedZone] = useState('Koramangala');
  const [bookingNotes, setBookingNotes] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem('root-bloom-cia3-data', JSON.stringify(data));
  }, [data]);

  const loggedUser = data.users.find((user) => user.id === selectedUserId) ?? data.users[0];

  const customerBookings = useMemo(
    () => data.bookings.filter((booking) => booking.customerId === loggedUser.id),
    [data.bookings, loggedUser.id],
  );

  const customerOrders = useMemo(
    () => data.orders.filter((order) => order.customerId === loggedUser.id),
    [data.orders, loggedUser.id],
  );

  const managerSummary = useMemo(() => {
    const totalRevenue = data.bookings.reduce((sum, booking) => sum + booking.total, 0);
    const pending = data.bookings.filter((booking) => booking.status === 'Pending').length;
    const avgRating = data.gardeners.reduce((sum, g) => sum + g.rating, 0) / data.gardeners.length;
    return { totalRevenue, pending, avgRating: Number(avgRating.toFixed(2)) };
  }, [data]);

  const handleBookService = (event: React.FormEvent) => {
    event.preventDefault();
    const selectedService = data.services.find((service) => service.id === serviceId);
    if (!selectedService) return;

    const assignedGardener = findBestGardener(selectedService, selectedZone, data.gardeners, data.bookings);
    if (!assignedGardener) {
      alert('No available gardener matches the selected service. Please choose another date or service.');
      return;
    }

    const booking: Booking = {
      id: `BK-${Date.now()}`,
      customerId: loggedUser.id,
      serviceId: selectedService.id,
      gardenerId: assignedGardener.id,
      date: selectedBookingDate,
      zone: selectedZone,
      status: 'Confirmed',
      notes: bookingNotes || 'Customer requested standard visit',
      total: selectedService.price,
    };

    setData((current) => ({
      ...current,
      bookings: [booking, ...current.bookings],
    }));

    setBookingNotes('');
    setServiceId(selectedService.id);
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setData((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking,
      ),
    }));
  };

  const deleteBooking = (bookingId: string) => {
    setData((current) => ({
      ...current,
      bookings: current.bookings.filter((booking) => booking.id !== bookingId),
    }));
  };

  const addToCart = (productId: string) => {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  };

  const checkoutCart = () => {
    const items = Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = data.products.find((item) => item.id === productId);
        if (!product || quantity <= 0) return null;
        return { productId, quantity, unitPrice: product.price };
      })
      .filter(Boolean) as OrderItem[];

    if (items.length === 0) return;

    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const order = {
      id: `OR-${Date.now()}`,
      customerId: loggedUser.id,
      items,
      total,
      status: 'Processing' as const,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setData((current) => ({
      ...current,
      orders: [order, ...current.orders],
      products: current.products.map((product) => {
        const item = items.find((entry) => entry.productId === product.id);
        return item ? { ...product, stock: product.stock - item.quantity } : product;
      }),
      inventory: current.inventory.map((record) => {
        const item = items.find((entry) => entry.productId === record.productId);
        return item ? { ...record, stock: record.stock - item.quantity, lastUpdated: new Date().toISOString().slice(0, 10) } : record;
      }),
    }));

    setCart({});
  };

  const updateInventory = (productId: string, newStock: number) => {
    setData((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product,
      ),
      inventory: current.inventory.map((record) =>
        record.productId === productId ? { ...record, stock: newStock, lastUpdated: new Date().toISOString().slice(0, 10) } : record,
      ),
    }));
  };

  const addNewProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const category = String(form.get('category') ?? 'Plants');
    const price = Number(form.get('price') ?? 0);
    const stock = Number(form.get('stock') ?? 0);
    const reorderPoint = Number(form.get('reorderPoint') ?? 5);

    if (!name || price <= 0) return;

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name,
      category,
      price,
      stock,
      reorderPoint,
      emoji: '🌱',
    };

    setData((current) => ({
      ...current,
      products: [newProduct, ...current.products],
      inventory: [{ productId: newProduct.id, stock, reorderPoint, lastUpdated: new Date().toISOString().slice(0, 10) }, ...current.inventory],
    }));
    event.currentTarget.reset();
  };

  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = data.products.find((item) => item.id === productId);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean) as Array<{ product: Product; quantity: number }>;

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AppShell
      selectedRole={selectedRole}
      selectedUserId={selectedUserId}
      users={data.users}
      loggedUser={loggedUser}
      onRoleChange={setSelectedRole}
      onUserChange={setSelectedUserId}
    >
      {selectedRole === 'customer' ? (
        <CustomerDashboard
          data={data}
          loggedUser={loggedUser}
          customerBookings={customerBookings}
          customerOrders={customerOrders}
          serviceId={serviceId}
          selectedBookingDate={selectedBookingDate}
          selectedZone={selectedZone}
          bookingNotes={bookingNotes}
          cartItems={cartItems}
          cartTotal={cartTotal}
          onServiceChange={setServiceId}
          onDateChange={setSelectedBookingDate}
          onZoneChange={setSelectedZone}
          onNotesChange={setBookingNotes}
          onBookService={handleBookService}
          onDeleteBooking={deleteBooking}
          onAddToCart={addToCart}
          onCheckoutCart={checkoutCart}
        />
      ) : (
        <ManagerDashboard
          data={data}
          managerSummary={managerSummary}
          onUpdateBookingStatus={updateBookingStatus}
          onDeleteBooking={deleteBooking}
          onUpdateInventory={updateInventory}
          onAddNewProduct={addNewProduct}
        />
      )}
    </AppShell>
  );
}
