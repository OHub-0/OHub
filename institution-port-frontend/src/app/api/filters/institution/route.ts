import { genApiResponse } from "@/utils/gen-api-response"

import { NextResponse } from "next/server"

const institutionFilters = {
  types: [
    "University",
    "College",
    "Institute",
    "School",
  ],
  sortBy: [
    "Name",
    "Established Date",
    "Popularity",
    "Rating"
  ],
}

export async function GET() {
  try {
    return genApiResponse({
      code: "FETCHED",
      message: `Successfully fetch the institution filters.`,
      data: institutionFilters,
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
