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
    <div className="my-4 rounded-2xl border border-[#A8D5BA]/30 bg-gradient-to-br from-[#A8D5BA]/10 to-[#E8F4F8]/20 p-4 shadow-[#A8D5BA]/10 shadow-lg transition-all dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
      <p className="mb-4 flex items-center gap-2 font-semibold text-[#2C3E50] text-xs uppercase dark:text-slate-300">
        <Stethoscope className="h-3.5 w-3.5 text-[#E07856]" />I understood:
      </p>

      <div className="space-y-3 text-sm">
        {age && (
          <div className="flex items-center gap-2">
            <Baby className="h-4 w-4 text-[#E07856]" />
            <p className="text-[#2C3E50] text-sm dark:text-slate-300">
              Age: <span className="font-medium">{age}</span>
            </p>
          </div>
        )}

        {symptoms.length > 0 && (
          <div className="flex items-start gap-2">
            <Activity className="mt-0.5 h-4 w-4 text-[#E07856]" />
            <div>
              <p className="font-medium text-[#2C3E50] dark:text-slate-300">
                Symptoms:
              </p>
              <p className="text-slate-600 text-xs dark:text-slate-400">
                {symptoms.join(", ")}
              </p>
            </div>
          </div>
        )}

        {conditions.length > 0 && (
          <div>
            <p className="mb-2 font-medium text-[#2C3E50] dark:text-slate-300">
              Possible conditions:
            </p>
            <div className="mb-3 space-y-1.5">
              {conditions.map((condition) => (
                <div
                  className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 dark:bg-slate-800/50"
                  key={condition.name}
                >
                  <span className="text-[#2C3E50] text-xs dark:text-slate-300">
                    {condition.name}
                  </span>
                  <span className="rounded-full bg-gradient-to-r from-[#E07856] to-[#FF6B6B] px-2 py-0.5 font-semibold text-white text-xs">
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
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E07856] to-[#C85C3D] px-4 py-2.5 font-medium text-white text-xs shadow-[#E07856]/20 shadow-lg transition-all hover:shadow-[#E07856]/30 hover:shadow-xl"
            onClick={onSearchClick}
            type="button"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search for matching trials</span>
          </button>
        )}

        <p className="pt-2 text-slate-600 text-xs italic dark:text-slate-400">
          {statusText[status]}
        </p>
      </div>
    </div>
  );
}
