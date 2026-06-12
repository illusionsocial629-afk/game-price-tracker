import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-24">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>

        <p className="mb-8 text-muted-foreground">
          We'd love to hear from you. Whether you have a question, feature
          request, bug report, partnership opportunity, or general feedback,
          feel free to reach out.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Support & General Inquiries
          </h2>

          <p className="mb-4 text-muted-foreground">
            For account issues, wishlist problems, alert notifications, bug
            reports, feature suggestions, business inquiries, or general
            feedback, contact us at:
          </p>

          <a
            href="mailto:illusionsocial629@gmail.com"
            className="text-lg font-medium text-[color:var(--neon)] hover:underline"
          >
            illusionsocial629@gmail.com
          </a>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold">Response Time</h2>

          <p className="text-muted-foreground">
            We aim to respond to most inquiries within 24–48 business hours.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}