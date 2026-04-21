"use client";

import { useEffect, useRef, useState } from "react";

const JSON_BLOCK_REGEX = /```json\s*\n?([\s\S]*?)\n?\s*```/g;
const XML_TAG_REGEX = /<\/?[a-zA-Z][\w-]*(?:\s[^>]*)?\/?>/g;
const CHARS_PER_FRAME = 3;

function stripJsonBlocks(content: string): string {
  return content
    .replace(JSON_BLOCK_REGEX, "")
    .replace(XML_TAG_REGEX, "")
    .trim();
}

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export default function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === "user";
  const displayContent = isUser ? content : stripJsonBlocks(content);

  const [visibleLength, setVisibleLength] = useState(displayContent.length);
  const prevLengthRef = useRef(0);
  const isInitialMount = useRef(true);
  const rafRef = useRef(0);

  useEffect(() => {
    if (isUser || !displayContent) return;

    // On first render: show full content (restored from localStorage)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevLengthRef.current = displayContent.length;
      setVisibleLength(displayContent.length);
      return;
    }

    // Content grew = new response arrived → animate from 0
    if (displayContent.length > prevLengthRef.current) {
      setVisibleLength(0);
      prevLengthRef.current = displayContent.length;

      const target = displayContent.length;
      const tick = () => {
        setVisibleLength((prev) => {
          const next = prev + CHARS_PER_FRAME;
          if (next >= target) return target;
          rafRef.current = requestAnimationFrame(tick);
          return next;
        });
      };

      rafRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [displayContent, isUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!(isUser || displayContent)) return null;

  const text = isUser ? displayContent : displayContent.slice(0, visibleLength);
  const isTyping = !isUser && visibleLength < displayContent.length;

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
        {text ? (
          <p className="whitespace-pre-wrap">
            {text}
            {isTyping && (
              <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-slate-400" />
            )}
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
