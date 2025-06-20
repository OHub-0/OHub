import { jwtVerify, SignJWT } from 'jose'; // jose is a better lib for Edge Functions
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('token')?.value;
  const refreshToken = req.cookies.get('refresh')?.value;
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  try {
    await jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_SECRET));
    // Access token is valid
    return NextResponse.next();
  } catch (e) {
    // Access token expired — check refresh
    try {
      const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.REFRESH_SECRET));

      // Issue new access token
      const newAccessToken = await new SignJWT({ id: payload.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30m')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

      const res = NextResponse.next();
      res.cookies.set('token', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        path: '/',
        maxAge: 1800, // 30m
      });

      //no refresh token renewal in middleware

      return res;
    } catch (err) {
      // ❌ Refresh token also invalid
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/(.*)',
    '/settings',
    '/settings/(.*)',
  ],
};
