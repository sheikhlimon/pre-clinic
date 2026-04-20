"use client";

interface PromptCardProps {
  text: string;
  onSelect: (text: string) => void;
  index: number;
}

export default function PromptCard({ text, onSelect, index }: PromptCardProps) {
  return (
    <button
      className={`group cursor-pointer relative overflow-hidden rounded-2xl border border-[var(--color-cream-dark)] bg-white/70 px-6 py-5 text-left backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-terracotta)]/30 hover:bg-white hover:shadow-lg hover:shadow-[var(--color-terracotta)]/5 dark:border-[#2a2520] dark:bg-[#1a1714]/70 dark:hover:border-[var(--color-terracotta)]/30 dark:hover:bg-[#1a1714] animate-slideUpFade stagger-${index + 1}`}
      onClick={() => onSelect(text)}
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-terracotta)]/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <p className="relative text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {text}
      </p>
    </button>
  );
}
