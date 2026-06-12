import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/stores")({
  component: StoresAdminPage,
});

function StoresAdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">
        Manage Stores
      </h1>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        Stores management panel
      </div>
    </div>
  );
}