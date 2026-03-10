"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, TrendingUp, Play, MoreHorizontal } from "lucide-react"
import type { Session } from "../types/session"

interface DashboardContentProps {
  sessions: Session[]
  onRunScheduler: () => void
  isLoading: boolean
  onAddSession: () => void
}

export function DashboardContent({ sessions, onRunScheduler, isLoading, onAddSession }: DashboardContentProps) {
  const upcomingSessions = sessions.slice(0, 3)

  const stats = [
    {
      title: "Total Sessions",
      value: sessions.length,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "High Priority",
      value: sessions.filter((s) => s.priority <= 2).length,
      icon: TrendingUp,
      color: "from-red-500 to-red-600",
    },
    {
      title: "Attendees",
      value: sessions.reduce((acc, s) => acc + s.attendees.split(",").length, 0),
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Duration (hrs)",
      value: sessions
        .reduce((acc, s) => {
          const start = new Date(`${s.startDate} ${s.startTime}`)
          const end = new Date(`${s.endDate} ${s.endTime}`)
          return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        }, 0)
        .toFixed(1),
      icon: Clock,
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-1">Manage and optimize your conference schedule</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={onRunScheduler} disabled={sessions.length === 0 || isLoading} size="sm">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Scheduler
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {upcomingSessions.map((session, index) => {
          const priorityColors = {
            1: "from-red-400 to-red-500",
            2: "from-orange-400 to-orange-500",
            3: "from-yellow-400 to-yellow-500",
            4: "from-blue-400 to-blue-500",
            5: "from-gray-400 to-gray-500",
          }

          const iconColors = {
            1: "from-red-100 to-red-200",
            2: "from-orange-100 to-orange-200",
            3: "from-yellow-100 to-yellow-200",
            4: "from-blue-100 to-blue-200",
            5: "from-gray-100 to-gray-200",
          }

          return (
            <Card key={session.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${
                      iconColors[session.priority as keyof typeof iconColors]
                    }`}
                  >
                    <Calendar className="h-6 w-6 text-gray-700" />
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{session.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {session.description || "Conference session with key stakeholders"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="h-3 w-3" />
                    <span className="line-clamp-1">{session.attendees}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge
                      variant="secondary"
                      className={`bg-gradient-to-r ${
                        priorityColors[session.priority as keyof typeof priorityColors]
                      } text-white border-0`}
                    >
                      Priority {session.priority}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                      View Details →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Add Session Card */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors cursor-pointer group">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[280px]">
            <div className="p-4 rounded-full bg-gray-100 group-hover:bg-indigo-100 transition-colors mb-4">
              <Calendar className="h-8 w-8 text-gray-400 group-hover:text-indigo-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Add New Session</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Create a new conference session or import from file
            </p>
            <Button
              variant="outline"
              size="sm"
              className="group-hover:bg-indigo-50 group-hover:border-indigo-300"
              onClick={onAddSession}
            >
              Add Session
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
