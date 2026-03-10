"use client"
import { Calendar, Users, MessageSquare, Settings, FileText, BarChart3, Clock } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "sessions", label: "All Sessions", icon: Clock },
    { id: "attendees", label: "Attendees", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold">ConferenceHub</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === item.id
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">PM</span>
          </div>
          <div>
            <p className="font-medium">Administrator</p>
            <p className="text-xs text-white/70">Conference Owner</p>
          </div>
        </div>
        <button
          onClick={async () => {
            try {
              await fetch("/api/auth/signout", { method: "POST" })
              window.location.href = "/signin"
            } catch (e) {
              console.error(e)
            }
          }}
          className="w-full text-left text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-2 rounded"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
