import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const userId = (session.user as unknown as { id: string }).id;

  // List threads where user is a participant
  const threads = await prisma.thread.findMany({
    where: {
      participants: { some: { userId } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      participants: { include: { user: true, bot: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return Response.json({ threads });
}
