import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, placeOrder, type OrderPayload } from "@/lib/api";
import { useCart } from "@/lib/cart";

export function CartSheet() {
  const { items, total, isOpen, setOpen, setQuantity, removeItem, clear } = useCart();
  const [email, setEmail] = useState("");
  const [placing, setPlacing] = useState(false);

  const checkout = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email to place the order.");
      return;
    }
    const payload: OrderPayload = {
      customerEmail: email.trim(),
      items: items.map((i) => ({ cakeId: i.cake.id, quantity: i.quantity })),
    };
    setPlacing(true);
    try {
      const order = await placeOrder(payload);
      clear();
      setOpen(false);
      toast.success(`Order #${order.id} placed!`, {
        description: `A confirmation is on its way to ${payload.customerEmail}.`,
      });
    } catch {
      toast.error("We couldn't place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">Your Cart</SheetTitle>
          <SheetDescription>Freshly baked, boxed with care.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Your cart is still empty.</p>
            </div>
          ) : (
            <ul className="space-y-4 py-2">
              {items.map(({ cake, quantity }) => (
                <li key={cake.id} className="flex gap-3 rounded-xl border border-border p-3">
                  <img
                    src={cake.imageUrl}
                    alt={cake.name}
                    width={800}
                    height={800}
                    loading="lazy"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{cake.name}</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(cake.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(cake.id, quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm tabular-nums">{quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(cake.id, quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-auto h-7 w-7 text-muted-foreground"
                        aria-label={`Remove ${cake.name}`}
                        onClick={() => removeItem(cake.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4 border-t border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-serif text-xl text-primary">{formatCurrency(total)}</span>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email for order updates</Label>
            <Input
              id="customer-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            disabled={items.length === 0 || placing}
            onClick={checkout}
          >
            {placing ? "Placing order…" : "Checkout"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
