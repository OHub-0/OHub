import { JWTPayload } from "jose"
import { UUIDTypes } from "uuid"


export type ERROR_RESPONSE = {
  code: string
  message: string
  metaData: null | Record<any, any>
}
export type SUCCESS_RESPONSE = ERROR_RESPONSE & { data: null | Record<any, any> }

export type ERROR_API_RESPONSE = {
  success: null
  error: ERROR_RESPONSE
}
export type SUCCESS_API_RESPONSE = {
  success: SUCCESS_RESPONSE
  error: null
}

export type SessionTokenPayload = {
  user: string
  id: UUIDTypes
} & JWTPayload

export type OtpTokenPayload = {
  id: UUIDTypes
  type: 'password' | 'email' | 'mobile'
  value: string
  // jti: UUIDTypes
} & JWTPayload


export interface SelfThrownError {
  name: 'SelfThrownError'
  message: string
  code: string
  metaData: Record<string, any> | null
  status: number
}



export type FullNationApiResponse = {
  name: string,
  code: string,
  flag: string,
}
