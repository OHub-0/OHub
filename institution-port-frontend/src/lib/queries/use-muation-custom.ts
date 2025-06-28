import { apiResponseHandler, handleApiError, isSelfThrownApiError } from "@/utils/basic-utils";
import { SelfThrownError, SUCCESS_RESPONSE } from "@/utils/types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

type HttpMethodMutation = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// interface MutationCustomParams<TInput> {
//   apiRoute: string;
//   method?: HttpMethodMutation;
//   getMethodFromData?: (data: TInput) => HttpMethodMutation;
//   httpOnlyCookie?: boolean;
//   errorFallbackMsg?: string;
//   successFallbackMsg?: string;
//   onSuccessCustom?: () => void;
//   onErrorCustom?: (err: any, vars: TInput, prev_data: any) => void;
//   onMutateCustom?: (data: TInput) => any;
//   extraOptions?: Partial<UseMutationOptions<SUCCESS_RESPONSE, unknown>>;
// }
interface MutationCustomParams<TInput, TContext = any> {
  apiRoute: string;
  method?: HttpMethodMutation;
  getMethodFromData?: (data: TInput) => HttpMethodMutation;
  httpOnlyCookie?: boolean;
  errorFallbackMsg?: string;
  successFallbackMsg?: string;
  onSuccessSideEffect?: () => void;
  onErrorSideEffect?: (err: SelfThrownError, vars: TInput, context: TContext) => void;
  onMutateCustom?: (data: TInput) => TContext;
  extraOptions?: Partial<UseMutationOptions<SUCCESS_RESPONSE, SelfThrownError, TInput, TContext>>;
}

export function useMutationCustom<TInput>({
  apiRoute,
  method = "POST",
  getMethodFromData,
  httpOnlyCookie = false,
  errorFallbackMsg = "Something went wrong.",
  successFallbackMsg = "Request successful.",
  onSuccessSideEffect,
  onErrorSideEffect,
  onMutateCustom,
  extraOptions = {},
}: MutationCustomParams<TInput>) {
  return useMutation<SUCCESS_RESPONSE, SelfThrownError, TInput>({
    mutationFn: async (data: TInput | undefined): Promise<SUCCESS_RESPONSE> => {
      try {
        const selectedMethod = getMethodFromData && data ? getMethodFromData(data) : method;
        const fetchOptions: RequestInit = {
          method: selectedMethod,
          headers: {
            "Content-Type": "application/json"
          },
          ...(data && { body: JSON.stringify(data) }),
          ...(httpOnlyCookie && { credentials: "include" })
        };

        const response = await fetch(apiRoute, fetchOptions);
        return apiResponseHandler(response);

      } catch (err: any) {
        handleApiError(err, errorFallbackMsg)
      }
    },


    onSuccess: (success: SUCCESS_RESPONSE) => {
      toast.success(success.message ?? successFallbackMsg);
      if (onSuccessSideEffect) onSuccessSideEffect()
    },
    onMutate: (data: TInput) => onMutateCustom ? onMutateCustom(data) : undefined,
    onError: (err, vars, context) => {
      if (onErrorSideEffect) onErrorSideEffect(err, vars, context);
    },
    ...extraOptions


  });
}

