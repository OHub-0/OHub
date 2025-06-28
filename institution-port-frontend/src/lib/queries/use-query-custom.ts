//for query

import { apiResponseHandler, handleApiError } from "@/utils/basic-utils";
import { SelfThrownError, SUCCESS_RESPONSE } from "@/utils/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";


interface UseQueryCustomParams {
  apiRoute: string;
  key: any;
  httpOnlyCookie?: boolean;
  enabled?: boolean;
  extraOptions?: Partial<UseQueryOptions<SUCCESS_RESPONSE, SelfThrownError, unknown>>;
}

// export function useQueryCustom({
//   apiRoute,
//   key,
//   httpOnlyCookie = false,
//   enabled = true,
//   extraOptions = {},
// }: UseQueryCustomParams) {
//   return useQuery<SUCCESS_RESPONSE, SelfThrownError, unknown>({
//     queryKey: ["user", key],
//     queryFn: async (): Promise<SUCCESS_RESPONSE> => {
//       try {
//         const fetchOptions: RequestInit = {
//           method: "GET",
//           ...(httpOnlyCookie && { credentials: "include" }),
//         };
//         const response = await fetch(apiRoute, fetchOptions);
//         return apiResponseHandler(response);
//       } catch (err: any) {
//         handleApiError(err, 'Failed to load data.')
//       }
//     },
//     enabled: enabled,
//     ...extraOptions,
//   });
// }
export function useQueryCustom({
  apiRoute,
  key,
  httpOnlyCookie = false,
  enabled = true,
  extraOptions = {},
}: {
  apiRoute: string;
  key: any;
  httpOnlyCookie?: boolean;
  enabled?: boolean;
  extraOptions?: Partial<UseQueryOptions<SUCCESS_RESPONSE>>;
}) {
  return useQuery<SUCCESS_RESPONSE>({
    queryKey: ["user", key],
    queryFn: async (): Promise<SUCCESS_RESPONSE> => {
      try {
        const fetchOptions: RequestInit = {
          method: "GET",
          ...(httpOnlyCookie && { credentials: "include" }),
        };
        const response = await fetch(apiRoute, fetchOptions);
        return apiResponseHandler(response);
      } catch (err: any) {
        handleApiError(err, "Failed to load data.");
      }
    },
    enabled,
    ...extraOptions,
  });
}