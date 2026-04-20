"use client";

const JSON_BLOCK_REGEX = /```json\s*\n?([\s\S]*?)\n?\s*```/g;

function stripJsonBlocks(content: string): string {
  return content.replace(JSON_BLOCK_REGEX, "").trim();
}

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export default function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === "user";
  const displayContent = isUser ? content : stripJsonBlocks(content);

  if (!(isUser || displayContent)) return null;

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-slideUpFade`}
    >
      <div
        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm transition-shadow duration-200 ${
          isUser
            ? "bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] text-white shadow-[var(--shadow-terracotta-md)]"
            : "border border-slate-200/50 bg-white text-slate-800 shadow-[var(--shadow-sm)] dark:border-slate-700/50 dark:bg-slate-900 dark:text-slate-100"
        }`}
      >
        {displayContent ? (
          <p className="whitespace-pre-wrap leading-relaxed">
            {displayContent}
          </p>
        ) : (
          <p className="italic text-slate-400 dark:text-slate-500">
            No content to display
          </p>
        )}
      </div>
    </div>
  );
}
