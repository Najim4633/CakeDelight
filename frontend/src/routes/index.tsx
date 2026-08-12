import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { CartSheet } from "@/components/CartSheet";
import { CakeCard } from "@/components/CakeCard";
import { CakeDetailsDialog } from "@/components/CakeDetailsDialog";
import { CakeFormDialog } from "@/components/CakeFormDialog";
import { CatalogToolbar, type SortOption } from "@/components/CatalogToolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getCakes, type Cake } from "@/lib/api";
import { useCart } from "@/lib/cart";
import heroImage from "@/assets/hero-bakery.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CakeDelight — Artisan Cakes Baked Fresh Daily" },
      {
        name: "description",
        content:
          "Order handcrafted cakes from CakeDelight: Belgian chocolate truffle, strawberry gateau, red velvet and more, delivered fresh.",
      },
      { property: "og:title", content: "CakeDelight — Artisan Cakes Baked Fresh Daily" },
      {
        property: "og:description",
        content: "Handcrafted cakes baked fresh every morning. Browse, review and order online.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [cakes, setCakes] = useState<Cake[] | null>(null);
  const [selected, setSelected] = useState<Cake | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [managerMode, setManagerMode] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cake | null>(null);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const { addItem, setOpen } = useCart();

  useEffect(() => {
    getCakes().then((data) => setCakes(data.map((c) => ({ ...c }))));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set((cakes ?? []).map((c) => c.category)))],
    [cakes],
  );

  const visibleCakes = useMemo(() => {
    const list = (cakes ?? []).filter((c) => category === "All" || c.category === category);
    return [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [cakes, category, sort]);

  const handleAdd = (cake: Cake) => {
    addItem(cake);
    toast.success(`${cake.name} added to your cart`);
  };

  const openDetails = (cake: Cake) => {
    setSelected(cake);
    setDetailsOpen(true);
  };

  const handleDelete = (cake: Cake) => {
    setCakes((prev) => (prev ?? []).filter((c) => c.id !== cake.id));
    toast.success(`${cake.name} removed from the catalogue`);
  };

  const handleSaveCake = (cake: Cake) => {
    setCakes((prev) => {
      const list = prev ?? [];
      return list.some((c) => c.id === cake.id)
        ? list.map((c) => (c.id === cake.id ? cake : c))
        : [...list, cake];
    });
    toast.success(editing ? `${cake.name} updated` : `${cake.name} added to the catalogue`);
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar managerMode={managerMode} onManagerModeChange={setManagerMode} />
      <CartSheet />

      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Assortment of cakes on a wooden bakery table"
          width={1600}
          height={900}
          className="h-[380px] w-full object-cover md:h-[460px]"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-center px-6">
          <p className="text-sm uppercase tracking-[0.25em] text-accent">Baked fresh daily</p>
          <h1 className="mt-3 max-w-xl font-serif text-4xl leading-tight text-background md:text-5xl">
            Cakes worth slowing down for
          </h1>
          <p className="mt-4 max-w-md text-background/80">
            Small-batch celebration cakes from our kitchen, made with real butter, real vanilla and
            a lot of patience.
          </p>
          <div className="mt-6">
            <Button variant="secondary" size="lg" onClick={() => setOpen(true)}>
              View your cart
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-3xl text-foreground">Today&apos;s Collection</h2>
            <p className="text-muted-foreground">
              Every cake is baked to order and boxed within the hour.
            </p>
          </div>
          {managerMode && (
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Cake
            </Button>
          )}
        </div>

        <CatalogToolbar
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cakes === null ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] rounded-2xl" />
            ))
          ) : visibleCakes.length === 0 ? (
            <p className="text-muted-foreground">No cakes in this category yet.</p>
          ) : (
            visibleCakes.map((cake) => (
              <CakeCard
                key={cake.id}
                cake={cake}
                onSelect={openDetails}
                onAdd={handleAdd}
                managerMode={managerMode}
                onEdit={(c) => {
                  setEditing(c);
                  setFormOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CakeDelight. Baked with care.
      </footer>

      <CakeDetailsDialog
        cake={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onAdd={handleAdd}
      />

      <CakeFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        cake={editing}
        onSubmit={handleSaveCake}
      />
    </div>
  );
}

