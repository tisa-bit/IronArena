import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const res = NextResponse.next();
  res.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  res.headers.set("Surrogate-Control", "no-store");
  if (token && (pathname === "/" || pathname.startsWith("/auth"))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*"],
};
