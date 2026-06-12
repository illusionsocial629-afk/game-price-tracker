import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/games")({
  component: GamesAdminPage,
});

function GamesAdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">
        Manage Games
      </h1>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        Games management panel
      </div>
    </div>
  );
}