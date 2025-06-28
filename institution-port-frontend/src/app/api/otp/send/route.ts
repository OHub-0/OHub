import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from "@/utils/types"
import { type NextRequest, NextResponse } from "next/server"

const ACCESS_SECRET = process.env.ACCESS_SECRET


export async function POST(request: NextRequest) {
  try {
    const user = checkTokenIsValid(request, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }

    const { type, value } = await request.json()


    // In a real app, generate and send OTP via email/SMS service
    // const otp = generateOTP()
    //
    // switch (type) {
    //   case 'email':
    //     await sendEmailOTP(value, otp)
    //     break
    //   case 'phone'|'password':
    //     await sendSMSOTP(value, otp)
    //     break
    // }
    //rate limit the api with 1 user can request 5/10 times in 1hr

    return genApiResponse({
      code: "SENT",
      message: `OTP sent successfully to ${value}`,
      metaData: { updatedAt: new Date().toISOString() },
      status: 200,
    })

  } catch (error) {
    return genApiResponse({
      code: "SENDING_FAILED",
      message: "Sorry, faild to send the otp. Server Error.",
      status: 500,
    })
  }
}
