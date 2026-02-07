"use client";

import { ArrowUpRight, BadgePercent, Building2 } from "lucide-react";

interface TrialCardProps {
  title: string;
  nctId: string;
  score: number;
  reasons: string[];
  onViewClick?: () => void;
}

export default function TrialCard({
  title,
  nctId,
  score,
  reasons,
  onViewClick,
}: TrialCardProps) {
  const handleClick = () => {
    if (onViewClick) {
      onViewClick();
    } else {
      window.open(
        `https://clinicaltrials.gov/study/${nctId}`,
        "_blank",
        "noopener"
      );
    }
  };

  return (
    <div className="group fade-in-0 slide-in-from-bottom-6 my-4 animate-in rounded-2xl border border-stone-200 bg-white p-4 shadow-lg shadow-stone-500/5 transition-all duration-500 hover:shadow-stone-500/10 hover:shadow-xl dark:border-stone-800 dark:bg-stone-900 dark:shadow-stone-900/50">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="flex-1 font-medium text-sm text-stone-800 leading-snug dark:text-stone-100">
          {title}
        </h3>
        <div className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 px-3 py-1.5 font-bold text-white text-xs shadow-lg shadow-rose-500/10">
          <BadgePercent className="h-3 w-3" />
          <span>{score}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 shadow-sm transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Reasons */}
      <div className="mb-4 space-y-2">
        <p className="flex items-center gap-1.5 font-medium text-stone-600 text-xs uppercase dark:text-stone-400">
          <Building2 className="h-3 w-3" />
          Why this matches:
        </p>
        <ul className="ml-6 space-y-1.5">
          {reasons.map((reason) => (
            <li
              className="text-muted-foreground text-xs leading-relaxed"
              key={reason}
            >
              • {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-rose-600 px-4 py-2.5 font-medium text-white text-xs shadow-lg shadow-rose-500/10 transition-all hover:shadow-rose-500/20 hover:shadow-xl"
        onClick={handleClick}
        type="button"
      >
        <span>View Trial</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      </button>
    </div>
  );
}
