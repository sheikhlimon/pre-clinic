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
  searching: "bg-[var(--color-sage)]",
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
    <div className="my-2 overflow-hidden rounded-2xl border border-[var(--color-cream-dark)] bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-all duration-500 hover:shadow-md dark:border-[#2a2520] dark:bg-[#1a1714]/70">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`relative flex h-2 w-2 items-center justify-center rounded-full ${STATUS_COLORS[status]} ${isPulsing ? "animate-pulse-ring" : ""}`}
          />
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
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
            icon={
              <MapPin className="h-3.5 w-3.5 text-[var(--color-sage)]" />
            }
            iconBg="bg-[var(--color-sage)]/20"
            label="Location"
            value={location}
          />
        )}

        {symptoms.length > 0 && (
          <div className="rounded-xl bg-[var(--color-cream)]/60 px-3 py-2.5 dark:bg-[#1a1714]/60">
            <div className="mb-2 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[var(--color-terracotta)]" />
              <p className="font-display text-xs font-medium text-slate-600 dark:text-slate-300">
                Symptoms
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {symptoms.map((symptom) => (
                <span
                  className="inline-flex items-center rounded-full bg-[var(--color-sage)]/15 px-2.5 py-1 text-slate-600 text-xs dark:bg-[var(--color-sage)]/10 dark:text-slate-300"
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
            <p className="mb-2 font-display text-xs font-medium text-slate-600 dark:text-slate-300">
              Possible conditions
            </p>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <ConditionCard condition={condition} key={condition.name} />
              ))}
            </div>
          </div>
        )}

        <p className="pt-1.5 text-slate-400 text-xs italic dark:text-slate-500">
          {STATUS_TEXT[status]}
        </p>
      </div>
    </div>
  );
}
