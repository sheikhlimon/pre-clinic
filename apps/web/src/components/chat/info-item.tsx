"use client";

import type { ReactNode } from "react";

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  iconBg?: string;
}

export default function InfoItem({
  icon,
  label,
  value,
  iconBg = "bg-[var(--color-terracotta)]/10",
}: InfoItemProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[var(--color-cream)]/60 px-3 py-2 dark:bg-[#1a1714]/60">
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-md ${iconBg}`}
      >
        {icon}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {label}: <span className="font-medium text-slate-800 dark:text-slate-100">{value}</span>
      </p>
    </div>
  );
}
