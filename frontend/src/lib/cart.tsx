import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Cake } from "./api";

export type CartItem = { cake: Cake; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (cake: Cake) => void;
  setQuantity: (cakeId: number, quantity: number) => void;
  removeItem: (cakeId: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const addItem = (cake: Cake) =>
      setItems((prev) => {
        const existing = prev.find((i) => i.cake.id === cake.id);
        if (existing) {
          return prev.map((i) => (i.cake.id === cake.id ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return [...prev, { cake, quantity: 1 }];
      });

    const setQuantity = (cakeId: number, quantity: number) =>
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.cake.id !== cakeId)
          : prev.map((i) => (i.cake.id === cakeId ? { ...i, quantity } : i)),
      );

    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.quantity * i.cake.price, 0),
      addItem,
      setQuantity,
      removeItem: (cakeId: number) => setItems((prev) => prev.filter((i) => i.cake.id !== cakeId)),
      clear: () => setItems([]),
      isOpen,
      setOpen,
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
