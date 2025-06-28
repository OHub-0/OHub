"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"
import type { SettingsFormData } from "@/lib/validations/settings"

interface ProfileCompletionProps {
  userData?: SettingsFormData & {
    avatarUrl?: string
    coverImageUrl?: string
  }
}

export function ProfileCompletion({ userData }: ProfileCompletionProps) {
  const calculateCompletion = () => {
    if (!userData) return { percentage: 0, completed: [], missing: [] }

    const fields = [
      { key: "firstName", label: "First Name", value: userData.firstName },
      { key: "lastName", label: "Last Name", value: userData.lastName },
      { key: "username", label: "Username", value: userData.username },
      { key: "country", label: "Country", value: userData.country },
      { key: "phoneNumber", label: "Phone Number", value: userData.phoneNumber },
      { key: "emails", label: "Email Address", value: userData.emails?.[0] },
      { key: "avatarUrl", label: "Profile Picture", value: userData.avatarUrl },
      { key: "coverImageUrl", label: "Cover Image", value: userData.coverImageUrl },
      { key: "city", label: "City", value: userData.city },
      { key: "dateOfBirth", label: "Date of Birth", value: userData.dateOfBirth },
      { key: "education.level", label: "Education Level", value: userData.education?.level },
      { key: "education.institution", label: "Institution", value: userData.education?.institution },
    ]

    const completed = fields.filter((field) => field.value && field.value.toString().trim() !== "")
    const missing = fields.filter((field) => !field.value || field.value.toString().trim() === "")

    const percentage = Math.round((completed.length / fields.length) * 100)

    return { percentage, completed, missing }
  }

  const { percentage, completed, missing } = calculateCompletion()

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getCompletionBadge = (percentage: number) => {
    if (percentage >= 90) return { variant: "default" as const, text: "Excellent" }
    if (percentage >= 70) return { variant: "secondary" as const, text: "Good" }
    if (percentage >= 50) return { variant: "outline" as const, text: "Fair" }
    return { variant: "destructive" as const, text: "Incomplete" }
  }

  const badge = getCompletionBadge(percentage)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Profile Completion
          <Badge variant={badge.variant}>{badge.text}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className={getCompletionColor(percentage)}>{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {completed.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completed.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {completed.slice(0, 6).map((field) => (
                <Badge key={field.key} variant="outline" className="text-xs">
                  {field.label}
                </Badge>
              ))}
              {completed.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{completed.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {missing.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-orange-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Missing ({missing.length})
            </h4>
            <div className="flex flex-wrap gap-1">
              {missing.slice(0, 4).map((field) => (
                <Badge key={field.key} variant="secondary" className="text-xs">
                  {field.label}
                </Badge>
              ))}
              {missing.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{missing.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {percentage < 100 && (
          <p className="text-xs text-muted-foreground">
            Complete your profile to unlock all features and improve your experience.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
