import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import type { ScheduleResult } from "../types/session"
import { formatTime } from "../utils/scheduler"

interface ScheduleDisplayProps {
  result: ScheduleResult
}

export function ScheduleDisplay({ result }: ScheduleDisplayProps) {
  const allSessions = [...result.selectedSessions, ...result.rejectedSessions].sort((a, b) => {
    const startA = new Date(`2024-01-01 ${a.startTime}`).getTime()
    const startB = new Date(`2024-01-01 ${b.startTime}`).getTime()
    return startA - startB
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schedule Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.totalSelected}</div>
              <div className="text-sm text-muted-foreground">Sessions Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{result.rejectedSessions.length}</div>
              <div className="text-sm text-muted-foreground">Sessions Rejected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{allSessions.length}</div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </div>
          </div>

          <div className="space-y-3">
            {allSessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  session.selected ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {session.selected ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </div>
                  </div>
                </div>
                <Badge variant={session.selected ? "default" : "destructive"}>
                  {session.selected ? "Scheduled" : "Rejected"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
