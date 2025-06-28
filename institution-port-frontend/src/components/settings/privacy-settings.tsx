"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Users, Globe, Lock, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends"
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  allowSearchEngines: boolean
  dataCollection: boolean
  marketingEmails: boolean
  securityNotifications: boolean
}

interface PrivacySettingsProps {
  isEditing: boolean
}

export function PrivacySettings({ isEditing }: PrivacySettingsProps) {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowSearchEngines: true,
    dataCollection: false,
    marketingEmails: false,
    securityNotifications: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Privacy settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-4 w-4" />
      case "friends":
        return <Users className="h-4 w-4" />
      case "private":
        return <Lock className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Security
        </CardTitle>
        <CardDescription>Control who can see your information and how your data is used</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Profile Visibility</Label>
          <div className="space-y-2">
            {[
              { value: "public", label: "Public", description: "Anyone can view your profile" },
              { value: "friends", label: "Friends Only", description: "Only your connections can view" },
              { value: "private", label: "Private", description: "Only you can view your profile" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={option.value}
                  name="profileVisibility"
                  value={option.value}
                  checked={settings.profileVisibility === option.value}
                  onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                  disabled={!isEditing}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                    {getVisibilityIcon(option.value)}
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information Visibility */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Contact Information</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showEmail">Show Email Address</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
              </div>
              <Switch
                id="showEmail"
                checked={settings.showEmail}
                onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showPhone">Show Phone Number</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
              </div>
              <Switch
                id="showPhone"
                checked={settings.showPhone}
                onCheckedChange={(checked) => handleSettingChange("showPhone", checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showLocation">Show Location</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your city and country</p>
              </div>
              <Switch
                id="showLocation"
                checked={settings.showLocation}
                onCheckedChange={(checked) => handleSettingChange("showLocation", checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Data & Privacy</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowSearchEngines">Search Engine Indexing</Label>
                <p className="text-sm text-muted-foreground">Allow search engines to index your profile</p>
              </div>
              <Switch
                id="allowSearchEngines"
                checked={settings.allowSearchEngines}
                onCheckedChange={(checked) => handleSettingChange("allowSearchEngines", checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dataCollection">Analytics & Improvement</Label>
                <p className="text-sm text-muted-foreground">Help improve our service with usage analytics</p>
              </div>
              <Switch
                id="dataCollection"
                checked={settings.dataCollection}
                onCheckedChange={(checked) => handleSettingChange("dataCollection", checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Email Notifications</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketingEmails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
              </div>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                disabled={!isEditing}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="securityNotifications">Security Notifications</Label>
                <p className="text-sm text-muted-foreground">Important security alerts and login notifications</p>
              </div>
              <Switch
                id="securityNotifications"
                checked={settings.securityNotifications}
                onCheckedChange={(checked) => handleSettingChange("securityNotifications", checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              Save Privacy Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
