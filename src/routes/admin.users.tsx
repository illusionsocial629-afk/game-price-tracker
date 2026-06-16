import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminGuard } from "@/components/admin/admin-guard";
import { getUsersDb } from "@/lib/auth.server";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function loadUsers() {
      const data = await getUsersDb();
      setUsers(data);
    }

    loadUsers();
  }, []);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <Users className="h-8 w-8 text-[color:var(--neon)]" />
              Users
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Registered users from PostgreSQL database.
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-muted-foreground">Total Users</div>

              <div className="mt-2 text-3xl font-bold">{users.length}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-muted-foreground">
                Latest Signup
              </div>

              <div className="mt-2 text-lg font-semibold">
                {users[0]?.username || "No users"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm text-muted-foreground">Active Auth</div>

              <div className="mt-2 text-lg font-semibold text-[color:var(--neon)]">
                PostgreSQL
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold">
                    Username
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold">Email</th>

                  <th className="px-6 py-4 text-sm font-semibold">Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-muted-foreground"
                    >
                      No users registered yet.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10">
                      <td className="px-6 py-4 font-medium">
                        {user.username || "Unknown"}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}