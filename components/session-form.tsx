"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Session } from "../types/session"

interface SessionFormProps {
  onAddSession: (session: Omit<Session, "id">) => void
}

export function SessionForm({ onAddSession }: SessionFormProps) {
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !startTime || !endTime) return

    // Validate that end time is after start time
    const start = new Date(`2024-01-01 ${startTime}`)
    const end = new Date(`2024-01-01 ${endTime}`)

    if (end <= start) {
      alert("End time must be after start time")
      return
    }

    onAddSession({
      title,
      startTime,
      endTime,
    })

    // Reset form
    setTitle("")
    setStartTime("")
    setEndTime("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter session title"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add Session
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
