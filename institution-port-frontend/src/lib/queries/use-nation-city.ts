import { setQueryParams } from "@/utils/basic-utils"

import { useQueryCustom } from "./use-query-custom"
import { SUCCESS_API_RESPONSE, SUCCESS_RESPONSE } from "@/utils/types"
type NationQueryParams =
  {
    code: "true" | "false",
    flag: "true" | "false"
  }

export function useNationQuery(nation_query_params: NationQueryParams) {
  const params = setQueryParams(nation_query_params)
  return useQueryCustom({
    apiRoute: `/api/nations?${params.toString()}`,
    key: ["nations", nation_query_params],
    httpOnlyCookie: false,
    enabled: !!nation_query_params,
    extraOptions: { meta: { persist: true } }
  });
}

export function useCityQuery(nation: string | undefined) {
  return useQueryCustom({
    apiRoute: `/api/city?nation=${encodeURIComponent(nation!)}`,
    key: ["cities", nation],
    enabled: !!nation
  });
}