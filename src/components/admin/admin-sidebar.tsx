import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Gamepad2,
  Store,
  DollarSign,
  LogOut,
  Users,
} from "lucide-react";
import { logoutAdmin } from "@/lib/admin-auth";

export function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-black/40 p-6 backdrop-blur-xl">
      <h2 className="mb-8 text-xl font-bold text-white">Admin Panel</h2>

      <nav className="space-y-3">
        <Link
          to="/admin"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>

        <Link
          to="/admin/games"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          <Gamepad2 className="h-5 w-5" />
          Games
        </Link>

        <Link
          to="/admin/stores"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          <Store className="h-5 w-5" />
          Stores
        </Link>

        <Link
  to="/admin/users"
  className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-white"
>
  <Users className="h-5 w-5" />
  Users
</Link>

        <Link
          to="/admin/prices"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          <DollarSign className="h-5 w-5" />
          Prices
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => {
            logoutAdmin();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 transition hover:bg-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}