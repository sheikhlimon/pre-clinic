"use client";

import { Activity, Baby, Search, Stethoscope } from "lucide-react";

interface Condition {
  name: string;
  probability: number;
}

interface ExtractionPanelProps {
  age?: number;
  symptoms: string[];
  conditions: Condition[];
  status: "gathering" | "extracting" | "searching" | "complete";
  onSearchClick?: () => void;
}

export default function ExtractionPanel({
  age,
  symptoms,
  conditions,
  status,
  onSearchClick,
}: ExtractionPanelProps) {
  const statusText = {
    gathering: "Gathering information...",
    extracting: "Understanding your symptoms...",
    searching: "Searching clinical trials...",
    complete: "Search complete",
  };

  return (
    <div className="fade-in-0 slide-in-from-bottom-4 my-4 animate-in rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-stone-50 p-4 shadow-lg shadow-rose-500/5 duration-500 dark:border-stone-800 dark:from-stone-900 dark:to-stone-950">
      <p className="mb-4 flex items-center gap-2 font-semibold text-stone-700 text-xs uppercase dark:text-stone-300">
        <Stethoscope className="h-3.5 w-3.5 text-rose-500" />I understood:
      </p>

      <div className="space-y-3 text-sm">
        {age && (
          <div className="flex items-center gap-2">
            <Baby className="h-4 w-4 text-rose-500" />
            <p>
              Age: <span className="font-medium">{age}</span>
            </p>
          </div>
        )}

        {symptoms.length > 0 && (
          <div className="flex items-start gap-2">
            <Activity className="mt-0.5 h-4 w-4 text-rose-500" />
            <div>
              <p className="font-medium">Symptoms:</p>
              <p className="text-muted-foreground text-xs">
                {symptoms.join(", ")}
              </p>
            </div>
          </div>
        )}

        {conditions.length > 0 && (
          <div>
            <p className="mb-2 font-medium text-stone-700 dark:text-stone-300">
              Possible conditions:
            </p>
            <div className="mb-3 space-y-1.5">
              {conditions.map((condition) => (
                <div
                  className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 dark:bg-stone-900/50"
                  key={condition.name}
                >
                  <span className="text-xs">{condition.name}</span>
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 font-semibold text-white text-xs">
                    {condition.probability}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search button when ready */}
        {status === "complete" && onSearchClick && (
          <button
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-rose-600 px-4 py-2.5 font-medium text-white text-xs shadow-lg shadow-rose-500/10 transition-all hover:shadow-rose-500/20 hover:shadow-xl"
            onClick={onSearchClick}
            type="button"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search for matching trials</span>
          </button>
        )}

        <p className="pt-2 text-muted-foreground text-xs italic">
          {statusText[status]}
        </p>
      </div>
    </div>
  );
}
