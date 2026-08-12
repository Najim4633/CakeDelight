import { Link } from "@tanstack/react-router";
import { CakeSlice, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCart } from "@/lib/cart";

type Props = {
  managerMode?: boolean;
  onManagerModeChange?: (value: boolean) => void;
};

export function Navbar({ managerMode, onManagerModeChange }: Props) {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <CakeSlice className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl tracking-tight text-foreground">CakeDelight</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          {onManagerModeChange && (
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5">
              <Label htmlFor="manager-mode" className="text-xs sm:text-sm">
                Manager Mode
              </Label>
              <Switch
                id="manager-mode"
                checked={!!managerMode}
                onCheckedChange={onManagerModeChange}
              />
            </div>
          )}

          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/dashboard" activeProps={{ className: "text-primary" }}>
              Customer Dashboard
            </Link>
          </Button>


          <Button
            variant="outline"
            size="icon"
            className="relative"
            aria-label={`Open cart, ${count} items`}
            onClick={() => setOpen(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </nav>
    </header>
  );
}
