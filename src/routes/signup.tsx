
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signupUserDb } from "@/lib/auth.server";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const result = await signupUserDb({
        data: {
          username,
          email,
          password,
        },
      });

      if (!result.success) {
        toast.error(result.message || "Signup failed");
        return;
      }

      localStorage.setItem("gameprice_user", JSON.stringify(result.user));

      toast.success("Account created successfully");

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
      title="Start tracking deals"
      subtitle="Create your account and start saving games."
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>

          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="player_one"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
          />
        </div>

        <Button
          disabled={loading}
          className="w-full bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background"
        >
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>

      <div className="relative my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-white/10" /> OR{" "}
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        variant="outline"
        className="w-full border-white/15 bg-white/5"
        onClick={() => toast("Google sign-up coming soon")}
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Have an account?{" "}
        <Link to="/login" className="text-[color:var(--neon)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}