import { z } from "zod"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import { countrySchema, mobileSchema, officialNameSchema, passwordSchema, usernameSchema } from "./common-validation"


export const signUpSchema = z
  .object({
    officialName: officialNameSchema,
    username: usernameSchema,
    country: countrySchema,
    mobile: mobileSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })



export const usernameLoginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema
})

export const mobileLoginSchema = z
  .object({
    mobile: mobileSchema,
    password: passwordSchema
  })

export type SignUpForm = z.infer<typeof signUpSchema>
export type UsernameLoginForm = z.infer<typeof usernameLoginSchema>
export type MobileLoginForm = z.infer<typeof mobileLoginSchema>