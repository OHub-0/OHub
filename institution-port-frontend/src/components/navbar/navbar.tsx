"use client"
import Link from "next/link"
import { Earth, Menu, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "./themetoggle"
import { NavMenu } from "./navmenu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { checkMe } from "@/lib/queries/checkme"

export function Navbar() {
  const { data, status } = checkMe();
  const isLoggedIn = !!data?.user && status !== 'error'; // avoid rendering stale login UI



  return (

    <header className="w-full border-b bg-background flex h-16 items-center px-4 sm:px-8">
      {/* Logo */}
      <div className="mr-4 flex items-center">
        <Link href="/" className="flex items-center space-x-1">
          <div className="flex h-9 w-8 items-center justify-center rounded-sm bg-black text-white dark:text-black dark:bg-white">
            <span className="text-xl font-bold">I</span>
          </div>
          <span className="hidden font-bold sm:inline-block">nstitutionPort</span>
        </Link>
      </div>

      {/* Search bar - hidden on mobile */}
      <div className="hidden flex-1 px-4 md:block">
        <div className="relative w-full max-w-md">
          <Input type="search" placeholder="Search" className="w-full bg-muted/30 focus-visible:ring-0" />
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="ml-auto hidden items-center space-x-4 md:flex">
        <Button variant="ghost" asChild>
          <Link href="/explore">Explore</Link>
        </Button>

        {!isLoggedIn &&
          <>
            <Button variant="outline" asChild>
              <Link prefetch={true} href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link prefetch={true} href="/signup">Sign Up</Link>
            </Button>
            <ThemeToggle />
          </>
        }
        {/* If logged in */}
        {isLoggedIn &&
          <>
            <Button variant="ghost" asChild>
              <Link prefetch={false} href="/dashboard">Dashboard</Link>
            </Button>
            <NavMenu></NavMenu>
          </>
        }
      </nav>

      {/* Mobile Navigation */}
      <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
        <Input type="search" placeholder="Search" className="h- w-full bg-muted/30 focus-visible:ring-0" />

        <Link href="/explore">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="w-9">
                  <Earth />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Explore</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>

        <NavMenu></NavMenu>

      </div>
    </header>
  )
}
