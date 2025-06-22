import { FollowingCredentials } from '@/lib/queries/follow';
import { checkUserIsValid } from '@/utils/authtoken';
import { NextRequest, NextResponse } from 'next/server';
import { Payload } from '../me/route';
import { JwtPayload } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body: FollowingCredentials = await req.json();
    const { followId } = body;
    const user = checkUserIsValid(req) as null | JwtPayload | Payload
    if (!user) return NextResponse.json({ message: 'Unauthenticated/Session Expired.\nPlease Login/Refresh. ' }, { status: 401 });
    if (user.id === 'sworup' && followId === '1234') {
      return NextResponse.json({ message: 'Successfully Followed' }, { status: 200 });
    }
    else {
      return NextResponse.json({ message: 'Invalid Follower/Following' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Something Went Wrong' }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const body: FollowingCredentials = await req.json();
    const { followId } = body;
    const user = checkUserIsValid(req) as null | JwtPayload | Payload
    if (!user) return NextResponse.json({ message: 'Unauthenticated/Session Expired.\nPlease Login/Refresh.' }, { status: 401 });
    if (user.id === 'sworup' && followId === '1234') {
      return NextResponse.json({ message: 'Successfully Unfollowed' }, { status: 200 });
    }
    else {
      return NextResponse.json({ message: 'Invalid Follower/Following' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Something Went Wrong' }, { status: 500 });
  }
}

