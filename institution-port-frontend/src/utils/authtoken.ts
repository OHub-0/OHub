import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export function genAccessToken(payload: { id: string }) {
  // Tokens
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '1800s' //30m
  });


  // Set cookies
  const accessCookie = serialize("token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 1800, // 30m
  });
  return accessCookie;

}
export function genRefreshToken(payload: { id: string }) {

  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!, {
    expiresIn: '1209600s', // 14d
  });
  const refreshCookie = serialize("refresh", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 1209600, // 14d
  });


  return refreshCookie;
}
