import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkMe } from "./checkme";
import { toast } from "sonner";
import { useState } from "react";
import { ExploreFilters } from "@/components/explore/explore-content";

export type FollowingCredentials = {
  followId: string,
  follow: boolean,
  filter: ExploreFilters
}
type FollowMutationError = {
  _err: any,
  _vars: FollowingCredentials
  prev_data: any
  error_heading: 'Follow' | 'Unfollow'
}

export const useFollow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credential: FollowingCredentials) => followMutationFn('POST', credential),
    onSuccess: (message: string) => {
      toast.success(message);
    },
    onMutate: (credential: FollowingCredentials) => beforeFollowMutation(credential, queryClient),
    onError: (_err, _vars, prev_data) => handelFollowError({ _err, _vars, prev_data, error_heading: 'Follow' }, queryClient)
  });
}


export const useUnfollow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credential: FollowingCredentials) => followMutationFn('DELETE', credential),
    onSuccess: (message: string) => {
      toast.success(message);
    },
    onMutate: (credential: FollowingCredentials) => beforeFollowMutation(credential, queryClient),
    onError: (_err, _vars, prev_data) => handelFollowError({ _err, _vars, prev_data, error_heading: 'Unfollow' }, queryClient)
  });
}



function handelFollowError(data: FollowMutationError, queryClient: ReturnType<typeof useQueryClient>) {

  if (data.prev_data) {
    queryClient.setQueryData(["explore", data._vars.filter], data.prev_data)
  } else {
    //we messed up so lets invalidate this
    queryClient.invalidateQueries({ queryKey: ["explore", data._vars.filter] }) // fallback
  }
  toast.error(`Failed to ${data.error_heading}!`, {
    description: data._err.message,
  });
}

async function beforeFollowMutation(credential: FollowingCredentials, queryClient: ReturnType<typeof useQueryClient>) {

  await queryClient.cancelQueries({ queryKey: ["explore", credential.filter] })
  const previousData = queryClient.getQueryData(["explore", credential.filter])

  // Optimistically update
  queryClient.setQueryData(["explore", credential.filter], (old: any) => ({
    ...old,
    results: old.results.map((item: any) =>
      item.id === credential.followId ? { ...item, isFollowing: credential.follow } : item
    ),
  }))
  return previousData   //we returned this so we can turn back to this data if there is error in mutation
}

async function followMutationFn(type: "POST" | "DELETE", credentials: FollowingCredentials): Promise<string> {
  const res = await fetch('api/follow', {
    method: type,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })
  const responseJson = await res.json().catch(() => null);
  if (!res.ok) {
    const message = responseJson?.message || 'Something went wrong.';
    throw new Error(message);
  }
  return responseJson.message
}

