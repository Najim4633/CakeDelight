import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "price-asc" | "price-desc" | "name-asc";

type Props = {
  categories: string[];
  category: string;
  onCategoryChange: (c: string) => void;
  sort: SortOption;
  onSortChange: (s: SortOption) => void;
};

export function CatalogToolbar({
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={c === category ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onCategoryChange(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger className="sm:w-56" aria-label="Sort cakes">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
