"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, RefreshCw, Info } from "lucide-react"
import type { Session, ScheduleResult } from "./types/session"
import { scheduleSessionsGreedy } from "./utils/scheduler"
import { SessionForm } from "./components/session-form"
import { ScheduleDisplay } from "./components/schedule-display"

// Sample data
const sampleSessions: Omit<Session, "id">[] = [
  { title: "Opening Keynote", startTime: "09:00", endTime: "10:00" },
  { title: "AI Workshop", startTime: "09:30", endTime: "11:00" },
  { title: "Data Science Panel", startTime: "10:30", endTime: "12:00" },
  { title: "Lunch Break", startTime: "12:00", endTime: "13:00" },
  { title: "Cloud Computing Talk", startTime: "11:30", endTime: "12:30" },
  { title: "Networking Session", startTime: "13:00", endTime: "14:00" },
  { title: "Security Workshop", startTime: "13:30", endTime: "15:00" },
  { title: "Closing Remarks", startTime: "15:00", endTime: "16:00" },
]

export default function ConferenceScheduler() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [scheduleResult, setScheduleResult] = useState<ScheduleResult | null>(null)
  const [nextId, setNextId] = useState(1)

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
  }

  const addSession = (sessionData: Omit<Session, "id">) => {
    const newSession: Session = {
      ...sessionData,
      id: nextId,
    }
    setSessions((prev) => [...prev, newSession])
    setNextId((prev) => prev + 1)
  }

  const runScheduler = () => {
    const result = scheduleSessionsGreedy(sessions)
    setScheduleResult(result)
  }

  const clearAll = () => {
    setSessions([])
    setScheduleResult(null)
    setNextId(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="h-6 w-6" />
              Conference Session Scheduler
            </CardTitle>
            <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Greedy Algorithm Strategy:</p>
                <p>1. Sort all sessions by their end times</p>
                <p>2. Select the session with the earliest end time</p>
                <p>
                  3. For each remaining session, select it only if it doesn't overlap with previously selected sessions
                </p>
                <p className="mt-2 font-medium">
                  This approach guarantees the maximum number of non-overlapping sessions.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Session Management */}
          <div className="space-y-4">
            <SessionForm onAddSession={addSession} />

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={runScheduler} className="w-full" disabled={sessions.length === 0}>
                  Run Scheduler
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

            {/* Session List */}
            {sessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>All Sessions ({sessions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <div key={session.id} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="font-medium">{session.title}</div>
                        <div className="text-muted-foreground">
                          {session.startTime} - {session.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {scheduleResult ? (
              <ScheduleDisplay result={scheduleResult} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Add sessions and click "Run Scheduler" to see the optimized schedule</p>
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
