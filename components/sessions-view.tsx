"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Session } from "../types/session"

interface SessionsViewProps {
  sessions: Session[]
  onAddSession: () => void
}

export function SessionsView({ sessions, onAddSession }: SessionsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.attendees.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Sessions</h1>
          <p className="text-gray-600 mt-1">Manage all your conference sessions</p>
        </div>
        <Button onClick={onAddSession}>
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">{filteredSessions.length} sessions</Badge>
      </div>

      <div className="grid gap-4">
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{searchTerm ? "No sessions match your search" : "No sessions found"}</p>
                {!searchTerm && (
                  <Button onClick={onAddSession} className="mt-4">
                    Add Your First Session
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{session.title}</h3>
                      {session.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div>📅 {session.startDate}</div>
                      <div>
                        🕐 {session.startTime} - {session.endTime}
                      </div>
                      <div>👥 {session.attendees}</div>
                      {session.location && <div>📍 {session.location}</div>}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        className={
                          session.priority === 1
                            ? "bg-red-100 text-red-800"
                            : session.priority === 2
                              ? "bg-orange-100 text-orange-800"
                              : session.priority === 3
                                ? "bg-yellow-100 text-yellow-800"
                                : session.priority === 4
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                        }
                      >
                        Priority {session.priority}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
