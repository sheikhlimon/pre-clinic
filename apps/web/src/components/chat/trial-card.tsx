"use client";

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
    <div className="my-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm dark:border-teal-950 dark:bg-teal-950/10">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="flex-1 font-medium text-sm leading-snug">{title}</h3>
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 px-2.5 py-1 font-bold text-white text-xs shadow-sm">
          {score}
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-teal-100 dark:bg-teal-900/30">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Reasons */}
      <div className="mb-4 space-y-1 text-muted-foreground text-xs">
        <p className="font-medium text-teal-700 uppercase dark:text-teal-300">
          Why this trial:
        </p>
        <ul className="ml-4 space-y-1">
          {reasons.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 px-3 py-2.5 font-medium text-white text-xs shadow-sm transition-all hover:shadow-md"
        onClick={handleClick}
        type="button"
      >
        View on ClinicalTrials.gov →
      </button>
    </div>
  );
}
