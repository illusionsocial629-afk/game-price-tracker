import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdminDb } from "@/lib/auth.server";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await loginAdminDb({
        data: {
          email,
          password,
        },
      });

      if (!result.success) {
        alert(result.message || "Invalid admin credentials");
        return;
      }

      localStorage.setItem("gameprice_admin_logged_in", "true");
      localStorage.setItem("gameprice_admin_token", result.token || "");
localStorage.setItem("gameprice_admin", JSON.stringify(result.admin));

      navigate({
        to: "/admin",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <form
        onSubmit={handleLogin}
        className="glass w-full max-w-md space-y-5 rounded-3xl p-8"
      >
        <h1 className="text-3xl font-black">Admin Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-cyan-400 font-bold text-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}