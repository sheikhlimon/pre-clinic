"use client";

import type { Condition } from "@/lib/types";

interface ConditionCardProps {
  condition: Condition;
}

export default function ConditionCard({ condition }: ConditionCardProps) {
  return (
    <div className="rounded-lg bg-white/50 px-3 py-2.5 shadow-sm dark:bg-slate-800/50">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-medium text-slate-800 text-xs dark:text-slate-200">
          {condition.name}
        </span>
        <span className="rounded-full bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-coral)] px-2 py-0.5 font-bold text-white text-xs">
          {condition.probability}%
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-coral)] transition-all duration-500"
          style={{ width: `${condition.probability}%` }}
        />
      </div>
    </div>
  );
}
