import type { FormEvent } from 'react';
import type { Booking, BusinessData, Order, Product, User } from '../../types/business';

type CartItem = {
  product: Product;
  quantity: number;
};

type CustomerDashboardProps = {
  data: BusinessData;
  loggedUser: User;
  customerBookings: Booking[];
  customerOrders: Order[];
  serviceId: string;
  selectedBookingDate: string;
  selectedZone: string;
  bookingNotes: string;
  cartItems: CartItem[];
  cartTotal: number;
  onServiceChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onZoneChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onBookService: (event: FormEvent) => void;
  onDeleteBooking: (bookingId: string) => void;
  onAddToCart: (productId: string) => void;
  onCheckoutCart: () => void;
};

export function CustomerDashboard({
  data,
  loggedUser,
  customerBookings,
  customerOrders,
  serviceId,
  selectedBookingDate,
  selectedZone,
  bookingNotes,
  cartItems,
  cartTotal,
  onServiceChange,
  onDateChange,
  onZoneChange,
  onNotesChange,
  onBookService,
  onDeleteBooking,
  onAddToCart,
  onCheckoutCart,
}: CustomerDashboardProps) {
  return (
    <main className="customer-layout">
      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">Customer Dashboard</p>
          <h2>Book services and shop essentials</h2>
        </div>
        <div className="hero-stats">
          <div><span>Bookings</span><strong>{customerBookings.length}</strong></div>
          <div><span>Orders</span><strong>{customerOrders.length}</strong></div>
          <div><span>Zone</span><strong>{loggedUser.zone}</strong></div>
        </div>
      </section>

      <section className="panel booking-panel">
        <h3>Service Booking</h3>
        <form onSubmit={onBookService} className="booking-form">
          <label>
            Service
            <select value={serviceId} onChange={(event) => onServiceChange(event.target.value)}>
              {data.services.map((service) => (
                <option key={service.id} value={service.id}>{service.name} - ₹{service.price}</option>
              ))}
            </select>
          </label>
          <label>
            Preferred date
            <input type="date" value={selectedBookingDate} onChange={(event) => onDateChange(event.target.value)} />
          </label>
          <label>
            Service zone
            <select value={selectedZone} onChange={(event) => onZoneChange(event.target.value)}>
              {['Koramangala', 'Whitefield', 'Indiranagar', 'HSR Layout', 'Banaswadi'].map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </label>
          <label className="full-width">
            Notes
            <textarea value={bookingNotes} onChange={(event) => onNotesChange(event.target.value)} placeholder="Need watering, pruning or soil treatment?" />
          </label>
          <button type="submit" className="primary-btn">Book Service</button>
        </form>
      </section>

      <section className="panel shopping-panel">
        <h3>Marketplace</h3>
        <div className="product-grid">
          {data.products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-emoji">{product.emoji}</div>
              <h4>{product.name}</h4>
              <p>{product.category}</p>
              <div className="product-row">
                <span>₹{product.price}</span>
                <button onClick={() => onAddToCart(product.id)}>Add</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-box">
          <h4>Cart Summary</h4>
          {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
            <>
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="cart-row">
                  <span>{product.name} × {quantity}</span>
                  <strong>₹{product.price * quantity}</strong>
                </div>
              ))}
              <div className="cart-total">
                <span>Total</span>
                <strong>₹{cartTotal}</strong>
              </div>
              <button onClick={onCheckoutCart} className="primary-btn">Checkout</button>
            </>
          )}
        </div>
      </section>

      <section className="panel list-panel">
        <h3>My Bookings</h3>
        {customerBookings.length === 0 ? <p>No bookings yet.</p> : (
          <div className="list-stack">
            {customerBookings.map((booking) => {
              const service = data.services.find((item) => item.id === booking.serviceId);
              const gardener = data.gardeners.find((item) => item.id === booking.gardenerId);
              return (
                <div key={booking.id} className="list-item">
                  <div>
                    <strong>{service?.name}</strong>
                    <p>{booking.date} • {booking.zone}</p>
                    <small>Assigned to {gardener?.name}</small>
                  </div>
                  <div className="status-actions">
                    <span className={`badge ${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
                    <button onClick={() => onDeleteBooking(booking.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel list-panel">
        <h3>Order History</h3>
        {customerOrders.length === 0 ? <p>No orders yet.</p> : (
          <div className="list-stack">
            {customerOrders.map((order) => (
              <div key={order.id} className="list-item">
                <div>
                  <strong>{order.id}</strong>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="status-actions">
                  <span className="badge paid">{order.status}</span>
                  <strong>₹{order.total}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
