import Hero from "@/components/landing/hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Chat Interface Placeholder - Phase 0 next step */}
      <section className="px-4 py-24 md:px-6 md:py-32">
        <div className="container max-w-4xl">
          <p className="text-center text-muted-foreground">
            Chat interface coming next...
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-12 md:px-6">
        <div className="container text-center text-muted-foreground text-sm">
          <p>© 2026 Pre-Clinic. Healthcare Hackathon Project.</p>
        </div>
      </footer>
    </main>
  );
}
