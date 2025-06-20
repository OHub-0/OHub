'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export const useLogoutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message || 'Something went wrong.';
        throw new Error(message);
      }
      return res.json()
    },
    onSuccess: async (data) => {
      toast.success(data.message)
      //sets the value to null, no need to call this me api
      queryClient.setQueryData(['me'], null);
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error('Logout failed', {
        description: error.message,
      })
    },
  })
};
