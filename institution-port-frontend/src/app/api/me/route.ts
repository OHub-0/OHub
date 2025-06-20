import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { parse } from "cookie";
import { serialize } from "cookie";
import { genAccessToken, genRefreshToken } from "@/utils/authtoken";

type Payload = {
  id: string
}

export async function GET(req: Request) {
  // Parse cookies from incoming headers
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);

  const accessToken = cookies.token;
  const refreshToken = cookies.refresh;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ message: "You are not logged in. Please login." }, { status: 401 });
  }

  try {
    // Verify access token
    const userPayload = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload & Payload;
    return NextResponse.json({ user: userPayload.id });
  } catch (err) {
    // If access token is invalid/expired, try refresh token
    try {
      const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as JwtPayload & Payload;


      // Set new access token cookie
      const response = NextResponse.json({ user: refreshPayload.id });
      const accessCookie = genAccessToken({ id: refreshPayload.id });
      response.headers.append("Set-Cookie", accessCookie);




      // Optionally refresh the refresh token if it's expiring soon (within 2 days)
      const expMs = (refreshPayload.exp ?? 0) * 1000;
      const now = Date.now();
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

      if (expMs - now < twoDaysMs) {
        const refreshCookie = genRefreshToken({ id: refreshPayload.id });
        response.headers.append("Set-Cookie", refreshCookie);
      }

      return response;
    } catch (refreshErr) {
      return NextResponse.json({ message: "Session Expired, Login Again." }, { status: 401 });
    }
  }
}
