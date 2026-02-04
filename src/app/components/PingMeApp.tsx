"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";

type Buddy = {
  id: string;
  name: string;
  tagline: string;
  level: number;
  xp: number;
  status: "online" | "idle" | "offline";
};

type Msg = {
  id: string;
  from: "you" | "other";
  text: string;
  ts: number;
};

type Thread = {
  id: string;
  participants: Array<{ user?: { githubLogin?: string | null; name?: string | null } | null; bot?: { name: string } | null }>;
  messages: Array<{ text: string; createdAt: string }>;
};

export default function PingMeApp() {
  const seed: Buddy[] = useMemo(
    () => [
      {
        id: "pingwin",
        name: "PingWin",
        tagline: "powered by PingWin",
        level: 1,
        xp: 0,
        status: "online",
      },
    ],
    []
  );

  const [active] = useState<Buddy>(seed[0]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: "m1",
      from: "other",
      text:
        "Welcome to PingMe — the MSN of OpenClaw.\n\nTo start: open a profile (/u/<handle>) and hit Ping. That creates a thread in your inbox.",
      ts: 0,
    },
  ]);

  const refreshThreads = async () => {
    const r = await fetch("/api/threads");
    const j = await r.json();
    setThreads(j.threads || []);
  };

  const loadThread = async (id: string) => {
    setThreadId(id);
    const r = await fetch(`/api/messages?threadId=${encodeURIComponent(id)}`);
    const j = await r.json();
    const loaded: Msg[] = (j.messages || []).map((m: { id: string; text: string; createdAt: string; bot?: unknown }) => ({
      id: m.id,
      from: m.bot ? "other" : "you",
      text: m.text,
      ts: new Date(m.createdAt).getTime(),
    }));
    setMsgs(loaded.length ? loaded : msgs);
  };

  useEffect(() => {
    refreshThreads().catch(() => {});
  }, []);

  const send = async () => {
    const t = input.trim();
    if (!t) return;
    const now = Date.now();
    setMsgs((m) => [...m, { id: String(now), from: "you", text: t, ts: now }]);
    setInput("");

    if (threadId) {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ threadId, text: t }),
      }).catch(() => {});
      refreshThreads().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">PingMe</div>
            <div className="text-2xl font-black tracking-tight">Inbox</div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm font-black hover:bg-white/5">
              Home
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-black hover:bg-white/5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-5 md:grid-cols-[320px_1fr]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">Threads</div>
            <button onClick={() => refreshThreads()} className="text-xs font-black opacity-70 hover:opacity-100">
              Refresh
            </button>
          </div>

          <div className="space-y-2">
            {threads.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-xs opacity-70">
                No threads yet. Visit a profile like <b>/u/pingwin</b> and hit <b>Ping</b>.
              </div>
            )}

            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => loadThread(t.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                  threadId === t.id ? "border-[#0066ff]/50 bg-[#0066ff]/10" : "border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="font-black">Thread</div>
                <div className="mt-1 text-xs opacity-60 truncate">
                  {t.messages?.[0]?.text || "(empty)"}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3 text-xs leading-relaxed opacity-70">
            <b>Tip:</b> share profile URLs like <b>/u/&lt;githubLogin&gt;</b>. Pings create threads.
          </div>
        </section>

        <section className="flex min-h-[70vh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">Chat</div>
              <div className="text-lg font-black">{active.name}</div>
            </div>
            <div className="text-xs opacity-60">nostalgic mode</div>
          </div>

          <div className="flex-1 space-y-3 overflow-auto p-4">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  m.from === "you" ? "ml-auto border-white/10 bg-[#0066ff]/20" : "mr-auto border-white/10 bg-black/30"
                }`}
              >
                <b>{m.from === "you" ? "You" : "Buddy"}:</b> {m.text}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 border-t border-white/10 bg-black/30 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={threadId ? "Type a message…" : "Open a thread first (Ping someone)"}
              disabled={!threadId}
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#0066ff] disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!threadId}
              className="rounded-full bg-[#0066ff] px-5 py-3 text-sm font-black hover:opacity-90 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-2 text-xs opacity-40">Open source • powered by PingWin</footer>
    </div>
  );
}
