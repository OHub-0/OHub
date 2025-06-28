import { useMutation } from "@tanstack/react-query";
import { OtpVerificationData } from "../validation/common-validation";
import { useMutationCustom } from "./use-muation-custom";


type OTPSend = {
  type: "email" | "mobile";
  value: string;
}
// Send OTP
export function useSendOtp() {
  return useMutationCustom<OTPSend>({
    apiRoute: "/api/otp/send",
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: "Failed to send the OTP.",
    successFallbackMsg: "OTP sent successfully.",
  }
  );
}
// Verify OTP
export function useVerifyOtp() {
  return useMutationCustom<OtpVerificationData>({
    apiRoute: "/api/otp/verify",
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: "Failed to verify the OTP.",
    successFallbackMsg: "OTP verified successfully.",
  }
  );
}



