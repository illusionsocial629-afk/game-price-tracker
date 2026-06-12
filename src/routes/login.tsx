import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loginUserDb } from "@/lib/auth.server";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await loginUserDb({
        data: {
          email,
          password,
        },
      });

      if (!result.success) {
        toast.error(result.message || "Login failed");
        return;
      }

      localStorage.setItem(
        "gameprice_user",
        JSON.stringify(result.user)
      );

      toast.success("Welcome back!");

      navigate({
        to: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back, player"
      subtitle="Sign in to access your wishlist and alerts."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>

            <Link
              to="/forgot-password"
              className="text-xs text-[color:var(--neon)] hover:underline"
            >
              Forgot?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          disabled={loading}
          className="w-full bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background"
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="relative my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-white/10" />
        OR
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        variant="outline"
        className="w-full border-white/15 bg-white/5"
        onClick={() => toast("Google sign-in coming soon")}
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link
          to="/signup"
          className="text-[color:var(--neon)] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}