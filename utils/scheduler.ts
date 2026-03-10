import type { Session, ScheduleResult } from "../types/session"

export function scheduleSessionsGreedy(sessions: Session[]): ScheduleResult {
  // Sort sessions by end time
  const sortedSessions = sessions.sort((a, b) => {
    const endTimeA = new Date(`2024-01-01 ${a.endTime}`).getTime()
    const endTimeB = new Date(`2024-01-01 ${b.endTime}`).getTime()
    return endTimeA - endTimeB
  })

  const selectedSessions: Session[] = []
  const rejectedSessions: Session[] = []
  let lastEndTime = 0

  for (const session of sortedSessions) {
    const startTime = new Date(`2024-01-01 ${session.startTime}`).getTime()
    const endTime = new Date(`2024-01-01 ${session.endTime}`).getTime()

    if (startTime >= lastEndTime) {
      selectedSessions.push({ ...session, selected: true })
      lastEndTime = endTime
    } else {
      rejectedSessions.push({ ...session, selected: false })
    }
  }

  return {
    selectedSessions,
    rejectedSessions,
    totalSelected: selectedSessions.length,
    priorityBreakdown: [], // This is a simplified version, the actual implementation might need to calculate priority breakdown
  }
}

export function scheduleSessionsWithPriority(sessions: Session[]): ScheduleResult {
  // Step 1: Group sessions by priority (1 = highest, 5 = lowest)
  const sessionsByPriority = sessions.reduce(
    (acc, session) => {
      if (!acc[session.priority]) {
        acc[session.priority] = []
      }
      acc[session.priority].push(session)
      return acc
    },
    {} as Record<number, Session[]>,
  )

  const selectedSessions: Session[] = []
  const rejectedSessions: Session[] = []

  // Step 2: Process each priority level from highest (1) to lowest (5)
  for (let priority = 1; priority <= 5; priority++) {
    const prioritySessions = sessionsByPriority[priority] || []

    // Sort sessions within this priority by end time (greedy approach)
    const sortedPrioritySessions = prioritySessions.sort((a, b) => {
      const endTimeA = new Date(`${a.endDate} ${a.endTime}`).getTime()
      const endTimeB = new Date(`${b.endDate} ${b.endTime}`).getTime()
      return endTimeA - endTimeB
    })

    // Apply greedy algorithm for this priority level
    for (const session of sortedPrioritySessions) {
      const sessionStart = new Date(`${session.startDate} ${session.startTime}`).getTime()
      const sessionEnd = new Date(`${session.endDate} ${session.endTime}`).getTime()

      // Check if this session conflicts with any already selected session
      const hasConflict = selectedSessions.some((selected) => {
        const selectedStart = new Date(`${selected.startDate} ${selected.startTime}`).getTime()
        const selectedEnd = new Date(`${selected.endDate} ${selected.endTime}`).getTime()

        // Check for overlap: sessions overlap if one starts before the other ends
        return sessionStart < selectedEnd && sessionEnd > selectedStart
      })

      if (!hasConflict) {
        selectedSessions.push({ ...session, selected: true })
      } else {
        // Find which session it conflicts with for better error messaging
        const conflictingSession = selectedSessions.find((selected) => {
          const selectedStart = new Date(`${selected.startDate} ${selected.startTime}`).getTime()
          const selectedEnd = new Date(`${selected.endDate} ${selected.endTime}`).getTime()
          return sessionStart < selectedEnd && sessionEnd > selectedStart
        })

        rejectedSessions.push({
          ...session,
          selected: false,
          conflictReason: `Conflicts with "${conflictingSession?.title}" (Priority ${conflictingSession?.priority})`,
        })
      }
    }
  }

  // Calculate priority breakdown
  const priorityBreakdown = []
  for (let priority = 1; priority <= 5; priority++) {
    const totalForPriority = sessions.filter((s) => s.priority === priority).length
    const selectedForPriority = selectedSessions.filter((s) => s.priority === priority).length

    if (totalForPriority > 0) {
      priorityBreakdown.push({
        priority,
        selected: selectedForPriority,
        total: totalForPriority,
      })
    }
  }

  return {
    selectedSessions,
    rejectedSessions,
    totalSelected: selectedSessions.length,
    priorityBreakdown,
  }
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":")
  let period = "AM"
  let hour = Number.parseInt(hours)

  if (hour >= 12) {
    period = "PM"
    if (hour > 12) {
      hour -= 12
    }
  } else if (hour === 0) {
    hour = 12 // Midnight
  }

  return `${hour}:${minutes} ${period}`
}

export function formatDateTime(date: string, time: string): string {
  const dateObj = new Date(`${date} ${time}`)
  return dateObj.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function getPriorityColor(priority: number): string {
  const colors = {
    1: "bg-red-100 text-red-800 border-red-200",
    2: "bg-orange-100 text-orange-800 border-orange-200",
    3: "bg-yellow-100 text-yellow-800 border-yellow-200",
    4: "bg-blue-100 text-blue-800 border-blue-200",
    5: "bg-gray-100 text-gray-800 border-gray-200",
  }
  return colors[priority as keyof typeof colors] || colors[3]
}

export function getPriorityLabel(priority: number): string {
  const labels = {
    1: "Critical",
    2: "High",
    3: "Medium",
    4: "Low",
    5: "Optional",
  }
  return labels[priority as keyof typeof labels] || "Medium"
}
