import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest } from "next/server"

// Mock public user data - replace with actual database queries
const mockPublicUserData = {
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  avatarUrl: "/placeholder.svg?height=128&width=128",
  city: "New York",
  country: "US",
  joinedAt: "2023-01-01T00:00:00Z",
}

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {


    const { username } = params
    if (!username) {
      return genApiResponse({
        code: "NO_PARAMS",
        message: "Please provide a username after /user/[username] to find the user.",
        status: 404,
      })
    }


    // In a real app, fetch public user data from database
    // const user = await getPublicUserByUsername(username)


    return genApiResponse({
      code: "FETCHED",
      message: "User's public information fetched successfully.",
      data: mockPublicUserData,
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Sorry, faild to send the user's public data. Server Error.",
      status: 500,
    })

  }


}
