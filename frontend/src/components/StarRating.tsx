import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
};

export function StarRating({ value, onChange, size = 16, className }: Props) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const Icon = (
          <Star
            width={size}
            height={size}
            className={cn(
              "transition-colors",
              filled ? "fill-accent text-accent" : "text-muted-foreground/40",
            )}
          />
        );
        return onChange ? (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} out of 5`}
            onClick={() => onChange(star)}
            className="rounded-sm p-0.5 transition-transform hover:scale-110"
          >
            {Icon}
          </button>
        ) : (
          <span key={star}>{Icon}</span>
        );
      })}
    </div>
  );
}
