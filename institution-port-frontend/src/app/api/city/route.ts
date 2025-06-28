import { countries } from "@/data/countries"
import { genApiResponse } from "@/utils/gen-api-response"
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from "@/utils/types"
import { NextRequest, NextResponse } from "next/server"



export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    // console.log(searchParams)
    const nation = searchParams.get("nation")
    if (!nation) return genApiResponse({
      code: "FETCH_FAILED",
      message: "Parameters were not specified correctly.",
      status: 400,
    })
    const cityDataResponse = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: nation
      }),
    })//returns: {error:true/false, data?:[cities], msg:"message"}
    const cityData = await cityDataResponse.json()
    if (cityData.error) throw new Error();
    return genApiResponse({
      code: "FETCHED",
      message: "Cities data fetched successfully.",
      data: { cities: cityData.data },
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Sorry, something went wrong in the server.",
      status: 500,
    })
  }

}