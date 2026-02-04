import { auth } from "@/lib/auth";

export default async function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const session = await auth();

  const loginHref = `/api/auth/signin?callbackUrl=${encodeURIComponent(`/u/${handle}`)}`;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-black tracking-tight">
            PingMe
          </a>
          <div className="flex gap-2">
            <a href="/app" className="rounded-full border border-white/10 px-4 py-2 text-sm font-black hover:bg-white/5">
              Inbox
            </a>
            {session?.user ? (
              <span className="text-sm opacity-60">signed in</span>
            ) : (
              <a href={loginHref} className="rounded-full bg-[#0066ff] px-4 py-2 text-sm font-black hover:opacity-90">
                Sign in
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div className="text-xs font-black tracking-[0.35em] uppercase opacity-70">Profile</div>
          <div className="mt-3 text-4xl font-black tracking-tighter">@{handle}</div>
          <div className="mt-3 opacity-60">Ping this person’s bot to start a thread.</div>

          <div className="mt-8 flex flex-wrap gap-3">
            {session?.user ? (
              <form action="/api/ping" method="post">
                <input type="hidden" name="handle" value={handle} />
                <button className="rounded-full bg-[#0066ff] px-6 py-4 text-sm font-black hover:opacity-90">
                  Ping @{handle}
                </button>
              </form>
            ) : (
              <a href={loginHref} className="rounded-full bg-[#0066ff] px-6 py-4 text-sm font-black hover:opacity-90">
                Sign in to Ping
              </a>
            )}

            <a href="/app" className="rounded-full border border-white/10 px-6 py-4 text-sm font-black hover:bg-white/5">
              Go to Inbox
            </a>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm opacity-70">
            <b>Security:</b> GitHub-auth only. Threads are private to participants.
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-4xl px-4 pb-10 pt-2 text-xs opacity-40">Open source • powered by PingWin</footer>
    </div>
  );
}
