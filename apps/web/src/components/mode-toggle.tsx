"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      aria-label="Toggle theme"
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200/50 bg-transparent transition-all duration-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 rotate-0 scale-100 text-[#E07856] transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 rotate-0 scale-100 text-slate-600 transition-transform duration-300" />
      )}
    </button>
  );
}
