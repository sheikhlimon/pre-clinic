"use client";

import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) {
      return;
    }

    const message = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      await onSend(message);
    } finally {
      setIsLoading(false);
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <form
      className="flex gap-2 rounded-lg border border-muted-foreground/20 bg-background p-3"
      onSubmit={handleSubmit}
    >
      <textarea
        className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
        disabled={isLoading || disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
          }
        }}
        placeholder="Tell me about your symptoms..."
        ref={textareaRef}
        rows={1}
        value={input}
      />
      <button
        className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        disabled={!input.trim() || isLoading || disabled}
        type="submit"
      >
        {isLoading ? "..." : "→"}
      </button>
    </form>
  );
}
