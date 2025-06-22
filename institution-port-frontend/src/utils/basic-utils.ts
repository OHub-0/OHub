import { clsx, type ClassValue } from "clsx"
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const inputStyles = cn(
  "bg-custominput1 text-input-foreground border border-border placeholder-muted-foreground",
  "dark:bg-custominput1 dark:text-input-foreground"
);
export const loginFormInputStyles = cn(
  "h-12 border-0 bg-custominput1 text-input-foreground border border-border placeholder-muted-foreground",
  "dark:bg-custominput1 dark:text-input-foreground"
)

export function capitalizeSentence(sentence: string): string {
  return sentence
    .split(" ")
    .map((word) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ");
}

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}



export function setQueryParams(
  params: Record<any, any>,
): URLSearchParams {
  const newSearchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0) newSearchParams.set(key, value.join(","));
      } else {
        newSearchParams.set(key, value.toString());
      }
    }
  })

  return newSearchParams
}
