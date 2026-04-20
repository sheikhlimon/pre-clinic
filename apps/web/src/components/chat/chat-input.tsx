"use client";

import { Loader2, Send } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  useEffect(() => {
    if (!isLoading && textareaRef.current && document.hasFocus()) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e as unknown as FormEvent);
      }
    },
    [onSubmit],
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.currentTarget.setSelectionRange(value.length, value.length);
    },
    [value.length],
  );

  return (
    <div className="flex flex-shrink-0 flex-col gap-2.5 px-4 py-3 pb-safe">
      <form onSubmit={onSubmit}>
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-cream-dark)] bg-white/90 px-3 py-2 shadow-lg shadow-black/[0.03] backdrop-blur-sm transition-all duration-300 focus-within:border-[var(--color-terracotta)]/40 focus-within:shadow-[var(--color-terracotta)]/5 focus-within:shadow-xl dark:border-[#2a2520] dark:bg-[#1a1714]/90 dark:shadow-black/20">
            <textarea
              autoFocus
              className="flex-1 resize-none bg-transparent py-0.5 text-slate-700 text-base outline-none placeholder:text-slate-400/70 disabled:opacity-50 dark:text-slate-200"
              disabled={isLoading}
              onChange={onChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms or diagnosis..."
              ref={textareaRef}
              rows={1}
              value={value}
            />
            <button
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-terracotta)] text-white shadow-md shadow-[var(--color-terracotta)]/20 transition-all duration-200 hover:bg-[var(--color-terracotta-dark)] hover:shadow-lg disabled:opacity-40 disabled:shadow-none"
              disabled={!value.trim() || isLoading}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </form>

      <p className="text-center text-slate-400/80 text-xs dark:text-slate-500">
        For discovery only. Always consult a healthcare provider.
      </p>
    </div>
  );
}
