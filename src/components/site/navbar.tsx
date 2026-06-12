import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Gamepad2, Search, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const submit = (e: React.FormEvent) => {
  e.preventDefault();

  const query = q.trim();

  if (!query) return;

  nav({
    to: "/search",
    search: {
      q: query,
    },
    replace: false,
  });

  setQ("");
};
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background neon-glow">
            <Gamepad2 className="h-5 w-5" />
          </span>
          <span className="hidden text-lg tracking-tight sm:inline">
            GamePrice<span className="text-gradient">Tracker</span>
          </span>
        </Link>

        <form onSubmit={submit} className="relative mx-auto hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search any game…"
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm outline-none transition focus:border-[color:var(--neon)]/60 focus:bg-white/10"
          />
        </form>

        <nav className="ml-auto flex items-center gap-1">
          <Link to="/search" search={{ q: "" }} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Browse</Link>
          <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
          {/* <Link to="/admin" className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:inline">Admin</Link> */}
          <Link to="/dashboard" className="relative ml-1 rounded-md p-2 text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[color:var(--neon)] shadow-[0_0_8px_var(--neon)]" />
          </Link>
          <Link to="/login">
            <Button size="sm" variant="ghost" className="gap-2">
              <User className="h-4 w-4" /> Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background hover:opacity-90">
              Sign up
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
