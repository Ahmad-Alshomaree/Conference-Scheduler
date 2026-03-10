"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Session } from "../types/session"

interface FileUploadProps {
  onSessionsLoaded: (sessions: Session[]) => void
}

export function FileUpload({ onSessionsLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    if (!["csv", "xlsx", "xls"].includes(fileExtension || "")) {
      setUploadStatus("error")
      setErrorMessage("Please upload a CSV or Excel file")
      return
    }

    if (fileExtension === "csv") {
      parseCSV(file)
    } else {
      parseExcel(file)
    }
  }

  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

        const sessions: Session[] = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map((v) => v.trim())

          if (values.length >= 6) {
            const session: Session = {
              id: i,
              title: values[headers.indexOf("title")] || values[0] || `Session ${i}`,
              startDate: values[headers.indexOf("start date") >= 0 ? headers.indexOf("start date") : 1] || "2024-01-01",
              startTime: values[headers.indexOf("start time") >= 0 ? headers.indexOf("start time") : 2] || "09:00",
              endDate: values[headers.indexOf("end date") >= 0 ? headers.indexOf("end date") : 3] || "2024-01-01",
              endTime: values[headers.indexOf("end time") >= 0 ? headers.indexOf("end time") : 4] || "10:00",
              attendees:
                values[headers.indexOf("attendees") >= 0 ? headers.indexOf("attendees") : 5] ||
                values[headers.indexOf("with who") >= 0 ? headers.indexOf("with who") : 5] ||
                "TBD",
              priority:
                Number.parseInt(values[headers.indexOf("priority") >= 0 ? headers.indexOf("priority") : 6] || "3") || 3,
            }
            sessions.push(session)
          }
        }

        onSessionsLoaded(sessions)
        setUploadStatus("success")
        setErrorMessage("")
      } catch (error) {
        setUploadStatus("error")
        setErrorMessage("Error parsing CSV file. Please check the format.")
      }
    }
    reader.readAsText(file)
  }

  const parseExcel = (file: File) => {
    // For Excel files, we'll simulate parsing since xlsx library isn't available
    // In a real implementation, you'd use the xlsx library
    setUploadStatus("error")
    setErrorMessage("Excel parsing not implemented in this demo. Please use CSV format.")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">Drop your file here</p>
          <p className="text-sm text-gray-500 mb-4">Supports CSV and Excel files (.csv, .xlsx, .xls)</p>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            Choose File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
            className="hidden"
          />
        </div>

        {uploadStatus === "success" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Sessions imported successfully! Click "Run Scheduler" to optimize.</AlertDescription>
          </Alert>
        )}

        {uploadStatus === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Expected CSV format:</strong>
          </p>
          <p>Title, Start Date, Start Time, End Date, End Time, Attendees, Priority</p>
          <p>
            <strong>Example:</strong>
          </p>
          <p className="font-mono bg-gray-100 p-2 rounded">
            Team Meeting, 2024-01-15, 09:00, 2024-01-15, 10:00, John & Sarah, 1
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
