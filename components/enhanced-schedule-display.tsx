import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Users, Calendar, TrendingUp } from "lucide-react"
import type { ScheduleResult } from "../types/session"
import { formatDateTime, getPriorityColor, getPriorityLabel } from "../utils/scheduler"

interface EnhancedScheduleDisplayProps {
  result: ScheduleResult
}

export function EnhancedScheduleDisplay({ result }: EnhancedScheduleDisplayProps) {
  const allSessions = [...result.selectedSessions, ...result.rejectedSessions].sort((a, b) => {
    const startA = new Date(`${a.startDate} ${a.startTime}`).getTime()
    const startB = new Date(`${b.startDate} ${b.startTime}`).getTime()
    return startA - startB
  })

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Scheduled</p>
                <p className="text-2xl font-bold text-green-700">{result.totalSelected}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <p className="text-2xl font-bold text-red-700">{result.rejectedSessions.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Sessions</p>
                <p className="text-2xl font-bold text-blue-700">{allSessions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-700">
                  {Math.round((result.totalSelected / allSessions.length) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Priority Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {result.priorityBreakdown.map(({ priority, selected, total }) => (
              <div key={priority} className="text-center">
                <div className={`p-3 rounded-lg border ${getPriorityColor(priority)}`}>
                  <div className="font-bold text-lg">
                    {selected}/{total}
                  </div>
                  <div className="text-sm">{getPriorityLabel(priority)}</div>
                  <div className="text-xs mt-1">{Math.round((selected / total) * 100)}% scheduled</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allSessions.map((session) => (
              <div
                key={session.id}
                className={`relative p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${
                  session.selected
                    ? "bg-green-50 border-l-green-500 border border-green-200"
                    : "bg-red-50 border-l-red-500 border border-red-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {session.selected ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <h3 className="font-semibold text-lg">{session.title}</h3>
                      <Badge className={getPriorityColor(session.priority)}>{getPriorityLabel(session.priority)}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatDateTime(session.startDate, session.startTime)} -{" "}
                          {formatDateTime(session.endDate, session.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{session.attendees}</span>
                      </div>
                    </div>

                    {session.conflictReason && (
                      <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded">
                        <strong>Conflict:</strong> {session.conflictReason}
                      </div>
                    )}
                  </div>

                  <Badge variant={session.selected ? "default" : "destructive"} className="ml-4">
                    {session.selected ? "Scheduled" : "Rejected"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
