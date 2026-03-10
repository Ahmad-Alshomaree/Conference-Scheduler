import { type NextRequest, NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

function validateAdmin(request: NextRequest) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@local"
  const cookie = request.cookies.get("admin")?.value
  if (!cookie || cookie.toLowerCase() !== adminEmail.toLowerCase()) {
    return false
  }
  return true
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const session = await DatabaseService.getSessionById(params.id)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
    return NextResponse.json(session)
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const session = await DatabaseService.updateSession(params.id, body)
    return NextResponse.json(session)
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await DatabaseService.deleteSession(params.id)
    return NextResponse.json({ message: "Session deleted successfully" })
  } catch (error) {
    console.error("Error deleting session:", error)
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 })
  }
}
