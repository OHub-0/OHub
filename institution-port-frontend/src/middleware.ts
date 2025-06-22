import { jwtVerify, SignJWT } from 'jose'; // jose is a better lib for Edge Functions
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('token')?.value;
  const refreshToken = req.cookies.get('refresh')?.value;

  try {
    if (!accessToken) throw new Error('Access Token Not Found');
    await jwtVerify(accessToken, new TextEncoder().encode(process.env.ACCESS_SECRET));
    // Access token is valid
    return NextResponse.next();
  } catch (e) {
    // Access token expired — check refresh
    try {
      if (!refreshToken) throw new Error('Refresh Token Not Found');
      const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(process.env.REFRESH_SECRET));

      // Issue new access token
      const newAccessToken = await new SignJWT({ id: payload.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30m')
        .sign(new TextEncoder().encode(process.env.ACCESS_SECRET));

      const res = NextResponse.next();
      res.cookies.set('token', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 1800, // 30m
      });

      // Optionally refresh the refresh token if it's expiring soon (within 2 days)
      const expMs = (payload.exp ?? 0) * 1000;
      const now = Date.now();
      const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

      if (expMs - now < twoDaysMs) {
        const newRefreshCookie = await new SignJWT({ id: payload.id })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('14d')
          .sign(new TextEncoder().encode(process.env.REFRESH_SECRET));
        res.cookies.set('refresh', newAccessToken, {
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 1800, // 30m
        });
      }

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
