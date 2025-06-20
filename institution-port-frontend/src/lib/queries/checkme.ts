import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type MeResponse = {
  user: string;
};

export const checkMe = () => {
  return useQuery<MeResponse>({
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
    staleTime: 1000 * 60 * 1, //fetches after 5 min
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,


  });
};
