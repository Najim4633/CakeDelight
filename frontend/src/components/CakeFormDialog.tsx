import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Cake } from "@/lib/api";

export const PLACEHOLDER_IMAGE = "/images/cakes/cake-placeholder.jpg";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cake: Cake | null;
  onSubmit: (cake: Cake) => void;
};

const emptyForm = {
  name: "",
  category: "",
  price: "",
  imageUrl: PLACEHOLDER_IMAGE,
  available: true,
};

export function CakeFormDialog({ open, onOpenChange, cake, onSubmit }: Props) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    setForm(
      cake
        ? {
            name: cake.name,
            category: cake.category,
            price: String(cake.price),
            imageUrl: cake.imageUrl ?? PLACEHOLDER_IMAGE,
            available: cake.available,
          }
        : emptyForm,
    );
  }, [cake, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: cake?.id ?? Date.now(),
      name: form.name.trim(),
      category: form.category.trim() || "Uncategorised",
      price: Number(form.price) || 0,
      available: form.available,
      imageUrl: form.imageUrl.trim() || PLACEHOLDER_IMAGE,
      description: cake?.description ?? "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {cake ? "Edit cake" : "Add new cake"}
          </DialogTitle>
          <DialogDescription>
            {cake ? "Update the details of this cake." : "Add a new cake to today's catalogue."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cake-name">Cake name</Label>
            <Input
              id="cake-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cake-category">Category</Label>
            <Input
              id="cake-category"
              list="cake-category-options"
              placeholder="Chocolate"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
            <datalist id="cake-category-options">
              <option value="Chocolate" />
              <option value="Fruit" />
              <option value="Cheesecake" />
              <option value="Classic" />
              <option value="Red Velvet" />
              <option value="Speciality" />
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cake-price">Price</Label>
            <Input
              id="cake-price"
              type="number"
              min="0"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cake-image">Image URL path</Label>
            <Input
              id="cake-image"
              value={form.imageUrl}
              onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-3">
            <Label htmlFor="cake-available">Available today</Label>
            <Switch
              id="cake-available"
              checked={form.available}
              onCheckedChange={(v) => setForm((f) => ({ ...f, available: v }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{cake ? "Save changes" : "Add cake"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
