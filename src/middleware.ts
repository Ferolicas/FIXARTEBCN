import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "fixarte_session";

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !process.env.AUTH_SECRET) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authed = await hasValidSession(req);

  if (pathname === "/panel/login") {
    if (authed) return NextResponse.redirect(new URL("/panel", req.url));
    return NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL("/panel/login", req.url));
  }

  const res = NextResponse.next();
  // El panel jamás debe indexarse
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/panel/:path*", "/panel"],
};
