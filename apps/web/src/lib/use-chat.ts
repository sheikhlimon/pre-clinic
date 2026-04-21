import { useCallback, useEffect, useRef, useState } from "react";

export type { ExtractedData, Message, TrialData } from "./types";

import type { ExtractedData, Message, TrialData } from "./types";
import { cleanStreamContent } from "@/components/chat/chat-message";

export interface UseChatOptions {
  api: string;
}

async function fetchChatResponse(api: string, messages: Message[]) {
  const response = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    try {
      const body = await response.json();
      if (body.error === "missing_api_key") {
        throw new Error("MISSING_API_KEY");
      }
      if (body.error === "openrouter_error" && body.message) {
        throw new Error(`OPENROUTER_ERROR:${body.message}`);
      }
    } catch (e) {
      if (e instanceof Error) throw e;
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  return response;
}

const CHARS_PER_TICK = 2;
const TICK_MS = 30;

export function useChat({ api }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("chat_history");
    if (!saved) return [];
    try { return JSON.parse(saved); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingTrials, setIsSearchingTrials] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for the typing animation — bypasses React batching
  const targetRef = useRef("");
  const revealedRef = useRef(0);
  const assistantIdRef = useRef("");
  const streamDoneRef = useRef(false);
  const metadataRef = useRef<{ extractedData?: ExtractedData; trials?: TrialData[] }>({});
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      const clean = messages.map(({ isNew, ...rest }) => rest);
      localStorage.setItem("chat_history", JSON.stringify(clean));
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
      };

      const assistantId = (Date.now() + 1).toString();
      assistantIdRef.current = assistantId;
      targetRef.current = "";
      revealedRef.current = 0;
      streamDoneRef.current = false;
      metadataRef.current = {};

      setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "", isNew: true }]);
      setIsLoading(true);
      setIsSearchingTrials(false);
      setError(null);

      // Start the animation ticker — it always chases targetRef
      typingRef.current = setInterval(() => {
        const target = targetRef.current;
        const revealed = revealedRef.current;

        if (revealed < target.length) {
          revealedRef.current = Math.min(revealed + CHARS_PER_TICK, target.length);

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.id === assistantIdRef.current) {
              updated[updated.length - 1] = {
                ...last,
                content: target.slice(0, revealedRef.current),
              };
            }
            return updated;
          });
        } else if (streamDoneRef.current && revealed >= target.length) {
          // Stream finished and animation caught up — final update with metadata
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.id === assistantIdRef.current) {
              updated[updated.length - 1] = {
                ...last,
                content: target,
                isNew: false,
                extractedData: metadataRef.current.extractedData,
                trials: metadataRef.current.trials,
              };
            }
            return updated;
          });
          clearInterval(typingRef.current!);
          typingRef.current = null;
        }
      }, TICK_MS);

      // Stream chunks from the server — grow targetRef as data arrives
      try {
        const newMessages = [...messages, userMessage];
        const response = await fetchChatResponse(api, newMessages);
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let rawContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            for (const line of part.split("\n")) {
              if (!line.startsWith("data: ")) continue;
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  rawContent += data.content;
                  targetRef.current = cleanStreamContent(rawContent);
                }
                if (data.extractedData) metadataRef.current.extractedData = data.extractedData;
                if (data.searchingTrials) setIsSearchingTrials(true);
                if (data.trials) {
                  metadataRef.current.trials = data.trials;
                  setIsSearchingTrials(false);
                }
              } catch { /* skip */ }
            }
          }
        }

        streamDoneRef.current = true;
      } catch (err) {
        if (err instanceof Error && err.message === "MISSING_API_KEY") {
          setError("missing_api_key");
        } else if (err instanceof Error && err.message.startsWith("OPENROUTER_ERROR:")) {
          setError(err.message.slice("OPENROUTER_ERROR:".length));
        }
        console.error("Chat error:", err);
        streamDoneRef.current = true;
        if (typingRef.current) { clearInterval(typingRef.current); typingRef.current = null; }
      } finally {
        setIsLoading(false);
      }
    },
    [api, isLoading, messages],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input;
      setInput("");
      await sendMessage(text);
    },
    [input, sendMessage],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const clearChat = useCallback(() => {
    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = null;
    setMessages([]);
    localStorage.removeItem("chat_history");
    setError(null);
  }, []);

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    sendMessage,
    isLoading,
    error,
    clearChat,
  };
}
