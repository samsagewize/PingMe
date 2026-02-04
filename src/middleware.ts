import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

type AuthedRequest = NextRequest & { auth?: unknown };

export default auth((req: AuthedRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Allow auth routes and static assets.
  if (nextUrl.pathname.startsWith("/api/auth")) return;
  if (nextUrl.pathname.startsWith("/_next")) return;
  if (nextUrl.pathname.startsWith("/public")) return;
  if (nextUrl.pathname === "/favicon.ico") return;

  if (!isLoggedIn) {
    const signInUrl = new URL("/api/auth/signin", nextUrl);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
