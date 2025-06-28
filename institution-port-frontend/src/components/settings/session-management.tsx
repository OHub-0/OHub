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
import { Monitor, Smartphone, Tablet, Plus, Trash2, MapPin, Clock, Shield, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const deviceSchema = z.object({
  deviceName: z.string().min(1, "Device name is required").max(50, "Device name must be less than 50 characters"),
  deviceType: z.enum(["desktop", "mobile", "tablet"]),
})

interface Device {
  id: string
  name: string
  type: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
  location: string
  lastActive: string
  isCurrentDevice: boolean
  isTrusted: boolean
  addedAt: string
}

interface SessionManagementProps {
  devices: Device[]
  isEditing: boolean
}

export function SessionManagement({ devices: initialDevices = [], isEditing }: SessionManagementProps) {
  const [devices, setDevices] = useState<Device[]>(
    initialDevices.length > 0
      ? initialDevices
      : [
        {
          id: "1",
          name: "MacBook Pro",
          type: "desktop",
          browser: "Chrome 120",
          os: "macOS 14.2",
          location: "New York, US",
          lastActive: "2024-01-15T10:30:00Z",
          isCurrentDevice: true,
          isTrusted: true,
          addedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "iPhone 15",
          type: "mobile",
          browser: "Safari Mobile",
          os: "iOS 17.2",
          location: "New York, US",
          lastActive: "2024-01-14T15:45:00Z",
          isCurrentDevice: false,
          isTrusted: true,
          addedAt: "2024-01-05T00:00:00Z",
        },
        {
          id: "3",
          name: "Unknown Device",
          type: "desktop",
          browser: "Firefox 121",
          os: "Windows 11",
          location: "Los Angeles, US",
          lastActive: "2024-01-10T08:20:00Z",
          isCurrentDevice: false,
          isTrusted: false,
          addedAt: "2024-01-10T08:20:00Z",
        },
      ],
  )
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      deviceName: "",
      deviceType: "desktop" as const,
    },
  })

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const handleAddDevice = async () => {
    const { deviceName, deviceType } = form.getValues()
    if (!deviceName) {
      toast({
        title: "Error",
        description: "Please enter a device name",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newDevice: Device = {
        id: Date.now().toString(),
        name: deviceName,
        type: deviceType,
        browser: "Unknown",
        os: "Unknown",
        location: "Unknown",
        lastActive: new Date().toISOString(),
        isCurrentDevice: false,
        isTrusted: false,
        addedAt: new Date().toISOString(),
      }

      setDevices((prev) => [...prev, newDevice])
      form.reset()

      toast({
        title: "Success",
        description: "Device added successfully. You can now log in from this device.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveDevice = async (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId)
    if (!device) return

    if (device.isCurrentDevice) {
      toast({
        title: "Error",
        description: "Cannot remove current device",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setDevices((prev) => prev.filter((d) => d.id !== deviceId))

      toast({
        title: "Success",
        description: "Device removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove device",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTrustDevice = async (deviceId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, isTrusted: true } : d)))

      toast({
        title: "Success",
        description: "Device marked as trusted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trust device",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Active now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Session & Device Management
        </CardTitle>
        <CardDescription>Manage devices that can access your account and monitor active sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Device */}
        {isEditing && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <Label>Add Trusted Device</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceName">Device Name</Label>
                <Input id="deviceName" {...form.register("deviceName")} placeholder="e.g., Work Laptop" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceType">Device Type</Label>
                <select
                  {...form.register("deviceType")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddDevice} disabled={isLoading} className="flex items-center gap-2 w-full">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add Device
                </Button>
              </div>
            </div>
            {form.formState.errors.deviceName && (
              <p className="text-sm text-destructive">{form.formState.errors.deviceName.message}</p>
            )}
          </div>
        )}

        {/* Devices List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Active Devices ({devices.length})</h4>
            <Badge variant="outline">{devices.filter((d) => d.isTrusted).length} Trusted</Badge>
          </div>

          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-md text-blue-600">{getDeviceIcon(device.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{device.name}</h5>
                        {device.isCurrentDevice && <Badge variant="default">Current</Badge>}
                        {device.isTrusted ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Trusted
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Untrusted
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          {device.browser} • {device.os}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {device.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatLastActive(device.lastActive)}
                          </span>
                        </div>
                        <p>Added on {formatDate(device.addedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center gap-2">
                      {!device.isTrusted && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTrustDevice(device.id)}
                          disabled={isLoading}
                        >
                          Trust
                        </Button>
                      )}
                      {!device.isCurrentDevice && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveDevice(device.id)}
                          disabled={isLoading}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {devices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No devices registered yet</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Security Notice</p>
              <p className="text-yellow-700 mt-1">
                Only add devices you trust. Untrusted devices may require additional verification when logging in.
                Remove any devices you no longer use or recognize.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
