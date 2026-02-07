"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`fade-in-0 slide-in-from-bottom-2 flex animate-in duration-300 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md ${
          isUser
            ? "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-rose-500/10"
            : "bg-white text-foreground shadow-stone-200/50 dark:bg-stone-800 dark:shadow-stone-900/50"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
