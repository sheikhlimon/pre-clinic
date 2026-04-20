"use client";

import { Activity, Baby, MapPin, Stethoscope } from "lucide-react";
import type { Condition, ExtractionStatus } from "@/lib/types";
import ConditionCard from "./condition-card";
import InfoItem from "./info-item";

interface ExtractionPanelProps {
  age?: number;
  symptoms: string[];
  location?: string;
  conditions: Condition[];
  status: ExtractionStatus;
}

const STATUS_TEXT: Record<ExtractionStatus, string> = {
  gathering: "Gathering information...",
  extracting: "Understanding your symptoms...",
  searching: "",
  complete: "",
};

const STATUS_COLORS: Record<ExtractionStatus, string> = {
  gathering: "bg-slate-400",
  extracting: "bg-[var(--color-terracotta)]",
  searching: "bg-blue-500",
  complete: "bg-emerald-500",
};

export default function ExtractionPanel({
  age,
  symptoms,
  location,
  conditions,
  status,
}: ExtractionPanelProps) {
  const isPulsing = status === "extracting" || status === "searching";

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-200/50 bg-gradient-to-br from-slate-50/80 to-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-500 hover:shadow-md dark:border-slate-700/50 dark:from-slate-900/80 dark:to-slate-800/80">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`relative flex h-2 w-2 items-center justify-center rounded-full ${STATUS_COLORS[status]} ${isPulsing ? "animate-pulse-ring" : ""}`}
          />
          <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide dark:text-slate-200">
            I understood
          </p>
        </div>
        <Stethoscope className="h-3.5 w-3.5 text-[var(--color-terracotta)]" />
      </div>

      <div className="space-y-3">
        {age && (
          <InfoItem
            icon={
              <Baby className="h-3.5 w-3.5 text-[var(--color-terracotta)]" />
            }
            label="Age"
            value={String(age)}
          />
        )}

        {location && (
          <InfoItem
            icon={<MapPin className="h-3.5 w-3.5 text-[var(--color-sage)]" />}
            iconBg="bg-[var(--color-sage)]/20"
            label="Location"
            value={location}
          />
        )}

        {symptoms.length > 0 && (
          <div className="rounded-lg bg-white/50 px-3 py-2.5 dark:bg-slate-800/50">
            <div className="mb-2 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[var(--color-terracotta)]" />
              <p className="font-semibold text-slate-800 text-xs dark:text-slate-200">
                Symptoms
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {symptoms.map((symptom) => (
                <span
                  className="inline-flex items-center rounded-full bg-[var(--color-sage)]/20 px-2.5 py-1 text-slate-700 text-xs dark:bg-slate-700/50 dark:text-slate-300"
                  key={symptom}
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}

        {conditions.length > 0 && (
          <div>
            <p className="mb-2 font-semibold text-slate-800 text-xs dark:text-slate-200">
              Possible conditions
            </p>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <ConditionCard condition={condition} key={condition.name} />
              ))}
            </div>
          </div>
        )}

        <p className="pt-1.5 text-slate-500 text-xs italic dark:text-slate-400">
          {STATUS_TEXT[status]}
        </p>
      </div>
    </div>
  );
}
