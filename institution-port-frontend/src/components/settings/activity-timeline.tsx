"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, Lock, ImageIcon, Clock } from "lucide-react"

interface ActivityItem {
  id: string
  type: "profile_update" | "email_change" | "phone_change" | "password_change" | "image_upload" | "login"
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

interface ActivityTimelineProps {
  activities?: ActivityItem[]
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "profile_update",
    description: "Updated profile information",
    timestamp: "2024-01-15T10:30:00Z",
    metadata: { fields: ["firstName", "lastName"] },
  },
  {
    id: "2",
    type: "image_upload",
    description: "Changed profile picture",
    timestamp: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    type: "email_change",
    description: "Added new email address",
    timestamp: "2024-01-13T09:20:00Z",
    metadata: { email: "new.email@example.com" },
  },
  {
    id: "4",
    type: "phone_change",
    description: "Updated phone number",
    timestamp: "2024-01-12T14:15:00Z",
  },
  {
    id: "5",
    type: "password_change",
    description: "Changed account password",
    timestamp: "2024-01-10T11:00:00Z",
  },
  {
    id: "6",
    type: "login",
    description: "Signed in from new device",
    timestamp: "2024-01-09T08:30:00Z",
    metadata: { device: "Chrome on Windows", location: "New York, US" },
  },
]

export function ActivityTimeline({ activities = mockActivities }: ActivityTimelineProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "profile_update":
        return <User className="h-4 w-4" />
      case "email_change":
        return <Mail className="h-4 w-4" />
      case "phone_change":
        return <Phone className="h-4 w-4" />
      case "password_change":
        return <Lock className="h-4 w-4" />
      case "image_upload":
        return <ImageIcon className="h-4 w-4" />
      case "login":
        return <Clock className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "profile_update":
        return "bg-blue-100 text-blue-600"
      case "email_change":
        return "bg-green-100 text-green-600"
      case "phone_change":
        return "bg-purple-100 text-purple-600"
      case "password_change":
        return "bg-red-100 text-red-600"
      case "image_upload":
        return "bg-orange-100 text-orange-600"
      case "login":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 8).map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                {activity.metadata && (
                  <div className="mt-1 space-y-1">
                    {activity.metadata.fields && (
                      <p className="text-xs text-muted-foreground">Fields: {activity.metadata.fields.join(", ")}</p>
                    )}
                    {activity.metadata.email && (
                      <p className="text-xs text-muted-foreground">Email: {activity.metadata.email}</p>
                    )}
                    {activity.metadata.device && (
                      <p className="text-xs text-muted-foreground">Device: {activity.metadata.device}</p>
                    )}
                    {activity.metadata.location && (
                      <p className="text-xs text-muted-foreground">Location: {activity.metadata.location}</p>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(activity.timestamp)}</p>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
