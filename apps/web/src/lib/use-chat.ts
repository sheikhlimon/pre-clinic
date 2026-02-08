import { useCallback, useEffect, useState } from "react";

export interface ExtractedData {
  age?: number;
  symptoms: string[];
  location?: string;
  conditions: Array<{ name: string; probability: number }>;
  readyToSearch?: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  trials?: TrialData[];
  extractedData?: ExtractedData;
}

export interface UseChatOptions {
  api: string;
}

export interface TrialData {
  nctId: string;
  title: string;
  relevanceScore: number;
  matchReasons: string[];
}

async function fetchChatResponse(api: string, messages: Message[]) {
  const response = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response;
}

function processStreamChunk(
  chunk: string,
  onContent: (content: string) => void,
  onExtractedData?: (data: ExtractedData) => void,
  onTrials?: (trials: TrialData[]) => void
) {
  const lines = chunk.split("\n");

  for (const line of lines) {
    if (!line.startsWith("data: ")) {
      continue;
    }

    try {
      const data = JSON.parse(line.slice(6));
      if (data.content) {
        onContent(data.content);
      }
      if (data.extractedData && onExtractedData) {
        // eslint-disable-next-line no-console
        console.log("processStreamChunk: Found extractedData");
        onExtractedData(data.extractedData);
      }
      if (data.trials && onTrials) {
        // eslint-disable-next-line no-console
        console.log("processStreamChunk: Found trials:", data.trials.length);
        onTrials(data.trials);
      }
    } catch {
      // Skip unparseable lines
    }
  }
}

export function useChat({ api }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const saved = localStorage.getItem("chat_history");
    if (!saved) {
      return [];
    }
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) {
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const newMessages = [...messages, userMessage];
        const response = await fetchChatResponse(api, newMessages);

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response stream");
        }

        const assistantId = (Date.now() + 1).toString();
        let assistantContent = "";
        let messageAdded = false;
        let streamingStarted = false;

        // Track message state locally to avoid race conditions
        let messageState: Message = {
          id: assistantId,
          role: "assistant",
          content: "",
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = new TextDecoder().decode(value);
          processStreamChunk(
            chunk,
            (content) => {
              assistantContent += content;

              // Hide thinking indicator when streaming starts
              if (!streamingStarted && content) {
                streamingStarted = true;
                setIsStreaming(true);
              }

              // Update messageState with new content
              messageState = { ...messageState, content: assistantContent };

              if (messageAdded) {
                // Update existing message with new content
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated.at(-1);
                  if (lastMsg?.id === assistantId) {
                    updated[updated.length - 1] = { ...messageState };
                  }
                  return updated;
                });
              } else {
                setMessages((prev) => [...prev, { ...messageState }]);
                messageAdded = true;
              }
            },
            (extractedData) => {
              // eslint-disable-next-line no-console
              console.log("use-chat: Updating extractedData");
              messageState = { ...messageState, extractedData };
              if (messageAdded) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated.at(-1);
                  if (lastMsg?.id === assistantId) {
                    updated[updated.length - 1] = { ...messageState };
                  }
                  return updated;
                });
              }
            },
            (trials) => {
              // eslint-disable-next-line no-console
              console.log("use-chat: Received trials callback:", trials.length);
              messageState = { ...messageState, trials };
              if (messageAdded) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated.at(-1);
                  if (lastMsg?.id === assistantId) {
                    // eslint-disable-next-line no-console
                    console.log(
                      "use-chat: Attaching trials to existing message"
                    );
                    updated[updated.length - 1] = { ...messageState };
                  }
                  return updated;
                });
              }
            }
          );
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Chat error:", error);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [api, input, isLoading, messages]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("chat_history");
  }, []);

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    isStreaming,
    clearChat,
  };
}
