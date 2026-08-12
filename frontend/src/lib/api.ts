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

export type OrderItem = {
  cakeId: number;
  cakeName: string;
  quantity: number;
  price: number;
};

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

/* ------------------------------------------------------------------ */
/* Image Asset Resolver Logic                                         */
/* ------------------------------------------------------------------ */

// Maps database file names to the bundled Vite assets from src/assets.
// If you add new images to the assets folder, import them at the top and map them here.
const imageMap: Record<string, string> = {
  "chocolate-truffle.jpg": chocolate,
  "choco-truffle.jpg": chocolate,
  "cake-chocolate.jpg": chocolate,
  "strawberry-cream.jpg": strawberry,
  "cake-strawberry.jpg": strawberry,
  "vanilla-bean.jpg": vanilla,
  "cake-vanilla.jpg": vanilla,
  "red-velvet.jpg": redvelvet,
  "cake-redvelvet.jpg": redvelvet,
  "pistachio-rose.jpg": pistachio,
  "cake-pistachio.jpg": pistachio,
};

function resolveImageUrl(dbImageUrl: string | undefined): string {
  if (!dbImageUrl) return chocolate; // Fallback default image
  if (dbImageUrl.startsWith("http")) return dbImageUrl; // Allow external URLs

  // If the database string matches a mapped key, use the local asset
  if (imageMap[dbImageUrl]) {
    return imageMap[dbImageUrl];
  }

  return chocolate; // Fallback if the database name doesn't match the map
}

/* ------------------------------------------------------------------ */
/* Backend API Endpoints                                              */
/* ------------------------------------------------------------------ */

// 1. Catalog Service Endpoints (/cakes)
export async function getCakes(): Promise<Cake[]> {
  // Use 'any' temporarily to intercept the raw Spring Boot JSON structure
  const rawData = await apiFetch<any[]>("/cakes");

  return rawData.map((cake: any) => ({
    ...cake,
    // Safely map Spring Boot's "isAvailable" to React's "available"
    available: cake.isAvailable ?? cake.available ?? false,
    // Safely map and resolve the image URL
    imageUrl: resolveImageUrl(cake.imageUrl ?? cake.image_url),
  }));
}

export async function addCake(cake: CakeInput): Promise<Cake> {
  // Re-map the frontend state back to the backend's expected structure
  const payload = {
    ...cake,
    isAvailable: cake.available,
  };

  const created = await apiFetch<any>("/cakes", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    ...created,
    available: created.isAvailable ?? created.available ?? false,
    imageUrl: resolveImageUrl(created.imageUrl ?? created.image_url),
  };
}

export async function updateCake(id: number, cake: CakeInput): Promise<Cake> {
  const payload = {
    ...cake,
    isAvailable: cake.available,
  };

  const updated = await apiFetch<any>(`/cakes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return {
    ...updated,
    available: updated.isAvailable ?? updated.available ?? false,
    imageUrl: resolveImageUrl(updated.imageUrl ?? updated.image_url),
  };
}

export async function deleteCake(id: number): Promise<void> {
  return apiFetch<void>(`/cakes/${id}`, {
    method: "DELETE",
  });
}

// 2. Rating Service Endpoints (/ratings)
export async function getReviews(cakeId: number): Promise<Review[]> {
  try {
    // Fetch raw backend RatingResponse
    const rawData = await apiFetch<any[]>(`/ratings/cake/${cakeId}`);

    // Map backend fields to frontend UI fields
    return rawData.map((item) => ({
      id: item.id,
      cakeId: item.cakeId,
      customerEmail: item.userEmail, // Map userEmail -> customerEmail
      rating: item.score, // Map score -> rating
      review: item.comment, // Map comment -> review
    }));
  } catch {
    return [];
  }
}

export async function createReview(input: Review): Promise<Review> {
  // Map frontend UI fields to backend RatingRequest DTO
  const payload = {
    cakeId: input.cakeId,
    userEmail: input.customerEmail, // Map customerEmail -> userEmail
    score: input.rating, // Map rating -> score
    comment: input.review, // Map review -> comment
  };

  const created = await apiFetch<any>("/ratings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Map the response back to the frontend shape
  return {
    id: created.id,
    cakeId: created.cakeId,
    customerEmail: created.userEmail,
    rating: created.score,
    review: created.comment,
  };
}

// 3. Order Service Endpoints (/orders)
export async function placeOrder(payload: OrderPayload): Promise<Order> {
  return apiFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function checkoutOrder(orderId: number): Promise<Order> {
  return apiFetch<Order>(`/orders/${orderId}/checkout`, {
    method: "POST",
  });
}

export async function getOrders(customerEmail: string): Promise<Order[]> {
  return apiFetch<Order[]>(`/orders/customer/${encodeURIComponent(customerEmail)}`);
}

// 4. Notification Service Endpoints (/notifications)
// 4. Notification Service Endpoints (/notifications)
export async function getNotifications(customerEmail: string): Promise<Notification[]> {
  try {
    // Added /customer/ to match the Java @GetMapping("/customer/{email}")
    return await apiFetch<Notification[]>(
      `/notifications/customer/${encodeURIComponent(customerEmail)}`,
    );
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
