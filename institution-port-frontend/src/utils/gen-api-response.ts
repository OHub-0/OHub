import { NextResponse } from "next/server"
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from "./types"

//api response handler functions
export function genApiResponse(
  { code, message, data, metaData, status }: {
    code: string,
    message: string,
    data?: Record<any, any>,
    metaData?: Record<any, any>,
    status: 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500
  }): NextResponse {
  if (status == 200 || status == 201) return NextResponse.json({
    success: {
      code: code,
      message: message,
      data: data ?? null,
      metaData: metaData ?? null,
    },
    error: null
  } as SUCCESS_API_RESPONSE, { status: status })
  //error
  return NextResponse.json({
    success: null,
    error: {
      code: code,
      message: message,
      metaData: metaData ?? null
    }
  } as ERROR_API_RESPONSE, { status: status })
}