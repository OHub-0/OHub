import jwt, { JwtPayload } from "jsonwebtoken";
import { parse, serialize } from "cookie";
import { NextRequest } from "next/server";
import { OtpTokenPayload, SessionTokenPayload } from "./types";




export function genToken(payload: SessionTokenPayload | OtpTokenPayload, name: string, time: number, secret: string) {
  // Tokens
  const token = jwt.sign(payload, secret, {
    expiresIn: time
  });


  // Set cookies
  const cookie = serialize(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "strict",
    path: "/",
    maxAge: time,
  });
  return cookie;

}



export function checkTokenIsValid(req: NextRequest, tokenName: string, secret: string): null | OtpTokenPayload | SessionTokenPayload {
  try {
    const cookieHeader = req.headers.get("cookie")
    if (!cookieHeader) return null

    const cookies = parse(cookieHeader)
    const token = cookies[tokenName]
    if (!token) return null

    const decoded = jwt.verify(token, secret) //this gives new Error or a payload{}
    return decoded as OtpTokenPayload | SessionTokenPayload // should include user id, username, etc.
  } catch (err) {
    return null
  }
}