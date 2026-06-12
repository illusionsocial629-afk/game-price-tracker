import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { GameCard } from "@/components/site/game-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { searchGames, getDeals } from "@/services/cheapshark";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { GAMES, lowestPrice } from "@/lib/mock-data";

const search = z.object({
  q: z.string().optional().default(""),
  mode: z.string().optional().default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: search,
  component: SearchPage,
});

function SearchPage() {
  const { q: initialQ, mode } = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQ || "");
  const [sort, setSort] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(80);
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [popularApiGames, setPopularApiGames] = useState<any[]>([]);
  const [hasSearchedApi, setHasSearchedApi] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);

  useEffect(() => {
    setQ(initialQ || "");
  }, [initialQ]);

  useEffect(() => {
    async function loadPopularGames() {
      try {
        setLoadingPopular(true);

        const queries = [
          "grand theft auto",
          "red dead redemption",
          "minecraft",
          "cyberpunk",
          "elden ring",
          "witcher",
          "god of war",
          "forza horizon",
        ];

        const results = await Promise.all(
          queries.map((query) => searchGames(query))
        );

        const games = results
          .map((items) => items?.[0])
          .filter(Boolean);

        setPopularApiGames(games);
      } catch (error) {
        console.error("Failed to load popular games:", error);
      } finally {
        setLoadingPopular(false);
      }
    }

    loadPopularGames();
  }, []);

  useEffect(() => {
    const query = q.trim();

    if (query.length < 2) {
      setApiResults([]);
      setHasSearchedApi(false);
      setLoadingSearch(false);
      return;
    }

    async function loadSearch() {
      try {
        setLoadingSearch(true);
        setHasSearchedApi(true);
        setApiResults([]);

        const data = await searchGames(query);

        setApiResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Search failed:", error);
        setApiResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }

    const timeout = window.setTimeout(loadSearch, 400);

    return () => window.clearTimeout(timeout);
  }, [q]);

  const fallbackResults = useMemo(() => {
    let list = [...GAMES];

    list = list.filter((g) => lowestPrice(g).discounted <= maxPrice);

    if (sort === "lowest") {
      list.sort(
        (a, b) => lowestPrice(a).discounted - lowestPrice(b).discounted
      );
    }

    if (sort === "discount") {
      list.sort(
        (a, b) =>
          lowestPrice(b).discountPercent - lowestPrice(a).discountPercent
      );
    }

    if (sort === "popularity") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [sort, maxPrice]);

  const filteredApiResults = [...apiResults]
    .filter((game) => {
      const price = Number(game.cheapest || 0);

      if (mode === "free") {
        return price <= 1;
      }

      if (mode === "under10") {
        return price <= 10;
      }

      return price <= maxPrice;
    })
    .sort((a, b) => {
      if (sort === "lowest") {
        return Number(a.cheapest || 0) - Number(b.cheapest || 0);
      }

      if (sort === "discount") {
        return Number(a.cheapest || 0) - Number(b.cheapest || 0);
      }

      if (sort === "popularity") {
        return String(a.external).localeCompare(String(b.external));
      }

      return 0;
    });

  const filteredPopularGames = [...popularApiGames]
    .filter((game) => {
      const price = Number(game.cheapest || 0);

     if (mode === "free") {
  return price <= 1;
}

if (mode === "under10") {
  return price <= 10;
}

return price <= maxPrice;
    })

  const isSearching = q.trim().length >= 2;
  const defaultResults =
    mode === "free"
      ? filteredPopularGames
      : filteredPopularGames.length > 0
        ? filteredPopularGames
        : fallbackResults;

  const displayCount = isSearching
    ? filteredApiResults.length
    : defaultResults.length;

  function ApiGameCard({ game }: { game: any }) {
    return (
      <Link
        key={game.gameID}
        to="/game/$slug"
        params={{ slug: game.gameID }}
        className="glass glass-hover overflow-hidden rounded-xl"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
          <img
            src={game.thumb}
            alt={game.external}
            className="h-full w-full object-contain p-4"
            loading="lazy"
          />
        </div>

        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 font-semibold">{game.external}</h3>

          <div className="text-sm text-muted-foreground">Cheapest price:</div>

          <div className="font-bold text-[color:var(--neon)]">
            ${game.cheapest}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="glass relative rounded-2xl p-2">
          <SearchIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search GTA V, Minecraft, Red Dead Redemption 2..."
            className="h-12 w-full bg-transparent pl-12 pr-4 text-base outline-none"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="glass h-fit space-y-6 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="h-4 w-4" /> Browse
            </div>

            <div className="space-y-2">
              {[
                {
                  label: "🔥 Most Popular",
                  action: () => {
                    setQ("");
                    setSort("popularity");
                    setMaxPrice(80);

                    navigate({
                      to: "/search",
                      search: { q: "" } as any,
                    });
                  },
                },

                {
                  label: "💸 Under $10",
                  action: async () => {
                    setQ("");
                    setMaxPrice(10);
                    setSort("lowest");
                    setLoadingSearch(true);

                    try {
                      const deals = await getDeals();

                      const underTen = deals
                        .filter((deal: any) => Number(deal.salePrice || 0) <= 10)
                        .slice(0, 24);

                      setApiResults(underTen);
                      setHasSearchedApi(true);

                      navigate({
                        to: "/search",
                        search: { q: "" } as any,
                      });
                    } catch (error) {
                      console.error(error);
                    } finally {
                      setLoadingSearch(false);
                    }
                  },
                },

                {
                  label: "⚡ Highest Discount",
                  action: () => {
                    setQ("");
                    setMaxPrice(80);
                    setSort("discount");

                    navigate({
                      to: "/search",
                      search: { q: "" } as any,
                    });
                  },
                },

                //   {
                //     label: "🎮 AAA Games",
                //    action: async () => {
                //   setLoadingSearch(true);

                //   try {
                //     const queries = [
                //       "grand theft auto",
                //       "call of duty",
                //       "elden ring",
                //       "red dead redemption",
                //       "god of war",
                //       "forza horizon",
                //       "battlefield",
                //       "assassin's creed",
                //     ];

                //     const results = await Promise.all(
                //       queries.map((query) => searchGames(query))
                //     );

                //     const games = results
                //       .map((items) => items?.[0])
                //       .filter(Boolean);

                //     setApiResults(games);

                //     navigate({
                //       to: "/search",
                //       search: { q: "" } as any,
                //     });
                //   } catch (error) {
                //     console.error(error);
                //   } finally {
                //     setLoadingSearch(false);
                //   }
                // },
                //   },

                {
                  label: "🆕 New Deals",
                  action: () => {
                    setQ("new");

                    navigate({
                      to: "/search",
                      search: { q: "new" } as any,
                    });
                  },
                },

                {
                  label: "🎁 Free / Under $1",
                  action: () => {
                    setQ("");
                    setMaxPrice(1);
                    setSort("lowest");

                    navigate({
                      to: "/search",
                      search: { q: "", mode: "free" } as any,
                    });
                  },
                },
              ].map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={item.action}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm transition hover:border-[color:var(--neon)]/40 hover:bg-white/10"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>
                Max price:{" "}
                <span className="text-[color:var(--neon)]">${maxPrice}</span>
              </Label>

              <Slider
                value={[maxPrice]}
                onValueChange={(v) => setMaxPrice(v[0])}
                max={80}
                step={5}
              />
            </div>

            <Button
              variant="outline"
              className="w-full border-white/15 bg-white/5"
              onClick={() => {
                setQ("");
                setMaxPrice(80);
                setSort("popularity");
              }}
            >
              Reset browse
            </Button>
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {isSearching
                    ? `Search results for “${q}”`
                    : mode === "free"
  ? "Free & Under $1 Games"
  : mode === "under10"
    ? "Games Under $10"
    : "Most Popular Games"}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  {displayCount} result{displayCount !== 1 ? "s" : ""}
                </p>
              </div>

              {/* <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[200px] border-white/15 bg-white/5">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="popularity">Most popular</SelectItem>
                  <SelectItem value="lowest">Lowest price</SelectItem>
                  <SelectItem value="discount">Highest discount</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            {loadingSearch || (!isSearching && loadingPopular) ? (
              <div className="glass rounded-2xl p-12 text-center">
                <h3 className="text-lg font-semibold">
                  {isSearching ? "Searching games..." : "Loading popular games..."}
                </h3>
              </div>
            ) : isSearching && hasSearchedApi ? (
              filteredApiResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                  {filteredApiResults.map((game) => (
                    <ApiGameCard key={game.gameID} game={game} />
                  ))}
                </div>
              ) : (
                <div className="glass rounded-2xl p-12 text-center">
                  <h3 className="text-lg font-semibold">No games found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try another game name or increase the max price.
                  </p>
                </div>
              )
            ) : defaultResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {defaultResults.map((item: any) =>
                  item.gameID ? (
                    <ApiGameCard key={item.gameID} game={item} />
                  ) : (
                    <GameCard key={item.id} game={item} />
                  )
                )}
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center">
                <h3 className="text-lg font-semibold">No games found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try increasing the max price.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}