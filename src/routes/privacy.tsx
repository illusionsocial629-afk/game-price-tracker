import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-24">
        <h1 className="mb-2 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Last Updated: June 2026
        </p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Information We Collect
            </h2>
            <p>
              We may collect your username, email address, wishlist data, price
              alert preferences, and basic usage information required to provide
              GamePrice Tracker.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              How We Use Information
            </h2>
            <p>
              We use your information to manage accounts, save wishlists,
              deliver alerts, improve the platform, prevent abuse, and respond
              to support requests.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Third-Party Services
            </h2>
            <p>
              Game data, pricing, images, and store links may come from
              third-party APIs or services. Their own privacy policies apply.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Data Security
            </h2>
            <p>
              We use reasonable safeguards to protect your data from
              unauthorized access, disclosure, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Contact
            </h2>
            <p>For privacy questions, contact:</p>
            <a
              href="mailto:illusionsocial629@gmail.com"
              className="text-[color:var(--neon)] hover:underline"
            >
              illusionsocial629@gmail.com
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}