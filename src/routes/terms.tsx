import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-24">
        <h1 className="mb-2 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Last Updated: June 2026
        </p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using GamePrice Tracker, you agree to these Terms
              of Service and applicable laws.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Accounts & Security
            </h2>
            <p>
              You are responsible for maintaining your account credentials and
              all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Price Disclaimer
            </h2>
            <p>
              Game prices, discounts, ratings, availability, and store links are
              provided by third-party sources and may change without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Third-Party Links
            </h2>
            <p>
              We are not responsible for external stores, websites, products,
              services, or purchases made through third-party links.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Limitation of Liability
            </h2>
            <p>
              GamePrice Tracker is provided as-is. We are not liable for losses
              or damages resulting from use of the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">
              Contact
            </h2>
            <p>For questions about these Terms, contact:</p>
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