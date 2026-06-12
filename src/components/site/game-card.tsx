import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { lowestPrice, type Game } from "@/lib/mock-data";
import { toggleWishlist, useWishlist } from "@/lib/wishlist-store";
import { toast } from "sonner";

export function GameCard({ game }: { game: Game }) {
  const low = lowestPrice(game);
  const wishlist = useWishlist();
  const fav = wishlist.includes(game.id);

  return (
    <Link
      to="/game/$slug"
      params={{ slug: game.slug }}
      className="group glass glass-hover relative block overflow-hidden rounded-xl"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden" style={{ background: game.cover }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.15),transparent_60%)]" />
        <div className="absolute inset-0 flex items-end p-4">
          <div className="text-3xl font-black uppercase leading-none tracking-tight text-white/90 drop-shadow-lg">
            {game.title.split(" ").slice(0, 2).join(" ")}
          </div>
        </div>
        {low.discountPercent > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-[color:var(--success)]/90 px-2 py-1 text-xs font-bold text-background">
            -{low.discountPercent}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            const now = toggleWishlist(game.id);
            toast(now ? "Added to wishlist" : "Removed from wishlist");
          }}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 backdrop-blur transition hover:bg-black/60"
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-[color:var(--neon)] text-[color:var(--neon)]" : "text-white"}`} />
        </button>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{game.title}</h3>
          <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {game.rating}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground line-clamp-1">{game.genre.join(" · ")}</div>
          <div className="text-right">
            {low.discountPercent > 0 && (
              <div className="text-[11px] text-muted-foreground line-through">${low.original.toFixed(2)}</div>
            )}
            <div className="font-bold text-[color:var(--neon)]">${low.discounted.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
