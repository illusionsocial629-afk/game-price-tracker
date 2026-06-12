import { Link } from "@tanstack/react-router";

export function DealCard({ deal }: { deal: any }) {
  return (
    <Link
      to="/game/$slug"
      params={{ slug: deal.gameID }}
      className="glass glass-hover overflow-hidden rounded-xl"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
        <img
          src={deal.thumb}
          alt={deal.title}
          className="h-full w-full object-contain p-4"
          loading="lazy"
        />

        <span className="absolute left-3 top-3 rounded-md bg-[color:var(--success)]/90 px-2 py-1 text-xs font-bold text-background">
          -{Math.round(Number(deal.savings))}%
        </span>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-semibold">{deal.title}</h3>

        <div className="flex items-end justify-between">
          <div className="text-xs text-muted-foreground">Live deal</div>

          <div className="text-right">
            <div className="text-[11px] text-muted-foreground line-through">
              ${deal.normalPrice}
            </div>

            <div className="font-bold text-[color:var(--neon)]">
              ${deal.salePrice}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}