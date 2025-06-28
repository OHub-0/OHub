import { genApiResponse } from "@/utils/gen-api-response"

import { NextResponse } from "next/server"

const formFilters = {
  types: [
    "Admission",
    "Scholarship",
    "Entrance Exam",
  ],
  deadlines: [
    "Upcoming",
    "This Week",
    "This Month",
    "Extended",
  ],
  sortBy: [
    "Deadline",
    "Form Name",
    "Application Fee",
  ],
}

export async function GET() {
  try {
    return genApiResponse({
      code: "FETCHED",
      message: `Successfully fetch the form filters.`,
      data: formFilters,
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
