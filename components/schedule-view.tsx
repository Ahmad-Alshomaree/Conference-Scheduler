"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Plus } from "lucide-react"
import type { Session } from "../types/session"

interface ScheduleViewProps {
  sessions: Session[]
  onAddSession: () => void
}

export function ScheduleView({ sessions, onAddSession }: ScheduleViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">View and manage your conference timeline</p>
        </div>
        <Button onClick={onAddSession}>
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </div>

      <div className="grid gap-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sessions scheduled yet</p>
                <Button onClick={onAddSession} className="mt-4">
                  Add Your First Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          sessions
            .sort((a, b) => {
              const dateA = new Date(`${a.startDate} ${a.startTime}`)
              const dateB = new Date(`${b.startDate} ${b.startTime}`)
              return dateA.getTime() - dateB.getTime()
            })
            .map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{session.title}</h3>
                      {session.description && <p className="text-gray-600 mb-3">{session.description}</p>}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {session.startTime} - {session.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{session.attendees}</span>
                        </div>
                        {session.location && (
                          <div className="flex items-center gap-1">
                            <span>📍 {session.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{session.startDate}</div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          session.priority === 1
                            ? "bg-red-100 text-red-800"
                            : session.priority === 2
                              ? "bg-orange-100 text-orange-800"
                              : session.priority === 3
                                ? "bg-yellow-100 text-yellow-800"
                                : session.priority === 4
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        Priority {session.priority}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
