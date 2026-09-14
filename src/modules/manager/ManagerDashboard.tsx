import type { FormEvent } from 'react';
import type { BusinessData, Booking } from '../../types/business';
import { recommendReorder } from '../../utils/business';

type ManagerDashboardProps = {
  data: BusinessData;
  managerSummary: {
    totalRevenue: number;
    pending: number;
    avgRating: number;
  };
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onDeleteBooking: (bookingId: string) => void;
  onUpdateInventory: (productId: string, newStock: number) => void;
  onAddNewProduct: (event: FormEvent<HTMLFormElement>) => void;
};

export function ManagerDashboard({
  data,
  managerSummary,
  onUpdateBookingStatus,
  onDeleteBooking,
  onUpdateInventory,
  onAddNewProduct,
}: ManagerDashboardProps) {
  return (
    <main className="manager-layout">
      <section className="panel kpi-panel">
        <div>
          <p className="eyebrow">Manager Dashboard</p>
          <h2>Operations at a glance</h2>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card">
            <span>Total revenue</span>
            <strong>₹{managerSummary.totalRevenue}</strong>
          </div>
          <div className="kpi-card">
            <span>Pending bookings</span>
            <strong>{managerSummary.pending}</strong>
          </div>
          <div className="kpi-card">
            <span>Avg. gardener rating</span>
            <strong>{managerSummary.avgRating}/5</strong>
          </div>
        </div>
      </section>

      <section className="panel manager-panel">
        <h3>Booking Management</h3>
        <div className="list-stack">
          {data.bookings.map((booking) => {
            const customer = data.users.find((u) => u.id === booking.customerId);
            const service = data.services.find((s) => s.id === booking.serviceId);
            return (
              <div key={booking.id} className="list-item">
                <div>
                  <strong>{customer?.name}</strong>
                  <p>{service?.name} • {booking.date}</p>
                </div>
                <div className="status-actions">
                  <select value={booking.status} onChange={(event) => onUpdateBookingStatus(booking.id, event.target.value as Booking['status'])}>
                    {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button onClick={() => onDeleteBooking(booking.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel manager-panel">
        <h3>Inventory & Reorder Logic</h3>
        <div className="inventory-table">
          {data.products.map((product) => {
            const reorderQty = recommendReorder(product.stock, product.reorderPoint);
            return (
              <div key={product.id} className="inventory-row">
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>
                <div>
                  <input
                    type="number"
                    value={product.stock}
                    min={0}
                    onChange={(event) => onUpdateInventory(product.id, Number(event.target.value))}
                  />
                </div>
                <div>
                  <span className={reorderQty > 0 ? 'warning' : 'safe'}>
                    {reorderQty > 0 ? `Reorder ${reorderQty} units` : 'Healthy stock'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel manager-panel">
        <h3>Add New Product</h3>
        <form className="add-product-form" onSubmit={onAddNewProduct}>
          <input name="name" placeholder="Product name" required />
          <input name="category" placeholder="Category" defaultValue="Plants" />
          <input name="price" type="number" placeholder="Price" min="1" required />
          <input name="stock" type="number" placeholder="Stock" min="0" required />
          <input name="reorderPoint" type="number" placeholder="Reorder point" min="0" defaultValue="5" />
          <button type="submit" className="primary-btn">Add product</button>
        </form>
      </section>
    </main>
  );
}
