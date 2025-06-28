"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Phone, Lock, Eye } from "lucide-react"
import { useSendOtp, useVerifyOtp } from "@/hooks/use-settings"
import { toast } from "@/hooks/use-toast"

interface OtpVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "email" | "phone" | "password" | "view_password" | "phone_change_old" | "phone_change_new"
  value: string
  onVerified: (otpToken?: string) => void
  title?: string
  description?: string
}

export function OtpVerificationDialog({
  open,
  onOpenChange,
  type,
  value,
  onVerified,
  title,
  description,
}: OtpVerificationDialogProps) {
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"send" | "verify">("send")

  const sendOtpMutation = useSendOtp()
  const verifyOtpMutation = useVerifyOtp()

  const getIcon = () => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "phone":
      case "phone_change_old":
      case "phone_change_new":
        return <Phone className="h-4 w-4" />
      case "password":
        return <Lock className="h-4 w-4" />
      case "view_password":
        return <Eye className="h-4 w-4" />
    }
  }

  const getTitle = () => {
    if (title) return title

    switch (type) {
      case "email":
        return "Verify Email Change"
      case "phone":
        return "Verify Phone Number Change"
      case "phone_change_old":
        return "Verify Current Phone Number"
      case "phone_change_new":
        return "Verify New Phone Number"
      case "password":
        return "Verify Password Change"
      case "view_password":
        return "Verify Identity"
    }
  }

  const getDescription = () => {
    if (description) return description

    switch (type) {
      case "email":
        return `We'll send a verification code to ${value}`
      case "phone":
      case "phone_change_new":
        return `We'll send a verification code to ${value}`
      case "phone_change_old":
        return `We'll send a verification code to your current phone number ${value}`
      case "password":
        return "We'll send a verification code to your registered phone number"
      case "view_password":
        return "We'll send a verification code to your registered phone number to view your current password"
    }
  }

  const handleSendOtp = async () => {
    try {
      await sendOtpMutation.mutateAsync({ type, value })
      setStep("verify")
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
        variant: "destructive",
      })
    }
  }

  const handleVerifyOtp = async () => {
    try {
      const result = await verifyOtpMutation.mutateAsync({ otp, type, value })
      toast({
        title: "Verified",
        description: "Verification successful.",
      })
      onVerified(result.otpToken)
      onOpenChange(false)
      setStep("send")
      setOtp("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify OTP",
        variant: "destructive",
      })
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setStep("send")
    setOtp("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {step === "send" ? getDescription() : "Enter the 6-digit code we sent to you."}
          </DialogDescription>
        </DialogHeader>

        {step === "send" ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">Click the button below to receive your verification code.</p>
          </div>
        ) : (
          <div className="py-4">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === "send" ? (
            <Button onClick={handleSendOtp} disabled={sendOtpMutation.isPending}>
              {sendOtpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Code
            </Button>
          ) : (
            <Button onClick={handleVerifyOtp} disabled={verifyOtpMutation.isPending || otp.length !== 6}>
              {verifyOtpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
