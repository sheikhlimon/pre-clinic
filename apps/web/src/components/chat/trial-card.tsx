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
    <div className="group my-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-500/5 transition-all duration-500 hover:shadow-slate-500/10 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="flex-1 font-medium text-[#2C3E50] text-sm leading-snug dark:text-slate-100">
          {title}
        </h3>
        <div className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-br from-[#E07856] to-[#C85C3D] px-3 py-1.5 font-bold text-white text-xs shadow-[#E07856]/20 shadow-lg">
          <BadgePercent className="h-3 w-3" />
          <span>{score}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#E07856] to-[#FF6B6B] shadow-sm transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Reasons */}
      <div className="mb-4 space-y-2">
        <p className="flex items-center gap-1.5 font-medium text-slate-600 text-xs uppercase dark:text-slate-400">
          <Building2 className="h-3 w-3" />
          Why this matches:
        </p>
        <ul className="ml-6 space-y-1.5">
          {reasons.map((reason) => (
            <li
              className="text-slate-600 text-xs leading-relaxed dark:text-slate-400"
              key={reason}
            >
              • {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E07856] to-[#C85C3D] px-4 py-2.5 font-medium text-white text-xs shadow-[#E07856]/20 shadow-lg transition-all hover:shadow-[#E07856]/30 hover:shadow-xl"
        onClick={handleClick}
        type="button"
      >
        <span>View Trial</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      </button>
    </div>
  );
}
