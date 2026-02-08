"use client";

import { Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import type { ExtractedData, TrialData } from "@/lib/use-chat";
import { useChat } from "@/lib/use-chat";
import ChatMessage from "./chat-message";
import ExtractionPanel from "./extraction-panel";
import TrialCard from "./trial-card";

interface LocalExtractedData extends ExtractedData {
  status: "gathering" | "extracting" | "searching" | "complete";
}

export default function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    isStreaming,
  } = useChat({
    api: "/api/chat",
  });

  const [extraction, setExtraction] = useState<LocalExtractedData>({
    symptoms: [],
    conditions: [],
    status: "gathering",
  });

  const [_showExtraction, _setShowExtraction] = useState(false);
  const [trials, setTrials] = useState<TrialData[]>([]);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmptyState = messages.length === 0;

  const starterPrompts = [
    {
      title: "What symptoms are you experiencing?",
      description:
        "I'll analyze your symptoms and identify matching clinical trials",
      prompt: "What symptoms are you experiencing?",
    },
    {
      title: "What's your diagnosis?",
      description:
        "Share your condition and I'll find relevant trials you may qualify for",
      prompt: "What's your diagnosis?",
    },
  ];

  const handleStarterPrompt = (promptText: string) => {
    handleInputChange({
      target: { value: promptText },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    handleSubmit(new Event("submit") as unknown as React.FormEvent);
  };

  // Manual search for trials
  const handleSearchTrials = async () => {
    setExtraction((prev) => ({ ...prev, status: "searching" }));

    try {
      const response = await fetch("/api/search-trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: extraction.age,
          conditions: extraction.conditions.map((c) => c.name),
          location: extraction.location,
        }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = (await response.json()) as { trials: TrialData[] };
      setTrials(data.trials);
      setExtraction((prev) => ({ ...prev, status: "complete" }));
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.error("Search failed:", _error);
      setExtraction((prev) => ({ ...prev, status: "complete" }));
    }
  };

  // Parse extraction and trials from AI messages
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") {
      return;
    }

    // Use extractedData from message (JSON already parsed in use-chat hook)
    if (lastMessage.extractedData) {
      setExtraction({
        age: lastMessage.extractedData.age,
        symptoms: lastMessage.extractedData.symptoms || [],
        location: lastMessage.extractedData.location,
        conditions: lastMessage.extractedData.conditions || [],
        status: lastMessage.extractedData.readyToSearch
          ? "complete"
          : "extracting",
      });
    }

    // Get trials from message
    if (lastMessage.trials) {
      setTrials(lastMessage.trials);
    }
  }, [messages]);

  // Auto-trigger search when extraction is ready and no trials yet
  // biome-ignore lint/correctness/useExhaustiveDependencies: handleSearchTrials is a stable component-level function
  useEffect(() => {
    if (
      extraction.status === "complete" &&
      extraction.conditions.length > 0 &&
      trials.length === 0
    ) {
      handleSearchTrials();
    }
  }, [extraction.status, extraction.conditions.length, trials.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && messagesScrollRef.current) {
      messagesScrollRef.current.scrollTop =
        messagesScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-grow textarea
  // biome-ignore lint/correctness/useExhaustiveDependencies: input is needed to trigger textarea height recalculation
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Load/save chat history
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      try {
        JSON.parse(saved);
      } catch (_e) {
        // localStorage parsing failed
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Navbar + Hero Section - collapses when chatting */}
      <div
        className={`flex-shrink-0 overflow-hidden border-slate-200/50 border-b bg-gradient-to-b from-white to-white/80 backdrop-blur-sm transition-all duration-500 ease-in-out md:px-8 dark:border-slate-800/50 dark:from-slate-950 dark:to-slate-950/80 ${
          isEmptyState ? "px-6 py-6" : "px-6 py-3"
        }`}
        style={{
          maxHeight: isEmptyState ? "400px" : "70px",
        }}
      >
        {/* Navbar Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E07856] to-[#C85C3D] font-bold text-white transition-transform duration-300 hover:scale-105"
              style={{
                boxShadow: "var(--shadow-terracotta-md)",
              }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <span
              className="font-semibold tracking-tight dark:text-white"
              style={{
                color: "var(--color-indigo)",
                fontSize: "var(--font-size-base)",
                lineHeight: "var(--line-height-base)",
              }}
            >
              PreClinic
            </span>
          </div>
          <ModeToggle />
        </div>

        {/* Hero Headline - visible only when empty */}
        {isEmptyState && (
          <div className="mt-8 text-center opacity-100 transition-opacity duration-500">
            <h1
              className="font-bold tracking-tight dark:text-white"
              style={{
                color: "var(--color-indigo)",
                fontSize: "var(--font-size-xl)",
                lineHeight: "var(--line-height-xl)",
              }}
            >
              <span className="block text-3xl md:text-4xl">
                Find Your Perfect
              </span>
              <span className="mt-2 block bg-gradient-to-r from-[#E07856] to-[#FF6B6B] bg-clip-text text-4xl text-transparent md:text-5xl">
                Clinical Trial
              </span>
            </h1>
            <p
              className="mt-4 text-base text-slate-600 md:text-lg dark:text-slate-400"
              style={{
                fontSize: "var(--font-size-base)",
                lineHeight: "var(--line-height-base)",
              }}
            >
              Discover cancer clinical trials matched to your symptoms
            </p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 gap-3 overflow-hidden px-3 py-3 sm:gap-4 sm:px-4 md:px-6">
        {/* LEFT: Extraction Panel - sticky sidebar */}
        {extraction.symptoms.length > 0 &&
          (extraction.status === "extracting" ||
            extraction.status === "complete") && (
            <div className="scrollbar-thin hidden w-72 flex-shrink-0 overflow-y-auto lg:block xl:w-80">
              <div className="sticky top-0">
                <ExtractionPanel
                  age={extraction.age}
                  conditions={extraction.conditions}
                  location={extraction.location}
                  onSearchClick={
                    trials.length === 0 ? handleSearchTrials : undefined
                  }
                  status={trials.length > 0 ? "complete" : extraction.status}
                  symptoms={extraction.symptoms}
                />
              </div>
            </div>
          )}

        {/* CENTER: Chat Interface */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Empty State - starter prompt cards */}
          {isEmptyState && (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {starterPrompts.map((card) => (
                  <button
                    className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-[#E07856]/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                    key={card.prompt}
                    onClick={() => handleStarterPrompt(card.prompt)}
                    type="button"
                  >
                    <h3
                      className="font-semibold dark:text-white"
                      style={{
                        color: "var(--color-indigo)",
                        fontSize: "var(--font-size-base)",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="mt-1 text-slate-600 text-sm dark:text-slate-400"
                      style={{
                        fontSize: "var(--font-size-sm)",
                      }}
                    >
                      {card.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages area - visible when chatting */}
          {!isEmptyState && (
            <div
              className="scrollbar-thin flex min-h-0 flex-1 overflow-y-auto"
              ref={messagesScrollRef}
            >
              <div className="mx-auto w-full max-w-3xl space-y-3 px-2 sm:space-y-4 sm:px-4 md:px-0">
                {messages.map((message) => (
                  <ChatMessage
                    content={message.content}
                    key={message.id}
                    role={message.role}
                  />
                ))}

                {isLoading && !isStreaming && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 dark:bg-slate-800">
                      <Loader2 className="h-4 w-4 animate-spin text-[#E07856]" />
                      <p
                        className="text-slate-600 text-sm dark:text-slate-400"
                        style={{
                          fontSize: "var(--font-size-sm)",
                          lineHeight: "var(--line-height-sm)",
                        }}
                      >
                        Thinking...
                      </p>
                    </div>
                  </div>
                )}

                <div className="h-3 sm:h-4" />
              </div>
            </div>
          )}

          {/* Input area - fixed at bottom, textarea grows up */}
          <div
            className="flex flex-shrink-0 flex-col gap-2.5 border-slate-200/30 border-t px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 md:px-0 dark:border-slate-700/30"
            style={{
              borderColor: "rgba(148, 163, 184, 0.2)",
            }}
          >
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mx-auto w-full max-w-3xl">
                <div
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-[#E07856]/50 focus-within:ring-2 focus-within:ring-[#E07856]/10 dark:border-slate-700 dark:bg-slate-900"
                  style={{
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <textarea
                    className="flex-1 resize-none bg-transparent py-0.5 text-base outline-none placeholder:text-slate-400 disabled:opacity-50"
                    disabled={isLoading}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as unknown as React.FormEvent);
                        // Refocus after submit
                        setTimeout(() => textareaRef.current?.focus(), 0);
                      }
                    }}
                    placeholder="Tell me about your symptoms..."
                    ref={textareaRef}
                    rows={1}
                    style={{
                      fontSize: "var(--font-size-base)",
                      lineHeight: "var(--line-height-base)",
                    }}
                    value={input}
                  />
                  <button
                    className="focus-ring flex h-10 min-h-10 w-10 min-w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#E07856] to-[#C85C3D] text-white transition-all duration-200 hover:shadow-md active:scale-95 disabled:opacity-50 sm:h-9 sm:w-9"
                    disabled={!input.trim() || isLoading}
                    style={{
                      boxShadow: "var(--shadow-terracotta-sm)",
                    }}
                    type="submit"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            <p
              className="px-2 text-center text-slate-600 text-xs sm:px-0 dark:text-slate-400"
              style={{
                fontSize: "var(--font-size-xs)",
                lineHeight: "var(--line-height-xs)",
              }}
            >
              ⚕️ Always consult with a healthcare provider. This tool is for
              discovery, not diagnosis.
            </p>
          </div>
        </div>

        {/* RIGHT: Trial Cards - sticky sidebar */}
        {trials.length > 0 && (
          <div className="scrollbar-thin hidden w-72 flex-shrink-0 overflow-y-auto lg:block xl:w-80">
            <div className="space-y-3 px-2 sm:px-4">
              <p
                className="sticky top-0 bg-gradient-to-b from-white to-white/80 py-2 font-semibold text-xs uppercase dark:from-slate-950 dark:to-slate-950/80"
                style={{
                  color: "var(--color-indigo)",
                  fontSize: "var(--font-size-xs)",
                  letterSpacing: "var(--letter-spacing-xs)",
                }}
              >
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

        {/* Mobile: Extraction + Trials below chat */}
        {!isEmptyState && (
          <div className="w-full lg:hidden">
            {extraction.symptoms.length > 0 &&
              (extraction.status === "extracting" ||
                extraction.status === "complete") && (
                <ExtractionPanel
                  age={extraction.age}
                  conditions={extraction.conditions}
                  location={extraction.location}
                  onSearchClick={
                    trials.length === 0 ? handleSearchTrials : undefined
                  }
                  status={trials.length > 0 ? "complete" : extraction.status}
                  symptoms={extraction.symptoms}
                />
              )}

            {trials.length > 0 && (
              <div className="space-y-3 pt-3 sm:pt-4">
                <p
                  className="font-semibold text-xs uppercase"
                  style={{
                    color: "var(--color-indigo)",
                    fontSize: "var(--font-size-xs)",
                    letterSpacing: "var(--letter-spacing-xs)",
                  }}
                >
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
