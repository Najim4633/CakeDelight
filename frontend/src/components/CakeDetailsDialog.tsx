import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/StarRating";
import { createReview, formatCurrency, getReviews, type Cake, type Review } from "@/lib/api";

type Props = {
  cake: Cake | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (cake: Cake) => void;
};

export function CakeDetailsDialog({ cake, open, onOpenChange, onAdd }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!cake || !open) return;
    let active = true;
    setLoading(true);
    getReviews(cake.id)
      .then((data) => active && setReviews(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [cake, open]);

  if (!cake) return null;

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !text.trim()) {
      toast.error("Please add your email and a short review.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await createReview({
        cakeId: cake.id,
        customerEmail: email.trim(),
        rating,
        review: text.trim(),
      });
      setReviews((prev) => [created, ...prev]);
      setText("");
      setRating(5);
      toast.success("Thank you for your review!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-3xl">
        <div className="grid md:grid-cols-2">
          <img
            src={cake.imageUrl}
            alt={cake.name}
            width={800}
            height={800}
            loading="lazy"
            className="h-56 w-full object-cover md:h-full"
          />

          <div className="p-6">
            <DialogHeader className="space-y-2 text-left">
              <Badge variant="secondary" className="w-fit font-normal">
                {cake.category}
              </Badge>
              <DialogTitle className="font-serif text-2xl">{cake.name}</DialogTitle>
              <DialogDescription>{cake.description}</DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex items-center gap-3">
              <StarRating value={average} />
              <span className="text-sm text-muted-foreground">
                {reviews.length ? `${average.toFixed(1)} · ${reviews.length} reviews` : "No reviews yet"}
              </span>
            </div>

            <p className="mt-4 font-serif text-2xl text-primary">{formatCurrency(cake.price)}</p>

            <Button
              className="mt-4 w-full"
              disabled={!cake.available}
              onClick={() => {
                onAdd(cake);
                onOpenChange(false);
              }}
            >
              {cake.available ? "Add to Cart" : "Currently unavailable"}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-5 p-6">
          <h4 className="font-serif text-lg">Customer Reviews</h4>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">Be the first to review this cake.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{r.customerEmail}</span>
                    <StarRating value={r.rating} size={14} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.review}</p>
                </li>
              ))}
            </ul>
          )}

          <Separator />

          <form onSubmit={submitReview} className="space-y-4">
            <h5 className="font-medium">Write a review</h5>
            <div className="space-y-2">
              <Label htmlFor="review-email">Your email</Label>
              <Input
                id="review-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarRating value={rating} onChange={setRating} size={22} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-text">Review</Label>
              <Textarea
                id="review-text"
                rows={3}
                placeholder="Tell us what you thought…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
