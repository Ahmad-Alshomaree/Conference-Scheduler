import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Database utility functions
export class DatabaseService {
  // User operations
  static async createUser(data: {
    email: string
    name: string
    role: string
    avatar?: string
  }) {
    return await prisma.user.create({
      data: {
        ...data,
        isOnline: true,
      },
    })
  }

  static async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        createdSessions: true,
        attendances: {
          include: {
            session: true,
          },
        },
      },
    })
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        createdSessions: true,
        attendances: {
          include: {
            session: true,
          },
        },
      },
    })
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { name: "asc" },
    })
  }

  static async updateUserOnlineStatus(id: string, isOnline: boolean) {
    return await prisma.user.update({
      where: { id },
      data: { isOnline },
    })
  }

  // Session operations
  static async createSession(data: {
    title: string
    description?: string
    startDate: string
    startTime: string
    endDate: string
    endTime: string
    location?: string
    priority: number
    creatorId: string
    attendeeEmails: string[]
  }) {
    const { attendeeEmails, ...sessionData } = data

    // Create session
    const session = await prisma.session.create({
      data: sessionData,
    })

    // Add attendees (ensure a user exists for each email)
    if (attendeeEmails.length > 0) {
      const users: { id: string; email: string }[] = []

      for (const email of attendeeEmails) {
        // try to find existing user
        let user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          // create a placeholder user with role "attendee"
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
              role: "attendee",
            },
          })
        }
        users.push(user)
      }

      const attendances = users.map((user) => ({
        sessionId: session.id,
        userId: user.id,
        status: "invited",
      }))

      await prisma.sessionAttendance.createMany({
        data: attendances,
      })
    }

    return session
  }

  static async getAllSessions() {
    return await prisma.session.findMany({
      include: {
        creator: true,
        attendances: {
          include: {
            user: true,
          },
        },
        conflicts: true,
      },
      orderBy: [{ startDate: "asc" }, { startTime: "asc" }],
    })
  }

  static async getSessionById(id: string) {
    return await prisma.session.findUnique({
      where: { id },
      include: {
        creator: true,
        attendances: {
          include: {
            user: true,
          },
        },
        conflicts: true,
      },
    })
  }

  static async updateSession(
    id: string,
    data: Partial<{
      title: string
      description: string
      startDate: string
      startTime: string
      endDate: string
      endTime: string
      location: string
      priority: number
      status: string
    }>,
  ) {
    return await prisma.session.update({
      where: { id },
      data,
    })
  }

  static async deleteSession(id: string) {
    return await prisma.session.delete({
      where: { id },
    })
  }

  // Session conflict operations
  static async createSessionConflict(data: {
    sessionId: string
    conflictingWith: string
    reason: string
  }) {
    return await prisma.sessionConflict.create({
      data,
    })
  }

  static async getSessionConflicts(sessionId: string) {
    return await prisma.sessionConflict.findMany({
      where: { sessionId },
    })
  }

  static async resolveConflict(conflictId: string) {
    return await prisma.sessionConflict.update({
      where: { id: conflictId },
      data: { resolved: true },
    })
  }

  // Schedule result operations
  static async saveScheduleResult(data: {
    totalSessions: number
    selectedSessions: number
    rejectedSessions: number
    algorithm: string
    executionTime: number
  }) {
    return await prisma.scheduleResult.create({
      data,
    })
  }

  static async getScheduleHistory() {
    return await prisma.scheduleResult.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    })
  }

  // Message operations
  static async createMessage(data: {
    content: string
    senderId: string
    receiverId?: string
    type?: string
  }) {
    return await prisma.message.create({
      data,
    })
  }

  static async getUserMessages(userId: string) {
    return await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: true,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  static async markMessageAsRead(messageId: string) {
    return await prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    })
  }

  // Analytics and reporting
  static async getSessionAnalytics() {
    const totalSessions = await prisma.session.count()
    const completedSessions = await prisma.session.count({
      where: { status: "completed" },
    })
    const cancelledSessions = await prisma.session.count({
      where: { status: "cancelled" },
    })
    const upcomingSessions = await prisma.session.count({
      where: { status: "scheduled" },
    })

    const priorityBreakdown = await prisma.session.groupBy({
      by: ["priority"],
      _count: {
        priority: true,
      },
    })

    return {
      totalSessions,
      completedSessions,
      cancelledSessions,
      upcomingSessions,
      priorityBreakdown,
    }
  }

  static async getUserAnalytics() {
    const totalUsers = await prisma.user.count()
    const onlineUsers = await prisma.user.count({
      where: { isOnline: true },
    })

    const roleBreakdown = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    })

    return {
      totalUsers,
      onlineUsers,
      roleBreakdown,
    }
  }
}
