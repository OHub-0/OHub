import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkMe } from "./use-checkme";
import { toast } from "sonner";
import { useState } from "react";
import { ExploreFilters } from "@/components/explore/explore-content";
import { apiResponseHandler, handleApiError } from "@/utils/basic-utils";
import { SUCCESS_API_RESPONSE, SUCCESS_RESPONSE } from "@/utils/types";
import { useMutationCustom } from "./use-muation-custom";

export type FollowingCredentials = {
  followId: string,
  follow: boolean,
  filter: ExploreFilters
}
type FollowMutationError = {
  err: any,
  vars: FollowingCredentials
  context: any
}


export const useFollow = () => {
  const queryClient = useQueryClient()
  return useMutationCustom<FollowingCredentials>({
    getMethodFromData: (data) => data.follow ? "POST" : "DELETE",
    apiRoute: 'api/follow',
    httpOnlyCookie: true,
    errorFallbackMsg: 'Action Failed.',
    successFallbackMsg: 'Action Successful.',
    onMutateCustom: async (credential: FollowingCredentials) => await beforeFollowMutation(credential, queryClient),
    onErrorSideEffect: (err, vars, context) => handelFollowError({ err, vars, context }, queryClient),
    extraOptions: { retry: false }
  })
}






async function beforeFollowMutation(credential: FollowingCredentials, queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.cancelQueries({ queryKey: ["explore", credential.filter] })
  const previousData = queryClient.getQueryData(["explore", credential.filter])
  // Optimistically update
  queryClient.setQueryData(["explore", credential.filter], (old: any) => ({
    ...old,
    data: {
      ...old.data,
      results: old.data.results.map((item: any) =>
        item.id === credential.followId ? { ...item, isFollowing: credential.follow } : item
      )
    },
  }))
  return previousData   //we returned this so we can turn back to this data if there is error in mutation
}


function handelFollowError(data: FollowMutationError, queryClient: ReturnType<typeof useQueryClient>) {
  //reverting the optimistic update
  if (data.context)
    queryClient.setQueryData(["explore", data.vars.filter], data.context)
  //we messed up so lets invalidate this // fallback
  else

    queryClient.invalidateQueries({ queryKey: ["explore", data.vars.filter] })
}

