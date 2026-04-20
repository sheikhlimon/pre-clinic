"use client";

import type { Condition } from "@/lib/types";

interface ConditionCardProps {
  condition: Condition;
}

export default function ConditionCard({ condition }: ConditionCardProps) {
  return (
    <div className="rounded-xl bg-[var(--color-cream)]/60 px-3 py-2.5 dark:bg-[#1a1714]/60">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
          {condition.name}
        </span>
        <span className="rounded-full bg-[var(--color-terracotta)] px-2 py-0.5 text-xs font-bold text-white">
          {condition.probability}%
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-cream-dark)] dark:bg-[#2a2520]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-coral)] transition-all duration-500"
          style={{ width: `${condition.probability}%` }}
        />
      </div>
    </div>
  );
}
