import { type NextRequest } from "next/server"
import { checkTokenIsValid } from "@/utils/authtoken";
import { genApiResponse } from "@/utils/gen-api-response";
import { OtpTokenPayload } from "@/utils/types";

export async function POST(req: NextRequest) {
  const OTP_SECRET = process.env.OTP_SECRET
  const ACCESS_SECRET = process.env.ACCESS_SECRET
  try {
    //user authentication
    const user = checkTokenIsValid(req, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }


    //otp token verification

    const { id, type, value } = checkTokenIsValid(req, "otp-token", OTP_SECRET!) as OtpTokenPayload
    if (!id)
      return genApiResponse({
        code: "VERIFICATION_FAILED",
        message: "Please recieve and verify OTP. OTP verification is needed befor any change.",
        status: 401,
      })


    //if password:
    //store the value directly as password,its already in salted/hashed form;


    //NOTE: UNIQUESNESS WILL BE CHECKED BY ANOTHER API TOO BUT SHOULD STILL BE CHECKED HERE.
    // SAME EMAIL CAN BE VERIFIED BY MANY USERS SINCE MAIL IS NOT MAIN SOURCE OF 2FA
    // BUT PHONE NO SHOULD BE COMPLETELY UNIQIE


    if (type as any === 'moblie') {
      // Mock uniqueness check
      const takenPhones = ["+1111111111", "+9779746358434"]
      if (takenPhones.includes(value))
        return genApiResponse({
          code: "CONFLICT",
          message: "A account has already been registered using this phone no.",
          metaData: { errorField: "mobile" },
          status: 409,
        })
    }

    // In a real app, update the secure field in database
    // switch (type) {
    //   case 'email':
    //     await updateUserEmail(username, value)
    //     break
    //   case 'phone':
    //     await updateUserPhone(username, value)
    //     break
    //   case 'password':
    //     await updateUserPassword(username, value)
    //     break
    // }

    // Clear the OTP token
    const response = genApiResponse({
      code: "UPDATED",
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`,
      status: 200,
    })

    response.cookies.delete("otp-token")
    return response
  } catch (error) {
    return genApiResponse({
      code: "UPDATE_FAILED",
      message: "Sorry,Something went wrong in the server.",
      status: 500,
    })
  }
}

