import { useMutation } from "@tanstack/react-query";
import { mobileSchemaType, usernameSchemaType } from "../validation/common-validation";
import { useQueryCustom } from "./use-query-custom";


type CheckUniqueness = {
  username?: usernameSchemaType
  mobile?: string
}

// Check uniqueness
export function useCheckUniqueness(params: CheckUniqueness) {
  return useQueryCustom({
    apiRoute: `/api/check-uniqueness?${new URLSearchParams(params).toString()}`,
    key: ["check-uniqueness", params],
    httpOnlyCookie: false,
    enabled: !!(params.username || params.mobile)
  });
}