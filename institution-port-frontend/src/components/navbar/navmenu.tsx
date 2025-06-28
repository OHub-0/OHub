'use client'

import { Settings, LogOut, Monitor, Sun, Moon, School, Earth, LogIn, UserPlus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useLogoutMutation } from "@/lib/queries/use-logout"
import { checkMe } from "@/lib/queries/use-checkme"

export function NavMenu() {
  const { data, status } = checkMe();
  const { setTheme } = useTheme()
  const logoutMutation = useLogoutMutation()

  const isLoggedIn = !!data?.user && status !== 'error';

  const getUserInitial = (username: string) => {
    return username.charAt(0).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoggedIn ? (
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitial(data?.user)}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="shrink-0 cursor-pointer">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end" forceMount>
        {isLoggedIn &&
          <>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{data?.user}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        }

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Monitor className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-32">
            <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {isLoggedIn ? (
          <>
            <DropdownMenuSeparator className="md:hidden" />
            <DropdownMenuItem className="cursor-pointer md:hidden" asChild>
              <Link href="/dashboard">
                <School className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="cursor-pointer text-red-500 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </>
        )
          :
          (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="flex items-center cursor-pointer gap-2">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup" className="flex items-center cursor-pointer gap-2">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </DropdownMenuItem>
            </>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
