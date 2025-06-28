import { NextRequest, NextResponse } from "next/server";
import { checkTokenIsValid, genToken } from "@/utils/authtoken";
import { genApiResponse } from "@/utils/gen-api-response"
import { v4 as _uuidv4, UUIDTypes } from 'uuid'



const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET



export async function GET(req: NextRequest) {
  function successfulAuth(userDetails: { user: string, id: UUIDTypes }) {
    return genApiResponse({
      code: "AUTH_SUCCESS",
      message: "You are authenticated successfully.",
      data: userDetails,
      status: 200,
    })
  }
  try {
    //otp token verification
    const accessTokenPayload = checkTokenIsValid(req, "access-token", ACCESS_SECRET!)
    const refreshTokenPayload = checkTokenIsValid(req, "refresh-token", ACCESS_SECRET!)
    if (accessTokenPayload) return successfulAuth({ user: accessTokenPayload.user as any, id: accessTokenPayload.id })
    if (refreshTokenPayload) {
      //get the user's unique immutable id
      const uuid = _uuidv4();
      const user = refreshTokenPayload.user as any
      const accessCookie = genToken({ user: user, id: uuid }, "access-token", 18000, ACCESS_SECRET!);
      const response = successfulAuth({ user: user, id: refreshTokenPayload.id })
      response.headers.append("Set-Cookie", accessCookie);
      // Optionally refresh the refresh token if it's expiring soon (within 2 days)
      const expMs = (refreshTokenPayload.exp ?? 0) * 1000;
      const now = Date.now();
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
      if (expMs - now < twoDaysMs) {
        const refreshCookie = genToken({ user: user, id: uuid }, "refresh-token", 1209600, REFRESH_SECRET!);
        response.headers.append("Set-Cookie", refreshCookie);
      }
      return response
    }
    //failed
    return genApiResponse({
      code: "AUTH_FAILED",
      message: "You are Unauthenticated, Please Login.",
      status: 401,
    })

  } catch (err) {
    return genApiResponse({
      code: "AUTH_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}

