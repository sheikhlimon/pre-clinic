import ChatInterface from "@/components/chat/chat-interface";
import Hero from "@/components/landing/hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Chat Interface */}
      <ChatInterface />

      {/* Footer */}
      <footer className="border-t px-4 py-12 md:px-6">
        <div className="container text-center text-muted-foreground text-sm">
          <p>© 2026 Pre-Clinic. Healthcare Hackathon Project.</p>
        </div>
      </footer>
    </main>
  );
}
