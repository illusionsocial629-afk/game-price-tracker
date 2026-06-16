import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getAdminToken, logoutAdmin } from "@/lib/admin-auth";
import { verifyAdminSessionDb } from "@/lib/auth.server";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const token = getAdminToken();

      if (!token) {
        navigate({ to: "/admin-login" });
        return;
      }

      const result = await verifyAdminSessionDb({
        data: { token },
      });

      if (!result.valid) {
        logoutAdmin();
        navigate({ to: "/admin-login" });
        return;
      }

      setChecking(false);
    }

    checkAdmin();
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="mt-2 text-muted-foreground">
          Manage games, stores, prices, users, and platform data.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Games</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage game records and metadata.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Stores</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage store data and links.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View registered users.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}