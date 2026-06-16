import { createFileRoute } from "@tanstack/react-router";
import { BadgeDollarSign } from "lucide-react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const Route = createFileRoute("/admin/prices")({
  component: PricesAdminPage,
});

function PricesAdminPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <h1 className="mb-6 flex items-center gap-3 text-3xl font-bold">
            <BadgeDollarSign className="h-8 w-8 text-[color:var(--neon)]" />
            Manage Prices
          </h1>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-xl font-semibold">
              Price Management
            </h2>

            <p className="text-muted-foreground">
              Manage game prices, discounts, affiliate links, and store pricing data.
            </p>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}