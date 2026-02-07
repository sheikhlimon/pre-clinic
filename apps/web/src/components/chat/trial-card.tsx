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
    <div className="my-4 rounded-lg border border-muted-foreground/20 bg-background p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug">{title}</h3>
        <div className="flex-shrink-0 rounded-lg bg-primary px-2 py-1 font-bold text-primary-foreground text-xs">
          {score}/100
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-3 h-2 w-full rounded-full bg-muted/30">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Reasons */}
      <div className="space-y-1 text-muted-foreground text-xs">
        <p className="font-semibold uppercase">Why this trial:</p>
        <ul className="ml-4 space-y-1">
          {reasons.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        className="mt-4 w-full rounded-lg bg-primary px-3 py-2 font-semibold text-primary-foreground text-xs transition-opacity hover:opacity-90"
        onClick={handleClick}
        type="button"
      >
        View on ClinicalTrials.gov →
      </button>
    </div>
  );
}
