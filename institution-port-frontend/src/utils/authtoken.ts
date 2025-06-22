import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";
import { NextRequest } from "next/server";

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET


export function genAccessToken(payload: { id: string }) {
  // Tokens
  const accessToken = jwt.sign(payload, ACCESS_SECRET!, {
    expiresIn: '1800s' //30m
  });


  // Set cookies
  const accessCookie = serialize("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    path: "/",
    maxAge: 1800, // 30m
  });
  return accessCookie;

}
export function genRefreshToken(payload: { id: string }) {

  const refreshToken = jwt.sign(payload, REFRESH_SECRET!, {
    expiresIn: '1209600s', // 14d
  });
  const refreshCookie = serialize("refresh", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    path: "/",
    maxAge: 1209600, // 14d
  });


  return refreshCookie;
}



export function checkUserIsValid(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie")
    if (!cookieHeader) return null

    const cookies = parse(cookieHeader)
    const token = cookies["token"]
    if (!token) return null

    const decoded = jwt.verify(token, ACCESS_SECRET!)
    return decoded // should include user id, username, etc.
  } catch (err) {
    return null
  }
}