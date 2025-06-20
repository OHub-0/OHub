// // --- lib/api.ts ---

// export function useInitialDataExplore() {
//   return useQuery({
//     queryKey: ["initialDataExplore"],
//     queryFn: fetchInitialDataExplore,
//   })
// }



// export async function fetchInstitutions(filters: Record<string, any>) {
//   const params = new URLSearchParams()
//   for (const [key, value] of Object.entries(filters)) {
//     if (value && value !== "All") {
//       if (Array.isArray(value)) {
//         params.append(key, value.join(","))
//       } else {
//         params.append(key, value)
//       }
//     }
//   }
//   const res = await fetch(`/api/explore?${params.toString()}`)
//   if (!res.ok) throw new Error("Failed to fetch institutions")
//   return res.json()
// }

// export async function fetchCitiesByNation(nation: string) {
//   const res = await fetch("/api/explore", {
//     method: "POST",
//     body: JSON.stringify({ nation }),
//     headers: { "Content-Type": "application/json" },
//   })
//   if (!res.ok) throw new Error("Failed to fetch cities")
//   return res.json()
// }

// export async function fetchInitialDataExplore() {
//   const res = await fetch("/api/explore?type=instituteTypes")
//   if (!res.ok) throw new Error("Failed to fetch types")
//   return res.json()
// }
