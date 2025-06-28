import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from "@/utils/types";
import { genApiResponse } from "@/utils/gen-api-response"


export async function POST() {
  // Clear cookies
  try {
    const clearToken = serialize("access-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const clearRefresh = serialize("refresh-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const res = genApiResponse({
      code: "LOGGED_OUT",
      message: "Logged out successfully",
      status: 200,
    })

    // Set separate Set-Cookie headers
    res.headers.append("Set-Cookie", clearToken);
    res.headers.append("Set-Cookie", clearRefresh);

    return res;
  } catch (err) {
    return genApiResponse({
      code: "LOGOUT_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}