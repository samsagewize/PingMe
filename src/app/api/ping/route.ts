import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("unauthorized", { status: 401 });
  }

  const userId = (session.user as unknown as { id: string }).id;

  const ct = req.headers.get("content-type") || "";
  let handle = "";
  if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
    const form = await req.formData();
    handle = String(form.get("handle") || "").trim();
  } else {
    const body = (await req.json().catch(() => ({}))) as unknown;
    const h = (body as { handle?: unknown })?.handle;
    handle = String(h || "").trim();
  }

  if (!handle) return new Response("missing handle", { status: 400 });

  const target = await prisma.user.findFirst({
    where: { githubLogin: { equals: handle, mode: "insensitive" } },
  });

  if (!target) {
    // no such user yet
    redirect(`/u/${encodeURIComponent(handle)}?notfound=1`);
  }

  if (target.id === userId) {
    redirect("/app");
  }

  // Find existing thread between the two users
  const existing = await prisma.thread.findFirst({
    where: {
      participants: {
        every: { OR: [{ userId }, { userId: target.id }] },
      },
    },
  });

  const thread =
    existing ||
    (await prisma.thread.create({
      data: {
        participants: {
          create: [{ userId }, { userId: target.id }],
        },
        messages: {
          create: {
            userId,
            text: `Ping @${target.githubLogin || handle}`,
          },
        },
      },
    }));

  await prisma.thread.update({ where: { id: thread.id }, data: { updatedAt: new Date() } });

  redirect(`/app?thread=${thread.id}`);
}
