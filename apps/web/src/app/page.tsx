"use client";

import ChatInterface from "@/components/chat/chat-interface";

export default function Home() {
  return (
    <main className="grain flex h-svh flex-col bg-[var(--color-cream)] dark:bg-[#141210]">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
