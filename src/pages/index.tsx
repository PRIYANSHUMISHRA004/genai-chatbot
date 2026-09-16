import { useEffect, useRef, useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "model";
  content: string;
};

export default function Home() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = async () => {
    const text = inputRef.current?.value.trim();
    if (!text || isLoading) return;

    // Add user message
    const updatedHistory: Message[] = [...history, { role: "user", content: text }];
    setHistory(updatedHistory);
    if (inputRef.current) inputRef.current.value = "";
    setIsLoading(true);

    try {
      // Send request to API
      const res = await axios.post("/api/chat", { history: updatedHistory });
      setHistory((prev) => [...prev, { role: "model", content: res.data.message }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setHistory((prev) => [
        ...prev,
        { role: "model", content: "⚠️ Failed to get response. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black flex flex-col text-white h-screen justify-between items-center">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-yellow-400 font-semibold py-3 text-center w-full shadow">
        Radhe Radhe • GenAI Chatbot
      </div>

      {/* Messages Output Feed */}
      <div className="flex-1 min-h-0 w-full max-w-3xl overflow-y-auto px-4 py-4">
        <ChatRender messages={history} isLoading={isLoading} />
      </div>

      {/* Input Box and Submit Button */}
      <div className="flex gap-3 my-6 w-full max-w-3xl px-4 justify-center items-center">
        <input
          type="text"
          placeholder="Enter text..."
          className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 outline-none focus:border-blue-500 transition"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shrink-0"
          disabled={isLoading}
          onClick={handleSend}
        >
          {isLoading ? "Sending..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

/* Chat Render Component with Auto-scroll */
function ChatRender({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on every new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="w-full flex flex-col gap-3">
      {messages.length === 0 && (
        <p className="text-gray-500 text-center py-10">No messages yet. Start a conversation!</p>
      )}

      {messages.map((m, i) => {
        const isUser = m.role === "user";
        return (
          <div
            key={i}
            className={`px-4 py-2.5 rounded-lg max-w-md md:max-w-lg break-words text-sm leading-relaxed ${
              isUser
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-800 text-gray-100 border border-gray-700 self-start whitespace-pre-wrap"
            }`}
          >
            {m.content}
          </div>
        );
      })}

      {isLoading && (
        <div className="bg-gray-800 text-gray-400 border border-gray-700 px-4 py-2 rounded-lg text-sm self-start animate-pulse">
          Thinking...
        </div>
      )}

      {/* Invisible anchor to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
}
