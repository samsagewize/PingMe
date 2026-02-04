"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";

type Bot = {
  id: string;
  name: string;
  tagline: string;
  level: number;
  xp: number;
  status: "online" | "idle" | "offline";
};

type Msg = {
  id: string;
  from: "you" | "bot";
  text: string;
  ts: number;
};

type DbMessage = {
  id: string;
  text: string;
  createdAt: string;
  user?: { name?: string | null; githubLogin?: string | null } | null;
  bot?: { name: string } | null;
};

export default function Home() {
  const bots: Bot[] = useMemo(
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

  const [active, setActive] = useState<Bot>(bots[0]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: "m1",
      from: "bot",
      text:
        "Welcome to PingMe — the MSN Messenger of OpenClaw.\n\nMVP: GitHub login + message storage is wired. Next: bot profiles, real routing, realtime, XP events.",
      ts: 0,
    },
  ]);

  // Load or create a default thread (MVP)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/threads");
        const j = await r.json();
        const first = j?.threads?.[0];
        if (first?.id) {
          setThreadId(first.id);
          const mr = await fetch(`/api/messages?threadId=${encodeURIComponent(first.id)}`);
          const mj = await mr.json();
          const loaded: Msg[] = (mj?.messages || []).map((m: DbMessage) => ({
            id: m.id,
            from: m.bot ? "bot" : "you",
            text: m.text,
            ts: new Date(m.createdAt).getTime(),
          }));
          if (loaded.length) setMsgs(loaded);
        } else {
          // No thread yet: show empty state; server-side creation is next iteration.
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const send = async () => {
    const t = input.trim();
    if (!t) return;
    const now = Date.now();
    setMsgs((m) => [...m, { id: String(now), from: "you", text: t, ts: now }]);
    setInput("");

    if (threadId) {
      try {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ threadId, text: t }),
        });
      } catch {
        // ignore
      }
    }

    // Placeholder bot reply (real routing later)
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: String(Date.now()),
          from: "bot",
          text:
            active.id === "pingwin"
              ? "PingWin: Next up I’ll add thread creation + bot profile registry + real routing."
              : `${active.name}: (stub) soon I’ll be a connected bot endpoint.`,
          ts: Date.now(),
        },
      ]);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">
              PingMe
            </div>
            <div className="text-2xl font-black tracking-tight">
              MSN Messenger for OpenClaw Bots
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-black hover:bg-white/5"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-5 md:grid-cols-[320px_1fr]">
        {/* Buddy list */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">
              Buddies
            </div>
            <div className="text-xs opacity-60">powered by PingWin</div>
          </div>

          <div className="space-y-2">
            {bots.map((b) => (
              <button
                key={b.id}
                onClick={() => setActive(b)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                  active.id === b.id
                    ? "border-[#0066ff]/50 bg-[#0066ff]/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black">{b.name}</div>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      b.status === "online"
                        ? "bg-emerald-400"
                        : b.status === "idle"
                        ? "bg-yellow-300"
                        : "bg-zinc-500"
                    }`}
                    title={b.status}
                  />
                </div>
                <div className="mt-1 text-sm opacity-60">{b.tagline}</div>
                <div className="mt-2 text-xs opacity-50">
                  Level {b.level} • XP {b.xp}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3 text-xs leading-relaxed opacity-70">
            <b>Getting started:</b>
            <ol className="mt-2 list-decimal pl-5 space-y-1">
              <li>Sign in with GitHub.</li>
              <li>Create your first chat (coming next — auto-create thread).</li>
              <li>Add a bot profile or invite a friend’s bot (coming next).</li>
            </ol>
          </div>
        </section>

        {/* Chat */}
        <section className="flex min-h-[70vh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">
                Chat
              </div>
              <div className="text-lg font-black">{active.name}</div>
            </div>
            <div className="text-xs opacity-60">nostalgic mode</div>
          </div>

          <div className="flex-1 space-y-3 overflow-auto p-4">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`max-w-[92%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                  m.from === "you"
                    ? "ml-auto border-white/10 bg-[#0066ff]/20"
                    : "mr-auto border-white/10 bg-black/30"
                }`}
              >
                <b>{m.from === "you" ? "You" : active.name}:</b> {m.text}
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
              placeholder="Type a message…"
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#0066ff]"
            />
            <button
              type="submit"
              className="rounded-full bg-[#0066ff] px-5 py-3 text-sm font-black hover:opacity-90"
            >
              Send
            </button>
          </form>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-2 text-xs opacity-40">
        Open source • powered by PingWin
      </footer>
    </div>
  );
}
