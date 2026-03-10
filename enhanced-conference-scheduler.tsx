"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, RefreshCw, Play, Sparkles, FileText } from "lucide-react"
import type { Session, ScheduleResult } from "./types/session"
import { scheduleSessionsWithPriority } from "./utils/scheduler"
import { FileUpload } from "./components/file-upload"
import { EnhancedSessionForm } from "./components/enhanced-session-form"
import { EnhancedScheduleDisplay } from "./components/enhanced-schedule-display"

// Enhanced sample data with priorities and attendees
const sampleSessions: Omit<Session, "id">[] = [
  {
    title: "CEO Quarterly Review",
    startDate: "2024-01-15",
    startTime: "09:00",
    endDate: "2024-01-15",
    endTime: "10:30",
    attendees: "CEO, VPs, Directors",
    priority: 1,
  },
  {
    title: "Team Standup",
    startDate: "2024-01-15",
    startTime: "09:30",
    endDate: "2024-01-15",
    endTime: "10:00",
    attendees: "Development Team",
    priority: 3,
  },
  {
    title: "Client Presentation",
    startDate: "2024-01-15",
    startTime: "11:00",
    endDate: "2024-01-15",
    endTime: "12:00",
    attendees: "Sales Team, Client",
    priority: 1,
  },
  {
    title: "Lunch & Learn",
    startDate: "2024-01-15",
    startTime: "12:00",
    endDate: "2024-01-15",
    endTime: "13:00",
    attendees: "All Staff",
    priority: 4,
  },
  {
    title: "Project Planning",
    startDate: "2024-01-15",
    startTime: "11:30",
    endDate: "2024-01-15",
    endTime: "12:30",
    attendees: "Project Managers",
    priority: 2,
  },
  {
    title: "Code Review",
    startDate: "2024-01-15",
    startTime: "14:00",
    endDate: "2024-01-15",
    endTime: "15:00",
    attendees: "Senior Developers",
    priority: 3,
  },
  {
    title: "Optional Training",
    startDate: "2024-01-15",
    startTime: "14:30",
    endDate: "2024-01-15",
    endTime: "16:00",
    attendees: "Interested Staff",
    priority: 5,
  },
]

export default function EnhancedConferenceScheduler() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [scheduleResult, setScheduleResult] = useState<ScheduleResult | null>(null)
  const [nextId, setNextId] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Load sample data on component mount
  useEffect(() => {
    loadSampleData()
  }, [])

  const loadSampleData = () => {
    const sessionsWithIds = sampleSessions.map((session, index) => ({
      ...session,
      id: index + 1,
    }))
    setSessions(sessionsWithIds)
    setNextId(sessionsWithIds.length + 1)
    setScheduleResult(null)
  }

  const addSession = (sessionData: Omit<Session, "id">) => {
    const newSession: Session = {
      ...sessionData,
      id: nextId,
    }
    setSessions((prev) => [...prev, newSession])
    setNextId((prev) => prev + 1)
  }

  const handleSessionsLoaded = (loadedSessions: Session[]) => {
    setSessions(loadedSessions)
    setNextId(loadedSessions.length + 1)
    setScheduleResult(null)
  }

  const runScheduler = async () => {
    setIsLoading(true)
    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const result = scheduleSessionsWithPriority(sessions)
    setScheduleResult(result)
    setIsLoading(false)
  }

  const clearAll = () => {
    setSessions([])
    setScheduleResult(null)
    setNextId(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader className="pb-8">
            <CardTitle className="flex items-center gap-3 text-3xl font-bold">
              <Calendar className="h-8 w-8" />
              Smart Conference Scheduler
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </CardTitle>
            <p className="text-blue-100 text-lg mt-2">
              AI-powered scheduling with priority optimization and conflict resolution
            </p>

            <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-200 mt-0.5" />
                <div className="text-sm text-blue-100">
                  <p className="font-medium mb-2">🚀 Enhanced Algorithm Features:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p>• Priority-based scheduling (Critical → Optional)</p>
                    <p>• Intelligent gap filling with lower priority items</p>
                    <p>• Multi-day support with date/time handling</p>
                    <p>• CSV/Excel file import capabilities</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Methods */}
          <div className="space-y-6">
            <FileUpload onSessionsLoaded={handleSessionsLoaded} />

            <EnhancedSessionForm onAddSession={addSession} />

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={runScheduler}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={sessions.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Smart Scheduler
                    </>
                  )}
                </Button>
                <Button onClick={loadSampleData} variant="outline" className="w-full">
                  Load Sample Data
                </Button>
                <Button onClick={clearAll} variant="destructive" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </CardContent>
            </Card>

            {/* Session Summary */}
            {sessions.length > 0 && (
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Session Summary ({sessions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="p-2 bg-white/60 rounded text-sm">
                        <div className="font-medium">{session.title}</div>
                        <div className="text-amber-700 text-xs">
                          Priority {session.priority} • {session.attendees}
                        </div>
                      </div>
                    ))}
                    {sessions.length > 5 && (
                      <div className="text-center text-amber-600 text-sm">+{sessions.length - 5} more sessions...</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {scheduleResult ? (
              <EnhancedScheduleDisplay result={scheduleResult} />
            ) : (
              <Card className="h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-xl font-medium mb-2">Ready to Optimize</h3>
                    <p className="text-gray-400">
                      Import sessions from a file or add them manually, then click "Run Smart Scheduler"
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
