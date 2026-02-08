"use client";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export default function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md ${
          isUser
            ? "bg-gradient-to-br from-[#E07856] to-[#C85C3D] text-white shadow-[#E07856]/20"
            : "bg-white text-[#2C3E50] shadow-slate-200/50 dark:bg-slate-800 dark:text-slate-100 dark:shadow-slate-900/50"
        }`}
      >
        {content ? (
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        ) : (
          <p className="text-slate-400 italic dark:text-slate-500">
            No content to display
          </p>
        )}
      </div>
    </div>
  );
}
