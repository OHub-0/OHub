
import { apiResponseHandler, handleApiError } from "@/utils/basic-utils";
import { SUCCESS_RESPONSE } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { useMutationCustom } from "./use-muation-custom";
import { countrySchemaType, mobileSchemaType, officialNameType, passwordSchemaType, usernameSchemaType } from "../validation/common-validation";

export type SignUpCredentials = {
  officialName: officialNameType
  username: usernameSchemaType;
  country: countrySchemaType;
  mobile: string;
  password: passwordSchemaType;
}



function onSignUpSuccessCallback() {
  const queryClient = useQueryClient();
  const router = useRouter();
  async () => {
    await queryClient.refetchQueries({ queryKey: ["me"], exact: true });
    router.push('/dashboard');
  }
}
export function useSignUpMutation() {
  return useMutationCustom<SignUpCredentials>({
    apiRoute: '/api/signup',
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: 'SignUp Failed.',
    successFallbackMsg: "Signed Up Successfully.",
    onSuccessSideEffect: onSignUpSuccessCallback
  });
}