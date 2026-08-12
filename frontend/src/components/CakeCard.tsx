import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, type Cake } from "@/lib/api";

type Props = {
  cake: Cake;
  onSelect: (cake: Cake) => void;
  onAdd: (cake: Cake) => void;
  managerMode?: boolean;
  onEdit?: (cake: Cake) => void;
  onDelete?: (cake: Cake) => void;
};

export function CakeCard({ cake, onSelect, onAdd, managerMode, onEdit, onDelete }: Props) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]">
      <button
        type="button"
        onClick={() => onSelect(cake)}
        className="relative block aspect-square w-full overflow-hidden"
        aria-label={`View details for ${cake.name}`}
      >
        <img
          src={cake.imageUrl}
          alt={cake.name}
          width={800}
          height={800}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!cake.available && (
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/55 text-sm font-medium tracking-wide text-background">
            Sold out today
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg leading-tight text-foreground">{cake.name}</h3>
            <Badge variant="secondary" className="mt-2 font-normal">
              {cake.category}
            </Badge>
          </div>
          <p className="shrink-0 font-serif text-lg text-primary">{formatCurrency(cake.price)}</p>
        </div>

        <div className="mt-auto flex gap-2 pt-2">
          {managerMode ? (
            <>
              <Button variant="secondary" className="flex-1" onClick={() => onEdit?.(cake)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => onDelete?.(cake)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button className="flex-1" disabled={!cake.available} onClick={() => onAdd(cake)}>
                Add to Cart
              </Button>
              <Button variant="outline" onClick={() => onSelect(cake)}>
                Details
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
