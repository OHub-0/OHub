import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest, NextResponse } from "next/server"

// Mock login requests data
const mockLoginRequests = [
  {
    id: "1",
    deviceName: "MacBook Pro",
    deviceType: "desktop",
    browser: "Chrome 120",
    os: "macOS 14.2",
    location: "New York, US",
    ipAddress: "192.168.1.100",
    requestedAt: "2024-01-15T10:30:00Z",
    status: "approved",
    isCurrentDevice: true,
  },
  {
    id: "2",
    deviceName: "iPhone 15",
    deviceType: "mobile",
    browser: "Safari Mobile",
    os: "iOS 17.2",
    location: "New York, US",
    ipAddress: "192.168.1.101",
    requestedAt: "2024-01-14T15:45:00Z",
    status: "approved",
    isCurrentDevice: false,
  },
  {
    id: "3",
    deviceName: "Unknown Device",
    deviceType: "desktop",
    browser: "Firefox 121",
    os: "Windows 11",
    location: "Los Angeles, US",
    ipAddress: "203.0.113.45",
    requestedAt: "2024-01-13T08:20:00Z",
    status: "pending",
    isCurrentDevice: false,
  },
  {
    id: "4",
    deviceName: "Suspicious Device",
    deviceType: "mobile",
    browser: "Chrome Mobile",
    os: "Android 14",
    location: "Unknown Location",
    ipAddress: "198.51.100.23",
    requestedAt: "2024-01-12T22:15:00Z",
    status: "denied",
    isCurrentDevice: false,
  },
]

const ACCESS_SECRET = process.env.ACCESS_SECRET

export async function GET(request: NextRequest) {
  try {
    //make middleware do this stuff:
    const user = checkTokenIsValid(request, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }

    // In a real app, fetch login requests from database
    // const requests = await getLoginRequestsForUser(userId)
    return genApiResponse({
      code: "FETCHED",
      message: "Sessions data fetched succesfully.",
      data: mockLoginRequests,
      status: 200,
    })
  } catch (error) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = checkTokenIsValid(request, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }
    const { requestId, action } = await request.json()


    // In a real app, update the login request status in database
    // switch (action) {
    //   case 'approve':
    //     await approveLoginRequest(requestId)
    //     break
    //   case 'deny':
    //     await denyLoginRequest(requestId)
    //     break
    //   case 'delete':
    //     await deleteLoginRequest(requestId)
    //     break
    // }
    return genApiResponse({
      code: "UPDATED",
      message: `Session request ${action}d successfully`,
      status: 200,
    })
  } catch (error) {
    return genApiResponse({
      code: "UPDATE_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}
