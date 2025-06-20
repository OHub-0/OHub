import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { genAccessToken, genRefreshToken } from "@/utils/authtoken";


export async function POST(req: Request) {
  const { id, password, type } = await req.json();

  // Basic dummy check (replace with DB validation)
  const validUsername = type === "username" && id === "sworup";
  const validMobile = type === "mobile" && id === "+9779842467080";
  const validPassword = password === "Sworup!@#1";

  if (!(validPassword && (validUsername || validMobile))) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const accessCookie = genAccessToken({ id: id });
  const refreshCookie = genRefreshToken({ id: id });

  const res = NextResponse.json({ message: "Logged In Successfully" }, { status: 200 });
  res.headers.append("Set-Cookie", accessCookie);
  res.headers.append("Set-Cookie", refreshCookie);


  return res;
}
