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

  // Color based on score
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) {
      return "from-emerald-500 to-teal-500";
    }
    if (scoreValue >= 60) {
      return "from-[#E07856] to-[#FF6B6B]";
    }
    return "from-amber-500 to-orange-500";
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-slate-200/50 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/50 dark:bg-slate-900/80">
      {/* Subtle gradient ring on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:via-slate-800" />

      <div className="relative">
        {/* Header: Title + Score Badge */}
        <div className="mb-3 flex items-start gap-3">
          <h3
            className="flex-1 font-medium text-slate-800 text-sm leading-snug tracking-tight dark:text-slate-100"
            style={{
              fontSize: "var(--font-size-sm)",
              lineHeight: "var(--line-height-sm)",
            }}
          >
            {title}
          </h3>

          {/* Circular score badge with gradient ring */}
          <div
            className="relative flex flex-shrink-0 items-center justify-center rounded-full p-0.5"
            style={{
              background:
                "linear-gradient(135deg, var(--color-terracotta), var(--color-coral))",
            }}
          >
            <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm">
              <BadgePercent className="h-3 w-3 text-[#E07856]" />
              <span
                className="font-bold text-slate-800 text-xs"
                style={{
                  fontSize: "var(--font-size-xs)",
                  letterSpacing: "var(--letter-spacing-xs)",
                }}
              >
                {score}
              </span>
            </div>
          </div>
        </div>

        {/* Animated Score Bar */}
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100/80 dark:bg-slate-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)} shadow-sm transition-all duration-500 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Reasons List */}
        <div className="mb-4 space-y-2">
          <p
            className="flex items-center gap-1.5 font-medium text-slate-600 text-xs uppercase tracking-wide dark:text-slate-400"
            style={{
              fontSize: "var(--font-size-xs)",
              letterSpacing: "var(--letter-spacing-xs)",
            }}
          >
            <Building2 className="h-3 w-3 text-[#E07856]" />
            Why this matches
          </p>
          <ul className="ml-5 space-y-1.5">
            {reasons.map((reason) => (
              <li
                className="text-slate-600 text-xs leading-relaxed marker:text-emerald-500 dark:text-slate-400"
                key={reason}
                style={{
                  fontSize: "var(--font-size-xs)",
                  lineHeight: "var(--line-height-xs)",
                }}
              >
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced CTA Button with micro-interactions */}
        <button
          className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#E07856] to-[#C85C3D] px-4 py-2.5 font-medium text-sm text-white shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.98]"
          onClick={handleClick}
          style={{
            fontSize: "var(--font-size-sm)",
            boxShadow: "var(--shadow-terracotta-sm)",
          }}
          type="button"
        >
          {/* Button shimmer effect on hover */}
          <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-[100%]" />

          <span className="relative">View Trial</span>
          <ArrowUpRight className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
