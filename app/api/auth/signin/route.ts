import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const adminEmail = process.env.ADMIN_EMAIL || "admin@local"

    if (email && email.toLowerCase() === adminEmail.toLowerCase()) {
      const res = NextResponse.json({ ok: true })
      // set a simple cookie indicating admin
      res.cookies.set("admin", adminEmail, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
      return res
    }
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 })
  } catch (error) {
    console.error("signin error", error)
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 })
  }
}
