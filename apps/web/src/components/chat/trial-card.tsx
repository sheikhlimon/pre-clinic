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
        "noopener",
      );
    }
  };

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return "from-emerald-500 to-teal-500";
    if (scoreValue >= 60)
      return "from-[var(--color-terracotta)] to-[var(--color-coral)]";
    return "from-amber-500 to-orange-500";
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-slate-200/50 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-900/80">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:via-slate-800" />

      <div className="relative">
        <div className="mb-3 flex items-start gap-3">
          <h3 className="flex-1 text-sm font-medium leading-snug tracking-tight text-slate-800 dark:text-slate-100">
            {title}
          </h3>

          <div className="relative flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-coral)] p-0.5">
            <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm">
              <BadgePercent className="h-3 w-3 text-[var(--color-terracotta)]" />
              <span className="text-xs font-bold text-slate-800">{score}</span>
            </div>
          </div>
        </div>

        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100/80 dark:bg-slate-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)} shadow-sm transition-all duration-500 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="mb-4 space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
            <Building2 className="h-3 w-3 text-[var(--color-terracotta)]" />
            Why this matches
          </p>
          <ul className="ml-5 space-y-1.5">
            {reasons.map((reason) => (
              <li
                className="text-xs leading-relaxed marker:text-emerald-500 dark:text-slate-400"
                key={reason}
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <button
          className="group/btn focus-ring relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98]"
          onClick={handleClick}
          type="button"
        >
          <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-[100%]" />
          <span className="relative">View Trial</span>
          <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
