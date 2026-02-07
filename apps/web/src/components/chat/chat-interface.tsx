"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/lib/use-chat";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Trials parsing failed
    }
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <div className="flex h-full w-full flex-col px-4 pb-4 md:px-6">
      {/* Chat messages area - fills available space */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl space-y-4 py-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground">
                  Tell me about your symptoms
                </p>
                <p className="text-muted-foreground text-sm">
                  I'll help you find relevant clinical trials
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  content={message.content}
                  key={message.id}
                  role={message.role}
                />
              ))}

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
                <div className="space-y-3">
                  <p className="font-semibold text-muted-foreground text-sm uppercase">
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

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted px-4 py-2">
                    <p className="animate-pulse text-muted-foreground text-sm">
                      Thinking...
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="flex flex-col gap-3">
        <form className="mx-auto w-full max-w-2xl" onSubmit={handleSubmit}>
          <div className="flex gap-2 rounded-lg border border-muted-foreground/20 bg-background p-2">
            <textarea
              className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
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
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </form>

        <p className="text-center text-muted-foreground text-xs">
          ⚕️ Always consult with a healthcare provider. This tool is for
          discovery, not diagnosis.
        </p>
      </div>
    </div>
  );
}
