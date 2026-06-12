import { Link } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";
import { Footer } from "./footer";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-7xl items-center px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background neon-glow">
            <Gamepad2 className="h-5 w-5" />
          </span>
          <span>GamePrice<span className="text-gradient">Tracker</span></span>
        </Link>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-md place-items-center px-4 py-10">
        <div className="glass w-full rounded-2xl p-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
