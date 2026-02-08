"use client";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export default function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slideUpFade`}
    >
      <div
        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm transition-shadow duration-200 ${
          isUser
            ? "bg-gradient-to-br from-[#E07856] to-[#C85C3D] text-white"
            : "border border-slate-200/50 bg-white text-slate-800 dark:border-slate-700/50 dark:bg-slate-900 dark:text-slate-100"
        }`}
        style={{
          boxShadow: isUser
            ? "var(--shadow-terracotta-md)"
            : "var(--shadow-md)",
          fontSize: "var(--font-size-sm)",
          lineHeight: "var(--line-height-sm)",
        }}
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
