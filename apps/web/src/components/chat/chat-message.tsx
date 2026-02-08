"use client";

// Match JSON blocks in code format only
// Only strip actual JSON in code blocks, not text that happens to contain JSON-like words
const JSON_BLOCK_REGEX = /```json\s*\n?([\s\S]*?)\n?\s*```/g;

function stripJsonBlocks(content: string): string {
  // Only remove code block formatted JSON
  return content.replace(JSON_BLOCK_REGEX, "").trim();
}

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export default function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === "user";

  // Strip JSON blocks from assistant messages for display
  const displayContent = isUser ? content : stripJsonBlocks(content);

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
        {displayContent ? (
          <p className="whitespace-pre-wrap leading-relaxed">
            {displayContent}
          </p>
        ) : (
          <p className="text-slate-400 italic dark:text-slate-500">
            No content to display
          </p>
        )}
      </div>
    </div>
  );
}
