"use client"

import { useState, useEffect } from "react"
import type { Session, ScheduleResult } from "./types/session"
import { scheduleSessionsWithPriority } from "./utils/scheduler"
import { Sidebar } from "./components/sidebar"
import { DashboardContent } from "./components/dashboard-content"
import { RightSidebar } from "./components/right-sidebar"
import { AddSessionModal } from "./components/add-session-modal"
import { ScheduleView } from "./components/schedule-view"
import { SessionsView } from "./components/sessions-view"
import { useDatabase } from "./hooks/use-database"
import { initializeDatabase } from "./lib/init-database"

export default function ModernConferenceDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [scheduleResult, setScheduleResult] = useState<ScheduleResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const {
    sessions,
    users,
    analytics,
    loading: dbLoading,
    error: dbError,
    createSession,
    fetchSessions,
    fetchAnalytics,
  } = useDatabase()

  // Initialize database on mount
  useEffect(() => {
    initializeDatabase()
  }, [])

  const runScheduler = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Convert database sessions to the format expected by the scheduler
    const schedulerSessions = sessions.map((session) => ({
      ...session,
      attendees: session.attendances?.map((a) => a.user?.name || a.user?.email).join(", ") || "",
    }))

    const result = scheduleSessionsWithPriority(schedulerSessions)
    setScheduleResult(result)
    setIsLoading(false)

    // Save schedule result to database
    try {
      await fetch("/api/schedule-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalSessions: sessions.length,
          selectedSessions: result.totalSelected,
          rejectedSessions: result.rejectedSessions.length,
          algorithm: "priority-greedy",
          executionTime: 1500,
        }),
      })
      fetchAnalytics() // Refresh analytics
    } catch (error) {
      console.error("Failed to save schedule result:", error)
    }
  }

  const handleAddSession = async (
    sessionData: Omit<Session, "id" | "createdAt" | "updatedAt" | "creatorId" | "status">,
  ) => {
    try {
      await createSession({
        ...sessionData,
        attendees: sessionData.attendees || "", // Convert attendees format
      })
    } catch (error) {
      console.error("Failed to create session:", error)
    }
  }

  // Convert database users to the format expected by components
  const onlineUsers = users.map((user) => ({
    id: Number.parseInt(user.id),
    name: user.name,
    role: user.role,
    avatar: user.avatar || "",
    isOnline: user.isOnline,
  }))

  // Convert database sessions to the format expected by components
  const formattedSessions = sessions.map((session) => ({
    ...session,
    id: Number.parseInt(session.id),
    attendees: session.attendances?.map((a) => a.user?.name || a.user?.email).join(", ") || "",
  }))

  if (dbError) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
          <p className="text-red-500">{dbError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex">
      {/* Left Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 p-6 overflow-auto">
          {dbLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">Loading from database...</span>
            </div>
          )}

          {!dbLoading && (
            <>
              {activeSection === "dashboard" && (
                <DashboardContent
                  sessions={formattedSessions}
                  onRunScheduler={runScheduler}
                  isLoading={isLoading}
                  onAddSession={() => setIsAddModalOpen(true)}
                />
              )}
              {activeSection === "schedule" && (
                <ScheduleView sessions={formattedSessions} onAddSession={() => setIsAddModalOpen(true)} />
              )}
              {activeSection === "sessions" && (
                <SessionsView sessions={formattedSessions} onAddSession={() => setIsAddModalOpen(true)} />
              )}
              {activeSection === "attendees" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Attendees Management</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                      <div key={user.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.role}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeSection === "messages" && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
                  <p className="text-gray-600">Messaging system coming soon...</p>
                </div>
              )}
              {activeSection === "reports" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                  {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-medium text-gray-900">Total Sessions</h3>
                        <p className="text-2xl font-bold text-indigo-600">{analytics.sessions.totalSessions}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-medium text-gray-900">Total Users</h3>
                        <p className="text-2xl font-bold text-green-600">{analytics.users.totalUsers}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-medium text-gray-900">Online Users</h3>
                        <p className="text-2xl font-bold text-blue-600">{analytics.users.onlineUsers}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-medium text-gray-900">Completed Sessions</h3>
                        <p className="text-2xl font-bold text-purple-600">{analytics.sessions.completedSessions}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeSection === "settings" && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                  <p className="text-gray-600">Application settings coming soon...</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar onlineUsers={onlineUsers} />
      </div>

      {/* Add Session Modal */}
      <AddSessionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSession={handleAddSession}
      />
    </div>
  )
}
