"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorBannerProps {
  type: "api_key" | "error";
  message?: string;
}

export default function ErrorBanner({ type, message }: ErrorBannerProps) {
  if (type === "api_key") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              AI service not connected
            </p>
            <p className="mt-1 text-amber-700 text-sm dark:text-amber-400/80">
              The OpenRouter API key is not configured. Add your
              <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-900 text-xs dark:bg-amber-900/50 dark:text-amber-300">
                OPENROUTER_API_KEY
              </code>
              to your{" "}
              <code className="mx-1 rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-900 text-xs dark:bg-amber-900/50 dark:text-amber-300">
                .env.local
              </code>{" "}
              file to enable AI chat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        <div>
          <p className="font-semibold text-red-800 dark:text-red-300">
            AI service error
          </p>
          <p className="mt-1 text-red-700 text-sm dark:text-red-400/80">
            {message}
          </p>
          <p className="mt-2 text-red-600 text-xs dark:text-red-400/60">
            Check your model setting in{" "}
            <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono text-red-900 text-xs dark:bg-red-900/50 dark:text-red-300">
              OPENROUTER_MODEL
            </code>{" "}
            env var.
          </p>
        </div>
      </div>
    </div>
  );
}
