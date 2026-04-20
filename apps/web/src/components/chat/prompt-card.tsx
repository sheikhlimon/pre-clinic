"use client";

interface PromptCardProps {
  text: string;
  onSelect: (text: string) => void;
}

export default function PromptCard({ text, onSelect }: PromptCardProps) {
  return (
    <button
      className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-[var(--color-terracotta)]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-[var(--color-terracotta)]/30"
      onClick={() => onSelect(text)}
      type="button"
    >
      <p className="text-base text-slate-700 dark:text-slate-200">{text}</p>
    </button>
  );
}
