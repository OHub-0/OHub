import { genApiResponse } from "@/utils/gen-api-response"

import { NextResponse } from "next/server"

const courseFilters = {
  durations: [
    "6 Month",
    "1 Year",
    "2 Year",
    "3 Year",
    "4 Year",
    "5 Year",
  ],
  programs: [
    "Business",
    "Medicine",
    "Law",
    "Arts",
    "Science",
    "Computer Science",
    "Management",
  ],
  sortBy: [
    "Course Name",
    "Duration",
    "Fee",
    "Popularity",
    "Rating"
  ],
}

export async function GET() {
  try {
    return genApiResponse({
      code: "FETCHED",
      message: `Successfully fetch the course filters.`,
      data: courseFilters,
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Sorry, faild to fetch the data. Server Error.",
      status: 500,
    })
  }
}
