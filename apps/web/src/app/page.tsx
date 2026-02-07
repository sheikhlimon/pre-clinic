"use client";

import ChatInterface from "@/components/chat/chat-interface";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="flex h-svh flex-col">
      {/* Compact Hero with Logo + Dark Toggle */}
      <section className="flex flex-shrink-0 items-center justify-between border-b px-6 py-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 font-bold text-white shadow-sm">
            P
          </div>
          <span className="font-semibold text-lg">Pre-Clinic</span>
        </div>

        {/* Dark mode toggle */}
        <ModeToggle />
      </section>

      {/* Compact headline */}
      <div className="flex flex-shrink-0 flex-col items-center px-4 pt-6 md:px-6">
        <h1 className="text-center font-bold text-2xl tracking-tight md:text-3xl">
          Find Your Perfect{" "}
          <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
            Clinical Trial
          </span>
        </h1>
        <p className="mt-2 text-center text-muted-foreground text-sm md:text-base">
          AI-powered symptom matching to discover oncology trials
        </p>
      </div>

      {/* Chat Interface - takes remaining space */}
      <div className="flex flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
