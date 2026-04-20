"use client";

const JSON_BLOCK_REGEX = /```json\s*\n?([\s\S]*?)\n?\s*```/g;
const XML_TAG_REGEX = /<\/?[a-zA-Z][\w-]*(?:\s[^>]*)?\/?>/g;

function stripJsonBlocks(content: string): string {
  return content.replace(JSON_BLOCK_REGEX, "").replace(XML_TAG_REGEX, "").trim();
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
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed transition-shadow duration-200 ${
          isUser
            ? "bg-[var(--color-indigo)] text-white shadow-md shadow-[var(--color-indigo)]/10 dark:bg-[#2a2520] dark:text-[#e8e0d4]"
            : "border border-[var(--color-cream-dark)] bg-white/80 text-slate-700 shadow-sm dark:border-[#2a2520] dark:bg-[#1a1714]/80 dark:text-slate-200"
        }`}
      >
        {displayContent ? (
          <p className="whitespace-pre-wrap">{displayContent}</p>
        ) : (
          <p className="italic text-slate-400 dark:text-slate-500">
            No content to display
          </p>
        )}
      </div>
    </div>
  );
}
