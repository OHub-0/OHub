import { countries } from "@/data/countries"
import { NextRequest, NextResponse } from "next/server"



export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  // console.log(searchParams)
  const includeCode = searchParams.get("code") === "true"
  const includeFlag = searchParams.get("flag") === "true"

  if (includeCode && includeFlag) return NextResponse.json(countries)

  const filteredCountries = countries.map((country) => {
    const result: any = { name: country.name }
    if (includeCode) result.code = country.code
    if (includeFlag) result.flag = country.flag
    return result
  })
  //return just a single object if its just countries name
  if (!includeCode && !includeFlag) return NextResponse.json(filteredCountries.map(i => i.name))
  return NextResponse.json(filteredCountries)
}