//here we will check for user token and then if its verified then GET request wil give them all profile data,
// and PATCH will let them patch datas except contact
//data format:
import { UpdataUserPrivateData } from "@/lib/queries/use-settings"
import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest } from "next/server"

// Mock complete user data - replace with actual database queries
const mockUserData = {
  basicInfo: {
    firstName: "John",
    middleName: "Michael",
    lastName: "Doe",
    username: "johndoe",
    avatarUrl: "/placeholder.svg?height=128&width=128",
    dateOfBirth: "1990-01-15",
    city: "New York",
    country: "US",
  },
  contacts: {
    emails: [
      { value: "john@example.com", verified: true },
      { value: "john.doe@work.com", verified: false },
    ],
    mobile: "+1234567890"
  },
  education: {
    level: "university",
    institution: "MIT",
    fieldOfStudy: "Computer Science",
    graduationYear: "2012",
    degree: "Bachelor's",
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowSearchEngines: true,
    dataCollection: false,
    marketingEmails: false,
    securityNotifications: true,
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-01T00:00:00Z",
    activeSessions: 3,
  },
  activity: [
    {
      id: "1",
      type: "profile_update",
      description: "Updated profile information",
      timestamp: "2024-01-15T10:30:00Z",
      metadata: { fields: ["firstName", "lastName"] },
    },
    {
      id: "2",
      type: "email_change",
      description: "Added new email address",
      timestamp: "2024-01-13T09:20:00Z",
      metadata: { email: "new.email@example.com" },
    },
  ],
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as const
export type UserPrivateData = typeof mockUserData;


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
    return genApiResponse({
      code: "FETCHED",
      message: "Successfully fetched user's private data.",
      data: mockUserData,
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Successfully fetched user's private data.",
      status: 500,
    })

  }
}

//query the data here
//send it back
export async function PATCH(request: NextRequest) {
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
    //the data to change
    //THE SCHEMA FOR PATCHING REQUEST IS THIS:
    const data: UpdataUserPrivateData = await request.json()
    //SO CHANGE EVERYTHING THAT USER HAS SENT BASICALLY,
    //THEN




    // Mock uniqueness check - simulate some usernames as taken
    // const takenUsernames = ["admin", "test", "user", "janedoe"]
    // if (takenUsernames.includes(data.username))
    //   return genApiResponse({
    //     code: "CONFLICT",
    //     message: "Username is already taken.",
    //     metaData: {
    //       field: "username",
    //       suggestion: "Try adding a number or underscore.",
    //       availableAlternatives: ["john_doe123", "john_doe2025"]
    //     },
    //     status: 409
    //   })


    //NOTE: UNIQUESNESS for username WILL BE CHECKED BY ANOTHER API TOO BUT SHOULD STILL BE CHECKED HERE.
    //NOTE: THIS API WILL NOT LET YOU CHANGE YOUR CONTACTS AND PASSWORD(SECURED DATA) ONLY OTHER THINGS LIKE PERSONAL DATA AND OTHER INFO
    //CHANGE THE PERSONAL DATA
    //basically:
    // Validates the JWT access token
    // Optionally checks for data correctness(username, and so on)
    // Updates fields in the DB
    // Returns a success response, not the updated data, we will query again for that even thogh its ineffective


    return genApiResponse({
      code: "UPDATED",
      message: "Personal information updated successfully",
      metaData: { updatedAt: new Date().toISOString() },
      status: 200
    })
  } catch (err) {
    return genApiResponse({
      code: "UPDATE_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500
    })
  }
}
