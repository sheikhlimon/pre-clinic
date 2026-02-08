"use client";

import ChatInterface from "@/components/chat/chat-interface";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Chat Interface - takes full space, handles navbar and hero internally */}
      <div className="flex min-h-0 flex-1 overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <ChatInterface />
      </div>
    </main>
  );
}
