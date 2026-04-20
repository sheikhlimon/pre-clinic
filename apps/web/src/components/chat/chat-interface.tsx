"use client";

import { Activity, Github, Loader2, RotateCcw } from "lucide-react";
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

const JSON_REGEX = /```json\s*\n?([\s\S]*?)\n?\s*```/g;
const XML_TAG_REGEX = /<\/?[a-zA-Z][\w-]*(?:\s[^>]*)?\/?>/g;
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
  return content.replace(JSON_REGEX, "").replace(XML_TAG_REGEX, "").trim();
}

export default function ChatInterface() {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    sendMessage,
    isLoading,
    isStreaming,
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

  useEffect(() => {
    if (!isEmptyState) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isEmptyState]);

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
      sendMessage(text);
    },
    [sendMessage],
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Navbar */}
      <div
        className={`flex-shrink-0 border-b border-[var(--color-cream-dark)] bg-[var(--color-cream)]/80 backdrop-blur-md dark:border-[#2a2520] dark:bg-[#1a1714]/80 ${
          isEmptyState ? "px-6 py-3 md:px-10" : "px-4 py-2.5 md:px-6"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-terracotta)]">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[var(--color-indigo)] text-base font-semibold tracking-tight dark:text-[#e8e0d4]">
                PreClinic
              </span>
              <span className="hidden text-slate-400 text-xs sm:inline dark:text-slate-500">
                clinical trial finder
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isEmptyState && (
              <button
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-slate-500 text-sm transition-colors hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/5"
                onClick={handleClear}
                type="button"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New search</span>
              </button>
            )}
            <a
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-black/5 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-slate-300"
              href="https://github.com/sheikhlimon/pre-clinic"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="h-4 w-4" />
            </a>
            <ModeToggle />
          </div>
        </div>

        {/* Hero — editorial layout */}
        {isEmptyState && (
          <div className="mx-auto mt-6 max-w-2xl text-left md:mt-8 md:text-center lg:mt-12">
            <p className="mb-2 text-[var(--color-terracotta)] text-xs font-medium uppercase tracking-widest animate-fadeIn md:text-sm dark:text-[var(--color-terracotta-light)]">
              Oncology trial matching
            </p>
            <h1 className="font-display text-[var(--color-indigo)] leading-[1.1] tracking-tight dark:text-[#e8e0d4] animate-slideUpFade">
              <span className="block text-3xl md:text-4xl lg:text-5xl">
                Find the trial
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl">
                that fits{" "}
                <em className="not-italic text-[var(--color-terracotta)] dark:text-[var(--color-terracotta-light)]">
                  your story
                </em>
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 md:mt-4 md:text-base animate-slideUpFade stagger-2 dark:text-slate-400">
              Describe your symptoms or diagnosis. Our AI matches you with
              active oncology clinical trials from ClinicalTrials.gov.
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden px-4 pt-0 pb-4 md:px-6">
        {/* LEFT: Extraction Panel */}
        {hasExtraction && (
          <div className="hidden w-72 flex-shrink-0 overflow-y-auto lg:block">
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
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {isEmptyState ? (
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {PROMPTS.map((text, i) => (
                  <PromptCard
                    key={text}
                    onSelect={handlePromptSelect}
                    text={text}
                    index={i}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 overflow-y-auto pb-4 scrollbar-thin">
              <div className="mx-auto w-full max-w-3xl space-y-4 pt-3 pb-4">
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

                {isLoading && !isStreaming && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3 shadow-sm dark:bg-[#1e1b18]/80">
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--color-terracotta)]" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
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
          <div className="hidden w-80 flex-shrink-0 overflow-y-auto lg:block scrollbar-thin">
            <div className="space-y-3">
              <p className="sticky top-0 bg-[var(--color-cream)]/90 py-2 font-display text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta)] backdrop-blur-sm dark:bg-[#141210]/90">
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
