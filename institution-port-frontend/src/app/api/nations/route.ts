import { countries } from "@/data/countries"
import { genApiResponse } from "@/utils/gen-api-response"
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from "@/utils/types"
import { NextRequest, NextResponse } from "next/server"



export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    // console.log(searchParams)
    const includeCode = searchParams.get("code") === "true"
    const includeFlag = searchParams.get("flag") === "true"

    if (includeCode && includeFlag) return genApiResponse({
      code: "FETCHED",
      message: "Nations Data Fetched Successfully.",
      data: { nations: countries },
      status: 200,
    })

    const filteredCountries = countries.map((country) => {
      const result: Record<any, any> = { name: country.name }
      if (includeCode) result.code = country.code
      if (includeFlag) result.flag = country.flag
      return result
    })
    //return just a single object if its just countries name
    if (!includeCode && !includeFlag) return genApiResponse({
      code: "FETCHED",
      message: "Nations Data Fetched Successfully.",
      data: { nations: filteredCountries.map(i => i.name) },
      status: 200,
    })
    return genApiResponse({
      code: "FETCHED",
      message: "Nations Data Fetched Successfully.",
      data: { nations: filteredCountries },
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }

}