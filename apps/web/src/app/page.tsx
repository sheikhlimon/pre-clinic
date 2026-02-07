"use client";

import { Sparkles } from "lucide-react";
import ChatInterface from "@/components/chat/chat-interface";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="flex h-svh flex-col bg-gradient-to-br from-stone-50 to-rose-50/20 dark:from-stone-950 dark:to-stone-900">
      {/* Compact Header with Logo + Dark Toggle */}
      <section className="flex flex-shrink-0 items-center justify-between border-stone-200/50 border-b bg-white/80 px-6 py-4 backdrop-blur-sm md:px-8 dark:border-stone-800/50 dark:bg-stone-900/80">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 font-bold text-white shadow-lg shadow-rose-500/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            Pre-Clinic
          </span>
        </div>

        {/* Dark mode toggle */}
        <ModeToggle />
      </section>

      {/* Compact headline */}
      <div className="flex flex-shrink-0 flex-col items-center px-4 pt-6 md:px-6">
        <h1 className="text-center font-bold text-2xl tracking-tight md:text-3xl">
          Find Your Perfect{" "}
          <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
            Clinical Trial
          </span>
        </h1>
        <p className="mt-2 text-center text-muted-foreground text-sm md:text-base">
          AI-powered matching to discover trials tailored to you
        </p>
      </div>

      {/* Chat Interface - takes remaining space */}
      <div className="flex flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
