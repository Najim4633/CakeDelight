/**
 * Centralized API layer for CakeDelight.
 *
 * Connected directly to the Spring Boot API Gateway at http://localhost:8080.
 */

import chocolate from "@/assets/cake-chocolate.jpg";
import strawberry from "@/assets/cake-strawberry.jpg";
import vanilla from "@/assets/cake-vanilla.jpg";
import redvelvet from "@/assets/cake-redvelvet.jpg";
import pistachio from "@/assets/cake-pistachio.jpg";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "http://localhost:8080";

// Set to false to connect directly to your live Kubernetes API Gateway
export const USE_MOCK = false;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type Cake = {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  description?: string;
};

export type CakeInput = {
  name: string;
  category: string;
  price: number;
  available: boolean;
  imageUrl?: string;
  description?: string;
};

export type Review = {
  id?: number;
  cakeId: number;
  customerEmail: string;
  rating: number;
  review: string;
};

export type OrderItem = { cakeId: number; quantity: number };

export type OrderPayload = {
  customerEmail: string;
  items: OrderItem[];
};

export type Order = {
  id: number;
  customerEmail?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: Array<{
    id: number;
    cakeId: number;
    cakeName: string;
    quantity: number;
    price: number;
  }>;
};

export type Notification = {
  id: number;
  customerEmail?: string;
  message: string;
  createdAt?: string;
  read?: boolean;
};

/* ------------------------------------------------------------------ */
/* Fetch Wrapper                                                      */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) throw new ApiError(`Request failed: ${res.status}`, res.status);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Mock Fallback Data                                                 */
/* ------------------------------------------------------------------ */

const MOCK_CAKES: Cake[] = [
  {
    id: 1,
    name: "Belgian Chocolate Truffle",
    category: "Chocolate",
    price: 550.0,
    available: true,
    imageUrl: chocolate,
    description: "Dark Belgian couverture layered with silky truffle ganache and a whisper of sea salt.",
  },
  {
    id: 2,
    name: "Strawberry Cream Gateau",
    category: "Fruit",
    price: 480.0,
    available: true,
    imageUrl: strawberry,
    description: "Airy sponge, hand-whipped cream and sun-ripened strawberries picked each morning.",
  },
  {
    id: 3,
    name: "Classic Vanilla Bean",
    category: "Classic",
    price: 420.0,
    available: true,
    imageUrl: vanilla,
    description: "Madagascan vanilla bean sponge finished with cloud-soft French buttercream.",
  },
  {
    id: 4,
    name: "Velvet Rouge",
    category: "Red Velvet",
    price: 620.0,
    available: true,
    imageUrl: redvelvet,
    description: "Deep cocoa-red crumb with tangy cream cheese frosting and velvet shards.",
  },
  {
    id: 5,
    name: "Pistachio Rose",
    category: "Speciality",
    price: 690.0,
    available: true,
    imageUrl: pistachio,
    description: "Sicilian pistachio sponge, rosewater cream and sugared petals.",
  },
  {
    id: 6,
    name: "Midnight Mocha",
    category: "Chocolate",
    price: 575.0,
    available: false,
    imageUrl: chocolate,
    description: "Single-origin espresso folded through dark chocolate mousse.",
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    cakeId: 1,
    customerEmail: "aarav@example.com",
    rating: 5,
    review: "Delicious! The ganache was unbelievably smooth — ordering again for my anniversary.",
  },
  {
    id: 2,
    cakeId: 1,
    customerEmail: "meera@example.com",
    rating: 4,
    review: "Rich and not too sweet. Delivery was right on time.",
  },
];

const MOCK_ORDERS: Order[] = [
  { id: 1, totalAmount: 550.0, status: "COMPLETED", createdAt: "2026-08-12T10:00:00" },
  { id: 2, totalAmount: 1100.0, status: "PENDING", createdAt: "2026-08-10T16:32:00" },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, message: "Your order #1 has been completed successfully", read: false },
];

/* ------------------------------------------------------------------ */
/* Backend API Endpoints                                              */
/* ------------------------------------------------------------------ */

// 1. Catalog Service Endpoints (/cakes)
export async function getCakes(): Promise<Cake[]> {
  if (USE_MOCK) {
    await delay();
    return MOCK_CAKES;
  }
  return apiFetch<Cake[]>("/cakes");
}

export async function addCake(cake: CakeInput): Promise<Cake> {
  if (USE_MOCK) {
    await delay();
    const created = { ...cake, id: Date.now() };
    MOCK_CAKES.push(created);
    return created;
  }
  return apiFetch<Cake>("/cakes", {
    method: "POST",
    body: JSON.stringify(cake),
  });
}

export async function updateCake(id: number, cake: CakeInput): Promise<Cake> {
  if (USE_MOCK) {
    await delay();
    return { ...cake, id };
  }
  return apiFetch<Cake>(`/cakes/${id}`, {
    method: "PUT",
    body: JSON.stringify(cake),
  });
}

export async function deleteCake(id: number): Promise<void> {
  if (USE_MOCK) {
    await delay();
    return;
  }
  return apiFetch<void>(`/cakes/${id}`, {
    method: "DELETE",
  });
}

// 2. Rating Service Endpoints (/ratings)
export async function getReviews(cakeId: number): Promise<Review[]> {
  if (USE_MOCK) {
    await delay();
    return MOCK_REVIEWS.filter((r) => r.cakeId === cakeId);
  }
  try {
    return await apiFetch<Review[]>(`/ratings/cake/${cakeId}`);
  } catch {
    return [];
  }
}

export async function createReview(input: Review): Promise<Review> {
  if (USE_MOCK) {
    await delay();
    const created = { ...input, id: Date.now() };
    MOCK_REVIEWS.push(created);
    return created;
  }
  return apiFetch<Review>("/ratings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// 3. Order Service Endpoints (/orders)
export async function placeOrder(payload: OrderPayload): Promise<Order> {
  if (USE_MOCK) {
    await delay();
    return {
      id: Math.floor(Math.random() * 9000) + 1000,
      totalAmount: 0,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
  }
  return apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function checkoutOrder(orderId: number): Promise<Order> {
  if (USE_MOCK) {
    await delay();
    return { id: orderId, totalAmount: 0, status: "COMPLETED", createdAt: new Date().toISOString() };
  }
  return apiFetch<Order>(`/orders/${orderId}/checkout`, {
    method: "POST",
  });
}

export async function getOrders(customerEmail: string): Promise<Order[]> {
  if (USE_MOCK) {
    await delay();
    return MOCK_ORDERS;
  }
  return apiFetch<Order[]>(`/orders/customer/${encodeURIComponent(customerEmail)}`);
}

// 4. Notification Service Endpoints (/notifications)
export async function getNotifications(customerEmail: string): Promise<Notification[]> {
  if (USE_MOCK) {
    await delay();
    return MOCK_NOTIFICATIONS;
  }
  try {
    return await apiFetch<Notification[]>(`/notifications/${encodeURIComponent(customerEmail)}`);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);