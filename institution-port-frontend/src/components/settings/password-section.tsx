"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Check, Loader2, Lock } from "lucide-react"
import { OtpVerificationDialog } from "@/components/otp-verification-dialog"
import { useGetCurrentPassword, useUpdatePassword } from "@/hooks/use-settings"
import { passwordSchema, type PasswordFormData } from "@/lib/validations/settings"
import { toast } from "@/hooks/use-toast"

interface PasswordSectionProps {
  isEditing: boolean
  phoneNumber: string
}

export function PasswordSection({ isEditing, phoneNumber }: PasswordSectionProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false)
  const [otpDialog, setOtpDialog] = useState({
    open: false,
    type: "view_password" as const,
  })

  const getCurrentPasswordMutation = useGetCurrentPassword()
  const updatePasswordMutation = useUpdatePassword()

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const handleViewCurrentPassword = () => {
    setOtpDialog({
      open: true,
      type: "view_password",
    })
  }

  const handleCurrentPasswordVerified = async (otpToken: string) => {
    try {
      const result = await getCurrentPasswordMutation.mutateAsync(otpToken)
      form.setValue("currentPassword", result.password)
      setCurrentPasswordVisible(true)
      toast({
        title: "Success",
        description: "Current password retrieved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get current password",
        variant: "destructive",
      })
    }
  }

  const handleNewPasswordSubmit = () => {
    const newPassword = form.getValues("newPassword")
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      })
      return
    }

    // Show OTP dialog for new password verification
    setOtpDialog({
      open: true,
      type: "password",
    })
  }

  const handleNewPasswordVerified = async () => {
    const formData = form.getValues()

    try {
      await updatePasswordMutation.mutateAsync(formData)
      toast({
        title: "Success",
        description: "Password updated successfully",
      })
      form.setValue("newPassword", "")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      })
    }
  }

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password
          </CardTitle>
          <CardDescription>Your account password is protected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value="••••••••••••" disabled className="bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Management
          </CardTitle>
          <CardDescription>View your current password or set a new one</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  {...form.register("currentPassword")}
                  placeholder={currentPasswordVisible ? "" : "Click 'View' to see current password"}
                  disabled={!currentPasswordVisible}
                  className={!currentPasswordVisible ? "bg-muted" : ""}
                />
                {currentPasswordVisible && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              {!currentPasswordVisible && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleViewCurrentPassword}
                  disabled={getCurrentPasswordMutation.isPending}
                >
                  {getCurrentPasswordMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "View"}
                </Button>
              )}
            </div>
            {form.formState.errors.currentPassword && (
              <p className="text-sm text-destructive">{form.formState.errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password (Optional)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...form.register("newPassword")}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                type="button"
                onClick={handleNewPasswordSubmit}
                disabled={updatePasswordMutation.isPending || !form.watch("newPassword")}
                className="flex items-center gap-2"
              >
                {updatePasswordMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </div>
            {form.formState.errors.newPassword && (
              <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <OtpVerificationDialog
        open={otpDialog.open}
        onOpenChange={(open) => setOtpDialog((prev) => ({ ...prev, open }))}
        type={otpDialog.type}
        value={phoneNumber}
        onVerified={otpDialog.type === "view_password" ? handleCurrentPasswordVerified : handleNewPasswordVerified}
      />
    </>
  )
}
