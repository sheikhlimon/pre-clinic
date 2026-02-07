"use client";

import { Loader2, MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TrialData } from "@/lib/use-chat";
import { useChat } from "@/lib/use-chat";
import ChatMessage from "./chat-message";
import ExtractionPanel from "./extraction-panel";
import TrialCard from "./trial-card";

const JSON_REGEX = /```json\n([\s\S]*?)\n```/;

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

  const [trials, setTrials] = useState<TrialData[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
              <div className="space-y-4">
                <div className="mx-auto mx-flex flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/20">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    Tell me about your symptoms
                  </p>
                  <p className="text-muted-foreground text-sm">
                    I'll help you find relevant clinical trials
                  </p>
                </div>
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
                  <p className="font-semibold text-sm text-stone-700 uppercase dark:text-stone-300">
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
                  <div className="flex items-center gap-2 rounded-2xl bg-stone-100 px-4 py-3 dark:bg-stone-800">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                    <p className="text-muted-foreground text-sm">Thinking...</p>
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
          <div className="flex gap-2 rounded-2xl border border-stone-200 bg-white px-2 py-2 shadow-lg shadow-stone-200/50 transition-shadow focus-within:shadow-rose-500/10 focus-within:shadow-xl dark:border-stone-700 dark:bg-stone-900 dark:shadow-stone-900/50">
            <textarea
              className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-stone-400 disabled:opacity-50"
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
              className="flex-shrink-0 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 px-4 py-2 font-medium text-sm text-white shadow-lg shadow-rose-500/20 transition-all hover:shadow-rose-500/30 hover:shadow-xl disabled:opacity-50"
              disabled={!input.trim() || isLoading}
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
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
