import { ExploreFilters, ExploreMode, ExploreResponse } from "@/components/explore/explore-content"
import { apiResponseHandler, setQueryParams } from "@/utils/basic-utils"
import { useQuery } from "@tanstack/react-query"
import { useQueryCustom } from "./use-query-custom"
import { SUCCESS_RESPONSE } from "@/utils/types";


export function useExploreFilterQuery(mode: ExploreMode) {
  return useQueryCustom({
    apiRoute: `/api/filters/${mode.toLowerCase()}`,
    key: ["filters", mode],
    enabled: !!mode,
    extraOptions: { meta: { persist: true } }
  });
}

export function useExploreQuery(filters: ExploreFilters) {
  const params = setQueryParams(filters)
  return useQueryCustom({
    apiRoute: `/api/explore?${params.toString()}`,
    key: ["explore", filters],
    httpOnlyCookie: true,
    enabled: !!filters,
    extraOptions: { placeholderData: (previousData) => previousData, }
  });
}

