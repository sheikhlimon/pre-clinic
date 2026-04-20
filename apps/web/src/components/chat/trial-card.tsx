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
    <div className="group relative my-2 overflow-hidden rounded-2xl border border-[var(--color-cream-dark)] bg-white/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg dark:border-[#2a2520] dark:bg-[#1a1714]/70 dark:hover:bg-[#1a1714]">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-terracotta)]/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-3 flex items-start gap-3">
          <h3 className="flex-1 text-sm font-medium leading-snug tracking-tight text-slate-700 dark:text-slate-200">
            {title}
          </h3>

          <div className="flex flex-shrink-0 items-center gap-1 rounded-full border border-[var(--color-cream-dark)] bg-[var(--color-cream)] px-2.5 py-1 dark:border-[#2a2520] dark:bg-[#1a1714]">
            <BadgePercent className="h-3 w-3 text-[var(--color-terracotta)]" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {score}
            </span>
          </div>
        </div>

        <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-[var(--color-cream-dark)] dark:bg-[#2a2520]">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-500 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>

        <div className="mb-4 space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <Building2 className="h-3 w-3 text-[var(--color-terracotta)]" />
            Why this matches
          </p>
          <ul className="ml-5 space-y-1.5">
            {reasons.map((reason) => (
              <li
                className="text-xs leading-relaxed marker:text-[var(--color-sage)] dark:text-slate-400"
                key={reason}
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <button
          className="group/btn focus-ring relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[var(--color-indigo)] px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[var(--color-indigo)]/90 hover:shadow-md active:scale-[0.98] dark:bg-[#2a2520] dark:text-[#e8e0d4]"
          onClick={handleClick}
          type="button"
        >
          <span className="relative">View Trial</span>
          <ArrowUpRight className="relative h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
