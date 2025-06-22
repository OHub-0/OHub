import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLoginMutation } from './login';

type MeResponse = {
  user: string;
};

export const checkMe = () => {
  return useQuery<MeResponse, Error, MeResponse, any[]>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me', {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message || 'Authentication Failed';
        throw new Error(message);
      }

      return res.json(); // { user: ... }
    },
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
  });
};
