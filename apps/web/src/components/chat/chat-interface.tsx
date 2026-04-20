"use client";

import { Activity, Github, Loader2, RotateCcw, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import type { Condition, ExtractionStatus, TrialData } from "@/lib/types";
import { useChat } from "@/lib/use-chat";
import ChatInput from "./chat-input";
import ChatMessage from "./chat-message";
import ErrorBanner from "./error-banner";
import ExtractionPanel from "./extraction-panel";
import MobileCardsPanel from "./mobile-cards-panel";
import PromptCard from "./prompt-card";
import TrialCard from "./trial-card";

const JSON_REGEX = /```json\n([\s\S]*?)\n```/;
const PROMPTS = [
  "I'm experiencing symptoms and want to find clinical trials that might help",
  "I've been diagnosed with cancer and looking for treatment options",
] as const;

interface ExtractionState {
  age?: number;
  symptoms: string[];
  conditions: Condition[];
  status: ExtractionStatus;
}

function stripJsonFromContent(content: string): string {
  return content.replace(JSON_REGEX, "").trim();
}

export default function ChatInterface() {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    clearChat,
  } = useChat({ api: "/api/chat" });

  const [extraction, setExtraction] = useState<ExtractionState>({
    symptoms: [],
    conditions: [],
    status: "gathering",
  });
  const [trials, setTrials] = useState<TrialData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isEmptyState = messages.length === 0;
  const hasExtraction =
    extraction.symptoms.length > 0 &&
    (extraction.status === "extracting" || extraction.status === "complete");

  // Sync extraction data and trials from assistant messages
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") return;

    if (lastMessage.extractedData) {
      setExtraction({
        age: lastMessage.extractedData.age,
        symptoms: lastMessage.extractedData.symptoms || [],
        conditions: lastMessage.extractedData.conditions || [],
        status: lastMessage.extractedData.readyToSearch
          ? "complete"
          : "extracting",
      });
    }

    if (lastMessage.trials && lastMessage.trials.length > 0) {
      setTrials(lastMessage.trials);
    }
  }, [messages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!isEmptyState) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isEmptyState]);

  // Persist chat to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const handleClear = useCallback(() => {
    clearChat();
    setExtraction({ symptoms: [], conditions: [], status: "gathering" });
    setTrials([]);
  }, [clearChat]);

  const handlePromptSelect = useCallback(
    (text: string) => {
      setInput(text);
      setTimeout(
        () => handleSubmit({ preventDefault: () => {} } as React.FormEvent),
        10,
      );
    },
    [setInput, handleSubmit],
  );

  return (
    <div className="flex h-full w-full flex-col">
      {/* Navbar + Hero */}
      <div
        className={`flex-shrink-0 overflow-hidden border-slate-200/50 border-b bg-gradient-to-b from-white to-white/80 backdrop-blur-sm transition-all duration-300 md:px-8 dark:border-slate-800/50 dark:from-slate-950 dark:to-slate-950/80 ${
          isEmptyState ? "px-6 py-6" : "px-6 py-3"
        }`}
        style={{ maxHeight: isEmptyState ? "400px" : "auto" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] font-bold text-white shadow-lg">
              <Activity className="h-5 w-5" />
              <div className="absolute -right-0.5 -bottom-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--color-sage)] font-bold text-[var(--color-indigo)] text-xs">
                <Search className="h-2 w-2" />
              </div>
            </div>
            <span className="font-bold text-[var(--color-indigo)] text-lg tracking-tight dark:text-white">
              PreClinic
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isEmptyState && (
              <button
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-600 text-sm transition-colors hover:bg-slate-100 sm:px-3 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={handleClear}
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Clear chat</span>
              </button>
            )}
            <a
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              href="https://github.com/sheikhlimon/pre-clinic"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-5 w-5" />
            </a>
            <ModeToggle />
          </div>
        </div>

        {isEmptyState && (
          <div className="mt-8 text-center opacity-100 transition-opacity duration-300">
            <h1 className="font-bold text-[var(--color-indigo)] tracking-tight dark:text-white">
              <span className="block text-3xl md:text-4xl">
                Find Cancer Clinical
              </span>
              <span className="mt-2 block bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-coral)] bg-clip-text text-4xl text-transparent md:text-5xl">
                Trials That Match You
              </span>
            </h1>
            <p className="mt-4 text-base text-slate-600 md:text-lg dark:text-slate-400">
              AI-powered oncology trial matching based on your symptoms and
              diagnosis
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 overflow-hidden px-4 py-4 md:px-6">
        {/* LEFT: Extraction Panel */}
        {hasExtraction && (
          <div className="hidden w-80 flex-shrink-0 overflow-y-auto lg:block">
            <div className="sticky top-0">
              <ExtractionPanel
                age={extraction.age}
                conditions={extraction.conditions}
                status={trials.length > 0 ? "complete" : extraction.status}
                symptoms={extraction.symptoms}
              />
            </div>
          </div>
        )}

        {/* CENTER: Chat */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {isEmptyState ? (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                {PROMPTS.map((text) => (
                  <PromptCard
                    key={text}
                    onSelect={handlePromptSelect}
                    text={text}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 overflow-y-auto pb-4">
              <div className="mx-auto w-full max-w-3xl space-y-4 py-4">
                {messages.map((message) => (
                  <ChatMessage
                    content={stripJsonFromContent(message.content)}
                    key={message.id}
                    role={message.role}
                  />
                ))}

                {error === "missing_api_key" && <ErrorBanner type="api_key" />}
                {error && error !== "missing_api_key" && (
                  <ErrorBanner message={error} type="error" />
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--color-terracotta)]" />
                      <p className="text-slate-600 text-sm dark:text-slate-400">
                        Thinking...
                      </p>
                    </div>
                  </div>
                )}

                <MobileCardsPanel
                  extraction={extraction}
                  hasExtraction={hasExtraction}
                  trials={trials}
                />

                <div className="pt-2" ref={messagesEndRef} />
              </div>
            </div>
          )}

          <ChatInput
            isLoading={isLoading}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            value={input}
          />
        </div>

        {/* RIGHT: Trial Cards */}
        {trials.length > 0 && (
          <div className="hidden w-96 flex-shrink-0 overflow-y-auto lg:block">
            <div className="space-y-3">
              <p className="sticky top-0 bg-gradient-to-b from-white to-white/80 py-2 font-semibold text-[var(--color-indigo)] text-xs uppercase dark:from-slate-950 dark:to-slate-950/80 dark:text-slate-300">
                Matching trials
              </p>
              {trials.map((trial) => (
                <TrialCard
                  key={trial.nctId}
                  nctId={trial.nctId}
                  reasons={trial.matchReasons}
                  score={trial.relevanceScore}
                  title={trial.title}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
