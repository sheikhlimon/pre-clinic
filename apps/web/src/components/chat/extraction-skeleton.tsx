"use client";

import { Activity, Baby, Stethoscope } from "lucide-react";

export default function ExtractionSkeleton() {
  return (
    <div className="my-4 rounded-2xl border border-[#A8D5BA]/30 bg-gradient-to-br from-[#A8D5BA]/10 to-[#E8F4F8]/20 p-4 shadow-[#A8D5BA]/10 shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
      <p className="mb-4 flex items-center gap-2 font-semibold text-[#2C3E50] text-xs uppercase dark:text-slate-300">
        <Stethoscope className="h-3.5 w-3.5 text-[#E07856]" />I understood:
      </p>

      <div className="space-y-3 text-sm">
        {/* Age Skeleton */}
        <div className="flex items-center gap-2">
          <Baby className="h-4 w-4 text-[#E07856]" />
          <div className="flex-1">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        {/* Symptoms Skeleton */}
        <div className="flex items-start gap-2">
          <Activity className="mt-0.5 h-4 w-4 text-[#E07856]" />
          <div className="w-full">
            <p className="mb-1 font-medium text-[#2C3E50] dark:text-slate-300">
              Symptoms:
            </p>
            <div className="space-y-1.5">
              <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>

        {/* Conditions Skeleton */}
        <div>
          <p className="mb-2 font-medium text-[#2C3E50] dark:text-slate-300">
            Possible conditions:
          </p>
          <div className="mb-3 space-y-1.5">
            {[0, 1].map((i) => (
              <div
                className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2 dark:bg-slate-800/50"
                key={i}
              >
                <div className="h-3 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-12 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>

        {/* Status text */}
        <p className="pt-2 text-slate-600 text-xs italic dark:text-slate-400">
          ⏳ Understanding your symptoms...
        </p>
      </div>
    </div>
  );
}
