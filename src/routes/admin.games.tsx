import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const Route = createFileRoute("/admin/games")({
  component: GamesAdminPage,
});

function GamesAdminPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <h1 className="mb-6 flex items-center gap-3 text-3xl font-bold">
            <Gamepad2 className="h-8 w-8 text-[color:var(--neon)]" />
            Manage Games
          </h1>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">
              Games Management
            </h2>

            <p className="text-muted-foreground">
              Add, edit, delete and manage games from the database.
            </p>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}