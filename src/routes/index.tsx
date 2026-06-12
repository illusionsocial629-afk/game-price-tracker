import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Flame,
  LineChart,
  Search,
  Sparkles,
  Tag,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { GameCard } from "@/components/site/game-card";
import { DealCard } from "@/components/site/deal-card";
import { Button } from "@/components/ui/button";
import { GAMES, STORES, lowestPrice } from "@/lib/mock-data";
import { getDeals } from "@/services/cheapshark";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [q, setQ] = useState("");
  const [deals, setDeals] = useState<any[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [showAllPopular, setShowAllPopular] = useState(false);

  const nav = useNavigate();

  const trendingFallback = [...GAMES]
    .sort(
      (a, b) =>
        lowestPrice(b).discountPercent - lowestPrice(a).discountPercent
    )
    .slice(0, 4);

  const popularFallback = GAMES.slice(0, 8);


  const hotFallback = [...GAMES]
    .sort(
      (a, b) =>
        lowestPrice(b).discountPercent - lowestPrice(a).discountPercent
    )
    .slice(0, 6);

  const freeFallback: any[] = [];

  const bestFallback = [...GAMES]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const underTenFallback = [...GAMES]
    .filter((g) => lowestPrice(g).discounted <= 10)
    .slice(0, 6);

  const trendingDeals = deals.slice(0, 4);
  const hotDeals = [...deals]
    .sort((a, b) => Number(b.savings || 0) - Number(a.savings || 0))
    .slice(0, 6);

  const freeDeals = deals
    .filter(
      (deal) =>
        Number(deal.salePrice || 0) <= 1 ||
        Number(deal.savings || 0) >= 95
    )
    .slice(0, 6);

  const bestDeals = [...deals]
    .sort((a, b) => Number(a.salePrice || 0) - Number(b.salePrice || 0))
    .slice(0, 6);

  const underTenDeals = deals
    .filter((deal) => Number(deal.salePrice || 0) <= 10)
    .slice(0, 6);
  const popularDeals = deals.slice(4, 16);

  const popularItems =
    loadingDeals || popularDeals.length === 0 ? popularFallback : popularDeals;

  const visiblePopularItems = showAllPopular
    ? popularItems
    : popularItems.slice(0, 5);

  useEffect(() => {
    async function loadDeals() {
      try {
        const data = await getDeals();
        setDeals(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load CheapShark deals:", error);
      } finally {
        setLoadingDeals(false);
      }
    }

    loadDeals();
  }, []);

  function renderDealOrGame(item: any) {
    if (item?.dealID) {
      return <DealCard key={item.dealID} deal={item} />;
    }

    return <GameCard key={item.id} game={item} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--neon),transparent_60%)] opacity-30 blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 py-24 text-center md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--neon)]" />
            Tracking 8 stores · Real-time price drops
          </span>

          <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
            Never overpay for a <span className="text-gradient">game</span>{" "}
            again.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Compare prices across Steam, Epic, Xbox, PlayStation, EA, Ubisoft,
            Google Play and the App Store. Get pinged the moment a wishlisted
            game drops.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              const query = q.trim();
              if (!query) return;

              nav({
                to: "/search",
                search: { q: query },
              });
            }}
            className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-background/60 p-2 backdrop-blur-xl"
          >
            <Search className="ml-2 h-5 w-5 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any game..."
              className="h-12 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />

            <Button
              type="submit"
              className="h-10 bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background hover:opacity-90"
            >
              Search <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 opacity-80">
            {STORES.map((s) => (
              <div
                key={s.id}
                className={`grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br ${s.color} text-xs font-bold text-white`}
              >
                <img
                  src={s.logo}
                  alt={s.name}
                  className="h-5 w-5 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Flame className="h-6 w-6 text-orange-400" /> Trending deals
            </h2>
            <p className="text-sm text-muted-foreground">
              Biggest price drops right now.
            </p>
          </div>

          <Link
            to="/search"
            search={{ q: "" }}
            className="text-sm text-[color:var(--neon)] hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {loadingDeals
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[360px] animate-pulse rounded-xl bg-white/5" />
            ))
            : (trendingDeals.length > 0 ? trendingDeals : trendingFallback).map(renderDealOrGame)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">🎁 Free & Almost Free</h2>
            <p className="text-sm text-muted-foreground">
              Games currently available for free or at 100% discount.
            </p>
          </div>

          <Link
            to="/search"
            search={{ q: "", mode: "free" } as any}
            className="text-sm text-[color:var(--neon)] hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {loadingDeals
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse rounded-xl bg-white/5"
              />
            ))
            : freeDeals.length > 0
              ? freeDeals.map(renderDealOrGame)
              : (
                <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-muted-foreground">
                  No free games available right now.
                </div>
              )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">🔥 Hot Deals Right Now</h2>
          <p className="text-sm text-muted-foreground">
            Limited-time discounts gamers are checking today.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {loadingDeals
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse rounded-xl bg-white/5"
              />
            ))
            : (hotDeals.length > 0
              ? hotDeals
              : hotFallback
            ).map(renderDealOrGame)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">💎 Best of All Time</h2>
            <p className="text-sm text-muted-foreground">
              Premium picks worth tracking before the next big sale.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {loadingDeals
              ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[360px] animate-pulse rounded-xl bg-white/5"
                />
              ))
              : (bestDeals.length > 0
                ? bestDeals
                : bestFallback
              ).map(renderDealOrGame)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
  <div>
    <h2 className="text-2xl font-bold">💰 Under $10</h2>

    <p className="text-sm text-muted-foreground">
      Budget-friendly deals currently available.
    </p>
  </div>

  <Link
    to="/search"
    search={{ q: "", mode: "under10" } as any}
    className="text-sm text-[color:var(--neon)] hover:underline"
  >
    View all →
  </Link>
</div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {loadingDeals
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse rounded-xl bg-white/5"
              />
            ))
            : (
              underTenDeals.length > 0
                ? underTenDeals
                : underTenFallback.length > 0
                  ? underTenFallback
                  : hotFallback
            ).map(renderDealOrGame)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["1M+", "Deals tracked"],
            ["8", "Stores monitored"],
            ["24/7", "Price checking"],
            ["Free", "Wishlist alerts"],
          ].map(([value, label]) => (
            <div key={label} className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-gradient">{value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular this week</h2>

          {popularItems.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllPopular((value) => !value)}
              className="text-sm font-medium text-[color:var(--neon)] hover:underline"
            >
              {showAllPopular ? "View less ↑" : "View more →"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {loadingDeals
            ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] animate-pulse rounded-xl bg-white/5"
              />
            ))
            : visiblePopularItems.map(renderDealOrGame)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          Built for the way <span className="text-gradient">you</span> game.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: TrendingDown,
              title: "Price comparison",
              body: "See live prices side-by-side across 8 major stores. Buy where it's cheapest.",
            },
            {
              icon: Bell,
              title: "Drop alerts",
              body: "Get an instant push notification the moment a wishlisted game goes on sale.",
            },
            {
              icon: LineChart,
              title: "Price history",
              body: "90-day historical charts so you can spot the lowest ever price and time the buy.",
            },
            {
              icon: Tag,
              title: "Smart wishlist",
              body: "Set a target price; we'll tell you the second any store hits it.",
            },
            {
              icon: Search,
              title: "Powerful filters",
              body: "Filter by store, platform, genre and budget. Sort by discount, price or popularity.",
            },
            {
              icon: Sparkles,
              title: "Curated deals",
              body: "Hand-picked featured deals every week from our editors.",
            },
          ].map((f) => (
            <div key={f.title} className="glass glass-hover rounded-2xl p-6">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--neon)]/30 to-[color:var(--neon-violet)]/30 text-[color:var(--neon)]">
                <f.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,var(--neon-violet),transparent_60%)] opacity-40" />

          <h2 className="text-3xl font-bold md:text-5xl">
            Build your wishlist. <span className="text-gradient">Save big.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Free forever. No credit card. No spam. Just deals.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background hover:opacity-90"
              >
                Create free account
              </Button>
            </Link>

            <Link to="/search" search={{ q: "" }}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/15 bg-white/5"
              >
                Browse games
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}