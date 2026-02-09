"use client";

import {
  Activity,
  ChevronDown,
  ChevronUp,
  Github,
  Loader2,
  RotateCcw,
  Search,
  Send,
} from "lucide-react";
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
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    clearChat,
  } = useChat({
    api: "/api/chat",
  });

  const [extraction, setExtraction] = useState<ExtractedData>({
    symptoms: [],
    conditions: [],
    status: "gathering",
  });

  const [trials, setTrials] = useState<TrialData[]>([]);
  const [mobileCardsExpanded, setMobileCardsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmptyState = messages.length === 0;

  // Get extraction data and trials from AI messages - backend handles extraction and search internally
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") {
      return;
    }

    // Debug: log the entire message object
    // eslint-disable-next-line no-console
    console.log(
      "useEffect triggered. Last message keys:",
      Object.keys(lastMessage)
    );
    // eslint-disable-next-line no-console
    console.log(
      "Has trials?",
      !!lastMessage.trials,
      "Count:",
      lastMessage.trials?.length || 0
    );

    // Update extraction panel when backend sends extraction data
    if (lastMessage.extractedData) {
      // eslint-disable-next-line no-console
      console.log("Frontend received extraction:", lastMessage.extractedData);
      setExtraction({
        age: lastMessage.extractedData.age,
        symptoms: lastMessage.extractedData.symptoms || [],
        conditions: lastMessage.extractedData.conditions || [],
        status: lastMessage.extractedData.readyToSearch
          ? "complete"
          : "extracting",
      });
    }

    // Update trials when backend sends them
    if (lastMessage.trials && lastMessage.trials.length > 0) {
      // eslint-disable-next-line no-console
      console.log("Frontend received trials:", lastMessage.trials.length);
      setTrials(lastMessage.trials);
    }
  }, [messages]);

  // Auto-scroll to bottom on new messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: messages needed to trigger scroll
  useEffect(() => {
    if (!isEmptyState) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isEmptyState]);

  // Auto-grow textarea
  // biome-ignore lint/correctness/useExhaustiveDependencies: input needed for resize calculation
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Maintain focus on textarea - always keep it focused for continuous typing
  useEffect(() => {
    // Focus textarea whenever not loading (user is typing or waiting to type)
    if (!isLoading && textareaRef.current && document.hasFocus()) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

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
          maxHeight: isEmptyState ? "400px" : "auto",
        }}
      >
        {/* Navbar Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#E07856] to-[#C85C3D] font-bold text-white shadow-lg">
              <Activity className="h-5 w-5" />
              <div className="absolute -right-0.5 -bottom-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#A8D5BA] font-bold text-[#2C3E50] text-xs">
                <Search className="h-2 w-2" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#2C3E50] text-lg tracking-tight dark:text-white">
                PreClinic
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEmptyState && (
              <button
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-600 text-sm transition-colors hover:bg-slate-100 sm:px-3 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={() => {
                  clearChat();
                  setExtraction({
                    symptoms: [],
                    conditions: [],
                    status: "gathering",
                  });
                  setTrials([]);
                }}
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

        {/* Hero Headline - visible only when empty */}
        {isEmptyState && (
          <div className="mt-8 text-center opacity-100 transition-opacity duration-300">
            <h1 className="font-bold text-[#2C3E50] tracking-tight dark:text-white">
              <span className="block text-3xl md:text-4xl">
                Find Cancer Clinical
              </span>
              <span className="mt-2 block bg-gradient-to-r from-[#E07856] to-[#FF6B6B] bg-clip-text text-4xl text-transparent md:text-5xl">
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
                  status={trials.length > 0 ? "complete" : extraction.status}
                  symptoms={extraction.symptoms}
                />
              </div>
            </div>
          )}

        {/* CENTER: Chat Interface */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Empty State - clickable prompt cards */}
          {isEmptyState && (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Prompt Card 1 - Symptom based */}
                <button
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-[#E07856]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-[#E07856]/30"
                  onClick={() => {
                    const prompt =
                      "I'm experiencing symptoms and want to find clinical trials that might help";
                    setInput(prompt);
                    // Directly set textarea value for immediate submission
                    if (textareaRef.current) {
                      textareaRef.current.value = prompt;
                    }
                    // Submit the form with a small delay to ensure value is set
                    setTimeout(() => {
                      const form = textareaRef.current?.closest("form");
                      if (form) {
                        form.requestSubmit();
                      }
                    }, 10);
                  }}
                  type="button"
                >
                  <p className="text-base text-slate-700 dark:text-slate-200">
                    I have symptoms and want to find relevant clinical trials
                  </p>
                </button>

                {/* Prompt Card 2 - Condition based */}
                <button
                  className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-[#E07856]/30 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-[#E07856]/30"
                  onClick={() => {
                    const prompt =
                      "I've been diagnosed with cancer and looking for treatment options";
                    setInput(prompt);
                    // Directly set textarea value for immediate submission
                    if (textareaRef.current) {
                      textareaRef.current.value = prompt;
                    }
                    // Submit the form with a small delay to ensure value is set
                    setTimeout(() => {
                      const form = textareaRef.current?.closest("form");
                      if (form) {
                        form.requestSubmit();
                      }
                    }, 10);
                  }}
                  type="button"
                >
                  <p className="text-base text-slate-700 dark:text-slate-200">
                    I have a diagnosis and looking for clinical trial options
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Messages area - visible when chatting, includes mobile cards */}
          {!isEmptyState && (
            <div className="flex flex-1 overflow-y-auto pb-4">
              <div className="mx-auto w-full max-w-3xl space-y-4 py-4">
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

                {/* MOBILE ONLY: Collapsible cards section inline with messages */}
                {(extraction.symptoms.length > 0 || trials.length > 0) && (
                  <div className="lg:hidden">
                    <button
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                      onClick={() =>
                        setMobileCardsExpanded(!mobileCardsExpanded)
                      }
                      type="button"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-600 text-xs uppercase dark:text-slate-400">
                          {trials.length > 0
                            ? `${trials.length} trials found`
                            : "Extracted info"}
                        </span>
                        {extraction.symptoms.length > 0 && (
                          <span className="rounded-full bg-[#E07856] px-2 py-0.5 text-white text-xs">
                            {extraction.symptoms.length} symptoms
                          </span>
                        )}
                      </div>
                      {mobileCardsExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>

                    {mobileCardsExpanded && (
                      <div className="mt-3 space-y-3">
                        {extraction.symptoms.length > 0 &&
                          (extraction.status === "extracting" ||
                            extraction.status === "complete") && (
                            <ExtractionPanel
                              age={extraction.age}
                              conditions={extraction.conditions}
                              status={
                                trials.length > 0
                                  ? "complete"
                                  : extraction.status
                              }
                              symptoms={extraction.symptoms}
                            />
                          )}

                        {trials.length > 0 &&
                          trials.map((trial) => (
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

                <div className="pt-2" ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input area - fixed size, textarea grows */}
          <div className="flex flex-shrink-0 flex-col gap-3 px-4 py-4 pb-safe">
            <form onSubmit={handleSubmit}>
              <div className="mx-auto w-full max-w-3xl">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-200/50 transition-all focus-within:border-[#E07856]/30 focus-within:shadow-[#E07856]/10 focus-within:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-900/50">
                  <textarea
                    autoFocus
                    className="flex-1 resize-none bg-transparent py-0.5 text-base outline-none placeholder:text-slate-400 disabled:opacity-50"
                    disabled={isLoading}
                    onChange={handleInputChange}
                    onFocus={(e) => {
                      e.currentTarget.setSelectionRange(
                        input.length,
                        input.length
                      );
                    }}
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
      </div>
    </div>
  );
}
