"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { User, Mail, Phone, Lock, Monitor, Shield, Download, Activity, GraduationCap } from "lucide-react"

interface SettingsSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const settingsSections = [
  {
    title: "Profile",
    items: [
      { id: "personal", label: "Personal Information", icon: User },
      { id: "education", label: "Educational Details", icon: GraduationCap },
    ],
  },
  {
    title: "Security",
    items: [
      { id: "password", label: "Password", icon: Lock },
      { id: "email", label: "Email Management", icon: Mail },
      { id: "phone", label: "Phone Management", icon: Phone },
      { id: "sessions", label: "Sessions & Devices", icon: Monitor },
      { id: "privacy", label: "Privacy Settings", icon: Shield },
    ],
  },
  {
    title: "Data",
    items: [
      { id: "activity", label: "Activity Timeline", icon: Activity },
      { id: "backup", label: "Account Backup", icon: Download },
    ],
  },
]

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Account Settings</h2>
      </SidebarHeader>
      <SidebarContent>
        {settingsSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
