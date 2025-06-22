import { ExploreFilters, ExploreMode, ExploreResponse } from "@/components/explore/explore-content"
import { setQueryParams } from "@/utils/basic-utils"
import { useQuery } from "@tanstack/react-query"

export const useExploreFilterQuery = (mode: ExploreMode) => useQuery({
  queryKey: ["filters", mode],
  queryFn: async () => {
    const response = await fetch(`/api/filters/${mode.toLowerCase()}`)
    return response.json()
  },
  meta: { persist: true }
})

export const useExploreQuery = (filters: ExploreFilters) => useQuery<ExploreResponse, Error>({
  queryKey: ["explore", filters],
  queryFn: () => fetchExploreData(filters),
  keepPreviousData: true

} as any)


export async function fetchExploreData(filters: ExploreFilters) {
  const params = setQueryParams(filters)

  const response = await fetch(`/api/explore?${params.toString()}`, {
    credentials: 'include',
  })
  if (!response.ok) throw new Error("Failed to fetch data")
  return response.json()
}