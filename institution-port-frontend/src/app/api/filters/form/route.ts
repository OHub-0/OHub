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
  return NextResponse.json(formFilters)
}
