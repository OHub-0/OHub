"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Database, ImageIcon, Mail, Calendar, Loader2, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface BackupItem {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  size: string
  included: boolean
}

export function AccountBackup() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastBackup, setLastBackup] = useState<string | null>("2024-01-10T15:30:00Z")

  const backupItems: BackupItem[] = [
    {
      id: "profile",
      name: "Profile Information",
      description: "Personal details, contact info, and preferences",
      icon: <FileText className="h-4 w-4" />,
      size: "2.3 KB",
      included: true,
    },
    {
      id: "education",
      name: "Educational Details",
      description: "Academic background and certifications",
      icon: <Database className="h-4 w-4" />,
      size: "1.1 KB",
      included: true,
    },
    {
      id: "images",
      name: "Profile Images",
      description: "Avatar and cover photos",
      icon: <ImageIcon className="h-4 w-4" />,
      size: "4.7 MB",
      included: true,
    },
    {
      id: "activity",
      name: "Activity History",
      description: "Recent account changes and login history",
      icon: <Calendar className="h-4 w-4" />,
      size: "856 B",
      included: true,
    },
    {
      id: "privacy",
      name: "Privacy Settings",
      description: "Visibility and data sharing preferences",
      icon: <Mail className="h-4 w-4" />,
      size: "432 B",
      included: true,
    },
  ]

  const handleGenerateBackup = async () => {
    setIsGenerating(true)
    try {
      // Simulate backup generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In a real app, this would generate and download the backup file
      const backupData = {
        exportDate: new Date().toISOString(),
        profile: {
          // User profile data
        },
        education: {
          // Education data
        },
        settings: {
          // Privacy and other settings
        },
        metadata: {
          version: "1.0",
          format: "JSON",
        },
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `account-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setLastBackup(new Date().toISOString())

      toast({
        title: "Success",
        description: "Account backup generated and downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate backup",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalSize = () => {
    const sizes = backupItems
      .filter((item) => item.included)
      .map((item) => {
        const size = item.size
        if (size.includes("MB")) {
          return Number.parseFloat(size) * 1024 * 1024
        } else if (size.includes("KB")) {
          return Number.parseFloat(size) * 1024
        } else {
          return Number.parseFloat(size)
        }
      })

    const totalBytes = sizes.reduce((sum, size) => sum + size, 0)

    if (totalBytes > 1024 * 1024) {
      return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`
    } else if (totalBytes > 1024) {
      return `${(totalBytes / 1024).toFixed(1)} KB`
    } else {
      return `${totalBytes} B`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Account Backup
        </CardTitle>
        <CardDescription>Export your account data for backup or transfer purposes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Last Backup Info */}
        {lastBackup && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Last backup created</p>
              <p className="text-xs text-green-600">{formatDate(lastBackup)}</p>
            </div>
          </div>
        )}

        {/* Backup Contents */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">What's included</h4>
            <Badge variant="outline">Total: {getTotalSize()}</Badge>
          </div>

          <div className="space-y-2">
            {backupItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 bg-blue-50 rounded-md text-blue-600">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-medium">{item.name}</h5>
                    <Badge variant="secondary" className="text-xs">
                      {item.size}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Backup Actions */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Export Format</h4>
            <p className="text-xs text-muted-foreground">
              Your data will be exported as a JSON file that can be easily imported or viewed in any text editor. Images
              will be included as base64-encoded data or download links.
            </p>
          </div>

          <Button onClick={handleGenerateBackup} disabled={isGenerating} className="w-full flex items-center gap-2">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Backup...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate & Download Backup
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            This backup contains all your personal data. Keep it secure and don't share it with others.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
