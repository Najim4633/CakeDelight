import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CartSheet } from "@/components/CartSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatCurrency,
  getNotifications,
  getOrders,
  type Notification,
  type Order,
} from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const load = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email to load your account.");
      return;
    }
    setLoading(true);
    try {
      const [o, n] = await Promise.all([getOrders(email.trim()), getNotifications(email.trim())]);
      setOrders(o);
      setNotifications(n);
      setLoadedFor(email.trim());
    } catch {
      toast.error("Couldn't load your account right now.");
    } finally {
      setLoading(false);
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
                        n.read ? "border-border text-muted-foreground" : "border-accent/40 bg-accent/10"
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
