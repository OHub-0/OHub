import { useQueryCustom } from './use-query-custom';

export function checkMe() {
  return useQueryCustom({
    apiRoute: '/api/me',
    key: ["me"],
    httpOnlyCookie: true,
    extraOptions: {
      //if success then stale time is 5 min or if error stale time is 0s
      staleTime: 1000 * 60 * 5,        // 5 min: marks data as fresh
      // in case of error, gcTime is how long cache remains after it becomes stale (or after error), before it gets garbage collected.
      gcTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 5,  // ✅ Forces refetch every 5 min
      refetchIntervalInBackground: true, // Even when window not focused
      refetchOnWindowFocus: false,    //  Optional: disable extra refetch
      refetchOnReconnect: false,      //  Optional: disable extra refetch
      refetchOnMount: false,          //  No remount refetch
      retry: false,
      placeholderData: (previousData) => previousData,
    }
  });
}

