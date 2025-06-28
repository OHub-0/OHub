'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiResponseHandler, handleApiError } from '@/utils/basic-utils';
import { SUCCESS_RESPONSE } from '@/utils/types';
import { useMutationCustom } from './use-muation-custom';


export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutationCustom({
    apiRoute: '/api/logout',
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: 'Logout Failed.',
    successFallbackMsg: "Logged out successfully.",
    onSuccessSideEffect: async () => {
      //sets the value to null, no need to call this me api
      queryClient.setQueryData(['me'], null);
      router.push('/login')
    }
  });
}