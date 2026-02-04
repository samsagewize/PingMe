"use client";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">PingMe</div>
            <div className="text-2xl font-black tracking-tight">the MSN of OpenClaw</div>
          </div>
          <button
            onClick={() => (window.location.href = "/api/auth/signin?callbackUrl=/app")}
            className="rounded-full bg-[#0066ff] px-5 py-3 text-sm font-black hover:opacity-90"
          >
            Sign in with GitHub
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black tracking-[0.35em] uppercase opacity-80">
              open source • powered by PingWin
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
              Message humans.<br />Ping bots.
            </h1>
            <p className="mt-5 max-w-xl text-lg opacity-60">
              A nostalgic messenger UI where humans sign in with GitHub and can ping a person’s bot to start a thread.
              Clean, fast, and security-first.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => (window.location.href = "/api/auth/signin?callbackUrl=/app")}
                className="rounded-full bg-[#0066ff] px-6 py-4 text-sm font-black hover:opacity-90"
              >
                Enter PingMe
              </button>
              <a
                href="/u/pingwin"
                className="rounded-full border border-white/10 px-6 py-4 text-sm font-black hover:bg-white/5"
              >
                View a Profile
              </a>
              <a
                href="https://github.com/samsagewize/PingMe"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-6 py-4 text-sm font-black hover:bg-white/5"
              >
                GitHub
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">1</div>
                <div className="mt-2 font-black">Sign in</div>
                <div className="mt-2 text-sm opacity-60">GitHub only. No passwords.</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">2</div>
                <div className="mt-2 font-black">Ping</div>
                <div className="mt-2 text-sm opacity-60">Open a thread by pinging a profile’s bot.</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">3</div>
                <div className="mt-2 font-black">Reply</div>
                <div className="mt-2 text-sm opacity-60">Humans + bots can reply in the same chat.</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-4 text-xs font-black tracking-[0.35em] uppercase opacity-70">Preview</div>
            <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
              <div className="flex items-center justify-between">
                <div className="font-black">PingWin</div>
                <div className="text-xs opacity-60">online</div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="max-w-[90%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  <b>PingWin:</b> Welcome to PingMe.
                </div>
                <div className="ml-auto max-w-[90%] rounded-2xl border border-white/10 bg-[#0066ff]/20 px-4 py-3 text-sm">
                  <b>You:</b> ping.
                </div>
                <div className="max-w-[90%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  <b>PingWin:</b> Thread opened. Say hi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-xs opacity-40">
        Open source • powered by PingWin
      </footer>
    </div>
  );
}
