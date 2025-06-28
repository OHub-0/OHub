'use client'

import { clsx, type ClassValue } from "clsx"
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge"
import { ERROR_API_RESPONSE, SelfThrownError, SUCCESS_API_RESPONSE, SUCCESS_RESPONSE } from "./types";
import { toast } from "sonner";

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



export async function apiResponseHandler(res: Response): Promise<SUCCESS_RESPONSE> {
  const body = await res.json()
  if (!res.ok || body.error) {
    throw {
      name: 'SelfThrownError',
      message: body.error?.message ?? 'Something went wrong',
      code: body.error?.code ?? 'UNKNOWN_ERROR',
      metaData: body.error?.metaData ?? null,
      status: res.status,
    } satisfies SelfThrownError
  }

  return body.success
}
export function isSelfThrownApiError(error: unknown): error is SelfThrownError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as any).name === 'SelfThrownError' &&
    'code' in error &&
    'message' in error &&
    'status' in error
  )
}
export function handleApiError(err: any, fallback = "Sorry, something went wrong"): never {
  if (isSelfThrownApiError(err)) {
    toast.error(err.message || fallback)
    console.error(`[${err.status}] ${err.code}:`, err.metaData)
    throw err;
  }
  //if not api error, we will create our own error to thrown so we can use it properly in frontend
  if (err instanceof Error) {
    toast.error(fallback)
    console.error("Unknown error:", err.message)
    throw {
      name: "SelfThrownError",
      message: "Unkonwn Error",
      code: "UNKNOWN_ERROR",
      metaData: null,
      status: 500
    } satisfies SelfThrownError;
  }
  toast.error(fallback)
  console.error("Unrecognized error:", err)
  throw {
    name: "SelfThrownError",
    message: "Unhandled error",
    code: "UNKNOWN_ERROR",
    metaData: null,
    status: 500
  } satisfies SelfThrownError;
}
