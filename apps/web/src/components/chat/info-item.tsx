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
    <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2 dark:bg-slate-800/50">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
      <p className="text-slate-800 text-sm dark:text-slate-200">
        {label}: <span className="font-semibold">{value}</span>
      </p>
    </div>
  );
}
