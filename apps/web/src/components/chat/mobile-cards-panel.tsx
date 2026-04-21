"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { Condition, ExtractionStatus, TrialData } from "@/lib/types";
import ExtractionPanel from "./extraction-panel";
import TrialCard from "./trial-card";

interface MobileCardsPanelProps {
  extraction: {
    age?: number;
    symptoms: string[];
    conditions: Condition[];
    status: ExtractionStatus;
  };
  trials: TrialData[];
  hasExtraction: boolean;
}

export default function MobileCardsPanel({
  extraction,
  trials,
  hasExtraction,
}: MobileCardsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="lg:hidden">
      <button
        className="flex w-full items-center justify-between rounded-2xl border border-[var(--color-cream-dark)] bg-white/70 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white dark:border-[#2a2520] dark:bg-[#1a1714]/70 dark:hover:bg-[#1a1714]"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {trials.length > 0
              ? `${trials.length} trials found`
              : "Extracted info"}
          </span>
          {extraction.symptoms.length > 0 && (
            <span className="rounded-full bg-[var(--color-terracotta)] px-2 py-0.5 text-white text-xs">
              {extraction.symptoms.length}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {hasExtraction && (
            <ExtractionPanel
              age={extraction.age}
              conditions={extraction.conditions}
              rounded
              status={trials.length > 0 ? "complete" : extraction.status}
              symptoms={extraction.symptoms}
            />
          )}

          {trials.length > 0 &&
            trials.map((trial) => (
              <TrialCard
                key={trial.nctId}
                nctId={trial.nctId}
                reasons={trial.matchReasons}
                score={trial.relevanceScore}
                title={trial.title}
              />
            ))}
        </div>
      )}
    </div>
  );
}
