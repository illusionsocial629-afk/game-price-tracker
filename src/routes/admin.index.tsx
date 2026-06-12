import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Edit, Plus, Store as StoreIcon, Tag, Trash2, Trophy } from "lucide-react";
import { StoreBadge } from "@/components/site/store-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GAMES, STORES, lowestPrice } from "@/lib/mock-data";
import { toast } from "sonner";
import { useEffect } from "react";
import { isAdminLoggedIn } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
export const Route = createFileRoute("/admin/")({
  component: Admin,
});

function Admin() {
  const navigate = useNavigate();

useEffect(() => {
  if (!isAdminLoggedIn()) {
   navigate({ to: "/admin-login" as any });
  }
}, [navigate]);
  return (
  <div className="flex min-h-screen bg-black text-white">
    <AdminSidebar />
    <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin panel</h1>
            <p className="text-sm text-muted-foreground">
              Manage games, stores, prices and featured deals.
            </p>
          </div>
          <Badge className="bg-[color:var(--neon-violet)]/20 text-[color:var(--neon-violet)]">
            Demo · read-only
          </Badge>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <Stat label="Games" value={GAMES.length} />
          <Stat label="Stores" value={STORES.length} />
          <Stat
            label="Active deals"
            value={GAMES.reduce(
              (n, g) => n + g.prices.filter((p) => p.discountPercent > 0).length,
              0
            )}
          />
          <Stat
            label="Avg discount"
            value={`${Math.round(
              GAMES.reduce((s, g) => s + lowestPrice(g).discountPercent, 0) /
                GAMES.length
            )}%`}
          />
        </div>

        <Tabs defaultValue="games" className="mt-8">
          <TabsList className="bg-white/5">
            <TabsTrigger value="games">
              <Trophy className="mr-2 h-4 w-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="stores">
              <StoreIcon className="mr-2 h-4 w-4" />
              Stores
            </TabsTrigger>
            <TabsTrigger value="prices">
              <Tag className="mr-2 h-4 w-4" />
              Price logs
            </TabsTrigger>
            <TabsTrigger value="featured">Featured deals</TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="mt-6">
            <PanelHeader title="Manage games" onAdd="game" />
            <div className="glass overflow-hidden rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Title</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Lowest price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {GAMES.map((g) => (
                    <TableRow key={g.id} className="border-white/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-md"
                            style={{ background: g.cover }}
                          />
                          <div className="font-medium">{g.title}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {g.genre.join(", ")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {g.platforms.join(", ")}
                      </TableCell>
                      <TableCell className="font-semibold text-[color:var(--neon)]">
                        ${lowestPrice(g).discounted.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toast("Edit (demo)")}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => toast("Delete (demo)")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="stores" className="mt-6">
            <PanelHeader title="Manage stores" onAdd="store" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STORES.map((s) => (
                <div key={s.id} className="glass glass-hover rounded-2xl p-5">
                  <StoreBadge store={s} size="lg" />
                  <div className="mt-3 truncate text-xs text-muted-foreground">
                    {s.website}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/15 bg-white/5"
                    >
                      Edit
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="prices" className="mt-6">
            <div className="glass overflow-hidden rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead>Game</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Original</TableHead>
                    <TableHead>Discounted</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {GAMES.flatMap((g) =>
                    g.prices
                      .filter((p) => p.discountPercent > 0)
                      .map((p) => ({ g, p }))
                  )
                    .slice(0, 20)
                    .map(({ g, p }, i) => {
                      const store = STORES.find((s) => s.id === p.storeId)!;

                      return (
                        <TableRow key={i} className="border-white/10">
                          <TableCell className="font-medium">{g.title}</TableCell>
                          <TableCell>{store.name}</TableCell>
                          <TableCell className="text-muted-foreground line-through">
                            ${p.original.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-[color:var(--neon)]">
                            ${p.discounted.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-[color:var(--success)]/20 text-[color:var(--success)]">
                              -{p.discountPercent}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            a few minutes ago
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="featured" className="mt-6">
            <PanelHeader title="Featured deals" onAdd="deal" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GAMES.slice(0, 6).map((g) => (
                <div key={g.id} className="glass overflow-hidden rounded-2xl">
                  <div className="h-32" style={{ background: g.banner }} />
                  <div className="p-4">
                    <div className="font-semibold">{g.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {g.genre.join(" · ")}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge className="bg-[color:var(--success)]/20 text-[color:var(--success)]">
                        -{lowestPrice(g).discountPercent}%
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/15 bg-white/5"
                      >
                        Unfeature
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold text-gradient">{value}</div>
    </div>
  );
}

function PanelHeader({ title, onAdd }: { title: string; onAdd: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button
        className="bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background"
        onClick={() => toast(`New ${onAdd} (demo)`)}
      >
        <Plus className="mr-1 h-4 w-4" />
        Add new
      </Button>
    </div>
  );
}