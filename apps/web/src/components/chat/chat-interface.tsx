"use client";

import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import type { TrialData } from "@/lib/use-chat";
import { useChat } from "@/lib/use-chat";
import ChatMessage from "./chat-message";
import ExtractionPanel from "./extraction-panel";
import TrialCard from "./trial-card";

const JSON_REGEX = /```json\n([\s\S]*?)\n```/;

// Function to remove JSON blocks from content
function stripJsonFromContent(content: string): string {
  return content.replace(JSON_REGEX, "").trim();
}

interface ExtractedData {
  age?: number;
  symptoms: string[];
  conditions: Array<{ name: string; probability: number }>;
  status: "gathering" | "extracting" | "searching" | "complete";
}

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const [extraction, setExtraction] = useState<ExtractedData>({
    symptoms: [],
    conditions: [],
    status: "gathering",
  });

  const [_showExtraction, _setShowExtraction] = useState(false);
  const [trials, setTrials] = useState<TrialData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmptyState = messages.length === 0;

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

    // Parse extraction
    const jsonMatch = lastMessage.content.match(JSON_REGEX);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);
        setExtraction({
          age: data.age,
          symptoms: data.symptoms || [],
          conditions: data.conditions || [],
          status: data.readyToSearch ? "complete" : "extracting",
        });
      } catch (_e) {
        // JSON parsing failed, continue
      }
    }

    // Get trials from message
    if (lastMessage.trials) {
      setTrials(lastMessage.trials);
    }
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-grow textarea
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
        className={`flex-shrink-0 overflow-hidden border-slate-200/50 border-b bg-gradient-to-b from-white to-white/80 backdrop-blur-sm transition-all duration-300 md:px-8 dark:border-slate-800/50 dark:from-slate-950 dark:to-slate-950/80 ${
          isEmptyState ? "px-6 py-6" : "px-6 py-3"
        }`}
        style={{
          maxHeight: isEmptyState ? "400px" : "70px",
        }}
      >
        {/* Navbar Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E07856] to-[#C85C3D] font-bold text-white shadow-[#E07856]/20 shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-semibold text-[#2C3E50] tracking-tight dark:text-white">
              Pre-Clinic
            </span>
          </div>
          <ModeToggle />
        </div>

        {/* Hero Headline - visible only when empty */}
        {isEmptyState && (
          <div className="mt-8 text-center opacity-100 transition-opacity duration-300">
            <h1 className="font-bold text-[#2C3E50] tracking-tight dark:text-white">
              <span className="block text-3xl md:text-4xl">
                Find Your Perfect
              </span>
              <span className="mt-2 block bg-gradient-to-r from-[#E07856] to-[#FF6B6B] bg-clip-text text-4xl text-transparent md:text-5xl">
                Clinical Trial
              </span>
            </h1>
            <p className="mt-4 text-base text-slate-600 md:text-lg dark:text-slate-400">
              AI-powered matching to discover trials tailored to you
            </p>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-4 overflow-hidden px-4 py-4 md:px-6">
        {/* LEFT: Extraction Panel - sticky sidebar */}
        {extraction.symptoms.length > 0 &&
          (extraction.status === "extracting" ||
            extraction.status === "complete") && (
            <div className="hidden w-80 flex-shrink-0 overflow-y-auto lg:block">
              <div className="sticky top-0">
                <ExtractionPanel
                  age={extraction.age}
                  conditions={extraction.conditions}
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
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Empty State - icon + prompt */}
          {isEmptyState && (
            <div className="flex flex-1 items-center justify-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E07856] to-[#C85C3D] shadow-[#E07856]/20 shadow-lg">
                <MessageCircle className="h-12 w-12 text-white" />
              </div>
            </div>
          )}

          {/* Messages area - visible when chatting */}
          {!isEmptyState && (
            <div className="flex flex-1 overflow-y-auto pb-4">
              <div className="mx-auto w-full max-w-3xl space-y-4 px-4 md:px-0">
                {messages.map((message) => (
                  <ChatMessage
                    content={stripJsonFromContent(message.content)}
                    key={message.id}
                    role={message.role}
                  />
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                      <Loader2 className="h-4 w-4 animate-spin text-[#E07856]" />
                      <p className="text-slate-600 text-sm dark:text-slate-400">
                        Thinking...
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input area - fixed at bottom, textarea grows up */}
          <div className="flex flex-shrink-0 flex-col gap-3 border-slate-200/30 border-t bg-gradient-to-b from-white/50 to-white px-4 py-4 md:px-0 dark:border-slate-700/30 dark:from-slate-900/50 dark:to-slate-900">
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-200/50 transition-all focus-within:border-[#E07856]/30 focus-within:shadow-[#E07856]/10 focus-within:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
                  <textarea
                    className="flex-1 resize-none bg-transparent py-1 text-base outline-none placeholder:text-slate-400 disabled:opacity-50"
                    disabled={isLoading}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as unknown as React.FormEvent);
                      }
                    }}
                    placeholder="Tell me about your symptoms..."
                    ref={textareaRef}
                    rows={1}
                    value={input}
                  />
                  <button
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#E07856] to-[#C85C3D] text-white shadow-[#E07856]/20 shadow-lg transition-all hover:shadow-[#E07856]/30 hover:shadow-xl disabled:opacity-50"
                    disabled={!input.trim() || isLoading}
                    type="submit"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            <p className="text-center text-slate-600 text-xs dark:text-slate-400">
              ⚕️ Always consult with a healthcare provider. This tool is for
              discovery, not diagnosis.
            </p>
          </div>
        </div>

        {/* RIGHT: Trial Cards - sticky sidebar */}
        {trials.length > 0 && (
          <div className="hidden w-96 flex-shrink-0 overflow-y-auto lg:block">
            <div className="space-y-3">
              <p className="sticky top-0 bg-gradient-to-b from-white to-white/80 py-2 font-semibold text-[#2C3E50] text-xs uppercase dark:from-slate-950 dark:to-slate-950/80 dark:text-slate-300">
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
                  onSearchClick={
                    trials.length === 0 ? handleSearchTrials : undefined
                  }
                  status={trials.length > 0 ? "complete" : extraction.status}
                  symptoms={extraction.symptoms}
                />
              )}

            {trials.length > 0 && (
              <div className="space-y-3 pt-4">
                <p className="font-semibold text-[#2C3E50] text-xs uppercase dark:text-slate-300">
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
