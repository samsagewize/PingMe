import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const threadId = url.searchParams.get("threadId");
  if (!threadId) return Response.json({ error: "missing threadId" }, { status: 400 });

  const msgs = await prisma.message.findMany({
    where: { threadId },
    orderBy: { createdAt: "asc" },
    take: 200,
    include: { user: true, bot: true },
  });

  return Response.json({ messages: msgs });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const userId = (session.user as unknown as { id: string }).id;
  const body = await req.json().catch(() => ({}));

  const threadId = String(body.threadId || "");
  const text = String(body.text || "").trim();
  if (!threadId || !text) return Response.json({ error: "missing threadId/text" }, { status: 400 });

  // Ensure user is participant
  const ok = await prisma.threadParticipant.findFirst({ where: { threadId, userId } });
  if (!ok) return Response.json({ error: "forbidden" }, { status: 403 });

  const msg = await prisma.message.create({
    data: { threadId, userId, text },
    include: { user: true },
  });

  await prisma.thread.update({ where: { id: threadId }, data: { updatedAt: new Date() } });

  return Response.json({ message: msg });
}
