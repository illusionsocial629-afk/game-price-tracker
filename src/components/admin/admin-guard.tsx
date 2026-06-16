import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminToken, logoutAdmin } from "@/lib/admin-auth";
import { verifyAdminSessionDb } from "@/lib/auth.server";

export function AdminGuard({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}