import { Link } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-4 w-4 text-[color:var(--neon)]" />
          <span>GamePrice Tracker — Built for gamers.</span>
        </div>

        <div className="flex gap-5">
          <Link
            to="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </Link>

          <Link
            to="/terms"
            className="hover:text-foreground transition-colors"
          >
            Terms
          </Link>

          <Link
            to="/contact"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}