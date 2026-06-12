import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Clock, Heart, Settings, Trash2 } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { toggleWishlist, useWishlist } from "@/lib/wishlist-store";
import { getUserSession, logoutUser } from "@/lib/user-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function WishlistCard({ item }: { item: any }) {
  return (
    <Link
      key={item.id}
      to="/game/$slug"
      params={{ slug: item.id }}
      className="glass glass-hover overflow-hidden rounded-xl"
    >
      <div className="aspect-[3/4] w-full overflow-hidden bg-white/5">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-contain p-4"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-white/5 p-4 text-center text-sm text-muted-foreground">
            {item.title}
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-semibold">{item.title}</h3>

        <div className="text-sm text-muted-foreground">Cheapest price</div>

        <div className="font-bold text-[color:var(--neon)]">
          {item.cheapest ? `$${item.cheapest}` : "Tracking"}
        </div>
      </div>
    </Link>
  );
}

function Dashboard() {
  const user = getUserSession();
  const wishlist = useWishlist();
  const savedAlerts = Object.keys(localStorage)
  .filter((key) => key.startsWith("price_alert_"))
  .map((key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return null;
    }
  })
  .filter(Boolean);
  const wishGames = wishlist;
  const recent = wishGames.slice(0, 4);

  const initials =
    user?.username?.slice(0, 2).toUpperCase() ||
    user?.email?.slice(0, 2).toUpperCase() ||
    "GU";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="glass flex flex-col items-start gap-5 rounded-2xl p-6 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 ring-2 ring-[color:var(--neon)]/40">
            <AvatarFallback className="bg-gradient-to-br from-[color:var(--neon)] to-[color:var(--neon-violet)] font-bold text-background">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {user?.username || "Guest"}
            </h1>

            <p className="text-sm text-muted-foreground">
              {user?.email || "guest@example.com"}
              {user?.createdAt
                ? ` · Joined ${new Date(user.createdAt).toLocaleDateString()}`
                : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center">
              <div className="text-xs text-muted-foreground">Wishlist</div>
              <div className="text-xl font-bold">{wishGames.length}</div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center">
              <div className="text-xs text-muted-foreground">Alerts</div>
              <div className="text-xl font-bold">
                {savedAlerts.length}
              </div>
            </div>

            <Button
              variant="outline"
              className="border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              onClick={() => {
                logoutUser();
                toast.success("Logged out");
                window.location.href = "/";
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="wishlist" className="mt-8">
          <TabsList className="bg-white/5">
            <TabsTrigger value="wishlist">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </TabsTrigger>

            <TabsTrigger value="recent">
              <Clock className="mr-2 h-4 w-4" />
              Recent
            </TabsTrigger>

            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
            </TabsTrigger>

            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wishlist" className="mt-6">
            {wishGames.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Heart className="mx-auto h-10 w-10 text-muted-foreground" />

                <h3 className="mt-4 text-lg font-semibold">
                  Your wishlist is empty
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Browse the catalog and tap the heart icon to start tracking.
                </p>

                <Link to="/search" search={{ q: "" }}>
                  <Button className="mt-5 bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background">
                    Browse games
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {wishGames.map((item) => (
                  <WishlistCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            {recent.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Clock className="mx-auto h-10 w-10 text-muted-foreground" />

                <h3 className="mt-4 text-lg font-semibold">
                  No recent tracked games
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add games to your wishlist and they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {recent.map((item) => (
                  <WishlistCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

         <TabsContent value="notifications" className="mt-6">
  {savedAlerts.length === 0 ? (
    <div className="glass rounded-2xl p-12 text-center">
      <Bell className="mx-auto h-10 w-10 text-muted-foreground" />

      <h3 className="mt-4 text-lg font-semibold">No price alerts yet</h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Open any game and set a target price to start tracking.
      </p>
    </div>
  ) : (
    <div className="glass divide-y divide-white/10 rounded-2xl">
      {savedAlerts.map((alert: any) => (
        <div key={alert.gameId} className="flex items-start gap-4 p-5">
          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--neon)] shadow-[0_0_8px_var(--neon)]" />

          <div className="flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="font-semibold">{alert.title}</h4>

              <span className="text-xs text-muted-foreground">
                Target: ${alert.targetPrice}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              You will be notified when this game drops below your target price.
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              localStorage.removeItem(`price_alert_${alert.gameId}`);
              window.location.reload();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )}
</TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="glass space-y-6 rounded-2xl p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input defaultValue={user?.username || ""} />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email || ""} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Price drop notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Email me when a wishlisted game goes on sale.
                    </div>
                  </div>

                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Browser push via Firebase Cloud Messaging.
                    </div>
                  </div>

                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly digest</div>
                    <div className="text-sm text-muted-foreground">
                      Top deals delivered every Friday.
                    </div>
                  </div>

                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background"
                  onClick={() => toast.success("Settings saved")}
                >
                  Save changes
                </Button>

                <Button
                  variant="outline"
                  className="border-white/15 bg-white/5"
                  onClick={() => {
                    wishlist.forEach((item) => toggleWishlist(item.id));
                    toast("Wishlist cleared");
                  }}
                >
                  Clear wishlist
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}