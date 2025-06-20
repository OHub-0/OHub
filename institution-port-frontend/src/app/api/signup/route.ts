import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { SignUpCredentials } from "@/lib/queries/signup";
import { genAccessToken, genRefreshToken } from "@/utils/authtoken";



export async function POST(req: Request) {
  const credentials: SignUpCredentials = await req.json();

  // signup db work here (replace with DB entry)

  const accessCookie = genAccessToken({ id: credentials.username });
  const refreshCookie = genRefreshToken({ id: credentials.username });

  const res = NextResponse.json({ message: "Signed In Successfully" }, { status: 200 });
  res.headers.append("Set-Cookie", accessCookie);
  res.headers.append("Set-Cookie", refreshCookie);


  return res;
}
