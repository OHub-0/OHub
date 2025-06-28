import { SignUpCredentials } from "@/lib/queries/use-signup";
import { genToken } from "@/utils/authtoken";
import { genApiResponse } from "@/utils/gen-api-response"
import { v4 as _uuidv4 } from "uuid";


const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET
export async function POST(req: Request) {
  try {
    const credentials: SignUpCredentials = await req.json();

    // signup db work here (replace with DB entry)
    //generate the user's unique immutable id
    const uuid = _uuidv4();
    const accessCookie = genToken({ user: credentials.username, id: uuid }, "access-token", 18000, ACCESS_SECRET!);
    const refreshCookie = genToken({ user: credentials.username, id: uuid }, "refresh-token", 1209600, REFRESH_SECRET!);

    const res = genApiResponse({
      code: "SIGNED_IN",
      message: "Signed in successfully",
      status: 200,
    })
    res.headers.append("Set-Cookie", accessCookie);
    res.headers.append("Set-Cookie", refreshCookie);


    return res;
  } catch (err) {
    return genApiResponse({
      code: "SIGNUP_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}
