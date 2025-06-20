// import type { ReadonlyURLSearchParams } from "next/navigation"

// export function setQueryParams(
//   searchParams: ReadonlyURLSearchParams,
//   params: Record<string, string | number | boolean | null | undefined>,
// ): URLSearchParams {
//   const newSearchParams = new URLSearchParams(searchParams.toString())

//   Object.entries(params).forEach(([key, value]) => {
//     if (value === null || value === undefined || value === "") {
//       newSearchParams.delete(key)
//     } else {
//       newSearchParams.set(key, String(value))
//     }
//   })

//   return newSearchParams
// }

// export function getQueryParam(searchParams: ReadonlyURLSearchParams, key: string, defaultValue = ""): string {
//   const value = searchParams.get(key)
//   return value ?? defaultValue
// }

// export function getNumberQueryParam(searchParams: ReadonlyURLSearchParams, key: string, defaultValue: number): number {
//   const value = searchParams.get(key)
//   return value ? Number(value) : defaultValue
// }

// export function getArrayQueryParam(searchParams: ReadonlyURLSearchParams, key: string): string[] {
//   const value = searchParams.get(key)
//   return value ? value.split(",").filter(Boolean) : []
// }
