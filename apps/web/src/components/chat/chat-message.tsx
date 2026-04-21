"use client";

const JSON_BLOCK_COMPLETE = /```json\s*\n?[\s\S]*?\n?\s*```/g;
const JSON_BLOCK_OPEN = /```json\s*\n?/;
const XML_TAG_REGEX = /<\/?[a-zA-Z][\w-]*(?:\s[^>]*)?\/?>/g;

export function cleanStreamContent(content: string): string {
  const openMatch = content.match(JSON_BLOCK_OPEN);
  if (openMatch) {
    const openIndex = content.indexOf(openMatch[0]);
    const afterOpen = content.slice(openIndex + openMatch[0].length);
    if (afterOpen.indexOf("```") === -1) {
      content = content.slice(0, openIndex);
    }
  }
  return content
    .replace(JSON_BLOCK_COMPLETE, "")
    .replace(XML_TAG_REGEX, "")
    .trim();
}

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

export default function ChatMessage({
  content,
  role,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = role === "user";
  const displayContent = isUser ? content : cleanStreamContent(content);

  // Only show typing dots while actively streaming with no visible content yet
  if (!isUser && isStreaming && !displayContent) {
    return (
      <div className="flex justify-start animate-slideUpFade">
        <div className="max-w-[85%] rounded-2xl border border-[var(--color-cream-dark)] bg-white/80 px-4 py-2.5 text-sm shadow-sm dark:border-[#2a2520] dark:bg-[#1a1714]/80">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-terracotta)] [animation-delay:0ms]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-terracotta)] [animation-delay:150ms]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-terracotta)] [animation-delay:300ms]" />
            </div>
            <span className="text-slate-400 dark:text-slate-500">Thinking...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isUser && !displayContent) return null;

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
        <p className="whitespace-pre-wrap">
          {displayContent}
        </p>
      </div>
    </div>
  );
}
