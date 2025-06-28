"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Mail, Plus, Trash2, Loader2, Shield } from "lucide-react"
import { OtpVerificationDialog } from "@/components/otp-verification-dialog"
import { useUpdateField } from "@/hooks/use-settings"
import { toast } from "@/hooks/use-toast"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

interface EmailAddress {
  id: string
  email: string
  isPrimary: boolean
  isVerified: boolean
  addedAt: string
}

interface EmailManagementProps {
  emails: EmailAddress[]
  isEditing: boolean
}

export function EmailManagement({ emails: initialEmails = [], isEditing }: EmailManagementProps) {
  const [emails, setEmails] = useState<EmailAddress[]>(
    initialEmails.length > 0
      ? initialEmails
      : [
        {
          id: "1",
          email: "john@example.com",
          isPrimary: true,
          isVerified: true,
          addedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          email: "john.doe@work.com",
          isPrimary: false,
          isVerified: true,
          addedAt: "2024-01-05T00:00:00Z",
        },
      ],
  )
  const [otpDialog, setOtpDialog] = useState<{
    open: boolean
    type: "email"
    value: string
    emailId?: string
  }>({
    open: false,
    type: "email",
    value: "",
  })

  const updateFieldMutation = useUpdateField()

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleAddEmail = () => {
    const email = form.getValues("email")
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    // Check if email already exists
    if (emails.some((e) => e.email === email)) {
      toast({
        title: "Error",
        description: "This email address is already added",
        variant: "destructive",
      })
      return
    }

    setOtpDialog({
      open: true,
      type: "email",
      value: email,
    })
  }

  const handleRemoveEmail = (emailId: string) => {
    const email = emails.find((e) => e.id === emailId)
    if (!email) return

    if (email.isPrimary) {
      toast({
        title: "Error",
        description: "Cannot remove primary email address",
        variant: "destructive",
      })
      return
    }

    setEmails((prev) => prev.filter((e) => e.id !== emailId))
    toast({
      title: "Success",
      description: "Email address removed successfully",
    })
  }

  const handleSetPrimary = async (emailId: string) => {
    const email = emails.find((e) => e.id === emailId)
    if (!email || !email.isVerified) {
      toast({
        title: "Error",
        description: "Email address must be verified to set as primary",
        variant: "destructive",
      })
      return
    }

    setEmails((prev) =>
      prev.map((e) => ({
        ...e,
        isPrimary: e.id === emailId,
      })),
    )

    toast({
      title: "Success",
      description: "Primary email address updated",
    })
  }

  const handleResendVerification = (emailId: string) => {
    const email = emails.find((e) => e.id === emailId)
    if (!email) return

    setOtpDialog({
      open: true,
      type: "email",
      value: email.email,
      emailId,
    })
  }

  const handleOtpVerified = () => {
    if (otpDialog.emailId) {
      // Verify existing email
      setEmails((prev) => prev.map((e) => (e.id === otpDialog.emailId ? { ...e, isVerified: true } : e)))

      toast({
        title: "Success",
        description: "Email address verified successfully",
      })
    } else {
      // Add new email
      const newEmail: EmailAddress = {
        id: Date.now().toString(),
        email: otpDialog.value,
        isPrimary: emails.length === 0,
        isVerified: true,
        addedAt: new Date().toISOString(),
      }

      setEmails((prev) => [...prev, newEmail])
      form.reset()

      toast({
        title: "Success",
        description: "Email address added and verified successfully",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Address Management
          </CardTitle>
          <CardDescription>Manage your email addresses for account recovery and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Email */}
          {isEditing && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <Label htmlFor="newEmail">Add New Email Address</Label>
              <div className="flex gap-2">
                <Input id="newEmail" {...form.register("email")} placeholder="Enter email address" className="flex-1" />
                <Button
                  onClick={handleAddEmail}
                  disabled={updateFieldMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {updateFieldMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add
                </Button>
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
          )}

          {/* Email Addresses List */}
          <div className="space-y-3">
            {emails.map((email) => (
              <div key={email.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{email.email}</span>
                    {email.isPrimary && <Badge variant="default">Primary</Badge>}
                    {email.isVerified ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Unverified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Added on {formatDate(email.addedAt)}</p>
                </div>

                {isEditing && (
                  <div className="flex items-center gap-2">
                    {!email.isVerified && (
                      <Button variant="outline" size="sm" onClick={() => handleResendVerification(email.id)}>
                        Verify
                      </Button>
                    )}
                    {!email.isPrimary && email.isVerified && (
                      <Button variant="outline" size="sm" onClick={() => handleSetPrimary(email.id)}>
                        Set Primary
                      </Button>
                    )}
                    {!email.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveEmail(email.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {emails.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No email addresses added yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <OtpVerificationDialog
        open={otpDialog.open}
        onOpenChange={(open) => setOtpDialog((prev) => ({ ...prev, open }))}
        type={otpDialog.type}
        value={otpDialog.value}
        onVerified={handleOtpVerified}
      />
    </>
  )
}
