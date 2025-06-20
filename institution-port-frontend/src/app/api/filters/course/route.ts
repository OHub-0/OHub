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
  return NextResponse.json(courseFilters)
}
