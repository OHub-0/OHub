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
  return NextResponse.json(institutionFilters)
}
