"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Edit3, Check, X } from "lucide-react"
import { useUploadImage } from "@/hooks/use-settings"
import { toast } from "@/hooks/use-toast"

interface ProfileHeaderProps {
  username: string
  country: string
  avatarUrl?: string
  isEditing: boolean
  onEditToggle: () => void
  onImageUpdate: (type: "avatar", url: string) => void
}

export function ProfileHeader({
  username,
  country,
  avatarUrl,
  isEditing,
  onEditToggle,
  onImageUpdate,
}: ProfileHeaderProps) {
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string>()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const uploadImageMutation = useUploadImage()

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadImageMutation.mutateAsync({ file, type: "avatar" })
      setTempAvatarUrl(result.url)
      onImageUpdate("avatar", result.url)

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "Image size must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      handleImageUpload(file)
    }
  }

  const currentAvatarUrl = tempAvatarUrl || avatarUrl

  return (
    <div className="flex flex-col items-center py-8 bg-white border-b">
      {/* Profile Picture */}
      <div className="relative mb-4">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={currentAvatarUrl || "/placeholder.svg"} alt={username} />
          <AvatarFallback className="text-2xl font-bold">{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        {isEditing && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 bg-white shadow-lg hover:bg-gray-50"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadImageMutation.isPending}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* User Info */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
        <p className="text-gray-600 mt-1">{country}</p>
      </div>

      {/* Edit Toggle */}
      <div className="mt-4">
        {!isEditing ? (
          <Button onClick={onEditToggle} className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEditToggle} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={onEditToggle} className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Done
            </Button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  )
}
