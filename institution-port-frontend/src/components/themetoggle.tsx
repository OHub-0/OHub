"use client"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes"
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
export function ThemeToggle({ add_css_properties }: { add_css_properties?: string }) {
  const { theme, setTheme } = useTheme()
  return (
    <Button variant="outline" size="icon"
      className={cn("cursor-pointer p-3", add_css_properties)}
      onClick={() =>
        setTheme(theme === 'light' ? 'dark' : 'light')
      }
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}