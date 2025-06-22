import { setQueryParams } from "@/utils/basic-utils"
import { useQuery } from "@tanstack/react-query"
type NationQueryParams =
  {
    code: "true" | "false",
    flag: "true" | "false"
  }
export type NationApiRespose = {
  name: string,
  code?: string,
  flag?: string
}
export const useNationQuery = (query_params: NationQueryParams) => useQuery<NationApiRespose[] | string[]>({
  queryKey: ["nations", query_params],
  queryFn: async () => {
    const params = setQueryParams(query_params)
    const response = await fetch(`/api/nations?${params.toString()}`)
    const data = await response.json()
    return data
  },
  meta: { persist: true }
})

export const useCityQuery = (nation: string | undefined) => useQuery<string[]>({
  queryKey: ["cities", nation],
  queryFn: async () => {
    if (!nation) return []
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: nation
      }),
    })
    const { data } = await response.json()
    return data
  },
  enabled: !!nation,
})
