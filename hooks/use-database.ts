"use client"

import { useState, useEffect } from "react"
import type { Session, User, DatabaseAnalytics } from "../types/session"

export function useDatabase() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<DatabaseAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sessions")
      if (!response.ok) throw new Error("Failed to fetch sessions")
      const data = await response.json()
      setSessions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  // Create session
  const createSession = async (
    sessionData: Omit<Session, "id" | "createdAt" | "updatedAt" | "creatorId" | "status">,
  ) => {
    try {
      setLoading(true)
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionData),
      })
      if (!response.ok) throw new Error("Failed to create session")
      const newSession = await response.json()
      setSessions((prev) => [...prev, newSession])
      return newSession
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update session
  const updateSession = async (id: string, updates: Partial<Session>) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sessions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update session")
      const updatedSession = await response.json()
      setSessions((prev) => prev.map((session) => (session.id === id ? updatedSession : session)))
      return updatedSession
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete session
  const deleteSession = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sessions/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete session")
      setSessions((prev) => prev.filter((session) => session.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Create user
  const createUser = async (userData: Omit<User, "id" | "createdAt" | "updatedAt" | "isOnline">) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      if (!response.ok) throw new Error("Failed to create user")
      const newUser = await response.json()
      setUsers((prev) => [...prev, newUser])
      return newUser
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    }
  }

  // Initialize data on mount
  useEffect(() => {
    fetchSessions()
    fetchUsers()
    fetchAnalytics()
  }, [])

  return {
    sessions,
    users,
    analytics,
    loading,
    error,
    fetchSessions,
    fetchUsers,
    fetchAnalytics,
    createSession,
    updateSession,
    deleteSession,
    createUser,
  }
}
