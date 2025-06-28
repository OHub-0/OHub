import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { apiResponseHandler, handleApiError } from '@/utils/basic-utils';
import { SUCCESS_RESPONSE } from '@/utils/types';
import { useMutationCustom } from './use-muation-custom';
import { passwordSchemaType } from '../validation/common-validation';



export type LoginCredentials = {
  id: string,
  password: passwordSchemaType
  type: 'username' | 'mobile'
}


export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutationCustom<LoginCredentials>({
    apiRoute: '/api/login',
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: 'Logout Failed.',
    successFallbackMsg: "Logged out successfully.",
    onSuccessSideEffect: async () => {
      await queryClient.refetchQueries({ queryKey: ['me'], exact: true }); // refetches immediately
      router.push('/dashboard');
    }
  });
}