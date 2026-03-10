import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // allow next internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next()
  }

  // always allow signin and auth API
  if (
    pathname.startsWith("/signin") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@local"
  const cookie = req.cookies.get("admin")?.value
  if (!cookie || cookie.toLowerCase() !== adminEmail.toLowerCase()) {
    const url = req.nextUrl.clone()
    url.pathname = "/signin"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
