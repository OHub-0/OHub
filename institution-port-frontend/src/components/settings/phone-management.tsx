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
import { Phone, Plus, Trash2, Loader2, Shield } from "lucide-react"
import { OtpVerificationDialog } from "@/components/otp-verification-dialog"
import { useUpdateField, useCheckUniqueness } from "@/hooks/use-settings"
import { toast } from "@/hooks/use-toast"

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
})

interface PhoneNumber {
  id: string
  number: string
  isPrimary: boolean
  isVerified: boolean
  addedAt: string
}

interface PhoneManagementProps {
  phoneNumbers: PhoneNumber[]
  isEditing: boolean
}

export function PhoneManagement({ phoneNumbers: initialPhoneNumbers = [], isEditing }: PhoneManagementProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(
    initialPhoneNumbers.length > 0
      ? initialPhoneNumbers
      : [
        {
          id: "1",
          number: "+1234567890",
          isPrimary: true,
          isVerified: true,
          addedAt: "2024-01-01T00:00:00Z",
        },
      ],
  )
  const [otpDialog, setOtpDialog] = useState<{
    open: boolean
    type: "phone_change_old" | "phone_change_new" | "phone_add"
    value: string
    phoneId?: string
  }>({
    open: false,
    type: "phone_add",
    value: "",
  })

  const updateFieldMutation = useUpdateField()
  const checkUniquenessMutation = useCheckUniqueness()

  const form = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  const handleAddPhone = async () => {
    const phoneNumber = form.getValues("phoneNumber")
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      })
      return
    }

    // Check if phone already exists
    if (phoneNumbers.some((p) => p.number === phoneNumber)) {
      toast({
        title: "Error",
        description: "This phone number is already added",
        variant: "destructive",
      })
      return
    }

    // Check uniqueness
    try {
      const result = await checkUniquenessMutation.mutateAsync({ field: "phoneNumber", value: phoneNumber })
      if (!result.isUnique) {
        toast({
          title: "Error",
          description: "Phone number is already in use by another account",
          variant: "destructive",
        })
        return
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check phone number uniqueness",
        variant: "destructive",
      })
      return
    }

    setOtpDialog({
      open: true,
      type: "phone_add",
      value: phoneNumber,
    })
  }

  const handleRemovePhone = (phoneId: string) => {
    const phone = phoneNumbers.find((p) => p.id === phoneId)
    if (!phone) return

    if (phone.isPrimary) {
      toast({
        title: "Error",
        description: "Cannot remove primary phone number",
        variant: "destructive",
      })
      return
    }

    setPhoneNumbers((prev) => prev.filter((p) => p.id !== phoneId))
    toast({
      title: "Success",
      description: "Phone number removed successfully",
    })
  }

  const handleSetPrimary = async (phoneId: string) => {
    const phone = phoneNumbers.find((p) => p.id === phoneId)
    if (!phone || !phone.isVerified) {
      toast({
        title: "Error",
        description: "Phone number must be verified to set as primary",
        variant: "destructive",
      })
      return
    }

    setPhoneNumbers((prev) =>
      prev.map((p) => ({
        ...p,
        isPrimary: p.id === phoneId,
      })),
    )

    toast({
      title: "Success",
      description: "Primary phone number updated",
    })
  }

  const handleOtpVerified = () => {
    if (otpDialog.type === "phone_add") {
      const newPhone: PhoneNumber = {
        id: Date.now().toString(),
        number: otpDialog.value,
        isPrimary: phoneNumbers.length === 0,
        isVerified: true,
        addedAt: new Date().toISOString(),
      }

      setPhoneNumbers((prev) => [...prev, newPhone])
      form.reset()

      toast({
        title: "Success",
        description: "Phone number added and verified successfully",
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
            <Phone className="h-5 w-5" />
            Phone Number Management
          </CardTitle>
          <CardDescription>Manage your phone numbers for account security and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Phone */}
          {isEditing && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <Label htmlFor="newPhone">Add New Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="newPhone"
                  {...form.register("phoneNumber")}
                  placeholder="Enter phone number"
                  className="flex-1"
                />
                <Button
                  onClick={handleAddPhone}
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
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-destructive">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>
          )}

          {/* Phone Numbers List */}
          <div className="space-y-3">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{phone.number}</span>
                    {phone.isPrimary && <Badge variant="default">Primary</Badge>}
                    {phone.isVerified ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Unverified</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Added on {formatDate(phone.addedAt)}</p>
                </div>

                {isEditing && (
                  <div className="flex items-center gap-2">
                    {!phone.isPrimary && phone.isVerified && (
                      <Button variant="outline" size="sm" onClick={() => handleSetPrimary(phone.id)}>
                        Set Primary
                      </Button>
                    )}
                    {!phone.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemovePhone(phone.id)}
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

          {phoneNumbers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No phone numbers added yet</p>
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
