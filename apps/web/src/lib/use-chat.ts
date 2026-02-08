import { useCallback, useState } from "react";

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
        onExtractedData(data.extractedData);
      }
      if (data.trials && onTrials) {
        onTrials(data.trials);
      }
    } catch {
      // Skip unparseable lines
    }
  }
}

export function useChat({ api }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

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

              if (messageAdded) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated.at(-1);
                  if (lastMsg?.id === assistantId) {
                    lastMsg.content = assistantContent;
                  }
                  return updated;
                });
              } else {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: assistantId,
                    role: "assistant",
                    content: assistantContent,
                  },
                ]);
                messageAdded = true;
              }
            },
            (extractedData) => {
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated.at(-1);
                if (lastMsg?.id === assistantId) {
                  lastMsg.extractedData = extractedData;
                }
                return updated;
              });
            },
            (trials) => {
              setMessages((prev) => {
                const updated = [...prev];
                const lastMsg = updated.at(-1);
                if (lastMsg?.id === assistantId) {
                  lastMsg.trials = trials;
                }
                return updated;
              });
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

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    isStreaming,
  };
}
