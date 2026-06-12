import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin-login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const ok = loginAdmin(email, password);

    if (!ok) {
      alert("Invalid admin credentials");
      return;
    }

   navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <form
        onSubmit={handleLogin}
        className="glass w-full max-w-md space-y-5 rounded-3xl p-8"
      >
        <h1 className="text-3xl font-black">Admin Login</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin email"
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none"
        />

        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-cyan-400 font-bold text-black"
        >
          Login
        </button>
      </form>
    </div>
  );
}