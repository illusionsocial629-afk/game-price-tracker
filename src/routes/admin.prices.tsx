import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/prices")({
  component: PricesAdminPage,
});

function PricesAdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">
        Manage Prices
      </h1>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        Prices management panel
      </div>
    </div>
  );
}