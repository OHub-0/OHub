"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, GraduationCap, Loader2, Check } from "lucide-react"
import { SingleSelectDropdown } from "@/components/ui/single-select-dropdown"
import { ProfileHeader } from "@/components/profile-header"
import { PasswordSection } from "@/components/password-section"
import { PhoneManagement } from "@/components/phone-management"
import { EmailManagement } from "@/components/email-management"
import { SessionManagement } from "@/components/session-management"
import { PrivacySettings } from "@/components/privacy-settings"
import { ActivityTimeline } from "@/components/activity-timeline"
import { AccountBackup } from "@/components/account-backup"
import { SettingsSidebar } from "@/components/settings-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useUserData, useEducationOptions, useCountries, useUpdateSettings } from "@/hooks/use-settings"
import { settingsSchema, type SettingsFormData } from "@/lib/validations/settings"
import { toast } from "@/hooks/use-toast"

interface SettingsPageProps {
  username: string
}

export function SettingsPage({ username }: SettingsPageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState("personal")

  const { data: userData, isLoading: userLoading } = useUserData(username)
  const { data: educationOptions = [] } = useEducationOptions()
  const { data: countries = [] } = useCountries()
  const updateSettingsMutation = useUpdateSettings(username)

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      country: "",
      dateOfBirth: "",
      city: "",
      emails: [""],
      phoneNumber: "",
      education: {
        level: "",
        institution: "",
        fieldOfStudy: "",
        graduationYear: "",
        degree: "",
      },
    },
  })

  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || "",
        middleName: userData.middleName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        country: userData.country || "",
        dateOfBirth: userData.dateOfBirth || "",
        city: userData.city || "",
        emails: userData.emails?.length ? userData.emails : [""],
        phoneNumber: userData.phoneNumber || "",
        education: userData.education || {
          level: "",
          institution: "",
          fieldOfStudy: "",
          graduationYear: "",
          degree: "",
        },
      })
    }
  }, [userData, form])

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      if (userData) {
        form.reset({
          firstName: userData.firstName || "",
          middleName: userData.middleName || "",
          lastName: userData.lastName || "",
          username: userData.username || "",
          country: userData.country || "",
          dateOfBirth: userData.dateOfBirth || "",
          city: userData.city || "",
          emails: userData.emails?.length ? userData.emails : [""],
          phoneNumber: userData.phoneNumber || "",
          education: userData.education || {
            level: "",
            institution: "",
            fieldOfStudy: "",
            graduationYear: "",
            degree: "",
          },
        })
      }
    }
    setIsEditing(!isEditing)
  }

  const handleImageUpdate = (type: "avatar", url: string) => {
    toast({
      title: "Success",
      description: "Profile picture updated successfully",
    })
  }

  const handleSave = async (data: SettingsFormData) => {
    try {
      await updateSettingsMutation.mutateAsync(data)
      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      })
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...form.register("firstName")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    {...form.register("middleName")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...form.register("lastName")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    {...form.register("username")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                  {form.formState.errors.username && (
                    <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <SingleSelectDropdown
                    options={countries}
                    value={form.watch("country")}
                    onValueChange={(value) => form.setValue("country", value)}
                    placeholder="Select country"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                  {form.formState.errors.country && (
                    <p className="text-sm text-destructive">{form.formState.errors.country.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...form.register("city")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register("dateOfBirth")}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button
                    onClick={form.handleSubmit(handleSave)}
                    disabled={updateSettingsMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {updateSettingsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "education":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Educational Details
              </CardTitle>
              <CardDescription>
                Educational information for fast form fill-ups
                <Badge variant="secondary" className="ml-2">
                  Optional
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <SingleSelectDropdown
                    options={educationOptions}
                    value={form.watch("education.level")}
                    onValueChange={(value) => form.setValue("education.level", value)}
                    placeholder="Select education level"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    {...form.register("education.institution")}
                    placeholder="University/School name"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy">Field of Study</Label>
                  <Input
                    id="fieldOfStudy"
                    {...form.register("education.fieldOfStudy")}
                    placeholder="e.g., Computer Science"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    {...form.register("education.degree")}
                    placeholder="e.g., Bachelor's, Master's"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    {...form.register("education.graduationYear")}
                    placeholder="e.g., 2024"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button
                    onClick={form.handleSubmit(handleSave)}
                    disabled={updateSettingsMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {updateSettingsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Save Education Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "password":
        return <PasswordSection isEditing={isEditing} phoneNumber={userData?.phoneNumber || ""} />

      case "email":
        return <EmailManagement emails={[]} isEditing={isEditing} />

      case "phone":
        return <PhoneManagement phoneNumbers={[]} isEditing={isEditing} />

      case "sessions":
        return <SessionManagement devices={[]} isEditing={isEditing} />

      case "privacy":
        return <PrivacySettings isEditing={isEditing} />

      case "activity":
        return <ActivityTimeline />

      case "backup":
        return <AccountBackup />

      default:
        return null
    }
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <SidebarInset className="flex-1">
          <div className="flex flex-col">
            <ProfileHeader
              username={userData?.username || username}
              country={userData?.country || ""}
              avatarUrl={userData?.avatarUrl}
              isEditing={isEditing}
              onEditToggle={handleEditToggle}
              onImageUpdate={handleImageUpdate}
            />
            <div className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">{renderSection()}</div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
