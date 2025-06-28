import { QueryClient, useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import type { SettingsFormData, passwordChangeSchemaType } from "@/lib/validation/settings-validation"
import type { avatarUrlSchemaType, citySchemaType, countrySchemaType, dateOfBirthSchemaType, educationSchemaType, officialNameType, OtpVerificationData, usernameSchemaType } from "@/lib/validation/common-validation"
import { apiResponseHandler, handleApiError } from "@/utils/basic-utils"
import { SUCCESS_RESPONSE } from "@/utils/types"
import { toast } from "sonner"
import { useMutationCustom } from "./use-muation-custom"
import { useQueryCustom } from "./use-query-custom"

type basicInfoUser = {
  officialName?: officialNameType
  username?: usernameSchemaType,
  avatarUrl?: avatarUrlSchemaType,
  dateOfBirth?: dateOfBirthSchemaType
  city?: citySchemaType,
  country?: countrySchemaType
}
type privacyUser = {
  showEmail?: boolean,
  showPhone?: boolean,
  showLocation?: boolean,
  allowSearchEngines?: boolean,
  dataCollection?: boolean,
  marketingEmails?: boolean,
  securityNotifications?: boolean,
}
export type UpdataUserPrivateData = {
  basicInfo?: basicInfoUser,
  password?: passwordChangeSchemaType
  education?: educationSchemaType
  privacy?: privacyUser
}
type ChangeUserSensitiveData = {
  type: 'mobile' | 'email' | 'password',
  value: string,
};



// Fetch user public data
export function useUserPublicData(username: string) {
  return useQueryCustom({
    apiRoute: `/api/user/${username}`,
    key: ["user-public", username],
    httpOnlyCookie: false,
    enabled: !!username
  });
}


// Fetch user private data
export function useUserPrivateData(username: string) {
  return useQueryCustom({
    apiRoute: `/api/user/${username}/personal`,
    key: ["user-private", username],
    httpOnlyCookie: true,
    enabled: !!username,
    extraOptions: { placeholderData: (previousData) => previousData }
  });
}


// Update user settings
export function useUpdateUserPrivateData(username: string) {
  const queryClient = useQueryClient()
  return useMutationCustom<UpdataUserPrivateData>({
    apiRoute: `/api/user/${username}/personal`,
    method: "PATCH",
    httpOnlyCookie: true,
    errorFallbackMsg: "Failed to update user's private info.",
    successFallbackMsg: "User's private info updated successfully.",
    onSuccessSideEffect: async () => {
      // await queryClient.invalidateQueries({ queryKey: ["me"] }) //this will not refect if staletime is big or reconnectonmount or ....
      await queryClient.refetchQueries({ queryKey: ["me"], exact: true });
      await queryClient.invalidateQueries({ queryKey: ["user-private", username] }) //this will refect cuz not much is defined
    }
  });
}


// Update password/email/phone
export function useUpdateUserSensitiveData(username: string) {
  return useMutationCustom<ChangeUserSensitiveData>({
    apiRoute: `/api/user/${username}/change-secure`,
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: "Failed to update the info.",
    successFallbackMsg: "User's info updated successfully.",
  });
}

