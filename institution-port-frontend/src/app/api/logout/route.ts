import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Clear cookies
  const clearToken = serialize("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  const clearRefresh = serialize("refresh", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  const res = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

  // Set separate Set-Cookie headers
  res.headers.append("Set-Cookie", clearToken);
  res.headers.append("Set-Cookie", clearRefresh);

  return res;
}
