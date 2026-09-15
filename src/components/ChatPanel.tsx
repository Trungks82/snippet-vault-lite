"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatResponse, Citation } from "@/lib/types";

const SUGGESTIONS = [
  "What plans do you offer and how much do they cost?",
  "How do refunds work within 14 days?",
  "Do I need an OpenAI API key for the demo?",
  "What happens if I cancel mid-cycle?",
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function Citations({ citations }: { citations: Citation[] }) {
  if (!citations.length) return null;
  return (
    <div className="mt-3 space-y-2 border-t border-slate-200/80 pt-3 dark:border-slate-700">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Citations
      </p>
      {citations.map((c) => (
        <div
          key={c.id}
          className="rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-xs dark:border-indigo-900/50 dark:bg-indigo-950/40"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-indigo-900 dark:text-indigo-200">
              {c.title}
            </span>
            <span className="shrink-0 rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              {c.source} · {c.score}
            </span>
          </div>
          <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
            {c.excerpt}
          </p>
        </div>
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm sm:max-w-[75%] ${
          isUser
            ? "bg-indigo-600 text-white"
            : "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        }`}
      >
        {!isUser && message.mode && (
          <span
            className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              message.mode === "openai"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
            }`}
          >
            {message.mode === "openai" ? "OpenAI" : "Demo mode"}
          </span>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
        {!isUser && message.citations && (
          <Citations citations={message.citations} />
        )}
      </div>
    </div>
  );
}

async function simulateStream(
  full: string,
  onUpdate: (partial: string) => void,
) {
  const words = full.split(/(\s+)/);
  let acc = "";
  for (const w of words) {
    acc += w;
    onUpdate(acc);
    await new Promise((r) => setTimeout(r, 12 + Math.random() * 18));
  }
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      setInput("");
      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      const assistantId = uid();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });
        const data = (await res.json()) as ChatResponse & { error?: string };
        if (!res.ok) throw new Error(data.error || "Request failed");

        await simulateStream(data.answer, (partial) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: partial,
                    citations: data.citations,
                    mode: data.mode,
                  }
                : m,
            ),
          );
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        setError(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 py-4 sm:px-6">
        <div className="mb-4 shrink-0">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
            Support chat
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ask about pricing, refunds, or product FAQ. Works in demo mode
            without an API key — citations always shown.
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-600/25">
                💬
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  Try a sample question
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Retrieval runs locally over markdown in{" "}
                  <code className="rounded bg-slate-200 px-1 dark:bg-slate-800">
                    content/knowledge/
                  </code>
                </p>
              </div>
              <div className="flex max-w-lg flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-left text-xs text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {loading && messages[messages.length - 1]?.content === "" && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
                Retrieving docs…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Ask a support question…"
            disabled={loading}
            className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="self-end rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
