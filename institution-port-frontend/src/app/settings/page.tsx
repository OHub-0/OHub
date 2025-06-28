"use client"

export const dynamic = 'force-dynamic';


import { SettingsPage } from "@/components/settings/settings-page"
import { checkMe } from "@/lib/queries/use-checkme";
import { Suspense } from "react";

export default function Settings() {
  // In a real app, you'd get the username from auth context or session
  const { data } = checkMe();

  return (data && data.user ? <SettingsPage username={data.user} /> : <p>Loading...</p>)
}
