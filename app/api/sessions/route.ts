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
    const sessions = await DatabaseService.getAllSessions()
    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      priority,
      attendees,
    } = body

    // determine creator from admin cookie
    let actualCreatorId: string | undefined
    try {
      const adminEmail = request.cookies.get("admin")?.value
      if (adminEmail) {
        const user = await DatabaseService.getUserByEmail(adminEmail)
        if (user) {
          actualCreatorId = user.id
        }
      }
    } catch (e) {
      console.error("could not resolve creator from cookie", e)
    }

    // fallback to default user if none established (should not happen once admin exists)
    if (!actualCreatorId) {
      let user = await DatabaseService.getUserByEmail("default@local")
      if (!user) {
        user = await DatabaseService.createUser({
          email: "default@local",
          name: "Default User",
          role: "admin",
        })
      }
      actualCreatorId = user.id
    }

    // Parse attendee emails from the attendees string
    const attendeeEmails = attendees
      .split(",")
      .map((email: string) => email.trim())
      .filter((email: string) => email.includes("@"))

    const session = await DatabaseService.createSession({
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      priority: Number.parseInt(priority),
      creatorId: actualCreatorId,
      attendeeEmails,
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
