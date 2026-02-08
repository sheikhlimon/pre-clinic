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

  // Status indicator color
  const getStatusColor = () => {
    switch (status) {
      case "gathering":
        return "bg-slate-400";
      case "extracting":
        return "bg-[#E07856]";
      case "searching":
        return "bg-blue-500";
      case "complete":
        return "bg-emerald-500";
      default:
        return "bg-slate-400";
    }
  };

  // Pulsing animation for active states
  const isPulsing = status === "extracting" || status === "searching";

  return (
    <div
      className="my-3 overflow-hidden rounded-xl border border-slate-200/50 bg-gradient-to-br from-slate-50/80 to-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-500 hover:shadow-md dark:border-slate-700/50 dark:from-slate-900/80 dark:to-slate-800/80"
      style={{
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header with status indicator */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Status indicator with optional pulse */}
          <div
            className={`relative flex h-2 w-2 items-center justify-center rounded-full ${getStatusColor()} ${isPulsing ? "animate-pulse-ring" : ""}`}
          />
          <p
            className="font-semibold text-slate-800 text-xs uppercase tracking-wide dark:text-slate-200"
            style={{
              fontSize: "var(--font-size-xs)",
              letterSpacing: "var(--letter-spacing-xs)",
            }}
          >
            I understood
          </p>
        </div>
        <Stethoscope className="h-3.5 w-3.5 text-[#E07856]" />
      </div>

      <div className="space-y-3">
        {/* Age display with icon container */}
        {age && (
          <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2 dark:bg-slate-800/50">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E07856]/10"
              style={{
                boxShadow: "var(--shadow-terracotta-sm)",
              }}
            >
              <Baby className="h-3.5 w-3.5 text-[#E07856]" />
            </div>
            <p
              className="text-slate-800 text-sm dark:text-slate-200"
              style={{
                fontSize: "var(--font-size-sm)",
                lineHeight: "var(--line-height-sm)",
              }}
            >
              Age: <span className="font-semibold">{age}</span>
            </p>
          </div>
        )}

        {/* Symptoms as pill tags */}
        {symptoms.length > 0 && (
          <div className="rounded-lg bg-white/50 px-3 py-2.5 dark:bg-slate-800/50">
            <div className="mb-2 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#E07856]" />
              <p
                className="font-semibold text-slate-800 text-xs dark:text-slate-200"
                style={{
                  fontSize: "var(--font-size-xs)",
                }}
              >
                Symptoms
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {symptoms.map((symptom) => (
                <span
                  className="inline-flex items-center rounded-full bg-[#A8D5BA]/20 px-2.5 py-1 text-slate-700 text-xs dark:bg-slate-700/50 dark:text-slate-300"
                  key={symptom}
                  style={{
                    fontSize: "var(--font-size-xs)",
                    lineHeight: "var(--line-height-xs)",
                  }}
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Condition cards with probability bars */}
        {conditions.length > 0 && (
          <div>
            <p
              className="mb-2 font-semibold text-slate-800 text-xs dark:text-slate-200"
              style={{
                fontSize: "var(--font-size-xs)",
              }}
            >
              Possible conditions
            </p>
            <div className="mb-3 space-y-2">
              {conditions.map((condition) => (
                <div
                  className="rounded-lg bg-white/50 px-3 py-2.5 shadow-sm dark:bg-slate-800/50"
                  key={condition.name}
                  style={{
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span
                      className="font-medium text-slate-800 text-xs dark:text-slate-200"
                      style={{
                        fontSize: "var(--font-size-xs)",
                      }}
                    >
                      {condition.name}
                    </span>
                    <span
                      className="rounded-full bg-gradient-to-r from-[#E07856] to-[#FF6B6B] px-2 py-0.5 font-bold text-white text-xs"
                      style={{
                        fontSize: "var(--font-size-xs)",
                        boxShadow: "var(--shadow-terracotta-sm)",
                      }}
                    >
                      {condition.probability}%
                    </span>
                  </div>
                  {/* Probability bar */}
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#E07856] to-[#FF6B6B] transition-all duration-500"
                      style={{ width: `${condition.probability}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search button when ready */}
        {status === "complete" && onSearchClick && (
          <button
            className="group/btn focus-ring relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#E07856] to-[#C85C3D] px-4 py-2.5 font-medium text-sm text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
            onClick={onSearchClick}
            style={{
              fontSize: "var(--font-size-sm)",
              boxShadow: "var(--shadow-terracotta-sm)",
            }}
            type="button"
          >
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-[100%]" />
            <Search className="relative h-4 w-4 transition-transform group-hover/btn:scale-110" />
            <span className="relative">Search for matching trials</span>
          </button>
        )}

        {/* Status text */}
        <p
          className="pt-1.5 text-slate-500 text-xs italic dark:text-slate-400"
          style={{
            fontSize: "var(--font-size-xs)",
            lineHeight: "var(--line-height-xs)",
          }}
        >
          {statusText[status]}
        </p>
      </div>
    </div>
  );
}
