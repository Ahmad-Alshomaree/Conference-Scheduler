export interface Session {
  id: string
  title: string
  description?: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  location?: string
  priority: number
  status: string
  createdAt: Date
  updatedAt: Date
  creatorId: string
  creator?: User
  attendances?: SessionAttendance[]
  conflicts?: SessionConflict[]
  selected?: boolean
  conflictReason?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  isOnline: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SessionAttendance {
  id: string
  sessionId: string
  userId: string
  status: string
  createdAt: Date
  updatedAt: Date
  session?: Session
  user?: User
}

export interface SessionConflict {
  id: string
  sessionId: string
  conflictingWith: string
  reason: string
  resolved: boolean
  createdAt: Date
}

export interface ScheduleResult {
  selectedSessions: Session[]
  rejectedSessions: Session[]
  totalSelected: number
  priorityBreakdown: {
    priority: number
    selected: number
    total: number
  }[]
}

export interface DatabaseAnalytics {
  sessions: {
    totalSessions: number
    completedSessions: number
    cancelledSessions: number
    upcomingSessions: number
    priorityBreakdown: Array<{
      priority: number
      _count: { priority: number }
    }>
  }
  users: {
    totalUsers: number
    onlineUsers: number
    roleBreakdown: Array<{
      role: string
      _count: { role: number }
    }>
  }
  scheduleHistory: Array<{
    id: string
    totalSessions: number
    selectedSessions: number
    rejectedSessions: number
    algorithm: string
    executionTime: number
    createdAt: Date
  }>
}
