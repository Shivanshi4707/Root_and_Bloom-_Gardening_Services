import { initialData, STORAGE_KEY } from '../data/initialData';
import type { BusinessData, Booking, Gardener, Product, Service } from '../types/business';

export function loadData(): BusinessData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialData;
  } catch {
    return initialData;
  }
}

export function calculatePriorityScore(gardener: Gardener, customerZone: string, currentBookings: number): number {
  const zoneMatch = gardener.zone === customerZone ? 1 : 0;
  const workloadFactor = 1 - Math.min(currentBookings / 6, 1);
  return Number((0.5 * gardener.rating + 0.3 * zoneMatch + 0.2 * workloadFactor).toFixed(2));
}

export function findBestGardener(service: Service, zone: string, gardeners: Gardener[], bookings: Booking[]): Gardener | null {
  const sameSpecialization = gardeners.filter((g) => g.specialization === service.name || g.specialization === service.category);
  const availableCandidates = sameSpecialization.filter((g) => {
    const assignedThisDay = bookings.filter((b) => b.gardenerId === g.id && b.date === new Date().toISOString().slice(0, 10)).length;
    return g.availability && assignedThisDay < 3;
  });

  if (availableCandidates.length === 0) return null;

  const ranked = availableCandidates.map((g) => ({
    gardener: g,
    score: calculatePriorityScore(g, zone, bookings.filter((b) => b.gardenerId === g.id).length),
  }));

  ranked.sort((a, b) => b.score - a.score);
  return ranked[0].gardener;
}

export function recommendReorder(stock: number, reorderPoint: number) {
  return stock <= reorderPoint ? Math.max(12, reorderPoint * 2 - stock) : 0;
}

export function getReorderStatus(product: Product) {
  return recommendReorder(product.stock, product.reorderPoint);
}
