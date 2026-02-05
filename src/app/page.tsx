"use client";

import { useMemo, useState } from "react";

type Cluster = "devnet" | "mainnet";

function shorten(addr: string) {
  return addr.length > 12 ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : addr;
}

export default function Landing() {
  const [cluster, setCluster] = useState<Cluster>("devnet");

  // MVP stub: we'll implement real Wallet Standard connect next.
  // For now this lets you ship the LaunchPad UI to Vercel without breaking.
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    // Later: make configurable via env + provide custom RPC.
    return cluster === "devnet"
      ? "https://api.devnet.solana.com"
      : "https://api.mainnet-beta.solana.com";
  }, [cluster]);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)]">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">PingMe</div>
            <div className="text-2xl font-black tracking-tight">Solana LaunchPad</div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={cluster}
              onChange={(e) => setCluster(e.target.value as Cluster)}
              className="rounded-full border border-black/10 bg-[var(--pm-panel)] px-4 py-2 text-sm font-black"
              aria-label="Cluster"
            >
              <option value="devnet">devnet</option>
              <option value="mainnet">mainnet</option>
            </select>

            {connectedAddress ? (
              <button
                onClick={() => setConnectedAddress(null)}
                className="rounded-full border border-black/10 bg-[var(--pm-panel)] px-5 py-3 text-sm font-black hover:opacity-90"
              >
                {shorten(connectedAddress)} (disconnect)
              </button>
            ) : (
              <button
                onClick={() => {
                  // TEMP: placeholder "connect" for MVP UI.
                  // Next step: real wallet connect (Wallet Standard) + signing.
                  setConnectedAddress("So1aNa1111111111111111111111111111111111111");
                }}
                className="rounded-full pm-red px-5 py-3 text-sm font-black text-white hover:opacity-90"
              >
                Connect wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          <div>
            <div className="inline-block rounded-full border border-black/10 bg-[var(--pm-panel)] px-4 py-2 text-[10px] font-black tracking-[0.35em] uppercase pm-muted">
              launchpad • wallet connect • powered by PingWin
            </div>

            <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
              PingMe
              <br />
              LaunchPad
            </h1>

            <p className="mt-5 max-w-xl text-lg opacity-60">
              Create launches. Connect wallets. Buy tokens. Simple, fast, and clean.
            </p>

            <div className="mt-6 rounded-3xl border border-black/10 bg-[var(--pm-panel)] p-5">
              <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">Cluster</div>
              <div className="mt-2 text-sm pm-muted">RPC: {endpoint}</div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-black/10 bg-[var(--pm-panel)] p-5">
                <div className="text-xs font-black tracking-[0.35em] uppercase pm-muted">1</div>
                <div className="mt-2 font-black">Connect</div>
                <div className="mt-2 text-sm pm-muted">Wallet Standard first.</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-[var(--pm-panel)] p-5">
                <div className="text-xs font-black tracking-[0.35em] uppercase pm-muted">2</div>
                <div className="mt-2 font-black">Launch</div>
                <div className="mt-2 text-sm pm-muted">Create a token + sale config.</div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-[var(--pm-panel)] p-5">
                <div className="text-xs font-black tracking-[0.35em] uppercase pm-muted">3</div>
                <div className="mt-2 font-black">Buy</div>
                <div className="mt-2 text-sm pm-muted">Sign tx. Confirm. Done.</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://github.com/samsagewize/PingMe"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/10 bg-[var(--pm-panel)] px-6 py-4 text-sm font-black hover:opacity-90"
              >
                GitHub
              </a>
              <button
                onClick={() => alert("Next: add real wallet connect + token create on devnet.")}
                className="rounded-full border border-black/10 bg-[var(--pm-panel)] px-6 py-4 text-sm font-black hover:opacity-90"
              >
                Roadmap
              </button>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-black/10 bg-[var(--pm-panel)] p-6">
            <div className="mb-4 text-xs font-black tracking-[0.35em] uppercase opacity-70">MVP Status</div>
            <div className="rounded-3xl border border-black/10 bg-white/70 p-5">
              <div className="flex items-center justify-between">
                <div className="font-black">LaunchPad UI</div>
                <div className="text-xs opacity-60">building</div>
              </div>
              <div className="mt-4 space-y-2 text-sm pm-muted">
                <div>• UI shell shipped</div>
                <div>• Cluster toggle shipped</div>
                <div>• Wallet connect: placeholder (next)</div>
                <div>• Token create + launch config: next</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-xs opacity-40">
        PingMe Solana LaunchPad • powered by PingWin
      </footer>
    </div>
  );
}
