import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Reset link sent (demo)");
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" required />
        </div>
        <Button className="w-full bg-gradient-to-r from-[color:var(--neon)] to-[color:var(--neon-violet)] text-background">
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it? <Link to="/login" className="text-[color:var(--neon)] hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
