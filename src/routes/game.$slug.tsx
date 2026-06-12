import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Calendar, ExternalLink, Heart, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { StoreBadge } from "@/components/site/store-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { GAMES, STORES, getGameBySlug, lowestPrice, priceHistory } from "@/lib/mock-data";
import { toggleWishlist, useWishlist } from "@/lib/wishlist-store";
import { getGameDetails, getStores, getRelatedGames } from "@/services/cheapshark";
import { toast } from "sonner";
import { getUserSession } from "@/lib/user-auth";
import { toggleWishlistDb } from "@/lib/wishlist.server";
export const Route = createFileRoute("/game/$slug")({
  component: GamePage,
});

function GamePage() {
  const { slug } = Route.useParams();

  const [apiGame, setApiGame] = useState<any>(null);
  const [apiStores, setApiStores] = useState<any[]>([]);
  const [relatedGames, setRelatedGames] = useState<any[]>([]);
  const [loadingGame, setLoadingGame] = useState(true);
  const [notify, setNotify] = useState(true);
  const [targetPrice, setTargetPrice] = useState("");

  const game = getGameBySlug(slug);
  const wishlist = useWishlist();
  const user = getUserSession();

  useEffect(() => {
    async function loadGame() {
      try {
        setLoadingGame(true);
        setRelatedGames([]);

        const [gameData, storesData] = await Promise.all([
          getGameDetails(slug),
          getStores(),
        ]);

        setApiGame(gameData);
        setApiStores(storesData);

        if (gameData?.info?.title) {
          const related = await getRelatedGames(gameData.info.title);
          setRelatedGames(related.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load game details:", error);
      } finally {
        setLoadingGame(false);
      }
    }

    if (slug) loadGame();
  }, [slug]);

  if (!game && !apiGame && !loadingGame) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="text-3xl font-bold">Game not found</h1>
          <Link to="/" className="mt-4 inline-block text-[color:var(--neon)] hover:underline">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  const fallbackGame = game || GAMES[0];
  const currentWishlistId = game ? fallbackGame.id : slug;

  const fav = wishlist.some((item) => item.id === currentWishlistId);
  const low = lowestPrice(fallbackGame);
  const history = priceHistory(fallbackGame);
  const allTimeLow = Math.min(...history.map((h) => h.price));
  const sortedPrices = [...fallbackGame.prices].sort((a, b) => a.discounted - b.discounted);

  const apiDeals = apiGame?.deals || [];
  const title = apiGame?.info?.title || fallbackGame.title;
  const coverImage = apiGame?.info?.thumb;
  const heroImage = coverImage;

  const getApiStore = (storeID: string) =>
    apiStores.find((store) => store.storeID === storeID);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="relative h-[320px] w-full overflow-hidden md:h-[420px]">
        {heroImage ? (
          <img
            src={heroImage}
            alt={title}
            className="h-full w-full object-cover opacity-60 blur-sm scale-110"
          />
        ) : (
          <div className="h-full w-full" style={{ background: fallbackGame.banner }} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>



      <main className="mx-auto -mt-32 max-w-7xl px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="space-y-4">
            <div className="glass overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <div className="aspect-[3/4] w-full bg-black/40">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={title}
                    className="h-full w-full object-contain p-4"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="flex h-full items-end p-5 text-3xl font-black uppercase leading-none text-white/95 drop-shadow-xl"
                    style={{ background: fallbackGame.cover }}
                  >
                    {title}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={async () => {
                console.log("USER SESSION:", user);

                if (!user?.id) {
                  toast.error("Please login again");
                  return;
                }

                try {
                  const result = await toggleWishlistDb({
                    data: {
                      userId: user.id,
                      gameId: currentWishlistId,
                      title,
                      image: coverImage || "",
                      cheapest: String(apiDeals?.[0]?.price || ""),
                      source: apiGame ? "api" : "mock",
                    },
                  });

                  console.log("DB WISHLIST RESULT:", result);

                  toggleWishlist(currentWishlistId, {
                    title,
                    image: coverImage,
                    cheapest: apiDeals?.[0]?.price,
                    source: apiGame ? "api" : "mock",
                  });

                  toast(result.added ? "Added to wishlist" : "Removed from wishlist");
                } catch (error) {
                  console.error("Wishlist DB error:", error);
                  toast.error("Wishlist save failed");
                }
              }}
              className={`w-full ${fav
                ? "bg-[color:var(--neon)] text-background"
                : "bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background"
                }`}
            >
              <Heart className={`mr-2 h-4 w-4 ${fav ? "fill-current" : ""}`} />
              {fav ? "In your wishlist" : "Add to wishlist"}
            </Button>

            <div className="glass space-y-4 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Bell className="h-4 w-4" />
                  Notify on price drop
                </div>

                <Switch checked={notify} onCheckedChange={setNotify} />
              </div>

              {notify && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    Notify me below
                  </label>

                  <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-3">
                    <span className="text-sm text-muted-foreground">$</span>

                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="15"
                      className="h-10 w-full bg-transparent px-2 text-sm outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-white/15 bg-white/5"
              onClick={() => {
                localStorage.setItem(
                  `price_alert_${currentWishlistId}`,
                  JSON.stringify({
                    gameId: currentWishlistId,
                    title,
                    targetPrice,
                    notify,
                  })
                );

                toast.success("Price alert saved");
              }}
            >
              Save alert
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {fallbackGame.genre.map((g) => (
                  <Badge key={g} variant="outline" className="border-white/15 bg-white/5">
                    {g}
                  </Badge>
                ))}
              </div>

              <h1 className="mt-3 text-4xl font-black md:text-5xl">{title}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {fallbackGame.rating} / 5
                </span>

                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {new Date(fallbackGame.releaseDate).toLocaleDateString()}
                </span>

                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-[color:var(--neon)]" />
                  Lowest ever ${allTimeLow.toFixed(2)}
                </span>
              </div>

              <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
                {apiGame?.info?.title
                  ? `Live pricing data loaded from CheapShark for ${apiGame.info.title}.`
                  : fallbackGame.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Platforms:</span>
                {fallbackGame.platforms.map((p) => (
                  <Badge key={p} className="bg-white/10 text-foreground hover:bg-white/15">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="glass overflow-hidden rounded-2xl">
              <div className="border-b border-white/10 p-5">
                <h2 className="text-xl font-bold">Price comparison</h2>
                <p className="text-sm text-muted-foreground">
                  Live prices from CheapShark. Mock prices are used as fallback.
                </p>
              </div>

              <div className="divide-y divide-white/10">
                {loadingGame ? (
                  <div className="p-5 text-sm text-muted-foreground">Loading live prices...</div>
                ) : apiDeals.length > 0 ? (
                  apiDeals.map((deal: any, i: number) => {
                    const store = getApiStore(deal.storeID);

                    return (
                      <div key={deal.dealID} className="flex items-center gap-4 p-4">
                        <div className="w-6 text-xs text-muted-foreground">#{i + 1}</div>

                        <div className="flex flex-1 items-center gap-3 text-sm font-medium">
                          {store?.images?.logo && (
                            <img
                              src={`https://www.cheapshark.com${store.images.logo}`}
                              alt={store.storeName}
                              className="h-6 w-6 object-contain"
                              loading="lazy"
                            />
                          )}

                          <span>{store?.storeName || `Store #${deal.storeID}`}</span>
                        </div>

                        <div className="hidden min-w-[60px] text-right text-sm text-muted-foreground line-through sm:block">
                          {deal.retailPrice ? `$${deal.retailPrice}` : ""}
                        </div>

                        <div className="min-w-[80px] text-right font-bold text-[color:var(--neon)]">
                          ${deal.price}
                        </div>

                        <Button size="sm" variant="outline" className="border-white/15 bg-white/5" asChild>
                          <a
                            href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Buy <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    );
                  })
                ) : (
                  sortedPrices.map((p, i) => {
                    const store = STORES.find((s) => s.id === p.storeId)!;
                    const isLow = p.discounted === low.discounted;

                    return (
                      <div
                        key={p.storeId}
                        className={`flex items-center gap-4 p-4 ${isLow ? "bg-[color:var(--neon)]/5" : ""}`}
                      >
                        <div className="w-6 text-xs text-muted-foreground">#{i + 1}</div>

                        <div className="flex-1">
                          <StoreBadge store={store} />
                        </div>

                        {p.discountPercent > 0 && (
                          <Badge className="bg-[color:var(--success)]/20 text-[color:var(--success)] hover:bg-[color:var(--success)]/30">
                            -{p.discountPercent}%
                          </Badge>
                        )}

                        <div className="hidden min-w-[60px] text-right text-sm text-muted-foreground line-through sm:block">
                          {p.discountPercent > 0 ? `$${p.original.toFixed(2)}` : ""}
                        </div>

                        <div className={`min-w-[80px] text-right font-bold ${isLow ? "text-[color:var(--neon)]" : ""}`}>
                          ${p.discounted.toFixed(2)}
                        </div>

                        <Button size="sm" variant="outline" className="border-white/15 bg-white/5" asChild>
                          <a href={p.link}>
                            Buy <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h2 className="text-xl font-bold">Price history (90 days)</h2>

              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.78 0.18 200)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="oklch(0.78 0.18 200)" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="date"
                      stroke="oklch(0.68 0.03 260)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={30}
                    />

                    <YAxis
                      stroke="oklch(0.68 0.03 260)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.19 0.03 268)",
                        border: "1px solid oklch(1 0 0 / 0.1)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [`$${v.toFixed(2)}`, "Price"]}
                    />

                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="oklch(0.82 0.2 195)"
                      strokeWidth={2}
                      fill="url(#g1)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold">You might also like</h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(relatedGames.length > 0
                  ? relatedGames
                  : GAMES.filter((g) => g.id !== fallbackGame.id).slice(0, 4)
                ).map((item: any) => {
                  const isApiGame = Boolean(item.gameID);

                  return (
                    <Link
                      key={isApiGame ? item.gameID : item.id}
                      to="/game/$slug"
                      params={{ slug: isApiGame ? item.gameID : item.slug }}
                      className="glass glass-hover overflow-hidden rounded-xl"
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-black/40">
                        {isApiGame ? (
                          <img
                            src={item.thumb}
                            alt={item.external}
                            className="h-full w-full object-contain p-3"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full" style={{ background: item.cover }} />
                        )}
                      </div>

                      <div className="p-3">
                        <div className="line-clamp-1 text-sm font-semibold">
                          {isApiGame ? item.external : item.title}
                        </div>

                        <div className="text-xs text-[color:var(--neon)]">
                          ${isApiGame ? item.cheapest : lowestPrice(item).discounted.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}