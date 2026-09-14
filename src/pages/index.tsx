import React, { useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "model";
  content: string;
};

export default function Home() {
  const [chat, setChat] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    const chatText = chat.trim();
    if (!chatText || isLoading) return;

    // Add user message to history
    const updatedHistory = [...history, { role: "user" as const, content: chatText }];
    setHistory(updatedHistory);
    setChat("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chat/", {
        history: updatedHistory,
      });
      setHistory((prev) => [
        ...prev,
        { role: "model" as const, content: res.data.message },
      ]);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        alert("⚠️ Gemini API Quota Exceeded! Please try again later.");
      } else {
        console.error("Error communicating with AI agent:", error);
        setHistory((prev) => [
          ...prev,
          { role: "model" as const, content: "Error: Failed to fetch response from AI agent. Please try again." },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearHistory() {
    setHistory([]);
    setChat("");
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar: col-span-1 */}
      <aside className="hidden md:flex md:col-span-1 bg-zinc-900 border-r border-zinc-800 flex-col h-full p-4">
        {/* Title */}
        <div className="p-2 mb-3">
          <div className="font-extrabold text-blue-500 flex items-center gap-2.5 text-lg tracking-tight">
            <svg
              className="w-5 h-5 text-blue-500 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8" y2="16" />
              <line x1="16" y1="16" x2="16" y2="16" />
            </svg>
            <span>GenAI Chatbot</span>
          </div>
        </div>

        {/* Action Button: New Chat */}
        <button
          type="button"
          onClick={handleClearHistory}
          className="w-full flex items-center justify-center gap-2 border border-zinc-700 hover:border-blue-500 hover:bg-blue-500/10 text-zinc-100 font-semibold rounded-xl py-2 mb-4 transition text-sm"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>

        <div className="border-b border-zinc-800 mb-4" />

        {/* Recent Section */}
        <div className="flex-1 overflow-y-auto">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2 mb-2 block">
            Conversations
          </span>
          <div>
            {history.length > 0 ? (
              <div className="bg-white/[0.03] rounded-lg border-l-2 border-blue-500 py-2 px-3 flex items-center gap-2.5 w-full">
                <svg
                  className="w-4 h-4 text-blue-500 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="text-sm text-zinc-200 truncate">
                  {history[0].content}
                </span>
              </div>
            ) : (
              <p className="text-sm px-2 text-zinc-500 italic">
                No active conversations
              </p>
            )}
          </div>
        </div>

        <div className="border-b border-zinc-800 my-4" />

        {/* Sidebar Footer */}
        <div className="p-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-zinc-400">
            Platform: Online
          </span>
        </div>
      </aside>

      {/* Main chat window: col-span-4 */}
      <main className="col-span-1 md:col-span-4 flex flex-col h-screen relative">
        {/* Header */}
        <header className="h-[60px] border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Active Session
            </h1>
            <span className="text-xs text-zinc-400 block">
              Powered by Gemini 2.5 Flash
            </span>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Clear Chat
            </button>
          )}
        </header>

        {/* Message Feed / Central Box */}
        <div
          className={`flex-1 overflow-y-auto p-4 md:p-8 flex flex-col ${
            history.length === 0 ? "justify-center" : "justify-start"
          }`}
        >
          {history.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center text-center pb-8">
              <div className="bg-blue-500/10 rounded-full p-4 mb-3 border border-blue-500/20 text-blue-500">
                <svg
                  className="w-12 h-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8" y2="16" />
                  <line x1="16" y1="16" x2="16" y2="16" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-1.5 tracking-tight">
                Welcome to GenAI Chatbot
              </h2>
              <p className="text-sm text-zinc-500 max-w-sm mb-1">
                Ask me to help you design components, write files, run terminal commands, or build web interfaces.
              </p>
            </div>
          ) : (
            /* Chat Messages */
            <div className="flex flex-col gap-5 max-w-3xl w-full mx-auto">
              {history.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex w-full ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      } gap-3 max-w-[85%] md:max-w-[75%] items-start`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isUser
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 border border-zinc-700 text-blue-500"
                        }`}
                      >
                        {isUser ? (
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="11" width="18" height="10" rx="2" />
                            <circle cx="12" cy="5" r="2" />
                            <path d="M12 7v4" />
                            <line x1="8" y1="16" x2="8" y2="16" />
                            <line x1="16" y1="16" x2="16" y2="16" />
                          </svg>
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`p-4 rounded-2xl shadow-md ${
                          isUser
                            ? "rounded-br-sm bg-blue-600 text-white"
                            : "rounded-bl-sm bg-zinc-900 border border-zinc-800 text-zinc-200"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Thinking Loader */}
              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-blue-500">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <circle cx="12" cy="5" r="2" />
                        <path d="M12 7v4" />
                        <line x1="8" y1="16" x2="8" y2="16" />
                        <line x1="16" y1="16" x2="16" y2="16" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-zinc-500 italic">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 md:p-6 bg-zinc-950 shrink-0">
          <div className="flex items-center bg-zinc-900 w-full md:w-3/5 max-w-2xl mx-auto p-1.5 pl-4 pr-1.5 rounded-full border border-zinc-800 h-14 shadow-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
            <input
              type="text"
              value={chat}
              disabled={isLoading}
              onChange={(e) => setChat(e.target.value)}
              placeholder="Ask me anything"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-white text-[0.95rem] px-2 placeholder-zinc-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!chat.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/[0.08] disabled:text-white/30 text-white rounded-full font-bold px-6 h-10 text-sm transition flex items-center justify-center shrink-0"
            >
              Ask
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
