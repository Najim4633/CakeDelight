import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, PackageCheck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CartSheet } from "@/components/CartSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency,
  getNotifications,
  getOrders,
  checkoutOrder,
  type Notification,
  type Order,
} from "@/lib/api";

type DashboardSearch = {
  email?: string;
};

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>): DashboardSearch => {
    const searchParams: DashboardSearch = {};
    // Use bracket notation ['email'] to satisfy TypeScript's index signature rule
    if (typeof search["email"] === "string") {
      searchParams.email = search["email"];
    }
    return searchParams;
  },
  head: () => ({
    meta: [
      { title: "Customer Dashboard — CakeDelight" },
      {
        name: "description",
        content: "Look up your CakeDelight orders and notifications using your email address.",
      },
      { property: "og:title", content: "Customer Dashboard — CakeDelight" },
      {
        property: "og:description",
        content: "Track past cake orders and account notifications at CakeDelight.",
      },
    ],
  }),
  component: Dashboard,
});

const statusVariant = (status: string) =>
  status === "COMPLETED" ? "default" : status === "CANCELLED" ? "destructive" : "secondary";

function Dashboard() {
  const search = Route.useSearch();
  const [email, setEmail] = useState(search.email ?? "");
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchUserData = async (targetEmail: string) => {
    setLoading(true);
    try {
      const [o, n] = await Promise.all([getOrders(targetEmail), getNotifications(targetEmail)]);
      setOrders(o);
      setNotifications(n);
      setLoadedFor(targetEmail);
    } catch {
      toast.error("Couldn't load your account right now.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch account details if email is passed via URL search parameters
  useEffect(() => {
    if (search.email) {
      fetchUserData(search.email);
    }
  }, [search.email]);

  const load = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email to load your account.");
      return;
    }
    await fetchUserData(email.trim());
  };

  const handleCheckout = async (orderId: number) => {
    setProcessingId(orderId);
    try {
      const updatedOrder = await checkoutOrder(orderId);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updatedOrder.status } : o)),
      );
      toast.success(`Payment successful! Order #${orderId} is now completed.`);
    } catch (error) {
      toast.error(
        `Failed to process payment for Order #${orderId}. Make sure RabbitMQ or your backend services are online.`,
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSheet />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-serif text-3xl text-foreground">Customer Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the email you ordered with to see past orders and notifications.
        </p>

        <form onSubmit={load} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="dash-email">Email address</Label>
            <Input
              id="dash-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading…" : "Load my account"}
          </Button>
        </form>

        {loadedFor && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  <PackageCheck className="h-5 w-5 text-primary" /> Orders
                </CardTitle>
                <CardDescription>Showing orders for {loadedFor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No orders yet.</p>
                ) : (
                  orders.map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between rounded-xl border border-border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">Order #{o.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(o.createdAt).toLocaleString()}
                        </p>
                        {o.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="mt-2 h-7 px-3 text-xs"
                            disabled={processingId === o.id}
                            onClick={() => handleCheckout(o.id)}
                          >
                            <CreditCard className="mr-1.5 h-3 w-3" />
                            {processingId === o.id ? "Processing..." : "Pay Now"}
                          </Button>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-base text-primary">
                          {formatCurrency(o.totalAmount)}
                        </p>
                        <Badge variant={statusVariant(o.status)} className="mt-1">
                          {o.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-xl">
                  <Bell className="h-5 w-5 text-primary" /> Notifications
                </CardTitle>
                <CardDescription>Updates about your orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing new.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl border p-3 text-sm ${
                        n.read
                          ? "border-border text-muted-foreground"
                          : "border-accent/40 bg-accent/10"
                      }`}
                    >
                      {n.message}
                      {!n.read && (
                        <Badge variant="outline" className="ml-2 align-middle text-[10px]">
                          New
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
