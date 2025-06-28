import { FollowingCredentials } from '@/lib/queries/use-follow';
import { checkTokenIsValid } from '@/utils/authtoken';
import { NextRequest, NextResponse } from 'next/server';
import { genApiResponse } from "@/utils/gen-api-response"


const ACCESS_SECRET = process.env.ACCESS_SECRET


export async function POST(req: NextRequest) {
  try {
    const body: FollowingCredentials = await req.json();
    const { followId } = body;
    const user = checkTokenIsValid(req, "access-token", ACCESS_SECRET!)

    if (!user) return genApiResponse({
      code: "AUTH_FAILED",
      message: 'Unauthenticated or session expired, please login or refresh.',
      status: 401,
    })
    if (user.id === 'sworup' && followId === '1234') {
      return genApiResponse({
        code: "FOLLOWED",
        message: 'Successfully followed',
        status: 200,
      })
    }
    else {
      return genApiResponse({
        code: "CONFLICT",
        message: 'Invalid follower or following id.',
        status: 422,
      })
    }
  } catch (error) {
    return genApiResponse({
      code: "FOLLOW_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const body: FollowingCredentials = await req.json();
    const { followId } = body;
    const user = checkTokenIsValid(req, "access-token", ACCESS_SECRET!)
    if (!user) return genApiResponse({
      code: "AUTH_FAILED",
      message: 'Unauthenticated or session expired, please login or refresh.',
      status: 401,
    })
    if (user.id === 'sworup' && followId === '1234') {
      return genApiResponse({
        code: "UNFOLLOWED",
        message: 'Successfully Unfollowed',
        status: 200,
      })
    }
    else {
      return genApiResponse({
        code: "CONFLICT",
        message: 'Invalid follower or following id.',
        status: 422,
      })
    }
  } catch (error) {
    return genApiResponse({
      code: "UNFOLLOW_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}

