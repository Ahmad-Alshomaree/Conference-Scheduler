import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/database"

function validateAdmin(request: any) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@local"
  const cookie = request.cookies?.get("admin")?.value
  if (!cookie || cookie.toLowerCase() !== adminEmail.toLowerCase()) {
    return false
  }
  return true
}

export async function GET(request: any) {
  if (!validateAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const [sessionAnalytics, userAnalytics, scheduleHistory] = await Promise.all([
      DatabaseService.getSessionAnalytics(),
      DatabaseService.getUserAnalytics(),
      DatabaseService.getScheduleHistory(),
    ])

    return NextResponse.json({
      sessions: sessionAnalytics,
      users: userAnalytics,
      scheduleHistory,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
