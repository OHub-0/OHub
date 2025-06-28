import { genToken } from "@/utils/authtoken";
import { genApiResponse } from "@/utils/gen-api-response"

import { v4 as _uuidv4 } from 'uuid'

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET
export async function POST(req: Request) {
  try {
    const { id, password, type } = await req.json();
    // Basic dummy check (replace with DB validation)
    const validUsername = type === "username" && id === "sworup";
    const validMobile = type === "mobile" && id === "+9779842467080";
    //check for the salted password in the db for js: const isMatch = await bcrypt.compare("inputPassword", storedHashedPassword);
    const validPassword = password === "Sworup!@#1";

    if (!(validPassword && (validUsername || validMobile))) {
      return genApiResponse({
        code: "LOGIN_FAILED",
        message: "Invalid credentials",
        status: 401,
      })
    }
    //get the username of the user from db and id=username then do this:
    const username = id;
    //get the user's unique immutable id
    const uuid = _uuidv4();
    const accessCookie = genToken({ user: username, id: uuid }, "access-token", 18000, ACCESS_SECRET!);
    const refreshCookie = genToken({ user: username, id: uuid }, "refresh-token", 1209600, REFRESH_SECRET!);
    const res = genApiResponse({
      code: "LOGGED_IN",
      message: "Logged in successfully",
      status: 200,
    })
    res.headers.append("Set-Cookie", accessCookie);
    res.headers.append("Set-Cookie", refreshCookie);
    return res;
  } catch (err) {
    return genApiResponse({
      code: "LOGIN_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}
