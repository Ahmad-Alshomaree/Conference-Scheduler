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

export async function GET(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const users = await DatabaseService.getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const user = await DatabaseService.createUser(body)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
