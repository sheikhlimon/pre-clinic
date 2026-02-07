"use client";

import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import ChatMessage from "./chat-message";
import ExtractionPanel from "./extraction-panel";
import TrialCard from "./trial-card";

const JSON_REGEX = /```json\n([\s\S]*?)\n```/;
const TRIALS_REGEX = /"trials":\s*\[([\s\S]*?)\]/;

interface ExtractedData {
  age?: number;
  symptoms: string[];
  conditions: Array<{ name: string; probability: number }>;
  status: "gathering" | "extracting" | "searching" | "complete";
}

interface Trial {
  nctId: string;
  title: string;
  relevanceScore: number;
  matchReasons: string[];
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

  const [trials, setTrials] = useState<Trial[]>([]);

  // Parse extraction from AI messages
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") {
      return;
    }

    const jsonMatch = lastMessage.content.match(JSON_REGEX);
    if (!jsonMatch) {
      return;
    }

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
      return;
    }

    // Parse trials if present
    const trialsMatch = lastMessage.content.match(TRIALS_REGEX);
    if (!trialsMatch) {
      return;
    }

    try {
      const trialsData = JSON.parse(`[${trialsMatch[0].split(":")[1]}`);
      setTrials(trialsData);
    } catch (_e) {
      // Trials parsing failed, continue
    }
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _parsed = JSON.parse(saved);
        // useChat will handle message loading
      } catch (_e) {
        // localStorage parsing failed
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  return (
    <section className="px-4 py-12 md:px-6 md:py-24">
      <div className="container max-w-4xl">
        {/* Chat messages */}
        <div className="mb-8 max-h-96 space-y-4 overflow-y-auto rounded-lg border border-muted-foreground/10 bg-background/50 p-6 backdrop-blur-sm">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                Start by telling me about your symptoms...
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                content={message.content}
                key={message.id}
                role={message.role}
              />
            ))
          )}

          {/* Extraction panel when ready */}
          {extraction.symptoms.length > 0 &&
            (extraction.status === "extracting" ||
              extraction.status === "complete") && (
              <ExtractionPanel
                age={extraction.age}
                conditions={extraction.conditions}
                status={trials.length > 0 ? "complete" : extraction.status}
                symptoms={extraction.symptoms}
              />
            )}

          {/* Trial cards */}
          {trials.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="font-semibold text-muted-foreground text-sm uppercase">
                Matching trials:
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

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-muted px-4 py-2">
                <p className="animate-pulse text-muted-foreground text-sm">
                  Thinking...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chat input */}
        <form
          className="flex gap-2 rounded-lg border border-muted-foreground/20 bg-background p-3"
          onSubmit={handleSubmit}
        >
          <textarea
            className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
            disabled={isLoading}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Tell me about your symptoms..."
            rows={1}
            value={input}
          />
          <button
            className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={!input.trim() || isLoading}
            type="submit"
          >
            {isLoading ? "..." : "→"}
          </button>
        </form>

        {/* Footer disclaimer */}
        <p className="mt-6 text-center text-muted-foreground text-xs">
          ⚕️ Always consult with a healthcare provider. This tool is for
          discovery, not diagnosis.
        </p>
      </div>
    </section>
  );
}
