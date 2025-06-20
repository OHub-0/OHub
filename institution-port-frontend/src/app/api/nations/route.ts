import { countries } from "@/data/countries"
import { NextRequest, NextResponse } from "next/server"



export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const includeCode = searchParams.get("code") === "true"
  const includeFlag = searchParams.get("flag") === "true"

  const filteredCountries = countries.map((country) => {
    const result: any = { name: country.name }
    if (includeCode) result.code = country.code
    if (includeFlag) result.flag = country.flag
    return result
  })

  return NextResponse.json(filteredCountries)
}