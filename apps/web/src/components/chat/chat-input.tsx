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

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  // Keep focus when not loading
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
    [onSubmit]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.currentTarget.setSelectionRange(value.length, value.length);
    },
    [value.length]
  );

  return (
    <div className="flex flex-shrink-0 flex-col gap-3 px-4 py-4 pb-safe">
      <form onSubmit={onSubmit}>
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-200/50 transition-all focus-within:border-[var(--color-terracotta)]/30 focus-within:shadow-[var(--color-terracotta)]/10 focus-within:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
            <textarea
              autoFocus
              className="flex-1 resize-none bg-transparent py-0.5 text-base outline-none placeholder:text-slate-400 disabled:opacity-50"
              disabled={isLoading}
              onChange={onChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your symptoms..."
              ref={textareaRef}
              rows={1}
              value={value}
            />
            <button
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] text-white shadow-[var(--color-terracotta)]/20 shadow-lg transition-all hover:shadow-[var(--color-terracotta)]/30 hover:shadow-xl disabled:opacity-50"
              disabled={!value.trim() || isLoading}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </form>

      <p className="text-center text-slate-600 text-xs dark:text-slate-400">
        Always consult with a healthcare provider. This tool is for discovery,
        not diagnosis.
      </p>
    </div>
  );
}
